import type { Token } from "./token";

export interface Visitor<T> {
  visitBinaryExpr(expr: Binary): T
}

abstract class Expr {
  abstract accept<T>(visitor: Visitor<T>): T;
}

export class Binary extends Expr {
  constructor(private left: Expr, operator: Token, right: Expr) {
    super();
  }

  override accept<T>(visitor: Visitor<T>): T {
    return visitor.visitBinaryExpr(this);
  }
}
