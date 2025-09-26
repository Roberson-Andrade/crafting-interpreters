import type {
  Binary,
  Expr,
  Grouping,
  Literal,
  Unary,
  ExprVisitor,
} from "./expr";
import { Lox } from "./lox";
import { LoxRuntimeError } from "./runtime-error";
import type { Expression, Print, Stmt, StmtVisitor } from "./stmt";
import type { Token } from "./token";
import { TokenType } from "./token-type";

export class Interpreter implements ExprVisitor<any>, StmtVisitor {
  constructor() {}

  public interpret(statements: Stmt[]) {
    try {
      for (const statement of statements) {
        this.execute(statement);
      }
    } catch (error) {
      Lox.runtimeError(error);
    }
  }

  visitLiteralExpr(expr: Literal): any {
    return expr.value;
  }

  visitGroupingExpr(expr: Grouping): any {
    return this.evaluate(expr.expression);
  }

  visitUnaryExpr(expr: Unary): any {
    const right = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.MINUS:
        this.checkNumberOperands(expr.operator, right);
        return -right;
      case TokenType.BANG:
        return !this.isTruthy(right);
    }

    return null;
  }

  visitBinaryExpr(expr: Binary): any {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.SLASH:
        this.checkNumberOperands(expr.operator, left, right);
        return left / right;
      case TokenType.MINUS:
        this.checkNumberOperands(expr.operator, left, right);
        return left - right;
      case TokenType.STAR:
        this.checkNumberOperands(expr.operator, left, right);
        return left * right;
      case TokenType.PLUS:
        if (typeof left === "string" && typeof right === "string")
          return left + right;
        if (typeof left === "number" && typeof right === "number")
          return left + right;

        throw new LoxRuntimeError(
          expr.operator,
          "Operands must be two numbers or two strings"
        );
      case TokenType.GREATER:
        this.checkNumberOperands(expr.operator, left, right);
        return left > right;
      case TokenType.GREATER_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return left >= right;
      case TokenType.LESS:
        this.checkNumberOperands(expr.operator, left, right);
        return left < right;
      case TokenType.LESS_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return left <= right;
      case TokenType.BANG_EQUAL:
        return !this.isEqual(left, right);
      case TokenType.EQUAL_EQUAL:
        return this.isEqual(left, right);
    }

    return null;
  }

  visitExpressionStmt(expr: Expression): void {
    this.evaluate(expr.expression);
  }

  visitPrintStatement(stmt: Print) {
    const value = this.evaluate(stmt.expression);
    console.log(this.stringify(value));
  }

  private execute(statement: Stmt) {
    statement.accept(this);
  }

  private evaluate(expr: Expr): any {
    return expr.accept(this);
  }

  private isTruthy(value: any) {
    if (value === null) return false;
    if (typeof value === "boolean") return value;

    return true;
  }

  private isEqual(left: any, right: any) {
    return Object.is(left, right);
  }

  private checkNumberOperands(operator: Token, ...operands: any[]) {
    if (operands.some((op) => typeof op !== "number"))
      throw new LoxRuntimeError(operator, "operand must be a number.");
  }

  private stringify(value: any) {
    if (value === null) return "nil";

    return value;
  }
}
