[**wait-utils**](../README.md)

***

[wait-utils](../globals.md) / PollCallback

# Type Alias: PollCallback()\<T, R\>

> **PollCallback**\<`T`, `R`\> = (`context`) => `R` \| `Promise`\<`R`\>

Defined in: [src/poll.ts:30](https://github.com/havelessbemore/wait-utils/blob/6097a4da25e21f745253cc3003ada520ffa15a55/src/poll.ts#L30)

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
