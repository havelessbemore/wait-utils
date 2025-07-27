[**wait-utils**](../README.md)

***

[wait-utils](../globals.md) / setTimeoutAsync

# Function: setTimeoutAsync()

> **setTimeoutAsync**(`delay?`, `signal?`): `Promise`\<`void`\>

Defined in: [src/setTimeoutAsync.ts:22](https://github.com/havelessbemore/wait-utils/blob/f8bff5b47c64f45aba9b31f67688196f18b2c467/src/setTimeoutAsync.ts#L22)

Asynchronously delays execution for the specified duration.

## Parameters

### delay?

`number`

The number of milliseconds to wait.

### signal?

[`AbortSignal`](#)

An `AbortSignal` that can cancel the wait early.

## Returns

`Promise`\<`void`\>

A promise that resolves after the delay, or rejects with
         the `signal.reason` if `signal` is aborted before timeout.

## Example

```ts
// Basic usage
await setTimeoutAsync(1000);

// Abortable usage
const controller = new AbortController();
setTimeoutAsync(2000, controller.signal)
  .catch(reason => console.log('Aborted due to', reason));
controller.abort('Timeout canceled');
```
