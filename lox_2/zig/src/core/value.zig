const std = @import("std");
const ArrayList = @import("std").array_list.Managed;
const Allocator = std.mem.Allocator;

pub const ValueType = f64;

pub const Value = struct {
    values: ArrayList(ValueType),

    pub fn init(gpa: Allocator) Value {
        return Value{ .values = ArrayList(ValueType).init(gpa) };
    }

    pub fn deinit(self: *Value) void {
        self.deinit();
    }

    pub fn write(self: *Value, value: ValueType) !void {
        try self.values.append(value);
    }
};
