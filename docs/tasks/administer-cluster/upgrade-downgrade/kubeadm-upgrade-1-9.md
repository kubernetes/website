---
reviewers:
- pipejakob
- luxas
- roberthbailey
- jbeda
title: Upgrading/downgrading kubeadm clusters between v1.8 to v1.9
---

{% capture overview %}

This guide is for upgrading `kubeadm` clusters from version 1.8.x to 1.9.x, as well as 1.8.x to 1.8.y and 1.9.x to 1.9.y where `y > x`.
See also [upgrading kubeadm clusters from 1.7 to 1.8](/docs/tasks/administer-cluster/kubeadm-upgrade-1-8/) if you're on a 1.7 cluster currently.

{% endcapture %}

{% capture prerequisites %}

Before proceeding:

- You need to have a functional `kubeadm` Kubernetes cluster running version 1.8.0 or higher in order to use the process described here. Swap also needs to be disabled.
- Make sure you read the [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.9.md) carefully.
- `kubeadm upgrade` now allows you to upgrade etcd. `kubeadm upgrade` will also upgrade of etcd to 3.1.10 as part of upgrading from v1.8 to v1.9 by default. This is due to the fact that etcd 3.1.10 is the officially validated etcd version for Kubernetes v1.9. The upgrade is handled automatically by kubeadm for you.
- Note that `kubeadm upgrade` will not touch any of your workloads, only Kubernetes-internal components. As a best-practice you should back up what's important to you. For example, any app-level state, such as a database an app might depend on (like MySQL or MongoDB) must be backed up beforehand.

**Caution:** All the containers will get restarted after the upgrade, due to container spec hash value gets changed.
{: .caution}

Also, note that only one minor version upgrade is supported. For example, you can only upgrade from 1.8 to 1.9, not from 1.7 to 1.9.

{% endcapture %}

{% capture steps %}

## Upgrading your control plane

Execute these commands on your master node:

1. Install the most recent version of `kubeadm` using `curl` like so:

```shell
export VERSION=$(curl -sSL https://dl.k8s.io/release/stable.txt) # or manually specify a released Kubernetes version
export ARCH=amd64 # or: arm, arm64, ppc64le, s390x
curl -sSL https://dl.k8s.io/release/${VERSION}/bin/linux/${ARCH}/kubeadm > /usr/bin/kubeadm
chmod a+rx /usr/bin/kubeadm
```

**Caution:** Upgrading the `kubeadm` package on your system prior to upgrading the control plane causes a failed upgrade. 
Even though `kubeadm` ships in the Kubernetes repositories, it's important to install `kubeadm` manually. The kubeadm 
team is working on fixing this limitation. 
{: .caution}

Verify that this download of kubeadm works and has the expected version:

```shell
kubeadm version
```

2. On the master node, run the following:

```shell
kubeadm upgrade plan
```

You should see output similar to this:

```shell
[preflight] Running pre-flight checks
[upgrade] Making sure the cluster is healthy:
[upgrade/health] Checking API Server health: Healthy
[upgrade/health] Checking Node health: All Nodes are healthy
[upgrade/health] Checking Static Pod manifests exists on disk: All manifests exist on disk
[upgrade/config] Making sure the configuration is correct:
[upgrade/config] Reading configuration from the cluster...
[upgrade/config] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -o yaml'
[upgrade] Fetching available versions to upgrade to:
[upgrade/versions] Cluster version: v1.8.1
[upgrade/versions] kubeadm version: v1.9.0
[upgrade/versions] Latest stable version: v1.9.0
[upgrade/versions] Latest version in the v1.8 series: v1.8.6

Components that must be upgraded manually after you've upgraded the control plane with 'kubeadm upgrade apply':
COMPONENT   CURRENT      AVAILABLE
Kubelet     1 x v1.8.1   v1.8.6

Upgrade to the latest version in the v1.8 series:

COMPONENT            CURRENT   AVAILABLE
API Server           v1.8.1    v1.8.6
Controller Manager   v1.8.1    v1.8.6
Scheduler            v1.8.1    v1.8.6
Kube Proxy           v1.8.1    v1.8.6
Kube DNS             1.14.4    1.14.5

You can now apply the upgrade by executing the following command:

	kubeadm upgrade apply v1.8.6

_____________________________________________________________________

Components that must be upgraded manually after you've upgraded the control plane with 'kubeadm upgrade apply':
COMPONENT   CURRENT      AVAILABLE
Kubelet     1 x v1.8.1   v1.9.0

Upgrade to the latest stable version:

COMPONENT            CURRENT   AVAILABLE
API Server           v1.8.1    v1.9.0
Controller Manager   v1.8.1    v1.9.0
Scheduler            v1.8.1    v1.9.0
Kube Proxy           v1.8.1    v1.9.0
Kube DNS             1.14.5    1.14.7

You can now apply the upgrade by executing the following command:

	kubeadm upgrade apply v1.9.0

Note: Before you do can perform this upgrade, you have to update kubeadm to v1.9.0

_____________________________________________________________________
```

The `kubeadm upgrade plan` checks that your cluster is upgradeable and fetches the versions available to upgrade to in an user-friendly way.

To check CoreDNS version, include the `--feature-gates=CoreDNS=true` flag to verify the CoreDNS version which will be installed in place of kube-dns.

3. Pick a version to upgrade to and run. For example:

```shell
kubeadm upgrade apply v1.9.0
```

You should see output similar to this:

