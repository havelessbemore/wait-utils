[**wait-utils**](../README.md)

***

[wait-utils](../globals.md) / PollCallback

# Type Alias: PollCallback()\<T, R\>

> **PollCallback**\<`T`, `R`\> = (`context`) => `R` \| `Promise`\<`R`\>

Defined in: [src/poll.ts:30](https://github.com/havelessbemore/wait-utils/blob/3bb2ed71fc20049f79eeaf6e5a808c5d1620f97b/src/poll.ts#L30)

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
