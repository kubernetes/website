---
reviewers:
- deads2k
- sttts
- cici37
title: Mutating Admission Policy
content_type: concept
---

<!-- overview -->

{{< feature-state state="alpha" for_k8s_version="v1.32" >}}

This page provides an overview of Mutating Admission Policy.

<!-- body -->

## What is Mutating Admission Policy?

Mutating admission policies offer a declarative, in-process alternative to mutating admission webhooks.

Mutating admission policies use the Common Expression Language (CEL) to declare mutations to resources.
Mutations can be defined either with an *apply configuration* that is merged using the
[server side apply merge strategy](https://kubernetes.io/docs/reference/using-api/server-side-apply/#merge-strategy)
or a [JSON patch](https://jsonpatch.com/).

Mutating admission policies are highly configurable, enabling policy authors to define policies
that can be parameterized and scoped to resources as needed by cluster administrators.

## What Resources Make a Policy

A policy is generally made up of three resources:

- The `MutatingAdmissionPolicy` describes the abstract logic of a policy
  (think: "this policy sets a particular label to a particular value").

- A `MutatingAdmissionPolicyBinding` links the above resources together and provides scoping.
  If you only want to set an `owner` label for `Pods`, the binding is where you would
  specify this mutation.

- A parameter resource provides information to a `MutatingAdmissionPolicy` to make it a concrete
  statement (think "set the `owner` label to something that ends in `.company.com`").
  A native type such as ConfigMap or a CRD defines the schema of a parameter resource.
  `MutatingAdmissionPolicy` objects specify what Kind they are expecting for their parameter resource.

At least a `MutatingAdmissionPolicy` and a corresponding  `MutatingAdmissionPolicyBinding`
must be defined for a policy to have an effect.

If a `MutatingAdmissionPolicy` does not need to be configured via parameters, simply leave
`spec.paramKind` in  `MutatingAdmissionPolicy` not specified.

## Getting Started with Mutating Admission Policy

TODO
