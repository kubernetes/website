---
title: Limit Storage Consumption
content_type: task
weight: 240
---

<!-- overview -->

This example demonstrates how to limit the amount of storage consumed in a namespace.

The following resources are used in the demonstration: [ResourceQuota](/docs/concepts/policy/resource-quotas/),
[LimitRange](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/),
and [PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/).


## {{% heading "prerequisites" %}}


* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->
## Scenario: Limiting Storage Consumption

The cluster-admin is operating a cluster on behalf of a user population and the admin wants to control
how much storage a single namespace can consume in order to control cost.

The admin would like to limit:

1. The number of persistent volume claims in a namespace
2. The amount of storage each claim can request
3. The amount of cumulative storage the namespace can have


## LimitRange to limit requests for storage

Adding a `LimitRange` to a namespace enforces storage request sizes to a minimum and maximum. Storage is requested
via `PersistentVolumeClaim`. The admission controller that enforces limit ranges will reject any PVC that is above or below
the values set by the admin.

In this example, a PVC requesting 10Gi of storage would be rejected because it exceeds the 2Gi max.

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: storagelimits
spec:
  limits:
  - type: PersistentVolumeClaim
    max:
      storage: 2Gi
    min:
      storage: 1Gi
```

Minimum storage requests are used when the underlying storage provider requires certain minimums. For example,
AWS EBS volumes have a 1Gi minimum requirement.

## ResourceQuota to limit PVC count and cumulative storage capacity

Admins can limit the number of PVCs in a namespace as well as the cumulative capacity of those PVCs. New PVCs that exceed
either maximum value will be rejected.

In this example, a 6th PVC in the namespace would be rejected because it exceeds the maximum count of 5. Alternatively,
a 5Gi maximum quota when combined with the 2Gi max limit above, cannot have 3 PVCs where each has 2Gi. That would be 6Gi requested
 for a namespace capped at 5Gi.

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: storagequota
spec:
  hard:
    persistentvolumeclaims: "5"
    requests.storage: "5Gi"
```

<!-- discussion -->

## Summary

A limit range can put a ceiling on how much storage is requested while a resource quota can effectively cap the storage
consumed by a namespace through claim counts and cumulative storage capacity. The allows a cluster-admin to plan their
cluster's storage budget without risk of any one project going over their allotment.
