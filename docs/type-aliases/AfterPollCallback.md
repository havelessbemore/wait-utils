[**wait-utils**](../README.md)

***

[wait-utils](../globals.md) / AfterPollCallback

# Type Alias: AfterPollCallback()\<T\>

> **AfterPollCallback**\<`T`\> = (`context`) => `unknown` \| `Promise`\<`unknown`\>

Defined in: [src/poll.ts:15](https://github.com/havelessbemore/wait-utils/blob/3773ac400372bfb6ee47c30305c3ddfe9e2a73b6/src/poll.ts#L15)

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
