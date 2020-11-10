const easeOutExpo = (x: number): number => {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
};

const easeOutQuint = (x: number): number => {
  return 1 - Math.pow(1 - x, 5);
}

const easeOutQuart = (x: number): number => {
  return 1 - Math.pow(1 - x, 4);
}

const easeOutCubic = (x: number): number => {
  return 1 - Math.pow(1 - x, 3);
}

export {
  easeOutExpo,
  easeOutCubic,
  easeOutQuart,
  easeOutQuint
}