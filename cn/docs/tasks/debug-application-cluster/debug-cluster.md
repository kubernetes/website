---
cn-approvers:
- tianshapjq
reviewers:
- davidopp
title: 集群故障排除
---
<!--
---
reviewers:
- davidopp
title: Troubleshoot Clusters
---
-->

<!--
This doc is about cluster troubleshooting; we assume you have already ruled out your application as the root cause of the
problem you are experiencing. See
the [application troubleshooting guide](/docs/tasks/debug-application-cluster/debug-application) for tips on application debugging.
You may also visit [troubleshooting document](/docs/troubleshooting/) for more information.
-->
本文档描述如何排除集群故障；这里我们假设您已经排除根本原因是因为您的应用程序导致的。有关应用程序调试的提示，请参阅 [应用程序故障排除指南](/docs/tasks/debug-application-cluster/debug-application)。
您也可以访问 [疑难解答文档](/docs/troubleshooting/) 以获取更多信息。

<!--
## Listing your cluster

The first thing to debug in your cluster is if your nodes are all registered correctly.

Run
-->
## 列出您的节点

在集群中调试的第一件事是确认您的节点是否都已正确注册。

运行

```shell
kubectl get nodes
```

<!--
And verify that all of the nodes you expect to see are present and that they are all in the `Ready` state.
-->
并验证您期望的所有节点都存在，并且它们都处于 `就绪` 状态。

<!--
## Looking at logs

For now, digging deeper into the cluster requires logging into the relevant machines.  Here are the locations
of the relevant log files.  (note that on systemd-based systems, you may need to use `journalctl` instead)
-->
## 查看日志

目前，深入挖掘集群问题需要登录对应的机器。以下是相关日志文件的位置。（请注意，在基于 systemd 的系统上，您可能需要使用 `journalctl` 来代替）

### Master

<!--
   * /var/log/kube-apiserver.log - API Server, responsible for serving the API
   * /var/log/kube-scheduler.log - Scheduler, responsible for making scheduling decisions
   * /var/log/kube-controller-manager.log - Controller that manages replication controllers
-->
   * /var/log/kube-apiserver.log - API Server, 负责提供 API 服务
   * /var/log/kube-scheduler.log - Scheduler，负责调度决策
   * /var/log/kube-controller-manager.log - 管理副本的控制器

<!--
### Worker Nodes

   * /var/log/kubelet.log - Kubelet, responsible for running containers on the node
   * /var/log/kube-proxy.log - Kube Proxy, responsible for service load balancing
-->
### 工作节点

   * /var/log/kubelet.log - Kubelet，负责在节点上运行容器
   * /var/log/kube-proxy.log - Kube Proxy，负责服务的负载均衡

<!--
## A general overview of cluster failure modes

This is an incomplete list of things that could go wrong, and how to adjust your cluster setup to mitigate the problems.
-->
## 集群故障模式的总体概述

这是一个可能出错的事件列表（列表并没有包含所有错误），以及如何调整集群设置以解决问题。

<!--
Root causes:

  - VM(s) shutdown
  - Network partition within cluster, or between cluster and users
  - Crashes in Kubernetes software
  - Data loss or unavailability of persistent storage (e.g. GCE PD or AWS EBS volume)
  - Operator error, e.g. misconfigured Kubernetes software or application software
-->
根本原因：

  - 虚拟机关闭
  - 网络分区在集群内，或在集群和用户之间
  - Kubernetes 软件崩溃
  - 数据丢失或永久存储不可用（例如，GCE PD 或 AWS EBS 卷）
  - 操作员操作错误，例如错误配置的 Kubernetes 软件或应用软件

<!--
Specific scenarios:

  - Apiserver VM shutdown or apiserver crashing
    - Results
      - unable to stop, update, or start new pods, services, replication controller
      - existing pods and services should continue to work normally, unless they depend on the Kubernetes API
  - Apiserver backing storage lost
    - Results
      - apiserver should fail to come up
      - kubelets will not be able to reach it but will continue to run the same pods and provide the same service proxying
      - manual recovery or recreation of apiserver state necessary before apiserver is restarted
  - Supporting services (node controller, replication controller manager, scheduler, etc) VM shutdown or crashes
    - currently those are colocated with the apiserver, and their unavailability has similar consequences as apiserver
    - in future, these will be replicated as well and may not be co-located
    - they do not have their own persistent state
  - Individual node (VM or physical machine) shuts down
    - Results
      - pods on that Node stop running
  - Network partition
    - Results
      - partition A thinks the nodes in partition B are down; partition B thinks the apiserver is down. (Assuming the master VM ends up in partition A.)
  - Kubelet software fault
    - Results
      - crashing kubelet cannot start new pods on the node
      - kubelet might delete the pods or not
      - node marked unhealthy
      - replication controllers start new pods elsewhere
  - Cluster operator error
    - Results
      - loss of pods, services, etc
      - lost of apiserver backing store
      - users unable to read API
      - etc.
