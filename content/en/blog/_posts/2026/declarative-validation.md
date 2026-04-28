---
layout: blog
title: "Kubernetes v1.36: Declarative Validation Graduates to GA"
date: 2026-03-23T10:00:00-08:00
draft: true
slug: kubernetes-v1-36-declarative-validation-ga
author: >
  [Yongrui Lin](https://github.com/yongruilin)
---

In Kubernetes v1.36, **Declarative Validation** for Kubernetes native types has reached General Availability (GA).

For users, this means more reliable, predictable, and better-documented APIs. By moving to a declarative model, the project also unlocks the future ability to publish validation rules via OpenAPI and integrate with ecosystem tools like Kubebuilder. For contributors and ecosystem developers, this replaces thousands of lines of handwritten validation code with a unified, maintainable framework.

This post covers why this migration was necessary, how the declarative validation framework works, and what new capabilities come with this GA release.

## The Motivation: Escaping the "Handwritten" Technical Debt

For years, the validation of Kubernetes native APIs relied almost entirely on handwritten Go code. If a field needed to be bounded by a minimum value, or if two fields needed to be mutually exclusive, developers had to write explicit Go functions to enforce those constraints. 

As the Kubernetes API surface expanded, this approach led to several systemic issues:
1. **Technical Debt:** The project accumulated roughly 18,000 lines of boilerplate validation code. This code was difficult to maintain, error-prone, and required intense scrutiny during code reviews.
2. **Inconsistency:** Without a centralized framework, validation rules were sometimes applied inconsistently across different resources.
3. **Opaque APIs:** Handwritten validation logic was difficult to discover or analyze programmatically. This meant clients and tooling couldn't predictably know validation rules without consulting the source code or encountering errors at runtime.

The solution proposed by SIG API Machinery was **Declarative Validation**: using Interface Definition Language (IDL) tags (specifically `+k8s:` marker tags) directly within `types.go` files to define validation rules.

## Enter `validation-gen`

At the core of the declarative validation feature is a new code generator called `validation-gen`. Just as Kubernetes uses generators for deep copies, conversions, and defaulting, `validation-gen` parses `+k8s:` tags and automatically generates the corresponding Go validation functions.

These generated functions are then registered seamlessly with the API scheme. The generator is designed as an extensible framework, allowing developers to plug in new "Validators" by describing the tags they parse and the Go logic they should produce. 

### A Comprehensive Suite of +k8s: Tags

The declarative validation framework introduces a comprehensive suite of marker tags that provide rich validation capabilities highly optimized for Go types. For a full list of supported tags, check out the [official documentation](https://kubernetes.io/docs/reference/using-api/declarative-validation/#declarative-validation-tag-reference). Here is a catalog of some of the most common tags you will now see in the Kubernetes codebase:

*   **Presence:** `+k8s:optional`, `+k8s:required`
*   **Basic Constraints:** `+k8s:minimum=0`, `+k8s:maximum=100`, `+k8s:maxLength=16`, `+k8s:format=k8s-short-name`
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

## Advanced Capabilities: "Ambient Ratcheting"

One of the most substantial outcomes of this work is that validation ratcheting is now a standard, ambient part of the API. In the past, if we needed to tighten validation, we had to first add handwritten ratcheting code, wait a release, and then tighten the validation to avoid breaking existing objects. 

With declarative validation, this safety mechanism is built-in. If a user updates an existing object, the validation framework compares the incoming object with the `oldObject`. If a specific field's value is semantically equivalent to its prior state (i.e., the user didn't change it), the new validation rule is bypassed. This "ambient ratcheting" means we can loosen or tighten validation immediately and in the least disruptive way possible.


## Scaling API Reviews with `kube-api-linter`

Reaching GA required absolute confidence in the generated code, but our vision extends beyond just validation. Declarative validation is a key part of a comprehensive approach to making API review easier, more consistent, and highly scalable.

By moving validation rules out of opaque Go functions and into structured markers, we are empowering tools like `kube-api-linter`. This linter can now statically analyze API types and enforce API conventions automatically, significantly reducing the manual burden on SIG API Machinery reviewers and providing immediate feedback to contributors.

## What's next?

With the release of Kubernetes v1.36, Declarative Validation graduates to General Availability (GA). As a stable feature, the associated `DeclarativeValidation` feature gate is now enabled by default. It has become the primary mechanism for adding new validation rules to Kubernetes native types.

Looking forward, the project is committed to adopting declarative validation even more extensively. This includes migrating the remaining legacy handwritten validation code for established APIs and requiring its use for all new APIs and new fields. This ongoing transition will continue to shrink the codebase's complexity while enhancing the consistency and reliability of the entire Kubernetes API surface.

Beyond the core migration, declarative validation also unlocks an exciting future for the broader ecosystem. Because validation rules are now defined as structured markers rather than opaque Go code, they can be parsed and reflected in the OpenAPI schemas published by the Kubernetes API server. This paves the way for tools like `kubectl`, client libraries, and IDEs to perform rich client-side validation before a request is ever sent to the cluster. The same declarative framework can also be consumed by ecosystem tools like Kubebuilder, enabling a more consistent developer experience for authors of Custom Resource Definitions (CRDs).

## Getting involved

The migration to declarative validation is an ongoing effort. While the framework itself is GA, there is still work to be done migrating older APIs to the new declarative format. 

If you are interested in contributing to the core of Kubernetes API Machinery, this is a fantastic place to start. Check out the `validation-gen` documentation, look for issues tagged with `sig/api-machinery`, and join the conversation in the [#sig-api-machinery](https://kubernetes.slack.com/messages/sig-api-machinery) and [#sig-api-machinery-dev-tools](https://kubernetes.slack.com/messages/sig-api-machinery-dev-tools) channels on Kubernetes Slack (for an invitation, visit [https://slack.k8s.io/](https://slack.k8s.io/)). You can also attend the [SIG API Machinery meetings](https://github.com/kubernetes/community/tree/master/sig-api-machinery#meetings) to get involved directly.

## Acknowledgments

A huge thank you to everyone who helped bring this feature to GA:

* [Tim Hockin](https://github.com/thockin)
* [Joe Betz](https://github.com/jpbetz)
* [Aaron Prindle](https://github.com/aaron-prindle)
* [Lalit Chauhan](https://github.com/lalitc375)
* [David Eads](https://github.com/deads2k)
* [Darshan Murthy](https://github.com/darshansreenivas)
* [Jordan Liggitt](https://github.com/liggitt)
* [Patrick Ohly](https://github.com/pohly)
* [Maciej Szulik](https://github.com/soltysh)
* [Wojciech Tyczynski](https://github.com/wojtek-t)
* [Joel Speed](https://github.com/JoelSpeed)
* [Bryce Palmer](https://github.com/everettraven)

And the many others across the Kubernetes community who contributed along the way.

Welcome to the declarative future of Kubernetes validation!
