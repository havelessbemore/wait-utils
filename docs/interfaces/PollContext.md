[**wait-utils**](../README.md)

***

[wait-utils](../globals.md) / PollContext

# Interface: PollContext\<T\>

Defined in: [src/poll.ts:37](https://github.com/havelessbemore/wait-utils/blob/15dbd61dba9c072aaada4b9cdc5ac16d88e7000e/src/poll.ts#L37)

Context object in [poll](../functions/poll.md).

## Type Parameters

### T

`T` = `unknown`

## Properties

### attempt

> `readonly` **attempt**: `number`

Defined in: [src/poll.ts:42](https://github.com/havelessbemore/wait-utils/blob/15dbd61dba9c072aaada4b9cdc5ac16d88e7000e/src/poll.ts#L42)

The current attempt number, starting from `1` and incremented automatically.

***

### delay?

> `optional` **delay**: `null` \| `number`

Defined in: [src/poll.ts:49](https://github.com/havelessbemore/wait-utils/blob/15dbd61dba9c072aaada4b9cdc5ac16d88e7000e/src/poll.ts#L49)

The delay (in milliseconds) before the next attempt.

Can be updated dynamically to implement backoff, jitter, etc.

***

### stop?

> `optional` **stop**: `boolean`

Defined in: [src/poll.ts:54](https://github.com/havelessbemore/wait-utils/blob/15dbd61dba9c072aaada4b9cdc5ac16d88e7000e/src/poll.ts#L54)

Set to `true` to stop further attempts.

***

### userData?

> `optional` **userData**: `T`

Defined in: [src/poll.ts:61](https://github.com/havelessbemore/wait-utils/blob/15dbd61dba9c072aaada4b9cdc5ac16d88e7000e/src/poll.ts#L61)

User-provided data.

Useful for sharing state or configuration across attempts.
