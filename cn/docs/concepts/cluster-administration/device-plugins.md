---
approvers:
title: 设备插件
description: 通过 Kubernetes 的设备插件框架，能够实现如 GPU、NIC、FPGA、InfiniBand 等需要第三方特定设置的插件接入。
cn-approvers:
- tianshapjq
---
<!--
---
approvers:
title: Device Plugins
description: Use the Kubernetes device plugin framework to implement plugins for GPUs, NICs, FPGAs, InfiniBand, and similar resources that require vendor-specific setup.
---
-->

{% include feature-state-alpha.md %}

{% capture overview %}
<!--
Starting in version 1.8, Kubernetes provides a
[device plugin framework](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/resource-management/device-plugin.md)
for vendors to advertise their resources to the kubelet without changing Kubernetes core code.
Instead of writing custom Kubernetes code, vendors can implement a device plugin that can
be deployed manually or as a DaemonSet. The targeted devices include GPUs,
High-performance NICs, FPGAs, InfiniBand, and other similar computing resources
that may require vendor specific initialization and setup.
-->
从1.8版本开始，Kubernetes 提供一种 [设备插件框架](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/resource-management/device-plugin.md)，该框架能够让第三方设备资源开发者在不修改 Kubernetes 核心代码的前提下将设备接入 Kubernetes，从而使得 Kubernetes 能够使用第三方设备资源。通过该框架，第三方开发者可以实现一种通过手工或者 DaemonSet 部署的设备插件。这些设备一般包括如 GPU、高性能NIC、FPGA 和 InfiniBand 等需要第三方开发者进行特定初始化和设置的计算资源。
{% endcapture %}

{% capture body %}

<!--
## Device plugin registration
-->
## 设备插件的注册

<!--
The device plugins feature is gated by the `DevicePlugins` feature gate and is disabled by default.
When the device plugins feature is enabled, the kubelet exports a `Registration` gRPC service:
-->
设备插件特性由 feature gate 中的 `DevicePlugins` 特性开关控制，该特性默认关闭。当启用该框架后，kubelet 将会对外暴露一个名为 Registration 的 gRPC 服务。服务描述如下：

