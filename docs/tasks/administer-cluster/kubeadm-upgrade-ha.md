---
reviewers:
- jamiehannaford 
- luxas
- timothysc 
- jbeda
title: Upgrading kubeadm HA clusters from 1.8.x to 1.9.x
---

{% capture overview %}

This guide is for upgrading `kubeadm` HA clusters from version 1.8.x to 1.9.x, as well as 1.8.x to 1.8.y and 1.9.x to 1.9.y where `y > x`. The term "`kubeadm` HA clusters" refers to clusters of more than one master node created with `kubeadm`. For versions 1.8.x and 1.9.x setting up such clusters is not directly supported by `kubeadm` and hence involves some manual steps. See 
[Creating HA clusters with kubeadm](/docs/setup/independent/high-availability/) for instructions on how to do this. The upgrade procedure described here targets clusters created following those very instructions. You may also want to read [Upgrading/downgrading kubeadm clusters between v1.8 to v1.9](/docs/tasks/administer-cluster/kubeadm-upgrade-1-9/) for more information on upgrading clusters with `kubeadm`.

{% endcapture %}

{% capture prerequisites %}

Before proceeding:

- You need to have a functional `kubeadm` HA cluster running version 1.8.0 or higher in order to use the process described here. Swap also needs to be disabled.
- Make sure you read the [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.9.md) carefully.
- Note that `kubeadm upgrade` will not touch any of your workloads, only Kubernetes-internal components. As a best-practice you should back up what's important to you. For example, any app-level state, such as a database an app might depend on (like MySQL or MongoDB) must be backed up beforehand.

**Caution:** All the containers will get restarted after the upgrade, due to container spec hash value gets changed.
{: .caution}

Also, note that only one minor version upgrade is supported. For example, you can only upgrade from 1.8 to 1.9, not from 1.7 to 1.9.

{% endcapture %}

{% capture steps %}

## Preparation

Before actually starting the upgrade, start with some preparation. For the actual upgrade `kubeadm` of at least the target version is required:

```shell
# Use the latest stable release or manually specify a
# released Kubernetes version
$ export VERSION=$(curl -sSL https://dl.k8s.io/release/stable.txt) 
$ export ARCH=amd64 # or: arm, arm64, ppc64le, s390x
$ curl -sSL https://dl.k8s.io/release/${VERSION}/bin/linux/${ARCH}/kubeadm > /tmp/kubeadm
$ chmod a+rx /tmp/kubeadm
```

Copy this file to _/tmp_ on your primary master if necessary. Now run this command for checking prerequisites and determining the versions you'd get:

```shell
$ /tmp/kubeadm upgrade plan
```

If the prerequisites are met you'll get a summary of the software versions kubeadm would upgrade to, like this:

    Upgrade to the latest stable version:

    COMPONENT            CURRENT   AVAILABLE
    API Server           v1.8.3    v1.9.2
    Controller Manager   v1.8.3    v1.9.2
    Scheduler            v1.8.3    v1.9.2
    Kube Proxy           v1.8.3    v1.9.2
    Kube DNS             1.14.5    1.14.7
    Etcd                 3.2.7     3.1.11

Note that upgrading etcd is not supported here because in the supported configuration it is running externally, hence if necessary you'll have to upgrade it according to etcd's upgrade instruction which is beyond scope here.

## Upgrading your control plane

The following procedure is applied on all master nodes one by one, i.e. when it has finished on master _#1_ it is applied on master _#2_ etc.

Before the actual upgrade `configmap/kubeadm-config` needs to be adapted - replace a hard reference to some master host by the current master host’s FQDN:

```shell
$ kubectl get configmap -n kube-system kubeadm-config -o yaml >/tmp/kubeadm-config-cm.yaml
$ sed -i 's/^\([ \t]*nodeName:\).*/\1 <CURRENT-MASTER-FQDN>/' /tmp/kubeadm-config-cm.yaml
$ kubectl apply -f /tmp/kubeadm-config-cm.yaml --force
```

Now the actual upgrade process can start. Use the target version determined in the preparation step and run the following command (press “y” when prompted):

```shell
$ /tmp/kubeadm upgrade apply v<YOUR-CHOSEN-VERSION-HERE>
```

If the operation was successful you’ll get a message like this:

    [upgrade/successful] SUCCESS! Your cluster was upgraded to "v1.9.2". Enjoy!

    To upgrade the cluster with CoreDNS as the default internal DNS, invoke `kubeadm upgrade apply` with the `--feature-gates=CoreDNS=true` flag.

`kubeadm upgrade apply` does the following:

- Checks that your cluster is in an upgradeable state:
  - The API server is reachable,
  - All nodes are in the `Ready` state
  - The control plane is healthy
