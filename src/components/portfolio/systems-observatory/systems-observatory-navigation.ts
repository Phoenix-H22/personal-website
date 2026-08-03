const NEXT_KEYS = new Set(["ArrowRight", "ArrowDown"]);
const PREVIOUS_KEYS = new Set(["ArrowLeft", "ArrowUp"]);

export type ObservatoryDirection = -1 | 1;
export type ObservatoryRailAlignment = "start" | "center" | "end";

export interface ObservatoryGestureSample {
  deltaX: number;
  deltaY: number;
  durationMs: number;
}

interface ObservatoryPointerStart {
  primary: boolean;
  button: number;
  interactive: boolean;
}

interface ObservatoryRailGeometry {
  viewportSize: number;
  contentSize: number;
  nodeStart: number;
  nodeSize: number;
}

const GESTURE_DISTANCE = 56;
const GESTURE_FLICK_DISTANCE = 32;
const GESTURE_FLICK_VELOCITY = 0.45;
const GESTURE_DIRECTION_DOMINANCE = 1.2;

export function getNavigationTargetIndex(
  key: string,
  currentIndex: number,
  itemCount: number,
): number | null {
  if (NEXT_KEYS.has(key)) return (currentIndex + 1) % itemCount;
  if (PREVIOUS_KEYS.has(key)) return (currentIndex - 1 + itemCount) % itemCount;
  if (key === "Home") return 0;
  if (key === "End") return itemCount - 1;
  return null;
}

export function formatObservatoryPosition(index: number, itemCount: number): string {
  const position = String(index + 1).padStart(2, "0");
  const total = String(itemCount).padStart(2, "0");
  return `${position} / ${total}`;
}

export function getObservatoryRailAlignment(
  index: number,
  itemCount: number,
): ObservatoryRailAlignment {
  if (index === 0) return "start";
  if (index === itemCount - 1) return "end";
  return "center";
}

export function getObservatoryRailScrollTarget(
  geometry: ObservatoryRailGeometry,
  alignment: ObservatoryRailAlignment,
): number {
  const { viewportSize, contentSize, nodeStart, nodeSize } = geometry;
  const maximum = Math.max(0, contentSize - viewportSize);
  const alignedTarget =
    alignment === "start"
      ? nodeStart
      : alignment === "end"
        ? nodeStart + nodeSize - viewportSize
        : nodeStart + nodeSize / 2 - viewportSize / 2;
  return Math.min(Math.max(0, alignedTarget), maximum);
}

export function alignObservatoryRailNode(
  scroller: HTMLElement,
  node: HTMLElement,
  alignment: ObservatoryRailAlignment,
  behavior: ScrollBehavior,
) {
  const scrollerRect = scroller.getBoundingClientRect();
  const nodeRect = node.getBoundingClientRect();
  const nodeStart = scroller.scrollLeft + nodeRect.left - scrollerRect.left;
  scroller.scrollTo({
    left: getObservatoryRailScrollTarget(
      {
        viewportSize: scroller.clientWidth,
        contentSize: scroller.scrollWidth,
        nodeStart,
        nodeSize: nodeRect.width,
      },
      alignment,
    ),
    behavior,
  });
}

export function getProjectTransitionDirection(
  currentIndex: number,
  nextIndex: number,
  itemCount: number,
): ObservatoryDirection {
  const forwardDistance = (nextIndex - currentIndex + itemCount) % itemCount;
  const reverseDistance = (currentIndex - nextIndex + itemCount) % itemCount;
  return forwardDistance <= reverseDistance ? 1 : -1;
}

export function resolveObservatoryGestureDirection({
  deltaX,
  deltaY,
  durationMs,
}: ObservatoryGestureSample): ObservatoryDirection | null {
  const horizontalDistance = Math.abs(deltaX);
  if (horizontalDistance <= Math.abs(deltaY) * GESTURE_DIRECTION_DOMINANCE) {
    return null;
  }
  const velocity = horizontalDistance / Math.max(durationMs, 1);
  const reachesDistance = horizontalDistance >= GESTURE_DISTANCE;
  const reachesFlick =
    horizontalDistance >= GESTURE_FLICK_DISTANCE && velocity >= GESTURE_FLICK_VELOCITY;
  if (!reachesDistance && !reachesFlick) return null;
  return deltaX < 0 ? 1 : -1;
}

export function shouldStartObservatoryGesture({
  primary,
  button,
  interactive,
}: ObservatoryPointerStart): boolean {
  return primary && button === 0 && !interactive;
}
