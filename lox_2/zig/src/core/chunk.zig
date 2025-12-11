const std = @import("std");

const ArrayList = std.array_list.Managed;
const Allocator = std.mem.Allocator;

const OpCode = @import("../enums/opcode.zig").OpCode;
pub const ValueType = f64;

const RleLine = struct { length: usize, line: usize };

pub const Chunk = struct {
    code: ArrayList(u8),
    lines: ArrayList(RleLine),
    values: ArrayList(ValueType),

    pub fn init(gpa: Allocator) Chunk {
        return Chunk{ .code = ArrayList(u8).init(gpa), .values = ArrayList(ValueType).init(gpa), .lines = ArrayList(RleLine).init(gpa) };
    }

    pub fn deinit(self: *Chunk) void {
        self.code.deinit();
        self.lines.deinit();
        self.values.deinit();
    }

    pub fn write(self: *Chunk, byte: u8, line: usize) !void {
        try self.code.append(byte);
        try self.writeLine(line);
    }

    pub fn writeLine(self: *Chunk, line: usize) !void {
        if (self.lines.items.len > 0) {
            const last = &self.lines.items[self.lines.items.len - 1];

            if (last.line == line) {
                last.length += 1;
                return;
            }
        }

        try self.lines.append(.{ .length = 1, .line = line });
    }

    pub fn addConstant(self: *Chunk, value: ValueType) !usize {
        try self.values.append(value);
        return self.values.items.len - 1;
    }

    pub fn disassembleChunk(self: *Chunk, name: []const u8) void {
        std.debug.print("== {s} == \n", .{name});

        var offset: usize = 0;

        while (offset < self.code.items.len) {
            offset = self.disassembleInstruction(offset);
        }
    }

    pub fn disassembleInstruction(self: *Chunk, offset: usize) usize {
        std.debug.print("{d:0>4} ", .{offset});
        const line = self.getLine(offset);

        if (offset > 0 and line == self.getLine(offset - 1)) {
            std.debug.print("   | ", .{});
        } else {
            std.debug.print("{d:0>4} ", .{line});
        }

        const instruction = @as(OpCode, @enumFromInt(self.code.items[offset]));

        return vm: switch (instruction) {
            .OP_RETURN => {
                std.debug.print("OP_RETURN\n", .{});
                break :vm offset + 1;
            },
            .OP_CONSTANT => {
                if (offset + 1 >= self.code.items.len) {
                    std.debug.print("OP_CONSTANT (invalid: missing operand)\n", .{});
                    break :vm offset + 1;
                }

                const constIdx = self.code.items[offset + 1];

                if (constIdx >= self.values.items.len) {
                    std.debug.print("OP_CONSTANT {d:0>4} (invalid: constant index out of bounds)\n", .{constIdx});
                    break :vm offset + 2;
                }

                std.debug.print("OP_CONSTANT {d:0>4} ", .{constIdx});
                std.debug.print("{}\n", .{self.values.items[constIdx]});
                break :vm offset + 2;
            },
            // else => {
            //     std.debug.print("Unknown opcode {n}\n", .{instruction});
            //     break :vm offset + 1;
            // },
        };
    }

    fn getLine(self: *Chunk, index: usize) usize {
        var acc: usize = 0;

        for (self.lines.items) |item| {
            acc += item.length;

            if (index < acc) {
                return item.line;
            }
        }

        if (self.lines.items.len > 0) {
            return self.lines.items[self.lines.items.len - 1].line;
        }
        return 0;
    }
};
