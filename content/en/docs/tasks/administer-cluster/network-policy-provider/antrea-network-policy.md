---
title: Use Antrea for NetworkPolicy
content_type: task
weight: 10
---

<!-- overview -->
This page shows how to install and use Antrea CNI plugin on Kubernetes.
For background on Project Antrea, read the [Introduction to Antrea](https://antrea.io/docs/).

## {{% heading "prerequisites" %}}

You need to have a Kubernetes cluster. Follow the
[kubeadm getting started guide](/docs/reference/setup-tools/kubeadm/) to bootstrap one.

<!-- steps -->

## Deploying Antrea with kubeadm

Follow [Getting Started](https://github.com/vmware-tanzu/antrea/blob/main/docs/getting-started.md) guide to deploy Antrea for kubeadm.

## {{% heading "whatsnext" %}}

Once your cluster is running, you can follow the [Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/) to try out Kubernetes NetworkPolicy.
