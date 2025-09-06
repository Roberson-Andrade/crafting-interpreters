import type { TokenType } from "./token-type";

export class Token {
  constructor(public type: TokenType, public lexeme: string, public literal: unknown | null, public line: number) { }

  toString() {
    return `${this.type} ${this.lexeme} ${this.literal}`
  }
}
