import type { Token } from "./token";

export interface ExprVisitor<T> {
  visitAssignExpr(expr: Assign): T;

  visitBinaryExpr(expr: Binary): T;

  visitGroupingExpr(expr: Grouping): T;

  visitLiteralExpr(expr: Literal): T;

  visitUnaryExpr(expr: Unary): T;

  visitVariableExpr(expr: Variable): T;

  visitLogicalExpr(expr: Logical): T;

  visitCallExpr(expr: Call): T;
}

export abstract class Expr {
  abstract accept<T>(visitor: ExprVisitor<T>): T;
}

export class Binary implements Expr {
  constructor(public left: Expr, public operator: Token, public right: Expr) {}

  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitBinaryExpr(this);
  }
}

export class Unary implements Expr {
  constructor(public operator: Token, public right: Expr) {}

  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitUnaryExpr(this);
  }
}

export class Variable implements Expr {
  constructor(public name: Token) {}

  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitVariableExpr(this);
  }
}

export class Grouping implements Expr {
  constructor(public expression: Expr) {}

  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitGroupingExpr(this);
  }
}

export class Assign implements Expr {
  constructor(public name: Token, public value: Expr) {}

  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitAssignExpr(this);
  }
}

export class Literal implements Expr {
  constructor(public value: unknown) {}

  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitLiteralExpr(this);
  }
}

export class Logical implements Expr {
  constructor(public left: Expr, public operator: Token, public right: Expr) {}

  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitLogicalExpr(this);
  }
}

export class Call implements Expr {
  constructor(public callee: Expr, public paren: Token, public args: Expr[]) {}

  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitCallExpr(this);
  }
}
