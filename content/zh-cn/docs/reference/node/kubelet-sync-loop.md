---
content_type: reference
title: Kubelet 同步循环
weight: 42
---
<!--
content_type: "reference"
title: Kubelet Sync Loop
weight: 42
-->

<!--
The [kubelet](/docs/reference/command-line-tools-reference/kubelet/) is the
primary "node agent" that creates and watches Pods on each node. The `kubelet`
runs a sync loop that periodically reconciles the desired state (a Pod spec)
with the actual state of the running containers.
-->
[kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/) 是每个节点上的主要
"节点代理"，负责创建和监视 Pod。`kubelet` 运行一个同步循环，周期性地将期望状态（Pod 规约）
与运行中容器的实际状态进行协调。

<!--
1.  _Sync Loop_: The Sync Loop queues work (aggregated from many sources) for
    the Pods assigned to its node (where `nodeName` matches the node). Over the
    course of each loop, subprocesses called pod workers will attempt to
    reconcile the desired state of these Pods against the current state of the
    running containers.
2.  _Sync Pod_: The majority of the `kubelet` logic is stored in a suite of
    functions within the `podSyncer` interface, including the `SyncPod` function
    and its variants (like `SyncTerminatingPod` and `SyncTerminatedPod`). During
    each Sync Loop, a relevant `podSyncer` function will be executed for each Pod
    in an attempt to drive its state on the node toward the desired state.
3.  _{{< glossary_tooltip term_id="cri" text="Container Runtime Interface" >}}
    (CRI)_: To actually run the containers, the `kubelet` uses the CRI to talk
    to a container runtime (like containerd or CRI-O). The `kubelet` acts as the
    client, instructing the runtime to create a "pod sandbox" and then
    create/start the individual containers defined in the Pod spec.
4.  _PLEG (Pod Lifecycle Event Generator)_: The `kubelet` needs to know when
    containers start, stop, or fail. It relies on a component called PLEG to
    periodically poll the runtime for the standard state of all containers. PLEG
    generates events that wake up the Sync Loop to update the Pod status.
-->
1.  **同步循环（Sync Loop）**：同步循环将分配给其节点（`nodeName` 与节点匹配）的
    Pod 的工作（从多个来源聚合）排入队列。在每次循环过程中，被称为 Pod 工作器（Pod Worker）
    的子进程会尝试将这些 Pod 的期望状态与运行中容器的当前状态进行协调。
2.  **同步 Pod（Sync Pod）**：`kubelet` 的大部分逻辑存储在 `podSyncer` 接口中的一组函数里，
    包括 `SyncPod` 函数及其变体（如 `SyncTerminatingPod` 和 `SyncTerminatedPod`）。
    在每次同步循环中，每个 Pod 都会执行一个相关的 `podSyncer` 函数，
    尝试将节点上的 Pod 状态驱动到期望状态。
3.  **{{< glossary_tooltip term_id="cri" text="容器运行时接口" >}}（CRI）**：
    要实际运行容器，`kubelet` 使用 CRI 与容器运行时（如 containerd 或 CRI-O）通信。
    `kubelet` 作为客户端，指示运行时创建 "Pod 沙箱"，然后按照 Pod 规约中的
    定义创建/启动各个容器。
4.  **PLEG（Pod 生命周期事件生成器）**：`kubelet` 需要知道容器何时启动、停止或失败。
    它依赖一个名为 PLEG 的组件，周期性地轮询运行时以获取所有容器的标准状态。
    PLEG 生成的事件会唤醒同步循环以更新 Pod 状态。

<!--
Because of this polling mechanism, the status seen in the API (like `kubectl get
pod`) might have a slight delay compared to the instant reality on the node.
-->
由于这种轮询机制，通过 API 看到的状态（如 `kubectl get pod`）
相比节点上的即时实际情况可能会有轻微延迟。
