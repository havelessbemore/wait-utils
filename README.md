# wait-utils

A modern, zero-dependency wait and timing utility toolkit for JavaScript and TypeScript.  

Supports `AbortSignal`, timeouts, retries, and polling — all with first-class TypeScript types.

[![Version](https://img.shields.io/npm/v/wait-utils.svg)](https://www.npmjs.com/package/wait-utils)
[![Maintenance](https://img.shields.io/maintenance/yes/2025)](https://github.com/havelessbemore/wait-utils/graphs/commit-activity)
[![License](https://img.shields.io/github/license/havelessbemore/wait-utils.svg)](https://github.com/havelessbemore/wait-utils/blob/master/LICENSE)
[![Codecov](https://img.shields.io/codecov/c/gh/havelessbemore/wait-utils)](https://codecov.io/gh/havelessbemore/wait-utils)
[![Open Bundle](https://deno.bundlejs.com/badge?q=wait-utils&treeshake=[*]&config={%22package.json%22:{%22name%22:%22wait-utils%22}})](https://bundlejs.com/?q=wait-utils&treeshake=%5B*%5D&config=%7B%22package.json%22%3A%7B%22name%22%3A%22wait-utils%22%7D%7D)

## Features

- 🕒 **Accurate delays** with `timeout`, `wait` and `waitUntil`
- 🔁 **Flexible polling** and retry logic with `waitFor`
- 🧪 **100% test coverage** — reliable and verified
- 🧩 **Fully typed** — TypeScript support with minimal generics
- 🧘 **Zero dependencies** — lean and tree-shakable for any runtime

## Installation

NPM:

```bash
npm install wait-utils
```

Yarn:

```bash
yarn add wait-utils
```

JSR:

```bash
jsr add @rojas/wait-utils
```

## API

### `timeout(delay?: number, signal?: AbortSignal): Promise<void>`

Rejects with a `TimeoutError` after the specified delay, unless cancelled by an `AbortSignal`.

#### Parameters

| Name     | Type           | Description                                                        |
|----------|----------------|--------------------------------------------------------------------|
| `delay?`  | `number`       | The number of milliseconds to wait before timing out   |
| `signal?` | `AbortSignal`  | Allows canceling the timeout |

#### Returns

A `Promise<void>` that:

- Resolves if the signal is aborted before the delay
- Rejects with a `TimeoutError` if the full delay completes
- Rethrows an unexpected error if one occurs

#### Example

```ts
import { timeout } from "wait-utils";

const controller = new AbortController();

try {
  await timeout(200, controller.signal);
  console.log("Aborted before timeout.");
} catch (error) {
  if (error.name === "TimeoutError") {
    console.error("Timed out!");
  } else {
    console.error("Unexpected error:", error);
  }
}
```

### `wait(delay, signal?)`

Waits for a given number of milliseconds, unless cancelled by an `AbortSignal`.

#### Parameters

| Name     | Type           | Description                                                        |
|----------|----------------|--------------------------------------------------------------------|
| `delay?`  | `number`      | The number of milliseconds to wait   |
| `signal?` | `AbortSignal` | Allows canceling the wait early |

#### Returns

A `Promise<void>` that:

- Resolves after the delay
- Rejects with the `AbortSignal.reason` if cancelled before the delay

#### Example

```ts
import { wait } from "wait-utils";

await wait(1000); // waits 1 second

const controller = new AbortController();
wait(5000, controller.signal).catch((err) => {
  if (err.name === "AbortError") {
    console.log("Aborted!");
  }
});
controller.abort(); // cancels the wait
```

### `waitFor(callback | delay, options?)`

Repeats a wait until a condition resolves or aborts

#### Parameters

| Name     | Type           | Description                                                        |
|----------|----------------|--------------------------------------------------------------------|
| `delay`  | `number \| () => number \| Promise<number>`      | Fixed delay or a function that returns the delay in ms. Return ≤ 0 to resolve.   |
| `options?` | `WaitForOptions` | Optional settings |

Supported options are:

| Option    | Type                            | Description                                                            |
| --------- | ------------------------------- | ---------------------------------------------------------------------- |
| `signal?`  | `AbortSignal`                   | Cancels the wait early                                                 |
| `timeout?` | `number` (ms)                   | Max total time before a `TimeoutError` is thrown                       |
| `onRetry?` | `(ms: number) => boolean\|void` | Called before each wait; return `false` to stop and throw `RetryError` |

#### Returns

A `Promise<void>` that:

- Resolves once the delay is ≤ 0
- Rejects with the `AbortSignal.reason` if cancelled before the delay
- Rejects with a `RetryError` if `onRetry` returns `false`
- Rejects with a `TimeoutError` if the timeout is triggered before resolving

#### Examples

Fixed delay:

```ts
// Retry every 500ms, until the timeout
await waitFor(500, {
  timeout: 2000,
  onRetry(ms) {
    console.log(`Retrying in ${ms}ms...`);
  },
});
```

Dynamic delay:

```ts
import { waitFor } from "wait-utils";

// 80% wait for 100ms, 20% stop waiting
await waitFor(() => (Math.random() < 0.2 ? 0 : 100));
```

### `waitUntil(timestamp, signal?)`

Waits until the given `performance.now()` timestamp is reached, unless canceled by an `AbortSignal`.

#### Parameters

| Name     | Type           | Description                                                        |
|----------|----------------|--------------------------------------------------------------------|
| `timestamp`  | `number`      | Target timestamp (in milliseconds) relative to `performance.now()`   |
| `signal?` | `AbortSignal` | Allows canceling the wait early |

#### Returns

A `Promise<void>` that:

- Resolves after the given timestamp is reached
- Rejects with the `AbortSignal.reason` if cancelled before the delay

#### Example

```ts
import { waitUntil } from "wait-utils";

const target = performance.now() + 2000;
await waitUntil(target); // waits until ~2s have passed
```

## Errors

- `AbortError`
- `TimeoutError`
- `RetryError`

## License

[MIT](./LICENSE) © [Michael Rojas](https://github.com/havelessbemore)

## Sponsor

If you find this useful, consider [sponsoring on GitHub](https://github.com/sponsors/havelessbemore).
