/** Triggers a short haptic vibration on supported devices. */
export function vibrate(ms = 20): void {
  navigator?.vibrate?.(ms);
}
