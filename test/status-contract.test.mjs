import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const source = await readFile(
  fileURLToPath(new URL("../extensions/index.ts", import.meta.url)),
  "utf8",
);

test("bookmark status does not reposition the terminal cursor", () => {
  assert.doesNotMatch(source, /\\u001b\[999C|ESC\[999C/u);
  assert.match(
    source,
    /setStatus\(STATUS_ID,\s*ctx\.ui\.theme\.fg\("accent",\s*"◢"\)\)/u,
  );
  assert.match(source, /setStatus\(STATUS_ID, undefined\)/u);
});

test("bookmark commands and store integration remain registered", () => {
  for (const command of ["pin", "unpin", "bookmarks"]) {
    assert.match(source, new RegExp(`registerCommand\\("${command}"`));
  }

  assert.match(source, /BookmarkStore\.default\(\)/u);
  assert.match(source, /store\.upsert\(/u);
  assert.match(source, /store\.remove\(/u);
});
