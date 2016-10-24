---
---

## Overview

Add-ons extend the functionality of Kubernetes.

This page lists some of the available add-ons and links to their respective installation instructions.

## Networking and Network Policy

* [Weave Net](https://github.com/weaveworks/weave-kube) provides networking and network policy, will carry on working on both sides of a network partition, and does not require an external database.
* [Calico](https://github.com/projectcalico/calico-containers/tree/master/docs/cni/kubernetes/manifests/kubeadm) is a secure L3 networking and network policy provider.
* [Canal](https://github.com/tigera/canal/tree/master/k8s-install/kubeadm) unites Flannel and Calico, providing networking and network policy.
* [Romana](http://romana.io) is a Layer 3 networking solution for pod networks that also supports the [NetworkPolicy API](/docs/user-guide/networkpolicies/). Kubeadm add-on installation details available [here](https://github.com/romana/romana/tree/master/containerize).

## Visualization &amp; Control

* [Weave Scope](https://www.weave.works/documentation/scope-latest-installing/#k8s) is a tool for graphically visualizing your containers, pods, services etc. Use it in conjunction with a [Weave Cloud account](https://cloud.weave.works/) or host the UI yourself.
* [Dashboard](https://github.com/kubernetes/dashboard#kubernetes-dashboard) is a dashboard web interface for Kubernetes.

## Legacy Add-ons

There are several other add-ons documented in the deprecated [cluster/addons](https://github.com/kubernetes/kubernetes/tree/master/cluster/addons) directory.

Well-maintained ones should be linked to here. PRs welcome!
