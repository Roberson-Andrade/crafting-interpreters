import { Lox } from "./lox";

const lox = new Lox();

if (Bun.argv.length > 2) {
  console.log("Usage: jlox [script]")
  process.exit(64);
} else if (Bun.argv.length === 2) {
  lox.runFile(Bun.argv[1]!)
} else {
  lox.runPrompt();
}
