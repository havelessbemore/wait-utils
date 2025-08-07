# wait-utils

A modern toolkit for delay, timeout, and polling utilities in JavaScript and TypeScript.

[![Version](https://img.shields.io/npm/v/wait-utils.svg)](https://www.npmjs.com/package/wait-utils)
[![Maintenance](https://img.shields.io/maintenance/yes/2025)](https://github.com/havelessbemore/wait-utils/graphs/commit-activity)
[![License](https://img.shields.io/github/license/havelessbemore/wait-utils.svg)](https://github.com/havelessbemore/wait-utils/blob/main/LICENSE)
[![Codecov](https://img.shields.io/codecov/c/gh/havelessbemore/wait-utils)](https://codecov.io/gh/havelessbemore/wait-utils)
[![Open Bundle](https://deno.bundlejs.com/badge?q=wait-utils&treeshake=[*]&config={%22package.json%22:{%22name%22:%22wait-utils%22}})](https://bundlejs.com/?q=wait-utils&treeshake=%5B*%5D&config=%7B%22package.json%22%3A%7B%22name%22%3A%22wait-utils%22%7D%7D)

## Features

- **Rich error handling**
  - `AbortError` for signal-triggered cancellation
  - `TimeoutError` for when an operation exceeds a given timeout

- **Versatile polling** with `poll()`
  - Supports `initialDelay`, dynamic `delay`, and `afterPoll` hooks
  - Full support for `AbortSignal` for clean cancellation

- **Async-friendly scheduling utilities**
  - `setTimeoutAsync` and `setIntervalAsync` for timed operations

- **Flexible delay helpers**:
  - `timeout()` — rejects after a delay unless the signal triggers abort
  - `wait()` — resolves after the delay or rejects if cancelled
  - `waitUntil()` — continues until a given `performance.now()` timestamp, unless cancelled

- Designed TypeScript-first, **zero runtime dependencies**, fully tree‑shakeable

## Documentation

See the [API reference docs](https://github.com/havelessbemore/wait-utils/blob/main/docs/globals.md) for full documentation.

## Installation

NPM:

```bash
npm install wait-utils
```

PNPM:

```bash
pnpm install wait-utils
```

Yarn:

```bash
yarn add wait-utils
```

JSR:

```bash
jsr add @rojas/wait-utils
```

## License

[MIT](./LICENSE) © [Michael Rojas](https://github.com/havelessbemore)

## Sponsor

If you find this useful, consider [sponsoring on GitHub](https://github.com/sponsors/havelessbemore).
