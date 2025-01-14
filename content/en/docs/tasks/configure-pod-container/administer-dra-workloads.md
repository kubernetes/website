---
title: Administer Workloads using Dynamic Resource Allocation
content_type: task
weight: 270
---

<!-- overview -->

{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

This page shows how to administer workloads using Dynamic Resource Allocation to
access devices.


## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


<!-- steps -->

## Troubleshooting

### Unscheduled Pods

#### DRA feature gate is not enabled

#### No corresponding DRA driver is installed

#### The requested device is out of capacity

- Including how to check the total and allocated capacity of devices

### Pod stuck in Terminating Phase

- DRA driver for allocated claim may have stopped: https://github.com/kubernetes/kubernetes/issues/129402


## {{% heading "whatsnext" %}}

### For workload administrators

* See more [Example Dynamic Resource Allocation Configurations](/docs/tutorials/dynamic-resource-allocation/example-dra-configurations/)
* [Schedule GPUs](/docs/tasks/manage-gpus/scheduling-gpus/)

### For device driver authors

* [Example Resource Driver for Dynamic Resource Allocation](https://github.com/kubernetes-sigs/dra-example-driver)