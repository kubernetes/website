---
layout: blog
title: "Kubernetes 1.33: Volume Populators Graduate to GA"
date: 2025-04-17
slug: volume-populators-ga
author: >
  Danna Wang (Google)
  Sunny Song (Google)
---

The volume populators feature is now entering GA! The `AnyVolumeDataSource` feature
gate defaults to enabled in Kubernetes v1.33, which means that users can specify any custom resource
as the data source of a PVC.

## What is new

There are three major enhancements from beta.

### Populator Pod is optional

During the beta phase, we discovered that initiating data population doesn't always require a dedicated populator pod. In some cases, it's more efficient to interact with the cloud provider's APIs directly from the controller pod.

To accommodate this, we've introduced three new plugin-based functions:
* PopulateFn(): Executes the provider-specific data population logic.
* PopulateCompleteFn(): Checks if the data population operation has finished successfully.
* PopulateCleanupFn(): Cleans up temporary resources created by the provider-specific functions after data population is completed

### Flexible metric handling for providers

Our beta phase highlighted a new requirement: the need to aggregate metrics not just from lib-volume-populator, but also from other components within the provider's codebase.

To address this, we've introduced a provider metric manager. This enhancement delegates the implementation of metrics logic to the provider itself, rather than relying solely on lib-volume-populator. This shift provides greater flexibility and control over metrics collection and aggregation, enabling a more comprehensive view of provider performance.

### Clean up temp resources

During the beta phase, the volume populator couldn't handle PersistentVolumeClaim (PVC) deletions that occurred while volume population was in progress due to limitations in finalizer handling. To ensure a smooth transition to GA, we've enhanced the populator to support the deletion of temporary resources if the original PVC is deleted. This prevents resource leaks and ensures a more robust and reliable system.

## How to use it

To try it out, please follow the [steps](https://kubernetes.io/blog/2022/05/16/volume-populators-beta/#trying-it-out) in the previous beta blog.

## Future Feature Requests

For next step, there are several potential feature requests for volume populator:

* Multi sync: it is a one direction sync from source defined to the destination. But it will happen multiple times, either by an internal(like a periodically cron job) or a one time trigger by the user
* Bidirectional sync: an extension of multi sync but make it bidirectional for between source destination
* Populate data with priorities: with a list of different dataSourceRef, populate based on priorities
* Populate data from multiple sources of the same provider: populate multiple different sources to one destination
* Populate data from multiple sources of the different providers: populate multiple different sources to one destination, pipelining different resources’ population

To ensure we're building something truly valuable, we'd love to hear about any specific use cases you have in mind for this feature. For any inquiries or specific questions related to volume populator, please reach out to the [SIG Storage community Slack channel](https://app.slack.com/client/T09NY5SBT/C09QZFCE5).
