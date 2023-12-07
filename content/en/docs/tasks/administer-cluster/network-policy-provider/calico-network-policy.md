---
reviewers:
- caseydavenport
title: Use Calico for NetworkPolicy
content_type: task
weight: 20
---

<!-- overview -->
This page shows a couple of quick ways to create a Calico cluster on Kubernetes.


## {{% heading "prerequisites" %}}

Decide whether you want to deploy a [cloud](#creating-a-calico-cluster-with-google-kubernetes-engine-gke) or [local](#creating-a-local-calico-cluster-with-kubeadm) cluster.


<!-- steps -->
## Creating a Calico cluster with Google Kubernetes Engine (GKE)

**Prerequisite**: [gcloud](https://cloud.google.com/sdk/docs/quickstarts).

1.  To launch a GKE cluster with Calico, include the `--enable-network-policy` flag.

    **Syntax**
    ```shell
    gcloud container clusters create [CLUSTER_NAME] --enable-network-policy
    ```

    **Example**
    ```shell
    gcloud container clusters create my-calico-cluster --enable-network-policy
    ```

1.  To verify the deployment, use the following command.

    ```shell
    kubectl get pods --namespace=kube-system
    ```

    The Calico pods begin with `calico`. Check to make sure each one has a status of `Running`.

## Creating a local Calico cluster with kubeadm

To get a local single-host Calico cluster in fifteen minutes using kubeadm, refer to the 
[Calico Quickstart](https://projectcalico.docs.tigera.io/getting-started/kubernetes/).




## {{% heading "whatsnext" %}}

Once your cluster is running, you can follow the [Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/) to try out Kubernetes NetworkPolicy.


