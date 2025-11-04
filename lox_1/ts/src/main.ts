import { Lox } from "./lox";

const args = Bun.argv.splice(2);

const lox = new Lox();

if (args.length > 1) {
  console.log("Usage: jlox [script]");
  process.exit(64);
} else if (args.length === 1) {
  lox.runFile(args[0]!);
} else {
  lox.runPrompt();
}
