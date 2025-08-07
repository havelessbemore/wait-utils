[**wait-utils**](../README.md)

***

[wait-utils](../globals.md) / PollCallback

# Type Alias: PollCallback()\<T, R\>

> **PollCallback**\<`T`, `R`\> = (`context`) => `R` \| `Promise`\<`R`\>

Defined in: [src/poll.ts:29](https://github.com/havelessbemore/wait-utils/blob/3773ac400372bfb6ee47c30305c3ddfe9e2a73b6/src/poll.ts#L29)

The main function invoked at each iteration in [poll](../functions/poll.md).

This function performs the primary asynchronous operation.
To stop further attempts, set `context.stop = true`.

## Type Parameters

### T

`T` = `unknown`

### R

`R` = `unknown`

## Parameters

### context

[`PollContext`](../interfaces/PollContext.md)\<`T`\>

The current [PollContext](../interfaces/PollContext.md).

## Returns

`R` \| `Promise`\<`R`\>

A result value, or a Promise that resolves to one.
