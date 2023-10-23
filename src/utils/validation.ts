const resetMask = (value: string) => value.replace(/\D/g, "");

export const validatePhone = (value: string): string => {
  const getValue = () => {
    if (value === "") return "+7-(___)-___-__-__";
    const arr = value.split("-");
    if (arr.length !== 5) {
      if (value[8] !== "-") {
        return value.substring(-1, 6);
      }
      if (value[12] !== "-") {
        return value.substring(-1, 11);
      }
      if (value[15] !== "-") {
        return value.substring(-1, 14);
      }
    }
    if (arr[1].length === 6) {
      const result = arr[1].replace("_", "");
      return [arr[0], result, arr[2], arr[3], arr[4]].join("-");
    }
    if (arr[2].length === 4) {
      const result = arr[2].replace("_", "");
      return [arr[0], arr[1], result, arr[3], arr[4]].join("-");
    }
    if (arr[3].length === 3) {
      const result = arr[3].replace("_", "");
      return [arr[0], arr[1], arr[2], result, arr[4]].join("-");
    }
    if (arr[4].length === 3) {
      const result = arr[4].replace("_", "");
      return [arr[0], arr[1], arr[2], arr[3], result].join("-");
    }
    return value;
  };
  return resetMask(getValue());
};
