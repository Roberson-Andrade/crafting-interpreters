import type { Expr, ExprVisitor } from "./expr";
import type { Interpreter } from "./interpreter";
import type { Stmt } from "./stmt";
import type { Token } from "./token";

export class Resolver implements ExprVisitor<void>, Stmt.StmtVisitor {
  private scopes: Map<String, boolean>[] = [];

  constructor(private interpreter: Interpreter) {}

  visitBlockStmt(stmt: Stmt.Block): void {
    this.beginScope();
    this.resolveStatements(stmt.statements);
    this.endScope();
  }

  visitVarStmt(stmt: Stmt.Var): void {
    this.declare(stmt.name);

    if (stmt.initializer !== null) {
      this.resolveExpr(stmt.initializer);
    }

    this.define(stmt.name);
  }

  private resolveStatements(stmts: Stmt.Stmt[]) {
    for (const statement of stmts) {
      statement.accept(this);
    }
  }

  private resolveExpr(expr: Expr) {
    expr.accept(this);
  }

  private beginScope() {
    this.scopes.push(new Map<String, boolean>());
  }

  private endScope() {
    this.scopes.pop();
  }

  private declare(name: Token) {
    if (this.scopes.length === 0) return;

    const scope = this.scopes.at(-1)!;
    scope.set(name.lexeme, false);
  }

  private define(name: Token) {
    if (this.scopes.length === 0) return;

    this.scopes.at(-1)!.set(name.lexeme, true);
  }
}
