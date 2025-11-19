---
layout: blog
title: '使用 Kubernetes 設備插件和 RuntimeClass 在 Ingress 控制器中實現硬件加速 SSL/TLS 終止'
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

**譯者：** [pegasas](https://github.com/pegasas)

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
Kubernetes Ingress 是在叢集服務與叢集外部世界建立連接的一種方法。爲了正確地將流量路由到服務後端，叢集需要一個
Ingress 控制器。Ingress 控制器負責根據 Ingress API 對象的信息設置目標到正確的後端。實際流量通過代理伺服器路由，
代理伺服器負責諸如負載均衡和 SSL/TLS （稍後的“SSL”指 SSL 或 TLS）終止等任務。由於涉及加密操作，SSL 終止是一個
CPU 密集型操作。爲了從 CPU 中分載一些 CPU 密集型工作，基於 OpenSSL 的代理伺服器可以利用 OpenSSL Engine API 和專用加密硬件的優勢。
這將爲其他事情釋放 CPU 週期，並提高代理伺服器的總體吞吐量。

<!--
In this blog post, we will show how easy it is to make hardware accelerated crypto available
for containers running the Ingress controller proxy using some of the recently created Kubernetes
building blocks: Device plugin framework and RuntimeClass. At the end, a reference setup is given
using an HAproxy based Ingress controller accelerated using Intel&reg; QuickAssist Technology cards.
-->
在這篇博客文章中，我們將展示使用最近創建的 Kubernetes 構建塊（設備插件框架和 RuntimeClass）爲運行
Ingress 控制器代理的容器提供硬件加速加密是多麼容易。最後，給出了一個參考設置使用基於 HAproxy 的 Ingress 控制器
加速使用 Intel&reg; QuickAssist 技術卡。

<!--
## About Proxies, OpenSSL Engine and Crypto Hardware
-->
## 關於代理、OpenSSL 引擎和加密硬件

<!--
The proxy server plays a vital role in a Kubernetes Ingress Controller function. It proxies
the traffic to the backends per Ingress objects routes. Under heavy traffic load, the performance
becomes critical especially if the proxying involves CPU intensive operations like SSL crypto.
-->
代理伺服器在 Kubernetes Ingress 控制器功能中起着至關重要的作用。它將流量代理到每個 Ingress 對象路由的後端。
在高流量負載下，性能變得至關重要，特別是當代理涉及到諸如 SSL 加密之類的 CPU 密集型操作時。

<!--
The OpenSSL project provides the widely adopted library for implementing the SSL protocol. Of
the commonly known proxy servers used by Kubernetes Ingress controllers, Nginx and HAproxy use
OpenSSL. The CNCF graduated Envoy proxy uses BoringSSL but there seems to be [community interest
in having OpenSSL as the alternative](https://github.com/envoyproxy/envoy/pull/5161#issuecomment-446374130) for it too.
-->
OpenSSL 項目爲實現 SSL 協議提供了廣泛採用的庫。Kubernetes Ingress 控制器使用的常用代理伺服器中，Nginx 和 HAproxy 使用 OpenSSL。
CNCF 畢業項目 Envoy 使用 BoringSSL，但是 [Envoy 社區似乎也有興趣使用 OpenSSL 作爲替代](https://github.com/envoyproxy/envoy/pull/5161#issuecomment-446374130)。

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
OpenSSL SSL 協議庫依賴於實現加密功能的 libcrypto。很長一段時間以來（在 0.9.6 版本中首次引入），
OpenSSL 提供了一個[引擎概念](https://github.com/openssl/openssl/blob/master/README.ENGINE)，
允許將這些加密操作卸載到專用的加密加速硬件。後來，一個特殊的**動態引擎**使加密硬件的特定部分能夠在一個獨立的可加載模塊中實現，
該模塊可以在 OpenSSL 代碼庫之外開發並單獨分發。從應用程序的角度來看，這也是理想的，因爲他們不需要知道如何使用硬件的細節，
並且當硬件可用時，可以加載/使用特定於硬件的模塊。

<!--
Hardware based crypto can greatly improve Cloud applications’ performance due to hardware
accelerated processing in SSL operations as discussed, and can provide other crypto
services like key/random number generation. Clouds can make the hardware easily available
using the dynamic ENGINE and several loadable module implementations exist, for
example, [CloudHSM](https://docs.aws.amazon.com/cloudhsm/latest/userguide/openssl-library.html), [IBMCA](https://github.com/opencryptoki/openssl-ibmca), or [QAT Engine](https://github.com/intel/QAT_Engine/).
-->
如前所述，由於 SSL 操作中的硬件加速處理，基於硬件的加密可以極大地提高雲應用程序的性能，
並且可以提供密鑰/隨機數生成等其他加密服務。雲可以使用動態引擎輕鬆地提供硬件，並且存在幾種可加載模塊實現，
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
對於雲部署，理想的場景是將這些模塊作爲容器工作負載的一部分交付。工作負載將在提供模塊需要訪問的底層硬件的節點上調度。
另一方面，不管加密加速硬件是否可用，工作負載都應該以相同的方式運行，並且不需要修改代碼。OpenSSL 動態引擎支持這一點。
下面圖 1 以一個典型的 Ingress 控制器容器爲例說明了這兩個場景。紅色的框表示啓用了加密硬件引擎的容器與“標準”容器之間的區別。
值得指出的是，所顯示的設定更改並不一定需要容器的另一個版本，因爲設定可以被管理，例如使用 ConfigMap。

<!--
{{<figure width="600"  src="/images/blog/2019-04-23-hardware-accelerated-tls-termination/k8s-blog-fig1.png" caption="Figure 1. Examples of Ingress controller containers">}}
-->
{{<figure width="600"  src="/images/blog/2019-04-23-hardware-accelerated-tls-termination/k8s-blog-fig1.png" caption="圖 1. Ingress 控制器容器">}}


<!--
## Hardware Resources and Isolation
-->
## 硬件資源和隔離

<!--
To be able to deploy workloads with hardware dependencies, Kubernetes provides excellent extension
and configurability mechanisms. Let’s take a closer look into Kubernetes the [device plugin framework](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
(beta in 1.14) and [RuntimeClass](https://kubernetes.io/docs/concepts/containers/runtime-class/) (beta in 1.14) and learn how they can be leveraged to expose crypto
hardware to workloads.
-->
爲了能夠部署具有硬件依賴關係的工作負載，Kubernetes 提供了優秀的擴展和可設定機制。
讓我們進一步研究 Kubernetes [設備插件框架](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)（beta 1.14）
和 [RuntimeClass](/zh-cn/docs/concepts/containers/runtime-class/)（beta 1.14），
並瞭解如何利用它們向工作負載暴露加密硬件。

<!--
The device plugin framework, first introduced in Kubernetes 1.8, provides a way for hardware vendors
to register and allocate node hardware resources to Kubelets. The plugins implement the hardware
specific initialization logic and resource management. The pods can request hardware resources in
their PodSpec, which also guarantees the pod is scheduled on a node that can provide those resources.
-->
在 Kubernetes 1.8 中首次引入的設備插件框架爲硬件供應商提供了一種向 Kubelets 註冊和分配節點硬件資源的方法。
插件實現了特定於硬件的初始化邏輯和資源管理。Pod 可以在其 PodSpec 中請求硬件資源，
進而保證 Pod 被調度到能夠提供這些資源的節點上。

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
容器的設備資源分配非常重要。對於處理安全性的應用程序，硬件級別隔離是至關重要的。
基於 PCIe 的加密加速設備功能
可以受益於 IO 硬件虛擬化，通過 I/O 內存管理單元（IOMMU），提供隔離：IOMMU 將設備分組，爲工作負載提供隔離的資源
（假設加密卡不與其他設備共享 **IOMMU 組**）。如果PCIe設備支持單根 I/O 虛擬化（SR-IOV）規範，則可以進一步增加隔離資源的數量。
SR-IOV 允許將 PCIe 設備將 **物理功能項（Physical Functions，PF）** 設備進一步拆分爲
**虛擬功能項（Virtual Functions, VF）**，並且每個設備都屬於自己的 IOMMU 組。
要將這些藉助 IOMMU 完成隔離的設備功能項暴露給使用者空間和容器，主機內核應該將它們綁定到特定的設備驅動程序。
在 Linux 中，這個驅動程序是 vfio-pci，
它通過字符設備將設備提供給使用者空間。內核 vfio-pci 驅動程序使用一種稱爲
**PCI 透傳（PCI Passthrough）** 的機制，
爲使用者空間應用程序提供了對 PCIe 設備與功能項的直接的、IOMMU 支持的訪問。
使用者空間框架，如數據平面開發工具包（Data Plane Development Kit，DPDK）可以利用該接口。
此外，虛擬機（VM）管理程序可以向 VM 提供這些使用者空間設備節點，並將它們作爲 PCI 設備暴露給寄宿內核。
在寄宿內核的支持下，VM 將接近於直接訪問底層主機設備的本機性能。

<!--
To advertise these device resources to Kubernetes, we can have a simple Kubernetes device plugin
that runs the initialization (i.e., binding), calls kubelet’s `Registration` gRPC service, and
implements the DevicePlugin gRPC service that kubelet calls to, e.g., to `Allocate` the resources
upon Pod creation.
-->
爲了向 Kubernetes 發佈這些設備資源，我們可以使用一個簡單的 Kubernetes 設備插件來運行初始化（綁定），
調用 kubelet 的 `Registration` gRPC 服務，並實現 kubelet 調用的 DevicePlugin gRPC 服務，
例如，在 Pod 創建時 `Allocate` 資源。

<!--
## Device Assignment and Pod Deployment
-->
## 設備分配和Pod部署

<!--
At this point, you may ask what the container could do with a VFIO device node? The answer comes
after we first take a quick look into the Kubernetes RuntimeClass.
-->
此時，你可能會問容器可以使用 VFIO 設備節點做什麼？我們首先快速查看 Kubernetes RuntimeClass 之後，答案會出現。

<!--
The Kubernetes RuntimeClass was created to provide better control and configurability
over a variety of *runtimes* (an earlier [blog post](https://kubernetes.io/blog/2018/10/10/kubernetes-v1.12-introducing-runtimeclass/) goes into the details of the needs,
status and roadmap for it) that are available in the cluster. In essence, the RuntimeClass
provides cluster users better tools to pick and use the runtime that best suits for the pod use case.
-->
創建 Kubernetes RuntimeClass 是爲了對叢集中可用的各種**運行時**提供更好的控制和可設定性
（前面的一篇[博客文章](https://kubernetes.io/blog/2018/10/10/kubernetes-v1.12-introducing-runtimeclass/)詳細介紹了它的需求、狀態和路線圖）。
本質上，RuntimeClass 爲叢集使用者提供了更好的工具來選擇和使用最適合 Pod 用例的運行時。

<!--
The OCI compatible [Kata Containers runtime](https://katacontainers.io/) provides workloads with a hardware virtualized
isolation layer. In addition to workload isolation, the Kata Containers VM has the added
side benefit that the VFIO devices, as `Allocate`’d by the device plugin, can be passed
through to the container as hardware isolated devices. The only requirement is that the
Kata Containers kernel has driver for the exposed device enabled.
-->
OCI 兼容的 [Kata Containers 運行時](https://katacontainers.io/)爲工作負載提供了一個硬件虛擬化隔離層。
除了工作負載隔離之外，Kata Containers VM 還有一個額外的好處，即 VFIO 設備，由設備插件 `Allocate` 而來，
可以作爲硬件隔離設備傳遞給容器。惟一的要求是，Kata Containers 內核啓用了暴露設備的驅動程序。

<!--
That’s all it really takes to enable hardware accelerated crypto for container workloads. To summarize:

  1. Cluster needs a device plugin running on the node that provides the hardware
  2. Device plugin exposes the hardware to user space using  the VFIO driver
  3. Pod requests the device resources and Kata Containers as the RuntimeClass in the PodSpec
  4. The container has the hardware adaptation library and the OpenSSL engine module

Figure 2 shows the overall setup using the Container A illustrated earlier.
-->
這就是爲容器工作負載啓用硬件加速加密所需要的全部。總結：

  1. 叢集需要在提供硬件的節點上運行一個設備插件
  2. 設備插件使用 VFIO 驅動程序向使用者空間暴露硬件
  3. Pod 在 PodSpec 中請求設備資源並指定 Kata Containers 作爲 RuntimeClass
  4. 容器中具有硬件適配庫和 OpenSSL 引擎模塊

圖2顯示了使用前面演示的容器的總體設置。

<!--
{{<figure width="600"  src="/images/blog/2019-04-23-hardware-accelerated-tls-termination/k8s-blog-fig2.png" caption="Figure 2. Deployment overview">}}
-->
{{<figure width="600"  src="/images/blog/2019-04-23-hardware-accelerated-tls-termination/k8s-blog-fig1.png" caption="圖 2. Deployment 概述">}}

<!--
## Reference Setup
-->
## 參考設置

<!--
Finally, we describe the necessary building blocks and steps to build a functional
setup described in Figure 2 that enables hardware accelerated SSL termination in
an Ingress Controller using an Intel&reg; QuickAssist Technology (QAT) PCIe device.
It should be noted that the use cases are not limited to Ingress controllers, but
any OpenSSL based workload can be accelerated.
-->
最後，我們描述構建圖 2 中描述的可以工作的設置所需的構建塊和步驟。具體設置使用了
Intel&reg; QuickAssist 技術（QAT） PCIe 設備。
在 Ingress 控制器中啓用硬件加速 SSL 終止。應該注意的是，用例並不侷限於 Ingress 控制器，
任何基於 OpenSSL 的工作負載都可以加速。

<!--
### Cluster configuration:
  * Kubernetes 1.14 (`RuntimeClass` and `DevicePlugin` feature gates enabled (both are `true` in 1.14)
  * RuntimeClass ready runtime and Kata Containers configured
-->
### 叢集設定：
  * Kubernetes 1.14（`RuntimeClass` 和 `DevicePlugin` 特性門控已啓用（兩者在 1.14 中都是 `true`）
  * 設定了 RuntimeClass 就緒運行時和 Kata Containers

<!--
### Host configuration:
  * Intel&reg; QAT driver release with the kernel drivers installed for both host kernel and Kata Containers kernel (or on a rootfs as loadable modules)
  * [QAT device plugin](https://github.com/intel/intel-device-plugins-for-kubernetes/tree/master/cmd/qat_plugin) DaemonSet deployed
-->
### 主機設定：
  * Intel&reg; QAT 驅動程序發行版，內核驅動程序同時安裝在主機內核和 Kata Containers 內核（或在 rootfs 上作爲可加載模塊）
  * 已部署 [QAT 設備插件](https://github.com/intel/intel-device-plugins-for-kubernetes/tree/master/cmd/qat_plugin) DaemonSet

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
### Ingress 控制器設定和部署：
  * 一個修改後的 [HAproxy-ingress](https://github.com/jcmoraisjr/haproxy-ingress) Ingress 控制器的容器
     * QAT HW HAL 使用者空間庫（Intel&reg; QAT SW 發行版的一部分）
     * 內置 [OpenSSL QAT 引擎](https://github.com/intel/QAT_Engine/)
  * 使用 Haproxy-ingress ConfigMap 啓用 QAT 引擎
     * `ssl-engine=”qat”`
     * `ssl-mode-async=true`
  * Haproxy-ingress Deployment `.yaml`
     * 請求 `qat.intel.com: n` 資源
     * 請求 `runtimeClassName: kata-containers` (名稱值取決於叢集設定)
  * (容器中設定了可用的 OpenSSL 引擎的 QAT 設備設定文件)

<!--
Once the building blocks are available, the hardware accelerated SSL/TLS can be tested by following the [TLS termination
example](https://github.com/jcmoraisjr/haproxy-ingress/tree/master/examples/tls-termination) steps. In order to verify the hardware is used, you can check `/sys/kernel/debug/*/fw_counters` files on host as they
get updated by the Intel&reg; QAT firmware.
-->
一旦構建塊可用，就可以按照 [TLS 終止示例](https://github.com/jcmoraisjr/haproxy-ingress/tree/master/examples/tls-termination) 
步驟測試硬件加速 SSL/TLS。
爲了驗證硬件的使用，你可以檢查主機上的 `/sys/kernel/debug/*/fw_counters` 文件，
它們會由 Intel&reg; QAT 固件更新。

<!--
Haproxy-ingress and HAproxy are used because HAproxy can be directly configured to use the OpenSSL engine using
`ssl-engine <name> [algo ALGOs]` configuration flag without modifications to the global openssl configuration file.
Moreover, HAproxy can offload configured algorithms using asynchronous calls (with `ssl-mode-async`) to further improve performance.
-->
使用 HAproxy-ingress 和 HAproxy，是因爲可以使用 `ssl-engine <name> [algo ALGOs]`
設定標誌直接設定 HAproxy 來使用 OpenSSL 引擎，
而無需修改全局 OpenSSL 設定文件。此外，HAproxy 可以使用異步調用（使用`ssl-mode-async`）卸載已設定的算法，以進一步提高性能。

<!--
## Call to Action
-->
## 呼籲

<!--
In this blog post we have shown how Kubernetes Device Plugins and RuntimeClass can be used to provide isolated hardware
access for applications in pods to offload crypto operations to hardware accelerators. Hardware accelerators can be used
to speed up crypto operations and also save CPU cycles to other tasks. We demonstrated the setup using HAproxy that already
supports asynchronous crypto offload with OpenSSL.
-->
在這篇博客文章中，我們展示了 Kubernetes 設備插件和 RuntimeClass 如何爲 Pod 中的應用程序提供隔離的硬件訪問，以便將加密操作卸載給硬件加速器。
硬件加速器可以用來加速加密操作，並將 CPU 週期節省給其他任務。我們演示了使用 HAproxy 的設置，
它已經支持 OpenSSL 中的異步加密卸載。

<!--
The next steps for our team is to repeat the same for Envoy (with an OpenSSL based TLS transport socket built
as an extension). Furthermore, we are working to enhance Envoy to be able to [offload BoringSSL asynchronous
private key operations](https://github.com/envoyproxy/envoy/issues/6248) to a crypto acceleration hardware. Any review feedback or help is appreciated!
-->
我們團隊的下一步是對 Envoy 重複相同的步驟（使用一個基於 OpenSSL 的 TLS 傳輸套接字作爲擴展構建）。
此外，我們正在努力增強 Envoy 功能，使其能夠將
[BoringSSL 異步私鑰操作卸載](https://github.com/envoyproxy/envoy/issues/6248)到加密加速硬件。
感謝你的反饋和幫助！

<!--
How many CPU cycles can your crypto application save for other tasks when offloading crypto processing to a dedicated accelerator?
-->
當將加密處理卸載到專用加速器時，你的加密應用程序可以爲其他任務節省多少 CPU 週期？
