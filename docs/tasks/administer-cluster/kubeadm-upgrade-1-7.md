---
assignees:
- pipejakob
title: Upgrading kubeadm clusters from 1.6 to 1.7
redirect_from:
- "/docs/admin/kubeadm-upgrade-1-7/"
- "/docs/admin/kubeadm-upgrade-1-7.html"
---

* TOC
{:toc}

This guide is for upgrading kubeadm clusters from version 1.6.x to 1.7.x.
Upgrades are not supported for clusters lower than 1.6, which is when kubeadm
became Beta.

**WARNING**: These instructions will **overwrite** all of the resources managed
by kubeadm (static pod manifest files, service accounts and RBAC rules in the
`kube-system` namespace, etc.), so any customizations you may have made to these
resources after cluster setup will need to be reapplied after the upgrade. The
upgrade will not disturb other static pod manifest files or objects outside the
`kube-system` namespace.

1. Back up `/etc/kubernetes`.

2. Upgrade system packages.

   Upgrade your OS packages for kubectl, kubeadm, kubelet, and kubernetes-cni.

   a. On Debian, this can be accomplished with:

       sudo apt-get update
       sudo apt-get upgrade

   b. On CentOS/Fedora, you would instead run:

       sudo yum update
       sudo yum upgrade

3. Perform kubeadm upgrade.

       sudo kubeadm init --skip-preflight-checks --kubernetes-version <DESIRED_VERSION>

   For instance, if you want to upgrade to `1.7.0`, you would run:

       sudo kubeadm init --skip-preflight-checks --kubernetes-version v1.7.0

4. Upgrade CNI provider.

   Your CNI provider might have its own upgrade instructions to follow now.
   Check the [addons](/docs/concepts/cluster-administration/addons/) page to
   find your CNI provider and see if there are additional upgrade steps
   necessary.

TODO: Rollback instructions in case anything goes wrong (using the backed up
files from step 1).
