---
reviewers:
- klueska
- pohly
title: Dynamic Resource Allocation
content_type: concept
weight: 20
aliases:
- /docs/concepts/scheduling-eviction/dynamic-resource-allocation/
---

<!-- overview -->

{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

This section introduces _dynamic resource allocation (DRA)_ in Kubernetes.

{{< glossary_definition prepend="DRA is" term_id="dra" length="all" >}}

Allocating resources with DRA offers a similar experience to
[dynamic volume provisioning](/docs/concepts/storage/dynamic-provisioning/),
in which you use PersistentVolumeClaims to _claim_ storage capacity from storage classes,
and request the claimed capacity for use in your Pods.

<!-- body -->

### Benefits of DRA {#dra-benefits}

DRA provides a flexible way to categorize, request, and use devices in your cluster.
Using DRA provides benefits like the following:

* **Flexible device filtering**: use common expression language (CEL) to perform
  fine-grained filtering for specific device attributes.
* **Device sharing**: share the same resource with multiple containers or Pods
  by referencing the corresponding resource claim.
* **Centralized device categorization**: device drivers and cluster admins can
  use device classes to provide app operators with hardware categories that are
  optimized for various use cases. For example, you can create a cost-optimized
  device class for general-purpose workloads, and a high-performance device
  class for critical jobs.
* **Simplified Pod requests**: with DRA, app operators don't need to specify
  device quantities in Pod resource requests. Instead, the Pod references a
  resource claim, and the device configuration in that claim applies to the Pod.

These benefits provide significant improvements in the device allocation
workflow when compared to
[device plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/),
which require per-container device requests, don't support device sharing, and
don't support expression-based device filtering.

### Types of DRA users {#dra-user-types}

The workflow of using DRA to allocate devices involves the following types of users:

* **Device owner**: responsible for devices. Device owners might be commercial
  vendors, the cluster operator, or another entity. To use DRA, devices must
  have DRA-compatible drivers that do the following:

  * Create ResourceSlices that provide Kubernetes with information about
    nodes and resources.
  * Update ResourceSlices when resource capacity in the cluster changes.
  * Optionally, create DeviceClasses that workload operators can use to
    claim devices.

* **Cluster admin**: responsible for configuring clusters and nodes,
  attaching devices, installing drivers, and similar tasks. To use DRA,
  cluster admins do the following:

  * Attach devices to nodes.
  * Install device drivers that support DRA.
  * Optionally, create DeviceClasses that workload operators can use to claim devices.

* **Workload operator**: responsible for deploying and managing workloads in the
  cluster. To use DRA to allocate devices to Pods, workload operators do the following:

  * Create ResourceClaims or ResourceClaimTemplates to request specific
    configurations within DeviceClasses.
  * Deploy workloads that use specific ResourceClaims or ResourceClaimTemplates.

## Limitations

* The Kubernetes scheduler doesn't support
  [preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/) for
  DRA resources. This means that an existing Pod that's running on a node and is
  using DRA resources can't be preempted by a higher-priority Pod that also needs
  DRA resources. The high-priority Pod will remain in a pending state until the device
  becomes available, which happens when the conflicting Pod terminates or is
  manually deleted.

## {{% heading "whatsnext" %}}

- [Set Up DRA in a Cluster](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster/)
- [Allocate devices to workloads using DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/)
- [Access DRA device metadata](/docs/tasks/configure-pod-container/assign-resources/access-dra-device-metadata/)
- For more information on the design, see the
  [Dynamic Resource Allocation with Structured Parameters](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4381-dra-structured-parameters)
  KEP.
