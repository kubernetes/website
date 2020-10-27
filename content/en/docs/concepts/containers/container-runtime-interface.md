
---
reviewers:
- dchen1107
- derekwaynecarr
title: Container Runtime Interface
content_type: concept
weight: 20
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.20" state="beta" >}}

This page describes the Container Runtime Interface (CRI).

kubelet communicates with a container runtime such as docker, containerd or CRI-O over the CRI
API. CRI is a grpc API with kubelet as the client and a container runtime implmenting the
server side.

CRI consists of an image service and a runtime service.

The runtime service is for managing pods and containers. 

The image service is concerned with managing images for containers.