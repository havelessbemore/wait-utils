# wait-utils

A modern, zero-dependency wait and timing utility toolkit for JavaScript and TypeScript.  
Supports `AbortSignal`, timeouts, retries, and polling — all with first-class TypeScript types.

[![Version](https://img.shields.io/npm/v/wait-utils.svg)](https://www.npmjs.com/package/wait-utils)
[![Maintenance](https://img.shields.io/maintenance/yes/2025)](https://github.com/havelessbemore/wait-utils/graphs/commit-activity)
[![License](https://img.shields.io/github/license/havelessbemore/wait-utils.svg)](https://github.com/havelessbemore/wait-utils/blob/master/LICENSE)
[![Codecov](https://img.shields.io/codecov/c/gh/havelessbemore/wait-utils)](https://codecov.io/gh/havelessbemore/wait-utils)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/wait-utils)

## Features

- 🕒 Precise delay utilities (`wait`, `waitUntil`)
- 🔁 Retry and polling with `waitFor`
- 🛑 Abortable via `AbortSignal`
- ⏱️ Timeout-safe and race-proof
- 🧪 100% unit test coverage
- 🧩 Fully typed (TypeScript)
- 🧘 Zero dependencies

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

## Usage

### `wait(delay, signal?)`

Waits for a given number of milliseconds. Supports cancellation via `AbortSignal`.

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

### `waitUntil(timestamp, signal?)`

Waits until the given `performance.now()` timestamp is reached.

```ts
import { waitUntil } from "wait-utils";

const target = performance.now() + 2000;
await waitUntil(target); // waits until ~2s have passed
```

### `waitFor(callback | delay, options?)`

Repeats a wait until a condition resolves or aborts:

```ts
import { waitFor } from "wait-utils";

await waitFor(() => (Math.random() < 0.2 ? 0 : 100)); // retry every 100ms
```

Or use a fixed delay:

```ts
await waitFor(500, {
  timeout: 5000,
  onRetry(ms) {
    console.log(`Retrying in ${ms}ms...`);
  },
});
```

## Options

All utilities that accept `AbortSignal` will throw an `AbortError` if the operation is aborted.

`waitFor` additionally supports:

| Option    | Type                            | Description                                                            |
| --------- | ------------------------------- | ---------------------------------------------------------------------- |
| `signal`  | `AbortSignal`                   | Cancels the wait early                                                 |
| `timeout` | `number` (ms)                   | Max total time before a `TimeoutError` is thrown                       |
| `onRetry` | `(ms: number) => boolean\|void` | Called before each wait; return `false` to stop and throw `RetryError` |

## Errors

These custom error types are exported:

- `AbortError` – thrown when cancelled via `AbortSignal`. Extends `DOMException`.
- `TimeoutError` – thrown when a wait exceeds `timeout`. Extends `DOMException`.
- `RetryError` – thrown when `onRetry` returns `false`. Extends `Error`.

## License

[MIT](./LICENSE) © [Michael Rojas](https://github.com/havelessbemore)

## Sponsor

If you find this useful, consider [sponsoring on GitHub](https://github.com/sponsors/havelessbemore).
