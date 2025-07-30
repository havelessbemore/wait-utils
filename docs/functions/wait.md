[**wait-utils**](../README.md)

***

[wait-utils](../globals.md) / wait

# Function: wait()

> **wait**(`delay?`, `signal?`): `Promise`\<`void`\>

Defined in: [src/wait.ts:16](https://github.com/havelessbemore/wait-utils/blob/6097a4da25e21f745253cc3003ada520ffa15a55/src/wait.ts#L16)

Waits for the specified number of milliseconds.

Supports cancellation via an `AbortSignal`.

## Parameters

### delay?

The number of milliseconds to wait.

`null` | `number`

### signal?

[`AbortSignal`](#)

Optional `AbortSignal` to cancel the wait early.

## Returns

`Promise`\<`void`\>

A promise that:
- resolves after the delay
- rejects with the `AbortSignal.reason` if cancelled before the delay
