[**wait-utils**](../README.md)

***

[wait-utils](../globals.md) / waitUntil

# Function: waitUntil()

> **waitUntil**(`timestamp?`, `signal?`): `Promise`\<`void`\>

Defined in: [src/waitUntil.ts:17](https://github.com/havelessbemore/wait-utils/blob/6097a4da25e21f745253cc3003ada520ffa15a55/src/waitUntil.ts#L17)

Waits until the specified time is reached.

## Parameters

### timestamp?

Target time:
  - If a [Date](#), relative to [Date.now](#).
  - If a `number`, relative to [performance.now](#).

`null` | `number` | [`Date`](#)

### signal?

[`AbortSignal`](#)

Optional `AbortSignal` to cancel the wait early.

## Returns

`Promise`\<`void`\>

A promise that:
- resolves when the current time is at or past the target time
- rejects with the signal’s reason if cancelled before the target
