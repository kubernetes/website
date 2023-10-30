---
title: DRA Resource Driver Controller Helper Library
description: Handles most of functionality common for all DRA resource drivers' kubelet plugins.
weight: 20
---

<!-- overview -->

This library implements some of the functionality that the
[Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) (DRA)
resource drivers' kubelet plugins need to implement, that is common for all of
them, regardless of the actual resource managed or allocation logic. For example:

- setting up non-blocking gRPC server on a Unix domain socket, and spawning a
goroutine to handle requests for arbitrary services
- registration with Kubelet
- graceful shutdown

<!-- body -->

## Usage

DRA kubelet plugin helper code expects the resource driver to implement
[NodeServer](https://pkg.go.dev/k8s.io/kubelet/pkg/apis/dra/v1alpha3#NodeServer) interface with
the actual logic of how the resources should be prepared and unprepared.

Kubelet will gather info about all the unprepared ResourceClaims, that Pod actually uses
(not just references), and pass it to NodePrepareResources call. If any number of claims were not
successfully prepared, the kubelet will continue repeating the same call, passing info about unprepared
ResourceClaims.

Same way, information about the prepared ResourceClaims is passed to NodeUnprepareResources when the
last Pod, that was using the ResourceClaims, no longer uses them.

## Example usage

The [example resource driver](https://github.com/kubernetes-sigs/dra-example-driver)'s kubelet plugin
uses helper library to start the daemon [here](https://github.com/kubernetes-sigs/dra-example-driver/blob/main/cmd/dra-example-kubeletplugin/main.go)

https://github.com/kubernetes-sigs/dra-example-driver/blob/main/cmd/dra-example-controller/main.go