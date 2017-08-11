---
approvers:
- pipejakob
title: Upgrading kubeadm clusters
---

{% capture overview %}

This guide is for upgrading kubeadm clusters from version 1.7.x to 1.8.x.
See also [upgrading kubeadm clusters from 1.6 to 1.7](/docs/tasks/administer-cluster/kubeadm-upgrade-1-7/) if you're on a 1.6 cluster, currently.

{% endcapture %}

{% capture prerequisites %}
You need to have a Kubernetes cluster running version 1.7.x in order to use the process described here. Note that only one minor version upgrade is supported, that is, you can only upgrade from, say 1.7 to 1.8, not from 1.7 to 1.9.

Before proceeding, make sure you read the [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG.md#v180-alpha2) carefully.

The following is out of scope for `kubeadm upgrade`, that is, you need to take care of it yourself:

- No etcd upgrades are performed. You can, for example, use `etcdctl` to take care of this.
- Any app-level state, for example, a database an app might depend on (like MySQL or MongoDB) must be backed up beforehand.


Note that `kubeadm upgrade` is 'eventually idempotent', that is, you can run it over and over again if you find yourself in a bad state and it should be able to recover.

{% endcapture %}

{% capture steps %}

## On the master

1. Upgrade `kubectl` using [curl](/docs/tasks/tools/install-kubectl/#install-kubectl-binary-via-curl). Note: DO NOT use `apt` or `yum` or any other package manager to upgrade it.

2. Install the most recent version of `kubeadm` using curl.

3. On the master node, run `kubeadm upgrade plan`, which tells you what versions are available.

4. Pick a version to upgrade to and run, for example, `kubeadm upgrade apply --version v1.7.3`.

5. After `kubeadm upgrade` you need to manually upgrade your SDN.

   Your CNI provider might have its own upgrade instructions to follow now.
   Check the [addons](/docs/concepts/cluster-administration/addons/) page to
   find your CNI provider and see if there are additional upgrade steps
   necessary.

## Recovering from a bad state

You can use `kubeadm upgrade` to change a running cluster with `x.x.x --> x.x.x` with `--force`, which can be used to recover from a bad state.

{% endcapture %}

{% include templates/task.md %}
