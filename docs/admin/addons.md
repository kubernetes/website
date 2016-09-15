---
---

## Overview

Add-ons extend the functionality of Kubernetes in a pluggable way.

This page lists some of the available add-ons and links to their respective installation instructions.

## Networking and Network Policy

* [Weave Net](https://github.com/weaveworks/weave-kube) is an easy, fast and reliable pod network that carries on working in the face of network partitions, does not depend on a database, and supports Kubernetes policy.
* [Calico](https://github.com/projectcalico/calico-containers/tree/master/docs/cni/kubernetes/manifests/kubeadm) is a simple, scalable, secure L3 networking and network policy provider.
* [Canal](https://github.com/tigera/canal/tree/master/k8s-install/kubeadm) unites Flannel and Calico, providing cloud native networking and network policy.

## Visualization &amp; Control

* [Weave Scope](https://www.weave.works/documentation/scope-latest-installing/#k8s) is a tool for graphically visualizing your containers, pods, services etc. Use it in conjunction with a [Weave Cloud account](https://cloud.weave.works/) or host the UI yourself.

## Legacy Add-ons

There are several other add-ons documented in the deprecated [cluster/addons](https://github.com/kubernetes/kubernetes/tree/master/cluster/addons) directory.

Well-maintained ones should be linked to here. PRs welcome!
