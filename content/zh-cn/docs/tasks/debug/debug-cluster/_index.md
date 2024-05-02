---
title: 集群故障排查
description: 调试常见的集群问题。
weight: 20
no_list: true
---
<!--
reviewers:
- davidopp
title: "Troubleshooting Clusters"
description: Debugging common cluster issues.
weight: 20
no_list: true
-->

<!-- overview -->

<!--
This doc is about cluster troubleshooting; we assume you have already ruled out your application as the root cause of the
problem you are experiencing. See
the [application troubleshooting guide](/docs/tasks/debug/debug-application/) for tips on application debugging.
You may also visit the [troubleshooting overview document](/docs/tasks/debug/) for more information.
-->
本篇文档是介绍集群故障排查的；我们假设对于你碰到的问题，你已经排除了是由应用程序造成的。
对于应用的调试，请参阅[应用故障排查指南](/zh-cn/docs/tasks/debug/debug-application/)。
你也可以访问[故障排查](/zh-cn/docs/tasks/debug/)来获取更多的信息。

<!--
For troubleshooting {{<glossary_tooltip text="kubectl" term_id="kubectl">}}, refer to
[Troubleshooting kubectl](/docs/tasks/debug/debug-cluster/troubleshoot-kubectl/).
-->
有关 {{<glossary_tooltip text="kubectl" term_id="kubectl">}} 的故障排查，
请参阅 [kubectl 故障排查](/zh-cn/docs/tasks/debug/debug-cluster/troubleshoot-kubectl/)。

<!-- body -->

<!--
## Listing your cluster

The first thing to debug in your cluster is if your nodes are all registered correctly.

Run the following command:
-->
## 列举集群节点 {#listing-your-cluster}

调试的第一步是查看所有的节点是否都已正确注册。

运行以下命令：

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
### Example: debugging a down/unreachable node

Sometimes when debugging it can be useful to look at the status of a node -- for example, because
you've noticed strange behavior of a Pod that's running on the node, or to find out why a Pod
won't schedule onto the node. As with Pods, you can use `kubectl describe node` and `kubectl get
node -o yaml` to retrieve detailed information about nodes. For example, here's what you'll see if
a node is down (disconnected from the network, or kubelet dies and won't restart, etc.). Notice
the events that show the node is NotReady, and also notice that the pods are no longer running
(they are evicted after five minutes of NotReady status).
-->
### 示例：调试关闭/无法访问的节点 {#example-debugging-a-down-unreachable-node}

有时在调试时查看节点的状态很有用 —— 例如，因为你注意到在节点上运行的 Pod 的奇怪行为，
或者找出为什么 Pod 不会调度到节点上。与 Pod 一样，你可以使用 `kubectl describe node`
和 `kubectl get node -o yaml` 来检索有关节点的详细信息。
例如，如果节点关闭（与网络断开连接，或者 kubelet 进程挂起并且不会重新启动等），
你将看到以下内容。请注意显示节点为 NotReady 的事件，并注意 Pod 不再运行（它们在 NotReady 状态五分钟后被驱逐）。

```shell
kubectl get nodes
```

```none
NAME                     STATUS       ROLES     AGE     VERSION
kube-worker-1            NotReady     <none>    1h      v1.23.3
kubernetes-node-bols     Ready        <none>    1h      v1.23.3
kubernetes-node-st6x     Ready        <none>    1h      v1.23.3
kubernetes-node-unaj     Ready        <none>    1h      v1.23.3
```

```shell
kubectl describe node kube-worker-1
```

```none
Name:               kube-worker-1
Roles:              <none>
Labels:             beta.kubernetes.io/arch=amd64
                    beta.kubernetes.io/os=linux
                    kubernetes.io/arch=amd64
                    kubernetes.io/hostname=kube-worker-1
                    kubernetes.io/os=linux
Annotations:        kubeadm.alpha.kubernetes.io/cri-socket: /run/containerd/containerd.sock
                    node.alpha.kubernetes.io/ttl: 0
                    volumes.kubernetes.io/controller-managed-attach-detach: true
CreationTimestamp:  Thu, 17 Feb 2022 16:46:30 -0500
Taints:             node.kubernetes.io/unreachable:NoExecute
                    node.kubernetes.io/unreachable:NoSchedule
Unschedulable:      false
Lease:
  HolderIdentity:  kube-worker-1
  AcquireTime:     <unset>
  RenewTime:       Thu, 17 Feb 2022 17:13:09 -0500
