---
approvers:
- pipejakob
- luxas
- roberthbailey
- jbeda
title: Upgrading kubeadm clusters
---

{% capture overview %}

This guide is for upgrading `kubeadm` clusters from version 1.7.x to 1.8.x.
See also [upgrading kubeadm clusters from 1.6 to 1.7](/docs/tasks/administer-cluster/kubeadm-upgrade-1-7/) if you're on a 1.6 cluster currently.

{% endcapture %}

{% capture prerequisites %}

Before proceeding:

- You need to have a functional `kubeadm` Kubernetes cluster running version 1.7.0 or higher in order to use the process described here.
- Make sure you read the [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG.md#v180-beta1) carefully.
- As `kubeadm upgrade` does not upgrade etcd make sure to back it up. You can, for example, use `etcdctl backup` to take care of this.
- Note that `kubeadm upgrade` will not touch any of your workloads, only Kubernetes-internal components. As a best-practice you should back up what's important to you. For example, any app-level state, such as a database an app might depend on (like MySQL or MongoDB) must be backed up beforehand.

Also, note that only one minor version upgrade is supported. That is, you can only upgrade from, say 1.7 to 1.8, not from 1.7 to 1.9.

{% endcapture %}

{% capture steps %}

## Upgrading your control plane

You have to carry out the following steps by executing these commands on your master node:

1. Install the most recent version of `kubeadm` using `curl` like so:

```shell
$ export VERSION=v1.8.0 # or any given released Kubernetes version
$ export ARCH=amd64 # or: arm, arm64, ppc64le, s390x
$ curl -sSL https://dl.k8s.io/release/${VERSION}/bin/linux/${ARCH}/kubeadm > /usr/bin/kubeadm
```

1. On the master node, run the following:

```shell
$ kubeadm upgrade plan
[upgrade] Making sure the cluster is healthy:
[upgrade/health] Checking API Server health: Healthy
[upgrade/health] Checking Node health: All Nodes are healthy
[upgrade/health] Checking if control plane is Static Pod-hosted or Self-Hosted: Static Pod-hosted.
[upgrade/health] NOTE: kubeadm will upgrade your Static Pod-hosted control plane to a Self-Hosted one when upgrading if --feature-gates=SelfHosting=true is set (which is the default)
[upgrade/health] If you strictly want to continue using a Static Pod-hosted control plane, set --feature-gates=SelfHosting=true when running 'kubeadm upgrade apply'
[upgrade/health] Checking Static Pod manifests exists on disk: All required Static Pod manifests exist on disk
[upgrade] Making sure the configuration is correct:
[upgrade/config] Reading configuration from the cluster (you can get this with 'kubectl -n kube-system get cm kubeadm-config -oyaml')
[upgrade] Fetching available versions to upgrade to:
[upgrade/versions] Cluster version: v1.7.1
[upgrade/versions] kubeadm version: v1.8.0
[upgrade/versions] Latest stable version: v1.7.3
[upgrade/versions] Latest version in the v1.7 series: v1.7.3

Components that must be upgraded manually after you've upgraded the control plane with `kubeadm upgrade apply`:
COMPONENT   CURRENT      AVAILABLE
Kubelet     1 x v1.7.0   v1.7.3

Upgrade to the latest version in the v1.7 series:

COMPONENT            CURRENT   AVAILABLE
API Server           v1.7.1    v1.7.3
Controller Manager   v1.7.1    v1.7.3
Scheduler            v1.7.1    v1.7.3
Kube Proxy           v1.7.1    v1.7.3
Kube DNS             1.14.4    1.14.4

You can now apply the upgrade by executing the following command:

	kubeadm upgrade apply --version v1.7.3
```

The `kubeadm upgrade plan` checks that your cluster is in an upgradeable state and fetches the versions available to upgrade to in an user-friendly way.

1. Pick a version to upgrade to and run, for example, `kubeadm upgrade apply` as follows:

```shell
$ kubeadm upgrade apply --version v1.8.0
[upgrade] Making sure the cluster is healthy:
[upgrade/health] Checking API Server health: Healthy
[upgrade/health] Checking Node health: All Nodes are healthy
[upgrade/health] Checking if control plane is Static Pod-hosted or Self-Hosted: Static Pod-hosted.
[upgrade/health] NOTE: kubeadm will upgrade your Static Pod-hosted control plane to a Self-Hosted one when upgrading if --feature-gates=SelfHosting=true is set (which is the default)
[upgrade/health] If you strictly want to continue using a Static Pod-hosted control plane, set --feature-gates=SelfHosting=true when running 'kubeadm upgrade apply'
[upgrade/health] Checking Static Pod manifests exists on disk: All required Static Pod manifests exist on disk
[upgrade] Making sure the configuration is correct:
[upgrade/config] Reading configuration from the cluster (you can get this with 'kubectl -n kube-system get cm kubeadm-config -oyaml')
[upgrade/version] You have chosen to upgrade to version "v1.8.0"
[upgrade/versions] Cluster version: v1.7.1
[upgrade/versions] kubeadm version: v1.8.0
[upgrade/confirm] Are you sure you want to proceed with the upgrade? [y/N]: Y
[upgrade/prepull] Will prepull images for components [kube-apiserver kube-controller-manager kube-scheduler]
[upgrade/prepull] Prepulling image for component kube-scheduler.
[upgrade/prepull] Prepulling image for component kube-apiserver.
[upgrade/prepull] Prepulling image for component kube-controller-manager.
[upgrade/prepull] Prepulled image for component kube-scheduler.
[upgrade/prepull] Prepulled image for component kube-apiserver.
[upgrade/prepull] Prepulled image for component kube-controller-manager.
[upgrade/prepull] Successfully prepulled the images for all the control plane components
[upgrade/apply] Upgrading your Static Pod-hosted control plane to version "v1.8.0"...
[upgrade/staticpods] Wrote upgraded Static Pod manifests to "/tmp/kubeadm-upgrade830923296"
[upgrade/staticpods] Moved upgraded manifest to "/etc/kubernetes/manifests/kube-apiserver.yaml" and backuped old manifest to "/tmp/kubeadm-upgrade830923296/old-manifests/kube-apiserver.yaml"
[upgrade/staticpods] Waiting for the kubelet to restart the component
[apiclient] Found 1 Pods for label selector component=kube-apiserver
[upgrade/staticpods] Component "kube-apiserver" upgraded successfully!
[upgrade/staticpods] Moved upgraded manifest to "/etc/kubernetes/manifests/kube-controller-manager.yaml" and backuped old manifest to "/tmp/kubeadm-upgrade830923296/old-manifests/kube-controller-manager.yaml"
[upgrade/staticpods] Waiting for the kubelet to restart the component
[apiclient] Found 1 Pods for label selector component=kube-controller-manager
[upgrade/staticpods] Component "kube-controller-manager" upgraded successfully!
[upgrade/staticpods] Moved upgraded manifest to "/etc/kubernetes/manifests/kube-scheduler.yaml" and backuped old manifest to "/tmp/kubeadm-upgrade830923296/old-manifests/kube-scheduler.yaml"
[upgrade/staticpods] Waiting for the kubelet to restart the component
[apiclient] Found 1 Pods for label selector component=kube-scheduler
[apiclient] Found 0 Pods for label selector component=kube-scheduler
[apiclient] Found 1 Pods for label selector component=kube-scheduler
[upgrade/staticpods] Component "kube-scheduler" upgraded successfully!
[apiclient] Found 0 Pods for label selector k8s-app=self-hosted-kube-apiserver
[apiclient] Found 1 Pods for label selector k8s-app=self-hosted-kube-apiserver
[apiclient] Found 0 Pods for label selector k8s-app=self-hosted-kube-controller-manager
[apiclient] Found 1 Pods for label selector k8s-app=self-hosted-kube-controller-manager
[apiclient] Found 0 Pods for label selector k8s-app=self-hosted-kube-scheduler
[apiclient] Found 1 Pods for label selector k8s-app=self-hosted-kube-scheduler
[apiconfig] Created RBAC rules
[addons] Applied essential addon: kube-proxy
[addons] Applied essential addon: kube-dns
```

`kubeadm upgrade apply` does the following:

- It checks that your cluster is in an upgradeable state, that is:
  - The API Server is reachable,
  - All nodes are in the `Ready` state, and
  - The control plane is healthy
- It enforces the version skew policies.
- It makes sure the control plane images are available or available to pull to the machine.
- It upgrades the control plane components or rollbacks if any of them fails to come up.
- It applies the new `kube-dns` and `kube-proxy` manifests and enforces that all necessary RBAC rules are created.

1. Manually upgrade your Software Defined Network (SDN).

   Your Container Network Interface (CNI) provider might have its own upgrade instructions to follow now.
   Check the [addons](/docs/concepts/cluster-administration/addons/) page to
   find your CNI provider and see if there are additional upgrade steps
   necessary.

## Recovering from a bad state

If `kubeadm upgrade` somehow fails and fails to roll back, due to an unexpected shutdown during execution for instance,
you may run `kubeadm upgrade` again as it is idempotent and should eventually make sure the actual state is the desired state you are declaring.

You can use `kubeadm upgrade` to change a running cluster with `x.x.x --> x.x.x` with `--force`, which can be used to recover from a bad state.

{% endcapture %}

{% include templates/task.md %}
