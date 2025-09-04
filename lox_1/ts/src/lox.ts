import { Scanner } from "./scanner";

export class Lox {
  static hadError = false;

  private run(source: string) {
    const scanner = new Scanner(source);

    const tokens = scanner.scanTokens();

    for (const token of tokens) {
      console.log(token);
    }
  }

  async runPrompt() {
    const prompt = "> ";
    process.stdout.write(prompt);

    for await (const line of console) {
      if (!line) break;

      this.run(line);
      Lox.hadError = false;
      process.stdout.write(prompt);
    }
  }

  async runFile(path: string) {
    const file = Bun.file(path);

    this.run(await file.text());

    if (Lox.hadError) {
      process.exit(65);
    }
  }

  static error(line: number, message: string) {
    Lox.report(line, "", message);
  }

  static report(line: number, where: string, message: string) {
    console.log(`[line ${line}] Error: ${where}: ${message}`);
    Lox.hadError = true;
  }
}
