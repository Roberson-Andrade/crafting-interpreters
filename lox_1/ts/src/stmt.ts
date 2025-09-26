import type { Expr } from "./expr";

export abstract class Stmt {
  abstract accept(visitor: StmtVisitor): void;
}

export interface StmtVisitor {
  visitExpressionStmt(expr: Expression): void;
  visitPrintStatement(stmt: Print): void;
}

export class Expression implements Stmt {
  constructor(public expression: Expr) {}

  accept(visitor: StmtVisitor): void {
    return visitor.visitExpressionStmt(this);
  }
}

export class Print implements Stmt {
  constructor(public expression: Expr) {}

  accept(visitor: StmtVisitor): void {
    return visitor.visitPrintStatement(this);
  }
}
