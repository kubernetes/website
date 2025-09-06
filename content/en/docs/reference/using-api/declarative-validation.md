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

{{< feature-state for_k8s_version="v1.33" state="beta" >}}

Kubernetes {{< skew currentVersion >}} includes optional _declarative validation_ for APIs. When enabled, the Kubernetes API server can use this mechanism rather than the legacy approach that relies on hand-written Go
code (`validation.go` files) to ensure that requests against the API are valid.
Kubernetes developers, and people [extending the Kubernetes API](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/),
can define validation rules directly alongside the API type definitions (`types.go` files). Code authors define
pecial comment tags (e.g., `+k8s:minimum=0`). A code generator (`validation-gen`) then uses these tags to produce
optimized Go code for API validation.

While primarily a feature impacting Kubernetes contributors and potentially developers of [extension API servers](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/), cluster administrators should understand its behavior, especially during its rollout phases.



Declarative validation is being rolled out gradually.
In Kubernetes {{< skew currentVersion >}}, the APIs that use declarative validation include:

* [ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/)

{{< note >}}
For the beta of this feature, Kubernetes is intentionally using a superseded API as a test bed for the change.
Future Kubernetes releases may roll this out to more APIs.
{{< /note >}}


*   `DeclarativeValidation`: (Beta, Default: `true`) When enabled, the API server runs *both* the new declarative validation and the old hand-written validation for migrated types/fields. The results are compared internally.
*   `DeclarativeValidationTakeover`: (Beta, Default: `false`) This gate determines which validation result is *authoritative* (i.e., returned to the user and used for admission decisions).

**Default Behavior (Kubernetes {{< skew currentVersion >}}):**

*   With `DeclarativeValidation=true` and `DeclarativeValidationTakeover=false` (the default values for the gates), both validation systems run.
*   **The results of the *hand-written* validation are used.** The declarative validation runs in a mismatch mode for comparison.
*   Mismatches between the two validation systems are logged by the API server and increment the `declarative_validation_mismatch_total` metric. This helps developers identify and fix discrepancies during the Beta phase.
*   **Cluster upgrades should be safe** regarding this feature, as the authoritative validation logic doesn't change by default.

Administrators can choose to explicitly enable `DeclarativeValidationTakeover=true` to make the *declarative* validation authoritative for migrated fields, typically after verifying stability in their environment (e.g., by monitoring the mismatch metric).

## Disabling declarative validation {#opt-out}

As a cluster administrator, you might consider disabling declarative validation whilst it is still beta, under specific circumstances:

*   **Unexpected Validation Behavior:** If enabling `DeclarativeValidationTakeover` leads to unexpected validation errors or allows objects that were previously invalid.
*   **Performance Regressions:** If monitoring indicates significant latency increases (e.g., in `apiserver_request_duration_seconds`) correlated with the feature's enablement.
*   **High Mismatch Rate:** If the `declarative_validation_mismatch_total` metric shows frequent mismatches, suggesting potential bugs in the declarative rules affecting the cluster's workloads, even if `DeclarativeValidationTakeover` is false.

To revert to only using hand-written validation (as used before Kubernetes v1.33), disable the `DeclarativeValidation` feature gate, for example
via command-line arguments: (`--feature-gates=DeclarativeValidation=false`). This also implicitly disables the effect of `DeclarativeValidationTakeover`.

## Considerations for downgrade and rollback

Disabling the feature acts as a safety mechanism. However, be aware of a potential edge case (considered unlikely due to extensive testing): If a bug in declarative validation (when `DeclarativeValidationTakeover=true`) *incorrectly allowed* an invalid object to be persisted, disabling the feature gates might then cause subsequent updates to that specific object to be blocked by the now-authoritative (and correct) hand-written validation. Resolving this might require manual correction of the stored object, potentially via direct etcd modification in rare cases.

For details on managing feature gates, see [Feature Gates](/docs/reference/command-line-tools-reference/feature-gates/).

## Declarative validation tag reference

This document provides a comprehensive reference for all available declarative validation tags.

### Tag catalog {#catalog}

