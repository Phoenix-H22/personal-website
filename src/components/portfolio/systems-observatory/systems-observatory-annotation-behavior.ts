export interface ViewportPosition {
  x: number;
  y: number;
}

export function isInsideActiveAnnotation(
  path: EventTarget[],
  trigger: EventTarget | null,
  panel: EventTarget | null,
): boolean {
  return Boolean((trigger && path.includes(trigger)) || (panel && path.includes(panel)));
}

export function hasMeaningfulViewportScroll(
  openedAt: ViewportPosition,
  current: ViewportPosition,
  threshold = 8,
): boolean {
  return Math.hypot(current.x - openedAt.x, current.y - openedAt.y) >= threshold;
}
