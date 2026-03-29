---
layout: blog
title: "Kubernetes v1.36: Declarative Validation Reaches General Availability"
date: 2026-03-23T10:00:00-08:00
slug: kubernetes-v1-36-declarative-validation-ga
author: >
  [Yongrui Lin](https://github.com/yongruilin)
---

Kubernetes v1.36 marks a transformative milestone in the evolution of Kubernetes API management: the **Declarative Validation** feature for Kubernetes native types has officially reached General Availability (GA).

For users, this translates to more reliable, predictable, and better-documented APIs. For Kubernetes contributors and ecosystem developers, this represents the end of an era dominated by complex, handwritten validation functions, paving the way for a unified, maintainable, and highly robust API machinery framework.

In this post, we’ll dive deep into why this migration was necessary, explore the inner workings of the declarative validation framework, and examine the new capabilities that come with this GA release.

---

## The Motivation: Escaping the "Handwritten" Technical Debt

For years, the validation of Kubernetes native APIs relied almost entirely on handwritten Go code. If a field needed to be bounded by a minimum value, or if two fields needed to be mutually exclusive, developers had to write explicit Go functions to enforce those constraints. 

As the Kubernetes API surface expanded, this approach led to several systemic issues:
1. **Technical Debt:** The project accumulated roughly 18,000 lines of boilerplate validation code. This code was difficult to maintain, error-prone, and required intense scrutiny during code reviews.
2. **Inconsistency:** Without a centralized framework, validation rules were sometimes applied inconsistently across different resources.
3. **Opaque APIs:** Handwritten validation logic was difficult to discover or analyze programmatically. This meant clients and tooling couldn't predictably know validation rules without consulting the source code or encountering errors at runtime.

The solution proposed by SIG API Machinery was **Declarative Validation**: using Interface Definition Language (IDL) tags (specifically `+k8s:` marker tags) directly within `types.go` files to define validation rules.

---

## Enter `validation-gen`

At the core of the declarative validation feature is a new code generator called `validation-gen`. Just as Kubernetes uses generators for deep copies, conversions, and defaulting, `validation-gen` parses `+k8s:` tags and automatically generates the corresponding Go validation functions.

These generated functions are then registered seamlessly with the API scheme. The generator is designed as an extensible framework, allowing developers to plug in new "Validators" by describing the tags they parse and the Go logic they should produce. 

### A Comprehensive Suite of +k8s: Tags

The declarative validation framework introduces a comprehensive suite of marker tags that provide rich validation capabilities highly optimized for Go types. Here is a catalog of some of the most common tags you will now see in the Kubernetes codebase:

*   **Presence and Defaults:** `+k8s:optional`, `+k8s:required`, `+k8s:default=...`
*   **Basic Constraints:** `+k8s:minimum=0`, `+k8s:maximum=100`, `+k8s:maxLength=16`, `+k8s:format=dns-label`
*   **Collections:** `+k8s:listType=map`, `+k8s:listMapKey=type`
*   **Unions:** `+k8s:unionMember`, `+k8s:unionDiscriminator`
*   **Immutability:** `+k8s:immutable`, `+k8s:update=[NoSet, NoModify, NoClear]`

**Example Usage:**

```go
type ReplicationControllerSpec struct {
    // +k8s:optional
    // +k8s:minimum=0
    Replicas *int32 `json:"replicas,omitempty"`
}
```

By placing these tags directly above the field definitions, the constraints are self-documenting and immediately visible to anyone reading the type definitions.

---

## Solving the "Implicit Shadow" Problem with Lifecycle Tags

One of the biggest hurdles during the beta phase was the "Implicit Shadow" reality. When migrating existing fields to declarative tags, the handwritten code was kept around as a fallback. A global feature gate (`DeclarativeValidationBeta`) controlled whether the declarative rules were enforced. 

The problem was that a global "all-or-nothing" switch blocked the graduation of the feature. We couldn't force every migrated field across the entire Kubernetes codebase to become authoritative simultaneously without risking massive regressions.

To solve this, Kubernetes v1.36 finalizes the **Lifecycle Tags** model, which allows granular, field-level promotion of validation rules:
*   **`+k8s:alpha`:** Runs in shadow mode. The declarative rule is evaluated, and if it mismatches with the legacy handwritten rule, a metric (`declarative_validation_mismatch_total`) is emitted, but the error is suppressed.
*   **`+k8s:beta`:** Enforced by default, but can be globally bypassed if a catastrophic regression occurs.
*   **No prefix (Stable/GA):** The rule is permanently enforced, and the corresponding legacy handwritten code is deleted.

This granular lifecycle is the key mechanism that allowed declarative validation to reach GA safely.

---

## Advanced Capabilities: Ratcheting and Cross-Field Validation

Declarative validation isn't just about simple minimums and maximums; it brings sophisticated, production-grade validation strategies to the table.

### Validation Ratcheting

One of the most critical safety mechanisms in Kubernetes API updates is ensuring that new or stricter validation rules do not break existing, "grandfathered" objects. This is where **Validation Ratcheting** comes in.

If a user updates an existing object, the validation framework compares the incoming object with the `oldObject`. If a specific field's value is semantically equivalent to its prior state (i.e., the user didn't change it), the new validation rule is bypassed. This allows us to tighten validation rules for new creations or modifications without bricking objects that were created before the rule existed.

