[**wait-utils**](../README.md)

***

[wait-utils](../globals.md) / poll

# Function: poll()

> **poll**\<`T`, `R`\>(`callback`, `options`): `Promise`\<`R`\>

Defined in: [src/poll.ts:128](https://github.com/havelessbemore/wait-utils/blob/94ef6d42235298b430e9e2477787e6cf7d01d527/src/poll.ts#L128)

Repeatedly invokes a callback function until it succeeds, is stopped, aborted, or times out.

After each successful callback execution, an optional [PollOptions.afterPoll](../interfaces/PollOptions.md#afterpoll)
hook is invoked. You can control retry timing by updating `context.delay` or exit
early by setting `context.stop = true`.

## Type Parameters

### T

`T`

The shape of the user data passed through the context.

### R

`R`

The return type of the callback function.

## Parameters

### callback

[`PollCallback`](../type-aliases/PollCallback.md)\<`T`, `R`\>

The function to invoke on each attempt.

### options

[`PollOptions`](../interfaces/PollOptions.md)\<`T`\> = `{}`

Optional configuration to control timing, retries, and cancellation.

## Returns

`Promise`\<`R`\>

The last value returned by the callback.

## Throws

`AbortError` if the operation is cancelled using `signal`.

## Throws

`TimeoutError` if the total wait duration exceeds `timeout`.
