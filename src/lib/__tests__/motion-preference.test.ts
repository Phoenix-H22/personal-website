import vm from "node:vm";

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getMotionBootstrapScript,
  LEGACY_MOTION_PREFERENCE_KEYS,
  MOTION_PREFERENCE_KEY,
  readStoredMotionPreference,
} from "@/lib/motion-preference";

function createMemoryStorage(seed: Record<string, string> = {}): Storage {
  const entries = new Map(Object.entries(seed));
  return {
    get length() {
      return entries.size;
    },
    clear: () => entries.clear(),
    getItem: (key) => entries.get(key) ?? null,
    key: (index) => Array.from(entries.keys())[index] ?? null,
    removeItem: (key) => {
      entries.delete(key);
    },
    setItem: (key, value) => {
      entries.set(key, value);
    },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("motion preference persistence", () => {
  it("discards the hidden v3 reduced override from earlier portfolio builds", () => {
    const legacyKey = LEGACY_MOTION_PREFERENCE_KEYS[0];
    const storage = createMemoryStorage({ [legacyKey]: "reduced" });
    vi.stubGlobal("window", { localStorage: storage });

    expect(readStoredMotionPreference()).toBeNull();
    expect(storage.getItem(legacyKey)).toBeNull();
  });

  it("keeps a current explicit motion preference", () => {
    const storage = createMemoryStorage({ [MOTION_PREFERENCE_KEY]: "reduced" });
    vi.stubGlobal("window", { localStorage: storage });

    expect(readStoredMotionPreference()).toBe("reduced");
  });

  it("keeps full motion when browser storage is unavailable", () => {
    const attributes = new Map<string, string>();
    const documentElement = {
      removeAttribute: (name: string) => attributes.delete(name),
      setAttribute: (name: string, value: string) => attributes.set(name, value),
    };

    vm.runInNewContext(getMotionBootstrapScript(), {
      document: { documentElement },
      localStorage: {
        removeItem: () => {
          throw new Error("Storage blocked");
        },
      },
      location: { search: "" },
      URLSearchParams,
      window: { matchMedia: () => ({ matches: true }) },
    });

    expect(attributes.get("data-effective-motion")).toBe("full");
  });
});