### Cross-Field Validation

Many Kubernetes APIs have rules that depend on the state of multiple fields (e.g., `FieldA` must be less than `FieldB`). The declarative framework handles this through **Cross-Field Validation**.

While tags are placed on individual fields, `validation-gen` intelligently "hoists" the validation logic to the common ancestor struct during code generation. The framework uses two primary referencing strategies:
1.  **Field Paths:** Direct dot-notation references (e.g., `+k8s:minimum(constraint: minValue)`).
2.  **Virtual Fields:** Identifier-based references designed for complex relationships like unions (e.g., `+k8s:memberOf(group: terminalStatus)`).


---

## Testing, Verification, and the Road Ahead

Reaching GA requires absolute confidence that the generated validation code behaves exactly as the legacy handwritten code did. To achieve this, the SIG API Machinery team implemented a rigorous testing and rollout strategy:
*   **Dual Implementation & Mismatch Metrics:** During migration, both handwritten and declarative logic run in parallel. Any discrepancies increment the `declarative_validation_mismatch_total` metric, alerting maintainers to edge cases.
*   **Equivalency Testing:** Every migration Pull Request must include exhaustive tests in `validation_test.go` that prove 100% functional equivalence between the old and new backends.
*   **Fuzzing:** Continuous fuzz testing is employed to catch unhandled panics or unexpected behaviors in the generated code.

### What's Next?

With the release of Kubernetes v1.36, Declarative Validation graduates to General Availability (GA). As a stable feature, the associated `DeclarativeValidation` feature gate is now unconditionally enabled. It has become the standard mechanism for adding new validation rules to Kubernetes native types.

Looking forward, the project is committed to adopting declarative validation even more extensively. This includes migrating the remaining legacy handwritten validation code for established APIs and ensuring that all new APIs leverage this framework from day one. This ongoing transition will continue to shrink the codebase's complexity while enhancing the consistency and reliability of the entire Kubernetes API surface.

## Getting Involved

The migration to declarative validation is a massive, ongoing effort. While the framework itself is GA, there is still work to be done migrating older APIs to the new declarative format. 

If you are interested in contributing to the core of Kubernetes API Machinery, this is a fantastic place to start. Check out the `validation-gen` documentation, look for issues tagged with `sig/api-machinery`, and join the conversation in the [#sig-api-machinery](https://kubernetes.slack.com/messages/sig-api-machinery) and [#sig-api-machinery-dev-tools](https://kubernetes.slack.com/messages/sig-api-machinery-dev-tools) channels on Kubernetes Slack (for an invitation, visit [https://slack.k8s.io/](https://slack.k8s.io/)).

A huge thank you to the SIG API Machinery community, reviewers, and everyone who tested this feature during its Alpha and Beta phases. Welcome to the declarative future of Kubernetes validation!
