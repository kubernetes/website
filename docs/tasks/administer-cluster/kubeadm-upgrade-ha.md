---
reviewers:
- jamiehannaford 
- luxas
- timothysc 
- jbeda
title: Upgrading kubeadm HA clusters from 1.9.x to 1.9.y
---

{% capture overview %}

This guide is for upgrading `kubeadm` HA clusters from version 1.9.x to 1.9.y where `y > x`. The term "`kubeadm` HA clusters" refers to clusters of more than one master node created with `kubeadm`. To set up an HA cluster for Kubernetes version 1.9.x `kubeadm` requires additional manual steps. See [Creating HA clusters with kubeadm](/docs/setup/independent/high-availability/) for instructions on how to do this. The upgrade procedure described here targets clusters created following those very instructions. See [Upgrading/downgrading kubeadm clusters between v1.8 to v1.9](/docs/tasks/administer-cluster/kubeadm-upgrade-1-9/) for more instructions on how to create an HA cluster with `kubeadm`.

{% endcapture %}

{% capture prerequisites %}

Before proceeding:

- You need to have a functional `kubeadm` HA cluster running version 1.9.0 or higher in order to use the process described here.
- Make sure you read the [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.9.md) carefully.
- Note that `kubeadm upgrade` will not touch any of your workloads, only Kubernetes-internal components. As a best-practice you should back up anything important to you. For example, any application-level state, such as a database and application might depend on (like MySQL or MongoDB) should be backed up beforehand.
- Read [Upgrading/downgrading kubeadm clusters between v1.8 to v1.9](/docs/tasks/administer-cluster/kubeadm-upgrade-1-9/) to learn about the relevant prerequisites.

{% endcapture %}

{% capture steps %}

## Preparation

Some preparation is needed prior to starting the upgrade. First download the version of `kubeadm` that matches the version of Kubernetes that you are upgrading to:

```shell
# Use the latest stable release or manually specify a
# released Kubernetes version
export VERSION=$(curl -sSL https://dl.k8s.io/release/stable.txt) 
export ARCH=amd64 # or: arm, arm64, ppc64le, s390x
curl -sSL https://dl.k8s.io/release/${VERSION}/bin/linux/${ARCH}/kubeadm > /tmp/kubeadm
chmod a+rx /tmp/kubeadm
```

Copy this file to `/tmp` on your primary master if necessary. Run this command for checking prerequisites and determining the versions you will receive:

```shell
/tmp/kubeadm upgrade plan
```

If the prerequisites are met you'll get a summary of the software versions kubeadm will upgrade to, like this:

    Upgrade to the latest stable version:

    COMPONENT            CURRENT   AVAILABLE
    API Server           v1.9.0    v1.9.2
    Controller Manager   v1.9.0    v1.9.2
    Scheduler            v1.9.0    v1.9.2
    Kube Proxy           v1.9.0    v1.9.2
    Kube DNS             1.14.5    1.14.7
    Etcd                 3.2.7     3.1.11

**Caution:** Currently the only supported configuration for kubeadm HA clusters requires the use of an externally managed etcd cluster. Upgrading etcd is not supported as a part of the upgrade. If necessary you will have to upgrade the etcd cluster according to [etcd's upgrade instructions](/docs/tasks/administer-cluster/configure-upgrade-etcd/), which is beyond the scope of these instructions.
{: .caution}

## Upgrading your control plane

The following procedure must be applied on a single master node and repeated for each subsequent master node sequentially.

Before initiating the upgrade with `kubeadm` `configmap/kubeadm-config` needs to be modified for the current master host. Replace any hard reference to a master host name with the current master hosts' name:

```shell
kubectl get configmap -n kube-system kubeadm-config -o yaml >/tmp/kubeadm-config-cm.yaml
sed -i 's/^\([ \t]*nodeName:\).*/\1 <CURRENT-MASTER-NAME>/' /tmp/kubeadm-config-cm.yaml
kubectl apply -f /tmp/kubeadm-config-cm.yaml --force
```

Now the upgrade process can start. Use the target version determined in the preparation step and run the following command (press “y” when prompted):

```shell
/tmp/kubeadm upgrade apply v<YOUR-CHOSEN-VERSION-HERE>
```

If the operation was successful you’ll get a message like this:

    [upgrade/successful] SUCCESS! Your cluster was upgraded to "v1.9.2". Enjoy!

To upgrade the cluster with CoreDNS as the default internal DNS, invoke `kubeadm upgrade apply` with the `--feature-gates=CoreDNS=true` flag.

Next, manually upgrade your CNI provider

Your Container Network Interface (CNI) provider may have its own upgrade instructions to follow. Check the [addons](/docs/concepts/cluster-administration/addons/) page to find your CNI provider and see if there are additional upgrade steps necessary.

**Note:** The `kubeadm upgrade apply` step has been known to fail when run initially on the secondary masters (timed out waiting for the restarted static pods to come up). It should succeed if retried after a minute or two.
{: .note}

## Upgrade base software packages

At this point all the static pod manifests in your cluster, for example API Server, Controller Manager, Scheduler, Kube Proxy have been upgraded, however the base software, for example `kubelet`, `kubectl`, `kubeadm` installed on your nodes’ OS are still of the old version. For upgrading the base software packages we will upgrade them and restart services on all nodes one by one:

```shell
# use your distro's package manager, e.g. 'yum' on RH-based systems
# for the versions stick to kubeadm's output (see above)
yum install -y kubelet-<NEW-K8S-VERSION> kubectl-<NEW-K8S-VERSION> kubeadm-<NEW-K8S-VERSION> kubernetes-cni-<NEW-CNI-VERSION>
systemctl restart kubelet
```

In this example an _rpm_-based system is assumed and `yum` is used for installing the upgraded software. On _deb_-based systems it will be `apt-get update` and then `apt-get install <PACKAGE>=<NEW-K8S-VERSION>` for all packages.

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

2. If `/tmp/kubeadm upgrade apply` on one of the secondary masters failed you still have a working, upgraded cluster, but with the secondary masters in a somewhat undefined condition. You will have to find out what went wrong and join the secondaries manually. As mentioned above, sometimes upgrading one of the secondary masters fails waiting for the restarted static pods first, but succeeds when the operation is simply repeated after a little pause of one or two minutes. 

{% endcapture %}

{% include templates/task.md %}
