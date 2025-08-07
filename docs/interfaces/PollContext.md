[**wait-utils**](../README.md)

***

[wait-utils](../globals.md) / PollContext

# Interface: PollContext\<T\>

Defined in: [src/poll.ts:36](https://github.com/havelessbemore/wait-utils/blob/3773ac400372bfb6ee47c30305c3ddfe9e2a73b6/src/poll.ts#L36)

Context object in [poll](../functions/poll.md).

## Type Parameters

### T

`T` = `unknown`

## Properties

### attempt

> `readonly` **attempt**: `number`

Defined in: [src/poll.ts:41](https://github.com/havelessbemore/wait-utils/blob/3773ac400372bfb6ee47c30305c3ddfe9e2a73b6/src/poll.ts#L41)

The current attempt number, starting from `1` and incremented automatically.

***

### delay?

> `optional` **delay**: `null` \| `number`

Defined in: [src/poll.ts:48](https://github.com/havelessbemore/wait-utils/blob/3773ac400372bfb6ee47c30305c3ddfe9e2a73b6/src/poll.ts#L48)

The delay (in milliseconds) before the next attempt.

Can be updated dynamically to implement backoff, jitter, etc.

***

### stop?

> `optional` **stop**: `boolean`

Defined in: [src/poll.ts:53](https://github.com/havelessbemore/wait-utils/blob/3773ac400372bfb6ee47c30305c3ddfe9e2a73b6/src/poll.ts#L53)

Set to `true` to stop further attempts.

***

### userData?

> `optional` **userData**: `T`

Defined in: [src/poll.ts:60](https://github.com/havelessbemore/wait-utils/blob/3773ac400372bfb6ee47c30305c3ddfe9e2a73b6/src/poll.ts#L60)

User-provided data.

Useful for sharing state or configuration across attempts.
