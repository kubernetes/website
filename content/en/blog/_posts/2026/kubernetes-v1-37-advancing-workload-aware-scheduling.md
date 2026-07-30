---
layout: blog
title: "Kubernetes v1.37: Advancing Workload-Aware Scheduling"
draft: true
slug: kubernetes-v1-37-advancing-workload-aware-scheduling
author: >
  Maciej Skoczeń (Google),
  Antoni Zawodny (Google),
  Matt Matejczyk (Google),
  Bartosz Rejman (Google),
  Jon Huhn (Microsoft),
  Maciej Wyrzuc (Google),
  Heba Elayoty (Microsoft)
---

<!-- TODO(@mm4tt): Introduction paragraph summarizing the v1.37 release highlights -->

## Gang Scheduling and Workload/PodGroup APIs

<!-- TODO(@macsko): Content by feature owner. Discuss KEP-4671 updates, graduation to Beta, minCount mutability, ... -->

## Workload-Aware Preemption

<!-- TODO(@Argh4k): Content by feature owner. Discuss KEP-5710 updates, graduation to Beta, ... -->

## Topology-Aware Workload Scheduling

<!-- TODO(@brejman): Content by feature owner. Discuss 1.37 updates ... -->

## CompositePodGroup API

<!-- TODO(@tosi3k): Content by feature owner. Detail KEP-6012, support for complex workload hierarchies like JobSet or LWS, ... -->

## Controller Integration APIs

<!-- TODO(@helayoty): Content by feature owner. Explain KEP-6089, standardizing how workload controllers consume scheduling capabilities -->

## Integration with the Job Controller

<!-- TODO(@helayoty): Content by feature owner. Explain KEP-5547 updates, integration with KEP-6089, expanding support beyond static, indexed, fully-parallel Jobs -->

## DRA ResourceClaim Support for Workloads

<!-- TODO(@nojnhuh): Content by feature owner. Discuss KEP-5729 updates -->

## What's next?

<!-- TODO(@mm4tt): Future plans for v1.38+ -->

## Getting started

<!-- TODO(@mm4tt): Feature gates and API group enablement instructions for the above features -->

## Learn more

To dive deeper into the architecture and design of these features, read the KEPs:

* [KEP-4671: Gang Scheduling Support in Kubernetes](https://kep.k8s.io/4671)
* [KEP-5710: Workload-aware preemption](https://kep.k8s.io/5710)
* [KEP-5732: Topology-aware workload scheduling](https://kep.k8s.io/5732)
* [KEP-6012: CompositePodGroup API](https://kep.k8s.io/6012)
* [KEP-6089: WAS: Controller Integration APIs](https://kep.k8s.io/6089)
* [KEP-5547: WAS: Integrate Workload APIs with Job controller](https://kep.k8s.io/5547)
* [KEP-5729: DRA: ResourceClaim Support for Workloads](https://kep.k8s.io/5729)
