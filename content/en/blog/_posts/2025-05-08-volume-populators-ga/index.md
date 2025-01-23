---
layout: blog
title: "Kubernetes 1.33: Volume Populators Graduate to GA"
date: 2025-06-23
draft: true
slug: kubernetes-v1-33-volume-populators-ga
author: >
  Danna Wang (Google)
  Sunny Song (Google)
---

Kubernetes _volume populators_ are now  generally available (GA)! The `AnyVolumeDataSource` feature
gate is treated as always enabled for Kubernetes v1.33, which means that users can specify any appropriate
[custom resource](/docs/concepts/extend-kubernetes/api-extension/custom-resources/#custom-resources)
as the data source of a PersistentVolumeClaim (PVC).

An example of how to use dataSourceRef in PVC:
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc1
spec:
  ...
  dataSourceRef:
    apiGroup: provider.example.com
    kind: Provider
    name: provider1
```

## What is new

There are four major enhancements from beta.

### Populator Pod is optional

During the beta phase, contributors to Kubernetes identified potential resource leaks with PersistentVolumeClaim (PVC) deletion while volume population was in progress; these leaks happened due to limitations in finalizer handling.
Ahead of the graduation to general availability, the Kubernetes project added support to delete temporary resources (PVC prime, etc.) if the original PVC is deleted.

To accommodate this, we've introduced three new plugin-based functions:
* `PopulateFn()`: Executes the provider-specific data population logic.
* `PopulateCompleteFn()`: Checks if the data population operation has finished successfully.
* `PopulateCleanupFn()`: Cleans up temporary resources created by the provider-specific functions after data population is completed

A provider example is added in [lib-volume-populator/example](https://github.com/kubernetes-csi/lib-volume-populator/tree/master/example).

### Mutator functions to modify the Kubernetes resources

For GA, the CSI volume populator controller code gained a `MutatorConfig`, allowing the specification of mutator functions to modify Kubernetes resources.
For example, if the PVC prime is not an exact copy of the PVC and you need provider-specific information for the driver, you can include this information in the optional `MutatorConfig`. 
This allows you to customize the Kubernetes objects in the volume populator.

### Flexible metric handling for providers

Our beta phase highlighted a new requirement: the need to aggregate metrics not just from lib-volume-populator, but also from other components within the provider's codebase.

To address this, SIG Storage introduced a [provider metric manager](https://github.com/kubernetes-csi/lib-volume-populator/blob/8a922a5302fdba13a6c27328ee50e5396940214b/populator-machinery/controller.go#L122).
This enhancement delegates the implementation of metrics logic to the provider itself, rather than relying solely on lib-volume-populator.
This shift provides greater flexibility and control over metrics collection and aggregation, enabling a more comprehensive view of provider performance.

### Clean up for temporary resources

During the beta phase, we identified potential resource leaks with PersistentVolumeClaim (PVC) deletion while volume population was in progress, due to limitations in finalizer handling. We have improved the populator to support the deletion of temporary resources (PVC prime, etc.) if the original PVC is deleted in this GA release.

## How to use it

To try it out, please follow the [steps](/blog/2022/05/16/volume-populators-beta/#trying-it-out) in the previous beta blog.

## Future directions and potential feature requests

For next step, there are several potential feature requests for volume populator:

* Multi sync: the current implementation is a one-time unidirectional sync from source to destination. This can be extended to support multiple syncs, enabling periodic syncs or allowing users to sync on demand
* Bidirectional sync: an extension of multi sync above, but making it bidirectional between source and destination
* Populate data with priorities: with a list of different dataSourceRef, populate based on priorities
* Populate data from multiple sources of the same provider: populate multiple different sources to one destination
* Populate data from multiple sources of the different providers: populate multiple different sources to one destination, pipelining different resources’ population

To ensure we're building something truly valuable, Kubernetes SIG Storage would love to hear about any specific use cases you have in mind for this feature.
For any inquiries or specific questions related to volume populator, please reach out to the [SIG Storage community](https://github.com/kubernetes/community/tree/master/sig-storage).
