import { LoxRuntimeError } from "./runtime-error";
import type { Token } from "./token";

export class Environment {
  private values: Map<string, any> = new Map();
  private enclosing: Environment | null;

  constructor(enclosing?: Environment) {
    this.enclosing = enclosing ?? null;
  }

  public define(key: string, value: any) {
    this.values.set(key, value);
  }

  public get(name: Token): any {
    if (this.values.has(name.lexeme)) {
      return this.values.get(name.lexeme);
    }

    if (this.enclosing !== null) return this.enclosing.get(name);

    throw new LoxRuntimeError(name, `Undefined variable '${name.lexeme}'.`);
  }

  public assign(name: Token, value: any) {
    if (this.values.has(name.lexeme)) {
      this.values.set(name.lexeme, value);
      return;
    }

    if (this.enclosing !== null) {
      this.enclosing.assign(name, value);
      return;
    }

    throw new LoxRuntimeError(name, `Undefined variable '${name.lexeme}'.`);
  }
}
