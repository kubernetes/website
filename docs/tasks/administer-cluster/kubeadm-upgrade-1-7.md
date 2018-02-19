---
reviewers:
- pipejakob
title: Upgrading kubeadm clusters from 1.6 to 1.7
---

{% capture overview %}

This guide is for upgrading kubeadm clusters from version 1.6.x to 1.7.x.
Upgrades are not supported for clusters lower than 1.6, which is when kubeadm
became Beta.

**WARNING**: These instructions will **overwrite** all of the resources managed
by kubeadm (static pod manifest files, service accounts and RBAC rules in the
`kube-system` namespace, etc.), so any customizations you may have made to these
resources after cluster setup will need to be reapplied after the upgrade. The
upgrade will not disturb other static pod manifest files or objects outside the
`kube-system` namespace.

{% endcapture %}

{% capture prerequisites %}
You need to have a Kubernetes cluster running version 1.6.x.
{% endcapture %}

{% capture steps %}

## On the master

1. Upgrade system packages.

   Upgrade your OS packages for kubectl, kubeadm, kubelet, and kubernetes-cni.

   a. On Debian, this can be accomplished with:

       sudo apt-get update
       sudo apt-get upgrade

   b. On CentOS/Fedora, you would instead run:

       sudo yum update

2. Restart kubelet.

       systemctl restart kubelet

3. Delete the `kube-proxy` DaemonSet.

   Although most components are automatically upgraded by the next step,
   `kube-proxy` currently needs to be manually deleted so it can be recreated at
   the correct version:

       sudo KUBECONFIG=/etc/kubernetes/admin.conf kubectl delete daemonset kube-proxy -n kube-system

4. Perform kubeadm upgrade.

    **WARNING**: All parameters you passed to the first `kubeadm init` when you bootstrapped your
    cluster **MUST** be specified here in the upgrade-`kubeadm init`-command. This is a limitation
    we plan to address in v1.8.

       sudo kubeadm init --skip-preflight-checks --kubernetes-version <DESIRED_VERSION>

   For instance, if you want to upgrade to `1.7.0`, you would run:

       sudo kubeadm init --skip-preflight-checks --kubernetes-version v1.7.0

5. Upgrade CNI provider.

   Your CNI provider might have its own upgrade instructions to follow now.
   Check the [addons](/docs/concepts/cluster-administration/addons/) page to
   find your CNI provider and see if there are additional upgrade steps
   necessary.

## On each node

1. Upgrade system packages.

   Upgrade your OS packages for kubectl, kubeadm, kubelet, and kubernetes-cni.

   a. On Debian, this can be accomplished with:

       sudo apt-get update
       sudo apt-get upgrade

   b. On CentOS/Fedora, you would instead run:

       sudo yum update

2. Restart kubelet.

       systemctl restart kubelet

{% endcapture %}

{% include templates/task.md %}
