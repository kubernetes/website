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

As the core WAS APIs mature, so do their integrations with {{< glossary_tooltip text="Dynamic Resource Allocation" term_id="dra" >}}
(DRA). Kubernetes v1.36 introduced the [`DRAWorkloadResourceClaims`](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims)
feature, allowing {{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}
to be replicated and reserved for entire PodGroups and shared by all their
member Pods:

```yaml
apiVersion: scheduling.k8s.io/v1beta1
kind: PodGroup
metadata:
  name: training-job-workers-pg
spec:
  ...
  resourceClaims:
    - name: pg-claim
      resourceClaimTemplateName: my-claim-template
---
apiVersion: v1
kind: Pod
metadata:
  name: topology-aware-workers-pg-pod
spec:
  ...
  schedulingGroup:
    podGroupName: training-job-workers-pg
  resourceClaims:
    - name: pg-claim
      resourceClaimTemplateName: my-claim-template
```

In Kubernetes v1.37, the `DRAWorkloadResourceClaims` feature graduated to Beta.
While the API and core functionality of the feature remain unchanged, one change
eliminates some potentially surprising behavior when disabling the feature.
Previously when one of a Pod's `spec.resourceClaims` referenced a
ResourceClaimTemplate and matched one of its PodGroup's `spec.resourceClaims`
and the feature was _disabled_, a ResourceClaim was created for the Pod instead
of the PodGroup. In that scenario in v1.37, no ResourceClaim is created at all.
This change prevents Kubernetes from creating a flood of ResourceClaims from a
ResourceClaimTemplate and potentially exhausting DRA resources when a
claim intended to be shared by a whole PodGroup is replicated for each and every
Pod in the group.

For more information, see the [feature documentation](/docs/concepts/resource-management/dynamic-resource-allocation/dra-api#workload-resource-claims).

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
