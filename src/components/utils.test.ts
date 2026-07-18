import { formatElapsed } from "./utils";

describe("formatElapsed", () => {
  test("formats zero as 00:00", () => {
    expect(formatElapsed(0)).toBe("00:00");
  });

  test("formats sub-minute durations with padded seconds", () => {
    expect(formatElapsed(5)).toBe("00:05");
    expect(formatElapsed(59)).toBe("00:59");
  });

  test("rolls over to minutes at 60 seconds", () => {
    expect(formatElapsed(60)).toBe("01:00");
    expect(formatElapsed(125)).toBe("02:05");
  });

  test("pads minutes to two digits", () => {
    expect(formatElapsed(9 * 60 + 3)).toBe("09:03");
  });

  test("supports durations of ten minutes or more", () => {
    expect(formatElapsed(12 * 60 + 34)).toBe("12:34");
  });

  test("floors fractional seconds", () => {
    expect(formatElapsed(5.9)).toBe("00:05");
    expect(formatElapsed(59.999)).toBe("00:59");
  });
});
