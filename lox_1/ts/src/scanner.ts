import { Lox } from "./lox";
import { Token } from "./token";
import { TokenType } from "./token-type";

export class Scanner {
  private tokens: Token[] = [];

  private start: number = 0;
  private current: number = 0;
  private line: number = 1;

  constructor(private source: string) { }

  scanTokens(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(new Token(TokenType.EOF, "", null, this.line));

    return this.tokens;
  }

  private scanToken() {
    const c = this.advance();

    switch (c) {
      case '(': this.addToken(TokenType.LEFT_PAREN); break;
      case ')': this.addToken(TokenType.RIGHT_PAREN); break;
      case '{': this.addToken(TokenType.LEFT_BRACE); break;
      case '}': this.addToken(TokenType.RIGHT_PAREN); break;
      case ',': this.addToken(TokenType.COMMA); break;
      case '.': this.addToken(TokenType.DOT); break;
      case '-': this.addToken(TokenType.MINUS); break;
      case '+': this.addToken(TokenType.PLUS); break;
      case ';': this.addToken(TokenType.SEMICOLON); break;
      case '*': this.addToken(TokenType.STAR); break;
      case '!':
        this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
        break;
      case '=':
        this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
        break;
      case '<':
        this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      case '>':
        this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
        break;
      case '/':
        if (this.match('/')) {
          // A comment goes until the end of the line.
          while (this.peek() != '\n' && !this.isAtEnd()) this.advance();
        } else {
          this.addToken(TokenType.SLASH);
        }
        break;
      case ' ':
      case '\t':
      case '\r':
        // ignore whitespace
        break;

      case '\n':
        this.line++;
        break;

      case '"':
        this.string();
        break;

      default:
        Lox.error(this.line, "Unexpected character.");
        break;
    }
  }

  private addToken(type: TokenType, literal?: unknown) {
    const lexeme = this.source.substring(this.start, this.current);

    this.tokens.push(new Token(type, lexeme, literal ?? null, this.line));
  }

  private string() {
    while (this.peek() != '"' && !this.isAtEnd()) {
      if (this.peek() === '\n') this.line++;

      this.advance();
    }

    if (this.isAtEnd()) {
      Lox.error(this.line, 'Unterminated string.');
    }

    this.advance();

    const value = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING, value);
  }

  private isAtEnd() {
    return this.current >= this.source.length;
  }

  private advance() {
    return this.source.charAt(this.current++);
  }

  private match(expected: string) {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) !== expected) return false;

    this.current++;
    return true;
  }

  private peek() {
    if (this.isAtEnd()) return '\0';

    return this.source.charAt(this.current);
  }

}