Conditions:
  Type                 Status    LastHeartbeatTime                 LastTransitionTime                Reason              Message
  ----                 ------    -----------------                 ------------------                ------              -------
  NetworkUnavailable   False     Thu, 17 Feb 2022 17:09:13 -0500   Thu, 17 Feb 2022 17:09:13 -0500   WeaveIsUp           Weave pod has set this
  MemoryPressure       Unknown   Thu, 17 Feb 2022 17:12:40 -0500   Thu, 17 Feb 2022 17:13:52 -0500   NodeStatusUnknown   Kubelet stopped posting node status.
  DiskPressure         Unknown   Thu, 17 Feb 2022 17:12:40 -0500   Thu, 17 Feb 2022 17:13:52 -0500   NodeStatusUnknown   Kubelet stopped posting node status.
  PIDPressure          Unknown   Thu, 17 Feb 2022 17:12:40 -0500   Thu, 17 Feb 2022 17:13:52 -0500   NodeStatusUnknown   Kubelet stopped posting node status.
  Ready                Unknown   Thu, 17 Feb 2022 17:12:40 -0500   Thu, 17 Feb 2022 17:13:52 -0500   NodeStatusUnknown   Kubelet stopped posting node status.
Addresses:
  InternalIP:  192.168.0.113
  Hostname:    kube-worker-1
Capacity:
  cpu:                2
  ephemeral-storage:  15372232Ki
  hugepages-2Mi:      0
  memory:             2025188Ki
  pods:               110
Allocatable:
  cpu:                2
  ephemeral-storage:  14167048988
  hugepages-2Mi:      0
  memory:             1922788Ki
  pods:               110
System Info:
  Machine ID:                 9384e2927f544209b5d7b67474bbf92b
  System UUID:                aa829ca9-73d7-064d-9019-df07404ad448
  Boot ID:                    5a295a03-aaca-4340-af20-1327fa5dab5c
  Kernel Version:             5.13.0-28-generic
  OS Image:                   Ubuntu 21.10
  Operating System:           linux
  Architecture:               amd64
  Container Runtime Version:  containerd://1.5.9
  Kubelet Version:            v1.23.3
  Kube-Proxy Version:         v1.23.3
Non-terminated Pods:          (4 in total)
  Namespace                   Name                                 CPU Requests  CPU Limits  Memory Requests  Memory Limits  Age
  ---------                   ----                                 ------------  ----------  ---------------  -------------  ---
  default                     nginx-deployment-67d4bdd6f5-cx2nz    500m (25%)    500m (25%)  128Mi (6%)       128Mi (6%)     23m
  default                     nginx-deployment-67d4bdd6f5-w6kd7    500m (25%)    500m (25%)  128Mi (6%)       128Mi (6%)     23m
  kube-system                 kube-proxy-dnxbz                     0 (0%)        0 (0%)      0 (0%)           0 (0%)         28m
  kube-system                 weave-net-gjxxp                      100m (5%)     0 (0%)      200Mi (10%)      0 (0%)         28m
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  Resource           Requests     Limits
  --------           --------     ------
  cpu                1100m (55%)  1 (50%)
  memory             456Mi (24%)  256Mi (13%)
  ephemeral-storage  0 (0%)       0 (0%)
  hugepages-2Mi      0 (0%)       0 (0%)
Events:
...
```

```shell
kubectl get node kube-worker-1 -o yaml
```

```yaml
apiVersion: v1
kind: Node
metadata:
  annotations:
    kubeadm.alpha.kubernetes.io/cri-socket: /run/containerd/containerd.sock
    node.alpha.kubernetes.io/ttl: "0"
    volumes.kubernetes.io/controller-managed-attach-detach: "true"
  creationTimestamp: "2022-02-17T21:46:30Z"
  labels:
    beta.kubernetes.io/arch: amd64
    beta.kubernetes.io/os: linux
    kubernetes.io/arch: amd64
    kubernetes.io/hostname: kube-worker-1
    kubernetes.io/os: linux
  name: kube-worker-1
  resourceVersion: "4026"
  uid: 98efe7cb-2978-4a0b-842a-1a7bf12c05f8
