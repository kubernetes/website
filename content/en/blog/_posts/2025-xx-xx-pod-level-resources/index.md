---
layout: blog
title: "Pod Level Resources Graduated to Beta"
date: 2025-xx-xx
draft: true
slug: kubernetes-v1-34-pod-level-resources
author: Dixita Narang (Google)
---

On behalf of the Kubernetes community, I am thrilled to announce that the **Pod Level Resources** feature **has graduated to Beta** in the Kubernetes v1.34 release! This significant milestone introduces a new layer of flexibility for defining and managing resource allocation for your Pods. This flexibility stems from the ability to **specify CPU and memory resources directly at the Pod level**, for the Pod as a whole, in addition to or instead of container-level specifications.


#### **What are Pod Level Resources?**

Traditionally, resource specifications for Pods were primarily defined at the
individual container level. While effective, this approach sometimes required
duplicating or meticulously calculating resource needs across multiple containers
within a single Pod. Pod Level Resources introduces the ability to specify CPU,
memory and hugepages resources directly at the **Pod-level**. This means you can now define
resource requests and limits for an entire Pod, providing a consolidated approach to
resource declaration without requiring granular, per-container micromanagement where
it's not needed.


#### **Why Does Pod Level Resources Matter?**

This feature enhances resource management in Kubernetes by offering **flexible resource management** at both the Pod and container levels.

* It provides a **consolidated approach** to resource declaration, reducing the need for meticulous, per-container micromanagement, especially for Pods with multiple containers.
* When both pod-level and container-level resources are specified, **pod-level requests and limits take precedence**, offering a powerful way to enforce overall resource ceilings for your Pods.
* Pod-level resources are **prioritized** in influencing the Quality of Service (QoS) class of the Pod.
* The Out-Of-Memory (OOM) score adjustment calculation **considers both pod-level and container-level resources**.
* Pod-level resources are **designed to be compatible with existing Kubernetes functionalities**, ensuring a smooth integration into your workflows.


#### **How to Use Pod Level Resources**

To utilize Pod Level Resources, the **<code>PodLevelResources</code> feature gate must be explicitly enabled** for your control plane and for all nodes in your cluster. Your Kubernetes server must be at or later than version 1.32 to use this feature.

**Defining Pod-Level Resources:** You can specify CPU, memory and hugepages resources directly in the Pod spec manifest at the `resources` field for the entire Pod.

Here’s an example demonstrating a Pod with both CPU and memory requests and limits
defined at the Pod level:

```
apiVersion: v1
kind: Pod
metadata:
  name: pod-resources-demo
  namespace: pod-resources-example
spec:
  resources: # Pod-level resources
    limits:
      cpu: "1"
      memory: "200Mi"
    requests:
      cpu: "1"
      memory: "100Mi"
  containers:
  - name: pod-resources-demo-ctr-1
    image: nginx
    resources:
      limits:
        cpu: "0.5"
        memory: "100Mi"
      requests:
        cpu: "0.5"
        memory: "50Mi"
  - name: pod-resources-demo-ctr-2
    image: fedora
    command: ["sleep", "inf"]
```

In this example, the `pod-resources-demo` Pod as a whole requests 1 CPU and 100 MiB of memory, and is limited to 1 CPU and 200 MiB of memory. The containers within will operate under these overall Pod-level constraints, as explained in the next section.

**Interaction with Container-Level Resources:** When both pod-level and container-level resources are specified, **pod-level requests and limits take precedence**. This means the node allocates resources based on the pod-level specifications.

Consider a Pod with two containers where pod-level CPU and memory requests and
limits are defined, and only one container has its own explicit resource
definitions:

```
apiVersion: v1
kind: Pod
metadata:
  name: pod-resources-demo
  namespace: pod-resources-example
spec:
  resources:
    limits:
      cpu: "1"
      memory: "200Mi"
    requests:
      cpu: "1"
      memory: "100Mi"
  containers:
  - name: pod-resources-demo-ctr-1
    image: nginx
    resources:
      limits:
        cpu: "0.5"
        memory: "100Mi"
      requests:
        cpu: "0.5"
        memory: "50Mi"
  - name: pod-resources-demo-ctr-2
    image: fedora
    command: [ "sleep", "inf" ]
```

In this scenario, the **request guarantees for *both* containers in the Pod will align with the pod-level requests** (1 CPU and 100 MiB in this example). Furthermore, both containers together **will not be able to use more resources than specified in the pod-level limits**, ensuring they cannot exceed a combined total of 200 MiB of memory and 1 core of CPU.

**Crucial Note on In-Place Resize:** It is important to understand that **in-place resize of pod-level resources is currently NOT supported**. Attempting to modify the pod-level resource limits or requests on a running Pod will result in an error. This feature focuses on the initial declaration and overall resource envelope at the Pod level. This is distinct from "In-Place Pod Resize", which allows dynamic adjustment of container resources within a *running* Pod without a restart and graduated to Beta in v1.33.


#### **Getting Started and Providing Feedback**

Ready to explore Pod Level Resources? You'll need a Kubernetes cluster running version 1.34 or later. Remember to **enable the <code>PodLevelResources</code> feature gate** for your control plane and all nodes.

As this feature moves through Beta, your feedback is invaluable. Please report any issues or share your experiences via the standard Kubernetes communication channels:



* Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
* [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
* [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnode)