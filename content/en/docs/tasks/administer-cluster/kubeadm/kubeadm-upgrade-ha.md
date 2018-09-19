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

This guide is for upgrading `kubeadm` HA clusters from version 1.11 to 1.12. The term "`kubeadm` HA clusters" refers to clusters of more than one control plane node created with `kubeadm`. To set up an HA cluster for Kubernetes version 1.11 `kubeadm` requires additional manual steps. See [Creating HA clusters with kubeadm](/docs/setup/independent/high-availability/) for instructions on how to do this. The upgrade procedure described here targets clusters created following those very instructions.

{{% /capture %}}

{{% capture prerequisites %}}

Before proceeding:

- You need to have a functional `kubeadm` HA cluster running version 1.11 or higher in order to use the process described here.
- Make sure you read the [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.12.md) carefully.
- Note that `kubeadm upgrade` will not touch any of your workloads, only Kubernetes-internal components. As a best-practice you should back up anything important to you. For example, any application-level state, such as a database and application might depend on (like MySQL or MongoDB) should be backed up beforehand.
- Read [Upgrading/downgrading kubeadm clusters between v1.11 to v1.12](/docs/tasks/administer-cluster/kubeadm-upgrade-1-12/) to learn about the relevant prerequisites.

{{% /capture %}}

{{% capture steps %}}

## Preparation for both methods

{{< note >}}
**Note**: All commands in this guide on any control plane or etcd node should be
run as root.
{{< /note >}}

Some preparation is needed prior to starting the upgrade. First upgrade `kubeadm` to the version that matches the version of Kubernetes that you are upgrading to:

```shell
apt-mark unhold kubeadm && \
apt-get update && apt-get install -y kubeadm && \
apt-mark hold kubeadm
```

Run this command for checking prerequisites and determining the versions you will receive:

```shell
kubeadm upgrade plan
```

If the prerequisites are met you'll get a summary of the software versions kubeadm will upgrade to, like this:

    Upgrade to the latest stable version:

    COMPONENT            CURRENT   AVAILABLE
    API Server           v1.11.3   v1.12.0
    Controller Manager   v1.11.3   v1.12.0
    Scheduler            v1.11.3   v1.12.0
    Kube Proxy           v1.11.3   v1.12.0
    CoreDNS              1.1.3     1.2.2
    Etcd                 3.2.18    3.2.24

## Stacked control plane nodes

### Upgrading the first control plane node

The following procedure must be applied on a single control plane node.

Before initiating the upgrade with `kubeadm` `configmap/kubeadm-config` needs to be modified for the current control plane node.

```shell
kubectl get configmap -n kube-system kubeadm-config -o yaml >/tmp/kubeadm-config-cm.yaml
```

Open the file in an editor and replace the following values:

- api.advertiseAddress
  - This should be set to the local node's IP address
- etcd.local.extraArgs.advertise-client-urls
  - This should be updated for the local node's IP address
- etcd.local.extraArgs.initial-advertise-peer-urls
  - This should be updated for the local node's IP address
- etcd.local.extraArgs.listen-client-urls
  - This should be updated for the local node's IP address
- etcd.local.extraArgs.listen-peer-urls
  - This should be updated for the local node's IP address
- etcd.local.extraArgs.initial-cluster
  - This should be updated to include the hostname and IP address pairs for each control plane node in the cluster, for example:

        "ip-172-31-92-42=https://172.31.92.42:2380,ip-172-31-89-186=https://172.31.89.186:2380,ip-172-31-90-42=https://172.31.90.42:2380"

An additional argument (`initial-cluster-state: existing`) also needs to be added to etcd.local.extraArgs.

```shell
kubectl apply -f /tmp/kubeadm-config-cm.yaml --force
```

Now the upgrade process can start. Use the target version determined in the preparation step and run the following command (press “y” when prompted):

```shell
kubeadm upgrade apply v<YOUR-CHOSEN-VERSION-HERE>
```

