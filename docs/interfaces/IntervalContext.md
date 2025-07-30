[**wait-utils**](../README.md)

***

[wait-utils](../globals.md) / IntervalContext

# Interface: IntervalContext

Defined in: [src/setIntervalAsync.ts:4](https://github.com/havelessbemore/wait-utils/blob/6097a4da25e21f745253cc3003ada520ffa15a55/src/setIntervalAsync.ts#L4)

Context object provided to the [setIntervalAsync](../functions/setIntervalAsync.md) callback.

## Properties

### delay?

> `optional` **delay**: `number`

Defined in: [src/setIntervalAsync.ts:10](https://github.com/havelessbemore/wait-utils/blob/6097a4da25e21f745253cc3003ada520ffa15a55/src/setIntervalAsync.ts#L10)

The delay in milliseconds before the next tick.
Defaults to the initial delay provided to [setIntervalAsync](../functions/setIntervalAsync.md).
The callback can modify this property to change intervals dynamically.

***

### stop?

> `optional` **stop**: `boolean`

Defined in: [src/setIntervalAsync.ts:15](https://github.com/havelessbemore/wait-utils/blob/6097a4da25e21f745253cc3003ada520ffa15a55/src/setIntervalAsync.ts#L15)

When set to `true`, the inverval is stopped.

***

### tickCount

> `readonly` **tickCount**: `number`

Defined in: [src/setIntervalAsync.ts:22](https://github.com/havelessbemore/wait-utils/blob/6097a4da25e21f745253cc3003ada520ffa15a55/src/setIntervalAsync.ts#L22)

The tick counter, starting at `1` and incremented automatically.

#### Remarks

This property cannot be modified by the callback.
