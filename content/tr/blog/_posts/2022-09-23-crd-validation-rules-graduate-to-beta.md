---
layout: blog
title: "Kubernetes 1.25: CustomResourceDefinition Validation Rules Graduate to Beta"
date: 2022-09-23
slug: crd-validation-rules-beta
author: >
  Joe Betz (Google),
  Cici Huang (Google),
  Kermit Alexander (Google)
---

In Kubernetes 1.25, [Validation rules for CustomResourceDefinitions](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules) (CRDs) have graduated to Beta!

Validation rules make it possible to declare how custom resources are validated using the [Common Expression Language](https://github.com/google/cel-spec) (CEL). For example:

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
    ...
    openAPIV3Schema:
      type: object
      properties:
        spec:
          type: object
          x-kubernetes-validations:
            - rule: "self.minReplicas <= self.replicas && self.replicas <= self.maxReplicas"
              message: "replicas should be in the range minReplicas..maxReplicas."
          properties:
            replicas:
              type: integer
            ...
```

Validation rules support a wide range of use cases. To get a sense of some of the capabilities, let's look at a few examples:


| Validation Rule | Purpose |
| - | - |
| `self.minReplicas <= self.replicas` | Validate an integer field is less than or equal to another integer field |
| `'Available' in self.stateCounts` | Validate an entry with the 'Available' key exists in a map |
| `self.set1.all(e, !(e in self.set2))` | Validate that the elements of two sets are disjoint |
| `self == oldSelf` | Validate that a required field is immutable once it is set |
| `self.created + self.ttl < self.expired` | Validate that 'expired' date is after a 'create' date plus a 'ttl' duration |


Validation rules are expressive and flexible. See the [Validation Rules documentation](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules) to learn more about what validation rules are capable of.

## Why CEL?

CEL was chosen as the language for validation rules for a couple reasons:

* CEL expressions can easily be inlined into CRD schemas. They are sufficiently expressive to replace the vast majority of CRD validation checks currently implemented in admission webhooks. This results in CRDs that are self-contained and are easier to understand.
* CEL expressions are compiled and type checked against a CRD's schema "ahead-of-time" (when CRDs are created and updated) allowing them to be evaluated efficiently and safely "runtime" (when custom resources are validated). Even regex string literals in CEL are validated and pre-compiled when CRDs are created or updated.

## Why not use validation webhooks?

Benefits of using validation rules when compared with validation webhooks:

* CRD authors benefit from a simpler workflow since validation rules eliminate the need to develop and maintain a webhook.
* Cluster administrators benefit by no longer having to install, upgrade and operate webhooks for the purposes of CRD validation.
* Cluster operability improves because CRD validation no longer requires a remote call to a webhook endpoint, eliminating a potential point of failure in the request-serving-path of the Kubernetes API server. This allows clusters to retain high availability while scaling to larger amounts of installed CRD extensions, since expected control plane availability would otherwise decrease with each additional webhook installed. 

## Getting started with validation rules

### Writing validation rules in OpenAPIv3 schemas

You can define validation rules for any level of a CRD's OpenAPIv3 schema. Validation rules are automatically scoped to their location in the schema where they are declared.

Good practices for CRD validation rules:

* Scope validation rules as close as possible to the fields(s) they validate.
* Use multiple rules when validating independent constraints.
* Do not use validation rules for validations already 
* Use OpenAPIv3 [value validations](https://swagger.io/specification/#properties) (`maxLength`, `maxItems`, `maxProperties`, `required`, `enum`, `minimum`, `maximum`, ..) and [string formats](https://swagger.io/docs/specification/data-models/data-types/#format) where available.
* Use `x-kubernetes-int-or-string`, `x-kubernetes-embedded-type` and `x-kubernetes-list-type=(set|map)` were appropriate.

Examples of good practice:

| Validation | Best Practice | Example(s) |
| - | - | - |
| Validate an integer is between 0 and 100. | Use OpenAPIv3 value validations. | <pre>type: integer<br>minimum: 0<br>maximum: 100</pre> |
| Constraint the max size limits on maps (objects with additionalProperties), arrays and string. | Use OpenAPIv3 value validations. Recommended for all maps, arrays and strings. This best practice is essential for rule cost estimation (explained below). | <pre>type:<br>maxItems: 100</pre> |
| Require a date-time be more recent than a particular timestamp. | Use OpenAPIv3 string formats to declare that the field is a date-time. Use validation rules to compare it to a particular timestamp. | <pre>type: string<br>format: date-time<br>x-kubernetes-validations:<br>  - rule: "self >= timestamp('2000-01-01T00:00:00.000Z')"</pre> |
| Require two sets to be disjoint. | Use x-kubernetes-list-type to validate that the arrays are sets. <br>Use validation rules to validate the sets are disjoint. | <pre>type: object<br>properties:<br>  set1:<br>    type: array<br>    x-kubernetes-list-type: set<br>  set2: ...<br>  x-kubernetes-validations:<br>    - rule: "!self.set1.all(e, !(e in self.set2))"</pre>

## CRD transition rules

[Transition Rules](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#transition-rules) make it possible to compare the new state against the old state of a resource in validation rules. You use transition rules to make sure that the cluster's API server does not accept invalid state transitions. A transition rule is a validation rule that references 'oldSelf'. The API server only evaluates transition rules when both an old value and new value exist.

Transition rule examples:

| Transition Rule | Purpose |
| - | - |
| `self == oldSelf` | For a required field, make that field immutable once it is set. For an optional field, only allow transitioning from unset to set, or from set to unset. |
| (on parent of field) `has(self.field) == has(oldSelf.field)`<br>on field:  `self == oldSelf` | Make a field immutable: validate that a field, even if optional, never changes after the resource is created (for a required field, the previous rule is simpler). |
| `self.all(x, x in oldSelf)` | Only allow adding items to a field that represents a set (prevent removals). |
| `self >= oldSelf` | Validate that a number is monotonically increasing.|


## Using the Functions Libraries

Validation rules have access to a couple different function libraries:

* CEL standard functions, defined in the [list of standard definitions](https://github.com/google/cel-spec/blob/v0.7.0/doc/langdef.md#list-of-standard-definitions)
* CEL standard [macros](https://github.com/google/cel-spec/blob/v0.7.0/doc/langdef.md#macros)
* CEL [extended string function library](https://pkg.go.dev/github.com/google/cel-go/ext#Strings)
* Kubernetes [CEL extension library](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#pkg-functions) which includes supplemental functions for [lists](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#pkg-functions), [regex](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#Regex), and [URLs](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#Regex).

Examples of function libraries in use:

| Validation Rule | Purpose |
| - | - |
| `!(self.getDayOfWeek() in [0, 6])` | Validate that a date is not a Sunday or Saturday. |
| `isUrl(self) && url(self).getHostname() in [a.example.com', 'b.example.com']` | Validate that a URL has an allowed hostname. |
| `self.map(x, x.weight).sum() == 1` | Validate that the weights of a list of objects sum to 1. |
| `int(self.find('^[0-9]*')) < 100` | Validate that a string starts with a number less than 100. |
| `self.isSorted()` | Validates that a list is sorted. |

## Resource use and limits

To prevent CEL evaluation from consuming excessive compute resources, validation rules impose some limits. These limits are based on CEL _cost units_, a platform and machine independent measure of execution cost. As a result, the limits are the same regardless of where they are enforced.

### Estimated cost limit

CEL is, by design, non-Turing-complete in such a way that the halting problem isn’t a concern. CEL takes advantage of this design choice to include an "estimated cost" subsystem that can statically compute the worst case run time cost of any CEL expression. Validation rules are [integrated with the estimated cost system](o/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#resource-use-by-validation-functions) and disallow CEL expressions from being included in CRDs if they have a sufficiently poor (high) estimated cost. The estimated cost limit is set quite high and typically requires an O(n^2) or worse operation, across something of unbounded size, to be exceeded. Fortunately the fix is usually quite simple: because the cost system is aware of size limits declared in the CRD's schema, CRD authors can add size limits to the CRD's schema  (`maxItems` for arrays, `maxProperties` for maps, `maxLength` for strings) to reduce the estimated cost.

Good practice:

Set `maxItems`, `maxProperties` and `maxLength` on all array, map (`object` with `additionalProperties`) and string types in CRD schemas! This results in lower and more accurate estimated costs and generally makes a CRD safer to use.

### Runtime cost limits for CRD validation rules

In addition to the estimated cost limit, CEL keeps track of actual cost while evaluating a CEL expression and will halt execution of the expression if a limit is exceeded.

With the estimated cost limit already in place, the runtime cost limit is rarely encountered. But it is possible. For example, it might be encountered for a large resource composed entirely of a single large list and a validation rule that is either evaluated on each element in the list, or traverses the entire list.

CRD authors can ensure the runtime cost limit will not be exceeded in much the same way the estimated cost limit is avoided: by setting `maxItems`, `maxProperties` and `maxLength` on array, map and string types.

## Future work

We look forward to working with the community on the adoption of CRD Validation Rules, and hope to see this feature promoted to general availability in an upcoming Kubernetes release!

There is a growing community of Kubernetes contributors thinking about how to make it possible to write extensible admission controllers using CEL as a substitute for admission webhooks for policy enforcement use cases. Anyone interested should reach out to us on the usual [SIG API Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery) channels or via slack at [#sig-api-machinery-cel-dev](https://kubernetes.slack.com/archives/C02TTBG6LF4).

## Acknowledgements

Special thanks to Cici Huang, Ben Luddy, Jordan Liggitt, David Eads, Daniel Smith, Dr. Stefan Schimanski, Leila Jalali and everyone who contributed to Validation Rules!
