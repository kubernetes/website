---
title: Container Runtime Interface (CRI)
id: cri
date: 2021-11-24
full_link: /docs/concepts/architecture/cri
short_description: >
  Protocol for communication between the kubelet and the local container runtime.

aka:
tags:
  - fundamental
---

The main protocol for the communication between the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} and Container Runtime.

<!--more-->

The Kubernetes Container Runtime Interface (CRI) defines the main
[gRPC](https://grpc.io) protocol for the communication between the
[node components](/docs/concepts/architecture/#node-components)
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} and
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}.
