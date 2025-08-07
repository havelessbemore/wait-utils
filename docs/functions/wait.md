[**wait-utils**](../README.md)

***

[wait-utils](../globals.md) / wait

# Function: wait()

> **wait**(`delay?`, `signal?`): `Promise`\<`void`\>

Defined in: [src/wait.ts:15](https://github.com/havelessbemore/wait-utils/blob/3773ac400372bfb6ee47c30305c3ddfe9e2a73b6/src/wait.ts#L15)

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
