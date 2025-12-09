const std = @import("std");

const Chunk = @import("core/chunk.zig").Chunk;
const OpCode = @import("enums/opcode.zig").OpCode;

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    var chunk = Chunk.init(allocator);
    try chunk.write(@intFromEnum(OpCode.OP_RETURN));
    chunk.disassembleChunk("test chunk");
}
