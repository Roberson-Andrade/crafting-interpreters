const std = @import("std");

const ArrayList = std.array_list.Managed;
const Allocator = std.mem.Allocator;

const OpCode = @import("../enums/opcode.zig").OpCode;
pub const ValueType = f64;

pub const Chunk = struct {
    code: ArrayList(u8),
    lines: ArrayList(usize),
    values: ArrayList(ValueType),

    pub fn init(gpa: Allocator) Chunk {
        return Chunk{ .code = ArrayList(u8).init(gpa), .values = ArrayList(ValueType).init(gpa), .lines = ArrayList(usize).init(gpa) };
    }

    pub fn deinit(self: *Chunk) void {
        self.code.deinit();
        self.lines.deinit();
        self.values.deinit();
    }

    pub fn write(self: *Chunk, byte: u8, line: usize) !void {
        try self.code.append(byte);
        try self.lines.append(line);
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

        if (offset > 0 and self.lines.items[offset] == self.lines.items[offset - 1]) {
            std.debug.print("   | ", .{});
        } else {
            std.debug.print("{d:0>4} ", .{self.lines.items[offset]});
        }

        const instruction = @as(OpCode, @enumFromInt(self.code.items[offset]));

        return vm: switch (instruction) {
            .OP_RETURN => {
                std.debug.print("OP_RETURN", .{});
                break :vm offset + 1;
            },
            .OP_CONSTANT => {
                const constIdx = self.code.items[offset + 1];

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
};
