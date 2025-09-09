import { Binary, Grouping, Literal, Unary } from "./expr";
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

      expr = new Binary(expr, operator, right);
    }

    return expr;
  }


  private comparison() {
    let expr = this.term();

    while (this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
      const operator = this.previous();
      const right = this.term();

      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  private term() {
    let expr = this.factor();

    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      const operator = this.previous();
      const right = this.factor();

      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  private factor() {
    let expr = this.unary();

    while (this.match(TokenType.SLASH, TokenType.STAR)) {
      const operator = this.previous();
      const right = this.unary();

      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  private unary() {
    if (this.match(TokenType.BANG, TokenType.MINUS)) {
      const operator = this.previous();
      const right = this.unary();

      return new Unary(operator, right);
    }

    return this.primary();
  }

  private primary() {
    if (this.match(TokenType.FALSE)) return new Literal(false);
    if (this.match(TokenType.TRUE)) return new Literal(true);
    if (this.match(TokenType.NIL)) return new Literal(null);

    if (this.match(TokenType.NUMBER, TokenType.STRING)) {
      return new Literal(this.previous().literal);
    }

    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.expression();

      this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");

      return new Grouping(expr);
    }
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
    return this.tokens[this.current]!;
  }

  private previous() {
    return this.tokens[this.current - 1]!;
  }
}
