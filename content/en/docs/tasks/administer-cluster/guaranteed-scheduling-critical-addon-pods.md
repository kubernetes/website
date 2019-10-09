---
reviewers:
- davidopp
- filipg
- piosz
title: Guaranteed Scheduling For Critical Add-On Pods
content_template: templates/concept
---

{{% capture overview %}}

In addition to Kubernetes core components like api-server, scheduler, controller-manager running on a master machine
there are a number of add-ons which, for various reasons, must run on a regular cluster node (rather than the Kubernetes master).
Some of these add-ons are critical to a fully functional cluster, such as metrics-server, DNS, and UI.
A cluster may stop working properly if a critical add-on is evicted (either manually or as a side effect of another operation like upgrade)
and becomes pending (for example when the cluster is highly utilized and either there are other pending pods that schedule into the space
vacated by the evicted critical add-on pod or the amount of resources available on the node changed for some other reason).

Note that marking a pod as critical is not meant to prevent evictions entirely; it only prevents the pod from becoming permanently unavailable.
For static pods, this means it can't be evicted, but for non-static pods, it just means they will always be rescheduled.

{{% /capture %}}


{{% capture body %}}


### Marking pod as critical

Prior to v1.11, critical pod has to run in the `kube-system` namespace, this restriction was removed after v1.11 and pod in any namespace can be configed as a critical pod by the following either way:

* Ensure the PodPriority [feature gates](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/) is enabled. Have the priorityClassName set as "system-cluster-critical" or "system-node-critical", the latter being the highest for entire cluster, the two priority class names available since v1.10+

* Alternatively, ensure both PodPriority and ExperimentalCriticalPodAnnotation feature gates are enabled, you could add an annotation `scheduler.alpha.kubernetes.io/critical-pod` as key and empty string as value to your pod, but this annotation is deprecated as of version 1.13 and will be removed in a future release.

{{% /capture %}}
