---
layout: blog
title: 'Kubernetes 1.28：节点 podresources API 正式发布'
date: 2023-08-23
slug: kubelet-podresources-api-GA
---
<!--
layout: blog
title: 'Kubernetes 1.28: Node podresources API Graduates to GA'
date: 2023-08-23
slug: kubelet-podresources-api-GA
-->

<!--
**Author:**
Francesco Romani (Red Hat)
-->
**作者**：Francesco Romani (Red Hat)

**译者**：Wilson Wu (DaoCloud)

<!--
The podresources API is an API served by the kubelet locally on the node, which exposes the compute resources exclusively allocated to containers. With the release of Kubernetes 1.28, that API is now Generally Available.
-->
podresources API 是由 kubelet 提供的节点本地 API，它用于公开专门分配给容器的计算资源。
随着 Kubernetes 1.28 的发布，该 API 现已正式发布。

<!--
## What problem does it solve?
-->
## 它解决了什么问题？ {#what-problem-does-it-solve}

<!--
The kubelet can allocate exclusive resources to containers, like [CPUs, granting exclusive access to full cores](https://kubernetes.io/docs/tasks/administer-cluster/cpu-management-policies/) or [memory, either regions or hugepages](https://kubernetes.io/docs/tasks/administer-cluster/memory-manager/). Workloads which require high performance, or low latency (or both) leverage these features. The kubelet also can assign [devices to containers](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/). Collectively, these features which enable exclusive assignments are known as "resource managers".
-->
kubelet 可以向容器分配独占资源，例如
[CPU，授予对完整核心的独占访问权限](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/)或[内存，包括内存区域或巨页](/zh-cn/docs/tasks/administer-cluster/memory-manager/)。
需要高性能或低延迟（或者两者都需要）的工作负载可以利用这些特性。
kubelet 还可以将[设备分配给容器](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)。
总的来说，这些支持独占分配的特性被称为“资源管理器（Resource Managers）”。

<!--
Without an API like podresources, the only possible option to learn about resource assignment was to read the state files the resource managers use. While done out of necessity, the problem with this approach is the path and the format of these file are both internal implementation details. Albeit very stable, the project reserves the right to change them freely. Consuming the content of the state files is thus fragile and unsupported, and projects doing this are recommended to consider moving to podresources API or to other supported APIs.
-->
如果没有像 podresources 这样的 API，了解资源分配的唯一可能选择就是读取资源管理器使用的状态文件。
虽然这样做是出于必要，但这种方法的问题是这些文件的路径和格式都是内部实现细节。
尽管非常稳定，但项目保留自由更改它们的权利。因此，使用状态文件内容的做法是不可靠的且不受支持的，
建议这样做的项目考虑迁移到使用 podresources API 或其他受支持的 API。

<!--
## Overview of the API
-->
## API 概述 {#overview-of-the-api}

<!--
The podresources API was [initially proposed to enable device monitoring](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources). In order to enable monitoring agents, a key prerequisite is to enable introspection of device assignment, which is performed by the kubelet. Serving this purpose was the initial goal of the API. The first iteration of the API only had a single function implemented, `List`, to return information about the assignment of devices to containers. The API is used by [multus CNI](https://github.com/k8snetworkplumbingwg/multus-cni) and by [GPU monitoring tools](https://github.com/NVIDIA/dcgm-exporter).
-->
podresources API [最初被提出是为了实现设备监控](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources)。
为了支持监控代理，一个关键的先决条件是启用由 kubelet 执行的设备分配自省（Introspection）。
API 的最初目标就是服务于此目的。API 的第一次迭代仅实现了一个函数 `List`，用于返回有关设备分配给容器的信息。
该 API 由 [multus CNI](https://github.com/k8snetworkplumbingwg/multus-cni)
和 [GPU 监控工具](https://github.com/NVIDIA/dcgm-exporter)使用。

<!--
Since its inception, the podresources API increased its scope to cover other resource managers than device manager. Starting from Kubernetes 1.20, the `List` API reports also CPU cores and memory regions (including hugepages); the API also reports the NUMA locality of the devices, while the locality of CPUs and memory can be inferred from the system.
-->
自推出以来，podresources API 扩大了其范围，涵盖了设备管理器之外的其他资源管理器。
从 Kubernetes 1.20 开始，`List` API 还报告 CPU 核心和内存区域（包括巨页）；
在能够从系统中推断 CPU 和内存的位置时，API 还报告设备的 NUMA 位置。

<!--
In Kubernetes 1.21, the API [gained](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2403-pod-resources-allocatable-resources/README.md) the `GetAllocatableResources` function. This newer API complements the existing `List` API and enables monitoring agents to determine the unallocated resources, thus enabling new features built on top of the podresources API like a [NUMA-aware scheduler plugin](https://github.com/kubernetes-sigs/scheduler-plugins/blob/master/pkg/noderesourcetopology/README.md).
-->
在 Kubernetes 1.21 中，API [增加了](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2403-pod-resources-allocatable-resources/README.md)
`GetAllocatableResources` 函数。这个较新的 API 补充了现有的 `List` API，
并使监控代理能够辨识尚未分配的资源，从而支持在 podresources API 之上构建新的特性，
例如 [NUMA 感知的调度器插件](https://github.com/kubernetes-sigs/scheduler-plugins/blob/master/pkg/noderesourcetopology/README.md)。

<!--
Finally, in Kubernetes 1.27, another function, `Get` was introduced to be more friendly with CNI meta-plugins, to make it simpler to access resources allocated to a specific pod, rather than having to filter through resources for all pods on the node. The `Get` function is currently alpha level.
-->
最后，在 Kubernetes 1.27 中，引入了另一个函数 `Get`，以便对 CNI 元插件（Meta-Plugins）更加友好，
简化对已分配给特定 Pod 的资源的访问，而不必过滤节点上所有 Pod 的资源。`Get` 函数目前处于 Alpha 级别。

<!--
## Consuming the API
-->
## 使用 API {#consuming-the-api}

<!--
The podresources API is served by the kubelet locally, on the same node on which is running. On unix flavors, the endpoint is served over a unix domain socket; the default path is `/var/lib/kubelet/pod-resources/kubelet.sock`. On windows, the endpoint is served over a named pipe; the default path is `npipe://\\.\pipe\kubelet-pod-resources`.
-->
podresources API 由本地 kubelet 提供，位于 kubelet 运行所在的同一节点上。
在 Unix 风格的系统上，通过 Unix 域套接字提供端点；默认路径是 `/var/lib/kubelet/pod-resources/kubelet.sock`。
在 Windows 上，通过命名管道提供端点；默认路径是 `npipe://\\.\pipe\kubelet-pod-resources`。

<!--
In order for the containerized monitoring application consume the API, the socket should be mounted inside the container. A good practice is to mount the directory on which the podresources socket endpoint sits rather than the socket directly. This will ensure that after a kubelet restart, the containerized monitor application will be able to re-connect to the socket.
-->
为了让容器化监控应用使用 API，套接字应挂载到容器内。
一个好的做法是挂载 podresources 套接字端点所在的目录，而不是直接挂载套接字。
这种做法将确保 kubelet 重新启动后，容器化监视器应用能够重新连接到套接字。

<!--
An example manifest for a hypothetical monitoring agent consuming the podresources API and deployed as a DaemonSet could look like:
-->
在下面的 DaemonSet 示例清单中，包含一个假想的使用 podresources API 的监控代理：

<!--
```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: podresources-monitoring-app
  namespace: monitoring
spec:
  selector:
    matchLabels:
      name: podresources-monitoring
  template:
    metadata:
      labels:
        name: podresources-monitoring
    spec:
      containers:
      - args:
        - --podresources-socket=unix:///host-podresources/kubelet.sock
        command:
        - /bin/podresources-monitor
        image: podresources-monitor:latest  # just for an example
        volumeMounts:
        - mountPath: /host-podresources
          name: host-podresources
      serviceAccountName: podresources-monitor
      volumes:
      - hostPath:
          path: /var/lib/kubelet/pod-resources
          type: Directory
        name: host-podresources
```
-->
```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: podresources-monitoring-app
  namespace: monitoring
spec:
  selector:
    matchLabels:
      name: podresources-monitoring
  template:
    metadata:
      labels:
        name: podresources-monitoring
    spec:
      containers:
      - args:
        - --podresources-socket=unix:///host-podresources/kubelet.sock
        command:
        - /bin/podresources-monitor
        image: podresources-monitor:latest  # 仅作为样例
        volumeMounts:
        - mountPath: /host-podresources
          name: host-podresources
      serviceAccountName: podresources-monitor
      volumes:
      - hostPath:
          path: /var/lib/kubelet/pod-resources
          type: Directory
        name: host-podresources
```

<!--
I hope you find it straightforward to consume the podresources API  programmatically. The kubelet API package provides the protocol file and the go type definitions; however, a client package is not yet available from the project, and the existing code should not be used directly. The [recommended](https://github.com/kubernetes/kubernetes/blob/v1.28.0-rc.0/pkg/kubelet/apis/podresources/client.go#L32) approach is to reimplement the client in your projects, copying and pasting the related functions like for example the multus project is [doing](https://github.com/k8snetworkplumbingwg/multus-cni/blob/v4.0.2/pkg/kubeletclient/kubeletclient.go).
-->
我希望你发现以编程方式使用 podresources API 很简单。kubelet API包提供了协议文件和 Go 类型定义；
但是，该项目尚未提供客户端包，并且你也不应直接使用现有代码。
[推荐](https://github.com/kubernetes/kubernetes/blob/v1.28.0-rc.0/pkg/kubelet/apis/podresources/client.go#L32)方法是在你自己的项目中重新实现客户端，
复制并粘贴相关功能，就像 multus 项目[所做的那样](https://github.com/k8snetworkplumbingwg/multus-cni/blob/v4.0.2/pkg/kubeletclient/kubeletclient.go)。

<!--
When operating the containerized monitoring application consuming the podresources API, few points are worth highlighting to prevent "gotcha" moments:
-->
在操作使用 podresources API 的容器化监控应用程序时，有几点值得强调，以防止出现“陷阱”：

<!--
- Even though the API only exposes data, and doesn't allow by design clients to mutate the kubelet state, the gRPC request/response model requires read-write access to the podresources API socket. In other words, it is not possible to limit the container mount to `ReadOnly`.
- Multiple clients are allowed to connect to the podresources socket and consume the API, since it is stateless.
- The kubelet has [built-in rate limits](https://github.com/kubernetes/kubernetes/pull/116459) to mitigate local Denial of Service attacks from misbehaving or malicious consumers. The consumers of the API must tolerate rate limit errors returned by the server. The rate limit is currently hardcoded and global, so misbehaving clients can consume all the quota and potentially starve correctly behaving clients.
-->
- 尽管 API 仅公开数据，并且设计上不允许客户端改变 kubelet 状态，
  但 gRPC 请求/响应模型要求能对 podresources API 套接字进行读写访问。
  换句话说，将容器挂载限制为 `ReadOnly` 是不可能的。
- 让多个客户端连接到 podresources 套接字并使用此 API 是允许的，因为 API 是无状态的。
- kubelet 具有[内置限速机制](https://github.com/kubernetes/kubernetes/pull/116459)，
  用以缓解来自行为不当或恶意用户的本地拒绝服务攻击。API 的使用者必须容忍服务器返回的速率限制错误。
  速率限制目前是硬编码的且作用于全局的，因此行为不当的客户端可能会耗光所有配额，进而导致行为正确的客户端挨饿。

<!--
## Future enhancements
-->
## 未来的增强 {#future-enhancements}

<!--
For historical reasons, the podresources API has a less precise specification than typical kubernetes APIs (such as the Kubernetes HTTP API, or the container runtime interface). This leads to unspecified behavior in corner cases. An [effort](https://issues.k8s.io/119423) is ongoing to rectify this state and to have a more precise specification.
-->
由于历史原因，podresources API 的规范不如典型的 kubernetes API（例如 Kubernetes HTTP API 或容器运行时接口）精确。
这会导致在极端情况下出现未指定的行为。我们正在[努力](https://issues.k8s.io/119423)纠正这种状态并制定更精确的规范。

<!--
The [Dynamic Resource Allocation (DRA)](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/3063-dynamic-resource-allocation) infrastructure is a major overhaul of the resource management. The [integration](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/3695-pod-resources-for-dra) with the podresources API is already ongoing.
-->
[动态资源分配（DRA）](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/3063-dynamic-resource-allocation)基础设施是对资源管理的重大改革。
与 podresources API 的[集成](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/3695-pod-resources-for-dra)已经在进行中。

<!--
An [effort](https://issues.k8s.io/119817) is ongoing to recommend or create a reference client package ready to be consumed.
-->
我们正在[努力](https://issues.k8s.io/119817)推荐或创建可供使用的参考客户端包。

<!--
## Getting involved
-->
## 参与其中 {#getting-involved}

<!--
This feature is driven by [SIG Node](https://github.com/Kubernetes/community/blob/master/sig-node/README.md). Please join us to connect with the community and share your ideas and feedback around the above feature and beyond. We look forward to hearing from you!
-->
此功能由 [SIG Node](https://github.com/Kubernetes/community/blob/master/sig-node/README.md) 驱动。
请加入我们，与社区建立联系，并分享你对上述功能及其他功能的想法和反馈。我们期待你的回音！
