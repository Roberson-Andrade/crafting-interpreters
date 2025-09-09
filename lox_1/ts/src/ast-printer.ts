import type { Assign, Binary, Expr, Grouping, Literal, Unary, Variable, Visitor } from "./expr";

export class AstPrinter implements Visitor<string> {
  print(expr: Expr) {
    console.log(expr.accept<string>(this))
  }

  parenthesize(name: string, ...exprs: Expr[]) {
    const builder: string[] = []

    builder.push("(", name);

    for (const expr of exprs) {
      builder.push(" ");
      builder.push(expr.accept(this));
    }

    builder.push(")");

    return builder.join("");
  }

  visitBinaryExpr(expr: Binary): string {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }

  visitLiteralExpr(expr: Literal): string {
    if (expr == null) return "nil";

    return String(expr.value);
  }

  visitGroupingExpr(expr: Grouping) {
    return this.parenthesize("group", expr.expression);
  }

  visitUnaryExpr(expr: Unary) {
    return this.parenthesize(expr.operator.lexeme, expr.right);
  }

  visitAssignExpr(_: Assign): string {
    return ''

  }

  visitVariableExpr(_: Variable): string {
    return ''
  }
}