spec: {}
status:
  addresses:
  - address: 192.168.0.113
    type: InternalIP
  - address: kube-worker-1
    type: Hostname
  allocatable:
    cpu: "2"
    ephemeral-storage: "14167048988"
    hugepages-2Mi: "0"
    memory: 1922788Ki
    pods: "110"
  capacity:
    cpu: "2"
    ephemeral-storage: 15372232Ki
    hugepages-2Mi: "0"
    memory: 2025188Ki
    pods: "110"
  conditions:
  - lastHeartbeatTime: "2022-02-17T22:20:32Z"
    lastTransitionTime: "2022-02-17T22:20:32Z"
    message: Weave pod has set this
    reason: WeaveIsUp
    status: "False"
    type: NetworkUnavailable
  - lastHeartbeatTime: "2022-02-17T22:20:15Z"
    lastTransitionTime: "2022-02-17T22:13:25Z"
    message: kubelet has sufficient memory available
    reason: KubeletHasSufficientMemory
    status: "False"
    type: MemoryPressure
  - lastHeartbeatTime: "2022-02-17T22:20:15Z"
    lastTransitionTime: "2022-02-17T22:13:25Z"
    message: kubelet has no disk pressure
    reason: KubeletHasNoDiskPressure
    status: "False"
    type: DiskPressure
  - lastHeartbeatTime: "2022-02-17T22:20:15Z"
    lastTransitionTime: "2022-02-17T22:13:25Z"
    message: kubelet has sufficient PID available
    reason: KubeletHasSufficientPID
    status: "False"
    type: PIDPressure
  - lastHeartbeatTime: "2022-02-17T22:20:15Z"
    lastTransitionTime: "2022-02-17T22:15:15Z"
    message: kubelet is posting ready status.
    reason: KubeletReady
    status: "True"
    type: Ready
  daemonEndpoints:
    kubeletEndpoint:
      Port: 10250
  nodeInfo:
    architecture: amd64
    bootID: 22333234-7a6b-44d4-9ce1-67e31dc7e369
    containerRuntimeVersion: containerd://1.5.9
    kernelVersion: 5.13.0-28-generic
    kubeProxyVersion: v1.23.3
    kubeletVersion: v1.23.3
    machineID: 9384e2927f544209b5d7b67474bbf92b
    operatingSystem: linux
    osImage: Ubuntu 21.10
    systemUUID: aa829ca9-73d7-064d-9019-df07404ad448
