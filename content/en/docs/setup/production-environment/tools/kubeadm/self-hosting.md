---
reviewers:
- sig-cluster-lifecycle
title: Configuring your kubernetes cluster to self-host the control plane
content_template: templates/concept
weight: 100
---

{{% capture overview %}}

### Self-hosting the Kubernetes control plane {#self-hosting}

As of 1.8, you can experimentally create a _self-hosted_ Kubernetes control
plane. This means that key components such as the API server, controller
manager, and scheduler run as [DaemonSet pods](/docs/concepts/workloads/controllers/daemonset/)
configured via the Kubernetes API instead of [static pods](/docs/tasks/administer-cluster/static-pod/)
configured in the kubelet via static files.

To create a self-hosted cluster see the
[kubeadm alpha selfhosting pivot](/docs/reference/setup-tools/kubeadm/kubeadm-alpha/#cmd-selfhosting) command.

{{% /capture %}}

{{% capture body %}}

#### Caveats

{{< caution >}}
This feature pivots your cluster into an unsupported state, rendering kubeadm unable
to manage you cluster any longer. This includes `kubeadm upgrade`.
{{< /caution >}}

1. Self-hosting in 1.8 and later has some important limitations. In particular, a
  self-hosted cluster _cannot recover from a reboot of the control-plane node_
  without manual intervention.

1. By default, self-hosted control plane Pods rely on credentials loaded from
  [`hostPath`](/docs/concepts/storage/volumes/#hostpath)
  volumes. Except for initial creation, these credentials are not managed by
  kubeadm.

1. The self-hosted portion of the control plane does not include etcd,
  which still runs as a static Pod.

#### Process

The self-hosting bootstrap process is documented in the [kubeadm design
document](https://github.com/kubernetes/kubeadm/blob/master/docs/design/design_v1.9.md#optional-self-hosting).

In summary, `kubeadm alpha selfhosting` works as follows:

  1. Waits for this bootstrap static control plane to be running and
    healthy. This is identical to the `kubeadm init` process without self-hosting.

  1. Uses the static control plane Pod manifests to construct a set of
    DaemonSet manifests that will run the self-hosted control plane.
    It also modifies these manifests where necessary, for example adding new volumes
    for secrets.

  1. Creates DaemonSets in the `kube-system` namespace and waits for the
     resulting Pods to be running.

  1. Once self-hosted Pods are operational, their associated static Pods are deleted
     and kubeadm moves on to install the next component. This triggers kubelet to
     stop those static Pods.

  1. When the original static control plane stops, the new self-hosted control
    plane is able to bind to listening ports and become active.

{{% /capture %}}
