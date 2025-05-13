import { Path } from "../models/path.model";

export const getActualQuartile = (): string => {
  const month = new Date().getMonth();
  const year = new Date().getFullYear();

  return year + " - Q" + (Math.floor(month / 4) + 1).toString();
};

export const parsePath = (p: Path): Path => {
  return {
    ...p,
    quartileString: p.quartile?.year + " - " + p.quartile?.quartile,
  };
};