```shell
[preflight] Running pre-flight checks.
[upgrade] Making sure the cluster is healthy:
[upgrade/config] Making sure the configuration is correct:
[upgrade/config] Reading configuration from the cluster...
[upgrade/config] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -oyaml'
[upgrade/version] You have chosen to upgrade to version "v1.9.0"
[upgrade/versions] Cluster version: v1.8.1
[upgrade/versions] kubeadm version: v1.9.0
[upgrade/confirm] Are you sure you want to proceed with the upgrade? [y/N]: y
[upgrade/prepull] Will prepull images for components [kube-apiserver kube-controller-manager kube-scheduler]
[upgrade/apply] Upgrading your Static Pod-hosted control plane to version "v1.9.0"...
[etcd] Wrote Static Pod manifest for a local etcd instance to "/etc/kubernetes/tmp/kubeadm-upgraded-manifests802453804/etcd.yaml"
[upgrade/staticpods] Moved upgraded manifest to "/etc/kubernetes/manifests/etcd.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests502223003/etcd.yaml"
[upgrade/staticpods] Waiting for the kubelet to restart the component
[apiclient] Found 1 Pods for label selector component=etcd
[upgrade/staticpods] Component "etcd" upgraded successfully!
[upgrade/staticpods] Writing upgraded Static Pod manifests to "/etc/kubernetes/tmp/kubeadm-upgraded-manifests802453804"
[controlplane] Wrote Static Pod manifest for component kube-apiserver to "/etc/kubernetes/tmp/kubeadm-upgraded-manifests802453804/kube-apiserver.yaml"
[controlplane] Wrote Static Pod manifest for component kube-controller-manager to "/etc/kubernetes/tmp/kubeadm-upgraded-manifests802453804/kube-controller-manager.yaml"
[controlplane] Wrote Static Pod manifest for component kube-scheduler to "/etc/kubernetes/tmp/kubeadm-upgraded-manifests802453804/kube-scheduler.yaml"
[upgrade/staticpods] Moved upgraded manifest to "/etc/kubernetes/manifests/kube-apiserver.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests502223003/kube-apiserver.yaml"
[upgrade/staticpods] Waiting for the kubelet to restart the component
[apiclient] Found 1 Pods for label selector component=kube-apiserver
[upgrade/staticpods] Component "kube-apiserver" upgraded successfully!
[upgrade/staticpods] Moved upgraded manifest to "/etc/kubernetes/manifests/kube-controller-manager.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests502223003/kube-controller-manager.yaml"
[upgrade/staticpods] Waiting for the kubelet to restart the component
[apiclient] Found 1 Pods for label selector component=kube-controller-manager
[upgrade/staticpods] Component "kube-controller-manager" upgraded successfully!
[upgrade/staticpods] Moved upgraded manifest to "/etc/kubernetes/manifests/kube-scheduler.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests502223003/kube-scheduler.yaml"
[upgrade/staticpods] Waiting for the kubelet to restart the component
[apiclient] Found 1 Pods for label selector component=kube-scheduler
[upgrade/staticpods] Component "kube-scheduler" upgraded successfully!
[uploadconfig] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
[bootstraptoken] Configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
[bootstraptoken] Configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
[bootstraptoken] Configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
[addons] Applied essential addon: kube-dns
[addons] Applied essential addon: kube-proxy

[upgrade/successful] SUCCESS! Your cluster was upgraded to "v1.9.0". Enjoy!

[upgrade/kubelet] Now that your control plane is upgraded, please proceed with upgrading your kubelets in turn.
```

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

4. Manually upgrade your Software Defined Network (SDN).

   Your Container Network Interface (CNI) provider may have its own upgrade instructions to follow.
   Check the [addons](/docs/concepts/cluster-administration/addons/) page to
   find your CNI provider and see if there are additional upgrade steps
   necessary.

## Upgrading your master and node packages

For each host (referred to as `$HOST` below) in your cluster, upgrade `kubelet` by executing the following commands:

1. Prepare the host for maintenance, marking it unschedulable and evicting the workload:

```shell
kubectl drain $HOST --ignore-daemonsets
```

When running this command against the master host, this error is expected and can be safely ignored (since there are static pods running on the master):

```shell
node "master" already cordoned
error: pods not managed by ReplicationController, ReplicaSet, Job, DaemonSet or StatefulSet (use --force to override): etcd-kubeadm, kube-apiserver-kubeadm, kube-controller-manager-kubeadm, kube-scheduler-kubeadm
```

2. Upgrade the Kubernetes package versions on the `$HOST` node by using a Linux distribution-specific package manager:

If the host is running a Debian-based distro such as Ubuntu, run:

```shell
apt-get update
apt-get upgrade
```

If the host is running CentOS or the like, run:

```shell
yum update
```

Now the new version of the `kubelet` should be running on the host. Verify this using the following command on `$HOST`:

```shell
systemctl status kubelet
```

3. Bring the host back online by marking it schedulable:

```shell
kubectl uncordon $HOST
```

4. After upgrading `kubelet` on each host in your cluster, verify that all nodes are available again by executing the following (from anywhere, for example, from outside the cluster):

```shell
kubectl get nodes
```

If the `STATUS` column of the above command shows `Ready` for all of your hosts, you are done.

## Recovering from a failure state

If `kubeadm upgrade` somehow fails and fails to roll back, for example due to an unexpected shutdown during execution,
you can run `kubeadm upgrade` again as it is idempotent and should eventually make sure the actual state is the desired state you are declaring.

You can use `kubeadm upgrade` to change a running cluster with `x.x.x --> x.x.x` with `--force`, which can be used to recover from a bad state.

{% endcapture %}

{% include templates/task.md %}
