---
title: 集群故障排查
content_type: concept
---
<!--
reviewers:
- davidopp
title: Troubleshoot Clusters
content_type: concept
-->

<!-- overview -->

<!--
This doc is about cluster troubleshooting; we assume you have already ruled out your application as the root cause of the
problem you are experiencing. See
the [application troubleshooting guide](/docs/tasks/debug-application-cluster/debug-application) for tips on application debugging.
You may also visit [troubleshooting document](/docs/tasks/debug-application-cluster/troubleshooting/) for more information.
-->
本篇文档是介绍集群故障排查的；我们假设对于你碰到的问题，你已经排除了是由应用程序造成的。
对于应用的调试，请参阅
[应用故障排查指南](/zh/docs/tasks/debug-application-cluster/debug-application/)。
你也可以访问[故障排查](/zh/docs/tasks/debug-application-cluster/troubleshooting/)
来获取更多的信息。

<!-- body -->

<!--
## Listing your cluster

The first thing to debug in your cluster is if your nodes are all registered correctly.

Run
-->
## 列举集群节点

调试的第一步是查看所有的节点是否都已正确注册。

运行

```shell
kubectl get nodes
```

<!--
And verify that all of the nodes you expect to see are present and that they are all in the `Ready` state.

To get detailed information about the overall health of your cluster, you can run:
-->
验证你所希望看见的所有节点都能够显示出来，并且都处于 `Ready` 状态。

为了了解你的集群的总体健康状况详情，你可以运行：

```shell
kubectl cluster-info dump
```

<!--
## Looking at logs

For now, digging deeper into the cluster requires logging into the relevant machines.  Here are the locations
of the relevant log files.  (note that on systemd-based systems, you may need to use `journalctl` instead)
-->
## 查看日志

到这里，挖掘出集群更深层的信息就需要登录到相关的机器上。下面是相关日志文件所在的位置。
（注意，对于基于 systemd 的系统，你可能需要使用`journalctl`）。

<!--
### Master

   * `/var/log/kube-apiserver.log` - API Server, responsible for serving the API
   * `/var/log/kube-scheduler.log` - Scheduler, responsible for making scheduling decisions
   * `/var/log/kube-controller-manager.log` - Controller that manages replication controllers
-->
### 主控节点

* `/var/log/kube-apiserver.log` - API 服务器, 提供API服务
* `/var/log/kube-scheduler.log` - 调度器, 负责产生调度决策
* `/var/log/kube-controller-manager.log` - 管理副本控制器的控制器

<!--
### Worker Nodes

* `/var/log/kubelet.log` - Kubelet, responsible for running containers on the node
* `/var/log/kube-proxy.log` - Kube Proxy, responsible for service load balancing
-->

### 工作节点

* `/var/log/kubelet.log` - `kubelet`，负责在节点运行容器
* `/var/log/kube-proxy.log` - `kube-proxy`, 负责服务的负载均衡


<!--
## A general overview of cluster failure modes

This is an incomplete list of things that could go wrong, and how to adjust your cluster setup to mitigate the problems.
-->
## 集群故障模式的一般性概述

下面是一个不完整的列表，列举了一些可能的出错场景，以及通过调整集群配置来解决相关问题的方法。

<!--
### Root causes:

  - VM(s) shutdown
  - Network partition within cluster, or between cluster and users
  - Crashes in Kubernetes software
  - Data loss or unavailability of persistent storage (e.g. GCE PD or AWS EBS volume)
  - Operator error, for example misconfigured Kubernetes software or application software
-->
### 根本原因

  - VM(s) 关机
  - 集群之间，或者集群和用户之间网络分裂
  - Kubernetes 软件本身崩溃
  - 数据丢失或者持久化存储不可用（如：GCE PD 或 AWS EBS 卷）
  - 操作错误，如：Kubernetes 或者应用程序配置错误

<!--
### Specific scenarios:

  - Apiserver VM shutdown or apiserver crashing
    - Results
      - unable to stop, update, or start new pods, services, replication controller
      - existing pods and services should continue to work normally, unless they depend on the Kubernetes API
  - Apiserver backing storage lost
    - Results
      - apiserver should fail to come up
      - kubelets will not be able to reach it but will continue to run the same pods and provide the same service proxying
      - manual recovery or recreation of apiserver state necessary before apiserver is restarted