```gRPC
service Registration {
	rpc Register(RegisterRequest) returns (Empty) {}
}
```
<!--
A device plugin can register itself with the kubelet through this gRPC service.
During the registration, the device plugin needs to send:

  * The name of its Unix socket.
  * The Device Plugin API version against which it was built.
  * The `ResourceName` it wants to advertise. Here `ResourceName` needs to follow the
    [extended resource naming scheme](https://github.com/kubernetes/kubernetes/pull/48922)
    as `vendor-domain/resource`.
    For example, an Nvidia GPU is advertised as `nvidia.com/gpu`.
-->
通过这个 gRPC 服务，设备插件就能向 kubelet 进行注册。在发起注册时，设备插件还需要发送以下内容：

  * 设备的 Unix Socket 文件名。
  * 设备插件开发时对应的 Kubernetes API 版本。
  * 将要注册的 `ResourceName`。这里的 `ResourceName` 应该遵循 [可扩展资源命名规则](https://github.com/kubernetes/kubernetes/pull/48922)，一般采用 `第三方域名/资源名` 的方式。如 Nvidia GPU 的命名为 `nvidia.com/gpu`。

<!--
Following a successful registration, the device plugin sends the kubelet the
list of devices it manages, and the kubelet is then in charge of advertising those
resources to the API server as part of the kubelet node status update.
For example, after a device plugin registers `vendor-domain/foo` with the kubelet
and reports two healthy devices on a node, the node status is updated
to advertise 2 `vendor-domain/foo`.
-->
当成功注册资源后，设备插件还需要向 kubelet 发送其可用设备的列表，之后 kubelet 会将这些资源作为节点状态的一部分上报给 API server。例如，有一个名为 `vendor-domain/foo` 的设备插件向 kubelet 进行注册，并发送两个可用设备的列表，这时候查看 node status 就能看到有两个可用的 `vendor-domain/foo` 设备了。

<!--
Then, developers can request devices in a
[Container](/docs/api-reference/{{page.version}}/#container-v1-core)
specification by using the same process that is used for
[opaque integer resources](/docs/tasks/configure-pod-container/opaque-integer-resource/).
In version 1.8, extended resources are spported only as integer resources and must have
`limit` equal to `request` in the Container specification.
-->
然后，开发人员可以在申请 [容器资源](/docs/api-reference/{{page.version}}/#container-v1-core) 时使用和 [不透明整数资源](/docs/tasks/configure-pod-container/opaque-integer-resource/) 相同的过程来请求第三方设备资源。在1.8版本中，可扩展资源只支持按整数分配，并且在容器规格定义中的 `limit` 必须和 `request` 相等。

<!--
## Device plugin implementation
-->
## 设备插件的实现

<!--
The general workflow of a device plugin includes the following steps:
-->
设备插件的一般实现流程包括下列步骤：

<!--
* Initialization. During this phase, the device plugin performs vendor specific
  initialization and setup to make sure the devices are in a ready state.
-->
* 初始化。在这个阶段，设备插件将执行自身特定的初始化和配置操作，以确保设备正常运行。

<!--
* The plugin starts a gRPC service, with a Unix socket under host path
  `/var/lib/kubelet/device-plugins/`, that implements the following interfaces:
-->
* 插件将启动一个gRPC服务，并将其监听的 Unix Socket 文件放在宿主机的 `/var/lib/kubelet/device-plugins/` 目录，该服务需要实现以下接口：

  ```gRPC
  service DevicePlugin {
        // ListAndWatch returns a stream of List of Devices
        // Whenever a Device state change or a Device disapears, ListAndWatch
        // returns the new list
        rpc ListAndWatch(Empty) returns (stream ListAndWatchResponse) {}

        // Allocate is called during container creation so that the Device
        // Plugin can run device specific operations and instruct Kubelet
        // of the steps to make the Device available in the container
        rpc Allocate(AllocateRequest) returns (AllocateResponse) {}
  }
  ```

<!--
* The plugin registers itself with the kubelet through the Unix socket at host
  path `/var/lib/kubelet/device-plugins/kubelet.sock`.
-->
* 插件通过宿主机的 Unix Socket 文件向 kubelet 注册，该文件位于：`/var/lib/kubelet/device-plugins/kubelet.sock`。

<!--
* After successfully registering itself, the device plugin runs in serving mode, during which it keeps
monitoring device health and reports back to the kubelet upon any device state changes.
It is also responsible for serving `Allocate` gRPC requests. During `Allocate`, the device plugin may
do device-specific preparation; for example, GPU cleanup or QRNG initialization.
If the operations succeed, the device plugin returns an `AllocateResponse` that contains container
runtime configurations for accessing the allocated devices. The kubelet passes this information
to the container runtime.
-->
* 当注册成功后，设备插件需要处于服务模式，在此期间需要监控设备的健康状态并且将设备状态的变动上报给 kubelet。同时，设备插件还负责处理 `Allocate` gRPC 请求。在 `Allocate` 过程中，设备插件可能会进行一些特定的准备工作，例如 GPU 的清理或者 QRNG 初始化等等。当 `Allocate` 操作成功后，第三方资源返回一个 `AllocateResponse` 给 kubelet，该返回包括能够访问设备的容器运行平台配置，然后 kubelet 将这些信息发送给容器运行平台。

<!--
A device plugin is expected to detect kubelet restarts and re-register itself with the new
kubelet instance. In version 1.8, a new kubelet instance cleans up all the existing Unix sockets
under `/var/lib/kubelet/device-plugins` when it starts. A device plugin can monitor the deletion
of its Unix socket and re-register itself upon such an event.
-->
当 kubelet 重启时，设备插件必须能够感知并且重新发起注册。在1.8版本中，kubelet 启动时将会清空 `/var/lib/kubelet/device-plugins` 目录下的所有 Unix Socket 文件，设备插件可以通过监控自己的 Unix Socket 文件是否被删除从而重新发起注册。

<!--
## Device plugin deployment
-->
## 设备插件的部署

<!--
A device plugin can be deployed manually or as a DaemonSet. Being deployed as a DaemonSet has
the benefit that Kubernetes can restart the device plugin if it fails.
Otherwise, an extra mechanism is needed to recover from device plugin failures.
The canonical directory `/var/lib/kubelet/device-plugins` requires privileged access,
so a device plugin must run in a privileged security context.
If a device plugin is running as a DaemonSet, `/var/lib/kubelet/device-plugins`
must be mounted as a
[Volume](/docs/api-reference/{{page.version}}/#volume-v1-core)
in the plugin's
[PodSpec](/docs/api-reference/{{page.version}}/#podspec-v1-core).
-->
设备插件能够通过手工或者 DaemonSet 部署。通过 DaemonSet 部署的优势在于，当设备插件自身运行出错时，Kubernetes 将会自动重启该设备插件。否则，设备插件需要实现额外的机制来确保其自身的错误恢复。同时，对于指定的 `/var/lib/kubelet/device-plugins` 目录需要特定的访问权限，所以设备插件需要确保拥有这些访问权限。如果以 DaemonSet 的模式部署，`/var/lib/kubelet/device-plugins` 目录必须要在 [PodSpec](/docs/api-reference/{{page.version}}/#podspec-v1-core) 中以 [Volume](/docs/api-reference/{{page.version}}/#volume-v1-core) 方式进行挂载。

<!--
## Examples
-->
## 案例

<!--
For an example device plugin implementation, see
[nvidia GPU device plugin for COS base OS](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu).
-->
具体案例可见 [基于 COS 操作系统的 nvidia GPU 设备插件](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu)。

{% endcapture %}

{% include templates/concept.md %}
