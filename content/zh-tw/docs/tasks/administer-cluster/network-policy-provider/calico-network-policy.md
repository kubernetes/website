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
本頁展示了幾種在 Kubernetes 上快速創建 Calico 叢集的方法。

## {{% heading "prerequisites" %}}

<!--
Decide whether you want to deploy a [cloud](#creating-a-calico-cluster-with-google-kubernetes-engine-gke) or [local](#creating-a-local-calico-cluster-with-kubeadm) cluster.
-->
確定你想部署一個[雲版本](#gke-cluster)還是[本地版本](#local-cluster)的叢集。

<!-- steps -->

<!--
## Creating a Calico cluster with Google Kubernetes Engine (GKE)

**Prerequisite**: [gcloud](https://cloud.google.com/sdk/docs/quickstarts).
-->
## 在 Google Kubernetes Engine (GKE) 上創建一個 Calico 叢集 {#gke-cluster}

**先決條件**：[gcloud](https://cloud.google.com/sdk/docs/quickstarts)

<!--
1. To launch a GKE cluster with Calico, include the `--enable-network-policy` flag.
-->
1. 啓動一個帶有 Calico 的 GKE 叢集，需要加上參數 `--enable-network-policy`。

   **語法**
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
2. 使用如下命令驗證部署是否正確。

   ```shell
   kubectl get pods --namespace=kube-system
   ```

   <!--
   The Calico pods begin with `calico`. Check to make sure each one has a status of `Running`.
   -->

   Calico 的 Pod 名以 `calico` 打頭，檢查確認每個 Pod 狀態爲 `Running`。

<!-- 
## Creating a local Calico cluster with kubeadm

To get a local single-host Calico cluster in fifteen minutes using kubeadm, refer to the 
[Calico Quickstart](https://projectcalico.docs.tigera.io/getting-started/kubernetes/).
-->
## 使用 kubeadm 創建一個本地 Calico 叢集   {#local-cluster}

使用 kubeadm 在 15 分鐘內得到一個本地單主機 Calico 叢集，請參考
[Calico 快速入門](https://projectcalico.docs.tigera.io/getting-started/kubernetes/)。

## {{% heading "whatsnext" %}}

<!--
Once your cluster is running, you can follow the [Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/) to try out Kubernetes NetworkPolicy.
-->
叢集運行後，
你可以按照[聲明網路策略](/zh-cn/docs/tasks/administer-cluster/declare-network-policy/)去嘗試使用
Kubernetes NetworkPolicy。

