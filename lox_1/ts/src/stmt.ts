import type { Expr } from "./expr";
import type { Token } from "./token";

export abstract class Stmt {
  abstract accept(visitor: StmtVisitor): void;
}

export interface StmtVisitor {
  visitExpressionStmt(expr: Expression): void;
  visitPrintStmt(stmt: Print): void;
  visitVarStmt(stmt: Var): void;
  visitBlockStmt(stmt: Block): void;
  visitIfStmt(stmt: If): void;
  visitWhileStmt(stmt: While): void;
  visitFunctionStmt(stmt: Function): void;
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
    return visitor.visitPrintStmt(this);
  }
}

export class Var implements Stmt {
  constructor(public name: Token, public initializer: Expr | null) {}

  accept(visitor: StmtVisitor): void {
    return visitor.visitVarStmt(this);
  }
}

export class Block implements Stmt {
  constructor(public statements: Stmt[]) {}

  accept(visitor: StmtVisitor): void {
    return visitor.visitBlockStmt(this);
  }
}

export class If {
  constructor(
    public condition: Expr,
    public thenBranch: Stmt,
    public elseBranch: Stmt | null
  ) {}

  accept(visitor: StmtVisitor): void {
    return visitor.visitIfStmt(this);
  }
}

export class While {
  constructor(public condition: Expr, public body: Stmt) {}

  accept(visitor: StmtVisitor): void {
    return visitor.visitWhileStmt(this);
  }
}

export class Function {
  constructor(
    public name: Token,
    public params: Token[],
    public body: Stmt[]
  ) {}

  accept(visitor: StmtVisitor): void {
    return visitor.visitFunctionStmt(this);
  }
}
