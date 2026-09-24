import assert from "node:assert/strict";
import test from "node:test";
import { normalizePackageHref } from "../lib/utils";
test("legacy package URLs stay compatible", () => { assert.equal(normalizePackageHref("/trips/goa"), "/packages/goa"); });
