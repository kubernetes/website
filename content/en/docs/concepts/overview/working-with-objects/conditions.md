---
title: Conditions
content_type: concept
weight: 30
---

<!-- overview -->
In Kubernetes, conditions as a concept are used to provide a detailed and structured status of an object.
This granular status information helps in understanding status of various Kubernetes objects and facilitates communication between different components of the system.

<!-- body -->
## Understanding conditions

A condition in Kubernetes includes several key fields:

- **Type**: The specific kind of condition(e.g., `Ready`, `PodScheduled`).
- **Status**: The state of the condition, which can be `True`, `False`, or `Unknown`.
- **Reason**: String explaining why the condition is in a current state
- **Message**: Message explaining details of the message
- **Last Transition Time**: This represents the timestamp where condition last changed status

## Example: Pod conditions

The Pod API uses conditions to indicate Pod state. Here is an example:

```yaml
status:
  conditions:
  - type: PodScheduled
    status: "True"
    lastTransitionTime: "2023-05-10T16:29:24Z"
  - type: Initialized
    status: "True"
    lastTransitionTime: "2023-05-10T16:29:24Z"
  - type: ContainersReady
    status: "True"
    lastTransitionTime: "2023-05-10T16:29:31Z"
  - type: Ready
    status: "True"
    lastTransitionTime: "2023-05-10T16:29:31Z"
```

In this example, each condition provides specific information about the pod's status, such as whether it has been scheduled, initialized, or is ready to handle traffic.

In example above, each condition provides information as to the status of the pod. Whether the pod has been scheduled, initialized and ready to accept different traffic. Also whether the container in the pod are ready to be started.

## Purpose and usage of conditions

Conditions being an integral part of Kubernetes play very important role by:

* **Status Information**: Conditions provide an in-depth understanding of the existing cluster state or resources. They help the user or a machine understand what’s going on.

* **Communication**: Conditions act as a form of communication inside the cluster. It helps various components like the kubelet, the scheduler talk to each other or custom controllers to send and receive messages.

* **Activity Engine**: They help custom controllers to perform actions. For given conditions, controllers can make HTTP requests, call to cloud API, etc. Once a pod is unschedulable, a controller might create more resources, Websites, etc.

* **Events**:

* They are used to record a single one-time event.

* **Examples**: Kubernetes uses events to report changes during the control plane’s request processing. It uses events for purely informational purposes, trying to help understand what’s going on in the cluster.

Examples where Conditions are used:

* `FrequentSyncError`: Indicates the resource Seeding controller is struggling to create.

* `ComponentsInstalled`: Indicates that a desired state of components has been installed.

* `Repairing`: Indicates that the controller has started repairing things.

* `Mounted`: Indicates that a controller from the Cloud integration is successfully mounted on the node.

* **Conditions**:

* They provide an engineering statement regarding the running process.

* **Defining Conditions**: When we design conditions, multiple things have to be cared upon.

* **Polarity**: any unhealthy state should be `True`.

* **Extensibility**

* **Meaning**: once a condition is defined, it should have the same meaning. This is because of backward compatibility. Because of this, only a single condition indicating an abnormal state must be defined.

It should be noticed that conditions are observations and not state machines. They are free-formers and don’t have states.

## Examples of conditions usage in kubernetes projects

- [Gateway API](https://gateway-api.sigs.k8s.io/): Uses conditions to represent the state of Gateway and HTTPRoute resources, such as `Accepted`, `Programmed`, and `RoutesAccepted`.
- [Cluster API](https://cluster-api.sigs.k8s.io/): Uses conditions to indicate the state of various resources, such as `Ready`, `Initialized`, and `ControlPlaneInitialized`.
- [Node Conditions](https://kubernetes.io/docs/reference/node/node-status/#condition): Conditions like `OutOfDisk`, `Ready`, `MemoryPressure`, `DiskPressure`, and `PIDPressure` are used to represent the state of nodes in a cluster.

## {{% heading "whatsnext" %}}

If you want to learn more about conditions and when to use them in Kubernetes, you can refer to:

- [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)
- [Pod Readiness Gates](/docs/concepts/workloads/pods/pod-lifecycle/#pod-readiness-gate)