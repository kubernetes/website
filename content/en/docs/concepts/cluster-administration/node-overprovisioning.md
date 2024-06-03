---
title: Configure Node Overprovisioning
content_type: concept
description: >-
   Strategies for proactively reserving cluster resources to improve responsiveness during scaling events.
weight: 130
---

<!-- overview -->

{{< glossary_tooltip text="Node" term_id="node" >}} overprovisioning is a strategy for proactively reserving a portion of your cluster's compute resources to reduce the time it takes to schedule new pods during scaling events. This can improve your cluster's responsiveness to sudden spikes in traffic or workload demands. 

By intentionally maintaining some unused capacity, you ensure that resources are immediately available when new pods are created, preventing them from going into a pending state while the cluster scales up.

<!-- body -->

## How Node Overprovisioning Works

The most common way to implement node overprovisioning is to use a _placeholder_ deployment running pods with very low priority and a minimal resource footprint.  These pods consume resources that could otherwise be used by regular application pods. However, due to their low priority, they are easily preempted _evicted_ when higher-priority pods need those resources.

This preemption mechanism is key to dynamic overprovisioning.  As the cluster becomes busier, the placeholder pods are preempted, making room for new application pods. This triggers your node autoscaler to recognize the need for more capacity and scale the cluster up accordingly.

## Configuring Overprovisioning

To configure node overprovisioning, follow these steps:

1. **Create a Placeholder Deployment:** Create a Deployment of pods that run a minimal process, like a pause container. These pods should have very low priority (using Priority Classes in Kubernetes) to ensure they are preempted easily.

2. **Adjust Resource Requests and Limits:** Configure the placeholder pods' resource requests and limits to define the amount of overprovisioned resources you want to maintain. For example, requesting a small amount of CPU and memory will reserve those resources without consuming them fully.

3. **Set the Desired Replica Count:** Determine the number of placeholder pods you need to create to achieve your desired level of overprovisioning. You can start with a small number and gradually increase it to find the right balance between resource reservation and cost.
