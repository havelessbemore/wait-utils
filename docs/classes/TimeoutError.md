[**wait-utils**](../README.md)

***

[wait-utils](../globals.md) / TimeoutError

# Class: TimeoutError

Defined in: [src/errors/timeoutError.ts:8](https://github.com/havelessbemore/wait-utils/blob/3773ac400372bfb6ee47c30305c3ddfe9e2a73b6/src/errors/timeoutError.ts#L8)

Error thrown when an operation exceeds its allowed time limit.

This error is used in asynchronous operations to indicate
that the operation took too long to complete and was
terminated based on a timeout setting.

## Extends

- `DOMException`

## Constructors

### Constructor

> **new TimeoutError**(`message`): `TimeoutError`

Defined in: [src/errors/timeoutError.ts:9](https://github.com/havelessbemore/wait-utils/blob/3773ac400372bfb6ee47c30305c3ddfe9e2a73b6/src/errors/timeoutError.ts#L9)

#### Parameters

##### message

`string` = `"This operation was timed out"`

#### Returns

`TimeoutError`

#### Overrides

`DOMException.constructor`

## Properties

### ABORT\_ERR

> `readonly` **ABORT\_ERR**: `20`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8622

#### Inherited from

`DOMException.ABORT_ERR`

***

### ~~code~~

> `readonly` **code**: `number`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8590

The **`code`** read-only property of the DOMException interface returns one of the legacy error code constants, or `0` if none match.

#### Deprecated

[MDN Reference](https://developer.mozilla.org/docs/Web/API/DOMException/code)

#### Inherited from

`DOMException.code`

***

### DATA\_CLONE\_ERR

> `readonly` **DATA\_CLONE\_ERR**: `25`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8627

#### Inherited from

`DOMException.DATA_CLONE_ERR`

***

### DOMSTRING\_SIZE\_ERR

> `readonly` **DOMSTRING\_SIZE\_ERR**: `2`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8604

#### Inherited from

`DOMException.DOMSTRING_SIZE_ERR`

***

### HIERARCHY\_REQUEST\_ERR

> `readonly` **HIERARCHY\_REQUEST\_ERR**: `3`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8605

#### Inherited from

`DOMException.HIERARCHY_REQUEST_ERR`

***

### INDEX\_SIZE\_ERR

> `readonly` **INDEX\_SIZE\_ERR**: `1`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8603

#### Inherited from

`DOMException.INDEX_SIZE_ERR`

***

### INUSE\_ATTRIBUTE\_ERR

> `readonly` **INUSE\_ATTRIBUTE\_ERR**: `10`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8612

#### Inherited from

`DOMException.INUSE_ATTRIBUTE_ERR`

***

### INVALID\_ACCESS\_ERR

> `readonly` **INVALID\_ACCESS\_ERR**: `15`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8617

#### Inherited from

`DOMException.INVALID_ACCESS_ERR`

***

### INVALID\_CHARACTER\_ERR

> `readonly` **INVALID\_CHARACTER\_ERR**: `5`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8607

#### Inherited from

`DOMException.INVALID_CHARACTER_ERR`

***

### INVALID\_MODIFICATION\_ERR

> `readonly` **INVALID\_MODIFICATION\_ERR**: `13`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8615

#### Inherited from

`DOMException.INVALID_MODIFICATION_ERR`

***

### INVALID\_NODE\_TYPE\_ERR

> `readonly` **INVALID\_NODE\_TYPE\_ERR**: `24`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8626

#### Inherited from

`DOMException.INVALID_NODE_TYPE_ERR`

***

### INVALID\_STATE\_ERR

> `readonly` **INVALID\_STATE\_ERR**: `11`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8613

#### Inherited from

`DOMException.INVALID_STATE_ERR`

***

### message

> `readonly` **message**: `string`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8596

The **`message`** read-only property of the a message or description associated with the given error name.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/DOMException/message)

#### Inherited from

`DOMException.message`

***

### name

> `readonly` **name**: `string`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8602

The **`name`** read-only property of the one of the strings associated with an error name.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/DOMException/name)

#### Inherited from

`DOMException.name`

***

### NAMESPACE\_ERR

> `readonly` **NAMESPACE\_ERR**: `14`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8616

#### Inherited from

`DOMException.NAMESPACE_ERR`

***

### NETWORK\_ERR

> `readonly` **NETWORK\_ERR**: `19`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8621

#### Inherited from

`DOMException.NETWORK_ERR`

***

### NO\_DATA\_ALLOWED\_ERR

> `readonly` **NO\_DATA\_ALLOWED\_ERR**: `6`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8608

#### Inherited from

`DOMException.NO_DATA_ALLOWED_ERR`

***

### NO\_MODIFICATION\_ALLOWED\_ERR

> `readonly` **NO\_MODIFICATION\_ALLOWED\_ERR**: `7`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8609

#### Inherited from

`DOMException.NO_MODIFICATION_ALLOWED_ERR`

***

### NOT\_FOUND\_ERR

> `readonly` **NOT\_FOUND\_ERR**: `8`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8610

#### Inherited from

`DOMException.NOT_FOUND_ERR`

***

### NOT\_SUPPORTED\_ERR

> `readonly` **NOT\_SUPPORTED\_ERR**: `9`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8611

#### Inherited from

`DOMException.NOT_SUPPORTED_ERR`

***

### QUOTA\_EXCEEDED\_ERR

> `readonly` **QUOTA\_EXCEEDED\_ERR**: `22`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8624

#### Inherited from

`DOMException.QUOTA_EXCEEDED_ERR`

***

### SECURITY\_ERR

> `readonly` **SECURITY\_ERR**: `18`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8620

#### Inherited from

`DOMException.SECURITY_ERR`

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

`DOMException.stack`

***

### SYNTAX\_ERR

> `readonly` **SYNTAX\_ERR**: `12`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8614

#### Inherited from

`DOMException.SYNTAX_ERR`

***

### TIMEOUT\_ERR

> `readonly` **TIMEOUT\_ERR**: `23`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8625

#### Inherited from

`DOMException.TIMEOUT_ERR`

***

### TYPE\_MISMATCH\_ERR

> `readonly` **TYPE\_MISMATCH\_ERR**: `17`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8619

#### Inherited from

`DOMException.TYPE_MISMATCH_ERR`

***

### URL\_MISMATCH\_ERR

> `readonly` **URL\_MISMATCH\_ERR**: `21`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8623

#### Inherited from

`DOMException.URL_MISMATCH_ERR`

***

### VALIDATION\_ERR

> `readonly` **VALIDATION\_ERR**: `16`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8618

#### Inherited from

`DOMException.VALIDATION_ERR`

***

### WRONG\_DOCUMENT\_ERR

> `readonly` **WRONG\_DOCUMENT\_ERR**: `4`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8606

#### Inherited from

`DOMException.WRONG_DOCUMENT_ERR`

***

### ABORT\_ERR

> `readonly` `static` **ABORT\_ERR**: `20`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8652

#### Inherited from

`DOMException.ABORT_ERR`

***

### DATA\_CLONE\_ERR

> `readonly` `static` **DATA\_CLONE\_ERR**: `25`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8657

#### Inherited from

`DOMException.DATA_CLONE_ERR`

***

### DOMSTRING\_SIZE\_ERR

> `readonly` `static` **DOMSTRING\_SIZE\_ERR**: `2`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8634

#### Inherited from

`DOMException.DOMSTRING_SIZE_ERR`

***

### HIERARCHY\_REQUEST\_ERR

> `readonly` `static` **HIERARCHY\_REQUEST\_ERR**: `3`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8635

#### Inherited from

`DOMException.HIERARCHY_REQUEST_ERR`

***

### INDEX\_SIZE\_ERR

> `readonly` `static` **INDEX\_SIZE\_ERR**: `1`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8633

#### Inherited from

`DOMException.INDEX_SIZE_ERR`

***

### INUSE\_ATTRIBUTE\_ERR

> `readonly` `static` **INUSE\_ATTRIBUTE\_ERR**: `10`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8642

#### Inherited from

`DOMException.INUSE_ATTRIBUTE_ERR`

***

### INVALID\_ACCESS\_ERR

> `readonly` `static` **INVALID\_ACCESS\_ERR**: `15`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8647

#### Inherited from

`DOMException.INVALID_ACCESS_ERR`

***

### INVALID\_CHARACTER\_ERR

> `readonly` `static` **INVALID\_CHARACTER\_ERR**: `5`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8637

#### Inherited from

`DOMException.INVALID_CHARACTER_ERR`

***

### INVALID\_MODIFICATION\_ERR

> `readonly` `static` **INVALID\_MODIFICATION\_ERR**: `13`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8645

#### Inherited from

`DOMException.INVALID_MODIFICATION_ERR`

***

### INVALID\_NODE\_TYPE\_ERR

> `readonly` `static` **INVALID\_NODE\_TYPE\_ERR**: `24`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8656

#### Inherited from

`DOMException.INVALID_NODE_TYPE_ERR`

***

### INVALID\_STATE\_ERR

> `readonly` `static` **INVALID\_STATE\_ERR**: `11`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8643

#### Inherited from

`DOMException.INVALID_STATE_ERR`

***

### NAMESPACE\_ERR

> `readonly` `static` **NAMESPACE\_ERR**: `14`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8646

#### Inherited from

`DOMException.NAMESPACE_ERR`

***

### NETWORK\_ERR

> `readonly` `static` **NETWORK\_ERR**: `19`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8651

#### Inherited from

`DOMException.NETWORK_ERR`

***

### NO\_DATA\_ALLOWED\_ERR

> `readonly` `static` **NO\_DATA\_ALLOWED\_ERR**: `6`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8638

#### Inherited from

`DOMException.NO_DATA_ALLOWED_ERR`

***

### NO\_MODIFICATION\_ALLOWED\_ERR

> `readonly` `static` **NO\_MODIFICATION\_ALLOWED\_ERR**: `7`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8639

#### Inherited from

`DOMException.NO_MODIFICATION_ALLOWED_ERR`

***

### NOT\_FOUND\_ERR

> `readonly` `static` **NOT\_FOUND\_ERR**: `8`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8640

#### Inherited from

`DOMException.NOT_FOUND_ERR`

***

### NOT\_SUPPORTED\_ERR

> `readonly` `static` **NOT\_SUPPORTED\_ERR**: `9`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8641

#### Inherited from

`DOMException.NOT_SUPPORTED_ERR`

***

### QUOTA\_EXCEEDED\_ERR

> `readonly` `static` **QUOTA\_EXCEEDED\_ERR**: `22`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8654

#### Inherited from

`DOMException.QUOTA_EXCEEDED_ERR`

***

### SECURITY\_ERR

> `readonly` `static` **SECURITY\_ERR**: `18`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8650

#### Inherited from

`DOMException.SECURITY_ERR`

***

### SYNTAX\_ERR

> `readonly` `static` **SYNTAX\_ERR**: `12`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8644

#### Inherited from

`DOMException.SYNTAX_ERR`

***

### TIMEOUT\_ERR

> `readonly` `static` **TIMEOUT\_ERR**: `23`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8655

#### Inherited from

`DOMException.TIMEOUT_ERR`

***

### TYPE\_MISMATCH\_ERR

> `readonly` `static` **TYPE\_MISMATCH\_ERR**: `17`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8649

#### Inherited from

`DOMException.TYPE_MISMATCH_ERR`

***

### URL\_MISMATCH\_ERR

> `readonly` `static` **URL\_MISMATCH\_ERR**: `21`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8653

#### Inherited from

`DOMException.URL_MISMATCH_ERR`

***

### VALIDATION\_ERR

> `readonly` `static` **VALIDATION\_ERR**: `16`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8648

#### Inherited from

`DOMException.VALIDATION_ERR`

***

### WRONG\_DOCUMENT\_ERR

> `readonly` `static` **WRONG\_DOCUMENT\_ERR**: `4`

Defined in: node\_modules/.pnpm/typescript@5.9.2/node\_modules/typescript/lib/lib.dom.d.ts:8636

#### Inherited from

`DOMException.WRONG_DOCUMENT_ERR`
