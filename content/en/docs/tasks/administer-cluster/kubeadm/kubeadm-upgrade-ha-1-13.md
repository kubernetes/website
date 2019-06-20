---
reviewers:
- luxas
- timothysc
- jbeda
title: Upgrading kubeadm HA clusters from v1.12 to v1.13
content_template: templates/task
---

{{% capture overview %}}

This page explains how to upgrade a highly available (HA) Kubernetes cluster created with `kubeadm` from version 1.12.x to version 1.13.y. In addition to upgrading, you must also follow the instructions in [Creating HA clusters with kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/).

{{% /capture %}}

{{% capture prerequisites %}}

Before proceeding:

- You need to have a `kubeadm` HA cluster running version 1.12 or higher.
- Make sure you read the [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.13.md) carefully.
- Make sure to back up any important components, such as app-level state stored in a database. `kubeadm upgrade` does not touch your workloads, only components internal to Kubernetes, but backups are always a best practice.
- Check the prerequisites for [Upgrading/downgrading kubeadm clusters between v1.12 to v1.13](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-13/).

{{< note >}}
All commands on any control plane or etcd node should be run as root.
{{< /note >}}

{{% /capture %}}

{{% capture steps %}}

## Prepare for both methods

Upgrade `kubeadm` to the version that matches the version of Kubernetes that you are upgrading to:

```shell
apt-mark unhold kubeadm && \
apt-get update && apt-get upgrade -y kubeadm && \
apt-mark hold kubeadm
```

Check prerequisites and determine the upgrade versions:

```shell
kubeadm upgrade plan
```

You should see something like the following:

```
Upgrade to the latest version in the v1.13 series:

COMPONENT            CURRENT   AVAILABLE
API Server           v1.12.2   v1.13.0
Controller Manager   v1.12.2   v1.13.0
Scheduler            v1.12.2   v1.13.0
Kube Proxy           v1.12.2   v1.13.0
CoreDNS              1.2.2     1.2.6
```

## Stacked control plane nodes

### Upgrade the first control plane node

Modify `configmap/kubeadm-config` for this control plane node:

```shell
kubectl edit configmap -n kube-system kubeadm-config
```

Make the following modifications to the ClusterConfiguration key:

- `etcd`

    Remove the etcd section completely

Make the following modifications to the ClusterStatus key:

- `apiEndpoints`

    Add an entry for each of the additional control plane hosts

Start the upgrade:

```shell
kubeadm upgrade apply v<YOUR-CHOSEN-VERSION-HERE>
```

You should see something like the following:

    [upgrade/successful] SUCCESS! Your cluster was upgraded to "v1.13.0". Enjoy!

The `kubeadm-config` ConfigMap is now updated from `v1alpha3` version to `v1beta1`.

### Upgrading additional control plane nodes

Start the upgrade:

```shell
kubeadm upgrade node experimental-control-plane
```

## External etcd

### Upgrade the first control plane

Run the upgrade:

```
kubeadm upgrade apply v1.13.0
```

### Upgrade the other control plane nodes

For other control plane nodes in the cluster, run the following command:

```
kubeadm upgrade node experimental-control-plane
```

## Next steps

### Manually upgrade your CNI provider

Your Container Network Interface (CNI) provider might have its own upgrade instructions to follow. Check the [addons](/docs/concepts/cluster-administration/addons/) page to find your CNI provider and see whether you need to take additional upgrade steps.

### Update kubelet and kubectl packages

Upgrade the kubelet and kubectl by running the following on each node:

```shell
# use your distro's package manager, e.g. 'apt-get' on Debian-based systems
# for the versions stick to kubeadm's output (see above)
apt-mark unhold kubelet kubectl && \
apt-get update && \
apt-get install kubelet=<NEW-K8S-VERSION> kubectl=<NEW-K8S-VERSION> && \
apt-mark hold kubelet kubectl && \
systemctl restart kubelet
```

In this example a _deb_-based system is assumed and `apt-get` is used for installing the upgraded software. On rpm-based systems the command is `yum install <PACKAGE>=<NEW-K8S-VERSION>` for all packages.

Verify that the new version of the kubelet is running:

```shell
systemctl status kubelet
```

Verify that the upgraded node is available again by running the following command from wherever you run `kubectl`:

```shell
kubectl get nodes
```

If the `STATUS` column shows `Ready` for the upgraded host, you can continue. You might need to repeat the command until the node shows `Ready`.

## If something goes wrong

If the upgrade fails, see whether one of the following scenarios applies:

- If `kubeadm upgrade apply` failed to upgrade the cluster, it will try to perform a rollback. If this is the case on the first master, the cluster is probably still intact.

   You can run `kubeadm upgrade apply` again, because it is idempotent and should eventually make sure the actual state is the desired state you are declaring. You can run `kubeadm upgrade apply` to change a running cluster with `x.x.x --> x.x.x` with `--force` to recover from a bad state.

- If `kubeadm upgrade apply` on one of the secondary masters failed, the cluster is upgraded and working, but the secondary masters are in an undefined state. You need to investigate further and join the secondaries manually.

{{% /capture %}}
