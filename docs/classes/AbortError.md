[**wait-utils**](../README.md)

***

[wait-utils](../globals.md) / AbortError

# Class: AbortError

Defined in: [src/errors/abortError.ts:8](https://github.com/havelessbemore/wait-utils/blob/f8bff5b47c64f45aba9b31f67688196f18b2c467/src/errors/abortError.ts#L8)

Error thrown when an operation is aborted via an `AbortSignal`.

This error is used in asynchronous operations
to indicate that the caller explicitly cancelled
the request by invoking `AbortController.abort()`.

## Extends

- `DOMException`

## Constructors

### Constructor

> **new AbortError**(`message`): `AbortError`

Defined in: [src/errors/abortError.ts:9](https://github.com/havelessbemore/wait-utils/blob/f8bff5b47c64f45aba9b31f67688196f18b2c467/src/errors/abortError.ts#L9)

#### Parameters

##### message

`string` = `"This operation was aborted"`

#### Returns

`AbortError`

#### Overrides

`DOMException.constructor`

## Properties

### ABORT\_ERR

> `readonly` **ABORT\_ERR**: `20`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6561

#### Inherited from

`DOMException.ABORT_ERR`

***

### ~~code~~

> `readonly` **code**: `number`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6537

#### Deprecated

[MDN Reference](https://developer.mozilla.org/docs/Web/API/DOMException/code)

#### Inherited from

`DOMException.code`

***

### DATA\_CLONE\_ERR

> `readonly` **DATA\_CLONE\_ERR**: `25`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6566

#### Inherited from

`DOMException.DATA_CLONE_ERR`

***

### DOMSTRING\_SIZE\_ERR

> `readonly` **DOMSTRING\_SIZE\_ERR**: `2`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6543

#### Inherited from

`DOMException.DOMSTRING_SIZE_ERR`

***

### HIERARCHY\_REQUEST\_ERR

> `readonly` **HIERARCHY\_REQUEST\_ERR**: `3`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6544

#### Inherited from

`DOMException.HIERARCHY_REQUEST_ERR`

***

### INDEX\_SIZE\_ERR

> `readonly` **INDEX\_SIZE\_ERR**: `1`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6542

#### Inherited from

`DOMException.INDEX_SIZE_ERR`

***

### INUSE\_ATTRIBUTE\_ERR

> `readonly` **INUSE\_ATTRIBUTE\_ERR**: `10`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6551

#### Inherited from

`DOMException.INUSE_ATTRIBUTE_ERR`

***

### INVALID\_ACCESS\_ERR

> `readonly` **INVALID\_ACCESS\_ERR**: `15`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6556

#### Inherited from

`DOMException.INVALID_ACCESS_ERR`

***

### INVALID\_CHARACTER\_ERR

> `readonly` **INVALID\_CHARACTER\_ERR**: `5`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6546

#### Inherited from

`DOMException.INVALID_CHARACTER_ERR`

***

### INVALID\_MODIFICATION\_ERR

> `readonly` **INVALID\_MODIFICATION\_ERR**: `13`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6554

#### Inherited from

`DOMException.INVALID_MODIFICATION_ERR`

***

### INVALID\_NODE\_TYPE\_ERR

> `readonly` **INVALID\_NODE\_TYPE\_ERR**: `24`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6565

#### Inherited from

`DOMException.INVALID_NODE_TYPE_ERR`

***

### INVALID\_STATE\_ERR

> `readonly` **INVALID\_STATE\_ERR**: `11`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6552

#### Inherited from

`DOMException.INVALID_STATE_ERR`

***

### message

> `readonly` **message**: `string`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6539

[MDN Reference](https://developer.mozilla.org/docs/Web/API/DOMException/message)

#### Inherited from

`DOMException.message`

***

### name

> `readonly` **name**: `string`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6541

[MDN Reference](https://developer.mozilla.org/docs/Web/API/DOMException/name)

#### Inherited from

`DOMException.name`

***

### NAMESPACE\_ERR

> `readonly` **NAMESPACE\_ERR**: `14`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6555

#### Inherited from

`DOMException.NAMESPACE_ERR`

***

### NETWORK\_ERR

> `readonly` **NETWORK\_ERR**: `19`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6560

#### Inherited from

`DOMException.NETWORK_ERR`

***

### NO\_DATA\_ALLOWED\_ERR

> `readonly` **NO\_DATA\_ALLOWED\_ERR**: `6`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6547

#### Inherited from

`DOMException.NO_DATA_ALLOWED_ERR`

***

### NO\_MODIFICATION\_ALLOWED\_ERR

> `readonly` **NO\_MODIFICATION\_ALLOWED\_ERR**: `7`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6548

#### Inherited from

`DOMException.NO_MODIFICATION_ALLOWED_ERR`

***

### NOT\_FOUND\_ERR

> `readonly` **NOT\_FOUND\_ERR**: `8`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6549

#### Inherited from

`DOMException.NOT_FOUND_ERR`

***

### NOT\_SUPPORTED\_ERR

> `readonly` **NOT\_SUPPORTED\_ERR**: `9`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6550

#### Inherited from

`DOMException.NOT_SUPPORTED_ERR`

***

### QUOTA\_EXCEEDED\_ERR

> `readonly` **QUOTA\_EXCEEDED\_ERR**: `22`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6563

#### Inherited from

`DOMException.QUOTA_EXCEEDED_ERR`

***

### SECURITY\_ERR

> `readonly` **SECURITY\_ERR**: `18`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6559

#### Inherited from

`DOMException.SECURITY_ERR`

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

`DOMException.stack`

***

### SYNTAX\_ERR

> `readonly` **SYNTAX\_ERR**: `12`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6553

#### Inherited from

`DOMException.SYNTAX_ERR`

***

### TIMEOUT\_ERR

> `readonly` **TIMEOUT\_ERR**: `23`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6564

#### Inherited from

`DOMException.TIMEOUT_ERR`

***

### TYPE\_MISMATCH\_ERR

> `readonly` **TYPE\_MISMATCH\_ERR**: `17`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6558

#### Inherited from

`DOMException.TYPE_MISMATCH_ERR`

***

### URL\_MISMATCH\_ERR

> `readonly` **URL\_MISMATCH\_ERR**: `21`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6562

#### Inherited from

`DOMException.URL_MISMATCH_ERR`

***

### VALIDATION\_ERR

> `readonly` **VALIDATION\_ERR**: `16`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6557

#### Inherited from

`DOMException.VALIDATION_ERR`

***

### WRONG\_DOCUMENT\_ERR

> `readonly` **WRONG\_DOCUMENT\_ERR**: `4`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6545

#### Inherited from

`DOMException.WRONG_DOCUMENT_ERR`

***

### ABORT\_ERR

> `readonly` `static` **ABORT\_ERR**: `20`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6591

#### Inherited from

`DOMException.ABORT_ERR`

***

### DATA\_CLONE\_ERR

> `readonly` `static` **DATA\_CLONE\_ERR**: `25`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6596

#### Inherited from

`DOMException.DATA_CLONE_ERR`

***

### DOMSTRING\_SIZE\_ERR

> `readonly` `static` **DOMSTRING\_SIZE\_ERR**: `2`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6573

#### Inherited from

`DOMException.DOMSTRING_SIZE_ERR`

***

### HIERARCHY\_REQUEST\_ERR

> `readonly` `static` **HIERARCHY\_REQUEST\_ERR**: `3`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6574

#### Inherited from

`DOMException.HIERARCHY_REQUEST_ERR`

***

### INDEX\_SIZE\_ERR

> `readonly` `static` **INDEX\_SIZE\_ERR**: `1`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6572

#### Inherited from

`DOMException.INDEX_SIZE_ERR`

***

### INUSE\_ATTRIBUTE\_ERR

> `readonly` `static` **INUSE\_ATTRIBUTE\_ERR**: `10`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6581

#### Inherited from

`DOMException.INUSE_ATTRIBUTE_ERR`

***

### INVALID\_ACCESS\_ERR

> `readonly` `static` **INVALID\_ACCESS\_ERR**: `15`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6586

#### Inherited from

`DOMException.INVALID_ACCESS_ERR`

***

### INVALID\_CHARACTER\_ERR

> `readonly` `static` **INVALID\_CHARACTER\_ERR**: `5`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6576

#### Inherited from

`DOMException.INVALID_CHARACTER_ERR`

***

### INVALID\_MODIFICATION\_ERR

> `readonly` `static` **INVALID\_MODIFICATION\_ERR**: `13`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6584

#### Inherited from

`DOMException.INVALID_MODIFICATION_ERR`

***

### INVALID\_NODE\_TYPE\_ERR

> `readonly` `static` **INVALID\_NODE\_TYPE\_ERR**: `24`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6595

#### Inherited from

`DOMException.INVALID_NODE_TYPE_ERR`

***

### INVALID\_STATE\_ERR

> `readonly` `static` **INVALID\_STATE\_ERR**: `11`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6582

#### Inherited from

`DOMException.INVALID_STATE_ERR`

***

### NAMESPACE\_ERR

> `readonly` `static` **NAMESPACE\_ERR**: `14`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6585

#### Inherited from

`DOMException.NAMESPACE_ERR`

***

### NETWORK\_ERR

> `readonly` `static` **NETWORK\_ERR**: `19`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6590

#### Inherited from

`DOMException.NETWORK_ERR`

***

### NO\_DATA\_ALLOWED\_ERR

> `readonly` `static` **NO\_DATA\_ALLOWED\_ERR**: `6`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6577

#### Inherited from

`DOMException.NO_DATA_ALLOWED_ERR`

***

### NO\_MODIFICATION\_ALLOWED\_ERR

> `readonly` `static` **NO\_MODIFICATION\_ALLOWED\_ERR**: `7`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6578

#### Inherited from

`DOMException.NO_MODIFICATION_ALLOWED_ERR`

***

### NOT\_FOUND\_ERR

> `readonly` `static` **NOT\_FOUND\_ERR**: `8`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6579

#### Inherited from

`DOMException.NOT_FOUND_ERR`

***

### NOT\_SUPPORTED\_ERR

> `readonly` `static` **NOT\_SUPPORTED\_ERR**: `9`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6580

#### Inherited from

`DOMException.NOT_SUPPORTED_ERR`

***

### QUOTA\_EXCEEDED\_ERR

> `readonly` `static` **QUOTA\_EXCEEDED\_ERR**: `22`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6593

#### Inherited from

`DOMException.QUOTA_EXCEEDED_ERR`

***

### SECURITY\_ERR

> `readonly` `static` **SECURITY\_ERR**: `18`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6589

#### Inherited from

`DOMException.SECURITY_ERR`

***

### SYNTAX\_ERR

> `readonly` `static` **SYNTAX\_ERR**: `12`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6583

#### Inherited from

`DOMException.SYNTAX_ERR`

***

### TIMEOUT\_ERR

> `readonly` `static` **TIMEOUT\_ERR**: `23`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6594

#### Inherited from

`DOMException.TIMEOUT_ERR`

***

### TYPE\_MISMATCH\_ERR

> `readonly` `static` **TYPE\_MISMATCH\_ERR**: `17`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6588

#### Inherited from

`DOMException.TYPE_MISMATCH_ERR`

***

### URL\_MISMATCH\_ERR

> `readonly` `static` **URL\_MISMATCH\_ERR**: `21`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6592

#### Inherited from

`DOMException.URL_MISMATCH_ERR`

***

### VALIDATION\_ERR

> `readonly` `static` **VALIDATION\_ERR**: `16`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6587

#### Inherited from

`DOMException.VALIDATION_ERR`

***

### WRONG\_DOCUMENT\_ERR

> `readonly` `static` **WRONG\_DOCUMENT\_ERR**: `4`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6575

#### Inherited from

`DOMException.WRONG_DOCUMENT_ERR`
