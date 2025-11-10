import type { Interpreter } from "../interpreter";
import { LoxCallable } from "../lox-callable";

export class Clock extends LoxCallable {
  override arity: number = 0;

  override call() {
    return Date.now() / 1000;
  }

  [Symbol.toPrimitive]() {
    return `<native function>`;
  }
}