| Tag | Description |
| --- | --- |
| [`+k8s:eachKey`](#tag-eachKey) | Declares a validation for each key in a map. |
| [`+k8s:eachVal`](#tag-eachVal) | Declares a validation for each value in a map or list. |
| [`+k8s:enum`](#tag-enum) | Indicates that a string type is an enum. |
| [`+k8s:forbidden`](#tag-forbidden) | Indicates that a field may not be specified. |
| [`+k8s:format`](#tag-format) | Indicates that a string field has a particular format. |
| [`+k8s:ifDisabled`](#tag-ifDisabled) | Declares a validation that only applies when an option is disabled. |
| [`+k8s:ifEnabled`](#tag-ifEnabled) | Declares a validation that only applies when an option is enabled. |
| [`+k8s:isSubresource`](#tag-isSubresource) | Specifies that validations in a package only apply to a specific subresource. |
| [`+k8s:item`](#tag-item) | Declares a validation for an item of a slice declared as a `+k8s:listType=map`. |
| [`+k8s:listMapKey`](#tag-listMapKey) | Declares a named sub-field of a list's value-type to be part of the list-map key. |
| [`+k8s:listType`](#tag-listType) | Declares a list field's semantic type. |
| [`+k8s:maxItems`](#tag-maxItems) | Indicates that a list field has a limit on its size. |
| [`+k8s:maxLength`](#tag-maxLength) | Indicates that a string field has a limit on its length. |
| [`+k8s:minimum`](#tag-minimum) | Indicates that a numeric field has a minimum value. |
| [`+k8s:neq`](#tag-neq) | Verifies the field's value is not equal to a specific disallowed value. |
| [`+k8s:opaqueType`](#tag-opaqueType) | Indicates that any validations declared on the referenced type will be ignored. |
| [`+k8s:optional`](#tag-optional) | Indicates that a field is optional to clients. |
| [`+k8s:required`](#tag-required) | Indicates that a field must be specified by clients. |
| [`+k8s:subfield`](#tag-subfield) | Declares a validation for a subfield of a struct. |
| [`+k8s:supportsSubresource`](#tag-supportsSubresource) | Declares a supported subresource for the types within a package. |
| [`+k8s:unionDiscriminator`](#tag-unionDiscriminator) | Indicates that this field is the discriminator for a union. |
| [`+k8s:unionMember`](#tag-unionMember) | Indicates that this field is a member of a union group. |
| [`+k8s:zeroOrOneOfMember`](#tag-zeroOrOneOfMember) | Indicates that this field is a member of a zero-or-one-of group. |

---

## Tag Reference

### `+k8s:eachKey` {#tag-eachKey}

**Description:**

Declares a validation for each key in a map.

**Payload:**

*   `<validation-tag>`: The tag to evaluate for each key.

**Usage Example:**

```go
type MyStruct struct {
    // +k8s:eachKey=+k8s:minimum=1
    MyMap map[int]string `json:"myMap"`
}
```

In this example, `eachKey` is used to specify that the `+k8s:minimum` tag should be applied to each `int` key in `MyMap`. This means that all keys in the map must be >= 1.

### `+k8s:eachVal` {#tag-eachVal}

**Description:**

Declares a validation for each value in a map or list.

**Payload:**

*   `<validation-tag>`: The tag to evaluate for each value.

**Usage Example:**

```go
type MyStruct struct {
    // +k8s:eachVal=+k8s:minimum=1
    MyMap map[string]int `json:"myMap"`
}
```

In this example, `eachVal` is used to specify that the `+k8s:minimum` tag should be applied to each element in `MyList`. This means that all fields in `MyStruct` must be >= 1.

### `+k8s:enum` {#tag-enum}

**Description:**

Indicates that a string type is an enum. All const values of this type are considered values in the enum.

**Usage Example:**

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

The validation logic will ensure that `MyField` is one of the defined enum values (`"A"` or `"B"`).

### `+k8s:forbidden` {#tag-forbidden}

**Description:**

Indicates that a field may not be specified.

**Usage Example:**

```go
type MyStruct struct {
    // +k8s:forbidden
    MyField string `json:"myField"`
}
```

In this example, `MyField` cannot be provided (it is forbidden) when creating or updating `MyStruct`.

### `+k8s:format` {#tag-format}

**Description:**

Indicates that a string field has a particular format.

**Payloads:**

*   `k8s-ip`: This field holds an IPv4 or IPv6 address value. IPv4 octets may have leading zeros.
*   `k8s-long-name`: This field holds a Kubernetes "long name", aka a "DNS subdomain" value.
*   `k8s-short-name`: This field holds a Kubernetes "short name", aka a "DNS label" value.

**Usage Example:**

```go
type MyStruct struct {
    // +k8s:format=k8s-ip
    IPAddress string `json:"ipAddress"`

    // +k8s:format=k8s-long-name
    Subdomain string `json:"subdomain"`

    // +k8s:format=k8s-short-name
    Label string `json:"label"`
}
```

In this example:
*   `IPAddress` must be a valid IP address.
*   `Subdomain` must be a valid DNS subdomain.
*   `Label` must be a valid DNS label.

### `+k8s:ifDisabled` {#tag-ifDisabled}

**Description:**

Declares a validation that only applies when an option is disabled.

**Arguments:**

*   `<option>` (string, required): The name of the option.

**Payload:**

*   `<validation-tag>`: This validation tag will be evaluated only if the validation option is disabled.

**Usage Example:**

```go
type MyStruct struct {
    // +k8s:ifDisabled("my-feature")=+k8s:required
    MyField string `json:"myField"`
}
```

In this example, `MyField` is required only if the "my-feature" option is disabled.

### `+k8s:ifEnabled` {#tag-ifEnabled}

**Description:**

Declares a validation that only applies when an option is enabled.

**Arguments:**

*   `<option>` (string, required): The name of the option.

**Payload:**

*   `<validation-tag>`: This validation tag will be evaluated only if the validation option is enabled.

**Usage Example:**

```go
type MyStruct struct {
    // +k8s:ifEnabled("my-feature")=+k8s:required
    MyField string `json:"myField"`
}
```

In this example, `MyField` is required only if the "my-feature" option is enabled.

### `+k8s:isSubresource` {#tag-isSubresource}

**Description:**

The `+k8s:isSubresource` tag is a package-level comment that **scopes the validation rules within that package to a specific subresource**. It essentially tells the code generator, "The validation logic defined here is the specific implementation for this subresource and should not be applied to the root object or any other subresource."

**CRITICAL DEPENDENCY:**

This tag is **dependent** on a corresponding `+k8s:supportsSubresource` tag being present in the package where the main API type is defined.

*   `+k8s:supportsSubresource` opens the door by telling the dispatcher that a subresource is valid.
*   `+k8s:isSubresource` provides the specialized validation logic that runs when a request comes through that door.

If you use `+k8s:isSubresource` without the corresponding `+k8s:supportsSubresource` declaration on the main type, the specialized validation code will be generated but will be **unreachable**. The main dispatcher will not recognize the subresource path and will reject the request before it can be routed to your specific validation logic.

This dependency allows for powerful organization, such as placing your main API types in one package and defining their subresource-specific validations in separate, dedicated packages.

**Scope:** Package

**Payload:**

*   `<subresource-path>`: The path of the subresource to which the validations in this package should apply (e.g., `"/status"`, `"/scale"`).

**Usage Example:**

This two-part example demonstrates the intended use case of separating concerns.

**1. Declare Support in the Main API Package:**
First, declare that the `Deployment` type supports `/scale` validation in its primary package.

*File: `staging/src/k8s.io/api/apps/v1/doc.go`*
```go
// This enables the validation dispatcher to handle requests for "/scale".
// +k8s:supportsSubresource="/scale"
package v1

// ... includes the definition for the Deployment type
```

**2. Scope Validation Logic in a Separate Package:**
Next, create a separate package for the validation rules that are specific *only* to the `/scale` subresource.

*File: `staging/src/k8s.io/api/apps/v1/validations/scale/doc.go`*
```go
// This ensures the rules in this package ONLY run for the "/scale" subresource.
// +k8s:isSubresource="/scale"
package scale

import "k8s.io/api/apps/v1"

// Validation code in this package would reference types from package v1 (e.g., v1.Scale).
// The generated validation function will only be invoked for requests to the "/scale"
// subresource of a type defined in a package that supports it.
```


### `+k8s:item` {#tag-item}

**Description:**

Declares a validation for an item of a slice declared as a `+k8s:listType=map`. The item to match is declared by providing field-value pair arguments where the field is a `listMapKey`. All `listMapKey` key fields must be specified.

**Usage:**

`+k8s:item(<listMapKey-JSON-field-name>: <value>,...)=<validation-tag>`

`+k8s:item(stringKey: "value", intKey: 42, boolKey: true)=<validation-tag>`

Arguments must be named with the JSON names of the list-map key fields. Values can be strings, integers, or booleans.

**Payload:**

*   `<validation-tag>`: The tag to evaluate for the matching list item.

**Usage Example:**

```go
type MyStruct struct {
	// +k8s:listType=map
	// +k8s:listMapKey=type
	// +k8s:item(type: "Approved")=+k8s:zeroOrOneOfMember
	// +k8s:item(type: "Denied")=+k8s:zeroOrOneOfMember
	MyConditions []MyCondition `json:"conditions"`
}

type MyCondition struct {
    Type string `json:"type"`
    Status string `json:"status"`
}
```

In this example:
*   The condition with `type` "Approved" is part of a zero-or-one-of group.
*   The condition with `type` "Denied" is part of a zero-or-one-of group.

### `+k8s:listMapKey` {#tag-listMapKey}

**Description:**

Declares a named sub-field of a list's value-type to be part of the list-map key. This tag is required when `+k8s:listType=map` is used.  Multiple `+k8s:listMapKey` tags can be used on a list-map to specify that it is keyed off of multiple fields.

**Payload:**

*   `<field-json-name>`: The JSON name of the field to be used as the key.

**Usage Example:**

```go
// +k8s:listType=map
// +k8s:listMapKey=keyFieldOne
// +k8s:listMapKey=keyFieldTwo
type MyList []MyStruct

type MyStruct struct {
    keyFieldOne string `json:"keyFieldOne"`
    keyFieldTwo string `json:"keyFieldTwo"`
    valueField string `json:"valueField"`
}
```

In this example, `listMapKey` is used to specify that the `keyField` of `MyStruct` should be used as the key for the list-map. 

### `+k8s:listType` {#tag-listType}

**Description:**

Declares a list field's semantic type. This tag is used to specify how a list should be treated, for example, as a map or a set.

**Payload:**

*   `atomic`: The list is treated as a single atomic value.
*   `map`: The list is treated as a map, where each element has a unique key. Requires the use of `+k8s:listMapKey`.
*   `set`: The list is treated as a set, where each element is unique.

**Usage Example:**

```go
// +k8s:listType=map
// +k8s:listMapKey=keyField
type MyList []MyStruct

type MyStruct struct {
    keyField string `json:"keyField"`
    valueField string `json:"valueField"`
}
```

In this example, `MyList` is declared as a list of type `map`, with `keyField` as the key. This means that the validation logic will ensure that each element in the list has a unique `keyField`.

### `+k8s:maxItems` {#tag-maxItems}

**Description:**

Indicates that a list field has a limit on its size.

**Payload:**

*   `<non-negative integer>`: This field must be no more than X items long.

**Usage Example:**

```go
type MyStruct struct {
    // +k8s:maxItems=5
    MyList []string `json:"myList"`
}
```

In this example, `MyList` cannot contain more than 5 items.

### `+k8s:maxLength` {#tag-maxLength}

**Description:**

Indicates that a string field has a limit on its length.

**Payload:**

*   `<non-negative integer>`: This field must be no more than X characters long.

**Usage Example:**

```go
type MyStruct struct {
    // +k8s:maxLength=10
    MyString string `json:"myString"`
}
```

In this example, `MyString` cannot be longer than 10 characters.

### `+k8s:minimum` {#tag-minimum}

**Description:**

Indicates that a numeric field has a minimum value.

**Payload:**

*   `<integer>`: This field must be greater than or equal to x.

**Usage Example:**

```go
type MyStruct struct {
    // +k8s:minimum=0
    MyInt int `json:"myInt"`
}
```

In this example, `MyInt` must be greater than or equal to 0.

### `+k8s:neq` {#tag-neq}

**Description:**

Verifies the field's value is not equal to a specific disallowed value. Supports string, integer, and boolean types.

**Payload:**

*   `<value>`: The disallowed value. The parser will infer the type (string, int, bool).

**Usage Example:**

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

In this example:
*   `MyString` cannot be equal to `"disallowed"`.
*   `MyInt` cannot be equal to `0`.
*   `MyBool` cannot be equal to `true`.

### `+k8s:opaqueType` {#tag-opaqueType}

**Description:**

Indicates that any validations declared on the referenced type will be ignored. If a referenced type's package is not included in the generator's current flags, this tag must be set, or code generation will fail (preventing silent mistakes). If the validations should not be ignored, add the type's package to the generator using the `--readonly-pkg` flag.

**Usage Example:**

```go
import "some/external/package"

type MyStruct struct {
    // +k8s:opaqueType
    ExternalField package.ExternalType `json:"externalField"`
}
```

In this example, any validation tags on `package.ExternalType` will be ignored.

### `+k8s:optional` {#tag-optional}

**Description:**

Indicates that a field is optional to clients.

**Usage Example:**

```go
type MyStruct struct {
    // +k8s:optional
    MyField string `json:"myField"`
}
```

In this example, `MyField` is not required to be provided when creating or updating `MyStruct`.

### `+k8s:required` {#tag-required}

**Description:**

Indicates that a field must be specified by clients.

**Usage Example:**

```go
type MyStruct struct {
    // +k8s:required
    MyField string `json:"myField"`
}
```

In this example, `MyField` must be provided when creating or updating `MyStruct`.

### `+k8s:subfield` {#tag-subfield}

**Description:**

Declares a validation for a subfield of a struct.

**Arguments:**

*   `<field-json-name>` (string, required): The JSON name of the subfield.

**Payload:**

*   `<validation-tag>`: The tag to evaluate for the subfield.

**Usage Example:**

```go
type MyStruct struct {
    // +k8s:subfield("mySubfield")=+k8s:required
    MyStruct MyStruct `json:"MyStruct"`
}

type MyStruct struct {
    MySubfield string `json:"mySubfield"`
}
```

In this example, `MySubfield` within `MyStruct` is required.

### `+k8s:supportsSubresource` {#tag-supportsSubresource}

**Description:**

The `+k8s:supportsSubresource` tag is a package-level comment tag that **declares which subresources are valid targets for validation** for the types within that package. Think of this tag as registering an endpoint; it tells the validation framework that a specific subresource path is recognized and should not be immediately rejected.

When the validation code is generated, this tag adds the specified subresource path to the main dispatch function for a type. This allows incoming requests for that subresource to be routed to a validation implementation.

Multiple tags can be used to declare support for several subresources. If no `+k8s:supportsSubresource` tags are present in a package, validation is only enabled for the root resource (e.g., `.../myresources/myobject`), and any requests to subresources will fail with a "no validation found" error.

**Standalone Usage:**

If you use `+k8s:supportsSubresource` without a corresponding `+k8s:isSubresource` tag for a specific validation, the validation rules for the root object will be applied to the subresource by default.

**Scope:** Package

**Payload:**

*   `<subresource-path>`: The path of the subresource to support (e.g., `"/status"`, `"/scale"`).

**Usage Example:**

By adding these tags, you are enabling the validation system to handle requests for the `/status` and `/scale` subresources for the types defined in package `v1`.

*File: `staging/src/k8s.io/api/core/v1/doc.go`*
```go
// +k8s:supportsSubresource="/status"
// +k8s:supportsSubresource="/scale"
package v1
```

### `+k8s:unionDiscriminator` {#tag-unionDiscriminator}

**Description:**

Indicates that this field is the discriminator for a union.

**Arguments:**

*   `union` (string, optional): The name of the union, if more than one exists.

**Usage Example:**

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

In this example, the `Type` field is the discriminator for the union. The value of `Type` will determine which of the union members (`M1` or `M2`) is expected to be present.

### `+k8s:unionMember` {#tag-unionMember}

**Description:**

Indicates that this field is a member of a union.

**Arguments:**

*   `union` (string, optional): The name of the union, if more than one exists.
*   `memberName` (string, optional): The discriminator value for this member. Defaults to the field's name.

**Usage Example:**

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

In this example, `M1` and `M2` are members of the named union `union1`.

### `+k8s:zeroOrOneOfMember` {#tag-zeroOrOneOfMember}

**Description:**

Indicates that this field is a member of a zero-or-one-of union. A zero-or-one-of union allows at most one member to be set. Unlike regular unions, having no members set is valid.

**Arguments:**

*   `union` (string, optional): The name of the union, if more than one exists.
*   `memberName` (string, optional): The custom member name for this member. Defaults to the field's name.

**Usage Example:**

```go
type MyStruct struct {
	// +k8s:zeroOrOneOfMember
	// +k8s:optional
	M1 *M1 `json:"m1"`

	// +k8s:zeroOrOneOfMember
	// +k8s:optional
	M2 *M2 `json:"m2"`
}

type M1 struct{}

type M2 struct{}
```

In this example, at most one of `A` or `B` can be set. It is also valid for neither to be set.