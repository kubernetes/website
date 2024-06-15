---
layout: blog
title: 'Kubernetes 1.31: MatchLabelKeys in PodAffinity graduates to beta'
date: 2024-XX-XX
slug: matchlabelkeys-podaffinity
author: >
  Kensei Nakada (Tetrate)
---

Kubernetes 1.29 introduced new fields `MatchLabelKeys` and `MismatchLabelKeys` in PodAffinity and PodAntiAffinity.

In Kubernetes 1.31, this feature moves to beta and the corresponding feature gate (`MatchLabelKeysInPodAffinity`) gets enabled by default.

## `MatchLabelKeys` - accurate scheduling during rolling upgrades

During rolling upgrades, a cluster may have Pods from multiple versions of a Deployment. 
This makes it challenging for the scheduler to distinguish between them based on the `LabelSelector` specified in PodAffinity or PodAntiAffinity. 

This can lead to suboptimal scheduling, for example:
- New version Pods are placed near old version Pods (PodAffinity), which will eventually be removed after rolling upgrades.
- Old version Pods are spread out, and new version Pods cannot find nodes due to PodAntiAffinity.

`MatchLabelKeys` addresses this problem.
`MatchLabelKeys` is a set of Pod label keys, 
and the scheduler looks up the values of these keys from the new Pod's labels and combines them with `LabelSelector` 
so that PodAffinity matches Pods that have the same key-value in labels.

By using label [pod-template-hash](/docs/concepts/workloads/controllers/deployment/#pod-template-hash-label) in `MatchLabelKeys`, 
you can ensure that only Pods of the same version are evaluated for PodAffinity or PodAntiAffinity.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: application-server
...
  affinity:
    podAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchExpressions:
          - key: app
            operator: In
            values:
            - database
        topologyKey: topology.kubernetes.io/zone
        matchLabelKeys: 
        - pod-template-hash
```

The above matchLabelKeys will be translated in Pods like:

```yaml
kind: Pod
metadata:
  name: application-server
  labels:
    pod-template-hash: xyz
...
  affinity:
    podAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchExpressions:
          - key: app
            operator: In
            values:
            - database
          - key: pod-template-hash # Added from matchLabelKeys; Only Pods from the same replicaset will match this affinity.
            operator: In
            values:
            - xyz 
        topologyKey: topology.kubernetes.io/zone
        matchLabelKeys: 
        - pod-template-hash
```

## `MismatchLabelKeys` - service isolation

`MismatchLabelKeys` is a set of Pod label keys, like `MatchLabelKeys`,
which looks up the values of these keys from the new Pod's labels, and merge them with `LabelSelector` as `key notin (value)`
so that PodAffinity does _not_ match Pods that have the same key-value in labels.

Suppose all Pods for each tenant get `tenant` label via a controller or a manifest management tool like Helm. 

Although the value of `tenant` label is unknown when composing each workload's manifest, 
the cluster admin wants to achieve exclusive 1:1 tenant to domain placement for a tenant isolation.

`MismatchLabelKeys` works for this usecase;
By applying the following affinity globally using a mutating webhook, 
the cluster admin can ensure that the Pods from the same tenant will land on the same domain exclusively, 
meaning Pods from other tenants won't land on the same domain.

```yaml
affinity:
  podAffinity:      # ensures the pods of this tenant land on the same node pool
    requiredDuringSchedulingIgnoredDuringExecution:
    - matchLabelKeys:
        - tenant
      topologyKey: node-pool
  podAntiAffinity:  # ensures only Pods from this tenant lands on the same node pool
    requiredDuringSchedulingIgnoredDuringExecution:
    - mismatchLabelKeys:
        - tenant
      labelSelector:
        matchExpressions:
        - key: tenant
          operator: Exists
      topologyKey: node-pool
```

The above matchLabelKeys and mismatchLabelKeys will be translated to like:

```yaml
kind: Pod
metadata:
  name: application-server
  labels:
    tenant: service-a
spec: 
  affinity:
    podAffinity:      # ensures the pods of this tenant land on the same node pool
      requiredDuringSchedulingIgnoredDuringExecution:
      - matchLabelKeys:
          - tenant
        topologyKey: node-pool
        labelSelector:
          matchExpressions:
          - key: tenant
            operator: In
            values:
            - service-a 
    podAntiAffinity:  # ensures only Pods from this tenant lands on the same node pool
      requiredDuringSchedulingIgnoredDuringExecution:
      - mismatchLabelKeys:
          - tenant
        labelSelector:
          matchExpressions:
          - key: tenant
            operator: Exists
          - key: tenant
            operator: NotIn
            values:
            - service-a 
        topologyKey: node-pool
```

## Getting involved 

These features are managed by Kubernetes [SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling).

Please join us and share your feedback. We look forward to hearing from you!

## How can I learn more? 

- [The official document of PodAffinity](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)
- [KEP-3633: Introduce MatchLabelKeys and MismatchLabelKeys to PodAffinity and PodAntiAffinity](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/3633-matchlabelkeys-to-podaffinity/README.md#story-2)
