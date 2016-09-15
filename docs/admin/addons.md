---
---

## Overview

Add-ons extend the functionality of Kubernetes in a pluggable way.
You can install add-ons on a Kubernetes cluster using `kubectl apply -f`.

This page lists some of the available add-ons.

## Networking

* [Weave Net](https://github.com/weaveworks/weave-kube) is a fast, reliable pod network that carries on working even in the face of network partitions, and doesn't have any infrastructure or database dependencies. Install it on a cluster whose kubelets are configured to expect a [CNI network plugin](/docs/admin/network-plugins/):

      $ kubectl apply -f https://git.io/weave-kube

  If you used [`kubeadm`](/docs/kubeadm/) to create your cluster, the kubelet will already be preconfigured to expect a CNI plugin, so you won't need to do anything special to get it Weave Net working.

## Network Policy

* [Weave Net Policy](https://github.com/weaveworks/weave-npc/tree/initial-implementation) extends Weave Net to support the [Kubernetes policy API](/docs/user-guide/networkpolicies/) so that you can securely isolate different pods from each other based on namespaces and labels:

      $ kubectl apply -f https://raw.githubusercontent.com/weaveworks/weave-npc/40f5461f2f840eb8a223710e227f687cbaa55d0f/k8s/daemonset.yaml

  See [the README](https://github.com/weaveworks/weave-npc/tree/initial-implementation#use) for an example of how to use it.


## Visualization &amp; Control

* [Weave Scope](https://www.weave.works/documentation/scope-latest-installing/#k8s) is a tool for graphically visualizing your containers, pods, services etc.
  Register for a [Weave Cloud account](https://cloud.weave.works/) to get a service token and then replace `<token>` with your token below:

      $ kubectl apply -f https://cloud.weave.works/launch/k8s/weavescope.yaml?service-token=<token>

  **SECURITY NOTE: This allows control of your Kubernetes cluster from Weave Cloud, which is a hosted service.**

  Alternatively you can run Scope app standalone without sending any data to Weave Cloud by following the instructions [here](https://www.weave.works/documentation/scope-latest-installing/#k8s).
