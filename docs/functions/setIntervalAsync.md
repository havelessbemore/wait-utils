[**wait-utils**](../README.md)

***

[wait-utils](../globals.md) / setIntervalAsync

# Function: setIntervalAsync()

> **setIntervalAsync**(`callback`, `delay?`, `signal?`): `Promise`\<`void`\>

Defined in: [src/setIntervalAsync.ts:52](https://github.com/havelessbemore/wait-utils/blob/6097a4da25e21f745253cc3003ada520ffa15a55/src/setIntervalAsync.ts#L52)

Asynchronously calls a callback repeatedly at a given interval.

Internally uses `setTimeout`, so interval drift may occur.

## Parameters

### callback

(`context`) => `unknown`

Invoked on each tick. Receives a mutable [IntervalContext](../interfaces/IntervalContext.md) object,
                  allowing the callback to change delay dynamically or stop the interval.

### delay?

`number`

The delay in milliseconds between invocations.
               Can be changed dynamically via `context.delay`.

### signal?

[`AbortSignal`](#)

An `AbortSignal` which can cancel the interval.

## Returns

`Promise`\<`void`\>

A promise that:
- resolves when `context.stop` is set to `true` inside the callback (graceful termination),
- rejects with `signal.reason` if the signal aborts,
- rejects if the callback throws or rejects.

## Example

```ts
let count = 0;
setIntervalAsync(ctx => {
  console.log("tick", ++count);
  ctx.stop = count >= 5;
}, 1000).then(() => {
   console.log("Completed after 5 ticks");
});
```
