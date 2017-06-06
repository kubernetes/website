---
assignees:
- pipejakob
title: Upgrading kubeadm clusters to 1.7
redirect_from:
- "/docs/admin/kubeadm-upgrade-1-7/"
- "/docs/admin/kubeadm-upgrade-1-7.html"
---

* TOC
{:toc}

This guide is for upgrading kubeadm clusters from version 1.6.x to 1.7.x, or
other 1.6.x releases. Upgrades are not supported before the 1.6.0 release (when
kubeadm became Beta).

It is a work-in-progress (not intended for merging yet) and targeted at other
developers hoping to exercise the instructions to test the upgrade process.

1. Back up `/etc/kubernetes`.

2. Upgrade system packages.

   Upgrade kubectl, kubeadm, kubelet, and kubernetes-cni via OS packages

   a. On Debian, this would be:

       sudo apt-get update
       sudo apt-get install kubelet kubeadm kubelet kubernetes-cni

   b. On CentOS/Fedora, this would be:

       sudo yum update
       sudo yum install kubelet kubeadm kubelet kubernetes-cni

   TODO: For testing purposes, build candidate .debs/.rpms and include alternate
   instructions for installing them.

3. Perform kubeadm upgrade.

       kubeadm init --skip-preflight-checks --kubernetes-version <DESIRED_VERSION>`

   At release time, this would be:

       kubeadm init --skip-preflight-checks --kubernetes-version v1.7.0

   For pre-release testing, this would be:

       kubeadm init --skip-preflight-checks --kubernetes-version v1.7.0-beta.0

4. Upgrade CNI provider.

   Your CNI provider might have its own upgrade instructions to follow now.

TODO: Rollback instructions in case anything goes wrong (using the backed up
files from step 1).
