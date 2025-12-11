const std = @import("std");

const Chunk = @import("core/chunk.zig").Chunk;
const OpCode = @import("enums/opcode.zig").OpCode;

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    var chunk = Chunk.init(allocator);

    const index: u8 = @intCast(try chunk.addConstant(1.2));
    const constant = @as(u8, index);

    try chunk.write(@intFromEnum(OpCode.OP_CONSTANT), 123);
    try chunk.write(constant, 123);

    try chunk.write(@intFromEnum(OpCode.OP_RETURN), 123);

    try chunk.write(@intFromEnum(OpCode.OP_CONSTANT), 125);
    try chunk.write(constant, 125);

    try chunk.write(@intFromEnum(OpCode.OP_RETURN), 125);

    try chunk.write(@intFromEnum(OpCode.OP_CONSTANT), 156);
    try chunk.write(constant, 156);

    try chunk.write(@intFromEnum(OpCode.OP_RETURN), 156);
    chunk.disassembleChunk("test chunk");
}
