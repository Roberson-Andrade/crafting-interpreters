import type { Token } from "./token";

export interface Visitor<T> {
  visitAssignExpr(expr: Assign): T;

  visitBinaryExpr(expr: Binary): T;

  visitGroupingExpr(expr: Grouping): T;

  visitLiteralExpr(expr: Literal): T;

  visitUnaryExpr(expr: Unary): T;

  visitVariableExpr(expr: Variable): T;

  visitConditionalExpr(expr: Conditional): T;
}

export abstract class Expr {
  abstract accept<T>(visitor: Visitor<T>): T;
}

export class Binary extends Expr {
  constructor(public left: Expr, public operator: Token, public right: Expr) {
    super();
  }

  override accept<T>(visitor: Visitor<T>): T {
    return visitor.visitBinaryExpr(this);
  }
}

export class Unary extends Expr {
  constructor(public operator: Token, public right: Expr) {
    super();
  }

  override accept<T>(visitor: Visitor<T>): T {
    return visitor.visitUnaryExpr(this);
  }
}


export class Variable extends Expr {
  constructor(public operator: Token) {
    super();
  }

  override accept<T>(visitor: Visitor<T>): T {
    return visitor.visitVariableExpr(this);
  }
}

export class Grouping extends Expr {
  constructor(public expression: Expr) {
    super();
  }

  override accept<T>(visitor: Visitor<T>): T {
    return visitor.visitGroupingExpr(this);
  }
}

export class Assign extends Expr {
  constructor(public token: Token, public expression: Expr) {
    super();
  }

  override accept<T>(visitor: Visitor<T>): T {
    return visitor.visitAssignExpr(this);
  }
}


export class Literal extends Expr {
  constructor(public value: unknown) {
    super();
  }

  override accept<T>(visitor: Visitor<T>): T {
    return visitor.visitLiteralExpr(this);
  }
}

export class Conditional extends Expr {
  constructor(public condition: Expr, public thenBranch: Expr, public elseBranch: Expr) {
    super();
  }

  override accept<T>(visitor: Visitor<T>): T {
    return visitor.visitConditionalExpr(this);
  }
}
