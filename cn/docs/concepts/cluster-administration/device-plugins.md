---
approvers:
title: 设备插件
description: 使用 Kubernetes 设备插件框架来为 GPUs、 NICs、 FPGAs、 InfiniBand 和其他类似的需要供应商特别设置的资源开发插件。
---

{% include feature-state-alpha.md %}

{% capture overview %}
从1.8版本开始，Kubernetes 提供了一套
[设备插件框架](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/resource-management/device-plugin.md)，
使得供应商能够在不改动 Kubernetes 核心代码的情况下，向 kubelet 发布它们的资源。
供应商可以实现一个手动或以 DaemonSet 形式部署的插件，而不是编写自定义的 Kubernetes 代码。
插件的目标设备包括 GPUs、 高性能 NICs、 FPGAs、 InfiniBand
和其他类似的可能需要供应商特定的初始化和设置的计算资源。
{% endcapture %}

{% capture body %}

## 设备插件注册

设备插件功能通过 `DevicePlugins` 功能入口控制， 该功能默认是禁用的。
当设备插件功能被启用时，kubelet 会对外提供一个 `Registration` gRPC 服务：

```gRPC
service Registration {
	rpc Register(RegisterRequest) returns (Empty) {}
}
```
设备插件通过该 gRPC 服务将自身注册到 kubelet 。
注册过程中，设备插件需要发送:

  * 它的 Unix 套接字名称。
  * 所基于的设备插件 API 版本。
  * 希望发布的 `ResourceName` 。 这里的 `ResourceName` 需要符合
    [扩展资源命名方案](https://github.com/kubernetes/kubernetes/pull/48922)，
    形如 `vendor-domain/resource` 。
    例如，Nvidia GPU 资源被发布为 `nvidia.com/gpu` 。

注册成功后，设备插件将其管理的设备列表发送至 kubelet ，然后 kubelet 负责将这些资源作为 kubelet 节点状态更新的一部分，通知 apiserver 。
例如， 设备插件注册 `vendor-domain/foo` 到 kubelet ，
并上报了节点上的两个健康的设备后，节点状态将更新， 发布2个 `vendor-domain/foo` 。

然后，开发者可以在 [容器](/docs/api-reference/{{page.version}}/#container-v1-core)
规格中通过使用与
[不透明整数型资源](/docs/tasks/configure-pod-container/opaque-integer-resource/)
中同样的流程来请求使用设备。
在1.8版本中， 扩展资源仅支持整型的资源，且容器规格中声明的 `limit` 与 `request` 必须相等。

## 设备插件实现

设备插件的工作流程一般包括以下步骤:

* 初始化。 在这个阶段，设备插件执行供应商特定的初始化和设置，以确保设备处于就绪状态。

* 插件通过主机路径 `/var/lib/kubelet/device-plugins/` 下的一个 Unix 套接字启动 gRPC 服务，该服务实现了以下接口：

  ```gRPC
  service DevicePlugin {
        // ListAndWatch returns a stream of List of Devices
        // Whenever a Device state change or a Device disappears, ListAndWatch
        // returns the new list
        rpc ListAndWatch(Empty) returns (stream ListAndWatchResponse) {}

        // Allocate is called during container creation so that the Device
        // Plugin can run device specific operations and instruct Kubelet
        // of the steps to make the Device available in the container
        rpc Allocate(AllocateRequest) returns (AllocateResponse) {}
  }
  ```

* 插件通过主机路径 `/var/lib/kubelet/device-plugins/kubelet.sock` 下的 Unix 套接字将自身注册到 kubelet 。

* 注册成功之后，设备插件以服务模式运行，其间持续监测设备健康状态，并在任何设备状态变化时上报到 kubelet 。
插件也负责服务 `Allocate` gRPC 请求。 在 `Allocate` 过程中，插件可能会做设备特定的准备动作； 如 GPU 清理 或 QRNG 初始化。
如操作成功，设备插件会返回一个 `AllocateResponse` ，它包含了用于访问分配的设备的容器运行时配置信息。 kubelet 将该信息传递到容器运行时。

我们期望设备插件能够监测到 kubelet 重启，并将自身重新注册到新的 kubelet 实例中。 在1.8版本中，新的 kubelet 实例启动时，会清理当前 `/var/lib/kubelet/device-plugins` 路径下已存在的 Unix 套接字。 通过这一事件，设备插件能够监测到其 Unix 套接字被删除，并重新对自身进行注册。

## 设备插件部署

设备插件可以手动部署，也可以作为 DaemonSet 进行部署。 以 DaemonSet 形式部署的好处是设备插件故障时，
Kubernetes能够重新启动 Pods 。 否则就需要额外的设备插件故障恢复机制。
目录 `/var/lib/kubelet/device-plugins` 需要访问特权，
所以设备插件必须在特权的安全上下文环境下运行。
如果设备插件以 DaemonSet 形式运行， `/var/lib/kubelet/device-plugins`
目录必须在插件的 [PodSpec](/docs/api-reference/{{page.version}}/#podspec-v1-core) 中以 [Volume](/docs/api-reference/{{page.version}}/#volume-v1-core) 的形式挂载。

## 示例

设备插件实现的示例，参考
[基于 COS 操作系统的 nvidia GPU 设备插件](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu)。

{% endcapture %}

{% include templates/concept.md %}
