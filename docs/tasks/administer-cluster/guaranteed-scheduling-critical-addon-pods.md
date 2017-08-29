---
approvers:
- davidopp
- filipg
- piosz
title: 关键插件 Pod 的调度保证
---

* TOC
{:toc}

<!--
## Overview

In addition to Kubernetes core components like api-server, scheduler, controller-manager running on a master machine
there are a number of add-ons which, for various reasons, must run on a regular cluster node (rather than the Kubernetes master).
Some of these add-ons are critical to a fully functional cluster, such as Heapster, DNS, and UI.
A cluster may stop working properly if a critical add-on is evicted (either manually or as a side effect of another operation like upgrade)
and becomes pending (for example when the cluster is highly utilized and either there are other pending pods that schedule into the space
vacated by the evicted critical add-on pod or the amount of resources available on the node changed for some other reason).
-->

## 概览

除了 Kubernetes 核心组件，像运行在 master 机器上的 api-server、scheduler、controller-manager，还有很多插件，出于各种原因必须运行在一个普通的集群节点上（而不是 Kubernetes master）。
这些插件中的一些对于一个功能完备的集群来说是非常关键的，例如 Heapster、DNS 以及 UI。
如果一个关键的插件被移除（或者手动，或是类似升级这样具有副作用的其它操作），或者变成挂起状态（例如，当集群利用率过高，以及或者其它被调度到该空间中的挂起 Pod 被清理关键插件 Pod 给移除，或者由于其它原因导致节点上可用资源的总量发生变化），集群可能会停止正常工作。

<!--
## Rescheduler: guaranteed scheduling of critical add-ons

Rescheduler ensures that critical add-ons are always scheduled
(assuming the cluster has enough resources to run the critical add-on pods in the absence of regular pods).
If the scheduler determines that no node has enough free resources to run the critical add-on pod
given the pods that are already running in the cluster
(indicated by critical add-on pod's pod condition PodScheduled set to false, the reason set to Unschedulable)
the rescheduler tries to free up space for the add-on by evicting some pods; then the scheduler will schedule the add-on pod.
-->

## 二次调度器：关键插件的调度保证

二次调度器确保关键的插件总是能被调度（假定普通的 Pod 不存在时，集群具有足够的资源去运行关键插件 Pod）。
如果调度器确定没有节点有足够资源去运行关键插件 Pod，假使有 Pod 已经运行在集群中（通过将关键插件 Pod 的条件 PodScheduled 设置为 false，原因设置为 Unschedulable  来指示），这时二次调度器通过清理一些 Pod 尽量去释放空间，然后调度器将调度该插件 Pod。

<!--
To avoid situation when another pod is scheduled into the space prepared for the critical add-on,
the chosen node gets a temporary taint "CriticalAddonsOnly" before the eviction(s)
(see [more details](https://git.k8s.io/community/contributors/design-proposals/taint-toleration-dedicated.md)).
Each critical add-on has to tolerate it,
while the other pods shouldn't tolerate the taint. The taint is removed once the add-on is successfully scheduled.

*Warning:* currently there is no guarantee which node is chosen and which pods are being killed
in order to schedule critical pods, so if rescheduler is enabled your pods might be occasionally
killed for this purpose.
-->

为了避免这种情况，当另一个 Pod 被调度到该空间，为了该关键插件，被选择的节点导致临时变成 "CriticalAddonsOnly" 的 taint（查看 [更多详情](https://git.k8s.io/community/contributors/design-proposals/taint-toleration-dedicated.md)）。
每个关键插件不得不容忍它，然而其它一些 Pod 不可能容忍该 taint。一旦该插件被成功调度，该 taint 会被移除。

*警告：* 当前对选中哪个节点，以及为了调度该关键 Pod 杀掉哪个 Pod 并没有任何保证，所以如果启用了二次调度器，任何 Pod 都可能被偶然的杀掉以达到目的。

<!--
## Config

Rescheduler should be [enabled by default as a static pod](https://git.k8s.io/kubernetes/cluster/saltbase/salt/rescheduler/rescheduler.manifest).
It doesn't have any user facing configuration (component config) or API and can be disabled:
-->

## 配置

二次调度器应该被 [作为 static Pod 默认启用](https://git.k8s.io/kubernetes/cluster/saltbase/salt/rescheduler/rescheduler.manifest)。
它没有任何面向用户的配置（组件配置），或者 API，可以通过如下方式来禁用：

<!--
* during cluster setup by setting `ENABLE_RESCHEDULER` flag to `false`
* on running cluster by deleting its manifest from master node
(default path `/etc/kubernetes/manifests/rescheduler.manifest`)
-->

* 在集群安装过程中通过设置 `ENABLE_RESCHEDULER` 标志为 `false`
* 在运行中的集群中从 master 节点删除它的 manifest（默认路径 `/etc/kubernetes/manifests/rescheduler.manifest`）

<!--
### Marking add-on as critical

To be critical an add-on has to run in `kube-system` namespace (configurable via flag) and
* have the `scheduler.alpha.kubernetes.io/critical-pod` annotation set to empty string, and
* have the PodSpec's `tolerations` field set to `[{"key":"CriticalAddonsOnly", "operator":"Exists"}]`

The first one marks a pod a critical. The second one is required by Rescheduler algorithm.
-->

### 成为关键插件

想变成关键插件，必须运行在 `kube-system` Namespace 中（是基于标志可配置的），并且：
* 将 `scheduler.alpha.kubernetes.io/critical-pod` annotation 设置为空字符串，并且
* 将 PodSpec 的 `tolerations` 字段设置为 `[{"key":"CriticalAddonsOnly", "operator":"Exists"}]`

第一个表示是一个关键 Pod。第二个是二次调度器算法必需的。

