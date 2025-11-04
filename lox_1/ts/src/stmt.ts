import type { Expr } from "./expr";
import type { Token } from "./token";

export abstract class Stmt {
  abstract accept(visitor: StmtVisitor): void;
}

export interface StmtVisitor {
  visitExpressionStmt(expr: Expression): void;
  visitPrintStatement(stmt: Print): void;
  visitVarStmt(stmt: Var): void;
  visitBlockStatement(stmt: Block): void;
}

export class Expression implements Stmt {
  constructor(public expression: Expr) { }

  accept(visitor: StmtVisitor): void {
    return visitor.visitExpressionStmt(this);
  }
}

export class Print implements Stmt {
  constructor(public expression: Expr) { }

  accept(visitor: StmtVisitor): void {
    return visitor.visitPrintStatement(this);
  }
}

export class Var implements Stmt {
  constructor(public name: Token, public initializer: Expr | null) { }

  accept(visitor: StmtVisitor): void {
    return visitor.visitVarStmt(this);
  }
}

export class Block implements Stmt {
  constructor(public statements: Stmt[]) { }

  accept(visitor: StmtVisitor): void {
    return visitor.visitBlockStatement(this);
  }
}
