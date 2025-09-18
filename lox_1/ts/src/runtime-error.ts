import type { Token } from "./token";

export class LoxRuntimeError extends Error {
  token: Token;

  constructor(token: Token, message: string) {
    super(message);

    this.token = token;
  }
}
