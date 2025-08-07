[**wait-utils**](../README.md)

***

[wait-utils](../globals.md) / PollOptions

# Interface: PollOptions\<T\>

Defined in: [src/poll.ts:66](https://github.com/havelessbemore/wait-utils/blob/3773ac400372bfb6ee47c30305c3ddfe9e2a73b6/src/poll.ts#L66)

Configuration options for [poll](../functions/poll.md).

## Type Parameters

### T

`T` = `unknown`

## Properties

### afterPoll?

> `optional` **afterPoll**: [`AfterPollCallback`](../type-aliases/AfterPollCallback.md)\<`T`\>

Defined in: [src/poll.ts:72](https://github.com/havelessbemore/wait-utils/blob/3773ac400372bfb6ee47c30305c3ddfe9e2a73b6/src/poll.ts#L72)

A function to run after each poll attempt.

Can be used to log results, inspect attempt state, or modify future behavior.

***

### delay?

> `optional` **delay**: `null` \| `number`

Defined in: [src/poll.ts:79](https://github.com/havelessbemore/wait-utils/blob/3773ac400372bfb6ee47c30305c3ddfe9e2a73b6/src/poll.ts#L79)

The delay (in milliseconds) between subsequent attempts.

Can be changed dynamically via [context.delay](PollContext.md#delay).

***

### initialDelay?

> `optional` **initialDelay**: `null` \| `number`

Defined in: [src/poll.ts:85](https://github.com/havelessbemore/wait-utils/blob/3773ac400372bfb6ee47c30305c3ddfe9e2a73b6/src/poll.ts#L85)

The delay (in milliseconds) before the first attempt.
If not specified, falls back to [delay](#delay).

***

### signal?

> `optional` **signal**: [`AbortSignal`](#)

Defined in: [src/poll.ts:92](https://github.com/havelessbemore/wait-utils/blob/3773ac400372bfb6ee47c30305c3ddfe9e2a73b6/src/poll.ts#L92)

An [AbortSignal](#) to cancel the wait loop.

If triggered, the function throws an `AbortError`.

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [src/poll.ts:99](https://github.com/havelessbemore/wait-utils/blob/3773ac400372bfb6ee47c30305c3ddfe9e2a73b6/src/poll.ts#L99)

The maximum total duration (in milliseconds) to wait before timing out.

If exceeded, the function throws a `TimeoutError`.

***

### userData?

> `optional` **userData**: `T`

Defined in: [src/poll.ts:106](https://github.com/havelessbemore/wait-utils/blob/3773ac400372bfb6ee47c30305c3ddfe9e2a73b6/src/poll.ts#L106)

User-provided data.

Useful for sharing state or configuration across attempts.
