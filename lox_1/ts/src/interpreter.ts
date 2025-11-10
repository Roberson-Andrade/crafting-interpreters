import { Environment } from "./environment";
import type {
  Binary,
  Expr,
  Grouping,
  Literal,
  Unary,
  ExprVisitor,
  Variable,
  Assign,
  Logical,
  Call,
} from "./expr";
import { Lox } from "./lox";
import { LoxRuntimeError } from "./runtime-error";
import type {
  Block,
  Expression,
  Function,
  If,
  Print,
  Stmt,
  StmtVisitor,
  Var,
  While,
} from "./stmt";
import type { Token } from "./token";
import { TokenType } from "./token-type";
import { LoxCallable } from "./lox-callable";
import { Clock } from "./native-functions/clock";
import { LoxFunction } from "./lox-function";

export class Interpreter implements ExprVisitor<any>, StmtVisitor {
  public globals = new Environment();
  private environment = this.globals;

  constructor() {
    this.globals.define("clock", Clock);
  }

  public interpret(statements: Stmt[]) {
    try {
      for (const statement of statements) {
        this.execute(statement);
      }
    } catch (error) {
      if (error instanceof LoxRuntimeError) {
        Lox.runtimeError(error);
      }
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

  visitVariableExpr(expr: Variable) {
    const value = this.environment.get(expr.name);

    if (value === undefined) {
      throw new LoxRuntimeError(
        expr.name,
        `Access to uninitialized variable ${expr.name.lexeme}`
      );
    }

    return this.environment.get(expr.name);
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

  visitFunctionStmt(stmt: Function): void {
    const fun = new LoxFunction(stmt);
    this.environment.define(stmt.name.lexeme, fun);
  }

  visitIfStmt(stmt: If): void {
    if (this.isTruthy(this.evaluate(stmt.condition))) {
      this.execute(stmt.thenBranch);
    } else if (stmt.elseBranch !== null) {
      this.execute(stmt.elseBranch);
    }
  }

  visitLogicalExpr(expr: Logical) {
    const left = this.evaluate(expr.left);

    if (expr.operator.type === TokenType.OR) {
      if (this.isTruthy(expr.left)) return left;
    } else {
      if (!this.isTruthy(expr.left)) return left;
    }

    return this.evaluate(expr.right);
  }

  visitPrintStmt(stmt: Print) {
    const value = this.evaluate(stmt.expression);
    console.log(this.stringify(value));
  }

  visitVarStmt(stmt: Var): void {
    let value = undefined;

    if (stmt.initializer) {
      value = this.evaluate(stmt.initializer);
    }

    this.environment.define(stmt.name.lexeme, value);
  }

  visitWhileStmt(stmt: While): void {
    while (this.isTruthy(this.evaluate(stmt.condition))) {
      this.execute(stmt.body);
    }
  }

  visitAssignExpr(expr: Assign) {
    const value = this.evaluate(expr.value);

    this.environment.assign(expr.name, value);

    return value;
  }

  visitBlockStmt(stmt: Block): void {
    this.executeBlock(stmt.statements, new Environment(this.environment));
  }

  visitCallExpr(expr: Call) {
    const callee = this.evaluate(expr.callee);

    const args = [];

    for (const arg of expr.args) {
      args.push(this.evaluate(arg));
    }

    if (!(callee instanceof LoxCallable)) {
      throw new LoxRuntimeError(
        expr.paren,
        "can only call functions and classes."
      );
    }

    if (args.length !== callee.arity) {
      throw new LoxRuntimeError(
        expr.paren,
        `Expected ${callee.arity} arguments but got ${args.length}.`
      );
    }

    return callee.call(this, args);
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

  public executeBlock(statements: Stmt[], environment: Environment) {
    const previous = this.environment;

    try {
      this.environment = environment;

      for (const statement of statements) {
        this.execute(statement);
      }
    } finally {
      this.environment = previous;
    }
  }
}
