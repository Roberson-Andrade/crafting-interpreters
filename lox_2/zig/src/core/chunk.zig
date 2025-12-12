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

    pub fn writeConstant(self: *Chunk, value: ValueType, line: usize) !void {
        try self.values.append(value);

        const index = self.values.items.len - 1;

        if (index > 255) {
            const mask = 0xFF;

            const parsedIndex: u24 = @intCast(index);

            try self.write(@intFromEnum(OpCode.OP_CONSTANT_LONG), line);
            try self.write(@intCast((parsedIndex >> 16) & mask), line);
            try self.write(@intCast((parsedIndex >> 8) & mask), line);
            try self.write(@intCast(parsedIndex & mask), line);
        } else {
            try self.write(@intFromEnum(OpCode.OP_CONSTANT), line);
            try self.write(@intCast(index), line);
        }
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
            .OP_CONSTANT_LONG => {
                if (offset + 3 >= self.code.items.len) {
                    std.debug.print("OP_CONSTANT_LONG (invalid: missing operands)\n", .{});
                    break :vm offset + 1;
                }

                const three = @as(u24, self.code.items[offset + 1]) << 16;
                const two = @as(u24, self.code.items[offset + 2]) << 8;
                const one = @as(u24, self.code.items[offset + 3]);

                const index: u24 = three | two | one;

                std.debug.print("OP_CONSTANT_LONG {d:0>4} ", .{index});
                std.debug.print("{}\n", .{self.values.items[index]});
                break :vm offset + 4;
            },
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
