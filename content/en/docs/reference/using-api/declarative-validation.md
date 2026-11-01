---
title: Declarative API Validation
reviewers:
- aaron-prindle
- yongruilin
- jpbetz
- thockin
content_type: concept
weight: 20
---

<!-- overview -->

{{< feature-state feature_gate_name="DeclarativeValidation" >}}

Kubernetes {{< skew currentVersion >}} uses _declarative validation_ for a
growing set of APIs. Instead of hand-written Go code (`validation.go`), API
authors declare validation rules as comment tags on the type definitions
(`types.go`), for example `+k8s:minimum=0`. A code generator,
`validation-gen`, turns those tags into validation code.

This mainly affects Kubernetes contributors and authors of
[extension API servers](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/),
but cluster administrators should know how it behaves while existing
hand-written validation is being migrated.

<!-- body -->

## Validation lifecycle {#lifecycle}

On new API fields, use a tag directly, such as `+k8s:minimum=1`. These are
always enforced.

Migrating an *existing* hand-written validation is riskier, because the
generated code must behave exactly like the code it replaces. Those migrations
wrap the tag in a _lifecycle prefix_ (`+k8s:alpha` or `+k8s:beta`) that controls
whether the declarative result is authoritative.

{{< table caption="Behavior of a declarative validation tag by lifecycle prefix" >}}

| Tag form | Behavior |
| --- | --- |
| `+k8s:minimum=1` (no prefix) | **Enforced.** The declarative result is authoritative. |
| `+k8s:beta(since:"1.37")=+k8s:minimum=1` | **Enforced** when the `DeclarativeValidationBeta` feature gate is enabled (the default), and shadowed otherwise. |
| `+k8s:alpha(since:"1.36")=+k8s:minimum=1` | **Always shadowed.** Hand-written validation remains authoritative. |

{{< /table >}}

In _shadow mode_, declarative validation still runs, but the API server does not
return its errors. It compares them against the hand-written errors and logs and
counts any difference, so a migrated rule can be evaluated on a live cluster
before it starts rejecting requests.

## Feature gates

