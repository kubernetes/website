---
layout: blog
title: "Kubernetes 1.33: Storage Capacity Scoring of Nodes for Dynamic Provisioning (alpha)"
date: 2025-04-23
draft: true
slug: kubernetes-1-33-storage-capacity-scoring-feature
author: >
  Yuma Ogami (Cybozu)
---

Kubernetes v1.33 introduces a new alpha feature called `StorageCapacityScoring`. This feature adds a scoring method for pod scheduling
with [the topology-aware volume provisioning](/blog/2018/10/11/topology-aware-volume-provisioning-in-kubernetes/).
This feature eases to schedule pods on nodes with either the most or least available storage capacity.

## About this feature

This feature extends the kube-scheduler's VolumeBinding plugin to perform scoring using node storage capacity information
obtained from [Storage Capacity](/docs/concepts/storage/storage-capacity/). Currently, you can only filter out nodes with insufficient storage capacity.
So, you have to use a scheduler extender to achieve storage-capacity-based pod scheduling.

This feature is useful for provisioning node-local PVs, which have size limits based on the node's storage capacity. By using this feature,
you can assign the PVs to the nodes with the most available storage space so that you can expand the PVs later as much as possible.

In another use case, you might want to reduce the number of nodes as much as possible for low operation costs in cloud environments by choosing
the least storage capacity node. This feature helps maximize resource utilization by filling up nodes more sequentially, starting with the most
utilized nodes first that still have enough storage capacity for the requested volume size.

## How to use

### Enabling the feature

In the alpha phase, `StorageCapacityScoring` is disabled by default. To use this feature, add `StorageCapacityScoring=true`
to the kube-scheduler command line option `--feature-gates`.

### Configuration changes

You can configure node priorities based on storage utilization using the `shape` parameter in the VolumeBinding plugin configuration.
This allows you to prioritize nodes with higher available storage capacity (default) or, conversely, nodes with lower available storage capacity.
For example, to prioritize lower available storage capacity, configure `KubeSchedulerConfiguration` as follows:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  ...
  pluginConfig:
  - name: VolumeBinding
    args:
      ...
      shape:
      - utilization: 0
        score: 0
      - utilization: 100
        score: 10
```

For more details, please refer to the [documentation](/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-VolumeBindingArgs).

## Further reading

- [KEP-4049: Storage Capacity Scoring of Nodes for Dynamic Provisioning](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/4049-storage-capacity-scoring-of-nodes-for-dynamic-provisioning/README.md)

## Additional note: Relationship with VolumeCapacityPriority

The alpha feature gate `VolumeCapacityPriority`, which performs node scoring based on available storage capacity during static provisioning,
will be deprecated and replaced by `StorageCapacityScoring`.

Please note that while `VolumeCapacityPriority` prioritizes nodes with lower available storage capacity by default,
`StorageCapacityScoring` prioritizes nodes with higher available storage capacity by default.
