import {
  assertThrowsAsync,
} from "https://deno.land/std/testing/asserts.ts";
import {
  runPagespeed,
} from "./mod.ts";

Deno.test("should throw an error if url is empty", async () => {
  const url = "";
  const ops = {
    strategy: "mobile",
  };
  await assertThrowsAsync(
    async () => {
      await runPagespeed(url, ops);
    },
    Error,
    "Please enter a URL",
  );
});

Deno.test("should throw an error if url is not valid", async () => {
  const url = "://developers.google.com";
  const ops = {
    strategy: "mobile",
  };
  await assertThrowsAsync(
    async () => {
      await runPagespeed(url, ops);
    },
    Error,
    "Please enter a valid URL",
  );
});
