---
title: "Static Pods"
content_type: concept
weight: 150
---

_Static Pods_ are managed directly by the kubelet daemon on a specific node,
without the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
observing them.
Unlike Pods that are managed by the control plane (for example, a
{{< glossary_tooltip text="Deployment" term_id="deployment" >}}),
the kubelet watches each static Pod and restarts it if it fails.

Static Pods are always bound to one {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} on a specific node.

The main use for static Pods is to run a self-hosted control plane: in other words,
using the kubelet to supervise the individual
[control plane components](/docs/concepts/overview/components/#control-plane-components).
For example, [kubeadm](/docs/reference/setup-tools/kubeadm/) uses static Pods to run
`kube-apiserver`, `kube-controller-manager`, `kube-scheduler`, and `etcd` on control plane nodes.

{{< note >}}
If your cluster runs control plane components as Pods, they are likely
static Pods. You can recognize their mirror Pods in the `kube-system` namespace
by the `kubernetes.io/config.mirror` annotation.
{{< /note >}}

## Mirror Pods {#mirror-pods}

The kubelet automatically tries to create a
{{< glossary_tooltip text="mirror Pod" term_id="mirror-pod" >}}
on the Kubernetes API server for each static Pod.
This means that the Pods running on a node are visible on the API server,
but cannot be controlled from there.
The Pod names will be suffixed with the node hostname with a leading hyphen.

The kubelet propagates {{< glossary_tooltip text="labels" term_id="label" >}}
from the static Pod to the mirror Pod. You can use those labels as normal via
{{< glossary_tooltip text="selectors" term_id="selector" >}}.

If you try to use `kubectl` to delete the mirror Pod from the API server,
the kubelet _does not_ remove the static Pod. The kubelet will recreate
the mirror Pod.

## Limitations {#limitations}

The spec of a static Pod cannot refer to other API objects,
such as {{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}},
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}, or
{{< glossary_tooltip text="Secret" term_id="secret" >}}.

Static Pods do not support [ephemeral containers](/docs/concepts/workloads/pods/ephemeral-containers/).

## Static Pods vs DaemonSets {#static-pods-vs-daemonsets}

<!-- Source: tasks/configure-pod-container/static-pod/ -->
If you are running clustered Kubernetes and are using static Pods to run a Pod
on every node, you should probably be using a
{{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}} instead.

Static Pods are not managed by the control plane, so they cannot be rolled out,
rolled back, or scaled using standard Kubernetes mechanisms. DaemonSets provide
these capabilities and are the recommended approach for running node-level workloads.

Static Pods are started by the kubelet before the API server is available, which
makes them suitable for bootstrapping control plane components. DaemonSets require
a running control plane.

## {{% heading "whatsnext" %}}

- Learn how to [create static Pods](/docs/tasks/configure-pod-container/static-pod/).
- Learn about [Kubernetes components](/docs/concepts/overview/components/) and how the control plane uses static Pods.
- Learn about [DaemonSets](/docs/concepts/workloads/controllers/daemonset/) as an alternative to static Pods.
