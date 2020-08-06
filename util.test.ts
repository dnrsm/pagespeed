import {
  assertEquals,
} from "https://deno.land/std/testing/asserts.ts";
import {
  formatToNumber,
  mean,
  mode,
  isUrlValid,
  sleep,
} from "./util.ts";

Deno.test("formatToNumber", () => {
  const str = "11.4 s";
  const expectedOutput = formatToNumber(str);
  assertEquals(expectedOutput, 11.4);
});

Deno.test("mean", () => {
  const numbers = [8, 10, 12];
  const expectedOutput = mean(numbers);
  assertEquals(expectedOutput, 10);
});

Deno.test("mode", () => {
  const lists = ["SLOW", "FAST", "SLOW"];
  const expectedOutput = mode(lists);
  assertEquals(expectedOutput, "SLOW");
});

Deno.test("isUrlValid", () => {
  const str = "https://developers.google.com";
  const expectedOutput = isUrlValid(str);
  assertEquals(expectedOutput, true);
});

Deno.test("sleep", async () => {
  const interval = 500;
  const expectedOutput = await sleep(interval);
  assertEquals(expectedOutput, undefined);
});
