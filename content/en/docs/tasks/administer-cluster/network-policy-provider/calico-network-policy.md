---
reviewers:
- caseydavenport
title: Use Calico for NetworkPolicy
content_template: templates/task
weight: 10
---

{{% capture overview %}}
This page shows a couple of quick ways to create a Calico cluster on Kubernetes.
{{% /capture %}}

{{% capture prerequisites %}}
Decide whether you want to deploy a [cloud](#creating-a-calico-cluster-with-google-kubernetes-engine-gke) or [local](#creating-a-local-calico-cluster-with-kubeadm) cluster.
{{% /capture %}}

{{% capture steps %}}
## Creating a Calico cluster with Google Kubernetes Engine (GKE)

**Prerequisite**: [gcloud](https://cloud.google.com/sdk/docs/quickstarts).

1.  To launch a GKE cluster with Calico, just include the `--enable-network-policy` flag.

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
[Calico Quickstart](https://docs.projectcalico.org/latest/getting-started/kubernetes/).

{{% /capture %}}


{{% capture whatsnext %}}
Once your cluster is running, you can follow the [Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/) to try out Kubernetes NetworkPolicy.
{{% /capture %}}