```

<!--
## Looking at logs

For now, digging deeper into the cluster requires logging into the relevant machines.  Here are the locations
of the relevant log files.  On systemd-based systems, you may need to use `journalctl` instead of examining log files.
-->
## 查看日志 {#looking-at-logs}

目前，深入挖掘集群需要登录相关机器。以下是相关日志文件的位置。
在基于 systemd 的系统上，你可能需要使用 `journalctl` 而不是检查日志文件。

<!--
### Control Plane nodes

* `/var/log/kube-apiserver.log` - API Server, responsible for serving the API
* `/var/log/kube-scheduler.log` - Scheduler, responsible for making scheduling decisions
* `/var/log/kube-controller-manager.log` - a component that runs most Kubernetes built-in
  {{<glossary_tooltip text="controllers" term_id="controller">}}, with the notable exception of scheduling
  (the kube-scheduler handles scheduling).
-->
### 控制平面节点 {#control-plane-nodes}

* `/var/log/kube-apiserver.log` —— API 服务器，负责提供 API 服务
* `/var/log/kube-scheduler.log` —— 调度器，负责制定调度决策
* `/var/log/kube-controller-manager.log` —— 运行大多数 Kubernetes
  内置{{<glossary_tooltip text="控制器" term_id="controller">}}的组件，除了调度（kube-scheduler 处理调度）。

<!--
### Worker Nodes

* `/var/log/kubelet.log` - logs from the kubelet, responsible for running containers on the node
* `/var/log/kube-proxy.log` - logs from `kube-proxy`, which is responsible for directing traffic to Service endpoints
-->
### 工作节点 {#worker-nodes}

* `/var/log/kubelet.log` —— 负责在节点运行容器的 `kubelet` 所产生的日志
* `/var/log/kube-proxy.log` —— 负责将流量转发到服务端点的 `kube-proxy` 所产生的日志

<!-- 
## Cluster failure modes

This is an incomplete list of things that could go wrong, and how to adjust your cluster setup to mitigate the problems.
-->
## 集群故障模式 {#cluster-failure-modes}

这是可能出错的事情的不完整列表，以及如何调整集群设置以缓解问题。

<!-- 
### Contributing causes

- VM(s) shutdown
- Network partition within cluster, or between cluster and users
- Crashes in Kubernetes software
- Data loss or unavailability of persistent storage (e.g. GCE PD or AWS EBS volume)
- Operator error, for example, misconfigured Kubernetes software or application software
-->
### 故障原因 {#contributing-causes}

- 虚拟机关闭
- 集群内或集群与用户之间的网络分区
- Kubernetes 软件崩溃
- 持久存储（例如 GCE PD 或 AWS EBS 卷）的数据丢失或不可用
- 操作员错误，例如配置错误的 Kubernetes 软件或应用程序软件

<!--
### Specific scenarios

- API server VM shutdown or apiserver crashing
  - Results
    - unable to stop, update, or start new pods, services, replication controller
    - existing pods and services should continue to work normally unless they depend on the Kubernetes API
- API server backing storage lost
  - Results
    - the kube-apiserver component fails to start successfully and become healthy
    - kubelets will not be able to reach it but will continue to run the same pods and provide the same service proxying
    - manual recovery or recreation of apiserver state necessary before apiserver is restarted
-->
### 具体情况 {#specific-scenarios}

- API 服务器所在的 VM 关机或者 API 服务器崩溃
  - 结果
    - 不能停止、更新或者启动新的 Pod、服务或副本控制器
    - 现有的 Pod 和服务在不依赖 Kubernetes API 的情况下应该能继续正常工作
- API 服务器的后端存储丢失
  - 结果
    - kube-apiserver 组件未能成功启动并变健康
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
    - partition A thinks the nodes in partition B are down; partition B thinks the apiserver is down.
      (Assuming the master VM ends up in partition A.)
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
      （假定主控节点所在的 VM 位于分区 A 内）。
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
    - 用户无法读取 API
    - 等等

<!--
### Mitigations

- Action: Use the IaaS provider's automatic VM restarting feature for IaaS VMs
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
### 缓解措施 {#mitigations}

- 措施：对于 IaaS 上的 VM，使用 IaaS 的自动 VM 重启功能
  - 缓解：API 服务器 VM 关机或 API 服务器崩溃
  - 缓解：Kubernetes 服务组件所在的 VM 关机或崩溃

- 措施: 对于运行 API 服务器和 etcd 的 VM，使用 IaaS 提供的可靠的存储（例如 GCE PD 或者 AWS EBS 卷）
  - 缓解：API 服务器后端存储的丢失

- 措施：使用[高可用性](/zh-cn/docs/setup/production-environment/tools/kubeadm/high-availability/)的配置
  - 缓解：主控节点 VM 关机或者主控节点组件（调度器、API 服务器、控制器管理器）崩溃
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
- 措施：定期对 API 服务器的 PD 或 EBS 卷执行快照操作
  - 缓解：API 服务器后端存储丢失
  - 缓解：一些操作错误的场景
  - 缓解：一些 Kubernetes 软件本身故障的场景

- 措施：在 Pod 的前面使用副本控制器或服务
  - 缓解：节点关机
  - 缓解：kubelet 软件故障

- 措施：应用（容器）设计成容许异常重启
  - 缓解：节点关机
  - 缓解：kubelet 软件故障

## {{% heading "whatsnext" %}}

<!-- 
* Learn about the metrics available in the
  [Resource Metrics Pipeline](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/)
* Discover additional tools for
  [monitoring resource usage](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
* Use Node Problem Detector to
  [monitor node health](/docs/tasks/debug/debug-cluster/monitor-node-health/)
* Use `kubectl debug node` to [debug Kubernetes nodes](/docs/tasks/debug/debug-cluster/kubectl-node-debug) 
* Use `crictl` to [debug Kubernetes nodes](/docs/tasks/debug/debug-cluster/crictl/)
* Get more information about [Kubernetes auditing](/docs/tasks/debug/debug-cluster/audit/)
* Use `telepresence` to [develop and debug services locally](/docs/tasks/debug/debug-cluster/local-debugging/)
-->
* 了解[资源指标管道](/zh-cn/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/)中可用的指标
* 发现用于[监控资源使用](/zh-cn/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)的其他工具
* 使用节点问题检测器[监控节点健康](/zh-cn/docs/tasks/debug/debug-cluster/monitor-node-health/)
* 使用 `kubectl debug node` [调试 Kubernetes 节点](/zh-cn/docs/tasks/debug/debug-cluster/kubectl-node-debug)
* 使用 `crictl` 来[调试 Kubernetes 节点](/zh-cn/docs/tasks/debug/debug-cluster/crictl/)
* 获取更多关于 [Kubernetes 审计](/zh-cn/docs/tasks/debug/debug-cluster/audit/)的信息
* 使用 `telepresence` [本地开发和调试服务](/zh-cn/docs/tasks/debug/debug-cluster/local-debugging/)
