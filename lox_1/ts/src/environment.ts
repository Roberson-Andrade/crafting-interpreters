import { LoxRuntimeError } from "./runtime-error";
import type { Token } from "./token";

export class Environment {
  private values: Map<string, any> = new Map();

  public define(key: string, value: any) {
    this.values.set(key, value);
  }

  public get(name: Token) {
    if (this.values.has(name.lexeme)) {
      return this.values.get(name.lexeme);
    }

    throw new LoxRuntimeError(name, `Undefined variable '${name.lexeme}'.`);
  }
}
