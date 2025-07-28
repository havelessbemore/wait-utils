[**wait-utils**](../README.md)

***

[wait-utils](../globals.md) / AfterPollCallback

# Type Alias: AfterPollCallback()\<T\>

> **AfterPollCallback**\<`T`\> = (`context`) => `unknown` \| `Promise`\<`unknown`\>

Defined in: [src/poll.ts:16](https://github.com/havelessbemore/wait-utils/blob/94ef6d42235298b430e9e2477787e6cf7d01d527/src/poll.ts#L16)

A hook invoked after each successful callback execution in [poll](../functions/poll.md).

Can be used for logging, adjusting the next delay, or stopping the wait loop.

This is skipped if the callback stops the wait or throws.

## Type Parameters

### T

`T` = `unknown`

## Parameters

### context

[`PollContext`](../interfaces/PollContext.md)\<`T`\>

The current [PollContext](../interfaces/PollContext.md).

## Returns

`unknown` \| `Promise`\<`unknown`\>
