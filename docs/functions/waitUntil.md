[**wait-utils**](../README.md)

***

[wait-utils](../globals.md) / waitUntil

# Function: waitUntil()

> **waitUntil**(`timestamp?`, `signal?`): `Promise`\<`void`\>

Defined in: [src/waitUntil.ts:14](https://github.com/havelessbemore/wait-utils/blob/f8bff5b47c64f45aba9b31f67688196f18b2c467/src/waitUntil.ts#L14)

Waits until the specified high-resolution timestamp is reached.

## Parameters

### timestamp?

Target time (in milliseconds) relative to `performance.now()`.

`null` | `number`

### signal?

[`AbortSignal`](#)

Optional `AbortSignal` to cancel the wait early.

## Returns

`Promise`\<`void`\>

A promise that:
- resolves when the current time is at or past the target timestamp
- rejects with the signal’s reason if cancelled before the target
