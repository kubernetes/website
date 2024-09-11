---
title: CRI Pod & Container Metrics
content_type: reference
weight: 50
description: >-
  Collection of Pod & Container metrics via the CRI.
---


<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="alpha" >}}

The [kubelet](/docs/reference/command-line-tools-reference/kubelet/) collects pod and
container metrics via [cAdvisor](https://github.com/google/cadvisor). As an alpha feature,
Kubernetes lets you configure the collection of pod and container
metrics via the {{< glossary_tooltip term_id="container-runtime-interface" text="Container Runtime Interface">}} (CRI). You
must enable the `PodAndContainerStatsFromCRI` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) and
use a compatible CRI implementation (containerd >= 1.6.0, CRI-O >= 1.23.0) to
use the CRI based collection mechanism.

<!-- body -->

## CRI Pod & Container Metrics

With `PodAndContainerStatsFromCRI` enabled, the kubelet polls the underlying container
runtime for pod and container stats instead of inspecting the host system directly using cAdvisor.
The benefits of relying on the container runtime for this information as opposed to direct
collection with cAdvisor include:

- Potential improved performance if the container runtime already collects this information
  during normal operations. In this case, the data can be re-used instead of being aggregated
  again by the kubelet.

- It further decouples the kubelet and the container runtime allowing collection of metrics for
  container runtimes that don't run processes directly on the host with kubelet where they are
  observable by cAdvisor (for example: container runtimes that use virtualization).
  