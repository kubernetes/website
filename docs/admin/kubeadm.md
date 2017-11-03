---
approvers:
- mikedanese
- luxas
- errordeveloper
- jbeda
title: Overview of Kubeadm
notitle: true
---
# Overview of Kubeadm

Kubeadm is a tool built to provide `kubeadm init` and `kubeadm join` as best-practice “fast paths” for creating kubernetes clusters. 

kubeadm performs the actions necessary to get a minimum viable cluster up and running. It only cares about bootstrapping, not about provisioning machines, by design. Likewise, installing various nice-to-have addons by default like the Kubernetes Dashboard, some monitoring solution, cloud provider-specific addons, etc. is not in scope. 

Instead, we expect higher-level and more tailored tooling to be built on top of kubeadm, and ideally, using kubeadm as the basis of all deployments will make it easier to create conformant clusters.

## What's next

* [kubeadm init](kubeadm-init.md) to bootstraps a Kubernetes master node
* [kubeadm join](kubeadm-join.md) to bootstraps a Kubernetes worker node and join it to the cluster
* [kubeadm upgrade](kubeadm-upgrade.md) to upgrade a Kubernetes cluster to a newer version
* [kubeadm config](kubeadm-config.md) if you initialized your cluster using kubeadm v1.7.x or lower, to configure your cluster for `kubeadm upgrade`
* [kubeadm token](kubeadm-token.md) to manage tokens for `kubeadm join`
* [kubeadm reset](kubeadm-reset.md) to revert any changes made to this host by `kubeadm init` or `kubeadm join`
