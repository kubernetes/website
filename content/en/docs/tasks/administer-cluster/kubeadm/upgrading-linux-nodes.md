---
title: Upgrading Linux nodes
content_type: task
weight: 40
---

<!-- overview -->

This page explains how to upgrade a Linux Worker Nodes created with kubeadm.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs-node-upgrade.md" >}} {{< version-check >}}
* Familiarize yourself with [the process for upgrading the rest of your kubeadm
cluster](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade). You will want to
upgrade the control plane nodes before upgrading your Linux Worker nodes.

<!-- steps -->

## Changing the package repository

If you're using the community-owned package repositories (`pkgs.k8s.io`), you need to 
enable the package repository for the desired Kubernetes minor release. This is explained in
[Changing the Kubernetes package repository](/docs/tasks/administer-cluster/kubeadm/change-package-repository/)
document.

{{% legacy-repos-deprecation %}}

## Upgrading worker nodes

### Upgrade kubeadm

Upgrade kubeadm:

{{< tabs name="k8s_install_kubeadm_worker_nodes" >}}
{{% tab name="Ubuntu, Debian or HypriotOS" %}}
```shell
# replace x in {{< skew currentVersion >}}.x-* with the latest patch version
sudo apt-mark unhold kubeadm && \
sudo apt-get update && sudo apt-get install -y kubeadm='{{< skew currentVersion >}}.x-*' && \
sudo apt-mark hold kubeadm
```
{{% /tab %}}
{{% tab name="CentOS, RHEL or Fedora" %}}
For systems with DNF:
```shell
# replace x in {{< skew currentVersion >}}.x-* with the latest patch version
sudo yum install -y kubeadm-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
```
For systems with DNF5:
```shell
# replace x in {{< skew currentVersion >}}.x-* with the latest patch version
sudo yum install -y kubeadm-'{{< skew currentVersion >}}.x-*' --setopt=disable_excludes=kubernetes
```
{{% /tab %}}
{{< /tabs >}}

### Call "kubeadm upgrade"

For worker nodes this upgrades the local kubelet configuration:

```shell
sudo kubeadm upgrade node
```

### Drain the node

Prepare the node for maintenance by marking it unschedulable and evicting the workloads:

```shell
# execute this command on a control plane node
# replace <node-to-drain> with the name of your node you are draining
kubectl drain <node-to-drain> --ignore-daemonsets
```

### Upgrade kubelet and kubectl

{{< note >}}
FailCgroupV1 is a kubelet configuration option that is set to 'true' by default since v1.35.
If you are using cgroups v1, kubelet will fail to start if the FailCgroupV1 is not set..
The cgroups v1 support is deprecated and will be removed in a future release.
If you are using cgroups v1, you should migrate to cgroups v2.
To explicitly enable cgroups v1 support for kubelet v1.35 or newer,
you must set the kubelet configuration option 'FailCgroupV1' to 'false'. You must also explicitly skip this validation.
For more information, see https://git.k8s.io/enhancements/keps/sig-node/5573-remove-cgroup-v1.
{{</ note >}}

1. Upgrade the kubelet and kubectl:

   {{< tabs name="k8s_kubelet_and_kubectl" >}}
   {{% tab name="Ubuntu, Debian or HypriotOS" %}}
   ```shell
   # replace x in {{< skew currentVersion >}}.x-* with the latest patch version
   sudo apt-mark unhold kubelet kubectl && \
   sudo apt-get update && sudo apt-get install -y kubelet='{{< skew currentVersion >}}.x-*' kubectl='{{< skew currentVersion >}}.x-*' && \
   sudo apt-mark hold kubelet kubectl
   ```
   {{% /tab %}}
   {{% tab name="CentOS, RHEL or Fedora" %}}
   For systems with DNF:
   ```shell
   # replace x in {{< skew currentVersion >}}.x-* with the latest patch version
   sudo yum install -y kubelet-'{{< skew currentVersion >}}.x-*' kubectl-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
   ```
   For systems with DNF5:
   ```shell
   # replace x in {{< skew currentVersion >}}.x-* with the latest patch version
   sudo yum install -y kubelet-'{{< skew currentVersion >}}.x-*' kubectl-'{{< skew currentVersion >}}.x-*' --setopt=disable_excludes=kubernetes
   ```
   {{% /tab %}}
   {{< /tabs >}}

1. Restart the kubelet:

   ```shell
   sudo systemctl daemon-reload
   sudo systemctl restart kubelet
   ```

### Uncordon the node

Bring the node back online by marking it schedulable:

```shell
# execute this command on a control plane node
# replace <node-to-uncordon> with the name of your node
kubectl uncordon <node-to-uncordon>
```

## {{% heading "whatsnext" %}}

* See how to [Upgrade Windows nodes](/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/).