-->
### 具体情况:

- API 服务器所在的 VM 关机或者 API 服务器崩溃
  - 结果
    - 不能停止、更新或者启动新的 Pod、服务或副本控制器
    - 现有的 Pod 和服务在不依赖 Kubernetes API 的情况下应该能继续正常工作
- API 服务器的后端存储丢失
  - 结果
    - API 服务器应该不能启动
    - kubelet 将不能访问 API 服务器，但是能够继续运行之前的 Pod 和提供相同的服务代理
    - 在 API 服务器重启之前，需要手动恢复或者重建 API 服务器的状态
<!--
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
-->
- Kubernetes 服务组件（节点控制器、副本控制器管理器、调度器等）所在的 VM 关机或者崩溃
  - 当前，这些控制器是和 API 服务器在一起运行的，它们不可用的现象是与 API 服务器类似的
  - 将来，这些控制器也会复制为多份，并且可能不在运行于同一节点上
  - 它们没有自己的持久状态
- 单个节点（VM 或者物理机）关机
  - 结果
    - 此节点上的所有 Pod 都停止运行
- 网络分裂
  - 结果
    - 分区 A 认为分区 B 中所有的节点都已宕机；分区 B 认为 API 服务器宕机
      （假定主控节点所在的 VM 位于分区 A 内)。
<!--
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
- kubelet 软件故障
  - 结果
    - 崩溃的 kubelet 就不能在其所在的节点上启动新的 Pod
    - kubelet 可能删掉 Pod 或者不删
    - 节点被标识为非健康态
    - 副本控制器会在其它的节点上启动新的 Pod
- 集群操作错误
  - 结果
    - 丢失 Pod 或服务等等
    - 丢失 API 服务器的后端存储
    - 用户无法读取API
    - 等等

<!--
### Mitigations:

- Action: Use IaaS provider's automatic VM restarting feature for IaaS VMs
  - Mitigates: Apiserver VM shutdown or apiserver crashing
  - Mitigates: Supporting services VM shutdown or crashes

- Action: Use IaaS providers reliable storage (e.g. GCE PD or AWS EBS volume) for VMs with apiserver+etcd
  - Mitigates: Apiserver backing storage lost

- Action: Use [high-availability](/docs/setup/production-environment/tools/kubeadm/high-availability/) configuration
  - Mitigates: Control plane node shutdown or control plane components (scheduler, API server, controller-manager) crashing
    - Will tolerate one or more simultaneous node or component failures
  - Mitigates: API server backing storage (i.e., etcd's data directory) lost
    - Assumes HA (highly-available) etcd configuration
-->
### 缓解措施：

- 措施：对于 IaaS 上的 VMs，使用 IaaS 的自动 VM 重启功能
  - 缓解：API 服务器 VM 关机或 API 服务器崩溃
  - 缓解：Kubernetes 服务组件所在的 VM 关机或崩溃

- 措施: 对于运行 API 服务器和 etcd 的 VM，使用 IaaS 提供的可靠的存储（例如 GCE PD 或者 AWS EBS 卷）
  - 缓解：API 服务器后端存储的丢失

- 措施：使用[高可用性](/zh/docs/setup/production-environment/tools/kubeadm/high-availability/)的配置
  - 缓解：主控节点 VM 关机或者主控节点组件（调度器、API 服务器、控制器管理器）崩馈
    - 将容许一个或多个节点或组件同时出现故障
  - 缓解：API 服务器后端存储（例如 etcd 的数据目录）丢失
    - 假定你使用了高可用的 etcd 配置

<!--
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
-->
- 措施：定期对 API 服务器的 PDs/EBS 卷执行快照操作
  - 缓解：API 服务器后端存储丢失
  - 缓解：一些操作错误的场景
  - 缓解：一些 Kubernetes 软件本身故障的场景

- 措施：在 Pod 的前面使用副本控制器或服务
  - 缓解：节点关机
  - 缓解：kubelet 软件故障

- 措施：应用（容器）设计成容许异常重启
  - 缓解：节点关机
  - 缓解：kubelet 软件故障

