const cache = {};

export function playSound(path, volume = 0.6) {
  try {
    if (!cache[path]) {
      cache[path] = new Audio(path);
    }
    const a = cache[path];
    a.volume = volume;

    // restart sound if played repeatedly
    a.currentTime = 0;
    a.play();
  } catch {
    // ignore autoplay errors
  }
}
