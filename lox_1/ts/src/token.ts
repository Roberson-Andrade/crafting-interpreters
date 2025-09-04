import type { TokenType } from "./token-type";

export class Token {
  constructor(private type: TokenType, private lexeme: string, private literal: unknown | null, private line: number) { }

  toString() {
    return `${this.type} ${this.lexeme} ${this.literal}`
  }
}
