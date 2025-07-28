[**wait-utils**](../README.md)

***

[wait-utils](../globals.md) / timeout

# Function: timeout()

> **timeout**(`delay?`, `signal?`): `Promise`\<`void`\>

Defined in: [src/timeout.ts:16](https://github.com/havelessbemore/wait-utils/blob/94ef6d42235298b430e9e2477787e6cf7d01d527/src/timeout.ts#L16)

Rejects with a `TimeoutError` after the specified delay,
unless cancelled by an `AbortSignal`.

## Parameters

### delay?

The number of milliseconds to wait before timing out.

`null` | `number`

### signal?

[`AbortSignal`](#)

Optional `AbortSignal` to cancel the timeout.

## Returns

`Promise`\<`void`\>

A promise that:
- resolves if the signal is aborted before the delay
- rejects with a `TimeoutError` if the delay completes
- rethrows an error if an unexpected rejection occurs
