[**wait-utils**](../README.md)

***

[wait-utils](../globals.md) / IntervalContext

# Interface: IntervalContext

Defined in: [setIntervalAsync.ts:4](https://github.com/havelessbemore/wait-utils/blob/d20b9a5a1c34bc0ec216ef08a4a2bb6f79d88c11/src/setIntervalAsync.ts#L4)

Context object provided to the [setIntervalAsync](../functions/setIntervalAsync.md) callback.

## Properties

### delay?

> `optional` **delay**: `number`

Defined in: [setIntervalAsync.ts:10](https://github.com/havelessbemore/wait-utils/blob/d20b9a5a1c34bc0ec216ef08a4a2bb6f79d88c11/src/setIntervalAsync.ts#L10)

The delay in milliseconds before the next tick.
Defaults to the initial delay provided to [setIntervalAsync](../functions/setIntervalAsync.md).
The callback can modify this property to change intervals dynamically.

***

### stop?

> `optional` **stop**: `boolean`

Defined in: [setIntervalAsync.ts:15](https://github.com/havelessbemore/wait-utils/blob/d20b9a5a1c34bc0ec216ef08a4a2bb6f79d88c11/src/setIntervalAsync.ts#L15)

When set to `true`, the inverval is stopped.

***

### tickCount

> `readonly` **tickCount**: `number`

Defined in: [setIntervalAsync.ts:22](https://github.com/havelessbemore/wait-utils/blob/d20b9a5a1c34bc0ec216ef08a4a2bb6f79d88c11/src/setIntervalAsync.ts#L22)

The tick counter, starting at `1` and incremented automatically.

#### Remarks

This property cannot be modified by the callback.
