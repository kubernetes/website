---
layout: blog
title: "In-Place Pod Resize Graduating to Beta"
slug: in-place-pod-resize-beta
draft: true
date: XXXX-XX-XX
author: "Tim Allclair (Google)"
---

On behalf of the Kubernetes project, I am excited to announce that the **in-place Pod resize** feature (also known as In-Place Pod Vertical Scaling), first introduced as alpha in Kubernetes v1.27, is graduating to **Beta** and will be enabled by default in the Kubernetes v1.33 release! This marks a significant milestone in making resource management for Kubernetes workloads more flexible and less disruptive.

## What is in-place Pod resize?

Traditionally, changing the CPU or memory resources allocated to a container required restarting the Pod. While acceptable for many stateless applications, this could be disruptive for stateful services, batch jobs, or any workloads sensitive to restarts.

In-place Pod resizing allows you to change the CPU and memory requests and limits assigned to containers within a *running* Pod, often without requiring a container restart.

Here's the core idea:
* The `spec.containers[*].resources` field in a Pod specification now represents the *desired* resources and is mutable for CPU and memory.
* The `status.containerStatuses[*].resources` field reflects the *actual* resources currently configured on a running container.
* You can trigger a resize by updating the desired resources in the Pod spec via the new `resize` subresource.

You can try it out on a v1.33 Kubernetes cluster by using kubectl to edit a Pod (requires `kubectl` v1.32+):

```shell
kubectl edit pod <pod-name> --subresource resize
```

For detailed usage instructions and examples, please refer to the official Kubernetes documentation:
[Resize CPU and Memory Resources assigned to Containers](/docs/tasks/configure-pod-container/resize-container-resources/).

## Why does in-place Pod resize matter?

Kubernetes still excels at scaling workloads horizontally (adding or removing replicas), but in-place Pod resizing unlocks several key benefits for vertical scaling:

* **Reduced Disruption:** Stateful applications, long-running batch jobs, and sensitive workloads can have their resources adjusted without suffering the downtime or state loss associated with a Pod restart.
* **Improved Resource Utilization:** Scale down over-provisioned Pods without disruption, freeing up resources in the cluster. Conversely, provide more resources to Pods under heavy load without needing a restart.
* **Faster Scaling:** Address transient resource needs more quickly. For example Java applications often need more CPU during startup than during steady-state operation. Start with higher CPU and resize down later.

## What's changed between Alpha and Beta?

Since the alpha release in v1.27, significant work has gone into maturing the feature, improving its stability, and refining the user experience based on feedback and further development. Here are the key changes:

### Notable user-facing changes

* **`resize` Subresource:** Modifying Pod resources must now be done via the Pod's `resize` subresource (`kubectl patch pod <name> --subresource resize ...`). `kubectl` versions v1.32+ support this argument.
* **Resize Status via Conditions:** The old `status.resize` field is deprecated. The status of a resize operation is now exposed via two Pod conditions:
    * `PodResizePending`: Indicates the Kubelet cannot grant the resize immediately (e.g., `reason: Deferred` if temporarily unable, `reason: Infeasible` if impossible on the node).
    * `PodResizeInProgress`: Indicates the resize is accepted and being applied. Errors encountered during this phase are now reported in this condition's message with `reason: Error`.
* **Sidecar Support:** Resizing {{< glossary_tooltip text="sidecar containers" term_id="sidecar-container" >}} in-place is now supported.

### Stability and reliability enhancements

* **Refined Allocated Resources Management:** The allocation management logic with the Kubelet was significantly reworked, making it more consistent and robust. The changes eliminated whole classes of bugs, and greatly improved the reliability of in-place Pod resize.
* **Improved Checkpointing & State Tracking:** A more robust system for tracking "allocated" and "actuated" resources was implemented, using new checkpoint files (`allocated_pods_state`, `actuated_pods_state`) to reliably manage resize state across Kubelet restarts and handle edge cases where runtime-reported resources differ from requested ones. Several bugs related to checkpointing and state restoration were fixed. Checkpointing efficiency was also improved.
* **Faster Resize Detection:** Enhancements to the Kubelet's Pod Lifecycle Event Generator (PLEG) allow the Kubelet to respond to and complete resizes much more quickly.
* **Enhanced CRI Integration:** A new `UpdatePodSandboxResources` CRI call was added to better inform runtimes and plugins (like NRI) about Pod-level resource changes.
* **Numerous Bug Fixes:** Addressed issues related to systemd cgroup drivers, handling of containers without limits, CPU minimum share calculations, container restart backoffs, error propagation, test stability, and more.

## What's next?

Graduating to Beta means the feature is ready for broader adoption, but development doesn't stop here! Here's what the community is focusing on next:

* **Stability and Productionization:** Continued focus on hardening the feature, improving performance, and ensuring it is robust for production environments.
* **Addressing Limitations:** Working towards relaxing some of the current limitations noted in the documentation, such as allowing memory limit decreases.
* **[VerticalPodAutoscaler](/docs/concepts/workloads/autoscaling/#scaling-workloads-vertically) (VPA) Integration:** Work to enable VPA to leverage in-place Pod resize is already underway. A new `InPlaceOrRecreate` update mode will allow it to attempt non-disruptive resizes first, or fall back to recreation if needed. This will allow users to benefit from VPA's recommendations with significantly less disruption.
* **User Feedback:** Gathering feedback from users adopting the beta feature is crucial for prioritizing further enhancements and addressing any uncovered issues or bugs.

## Getting started and providing feedback

With the `InPlacePodVerticalScaling` feature gate enabled by default in v1.33, you can start experimenting with in-place Pod resizing right away!

Refer to the [documentation](/docs/tasks/configure-pod-container/resize-container-resources/) for detailed guides and examples.

As this feature moves through Beta, your feedback is invaluable. Please report any issues or share your experiences via the standard Kubernetes communication channels (GitHub issues, mailing lists, Slack). You can also review the [KEP-1287: In-place Update of Pod Resources](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/1287-in-place-update-pod-resources) for the full in-depth design details.

We look forward to seeing how the community leverages in-place Pod resize to build more efficient and resilient applications on Kubernetes!
