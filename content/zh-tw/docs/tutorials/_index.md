---
title: 教程
main_menu: true
no_list: true
weight: 60
content_type: concept
---

<!--
title: Tutorials
main_menu: true
no_list: true
weight: 60
content_type: concept
-->

<!-- overview -->
<!--
This section of the Kubernetes documentation contains tutorials.
A tutorial shows how to accomplish a goal that is larger than a single
[task](/docs/tasks/). Typically a tutorial has several sections,
each of which has a sequence of steps.
Before walking through each tutorial, you may want to bookmark the
[Standardized Glossary](/docs/reference/glossary/) page for later references.
-->
Kubernetes 文檔的這一部分包含教程。
每個教程展示瞭如何完成一個比單個[任務](/zh-cn/docs/tasks/)更大的目標。
通常一個教程有幾個部分，每個部分都有一系列步驟。在瀏覽每個教程之前，
你可能希望將[標準化術語表](/zh-cn/docs/reference/glossary/)頁面添加到書籤，供以後參考。

<!-- body -->
<!--
## Basics

* [Kubernetes Basics](/docs/tutorials/kubernetes-basics/) is an in-depth interactive tutorial that helps you understand the Kubernetes system and try out some basic Kubernetes features.
* [Introduction to Kubernetes (edX)](https://www.edx.org/course/introduction-kubernetes-linuxfoundationx-lfs158x#)
* [Hello Minikube](/docs/tutorials/hello-minikube/)
-->
## 基礎知識  {#basics}

* [Kubernetes 基礎知識](/zh-cn/docs/tutorials/kubernetes-basics/)
  是一個深入的交互式教程，幫助你理解 Kubernetes 系統，並嘗試一些基本的 Kubernetes 特性。
* [Kubernetes 介紹 (edX)](https://www.edx.org/course/introduction-kubernetes-linuxfoundationx-lfs158x#)
* [你好 Minikube](/zh-cn/docs/tutorials/hello-minikube/)

<!--
## Configuration

* [Configuring Redis Using a ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/)
-->
## 設定  {#configuration}

* [使用 ConfigMap 設定 Redis](/zh-cn/docs/tutorials/configuration/configure-redis-using-configmap/)

<!--
## Authoring Pods

* [Adopting Sidecar Containers](/docs/tutorials/configuration/pod-sidecar-containers/)
-->
## 構造 Pod

* [採用 Sidecar 容器](/zh-cn/docs/tutorials/configuration/pod-sidecar-containers/)

<!--
## Stateless Applications

* [Exposing an External IP Address to Access an Application in a Cluster](/docs/tutorials/stateless-application/expose-external-ip-address/)
* [Example: Deploying PHP Guestbook application with MongoDB](/docs/tutorials/stateless-application/guestbook/)
-->
## 無狀態應用程式  {#stateless-applications}

* [公開外部 IP 地址訪問叢集中的應用程式](/zh-cn/docs/tutorials/stateless-application/expose-external-ip-address/)
* [示例：使用 Redis 部署 PHP 留言板應用程式](/zh-cn/docs/tutorials/stateless-application/guestbook/)

<!--
## Stateful Applications

* [StatefulSet Basics](/docs/tutorials/stateful-application/basic-stateful-set/)
* [Example: WordPress and MySQL with Persistent Volumes](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/)
* [Example: Deploying Cassandra with Stateful Sets](/docs/tutorials/stateful-application/cassandra/)
* [Running ZooKeeper, A CP Distributed System](/docs/tutorials/stateful-application/zookeeper/)
-->
## 有狀態應用程式  {#stateful-applications}

* [StatefulSet 基礎](/zh-cn/docs/tutorials/stateful-application/basic-stateful-set/)
* [示例：WordPress 和 MySQL 使用持久卷](/zh-cn/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/)
* [示例：使用有狀態集部署 Cassandra](/zh-cn/docs/tutorials/stateful-application/cassandra/)
* [運行 ZooKeeper，CP 分佈式系統](/zh-cn/docs/tutorials/stateful-application/zookeeper/)

<!--
## Services

* [Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/)
* [Using Source IP](/docs/tutorials/services/source-ip/)
-->
## 服務  {#services}

* [使用 Service 連接到應用](/zh-cn/docs/tutorials/services/connect-applications-service/)
* [使用源 IP](/zh-cn/docs/tutorials/services/source-ip/)

<!--
## Security

* [Apply Pod Security Standards at Cluster level](/docs/tutorials/security/cluster-level-pss/)
* [Apply Pod Security Standards at Namespace level](/docs/tutorials/security/ns-level-pss/)
* [Restrict a Container's Access to Resources with AppArmor](/docs/tutorials/security/apparmor/)
* [Seccomp](/zh-cn/docs/tutorials/security/seccomp/)
-->
## 安全  {#security}

* [在叢集級別應用 Pod 安全標準](/zh-cn/docs/tutorials/security/cluster-level-pss/)
* [在名字空間級別應用 Pod 安全標準](/zh-cn/docs/tutorials/security/ns-level-pss/)
* [使用 AppArmor 限制容器對資源的訪問](/zh-cn/docs/tutorials/security/apparmor/)
* [Seccomp](/zh-cn/docs/tutorials/security/seccomp/)

<!--
## Cluster Management

* [Running Kubelet in Standalone Mode](/docs/tutorials/cluster-management/kubelet-standalone/)
* [Install Drivers and Allocate Devices with DRA](/docs/tutorials/cluster-management/install-use-dra/)
-->
## 叢集管理

* [以獨立模式運行 kubelet](/zh-cn/docs/tutorials/cluster-management/kubelet-standalone/)
* [安裝驅動程式並使用 DRA 來分配設備](/zh-cn/docs/tutorials/cluster-management/install-use-dra/)

## {{% heading "whatsnext" %}}

<!--
If you would like to write a tutorial, see
[Content Page Types](/docs/contribute/style/page-content-types/)
for information about the tutorial page.
-->
如果你要編寫教程，請參閱[內容頁面類型](/zh-cn/docs/contribute/style/page-content-types/)
以獲取有關教程頁面類型的資訊。