* [`DeclarativeValidation`](/docs/reference/command-line-tools-reference/feature-gates/#DeclarativeValidation):
  makes the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
  compare declarative and hand-written results for `+k8s:alpha` and `+k8s:beta`
  rules and report mismatches. Declarative validation runs either way; this gate
  only controls reporting.

* [`DeclarativeValidationBeta`](/docs/reference/command-line-tools-reference/feature-gates/#DeclarativeValidationBeta):
  the global safety switch for `+k8s:beta` rules. Enabled, they are enforced;
  disabled, they fall back to shadow mode.

* [`DeclarativeValidationTakeover`](/docs/reference/command-line-tools-reference/feature-gates/#DeclarativeValidationTakeover):
  replaced by `DeclarativeValidationBeta` and no longer honored. Setting it is
  still accepted.

{{< alert color="info" title="Note" >}}
No gate affects unprefixed tags. The API server always enforces those, because
their hand-written counterparts are already gone.
{{< /alert >}}

See [Feature Gates](/docs/reference/command-line-tools-reference/feature-gates/)
for how to set them.

## Monitoring declarative validation {#metrics}

The API server exposes these metrics:

{{< table caption="Metrics for declarative validation" >}}

| Metric | Description |
| --- | --- |
| `declarative_validation_mismatch_total` | Number of times declarative validation results differed from hand-written validation results. |
| `declarative_validation_parity_discrepancies_total` | The same discrepancies, with a `validation_identifier` label that records the group, version, kind, subresource, and operation. |
| `declarative_validation_panic_total` | Number of times declarative validation panicked. |
| `declarative_validation_panics_total` | The same panics, with a `validation_identifier` label. |

{{< /table >}}

Mismatches are also logged. For an enforced (`+k8s:beta`) rule, the log entry
suggests disabling `DeclarativeValidationBeta` to keep data in etcd consistent
with earlier versions of Kubernetes.

## Disabling DeclarativeValidationBeta {#opt-out}

Consider setting `DeclarativeValidationBeta=false` if you see:

* **Unexpected validation behavior:** requests rejected that should be valid, or
  objects accepted that were previously rejected.

* **Performance regressions:** latency increases (for example, in
  `apiserver_request_duration_seconds`) that correlate with the feature.

* **A high mismatch rate:** frequent `declarative_validation_mismatch_total`
  increments affecting your workloads.

To revert `+k8s:beta` rules to shadow mode, pass
`--feature-gates=DeclarativeValidationBeta=false`.

## Considerations for downgrade and rollback

Disabling the gate is a safety mechanism, but note one unlikely edge case: if a
bug let declarative validation persist an invalid object, disabling the gate
makes the correct hand-written validation authoritative again, which can then
block further updates to that object. Fixing it may require editing the stored
object directly.

## Declarative validation tags {#declarative-validation-tag-reference}

### How to read this reference {#how-to-read}

Each tag has a **stability level** — Alpha, Beta, or Stable — describing the
maturity of the *tag itself*. This is separate from the `+k8s:alpha` and
`+k8s:beta` [lifecycle prefixes](#lifecycle), which describe the maturity of one
*use* of a tag.

The generator's linter uses the stability level to decide where a tag is
allowed:

* In a GA package (for example, `v1`), an unprefixed tag must be Stable.

* In a `beta` package, unprefixed Beta tags are also allowed.

* In an `alpha` package, unprefixed Alpha and Beta tags are also allowed.

* Inside `+k8s:alpha=...`, Alpha tags are allowed; inside `+k8s:beta=...`, Beta
  tags are.

* Inside `+k8s:ifEnabled(...)` or `+k8s:ifDisabled(...)`, Beta tags are allowed
  even in a GA package, because an option already gates the validation.

Each entry also lists the **scopes** where the tag can appear: struct fields,
type definitions, list values, map keys, map values, or constant values.

{{< alert color="info" title="Note" >}}
The generator also registers tags that exist only to test itself
(`+k8s:validateTrue`, `+k8s:validateFalse`, `+k8s:validateError`,
`+k8s:validateTrueAlpha`, `+k8s:validateTrueBeta`). Do not use them in API
definitions. For the authoritative list for a given release, run
`validation-gen --docs` from `k8s.io/code-generator`.
{{< /alert >}}

### Tag catalog {#catalog}

{{< table caption="Declarative validation tags" >}}

| Tag | Description | Stability |
| --- | --- | --- |
| [`+k8s:alpha`](#tag-alpha) | Puts a validation tag in shadow mode (metrics only). | Beta |
| [`+k8s:beta`](#tag-beta) | Puts a validation tag in enforced mode (disableable through `DeclarativeValidationBeta`). | Beta |
| [`+k8s:customUnique`](#tag-customUnique) | Indicates that hand-written validation checks uniqueness for a list. | Stable |
| [`+k8s:customValidation`](#tag-customValidation) | Calls a hand-written validation function from the generated traversal code. | Stable |
| [`+k8s:dependentForbidden`](#tag-dependentForbidden) | Indicates that when this field is set, a named sibling field must not be set. | Alpha |
| [`+k8s:dependentRequired`](#tag-dependentRequired) | Indicates that when this field is set, a named sibling field must also be set. | Alpha |
| [`+k8s:eachKey`](#tag-eachKey) | Declares a validation for each key in a map. | Stable |
| [`+k8s:eachVal`](#tag-eachVal) | Declares a validation for each value in a map or list. | Stable |
| [`+k8s:enum`](#tag-enum) | Indicates that a string type is an enum. | Stable |
| [`+k8s:enumExclude`](#tag-enumExclude) | Excludes a constant from its type's enum values. | Alpha |
| [`+k8s:forbidden`](#tag-forbidden) | Indicates that a field may not be specified. | Beta |
| [`+k8s:format`](#tag-format) | Indicates that a string field has a particular format. | Stable |
| [`+k8s:ifDisabled`](#tag-ifDisabled) | Declares a validation that only applies when an option is disabled. | Stable |
| [`+k8s:ifEnabled`](#tag-ifEnabled) | Declares a validation that only applies when an option is enabled. | Stable |
| [`+k8s:ifMode`](#tag-ifMode) | Declares a validation that only applies for a given value of a mode discriminator. | Stable |
| [`+k8s:immutable`](#tag-immutable) | Indicates that a field may not be updated. | Stable |
| [`+k8s:isSubresource`](#tag-isSubresource) | Specifies that validations in a package only apply to a specific subresource. | Stable |
| [`+k8s:item`](#tag-item) | Declares a validation for an item of a slice declared as a `+k8s:listType=map`. | Stable |
| [`+k8s:listMapKey`](#tag-listMapKey) | Declares a named sub-field of a list's value-type to be part of the list-map key. | Stable |
| [`+k8s:listType`](#tag-listType) | Declares a list field's semantic type. | Stable |
| [`+k8s:maxBytes`](#tag-maxBytes) | Indicates that a string field has a limit on its length in bytes. | Stable |
| [`+k8s:maxItems`](#tag-maxItems) | Indicates that a list has a limit on its size. | Stable |
| [`+k8s:maxLength`](#tag-maxLength) | Indicates that a string field has a limit on its length in characters. | Stable |
| [`+k8s:maxProperties`](#tag-maxProperties) | Indicates that a map has a limit on the number of entries. | Stable |
| [`+k8s:maximum`](#tag-maximum) | Indicates that a numeric field has a maximum value. | Stable |
| [`+k8s:minItems`](#tag-minItems) | Indicates that a list has a minimum size. | Stable |
| [`+k8s:minLength`](#tag-minLength) | Indicates that a string field has a minimum length in characters. | Stable |
| [`+k8s:minProperties`](#tag-minProperties) | Indicates that a map has a minimum number of entries. | Stable |
| [`+k8s:minimum`](#tag-minimum) | Indicates that a numeric field has a minimum value. | Stable |
| [`+k8s:modeDiscriminator`](#tag-modeDiscriminator) | Indicates that this field is a discriminator for state-based validation. | Stable |
| [`+k8s:monotonic`](#tag-monotonic) | Ensures that a field's value never decreases on update. | Alpha |
| [`+k8s:neq`](#tag-neq) | Verifies that the field's value is not equal to a specific disallowed value. | Alpha |
| [`+k8s:opaqueType`](#tag-opaqueType) | Indicates that the generator ignores any validations declared on the referenced type. | Stable |
| [`+k8s:optional`](#tag-optional) | Indicates that a field is optional to clients. | Stable |
| [`+k8s:required`](#tag-required) | Indicates that a field must be specified by clients. | Stable |
| [`+k8s:subfield`](#tag-subfield) | Declares a validation for a subfield of a struct. | Stable |
| [`+k8s:supportsSubresource`](#tag-supportsSubresource) | Declares a supported subresource for the types within a package. | Stable |
| [`+k8s:unionDiscriminator`](#tag-unionDiscriminator) | Indicates that this field is the discriminator for a union. | Beta |
| [`+k8s:unionMember`](#tag-unionMember) | Indicates that this field is a member of a union group. | Stable |
| [`+k8s:unique`](#tag-unique) | Declares that a list field's elements are unique. | Stable |
| [`+k8s:update`](#tag-update) | Constrains which update transitions are allowed for a field. | Stable |
| [`+k8s:zeroOrOneOfMember`](#tag-zeroOrOneOfMember) | Indicates that this field is a member of a zero-or-one-of group. | Stable |

{{< /table >}}

## Tag reference

### `+k8s:alpha` {#tag-alpha}

**Description:**

Puts a validation rule in _shadow mode_, the first phase of the
[validation lifecycle](#lifecycle). Use it only when migrating existing
hand-written validation, not on new fields.

The hand-written validation stays authoritative; the declarative rule runs
alongside it, and mismatches and panics are recorded as
[metrics](#metrics). This confirms the two behave identically before you
promote the rule to Beta.

The API server never enforces `+k8s:alpha` rules, regardless of feature gates.

**Stability level:** Beta

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Arguments:**

* `since` (string, optional): the Kubernetes version in which the validation was
  first shadowed.

**Payload:**

* `<validation-tag>` (required): the declarative validation tag to shadow.

**Usage example:**

```go
type MyStruct struct {
    // +k8s:alpha(since:"1.36")=+k8s:minimum=1
    MyField int `json:"myField"`
}
```

### `+k8s:beta` {#tag-beta}

**Description:**

Puts a migrated validation rule in _enforced mode_, the second phase of the
[validation lifecycle](#lifecycle). Use it only when migrating existing
hand-written validation, not on new fields.

When `DeclarativeValidationBeta` is enabled (the default), the rule is
authoritative and the API server drops the hand-written errors it covers.
Disabling the gate reverts the rule to shadow mode.

**Stability level:** Beta

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Arguments:**

* `since` (string, optional): the Kubernetes version in which the validation was
  promoted to Beta.

**Payload:**

* `<validation-tag>` (required): the declarative validation tag to enforce.

**Usage example:**

```go
type MyStruct struct {
    // +k8s:beta(since:"1.37")=+k8s:minimum=1
    MyField int `json:"myField"`
}
```

### `+k8s:customUnique` {#tag-customUnique}

**Description:**

Indicates that custom, hand-written validation implements uniqueness validation
for this list. This disables generation of uniqueness validation for the list,
which `+k8s:listType=set`, `+k8s:listType=map`, and [`+k8s:unique`](#tag-unique)
otherwise imply.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Usage example:**

```go
type MyStruct struct {
    // +k8s:listType=map
    // +k8s:listMapKey=key
    // +k8s:customUnique
    MyList []Item `json:"myList"`
}
```

In this example, the generator records that `MyList` is a list-map but does not
emit a uniqueness check for it; hand-written code is responsible for that check.

### `+k8s:customValidation` {#tag-customValidation}

**Description:**

Calls a hand-written validation function from the generated traversal code. Use
this for logic that you cannot express with the other tags.

The function must live in the generated package, with the following signature:

```go
func(ctx context.Context, op operation.Operation, fldPath *field.Path, value, oldValue <ValueType>) field.ErrorList
```

`<ValueType>` is the value's type made nilable: a pointer such as `*string`, or
the type itself if already nilable (slice, map, pointer). Each generated package
needs its own definition, because each copy calls the function beside it.

In the function name, `<Type>` and `<Field>` are Go identifiers (`Replicas`, not
`replicas`):

* Field scope: `ValidateCustom_<Type>_<Field>` validates one field. On update,
  it is skipped when that field is unchanged.

* Type scope: `ValidateCustom_<Type>` checks across fields. It is *not* skipped
  on update, so an expensive check should return early when `value` and
  `oldValue` are equal.

For per-element checks, tag the element type, or use field scope and loop inside
the function.

**Stability level:** Stable

**Scopes:** struct fields, type definitions

**Usage example:**

```go
// +k8s:customValidation
type MyStruct struct {
    // +k8s:customValidation
    StringField string `json:"stringField"`

    // Both validations run on this field.
    // +k8s:maxLength=3
    // +k8s:customValidation
    MaxLengthField string `json:"maxLengthField"`
}
```

### `+k8s:dependentForbidden` {#tag-dependentForbidden}

**Description:**

Indicates that when this field is set, the named sibling field must not be set.
A field counts as "set" when it is a non-nil pointer, a non-empty slice or map,
or a non-zero builtin. Dependencies are one-directional. Repeat the tag to
forbid multiple siblings.

**Stability level:** Alpha

**Scopes:** struct fields

**Arguments:**

* `<sibling-field-json-name>` (string, required): the JSON name of the sibling
  field.

**Usage example:**

```go
type MyStruct struct {
    // +k8s:optional
    // +k8s:dependentForbidden("dependentA")
    // +k8s:dependentForbidden("dependentB")
    Trigger *string `json:"trigger"`

    // +k8s:optional
    DependentA *string `json:"dependentA"`

    // +k8s:optional
    DependentB *string `json:"dependentB"`
}
```

In this example, if `trigger` is set, neither `dependentA` nor `dependentB` may
be set.

### `+k8s:dependentRequired` {#tag-dependentRequired}

**Description:**

Indicates that when this field is set, the named sibling field must also be set.
A field counts as "set" when it is a non-nil pointer, a non-empty slice or map,
or a non-zero builtin. Dependencies are one-directional. Repeat the tag to
require multiple siblings.

**Stability level:** Alpha

**Scopes:** struct fields

**Arguments:**

* `<sibling-field-json-name>` (string, required): the JSON name of the sibling
  field.

**Usage example:**

```go
type MyStruct struct {
    // +k8s:optional
    // +k8s:dependentRequired("dependent")
    Trigger *string `json:"trigger"`

    // +k8s:optional
    Dependent *string `json:"dependent"`
}
```

In this example, if `trigger` is set, `dependent` must also be set. Setting
`dependent` alone is allowed.

### `+k8s:eachKey` {#tag-eachKey}

**Description:**

Declares a validation for each key in a map.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Payload:**

* `<validation-tag>` (required): the tag to evaluate for each key.

**Usage example:**

```go
type MyStruct struct {
    // +k8s:eachKey=+k8s:minimum=1
    MyMap map[int]string `json:"myMap"`
}
```

### `+k8s:eachVal` {#tag-eachVal}

**Description:**

Declares a validation for each value in a map or list.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Payload:**

* `<validation-tag>` (required): the tag to evaluate for each value.

**Usage example:**

```go
type MyStruct struct {
    // +k8s:eachVal=+k8s:minimum=1
    MyMap map[string]int `json:"myMap"`

    // +k8s:eachVal=+k8s:maxLength=10
    MyList []string `json:"myList"`
}
```

### `+k8s:enum` {#tag-enum}

**Description:**

Indicates that a string type is an enum. All constant values of this type are
values in the enum, unless you exclude them with
[`+k8s:enumExclude`](#tag-enumExclude).

**Stability level:** Stable

**Scopes:** type definitions

**Usage example:**

First, define a new string type and some constants of that type:

```go
// +k8s:enum
type MyEnum string

const (
    MyEnumA MyEnum = "A"
    MyEnumB MyEnum = "B"
)
```

Then, use this type in another struct:

```go
type MyStruct struct {
    MyField MyEnum `json:"myField"`
}
```

The validation logic ensures that `MyField` is one of the defined enum values
(`"A"` or `"B"`).

### `+k8s:enumExclude` {#tag-enumExclude}

**Description:**

Indicates that a constant value is not part of an enum, even if the constant's
type has the `+k8s:enum` tag. You can make the exclusion conditional by nesting
the tag inside [`+k8s:ifEnabled`](#tag-ifEnabled) or
[`+k8s:ifDisabled`](#tag-ifDisabled). If you use several conditional tags, the
generator excludes the value if *any* of the conditions is met.

**Stability level:** Alpha

**Scopes:** constant values

**Usage example:**

```go
// +k8s:enum
type MyEnum string

const (
    MyEnumA MyEnum = "A"

    // Never a valid value.
    // +k8s:enumExclude
    MyEnumB MyEnum = "B"

    // Only a valid value while "MyFeature" is disabled.
    // +k8s:ifEnabled(MyFeature)=+k8s:enumExclude
    MyEnumC MyEnum = "C"
)
```

### `+k8s:forbidden` {#tag-forbidden}

**Description:**

Indicates that a field may not be specified.

**Stability level:** Beta

**Scopes:** struct fields

**Usage example:**

```go
type MyStruct struct {
    // +k8s:forbidden
    MyField string `json:"myField"`
}
```

### `+k8s:format` {#tag-format}

**Description:**

Indicates that a string field has a particular format.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Payloads:**

{{< table caption="Supported payloads for the k8s:format tag" >}}

| Payload | Meaning |
| --- | --- |
| `k8s-extended-resource-name` | A Kubernetes extended resource name: a domain-prefixed name that must not have a `kubernetes.io` or `requests.` prefix. When you prepend `requests.`, the result must be a valid label key, as used by quota. |
| `k8s-label-key` | A Kubernetes label key. |
| `k8s-label-value` | A Kubernetes label value. |
| `k8s-long-name` | A Kubernetes "long name", aka a "DNS subdomain" value. |
| `k8s-long-name-caseless` | Deprecated: a case-insensitive Kubernetes "long name". |
| `k8s-path-segment-name` | A Kubernetes "path segment name" value. |
| `k8s-prefixed-label-key` | A Kubernetes label key, with the prefix required. |
| `k8s-resource-fully-qualified-name` | A non-empty prefix and name separated by a slash (for example, `prefix/name`). The prefix must be a DNS subdomain, and the name must be a C identifier of no more than 32 characters. |
| `k8s-resource-pool-name` | One or more Kubernetes "long name" parts separated by `/`, no longer than 253 characters in total. |
| `k8s-short-name` | A Kubernetes "short name", aka a "DNS label" value. |
| `k8s-uuid` | A UUID conforming to RFC 4122. |

{{< /table >}}

**Usage example:**

```go
type MyStruct struct {
    // +k8s:format=k8s-long-name
    Subdomain string `json:"subdomain"`

    // +k8s:format=k8s-short-name
    Label string `json:"label"`

    // +k8s:format=k8s-uuid
    ID string `json:"id"`
}
```

### `+k8s:ifDisabled` {#tag-ifDisabled}

**Description:**

Declares a validation that only applies when an option is disabled. Options
correspond to the validation options that the API server derives from feature
gates.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values,
constant values

**Arguments:**

* `<option>` (string, required): the name of the option.

**Payload:**

* `<validation-tag>` (required): the validation tag to evaluate only when the
  option is disabled.

**Usage example:**

```go
type MyStruct struct {
    // +k8s:ifDisabled(MyFeature)=+k8s:required
    MyField string `json:"myField"`
}
```

### `+k8s:ifEnabled` {#tag-ifEnabled}

**Description:**

Declares a validation that only applies when an option is enabled. Options
correspond to the validation options that the API server derives from feature
gates.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values,
constant values

**Arguments:**

* `<option>` (string, required): the name of the option.

**Payload:**

* `<validation-tag>` (required): the validation tag to evaluate only when the
  option is enabled.

**Usage example:**

```go
type MyStruct struct {
    // +k8s:ifEnabled(MyFeature)=+k8s:required
    MyField string `json:"myField"`
}
```

### `+k8s:ifMode` {#tag-ifMode}

**Description:**

Declares a validation that only applies when the struct's
[mode discriminator](#tag-modeDiscriminator) has a particular value. This
expresses state-based validation, where the shape of an object depends on a mode
field.

A field that carries at least one `+k8s:ifMode` tag is *implicitly forbidden* in
every mode that none of its tags name.

**Stability level:** Stable

**Scopes:** struct fields

**Arguments:**

* `<mode>` (string, positional): the discriminator value for which this
  validation applies.
* `modality` (string, optional): the name of the discriminator group, when a
  struct has more than one.
* `mode` (string, optional): the discriminator value, as a named alternative to
  the positional argument.

**Payload:**

* `<validation-tag>` (required): the tag to evaluate when the mode matches.

**Usage example:**

```go
type MyStruct struct {
    // +k8s:modeDiscriminator
    Mode string `json:"mode"`

    // Required in mode "A", and additionally length-limited.
    // +k8s:ifMode("A")=+k8s:required
    // +k8s:ifMode("A")=+k8s:maxLength=5
    FieldA *string `json:"fieldA,omitempty"`

    // Optional in mode "B", implicitly forbidden in every other mode.
    // +k8s:ifMode("B")=+k8s:optional
    FieldB *string `json:"fieldB,omitempty"`
}
```

### `+k8s:immutable` {#tag-immutable}

**Description:**

Indicates that a field may not be updated. Unlike [`+k8s:update`](#tag-update),
which offers finer-grained transitions, `+k8s:immutable` forbids any change to
the value after creation.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map values

**Usage example:**

```go
type MyStruct struct {
    // +k8s:immutable
    StringField string `json:"stringField"`

    // +k8s:immutable
    SliceField []string `json:"sliceField"`
}

// +k8s:immutable
type ImmutableType string
```

### `+k8s:isSubresource` {#tag-isSubresource}

**Description:**

A package-level tag that scopes the package's validation rules to one
subresource, so they do not apply to the root object or any other subresource.
This lets you keep subresource-specific validation in its own package, separate
from the API types.

**Stability level:** Stable

**Scope:** package

**Payload:**

* `<subresource-path>`: the path of the subresource to which the validations in
  this package apply (for example, `"/status"` or `"/scale"`).

{{< alert color="caution" title="Caution" >}}
This tag requires a matching
[`+k8s:supportsSubresource`](#tag-supportsSubresource) in the package that
defines the API type. Without it, the generator emits the validation code but
the dispatcher does not recognize the subresource path, so nothing reaches it.
{{< /alert >}}

**Usage example:**

In `staging/src/k8s.io/api/apps/v1/doc.go`, declare that the type supports
`/scale`:

```go
// +k8s:supportsSubresource="/scale"
package v1
```

In `staging/src/k8s.io/api/apps/v1/validations/scale/doc.go`, define the rules
that run only for `/scale`:

```go
// +k8s:isSubresource="/scale"
package scale
```

### `+k8s:item` {#tag-item}

**Description:**

Declares a validation for an item of a slice declared as a `+k8s:listType=map`.
You declare the item to match by providing field-value pair arguments where the
field is a `listMapKey`. You must specify all `listMapKey` fields.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Usage:**

`+k8s:item(<listMapKey-JSON-field-name>: <value>,...)=<validation-tag>`

`+k8s:item(stringKey: "value", intKey: 42, boolKey: true)=<validation-tag>`

Name the arguments with the JSON names of the list-map key fields. Values can be
strings, integers, or booleans.

**Payload:**

* `<validation-tag>` (required): the tag to evaluate for the matching list item.

**Usage example:**

```go
type MyStruct struct {
    // +k8s:listType=map
    // +k8s:listMapKey=type
    // +k8s:item(type: "Approved")=+k8s:zeroOrOneOfMember
    // +k8s:item(type: "Denied")=+k8s:zeroOrOneOfMember
    MyConditions []MyCondition `json:"conditions"`
}

type MyCondition struct {
    Type   string `json:"type"`
    Status string `json:"status"`
}
```

In this example, the conditions with `type` "Approved" and "Denied" are members
of the same zero-or-one-of group, so at most one of them may be present.

### `+k8s:listMapKey` {#tag-listMapKey}

**Description:**

Declares a named sub-field of a list's value-type to be part of the list-map key.
This tag is required when you use `+k8s:listType=map` or `+k8s:unique=map`. You
can use multiple `+k8s:listMapKey` tags to specify that the list is keyed off
several fields.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Payload:**

* `<field-json-name>` (required): the JSON name of the field to use as the key.

**Usage example:**

```go
// +k8s:listType=map
// +k8s:listMapKey=keyFieldOne
// +k8s:listMapKey=keyFieldTwo
type MyList []MyItem

type MyItem struct {
    KeyFieldOne string `json:"keyFieldOne"`
    KeyFieldTwo string `json:"keyFieldTwo"`
    ValueField  string `json:"valueField"`
}
```

The key is the combination of `keyFieldOne` and `keyFieldTwo`.

### `+k8s:listType` {#tag-listType}

**Description:**

Declares a list field's semantic type and ownership behavior:

* `atomic`: single ownership; the list is treated as a single value.
* `set`: shared ownership with uniqueness; each element must be unique.
* `map`: shared ownership with key-based uniqueness; requires
  [`+k8s:listMapKey`](#tag-listMapKey).

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Payload:**

* `atomic | map | set` (required)

**Usage example:**

```go
// +k8s:listType=map
// +k8s:listMapKey=keyField
type MyList []MyItem

type MyItem struct {
    KeyField   string `json:"keyField"`
    ValueField string `json:"valueField"`
}
```

Each element of `MyList` must have a unique `keyField`.

### `+k8s:maxBytes` {#tag-maxBytes}

**Description:**

Indicates that a string field has a limit on its length in bytes. This could
allow as few as N/4 multi-byte characters. To limit the number of characters
instead, use [`+k8s:maxLength`](#tag-maxLength).

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Payload:**

* `<non-negative integer>` (required): this field must be no more than X bytes
  long.

**Usage example:**

```go
type MyStruct struct {
    // +k8s:maxBytes=1024
    MyString string `json:"myString"`
}
```

### `+k8s:maxItems` {#tag-maxItems}

**Description:**

Indicates that a list has a limit on its size.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map values

**Payload:**

* `<non-negative integer>` (required): this list must be no more than X items
  long.

**Usage example:**

```go
type MyStruct struct {
    // +k8s:maxItems=5
    MyList []string `json:"myList"`
}
```

### `+k8s:maxLength` {#tag-maxLength}

**Description:**

Indicates that a string field has a limit on its length in characters. This could
allow up to 4*N bytes if the value uses multi-byte characters. To limit the
number of bytes instead, use [`+k8s:maxBytes`](#tag-maxBytes).

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Payload:**

* `<non-negative integer>` (required): this field must be no more than X
  characters long.

**Usage example:**

```go
type MyStruct struct {
    // +k8s:maxLength=10
    MyString string `json:"myString"`
}
```

### `+k8s:maxProperties` {#tag-maxProperties}

**Description:**

Provides a limit on the properties of an object, as defined by JSON Schema. In
Kubernetes you can only use it to constrain the number of entries in a field
defined as a Go map.

**Stability level:** Stable

**Scopes:** struct fields, type definitions

**Payload:**

* `<non-negative integer>` (required): this map must have no more than X
  properties (where X <= 100000).

**Usage example:**

```go
type MyStruct struct {
    // +k8s:maxProperties=32
    MyMap map[string]string `json:"myMap"`
}
```

### `+k8s:maximum` {#tag-maximum}

**Description:**

Indicates that a numeric field has a maximum value.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Payload:**

* `<integer>` (required): this field must be less than or equal to X.

**Usage example:**

```go
type MyStruct struct {
    // +k8s:maximum=100
    MyInt int `json:"myInt"`
}
```

### `+k8s:minItems` {#tag-minItems}

**Description:**

Indicates that a list has a minimum size.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map values

**Payload:**

* `<non-negative integer>` (required): this list must be at least X items long.

**Usage example:**

```go
type MyStruct struct {
    // +k8s:minItems=1
    MyList []string `json:"myList"`
}
```

### `+k8s:minLength` {#tag-minLength}

**Description:**

Indicates that a string field has a minimum length in characters. If the value
uses multi-byte characters, the minimum size in bytes ranges from X to 4X.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Payload:**

* `<integer>` (required): this field must be at least X characters long.

**Usage example:**

```go
type MyStruct struct {
    // +k8s:minLength=3
    MyString string `json:"myString"`
}
```

### `+k8s:minProperties` {#tag-minProperties}

**Description:**

Provides a lower limit on the properties of an object, as defined by JSON Schema.
In Kubernetes you can only use it to constrain the number of entries in a field
defined as a Go map.

**Stability level:** Stable

**Scopes:** struct fields, type definitions

**Payload:**

* `<non-negative integer>` (required): this map must have at least X properties
  (where X <= 100000).

**Usage example:**

```go
type MyStruct struct {
    // +k8s:minProperties=1
    MyMap map[string]string `json:"myMap"`
}
```

### `+k8s:minimum` {#tag-minimum}

**Description:**

Indicates that a numeric field has a minimum value.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Payload:**

* `<integer>` (required): this field must be greater than or equal to X.

**Usage example:**

```go
type MyStruct struct {
    // +k8s:minimum=0
    MyInt int `json:"myInt"`
}
```

### `+k8s:modeDiscriminator` {#tag-modeDiscriminator}

**Description:**

Indicates that this field is a discriminator for state-based validation: its
value selects which [`+k8s:ifMode`](#tag-ifMode) rules apply to the sibling
fields of the same struct.

The discriminator must be a non-pointer `string` or `bool`. A struct can have
more than one discriminator group; name the extra groups with the `modality`
argument. The group name `default` is reserved, and group names must match
`^[a-zA-Z][a-zA-Z0-9_]*$`.

**Stability level:** Stable

**Scopes:** struct fields

**Arguments:**

* `modality` (string, optional): the name of the discriminator group, if more
  than one exists.

**Usage example:**

```go
type MyStruct struct {
    // +k8s:modeDiscriminator
    Mode string `json:"mode"`

    // +k8s:modeDiscriminator(modality:"Legacy")
    Legacy bool `json:"legacy"`

    // +k8s:ifMode("A")=+k8s:required
    FieldA *string `json:"fieldA,omitempty"`

    // +k8s:ifMode(modality:"Legacy", mode:"true")=+k8s:required
    FieldB *string `json:"fieldB,omitempty"`
}
```

### `+k8s:monotonic` {#tag-monotonic}

**Description:**

Ensures that a numeric field's value never decreases on update.

**Stability level:** Alpha

**Scopes:** struct fields, type definitions

**Usage example:**

```go
type MyStruct struct {
    // +k8s:minimum=0
    // +k8s:monotonic
    Generation int64 `json:"generation"`
}
```

### `+k8s:neq` {#tag-neq}

**Description:**

Verifies that the field's value is not equal to a specific disallowed value.
Supports string, integer, and boolean types.

**Stability level:** Alpha

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Payload:**

* `<value>` (required): the disallowed value. The parser infers the type (string,
  int, bool).

**Usage example:**

```go
type MyStruct struct {
    // +k8s:neq="disallowed"
    MyString string `json:"myString"`

    // +k8s:neq=0
    MyInt int `json:"myInt"`

    // +k8s:neq=true
    MyBool bool `json:"myBool"`
}
```

### `+k8s:opaqueType` {#tag-opaqueType}

**Description:**

Indicates that the generator ignores any validations declared on the referenced
type. If the generator's current flags do not include a referenced type's
package, you must set this tag, or code generation fails (which prevents silent
mistakes). If the generator should not ignore the validations, add the type's
package to the generator using the `--readonly-pkg` flag.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Usage example:**

```go
import "some/external/package"

type MyStruct struct {
    // +k8s:opaqueType
    ExternalField package.ExternalType `json:"externalField"`
}
```

### `+k8s:optional` {#tag-optional}

**Description:**

Indicates that a field is optional to clients.

**Stability level:** Stable

**Scopes:** struct fields

**Usage example:**

```go
type MyStruct struct {
    // +k8s:optional
    MyField string `json:"myField"`
}
```

### `+k8s:required` {#tag-required}

**Description:**

Indicates that a field must be specified by clients.

**Stability level:** Stable

**Scopes:** struct fields

**Usage example:**

```go
type MyStruct struct {
    // +k8s:required
    MyField string `json:"myField"`
}
```

### `+k8s:subfield` {#tag-subfield}

**Description:**

Declares a validation for a subfield of a struct. The named subfield must be a
direct field of the struct, or of an embedded struct.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Arguments:**

* `<field-json-name>` (string, required): the JSON name of the subfield.

**Payload:**

* `<validation-tag>` (required): the tag to evaluate for the subfield.

**Usage example:**

```go
type MyStruct struct {
    // +k8s:subfield(mySubfield)=+k8s:required
    Inner MyInnerStruct `json:"inner"`
}

type MyInnerStruct struct {
    MySubfield string `json:"mySubfield"`
}
```

### `+k8s:supportsSubresource` {#tag-supportsSubresource}

**Description:**

A package-level tag that registers a subresource path in the dispatch function,
so requests to it can be routed to a validation implementation. Repeat the tag
for several subresources.

Without any `+k8s:supportsSubresource` tag, only the root resource is validated
and subresource requests fail with a "no validation found" error. With this tag
but no matching [`+k8s:isSubresource`](#tag-isSubresource), the subresource uses
the root object's rules.

**Stability level:** Stable

**Scope:** package

**Payload:**

* `<subresource-path>`: the path of the subresource to support (for example,
  `"/status"` or `"/scale"`).

**Usage example:**

In `staging/src/k8s.io/api/core/v1/doc.go`, to handle `/status` and `/scale` for
the types in package `v1`:

```go
// +k8s:supportsSubresource="/status"
// +k8s:supportsSubresource="/scale"
package v1
```

### `+k8s:unionDiscriminator` {#tag-unionDiscriminator}

**Description:**

Indicates that this field is the discriminator for a union. The discriminator's
value selects which union member must be present.

**Stability level:** Beta

**Scopes:** struct fields, list values

**Arguments:**

* `union` (string, optional): the name of the union, if more than one exists.

**Usage example:**

```go
type MyStruct struct {
    TypeMeta int

    // +k8s:unionDiscriminator
    D D `json:"d"`

    // +k8s:unionMember
    // +k8s:optional
    M1 *M1 `json:"m1"`

    // +k8s:unionMember
    // +k8s:optional
    M2 *M2 `json:"m2"`
}

type D string

const (
    DM1 D = "M1"
    DM2 D = "M2"
)

type M1 struct{}

type M2 struct{}
```

The value of `D` determines which member, `M1` or `M2`, must be present.

### `+k8s:unionMember` {#tag-unionMember}

**Description:**

Indicates that this field is a member of a union. Exactly one member of a union
must be set.

**Stability level:** Stable

**Scopes:** struct fields, list values

**Arguments:**

* `union` (string, optional): the name of the union, if more than one exists.
* `memberName` (string, optional): the discriminator value for this member.
  Defaults to the field's name.

**Usage example:**

```go
type MyStruct struct {
    // +k8s:unionMember(union: "union1")
    // +k8s:optional
    M1 *M1 `json:"u1m1"`

    // +k8s:unionMember(union: "union1")
    // +k8s:optional
    M2 *M2 `json:"u1m2"`
}

type M1 struct{}

type M2 struct{}
```

### `+k8s:unique` {#tag-unique}

**Description:**

Declares that a list field's elements are unique. You can use this tag together
with `+k8s:listType=atomic` to add a uniqueness constraint without changing the
list's merge semantics, or independently to specify uniqueness semantics.

**Stability level:** Stable

**Scopes:** struct fields, type definitions, list values, map keys, map values

**Payload:**

* `map | set` (required). With `map`, the identity of an element comes from the
  [`+k8s:listMapKey`](#tag-listMapKey) fields; with `set`, from the whole element
  value.

**Usage example:**

```go
type MyStruct struct {
    // +k8s:listType=atomic
    // +k8s:unique=set
    Names []string `json:"names"`

    // +k8s:listType=atomic
    // +k8s:unique=map
    // +k8s:listMapKey=key
    Items []Item `json:"items"`
}
```

### `+k8s:update` {#tag-update}

**Description:**

Provides constraints on the allowed update operations of a field. You can specify
multiple constraints by using multiple tags.

{{< table caption="Constraints for the k8s:update tag" >}}

| Constraint | Effect |
| --- | --- |
| `NoSet` | Prevents unset to set transitions. |
| `NoUnset` | Prevents set to unset transitions. |
| `NoModify` | Prevents value changes, but allows set and unset transitions. |
| `NoAddItem` | Prevents adding items to a slice or map. |
| `NoRemoveItem` | Prevents removing items from a slice or map. |

{{< /table >}}

For non-pointer structs, `NoSet` and `NoUnset` have no effect, because you cannot
unset these fields. For slice and map fields, "unset" means `len == 0`. Slice
item identity for `NoAddItem` and `NoRemoveItem` comes from
[`+k8s:listType`](#tag-listType), [`+k8s:listMapKey`](#tag-listMapKey), and
[`+k8s:unique`](#tag-unique); for maps, the key is the item identity.

`NoModify` is not supported directly on slices or maps; use
`+k8s:eachVal=+k8s:update=NoModify` for per-item immutability. On lists,
`+k8s:eachVal=+k8s:update=NoModify` requires `listType=map` or `unique=map`,
because otherwise content changes are not detectable.

**Stability level:** Stable

**Scopes:** struct fields, list values, map values

**Payload:**

* `NoSet | NoUnset | NoModify | NoAddItem | NoRemoveItem`

**Usage example:**

```go
type MyStruct struct {
    // Set-once: may be set at any time, but never changed or cleared.
    // +k8s:update=NoModify
    // +k8s:update=NoUnset
    SetOnce *string `json:"setOnce,omitempty"`

    // Must be set at creation or never.
    // +k8s:update=NoSet
    AtCreationOnly *string `json:"atCreationOnly,omitempty"`

    // Freeze the shape of the list; individual items may still change.
    // +k8s:listType=map
    // +k8s:listMapKey=key
    // +k8s:update=NoAddItem
    // +k8s:update=NoRemoveItem
    FrozenShape []Item `json:"frozenShape"`
}
```

### `+k8s:zeroOrOneOfMember` {#tag-zeroOrOneOfMember}

**Description:**

Indicates that this field is a member of a zero-or-one-of union. A zero-or-one-of
union allows at most one member to be set. Unlike regular unions, having no
members set is valid.

**Stability level:** Stable

**Scopes:** struct fields, list values

{{< alert color="caution" title="Caution" >}}
This tag is intended for sets of list items, applied through
[`+k8s:item`](#tag-item), rather than for struct fields directly.
{{< /alert >}}

**Arguments:**

* `union` (string, optional): the name of the union, if more than one exists.
* `memberName` (string, optional): the custom member name for this member.
  Defaults to the field's name.

**Usage example:**

```go
type MyStruct struct {
    // +k8s:listType=map
    // +k8s:listMapKey=type
    // +k8s:item(type: "Approved")=+k8s:zeroOrOneOfMember
    // +k8s:item(type: "Denied")=+k8s:zeroOrOneOfMember
    Conditions []MyCondition `json:"conditions"`
}

type MyCondition struct {
    Type   string `json:"type"`
    Status string `json:"status"`
}
```

In this example, at most one of the "Approved" and "Denied" conditions can be
present. It is also valid for neither to be present.

## {{% heading "whatsnext" %}}

* Read about [Feature Gates](/docs/reference/command-line-tools-reference/feature-gates/)
* Read [KEP-5073: Declarative Validation Of Kubernetes Native Types](https://kep.k8s.io/5073)