-->
特定场景：

  - Apiserver 虚拟机关闭或者 apiserver 崩溃
    - 结果
      - 无法停止、更新或启动新的 Pod、服务或者副本控制器
      - 现有的 Pod 和服务应继续正常工作，除非它们依赖于 Kubernetes API
  - Apiserver 后端存储丢失
    - 结果
      - apiserver 无法启动
      - kubelets 将无法连接到 apiserver，但是仍然能够运行 pod 并提供服务
      - 在重启 apiserver 之前需要手动恢复或者重建 apiserver 的状态
  - 提供服务支持的虚拟机（节点控制器，副本控制器，scheduler 等等）关闭或者崩溃
    - 目前这些都和 apiserver 集成在一起，如果它们不可用将会和 apiserver 有相同的后果
    - 将来这些将会复制并独立出去
    - 它们没有自己的持久状态
  - 独立节点（虚拟机或者物理机）关闭
    - 结果
      - 在这个节点上运行的 Pod 都停止运行
  - 网络分区
    - 结果
      - 分区 A 认为分区 B 中的节点关闭；分区 B 认为 apiserver 已关闭。（假设主虚拟机在分区 A 中结束）
  - Kubelet 软件错误
    - 结果
      - 已崩溃的 kubelet 不能在节点上启动新的 pod
      - kubelet 可能（也可能不）删除 pod
      - 节点被标记为 unhealthy
      - 副本控制器在其它地方启动新的 pod
  - 集群操作员错误错误
    - 结果
      - pod 或者服务丢失等等
      - apiserver 后端存储丢失
      - 用户无法访问 API
      - 等等

<!--
Mitigations:

- Action: Use IaaS provider's automatic VM restarting feature for IaaS VMs
  - Mitigates: Apiserver VM shutdown or apiserver crashing
  - Mitigates: Supporting services VM shutdown or crashes

- Action: Use IaaS providers reliable storage (e.g. GCE PD or AWS EBS volume) for VMs with apiserver+etcd
  - Mitigates: Apiserver backing storage lost

- Action: Use (experimental) [high-availability](/docs/admin/high-availability) configuration
  - Mitigates: Master VM shutdown or master components (scheduler, API server, controller-managing) crashing
    - Will tolerate one or more simultaneous node or component failures
  - Mitigates: Apiserver backing storage (i.e., etcd's data directory) lost
    - Assuming you used clustered etcd.

- Action: Snapshot apiserver PDs/EBS-volumes periodically
  - Mitigates: Apiserver backing storage lost
  - Mitigates: Some cases of operator error
  - Mitigates: Some cases of Kubernetes software fault

- Action: use replication controller and services in front of pods
  - Mitigates: Node shutdown
  - Mitigates: Kubelet software fault

- Action: applications (containers) designed to tolerate unexpected restarts
  - Mitigates: Node shutdown
  - Mitigates: Kubelet software fault

- Action: [Multiple independent clusters](/docs/concepts/cluster-administration/federation/) (and avoid making risky changes to all clusters at once)
  - Mitigates: Everything listed above.
-->
解决方法：

- 动作: 为 IaaS 虚拟机使用 IaaS 提供商的自动重启虚拟机功能
  - 解决: Apiserver 虚拟机关闭或者 apiserver 崩溃
  - 解决: 提供服务支持的虚拟机关闭或者崩溃

- 动作: 为 apiserver+etcd 的虚拟机使用 IaaS 提供商的可靠存储（例如 GCE PD 或者 AWS EBS 卷）
  - 解决: Apiserver 后端存储丢失

- 动作: 使用 [高可用](/docs/admin/high-availability) 配置（实验阶段）
  - 解决: Master 虚拟机关闭或者 master 组件（scheduler、API server、controller-managing）崩溃
    - 能够容忍一个或者多个节点（或组件）故障
  - 解决: Apiserver 后端存储（例如，etcd 的数据目录）丢失
    - 假设您使用了 etcd 集群。

- 动作: 周期性为 Apiserver PDs/EBS-volumes 制作快照
  - 解决: Apiserver 后端存储丢失
  - 解决: 一些操作员的错误
  - 解决: 一些 Kubernetes 软件错误

- 动作: 使用副本控制器和服务来管理和使用 pod
  - 解决: 节点关闭
  - 解决: Kubelet 软件错误

- 动作: [多个独立的集群](/docs/concepts/cluster-administration/federation/) (注意避免一次在所有集群上进行有风险的修改)
  - 解决: 以上列出的所有事件。
