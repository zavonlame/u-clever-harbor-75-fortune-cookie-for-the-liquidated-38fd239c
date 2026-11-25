// Fortune Cookie for the Liquidated Trader.
//
// The cookie speaks in two halves: an oracular promise up front, then a
// twist that lands on the trader's own decision. The whole fortune is one
// line of plain text, 18 words, 90 characters — inside the gate of
// 1–160 characters and at most 20 words.
//
// This program is deterministic: it writes exactly the same bytes on every
// run, reads nothing, reaches no network, and needs only the Node 22
// standard library.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The oracle's opening: the classic fortune shape, a promise of wealth.
const ORACLE_OPENING = "You will find great wealth where you least expect it:";

// The turn: the wealth was never in the market. It was the steady job
// the trader walked away from — the loss, told warmly, not cruelly.
const HONEST_TURN = "in the job you quit to trade crypto.";

const FORTUNE = `${ORACLE_OPENING} ${HONEST_TURN}`;

// The gate the sealed scorer applies: 1–160 UTF-8 characters, not only
// white space, one line, at most 20 words. Verified on read-back:
// FORTUNE is 90 characters and 18 words, so it clears every limit with
// room to spare.
function gateOk(text: string): boolean {
  if (text.length < 1 || text.length > 160) return false;
  if (text.trim().length === 0) return false;
  if (text.includes("\n") || text.includes("\r")) return false;
  const words = text.trim().split(/\s+/).length;
  if (words < 1 || words > 20) return false;
  return true;
}

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR;
  if (!outDir) {
    throw new Error("MAKEFUN_OUTPUT_DIR is not set");
  }
  if (!gateOk(FORTUNE)) {
    throw new Error("fortune fails the 1–160 char / 20 word gate");
  }
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, FORTUNE, "utf8");
  // Read back what was written and confirm it is byte for byte the fortune.
  const written = readFileSync(target, "utf8");
  if (written !== FORTUNE) {
    throw new Error("read-back mismatch: entry.txt differs from the fortune");
  }
}

main();
