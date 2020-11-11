---
title: Use Antrea for NetworkPolicy
content_type: task
weight: 10
---

<!-- overview -->
This page shows how to create an Antrea cluster on Kubernetes.
For background on Project Antrea, read the [Introduction to Antrea](https://antrea.io/docs/).

## {{% heading "prerequisites" %}}

You need a Kubernetes cluster created on premises or in public cloud, and the kubectl command-line tool must be configured to communicate with your cluster.

<!-- steps -->

## Deploying Antrea with kubeadm

When using `kubeadm` to create the Kubernetes cluster, passing
`--pod-network-cidr=<CIDR Range for Pods>` to `kubeadm init` will enable
`NodeIpamController`. Clusters created with kubeadm always have
`CNI` plugins enabled. Refer to
[Creating a cluster with kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm)
for more information about setting up a Kubernetes cluster with `kubeadm`.

To deploy the latest version of Antrea (built from the master branch), use the
checked-in [deployment manifest](https://github.com/vmware-tanzu/antrea/blob/master/build/yamls/antrea.yml):

```bash
kubectl apply -f https://raw.githubusercontent.com/vmware-tanzu/antrea/master/build/yamls/antrea.yml
```

## Deploying Antrea in Kind

To deploy Antrea in a [Kind](https://github.com/kubernetes-sigs/kind) cluster,
refer to [Deploying Antrea on a Kind cluster](https://github.com/vmware-tanzu/antrea/blob/master/docs/kind.md).

## Deploying Antrea in EKS and GKE

Antrea can be deployed in NetworkPolicy only mode to an EKS cluster or a GKE
cluster, and enforce NetworkPolicies for the cluster.

* To deploy Antrea in an EKS cluster, please refer to [the EKS installation guide](https://github.com/vmware-tanzu/antrea/blob/master/docs/eks-installation.md).
* To deploy Antrea in a GKE cluster, please refer to [the GKE installation guide](https://github.com/vmware-tanzu/antrea/blob/master/docs/gke-installation.md).

## Deploying Antrea with IPsec Encryption

Antrea supports encrypting GRE tunnel traffic with IPsec. To deploy Antrea with
 IPsec encryption enabled, please refer to [IPsec Encryption of Tunnel Traffic with Antrea](https://github.com/vmware-tanzu/antrea/blob/master/docs/ipsec-tunnel.md).

## {{% heading "whatsnext" %}}

Once your cluster is running, you can follow the [Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/) to try out Kubernetes NetworkPolicy.
