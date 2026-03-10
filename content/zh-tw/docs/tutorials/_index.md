---
title: 教學
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
本節收錄了 Kubernetes 的各種教學。
教學示範了如何完成一個比單一[任務](/docs/tasks/)更大的目標。
通常一個教學會有幾個小節，每個小節都有一系列的步驟。
在閱讀每個教學之前，建議您將
[標準化詞彙表](/docs/reference/glossary/)頁面加入書籤，以便日後參考。

<!-- body -->
<!--
## Basics

* [Kubernetes Basics](/docs/tutorials/kubernetes-basics/) is an in-depth interactive tutorial that helps you understand the Kubernetes system and try out some basic Kubernetes features.
* [Introduction to Kubernetes (edX)](https://www.edx.org/course/introduction-kubernetes-linuxfoundationx-lfs158x#)
* [Hello Minikube](/docs/tutorials/hello-minikube/)
-->
## 基礎

* [Kubernetes 基礎](/docs/tutorials/kubernetes-basics/)是一個深入的互動式教學，幫助您了解 Kubernetes 系統並試用一些基本的 Kubernetes 功能。
* [Kubernetes 簡介 (edX)](https://www.edx.org/course/introduction-kubernetes-linuxfoundationx-lfs158x#)
* [Hello Minikube](/docs/tutorials/hello-minikube/)

<!--
## Configuration

* [Configuring Redis Using a ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/)
-->
## 設定

* [使用 ConfigMap 設定 Redis](/docs/tutorials/configuration/configure-redis-using-configmap/)

<!--
## Authoring Pods

* [Adopting Sidecar Containers](/docs/tutorials/configuration/pod-sidecar-containers/)
-->
## 撰寫 Pod

* [採用 Sidecar 容器](/docs/tutorials/configuration/pod-sidecar-containers/)

<!--
## Stateless Applications

* [Exposing an External IP Address to Access an Application in a Cluster](/docs/tutorials/stateless-application/expose-external-ip-address/)
* [Example: Deploying PHP Guestbook application with Redis](/docs/tutorials/stateless-application/guestbook/)
-->
## 無狀態應用程式

* [對外公開 IP 位址以存取叢集中的應用程式](/docs/tutorials/stateless-application/expose-external-ip-address/)
* [範例：使用 Redis 部署 PHP 留言板應用程式](/docs/tutorials/stateless-application/guestbook/)

<!--
## Stateful Applications

* [StatefulSet Basics](/docs/tutorials/stateful-application/basic-stateful-set/)
* [Example: WordPress and MySQL with Persistent Volumes](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/)
* [Example: Deploying Cassandra with Stateful Sets](/docs/tutorials/stateful-application/cassandra/)
* [Running ZooKeeper, A CP Distributed System](/docs/tutorials/stateful-application/zookeeper/)
-->
## 有狀態應用程式

* [StatefulSet 基礎](/docs/tutorials/stateful-application/basic-stateful-set/)
* [範例：使用持久性磁碟區部署 WordPress 與 MySQL](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/)
* [範例：使用 StatefulSet 部署 Cassandra](/docs/tutorials/stateful-application/cassandra/)
* [執行 ZooKeeper（CP 分散式系統）](/docs/tutorials/stateful-application/zookeeper/)

<!--
## Services

* [Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/)
* [Using Source IP](/docs/tutorials/services/source-ip/)
-->
## 服務

* [使用 Service 連接應用程式](/docs/tutorials/services/connect-applications-service/)
* [使用來源 IP](/docs/tutorials/services/source-ip/)

<!--
## Security

* [Apply Pod Security Standards at Cluster level](/docs/tutorials/security/cluster-level-pss/)
* [Apply Pod Security Standards at Namespace level](/docs/tutorials/security/ns-level-pss/)
* [Restrict a Container's Access to Resources with AppArmor](/docs/tutorials/security/apparmor/)
* [Seccomp](/docs/tutorials/security/seccomp/)
-->
## 安全性

* [在叢集層級套用 Pod 安全標準](/docs/tutorials/security/cluster-level-pss/)
* [在命名空間層級套用 Pod 安全標準](/docs/tutorials/security/ns-level-pss/)
* [使用 AppArmor 限制容器對資源的存取](/docs/tutorials/security/apparmor/)
* [Seccomp](/docs/tutorials/security/seccomp/)

<!--
## Cluster Management

* [Configuring Swap Memory on Kubernetes Nodes](/docs/tutorials/cluster-management/provision-swap-memory/)
* [Running Kubelet in Standalone Mode](/docs/tutorials/cluster-management/kubelet-standalone/)
* [Install Drivers and Allocate Devices with DRA](/docs/tutorials/cluster-management/install-use-dra/)
-->
## 叢集管理

* [在 Kubernetes 節點上設定 Swap 記憶體](/docs/tutorials/cluster-management/provision-swap-memory/)
* [以獨立模式執行 Kubelet](/docs/tutorials/cluster-management/kubelet-standalone/)
* [使用 DRA 安裝驅動程式並分配裝置](/docs/tutorials/cluster-management/install-use-dra/)

<!--
## {{% heading "whatsnext" %}}

If you would like to write a tutorial, see
[Content Page Types](/docs/contribute/style/page-content-types/)
for information about the tutorial page type.
-->
## {{% heading "whatsnext" %}}

如果您想撰寫教學，請參閱
[內容頁面類型](/docs/contribute/style/page-content-types/)
以取得有關教學頁面類型的資訊。
