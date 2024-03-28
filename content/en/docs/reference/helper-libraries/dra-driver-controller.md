---
title: DRA Resource Driver Controller Helper Library
description: Handles most of functionality common for all DRA resource drivers' controllers.
weight: 10
---

<!-- overview -->

When implementing
[Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) (DRA)
resource driver controller, the communication with the scheduler is done through API objects.

This library implements some of the functionality that is common for all resource
drivers, regardless of the actual resource managed or allocation logic. This includes, but isn't restricted to:

- watching and caching of {{< glossary_tooltip term_id="ResourceClaim" text="ResourceClaims">}}
- updating the ResourceClaim when the allocation or deallocation is done
- watching and caching of {{< glossary_tooltip term_id="PodSchedulingContext" text="PodSchedulingContext">}}
- updating the PodSchedulingContext

<!-- body -->

## Usage

Controller helper library communicates with the scheduler through ResourceClaim
and PodSchedulingContext objects. The 3rd party implementation of the resource
driver only needs to implement the validation of the ResourceClaim and
ResourceClass parameters objects, and the allocation logic itself.

The controller helper library is expecting the actual resource driver controller
to implement
[Driver interface](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/controller#Driver).

## Example usage

The [example resource driver](https://github.com/kubernetes-sigs/dra-example-driver)'s controller
uses helper library [here](https://github.com/kubernetes-sigs/dra-example-driver/blob/main/cmd/dra-example-controller/main.go)
