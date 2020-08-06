export const formatToNumber = (str: string): number =>
  Number(str.split(/\s+/)[0]);

export const mean = (numbers: number[]): number =>
  Math.round(
    (numbers.reduce((accumulator, currentValue) => accumulator + currentValue) *
      10) / numbers.length,
  ) / 10;

export const mode = (lists: string[]): string => {
  const dataMap: { [key: string]: number } = {};
  for (let i = 0; i < lists.length; i++) {
    const key = lists[i];
    if (typeof dataMap[key] === "undefined") dataMap[key] = 0;
    dataMap[key]++;
  }
  return Object.keys(dataMap).filter((key) =>
    dataMap[key] === Math.max(...Object.values(dataMap))
  ).join(", ");
};

export const isUrlValid = (str: string): boolean => {
  const regex =
    "^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$";
  const url = new RegExp(regex, "i");
  return url.test(str);
};

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
