import type { ProductDeckItem } from "@/components/concept-v3-rebuild/product-deck/types";
import type { ProductArtifact } from "@/lib/proof-engine/types";

const visualMap = {
  "map-phone": "city-guide",
  "vending-machine": "vending",
  "message-signal": "messaging",
} as const;

export function toProductDeckItems(
  products: ProductArtifact[],
): ProductDeckItem[] {
  return products.map((product) => ({
    id: product.id,
    title: product.title,
    subtitle: product.domain,
    description:
      product.visualKind === "map-phone"
        ? "City navigation with mapped places and a guided mobile experience."
        : product.visualKind === "vending-machine"
          ? "Physical dispensing systems with scan, status, and release control."
          : "Commerce messaging routes with delivery confirmation signals.",
    accent:
      product.accent === "violet"
        ? "#6b8fff"
        : product.accent === "amber"
          ? "#f2b84f"
          : "#31e6d0",
    logo: product.asset?.src ?? null,
    visualType: visualMap[product.visualKind],
    status:
      product.visualKind === "vending-machine"
        ? "Ready"
        : product.visualKind === "message-signal"
          ? "Delivered"
          : "Live map",
  }));
}
