import { AstPrinter } from "./ast-printer";
import { Parser } from "./parser";
import { Scanner } from "./scanner";
import { Token } from "./token";
import { TokenType } from "./token-type";

export class Lox {
  static hadError = false;

  private run(source: string) {
    const scanner = new Scanner(source);

    const tokens = scanner.scanTokens();

    const parser = new Parser(tokens);

    const expression = parser.parse();

    if (Lox.hadError || !expression) return;


    new AstPrinter().print(expression)
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

  static error(line: number, message: string, token?: Token) {
    if (token) {
      if (token.type == TokenType.EOF) {
        this.report(token.line, " at end", message);
      } else {
        this.report(token.line, " at '" + token.lexeme + "'", message);
      }
      return
    }

    Lox.report(line, "", message);
  }

  static report(line: number, where: string, message: string) {
    console.log(`[line ${line}] Error: ${where}: ${message}`);
    Lox.hadError = true;
  }
}
