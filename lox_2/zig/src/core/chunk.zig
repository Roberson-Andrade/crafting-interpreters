const std = @import("std");

const ArrayList = std.array_list.Managed;
const Allocator = std.mem.Allocator;

const OpCode = @import("../enums/opcode.zig").OpCode;
const Value = @import("value.zig").Value;
const ValueType = @import("value.zig").ValueType;

pub const Chunk = struct {
    code: ArrayList(u8),
    values: Value,

    pub fn init(gpa: Allocator) Chunk {
        return Chunk{ .code = ArrayList(u8).init(gpa), .values = Value.init(gpa) };
    }

    pub fn deinit(self: *Chunk) void {
        self.code.deinit();
    }

    pub fn write(self: *Chunk, byte: u8) !void {
        try self.code.append(byte);
    }

    pub fn addConstant(self: *Chunk, value: ValueType) !void {
        try self.values.write(value);
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

        const instruction = @as(OpCode, @enumFromInt(self.code.items[offset]));

        return vm: switch (instruction) {
            .OP_RETURN => {
                std.debug.print("OP_RETURN", .{});
                break :vm offset + 1;
            },
            // else => {
            //     std.debug.print("Unknown opcode {n}\n", .{instruction});
            //     break :vm offset + 1;
            // },
        };
    }
};
