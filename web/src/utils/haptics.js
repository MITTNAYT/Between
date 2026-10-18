/**
 * Tactile Haptic Feedback Utility using Web Vibration API
 * Safely degrades on unsupported devices/browsers (e.g. iOS Safari)
 */

export function triggerHaptic(type = 'light') {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
  if (!('vibrate' in navigator) || typeof navigator.vibrate !== 'function') return;

  try {
    switch (type) {
      case 'light':
      case 'tap':
        navigator.vibrate(15);
        break;
      case 'pop':
        navigator.vibrate(20);
        break;
      case 'medium':
        navigator.vibrate(35);
        break;
      case 'heavy':
        navigator.vibrate(55);
        break;
      case 'heartbeat':
        // Double pulse mimicking a real heartbeat: lub-dub
        navigator.vibrate([60, 100, 70]);
        break;
      case 'success':
        navigator.vibrate([25, 45, 35]);
        break;
      case 'warning':
        navigator.vibrate([40, 60, 40]);
        break;
      case 'cancel':
        navigator.vibrate(0);
        break;
      default:
        if (Array.isArray(type) || typeof type === 'number') {
          navigator.vibrate(type);
        } else {
          navigator.vibrate(15);
        }
    }
  } catch (e) {
    // Non-blocking fallback
  }
}

export function stopHaptic() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
  if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(0);
    } catch (e) {}
  }
}
