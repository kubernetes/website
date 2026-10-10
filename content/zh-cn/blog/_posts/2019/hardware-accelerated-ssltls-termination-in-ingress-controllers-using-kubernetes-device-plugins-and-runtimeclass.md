---
layout: blog
title: '使用 Kubernetes 设备插件和 RuntimeClass 在 Ingress 控制器中实现硬件加速 SSL/TLS 终止'
date: 2019-04-24
---
<!--
layout: blog
title: 'Hardware Accelerated SSL/TLS Termination in Ingress Controllers using Kubernetes Device Plugins and RuntimeClass'
date: 2019-04-24
-->

<!--
**Authors:** Mikko Ylinen (Intel)
-->
**作者：** Mikko Ylinen (Intel)

**译者：** [pegasas](https://github.com/pegasas)

<!--
## Abstract
-->
## 摘要

<!--
A Kubernetes Ingress is a way to connect cluster services to the world outside the cluster. In order
to correctly route the traffic to service backends, the cluster needs an Ingress controller. The
Ingress controller is responsible for setting the right destinations to backends based on the
Ingress API objects’ information. The actual traffic is routed through a proxy server that
is responsible for tasks such as load balancing and SSL/TLS (later “SSL” refers to both SSL
or TLS ) termination. The SSL termination is a CPU heavy operation due to the crypto operations
involved. To offload some of the CPU intensive work away from the CPU, OpenSSL based proxy
servers can take the benefit of OpenSSL Engine API and dedicated crypto hardware. This frees
CPU cycles for other things and improves the overall throughput of the proxy server.
-->
Kubernetes Ingress 是在集群服务与集群外部世界建立连接的一种方法。为了正确地将流量路由到服务后端，集群需要一个
Ingress 控制器。Ingress 控制器负责根据 Ingress API 对象的信息设置目标到正确的后端。实际流量通过代理服务器路由，
代理服务器负责诸如负载均衡和 SSL/TLS （稍后的“SSL”指 SSL 或 TLS）终止等任务。由于涉及加密操作，SSL 终止是一个
CPU 密集型操作。为了从 CPU 中分载一些 CPU 密集型工作，基于 OpenSSL 的代理服务器可以利用 OpenSSL Engine API 和专用加密硬件的优势。
这将为其他事情释放 CPU 周期，并提高代理服务器的总体吞吐量。

<!--
In this blog post, we will show how easy it is to make hardware accelerated crypto available
for containers running the Ingress controller proxy using some of the recently created Kubernetes
building blocks: Device plugin framework and RuntimeClass. At the end, a reference setup is given
using an HAproxy based Ingress controller accelerated using Intel&reg; QuickAssist Technology cards.
-->
在这篇博客文章中，我们将展示使用最近创建的 Kubernetes 构建块（设备插件框架和 RuntimeClass）为运行
Ingress 控制器代理的容器提供硬件加速加密是多么容易。最后，给出了一个参考设置使用基于 HAproxy 的 Ingress 控制器
加速使用 Intel&reg; QuickAssist 技术卡。

<!--
## About Proxies, OpenSSL Engine and Crypto Hardware
-->
## 关于代理、OpenSSL 引擎和加密硬件

<!--
The proxy server plays a vital role in a Kubernetes Ingress Controller function. It proxies
the traffic to the backends per Ingress objects routes. Under heavy traffic load, the performance
becomes critical especially if the proxying involves CPU intensive operations like SSL crypto.
-->
代理服务器在 Kubernetes Ingress 控制器功能中起着至关重要的作用。它将流量代理到每个 Ingress 对象路由的后端。
在高流量负载下，性能变得至关重要，特别是当代理涉及到诸如 SSL 加密之类的 CPU 密集型操作时。

<!--
The OpenSSL project provides the widely adopted library for implementing the SSL protocol. Of
the commonly known proxy servers used by Kubernetes Ingress controllers, Nginx and HAproxy use
OpenSSL. The CNCF graduated Envoy proxy uses BoringSSL but there seems to be [community interest
in having OpenSSL as the alternative](https://github.com/envoyproxy/envoy/pull/5161#issuecomment-446374130) for it too.
-->
OpenSSL 项目为实现 SSL 协议提供了广泛采用的库。Kubernetes Ingress 控制器使用的常用代理服务器中，Nginx 和 HAproxy 使用 OpenSSL。
CNCF 毕业项目 Envoy 使用 BoringSSL，但是 [Envoy 社区似乎也有兴趣使用 OpenSSL 作为替代](https://github.com/envoyproxy/envoy/pull/5161#issuecomment-446374130)。

<!--
The OpenSSL SSL protocol library relies on libcrypto that implements the cryptographic functions.
For quite some time now (first introduced in 0.9.6 release), OpenSSL has provided an [ENGINE
concept](https://github.com/openssl/openssl/blob/master/README.ENGINE) that allows these cryptographic operations to be offloaded to a dedicated crypto
acceleration hardware. Later, a special *dynamic* ENGINE enabled the crypto hardware specific
pieces to be implemented in an independent loadable module that can be developed outside the
OpenSSL code base and distributed separately. From the application’s perspective, this is also
ideal because they don’t need to know the details of how to use the hardware, and the hardware
specific module can be loaded/used when the hardware is available.
-->
OpenSSL SSL 协议库依赖于实现加密功能的 libcrypto。很长一段时间以来（在 0.9.6 版本中首次引入），
OpenSSL 提供了一个[引擎概念](https://github.com/openssl/openssl/blob/master/README.ENGINE)，
允许将这些加密操作卸载到专用的加密加速硬件。后来，一个特殊的**动态引擎**使加密硬件的特定部分能够在一个独立的可加载模块中实现，
该模块可以在 OpenSSL 代码库之外开发并单独分发。从应用程序的角度来看，这也是理想的，因为他们不需要知道如何使用硬件的细节，
并且当硬件可用时，可以加载/使用特定于硬件的模块。

<!--
Hardware based crypto can greatly improve Cloud applications’ performance due to hardware
accelerated processing in SSL operations as discussed, and can provide other crypto
services like key/random number generation. Clouds can make the hardware easily available
using the dynamic ENGINE and several loadable module implementations exist, for
example, [CloudHSM](https://docs.aws.amazon.com/cloudhsm/latest/userguide/openssl-library.html), [IBMCA](https://github.com/opencryptoki/openssl-ibmca), or [QAT Engine](https://github.com/intel/QAT_Engine/).
-->
如前所述，由于 SSL 操作中的硬件加速处理，基于硬件的加密可以极大地提高云应用程序的性能，
并且可以提供密钥/随机数生成等其他加密服务。云可以使用动态引擎轻松地提供硬件，并且存在几种可加载模块实现，
例如 [CloudHSM](https://docs.aws.amazon.com/cloudhsm/latest/userguide/openssl-library.html) 、
[IBMCA](https://github.com/opencryptoki/openssl-ibmca) 或
[QAT Engine](https://github.com/intel/QAT_Engine/) 。

<!--
For Cloud deployments, the ideal scenario is for these modules to be shipped as part of
the container workload. The workload would get scheduled on a node that provides the
underlying hardware that the module needs to access. On the other hand, the workloads
should run the same way and without code modifications regardless of the crypto acceleration
hardware being available or not. The OpenSSL dynamic engine enables this. Figure 1 below
illustrates these two scenarios using a typical Ingress Controller container as an example.
The red colored boxes indicate the differences between a container with a crypto hardware
engine enabled container vs. a “standard” one. It’s worth pointing out that the configuration
changes shown do not necessarily require another version of the container since the configurations
could be managed, e.g., using ConfigMaps.
-->
对于云部署，理想的场景是将这些模块作为容器工作负载的一部分交付。工作负载将在提供模块需要访问的底层硬件的节点上调度。
另一方面，不管加密加速硬件是否可用，工作负载都应该以相同的方式运行，并且不需要修改代码。OpenSSL 动态引擎支持这一点。
下面图 1 以一个典型的 Ingress 控制器容器为例说明了这两个场景。红色的框表示启用了加密硬件引擎的容器与“标准”容器之间的区别。
值得指出的是，所显示的配置更改并不一定需要容器的另一个版本，因为配置可以被管理，例如使用 ConfigMap。

<!--
{{<figure width="600"  src="/images/blog/2019-04-23-hardware-accelerated-tls-termination/k8s-blog-fig1.png" caption="Figure 1. Examples of Ingress controller containers">}}
-->
{{<figure width="600"  src="/images/blog/2019-04-23-hardware-accelerated-tls-termination/k8s-blog-fig1.png" caption="图 1. Ingress 控制器容器">}}


<!--
## Hardware Resources and Isolation
-->
## 硬件资源和隔离

<!--
To be able to deploy workloads with hardware dependencies, Kubernetes provides excellent extension
and configurability mechanisms. Let’s take a closer look into Kubernetes the [device plugin framework](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
(beta in 1.14) and [RuntimeClass](https://kubernetes.io/docs/concepts/containers/runtime-class/) (beta in 1.14) and learn how they can be leveraged to expose crypto
hardware to workloads.
-->
为了能够部署具有硬件依赖关系的工作负载，Kubernetes 提供了优秀的扩展和可配置机制。
让我们进一步研究 Kubernetes [设备插件框架](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)（beta 1.14）
和 [RuntimeClass](/zh-cn/docs/concepts/containers/runtime-class/)（beta 1.14），
并了解如何利用它们向工作负载暴露加密硬件。

<!--
The device plugin framework, first introduced in Kubernetes 1.8, provides a way for hardware vendors
to register and allocate node hardware resources to Kubelets. The plugins implement the hardware
specific initialization logic and resource management. The pods can request hardware resources in
their PodSpec, which also guarantees the pod is scheduled on a node that can provide those resources.
-->
在 Kubernetes 1.8 中首次引入的设备插件框架为硬件供应商提供了一种向 Kubelets 注册和分配节点硬件资源的方法。
插件实现了特定于硬件的初始化逻辑和资源管理。Pod 可以在其 PodSpec 中请求硬件资源，
进而保证 Pod 被调度到能够提供这些资源的节点上。

<!--
The device resource allocation for containers is non-trivial. For applications dealing with security,
the hardware level isolation is critical. The PCIe based crypto acceleration device functions can
benefit from IO hardware virtualization, through an I/O Memory Management Unit (IOMMU), to provide
the isolation: an *IOMMU group* the device belongs to provides the isolated resource for a workload
(assuming the crypto cards do not share the IOMMU group with other devices). The number of isolated
resources can be further increased if the PCIe device supports the Single-Root I/O Virtualization
(SR-IOV) specification. SR-IOV allows the PCIe device to be split further to *virtual functions* (VF),
derived from *physical function* (PF) devices, and each belonging to their own IOMMU group. To expose
these IOMMU isolated device functions to user space and containers, the host kernel should bind
them to a specific device driver. In Linux, this  driver is vfio-pci and it makes each device
available through a character device in user space. The kernel vfio-pci driver provides user space
applications with a direct, IOMMU backed access to PCIe devices and functions, using a mechanism
called *PCI passthrough*. The interface can be leveraged by user space frameworks, such as the
Data Plane Development Kit (DPDK). Additionally, virtual machine (VM) hypervisors can provide
these user space device nodes to VMs and expose them as PCI devices to the guest kernel.
Assuming support from the guest kernel, the VM gets close to native performant direct access to the
underlying host devices.
-->
容器的设备资源分配非常重要。对于处理安全性的应用程序，硬件级别隔离是至关重要的。
基于 PCIe 的加密加速设备功能
可以受益于 IO 硬件虚拟化，通过 I/O 内存管理单元（IOMMU），提供隔离：IOMMU 将设备分组，为工作负载提供隔离的资源
（假设加密卡不与其他设备共享 **IOMMU 组**）。如果PCIe设备支持单根 I/O 虚拟化（SR-IOV）规范，则可以进一步增加隔离资源的数量。
SR-IOV 允许将 PCIe 设备将 **物理功能项（Physical Functions，PF）** 设备进一步拆分为
**虚拟功能项（Virtual Functions, VF）**，并且每个设备都属于自己的 IOMMU 组。
要将这些借助 IOMMU 完成隔离的设备功能项暴露给用户空间和容器，主机内核应该将它们绑定到特定的设备驱动程序。
在 Linux 中，这个驱动程序是 vfio-pci，
它通过字符设备将设备提供给用户空间。内核 vfio-pci 驱动程序使用一种称为
**PCI 透传（PCI Passthrough）** 的机制，
为用户空间应用程序提供了对 PCIe 设备与功能项的直接的、IOMMU 支持的访问。
用户空间框架，如数据平面开发工具包（Data Plane Development Kit，DPDK）可以利用该接口。
此外，虚拟机（VM）管理程序可以向 VM 提供这些用户空间设备节点，并将它们作为 PCI 设备暴露给寄宿内核。
在寄宿内核的支持下，VM 将接近于直接访问底层主机设备的本机性能。

<!--
To advertise these device resources to Kubernetes, we can have a simple Kubernetes device plugin
that runs the initialization (i.e., binding), calls kubelet’s `Registration` gRPC service, and
implements the DevicePlugin gRPC service that kubelet calls to, e.g., to `Allocate` the resources
upon Pod creation.
-->
为了向 Kubernetes 发布这些设备资源，我们可以使用一个简单的 Kubernetes 设备插件来运行初始化（绑定），
调用 kubelet 的 `Registration` gRPC 服务，并实现 kubelet 调用的 DevicePlugin gRPC 服务，
例如，在 Pod 创建时 `Allocate` 资源。

<!--
## Device Assignment and Pod Deployment
-->
## 设备分配和Pod部署

<!--
At this point, you may ask what the container could do with a VFIO device node? The answer comes
after we first take a quick look into the Kubernetes RuntimeClass.
-->
此时，你可能会问容器可以使用 VFIO 设备节点做什么？我们首先快速查看 Kubernetes RuntimeClass 之后，答案会出现。

<!--
The Kubernetes RuntimeClass was created to provide better control and configurability
over a variety of *runtimes* (an earlier [blog post](https://kubernetes.io/blog/2018/10/10/kubernetes-v1.12-introducing-runtimeclass/) goes into the details of the needs,
status and roadmap for it) that are available in the cluster. In essence, the RuntimeClass
provides cluster users better tools to pick and use the runtime that best suits for the pod use case.
-->
创建 Kubernetes RuntimeClass 是为了对集群中可用的各种**运行时**提供更好的控制和可配置性
（前面的一篇[博客文章](https://kubernetes.io/blog/2018/10/10/kubernetes-v1.12-introducing-runtimeclass/)详细介绍了它的需求、状态和路线图）。
本质上，RuntimeClass 为集群用户提供了更好的工具来选择和使用最适合 Pod 用例的运行时。

<!--
The OCI compatible [Kata Containers runtime](https://katacontainers.io/) provides workloads with a hardware virtualized
isolation layer. In addition to workload isolation, the Kata Containers VM has the added
side benefit that the VFIO devices, as `Allocate`’d by the device plugin, can be passed
through to the container as hardware isolated devices. The only requirement is that the
Kata Containers kernel has driver for the exposed device enabled.
-->
OCI 兼容的 [Kata Containers 运行时](https://katacontainers.io/)为工作负载提供了一个硬件虚拟化隔离层。
除了工作负载隔离之外，Kata Containers VM 还有一个额外的好处，即 VFIO 设备，由设备插件 `Allocate` 而来，
可以作为硬件隔离设备传递给容器。惟一的要求是，Kata Containers 内核启用了暴露设备的驱动程序。

<!--
That’s all it really takes to enable hardware accelerated crypto for container workloads. To summarize:

  1. Cluster needs a device plugin running on the node that provides the hardware
  2. Device plugin exposes the hardware to user space using  the VFIO driver
  3. Pod requests the device resources and Kata Containers as the RuntimeClass in the PodSpec
  4. The container has the hardware adaptation library and the OpenSSL engine module

Figure 2 shows the overall setup using the Container A illustrated earlier.
-->
这就是为容器工作负载启用硬件加速加密所需要的全部。总结：

  1. 集群需要在提供硬件的节点上运行一个设备插件
  2. 设备插件使用 VFIO 驱动程序向用户空间暴露硬件
  3. Pod 在 PodSpec 中请求设备资源并指定 Kata Containers 作为 RuntimeClass
  4. 容器中具有硬件适配库和 OpenSSL 引擎模块

图2显示了使用前面演示的容器的总体设置。

<!--
{{<figure width="600"  src="/images/blog/2019-04-23-hardware-accelerated-tls-termination/k8s-blog-fig2.png" caption="Figure 2. Deployment overview">}}
-->
{{<figure width="600"  src="/images/blog/2019-04-23-hardware-accelerated-tls-termination/k8s-blog-fig1.png" caption="图 2. Deployment 概述">}}

<!--
## Reference Setup
-->
## 参考设置

<!--
Finally, we describe the necessary building blocks and steps to build a functional
setup described in Figure 2 that enables hardware accelerated SSL termination in
an Ingress Controller using an Intel&reg; QuickAssist Technology (QAT) PCIe device.
It should be noted that the use cases are not limited to Ingress controllers, but
any OpenSSL based workload can be accelerated.
-->
最后，我们描述构建图 2 中描述的可以工作的设置所需的构建块和步骤。具体设置使用了
Intel&reg; QuickAssist 技术（QAT） PCIe 设备。
在 Ingress 控制器中启用硬件加速 SSL 终止。应该注意的是，用例并不局限于 Ingress 控制器，
任何基于 OpenSSL 的工作负载都可以加速。

<!--
### Cluster configuration:
  * Kubernetes 1.14 (`RuntimeClass` and `DevicePlugin` feature gates enabled (both are `true` in 1.14)
  * RuntimeClass ready runtime and Kata Containers configured
-->
### 集群配置：
  * Kubernetes 1.14（`RuntimeClass` 和 `DevicePlugin` 特性门控已启用（两者在 1.14 中都是 `true`）
  * 配置了 RuntimeClass 就绪运行时和 Kata Containers

<!--
### Host configuration:
  * Intel&reg; QAT driver release with the kernel drivers installed for both host kernel and Kata Containers kernel (or on a rootfs as loadable modules)
  * [QAT device plugin](https://github.com/intel/intel-device-plugins-for-kubernetes/tree/master/cmd/qat_plugin) DaemonSet deployed
-->
### 主机配置：
  * Intel&reg; QAT 驱动程序发行版，内核驱动程序同时安装在主机内核和 Kata Containers 内核（或在 rootfs 上作为可加载模块）
  * 已部署 [QAT 设备插件](https://github.com/intel/intel-device-plugins-for-kubernetes/tree/master/cmd/qat_plugin) DaemonSet

<!--
### Ingress controller configuration and deployment:
  * [HAproxy-ingress](https://github.com/jcmoraisjr/haproxy-ingress) ingress controller in a modified container that has
     * the QAT HW HAL user space library (part of Intel&reg; QAT SW release) and
     * the [OpenSSL QAT Engine](https://github.com/intel/QAT_Engine/) built in
  * Haproxy-ingress ConfigMap to enable QAT engine usage
     * `ssl-engine=”qat”`
     * `ssl-mode-async=true`
  * Haproxy-ingress deployment `.yaml` to
     * Request `qat.intel.com: n` resources
     * Request `runtimeClassName: kata-containers` (name value depends on cluster config)
  * (QAT device config file for each requested device resource with OpenSSL engine configured available in the container)
-->
### Ingress 控制器配置和部署：
  * 一个修改后的 [HAproxy-ingress](https://github.com/jcmoraisjr/haproxy-ingress) Ingress 控制器的容器
     * QAT HW HAL 用户空间库（Intel&reg; QAT SW 发行版的一部分）
     * 内置 [OpenSSL QAT 引擎](https://github.com/intel/QAT_Engine/)
  * 使用 Haproxy-ingress ConfigMap 启用 QAT 引擎
     * `ssl-engine=”qat”`
     * `ssl-mode-async=true`
  * Haproxy-ingress Deployment `.yaml`
     * 请求 `qat.intel.com: n` 资源
     * 请求 `runtimeClassName: kata-containers` (名称值取决于集群配置)
  * (容器中配置了可用的 OpenSSL 引擎的 QAT 设备配置文件)

<!--
Once the building blocks are available, the hardware accelerated SSL/TLS can be tested by following the [TLS termination
example](https://github.com/jcmoraisjr/haproxy-ingress/tree/master/examples/tls-termination) steps. In order to verify the hardware is used, you can check `/sys/kernel/debug/*/fw_counters` files on host as they
get updated by the Intel&reg; QAT firmware.
-->
一旦构建块可用，就可以按照 [TLS 终止示例](https://github.com/jcmoraisjr/haproxy-ingress/tree/master/examples/tls-termination) 
步骤测试硬件加速 SSL/TLS。
为了验证硬件的使用，你可以检查主机上的 `/sys/kernel/debug/*/fw_counters` 文件，
它们会由 Intel&reg; QAT 固件更新。

<!--
Haproxy-ingress and HAproxy are used because HAproxy can be directly configured to use the OpenSSL engine using
`ssl-engine <name> [algo ALGOs]` configuration flag without modifications to the global openssl configuration file.
Moreover, HAproxy can offload configured algorithms using asynchronous calls (with `ssl-mode-async`) to further improve performance.
-->
使用 HAproxy-ingress 和 HAproxy，是因为可以使用 `ssl-engine <name> [algo ALGOs]`
配置标志直接配置 HAproxy 来使用 OpenSSL 引擎，
而无需修改全局 OpenSSL 配置文件。此外，HAproxy 可以使用异步调用（使用`ssl-mode-async`）卸载已配置的算法，以进一步提高性能。

<!--
## Call to Action
-->
## 呼吁

<!--
In this blog post we have shown how Kubernetes Device Plugins and RuntimeClass can be used to provide isolated hardware
access for applications in pods to offload crypto operations to hardware accelerators. Hardware accelerators can be used
to speed up crypto operations and also save CPU cycles to other tasks. We demonstrated the setup using HAproxy that already
supports asynchronous crypto offload with OpenSSL.
-->
在这篇博客文章中，我们展示了 Kubernetes 设备插件和 RuntimeClass 如何为 Pod 中的应用程序提供隔离的硬件访问，以便将加密操作卸载给硬件加速器。
硬件加速器可以用来加速加密操作，并将 CPU 周期节省给其他任务。我们演示了使用 HAproxy 的设置，
它已经支持 OpenSSL 中的异步加密卸载。

<!--
The next steps for our team is to repeat the same for Envoy (with an OpenSSL based TLS transport socket built
as an extension). Furthermore, we are working to enhance Envoy to be able to [offload BoringSSL asynchronous
private key operations](https://github.com/envoyproxy/envoy/issues/6248) to a crypto acceleration hardware. Any review feedback or help is appreciated!
-->
我们团队的下一步是对 Envoy 重复相同的步骤（使用一个基于 OpenSSL 的 TLS 传输套接字作为扩展构建）。
此外，我们正在努力增强 Envoy 功能，使其能够将
[BoringSSL 异步私钥操作卸载](https://github.com/envoyproxy/envoy/issues/6248)到加密加速硬件。
感谢你的反馈和帮助！

<!--
How many CPU cycles can your crypto application save for other tasks when offloading crypto processing to a dedicated accelerator?
-->
当将加密处理卸载到专用加速器时，你的加密应用程序可以为其他任务节省多少 CPU 周期？
