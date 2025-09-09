import { Binary } from "./expr";
import { Token } from "./token";
import { TokenType } from "./token-type";

export class Parser {
  private current = 0;

  constructor(private tokens: Token[]) { }

  private expression() {
    return this.equality();
  }

  private equality() {
    let expr = this.comparison();

    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      const operator = this.previous();
      const right = this.comparison();

      expr = new Binary(expr, operator.lexeme, right);
    }

    return expr;
  }

  private match(...types: TokenType[]) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();

        return true
      }
    }

    return false;
  }

  private check(type: TokenType) {
    if (this.isAtEnd()) return false;

    return this.peek()?.type === type;
  }

  private advance() {
    if (!this.isAtEnd()) this.current++;

    return this.previous;
  }

  private isAtEnd() {
    return this.peek()?.type === TokenType.EOF;
  }

  private peek() {
    return this.tokens[this.current];
  }

  private previous() {
    return this.tokens[this.current - 1];
  }
}
