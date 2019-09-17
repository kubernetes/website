---
reviewers:
- jamiehannaford
- luxas
- timothysc
- jbeda
title: Upgrading kubeadm HA clusters from v1.11 to v1.12
content_template: templates/task
---

{{% capture overview %}}

This page explains how to upgrade a highly available (HA) Kubernetes cluster created with `kubeadm` from version 1.11.x to version 1.12.x. In addition to upgrading, you must also follow the instructions in [Creating HA clusters with kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/).

{{% /capture %}}

{{% capture prerequisites %}}

Before proceeding:

- You need to have a `kubeadm` HA cluster running version 1.11 or higher.
- Make sure you read the [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.12.md) carefully.
- Make sure to back up any important components, such as app-level state stored in a database. `kubeadm upgrade` does not touch your workloads, only components internal to Kubernetes, but backups are always a best practice.
- Check the prerequisites for [Upgrading/downgrading kubeadm clusters between v1.11 to v1.12](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-12/).

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

    Upgrade to the latest stable version:

    COMPONENT            CURRENT   AVAILABLE
    API Server           v1.11.3   v1.12.0
    Controller Manager   v1.11.3   v1.12.0
    Scheduler            v1.11.3   v1.12.0
    Kube Proxy           v1.11.3   v1.12.0
    CoreDNS              1.1.3     1.2.2
    Etcd                 3.2.18    3.2.24

## Stacked control plane nodes

### Upgrade the first control plane node

Modify `configmap/kubeadm-config` for this control plane node:

```shell
kubectl get configmap -n kube-system kubeadm-config -o yaml > kubeadm-config-cm.yaml
```

Open the file in an editor and replace the following values:

- `api.advertiseAddress`

    This should be set to the local node's IP address.

- `etcd.local.extraArgs.advertise-client-urls`

    This should be updated to the local node's IP address.

- `etcd.local.extraArgs.initial-advertise-peer-urls`

    This should be updated to the local node's IP address.

- `etcd.local.extraArgs.listen-client-urls`

    This should be updated to the local node's IP address.

- `etcd.local.extraArgs.listen-peer-urls`

    This should be updated to the local node's IP address.

- `etcd.local.extraArgs.initial-cluster`

    This should be updated to include the hostname and IP address pairs for each control plane node in the cluster. For example:

        "ip-172-31-92-42=https://172.31.92.42:2380,ip-172-31-89-186=https://172.31.89.186:2380,ip-172-31-90-42=https://172.31.90.42:2380"

You must also pass an additional argument (`initial-cluster-state: existing`) to etcd.local.extraArgs.

```shell
kubectl apply -f kubeadm-config-cm.yaml --force
```

Start the upgrade:

```shell
kubeadm upgrade apply v<YOUR-CHOSEN-VERSION-HERE>
```

You should see something like the following:

    [upgrade/successful] SUCCESS! Your cluster was upgraded to "v1.12.0". Enjoy!

The `kubeadm-config` ConfigMap is now updated from `v1alpha2` version to `v1alpha3`.

### Upgrading additional control plane nodes

Each additional control plane node requires modifications that are different from the first control plane node. Run:

```shell
kubectl get configmap -n kube-system kubeadm-config -o yaml > kubeadm-config-cm.yaml
```

Open the file in an editor and replace the following values for `ClusterConfiguration`:

- `etcd.local.extraArgs.advertise-client-urls`

    This should be updated to the local node's IP address.

- `etcd.local.extraArgs.initial-advertise-peer-urls`

    This should be updated to the local node's IP address.

- `etcd.local.extraArgs.listen-client-urls`

    This should be updated to the local node's IP address.

- `etcd.local.extraArgs.listen-peer-urls`

    This should be updated to the local node's IP address.

You must also modify the `ClusterStatus` to add a mapping for the current host under apiEndpoints.

Add an annotation for the cri-socket to the current node, for example to use Docker:

```shell
kubectl annotate node <nodename> kubeadm.alpha.kubernetes.io/cri-socket=/var/run/dockershim.sock
```

Apply the modified kubeadm-config on the node:

```shell
kubectl apply -f kubeadm-config-cm.yaml --force
```

Start the upgrade:

```shell
kubeadm upgrade apply v<YOUR-CHOSEN-VERSION-HERE>
```

You should see something like the following:

    [upgrade/successful] SUCCESS! Your cluster was upgraded to "v1.12.0". Enjoy!

## External etcd

### Upgrade each control plane

Get a copy of the kubeadm config used to create this cluster. The config should be the same for every node. The config must exist on every control plane node before the upgrade begins.

```
# on each control plane node
kubectl get configmap -n kube-system kubeadm-config -o jsonpath={.data.MasterConfiguration} > kubeadm-config.yaml
```

Open the file in an editor and set `api.advertiseAddress` to the local node's IP address.

Now run the upgrade on each control plane node one at a time.

```
kubeadm upgrade apply v1.12.0 --config kubeadm-config.yaml
```

### Upgrade etcd

Kubernetes v1.11 to v1.12 only changed the patch version of etcd from v3.2.18 to v3.2.24. This is a rolling upgrade with no downtime, because you can run both versions in the same cluster.

On the first host, modify the etcd manifest:

```shell
sed -i 's/3.2.18/3.2.24/' /etc/kubernetes/manifests/etcd.yaml
```

Wait for the etcd process to reconnect. There will be error warnings in the other etcd node logs. This is expected.

Repeat this step on the other etcd hosts.

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
