---
approvers:
- davidopp
- filipg
- piosz
title: 关键插件 Pod 的调度保证
---

* TOC
{:toc}



## 概览

除了 Kubernetes 核心组件，像运行在 master 机器上的 api-server、scheduler、controller-manager，由于各种原因，还有很多插件必须运行在一个普通的集群节点上（而不是 Kubernetes master）。
这些插件中的一些对于一个功能完备的集群来说是非常关键的，例如 Heapster、DNS 以及 UI。
如果一个关键的插件被移除（或者手动，或是类似升级这样具有副作用的其它操作），或者变成挂起状态（例如，当集群利用率过高，以及或者其它被调度到该空间中的挂起 Pod 被清理关键插件 Pod 给移除，或者由于其它原因导致节点上可用资源的总量发生变化），集群可能会停止正常工作。



## 二次调度器：关键插件的调度保证

二次调度器确保关键的插件总是能被调度（假定普通的 Pod 不存在时，集群具有足够的资源去运行关键插件 Pod）。
如果调度器确定没有节点有足够资源去运行关键插件 Pod，假使有 Pod 已经运行在集群中（通过将关键插件 Pod 的条件 PodScheduled 设置为 false，原因设置为 Unschedulable  来指示），这时二次调度器通过清理一些 Pod 尽量去释放空间，然后调度器将调度该插件 Pod。



为了避免这种情况，当另一个 Pod 被调度到该空间，为了该关键插件，被选择的节点导致临时变成 "CriticalAddonsOnly" 的 taint（查看 [更多详情](https://git.k8s.io/community/contributors/design-proposals/taint-toleration-dedicated.md)）。
每个关键插件不得不容忍它，然而其它一些 Pod 不可能容忍该 taint。一旦该插件被成功调度，该 taint 会被移除。

*警告：* 当前对选中哪个节点，以及为了调度该关键 Pod 杀掉哪个 Pod 并没有任何保证，所以如果启用了二次调度器，任何 Pod 都可能被偶然的杀掉以达到目的。



## 配置

二次调度器应该被 [作为 static Pod 默认启用](https://git.k8s.io/kubernetes/cluster/saltbase/salt/rescheduler/rescheduler.manifest)。
它没有任何面向用户的配置（组件配置），或者 API，可以通过如下方式来禁用：



* 在集群安装过程中通过设置 `ENABLE_RESCHEDULER` 标志为 `false`
* 在运行中的集群中从 master 节点删除它的 manifest（默认路径 `/etc/kubernetes/manifests/rescheduler.manifest`）



### 标记关键插件

想变成关键插件，必须运行在 `kube-system` Namespace 中（是基于标志可配置的），并且：
* 将 `scheduler.alpha.kubernetes.io/critical-pod` annotation 设置为空字符串，并且
* 将 PodSpec 的 `tolerations` 字段设置为 `[{"key":"CriticalAddonsOnly", "operator":"Exists"}]`

第一个表示是一个关键 Pod。第二个是二次调度器算法必需的。

