---
title: Configure a Node to Overprovision a Cluster's capacity
content_type: task
weight: 10
---


<!-- overview -->

This page guides you through configuring {{< glossary_tooltip text="Node" term_id="node" >}} overprovisioning in your Kubernetes cluster. Node overprovisioning is a strategy that proactively reserves a portion of your cluster's compute resources. This reservation helps reduce the time required to schedule new pods during scaling events, enhancing your cluster's responsiveness to sudden spikes in traffic or workload demands. 

By maintaining some unused capacity, you ensure that resources are immediately available when new pods are created, preventing them from entering a pending state while the cluster scales up.

## {{% heading "prerequisites" %}}

- You need to have a running Kubernetes cluster.
- Have kubectl configured to interact with your cluster.
- Have a basic understanding of Kubernetes Deployments and Priority Classes.

<!-- steps -->

## Create a Placeholder Deployment

Begin by creating a Deployment that runs placeholder pods. These pods should use a minimal process, such as a pause container, and have a very low priority to ensure they can be easily preempted when higher-priority pods require resources.

To define a Low-Priority Priority Class

Create a Priority Class with a low value to assign to the placeholder pods.

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: low-priority
value: 1000
globalDefault: false
description: "Low priority for placeholder pods to enable overprovisioning."
```