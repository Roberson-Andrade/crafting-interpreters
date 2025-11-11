import { Environment } from "./environment";
import type { Interpreter } from "./interpreter";
import { LoxCallable } from "./lox-callable";
import type { Return } from "./return";
import type { Stmt } from "./stmt";

export class LoxFunction extends LoxCallable {
  constructor(public declaration: Stmt.Function, private closure: Environment) {
    super();
  }

  override get arity(): number {
    return this.declaration.params.length;
  }

  override call(interpreter: Interpreter, args: any[]) {
    const environment = new Environment(this.closure);

    for (let i = 0; i < this.declaration.params.length; i++) {
      environment.define(this.declaration.params[i]!.lexeme!, args[i]);
    }

    try {
      interpreter.executeBlock(this.declaration.body, environment);
    } catch (returnValue: unknown) {
      return (returnValue as Return).value;
    }

    return null;
  }

  [Symbol.toPrimitive]() {
    return `<fn ${this.declaration.name.lexeme}>`;
  }
}
