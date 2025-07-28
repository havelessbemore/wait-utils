[**wait-utils**](../README.md)

***

[wait-utils](../globals.md) / PollOptions

# Interface: PollOptions\<T\>

Defined in: [src/poll.ts:67](https://github.com/havelessbemore/wait-utils/blob/94ef6d42235298b430e9e2477787e6cf7d01d527/src/poll.ts#L67)

Configuration options for [poll](../functions/poll.md).

## Type Parameters

### T

`T` = `unknown`

## Properties

### afterPoll?

> `optional` **afterPoll**: [`AfterPollCallback`](../type-aliases/AfterPollCallback.md)\<`T`\>

Defined in: [src/poll.ts:73](https://github.com/havelessbemore/wait-utils/blob/94ef6d42235298b430e9e2477787e6cf7d01d527/src/poll.ts#L73)

A function to run after each poll attempt.

Can be used to log results, inspect attempt state, or modify future behavior.

***

### delay?

> `optional` **delay**: `null` \| `number`

Defined in: [src/poll.ts:80](https://github.com/havelessbemore/wait-utils/blob/94ef6d42235298b430e9e2477787e6cf7d01d527/src/poll.ts#L80)

The delay (in milliseconds) between subsequent attempts.

Can be changed dynamically via [context.delay](PollContext.md#delay).

***

### initialDelay?

> `optional` **initialDelay**: `null` \| `number`

Defined in: [src/poll.ts:86](https://github.com/havelessbemore/wait-utils/blob/94ef6d42235298b430e9e2477787e6cf7d01d527/src/poll.ts#L86)

The delay (in milliseconds) before the first attempt.
If not specified, falls back to [delay](#delay).

***

### signal?

> `optional` **signal**: [`AbortSignal`](#)

Defined in: [src/poll.ts:93](https://github.com/havelessbemore/wait-utils/blob/94ef6d42235298b430e9e2477787e6cf7d01d527/src/poll.ts#L93)

An [AbortSignal](#) to cancel the wait loop.

If triggered, the function throws an `AbortError`.

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [src/poll.ts:100](https://github.com/havelessbemore/wait-utils/blob/94ef6d42235298b430e9e2477787e6cf7d01d527/src/poll.ts#L100)

The maximum total duration (in milliseconds) to wait before timing out.

If exceeded, the function throws a `TimeoutError`.

***

### userData?

> `optional` **userData**: `T`

Defined in: [src/poll.ts:107](https://github.com/havelessbemore/wait-utils/blob/94ef6d42235298b430e9e2477787e6cf7d01d527/src/poll.ts#L107)

User-provided data.

Useful for sharing state or configuration across attempts.
