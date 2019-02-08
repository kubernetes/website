---
title: 集群故障排查
---

本篇文档是介绍集群故障排查的；我们假设对于你碰到的问题，你已经排除了是由应用程序造成的。  
对于应用的调试，请参阅[应用故障排查指南](/cn/docs/tasks/debug-application-cluster/debug-application)。
你也可以访问[troubleshooting document](/docs/troubleshooting/)来获取更多的信息。

## 显示出集群的节点列表

调试的第一步是查看所有的节点是否都正确的注册。

运行

```shell
kubectl get nodes
```

接下来，验证你的所有节点都能够显示出来，并且都处于`Ready`状态。

## 查看logs

现在，挖掘出集群更深层的信息就需要登录到相关的机器上。下面是相关log文件所在的位置。  
(注意，对于基于systemd的系统，你可能需要使用`journalctl`)


### Master

   * /var/log/kube-apiserver.log - API Server, 提供API服务
   * /var/log/kube-scheduler.log - Scheduler, 负责调度决策
   * /var/log/kube-controller-manager.log - 管理replication controllers的控制器

### Worker Nodes

   * /var/log/kubelet.log - Kubelet, 管控节点上运行的容器
   * /var/log/kube-proxy.log - Kube Proxy, 负责服务的负载均衡

## 集群故障模式的概述

下面是一个不完整的列表，列举了一些可能出错的场景，以及通过调整集群配置来解决相关问题的方法。

根本原因：

  - VM(s)关机
  - 集群之间，或者集群和用户之间网络分裂
  - Kubernetes软件本身崩溃了
  - 数据丢失或者持久化存储不可用(如:GCE PD 或 AWS EBS卷)
  - 操作错误，如：Kubernetes或者应用程序配置错误

具体情况:

  - Apiserver所在的VM关机或者apiserver崩溃
    - 结果
      - 不能停止，更新，或者启动新的pods，services，replication controller
      - 现有的pods和services在不依赖Kubernetes API的情况下应该能继续正常工作
  - Apiserver 后端存储丢失
    - 结果
      - apiserver应该不能起来
      - kubelets将不能访问它，但是能够继续运行之前的Pods和提供相同的服务代理
      - 在apiserver重启之前，需要手动恢复或者重创apiserver的状态
	    
  - Kubernetes服务组件(节点控制器，副本控制器，调度器等等)所在的VM关机或者崩溃
    - 当前，这些控制器是和apiserver共存的，它们不可用的现象是与apiserver类似的
    - 将来，这些控制器也会复制为多份，并且可能为非共存的
    - 它们没有自己的持久状态
  - 单个节点(VM或者物理机)关机
    - 结果
      - 此节点上的所有Pods都停止运行
  - 网络分裂(Network partition)
    - 结果
      - partition A认为partition B中所有的节点都down掉了；partition B认为apiserver是down掉了(假定master所在的VM位于partition A内)。
  - Kubelet软件故障
    - 结果
      - 崩溃的kubelet就不能在其所在的节点上启动新的pods
      - kubelet可能删掉pods或者不删
      - 节点被标识为非健康态
      - 副本控制器会在其它的节点上启动新的pods
  - 集群操作错误
    - 结果
      - 丢失pods，服务等等
      - 丢失apiserver后端存储
      - 用户无法读取API
      - 等等

缓解措施:

- 措施：对于IaaS上的VMs，使用IaaS的自动VM重启功能
  - 缓解：Apiserver VM关机或apiserver崩溃
  - 缓解：Kubernetes服务组件所在的VM关机或崩溃

- 措施: 对于具有apiserver+etcd的VM，使用IaaS提供的可靠的存储（例如GCE PD或者AWS EBS卷）
  - 缓解：Apiserver后端存储的丢失

- 措施：使用（实验）[高可用性](/docs/admin/high-availability)的配置
  - 缓解：master VM关机或者master组件(scheduler, API server, controller-managing)崩馈
    - 将容许一个或多个节点或组件同时出现故障
  - 缓解：apiserver后端存储(例如etcd的数据目录)丢失
    - 假定你使用了集群化的etcd。

- 措施：定期的对apiserver的PDs/EBS卷进行快照
  - 缓解：apiserver后端存储丢失
  - 缓解：一些操作错误的场景
  - 缓解：一些Kubernetes软件本身故障的场景

- 措施：在pods的前面使用副本控制器或服务
  - 缓解：节点关机
  - 缓解：Kubelet软件故障

- 措施：应用（容器）设计成容许异常重启
  - 缓解：节点关机
  - 缓解：Kubelet软件故障

- 措施：[多个独立的集群](/docs/admin/multi-cluster)(并且避免一次性地对所有的集群进行有风险性的修改)
  - 缓解：以上列出的所有情况
