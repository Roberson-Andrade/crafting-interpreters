const std = @import("std");

const Chunk = @import("core/chunk.zig").Chunk;
const OpCode = @import("enums/opcode.zig").OpCode;

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    var chunk = Chunk.init(allocator);

    for (0..260) |index| {
        const float: f64 = @floatFromInt(index);
        try chunk.writeConstant(12.5 * float, index);
    }

    chunk.disassembleChunk("test chunk");
}
