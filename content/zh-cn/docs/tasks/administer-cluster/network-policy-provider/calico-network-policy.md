---
title: 使用 Calico 提供 NetworkPolicy
content_type: task
weight: 20
---
<!--
reviewers:
- caseydavenport
title: Use Calico for NetworkPolicy
content_type: task
weight: 20
-->

<!-- overview -->
<!--
This page shows a couple of quick ways to create a Calico cluster on Kubernetes.
-->
本页展示了几种在 Kubernetes 上快速创建 Calico 集群的方法。

## {{% heading "prerequisites" %}}

<!--
Decide whether you want to deploy a [cloud](#creating-a-calico-cluster-with-google-kubernetes-engine-gke) or [local](#creating-a-local-calico-cluster-with-kubeadm) cluster.
-->
确定你想部署一个[云版本](#gke-cluster)还是[本地版本](#local-cluster)的集群。

<!-- steps -->

<!--
## Creating a Calico cluster with Google Kubernetes Engine (GKE)

**Prerequisite**: [gcloud](https://cloud.google.com/sdk/docs/quickstarts).
-->
## 在 Google Kubernetes Engine (GKE) 上创建一个 Calico 集群 {#gke-cluster}

**先决条件**：[gcloud](https://cloud.google.com/sdk/docs/quickstarts)

<!--
1. To launch a GKE cluster with Calico, include the `--enable-network-policy` flag.
-->
1. 启动一个带有 Calico 的 GKE 集群，需要加上参数 `--enable-network-policy`。

   **语法**
   ```shell
   gcloud container clusters create [CLUSTER_NAME] --enable-network-policy
   ```

   **示例**
   ```shell
   gcloud container clusters create my-calico-cluster --enable-network-policy
   ```

<!--
1. To verify the deployment, use the following command.
-->
2. 使用如下命令验证部署是否正确。

   ```shell
   kubectl get pods --namespace=kube-system
   ```

   <!--
   The Calico pods begin with `calico`. Check to make sure each one has a status of `Running`.
   -->

   Calico 的 Pod 名以 `calico` 打头，检查确认每个 Pod 状态为 `Running`。

<!-- 
## Creating a local Calico cluster with kubeadm

To get a local single-host Calico cluster in fifteen minutes using kubeadm, refer to the 
[Calico Quickstart](https://projectcalico.docs.tigera.io/getting-started/kubernetes/).
-->
## 使用 kubeadm 创建一个本地 Calico 集群   {#local-cluster}

使用 kubeadm 在 15 分钟内得到一个本地单主机 Calico 集群，请参考
[Calico 快速入门](https://projectcalico.docs.tigera.io/getting-started/kubernetes/)。

## {{% heading "whatsnext" %}}

<!--
Once your cluster is running, you can follow the [Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/) to try out Kubernetes NetworkPolicy.
-->
集群运行后，
你可以按照[声明网络策略](/zh-cn/docs/tasks/administer-cluster/declare-network-policy/)去尝试使用
Kubernetes NetworkPolicy。

