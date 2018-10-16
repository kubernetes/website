---
reviewers:
- caseydavenport
title: 使用 Calico 作为 NetworkPolicy
content_template: templates/task
weight: 10
---

{{% capture overview %}}
<!-- This page shows a couple of quick ways to create a Calico cluster on Kubernetes. -->
本页展示了两种在 Kubernetes 上快速创建 Calico 集群的方法。
{{% /capture %}}

{{% capture prerequisites %}}
<!-- Decide whether you want to deploy a [cloud](#creating-a-calico-cluster-with-google-kubernetes-engine-gke) or [local](#creating-a-local-calico-cluster-with-kubeadm) cluster. -->

决定您想部署一个[云](#在-Google-Kubernetes-Engine-GKE-上创建一个-Calico-集群) 还是 [本地](#使用-kubeadm-创建一个本地-Calico-集群) 集群。
{{% /capture %}}

{{% capture steps %}}
<!-- ## Creating a Calico cluster with Google Kubernetes Engine (GKE)

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
 -->
## 在 Google Kubernetes Engine (GKE) 上创建一个 Calico 集群

**先决条件**: [gcloud](https://cloud.google.com/sdk/docs/quickstarts)

1.  启动一个带有 Calico 的 GKE 集群，只需加上flag `--enable-network-policy`。

    **语法**
    ```shell
    gcloud container clusters create [CLUSTER_NAME] --enable-network-policy
    ```

    **示例**
    ```shell
    gcloud container clusters create my-calico-cluster --enable-network-policy
    ```

1.  使用如下命令验证部署是否正确。

    ```shell
    kubectl get pods --namespace=kube-system
    ```

    Calico 的 pods 名以 `calico` 打头，检查确认每个 pods 状态为 `Running`。
<!-- 
## Creating a local Calico cluster with kubeadm

To get a local single-host Calico cluster in fifteen minutes using kubeadm, refer to the 
[Calico Quickstart](https://docs.projectcalico.org/latest/getting-started/kubernetes/).
 -->

## 使用 kubeadm 创建一个本地 Calico 集群

在15分钟内使用 kubeadm 得到一个本地单主机 Calico 集群，请参考 
[Calico 快速入门](https://docs.projectcalico.org/latest/getting-started/kubernetes/)。

{{% /capture %}}


{{% capture whatsnext %}}
<!-- Once your cluster is running, you can follow the [Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/) to try out Kubernetes NetworkPolicy. -->
集群运行后，您可以按照 [声明 Network Policy](/docs/tasks/administer-cluster/declare-network-policy/) 去尝试使用 Kubernetes NetworkPolicy。
{{% /capture %}}