If the operation was successful you’ll get a message like this:

    [upgrade/successful] SUCCESS! Your cluster was upgraded to "v1.12.0". Enjoy!

### Upgrading subsequent control plane nodes

After upgrading the first control plane node, the `kubeadm-config` config map will be updated from `v1alpha2` version to `v1alpha3`, which requires different modifications than were needed for the first control plane node.

```shell
kubectl get configmap -n kube-system kubeadm-config -o yaml >/tmp/kubeadm-config-cm.yaml
```

Open the file in an editor and replace the following values under ClusterConfiguration:

- etcd.local.extraArgs.advertise-client-urls
  - This should be updated for the local node's IP address
- etcd.local.extraArgs.initial-advertise-peer-urls
  - This should be updated for the local node's IP address
- etcd.local.extraArgs.listen-client-urls
  - This should be updated for the local node's IP address
- etcd.local.extraArgs.listen-peer-urls
  - This should be updated for the local node's IP address

Modify the ClusterStatus to add an additional mapping for the current host under apiEndpoints.

Add an annotation for the cri-socket to the current node, for example to use docker:

```shell
kubectl annotate node <hostname> kubeadm.alpha.kubernetes.io/cri-socket=/var/run/dockershim.sock
```

Now the upgrade process can start. Use the target version determined in the preparation step and run the following command (press “y” when prompted):

```shell
kubeadm upgrade apply v<YOUR-CHOSEN-VERSION-HERE>
```

If the operation was successful you’ll get a message like this:

    [upgrade/successful] SUCCESS! Your cluster was upgraded to "v1.12.0". Enjoy!

## External etcd

TODO

## Post control plane upgrade steps

### Manually upgrade your CNI provider

Your Container Network Interface (CNI) provider may have its own upgrade instructions to follow. Check the [addons](/docs/concepts/cluster-administration/addons/) page to find your CNI provider and see if there are additional upgrade steps necessary.

### Update kubelet and kubectl packages

At this point all the static pod manifests in your cluster, for example API Server, Controller Manager, Scheduler, Kube Proxy have been upgraded, however the base software, for example `kubelet`, `kubectl` installed on your nodes’ OS are still of the old version. For upgrading the base software packages we will upgrade them and restart services on all nodes one by one:

```shell
# use your distro's package manager, e.g. 'apt-get' on Debian-based systems
# for the versions stick to kubeadm's output (see above)
apt-mark unhold kubelet kubectl && \
apt-get update && \
apt-get install kubelet=<NEW-K8S-VERSION> kubectl=<NEW-K8S-VERSION> && \
apt-mark hold kubelet kubectl && \
systemctl restart kubelet
```

In this example a _deb_-based system is assumed and `apt-get` is used for installing the upgraded software. On _rpm_-based systems it will be `yum install <PACKAGE>=<NEW-K8S-VERSION>` for all packages.

Now the new version of the `kubelet` should be running on the host. Verify this using the following command on the respective host:

```shell
systemctl status kubelet
```

Verify that the upgraded node is available again by executing the following from wherever you run `kubectl` commands:

```shell
kubectl get nodes
```

If the `STATUS` column of the above command shows `Ready` for the upgraded host, you can continue (you may have to repeat this for a couple of time before the node gets `Ready`).

## If something goes wrong

If the upgrade fails the situation afterwards depends on the phase in which things went wrong:

1. If `/tmp/kubeadm upgrade apply` failed to upgrade the cluster it will try to perform a rollback. Hence if that happened on the first master, chances are pretty good that the cluster is still intact.

   You can run `/tmp/kubeadm upgrade apply` again as it is idempotent and should eventually make sure the actual state is the desired state you are declaring. You can use `/tmp/kubeadm upgrade apply` to change a running cluster with `x.x.x --> x.x.x` with `--force`, which can be used to recover from a bad state.

2. If `/tmp/kubeadm upgrade apply` on one of the secondary masters failed you still have a working, upgraded cluster, but with the secondary masters in a somewhat undefined condition. You will have to find out what went wrong and join the secondaries manually.

{{% /capture %}}
