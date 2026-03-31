export enum sizesEnum {
  small = "SMALL",
  medium = "MEDIUM",
  big = "BIG",
}

export const small = {
  btn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 10,
    fontWeight: 800 as const,
  },
};

export const medium = {
  btn: {
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  text: {
    fontSize: 14,
    fontWeight: 800 as const,
  },
};

export const big = {
  btn: {
    paddingVertical: 16,
    paddingHorizontal: 36,
  },
  text: {
    fontSize: 16,
    fontWeight: 800 as const,
  },
};
