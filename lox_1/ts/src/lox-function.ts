import { Environment } from "./environment";
import type { Interpreter } from "./interpreter";
import { LoxCallable } from "./lox-callable";
import type { Function } from "./stmt";

export class LoxFunction extends LoxCallable {
  constructor(public declaration: Function) {
    super();
  }

  override get arity(): number {
    return this.declaration.params.length;
  }

  override call(interpreter: Interpreter, args: any[]) {
    const environment = new Environment(interpreter.globals);

    for (let i = 0; i < this.declaration.params.length; i++) {
      environment.define(this.declaration.params[i]!.lexeme!, args[i]);
    }

    interpreter.executeBlock(this.declaration.body, environment);
  }

  [Symbol.toPrimitive]() {
    return `<fn ${this.declaration.name.lexeme}>`;
  }
}
