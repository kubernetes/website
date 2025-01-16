---
content_type: "reference"
title: Kubernetes feature development and Container runtimes
weight: 10
---

The mechanics of a feature development that requires new CRI APIs is covered in
documentation on CRI API [feature-development](https://github.com/kubernetes/cri-api?tab=readme-ov-file#feature-development).
This article declares policies for developing new Kubernetes features
that require CRI API changes. The goal of these policies is to ensure great user
experience for people trying the new feature early, adopting it when it is
enabled by default, and relying on it as a GA functionality.

## Supported container runtimes

Features and CRI API are supposed to be portable and generic and not limited to
a specific container runtime. However at this moment we require every feature to
work on two container runtimes: [Containerd](https://containerd.io/) and
[CRI-O](https://cri-o.io/). These are two runtimes that are tested as part of a
kubernetes development and release process. When this document refers to two
container runtimes, it assumes both - Containerd and CRI-O. If any other
container runtimes begin working actively with the Kubernetes community, this
document will need to be updated.

## Same maturity level (for beta and GA)

Implementation of an API needed for a Kubernetes feature in a container runtime
MUST be at least the same maturity as in k8s at a moment of Kubernetes release.
This is similar to the [deprecation policy](/docs/reference/using-api/deprecation-policy/#deprecating-a-feature-or-behavior)
when one feature is replacing another.

With Containerd and CRI-O it means that for the GA features, there should be a
release of Containerd and CRI-O implementing APIs needed for the feature in
those container runtimes. And those APIs MUST NOT be marked as experimental
features ([Containerd experimental features](https://containerd.io/releases/#experimental-features)).
For the beta, neither container runtime has a notion of beta feature or release and
realistically the same maturity criteria applies as for GA.

## Same maturity level (for alpha)

There should be at least one implementation of an API needed for the Kubernetes
feature merged into the container runtime default branch (main) or marked as
experimental. An e2e test may demonstrate that the feature is working should be
merged alongside the code. Note, tests may run against the default branch of a
container runtime and the feature can be still not shipped.

The actual container runtime release may be delayed to the later stage, but
Kubernetes highly encourages fast availability of a release of a container
runtime that can be tested by early adopters.

## Minimal number of implementations

Both Containerd and CRI-O MUST have a GA release with the implementations of an
API needed for a Kubernetes feature before this Kubernetes feature can be
promoted to GA.

## Safe Kubernetes defaults

The feature cannot be enabled by default in Kubernetes as a beta feature before
the required APIs are implemented in both container runtimes (Containerd and
CRI-O) and there is a GA release of a container runtime for each. The feature
can be marked as beta, but disabled by default, if there is only one container
runtime implementation of a required API that is released as GA. Note, as for
any Kubernetes features, at least one release with the beta feature enabled by
default is required before it is progressing to GA.

## Guarantee portability

The feature design (KEP PR) MUST be lgtm-ed by container runtime maintainers of
CRI-O and Containerd.

The feature can only be merged as alpha in Kubernetes, if there is an agreement
from both container runtime maintainers on the feature design in general and API
shape. Gaining this agreement will often involve authoring the pull request
demonstrating an API implementation to the both container runtime repositories
or an alternative way for container runtime maintainers to confirm viability of
suggested CRI APIs.

## Guaranteed implementation

CRI API can only be merged if there is a PR in both - Kubernetes repository and
container runtime repository (at least one) utilizing this API and demoing the
feature working end to end. See CRI API
[feature-development](https://github.com/kubernetes/cri-api?tab=readme-ov-file#feature-development)
documentation.

## Features discoverability

Kubernetes features that depend on the environment or special container runtime
capabilities must have its own explicit API configuration (like Pod API or Node
API) and must not depend on the cluster or node configuration that is not
clearly exposed via these APIs. For example, it is OK to have windows specific
features that are configured via Pod API. But it is not OK to design a feature
that will work on one container runtime and incompatible with the other
container runtime. There are three exceptions to this case:

- there will be a different behavior during the feature adoption period while
  older runtime versions do not support the API yet. In those cases, attempting
  to try the feature must result in failing as fast as possible.  
- LTS and older versions of container runtimes may not have an implementation of
  an API and still be widely used by Kubernetes end users.  
- If any of container runtime underlying systems cannot support the feature
  in-principle (e.g. [kata containers](https://katacontainers.io/) with CRI-O
  may have limitations), while CRI-O still supports the feature without these
  systems configured, this must be designed as part of a normal operation. In
  this case, Pod or Node APIs must handle these cases gracefully and those must
  be documented clearly.