- Enforces the version skew policies.
- Makes sure the control plane images are available or available to pull to the machine.
- Upgrades the control plane components or rollbacks if any of them fails to come up.
- Applies the new `kube-dns` and `kube-proxy` manifests and enforces that all necessary RBAC rules are created.
- Creates new certificate and key files of apiserver and backs up old files if they're about to expire in 180 days.

Next, manually upgrade your Software Defined Network (SDN).

Your Container Network Interface (CNI) provider may have its own upgrade instructions to follow. Check the [addons](/docs/concepts/cluster-administration/addons/) page to find your CNI provider and see if there are additional upgrade steps necessary.

It has been observed that in some cases after having upgraded the primary master the upgrade on some of the secondary masters failed initially (timed out waiting for the restarted static pods to come up) but worked just fine when retried after a minute or two.

## Upgrade base software packages

At this point all the static pod manifests in your cluster, i.e. API Server, Controller Manager, Scheduler, Kube Proxy have been upgraded, however the base software, i.e. `kubelet`, `kubectl`, `kubeadm` installed on your nodes’ OS are still of the old version. For upgrading the base software packages on all nodes they will be taken out (`cordon` if master, `drain` if worker node) upgraded and then taken in (`uncordon`) again one by one. 

First, the master nodes the master nodes will be upgraded (run `kubectl cordon` / `kubectl uncordon` from whatever machine you have set up to issue `kubectl` commands):

```shell
$ kubectl cordon <MASTER-NODE-FQDN>
$ systemctl stop keepalived kubelet docker
# use your distro's package manager, e.g. 'yum' on RH-based systems
# for the versions stick to kubeadm's output (see above)
$ yum install -y kubelet-<NEW-K8S-VERSION> kubectl-<NEW-K8S-VERSION> kubeadm-<NEW-K8S-VERSION> kubernetes-cni-<NEW-CNI-VERSION>
$ systemctl start `echo keepalived kubelet docker | tac`
$ kubectl uncordon <MASTER-NODE-FQDN>
```

In this example an _rpm_-based system is assumed and `yum` is used for installing the upgraded software. On _deb_-based systems it will be `apt-get update` and then `apt-get install <PACKAGE>=<NEW-K8S-VERSION>` for all packages.

Because on the worker nodes there is no keepalived to stop and start and all processes need to be moved to other nodes cleanly before shutting anything down, `drain` is used instead of `cordon`. In this process all containers will get moved from one node to another at least once. If some of them keep local data you will need some strategy for this scenario. This really depends on the application(s) running in the cluster, and there is no simple, generic solution to this.

On the master (or wherever you run `kubectl` commands):

```shell
$ kubectl drain --delete-local-data --ignore-daemonsets <WORKER-NODE-FQDN>
```

On the respective worker node:

```shell
$ systemctl stop keepalived kubelet docker
# use your distro's package manager, e.g. 'yum' on RH-based systems
# for the versions stick to kubeadm's output (see above)
$ yum install -y kubelet-<NEW-K8S-VERSION> kubectl-<NEW-K8S-VERSION> kubeadm-<NEW-K8S-VERSION> kubernetes-cni-<NEW-CNI-VERSION>
$ systemctl start `echo keepalived kubelet docker | tac`
```

Like above, for _deb_-based systems use `apt-get install <PACKAGE>=version` to upgrade the packages to the respective desired versions.

Now the new version of the `kubelet` should be running on the host. Verify this using the following command on the respective host:

```shell
systemctl status kubelet
```

If everything was successful, again on the master (or wherever you run `kubectl` commands):

```shell
$ kubectl uncordon <WORKER-NODE-FQDN>
```

After all hosts in your cluster have been upgraded, verify that all nodes are available again by executing the following from wherever you run `kubectl` commands:

```shell
kubectl get nodes
```

If the `STATUS` column of the above command shows `Ready` for all of your hosts, you are done.

## If something goes wrong

If the upgrade fails the situation afterwards depends on the phase in which things went wrong:

1. If `/tmp/kubeadm upgrade apply` failed to upgrade the cluster it will try to perform a rollback. Hence if that happened on the first master, chances are pretty good that the cluster is still intact.

   You can run `/tmp/kubeadm upgrade apply` again as it is idempotent and should eventually make sure the actual state is the desired state you are declaring. You can use `/tmp/kubeadm upgrade apply` to change a running cluster with `x.x.x --> x.x.x` with `--force`, which can be used to recover from a bad state.

2. If `/tmp/kubeadm upgrade apply` on one of the secondary masters failed you still have a working, upgraded cluster, but with the secondary masters in a somewhat undefined condition. You will have to find out what went wrong and join the secondaries manually. As mentioned above, sometimes upgrading one of the secondary masters fails waiting for the restarted static pods first, but succeeds when the operation is simply repeated after a little pause of one or two minutes. 

{% endcapture %}

{% include templates/task.md %}
