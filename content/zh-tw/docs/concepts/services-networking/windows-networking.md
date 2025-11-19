---
title: Windows 網路
content_type: concept
weight: 110
---
<!--
reviewers:
- aravindhp
- jayunit100
- jsturtevant
- marosset
title: Networking on Windows
content_type: concept
weight: 110
-->
<!-- overview -->
<!--
Kubernetes supports running nodes on either Linux or Windows. You can mix both kinds of node within a single cluster.
This page provides an overview to networking specific to the Windows operating system.
-->
Kubernetes 支持運行 Linux 或 Windows 節點。
你可以在統一叢集內混布這兩種節點。
本頁提供了特定於 Windows 操作系統的網路概述。

<!-- body -->
<!--
## Container networking on Windows {#networking}

Networking for Windows containers is exposed through
[CNI plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/).
Windows containers function similarly to virtual machines in regards to
networking. Each container has a virtual network adapter (vNIC) which is connected
to a Hyper-V virtual switch (vSwitch). The Host Networking Service (HNS) and the
Host Compute Service (HCS) work together to create containers and attach container
vNICs to networks. HCS is responsible for the management of containers whereas HNS
is responsible for the management of networking resources such as:

* Virtual networks (including creation of vSwitches)
* Endpoints / vNICs
* Namespaces
* Policies including packet encapsulations, load-balancing rules, ACLs, and NAT rules.
-->
## Windows 容器網路 {#networking}

Windows 容器網路通過 [CNI 插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)暴露。
Windows 容器網路的工作方式與虛擬機類似。
每個容器都有一個連接到 Hyper-V 虛擬交換機（vSwitch）的虛擬網路適配器（vNIC）。
主機網路服務（Host Networking Service，HNS）和主機計算服務（Host Compute Service，HCS）
協同創建容器並將容器 vNIC 掛接到網路。
HCS 負責管理容器，而 HNS 負責管理以下網路資源：

* 虛擬網路（包括創建 vSwitch）
* Endpoint / vNIC
* 命名空間
* 包括數據包封裝、負載均衡規則、ACL 和 NAT 規則在內的策略。

<!--
The Windows HNS and vSwitch implement namespacing and can
create virtual NICs as needed for a pod or container. However, many configurations such
as DNS, routes, and metrics are stored in the Windows registry database rather than as
files inside `/etc`, which is how Linux stores those configurations. The Windows registry for the container
is separate from that of the host, so concepts like mapping `/etc/resolv.conf` from
the host into a container don't have the same effect they would on Linux. These must
be configured using Windows APIs run in the context of that container. Therefore
CNI implementations need to call the HNS instead of relying on file mappings to pass
network details into the pod or container.
-->
Windows HNS 和 vSwitch 實現命名空間劃分，且可以按需爲 Pod 或容器創建虛擬 NIC。
然而，諸如 DNS、路由和指標等許多設定將存放在 Windows 註冊表數據庫中，
而不是像 Linux 將這些設定作爲文件存放在 `/etc` 內。
針對容器的 Windows 註冊表與主機的註冊表是分開的，因此將 `/etc/resolv.conf`
從主機映射到一個容器的類似概念與 Linux 上的效果不同。
這些必須使用容器環境中運行的 Windows API 進行設定。
因此，實現 CNI 時需要調用 HNS，而不是依賴文件映射將網路詳情傳遞到 Pod 或容器中。

<!--
## Network modes

Windows supports five different networking drivers/modes: L2bridge, L2tunnel,
Overlay (Beta), Transparent, and NAT. In a heterogeneous cluster with Windows and Linux
worker nodes, you need to select a networking solution that is compatible on both
Windows and Linux. The following table lists the out-of-tree plugins are supported on Windows,
with recommendations on when to use each CNI:
-->
## 網路模式 {#network-mode}

Windows 支持五種不同的網路驅動/模式：L2bridge、L2tunnel、Overlay (Beta)、Transparent 和 NAT。
在 Windows 和 Linux 工作節點組成的異構叢集中，你需要選擇一個同時兼容 Windows 和 Linux 的網路方案。
下表列出了 Windows 支持的樹外插件，並給出了何時使用每種 CNI 的建議：

<!--
| Network Driver | Description | Container Packet Modifications | Network Plugins | Network Plugin Characteristics |
| -------------- | ----------- | ------------------------------ | --------------- | ------------------------------ |
| L2bridge       | Containers are attached to an external vSwitch. Containers are attached to the underlay network, although the physical network doesn't need to learn the container MACs because they are rewritten on ingress/egress. | MAC is rewritten to host MAC, IP may be rewritten to host IP using HNS OutboundNAT policy. | [win-bridge](https://www.cni.dev/plugins/current/main/win-bridge/), [Azure-CNI](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md), [Flannel host-gateway](https://github.com/flannel-io/flannel/blob/master/Documentation/backends.md#host-gw) uses win-bridge | win-bridge uses L2bridge network mode, connects containers to the underlay of hosts, offering best performance. Requires user-defined routes (UDR) for inter-node connectivity. |
| L2Tunnel | This is a special case of l2bridge, but only used on Azure. All packets are sent to the virtualization host where SDN policy is applied. | MAC rewritten, IP visible on the underlay network | [Azure-CNI](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md) | Azure-CNI allows integration of containers with Azure vNET, and allows them to leverage the set of capabilities that [Azure Virtual Network provides](https://azure.microsoft.com/en-us/services/virtual-network/). For example, securely connect to Azure services or use Azure NSGs. See [azure-cni for some examples](https://docs.microsoft.com/azure/aks/concepts-network#azure-cni-advanced-networking) |
| Overlay | Containers are given a vNIC connected to an external vSwitch. Each overlay network gets its own IP subnet, defined by a custom IP prefix.The overlay network driver uses VXLAN encapsulation. | Encapsulated with an outer header. | [win-overlay](https://www.cni.dev/plugins/current/main/win-overlay/), [Flannel VXLAN](https://github.com/flannel-io/flannel/blob/master/Documentation/backends.md#vxlan) (uses win-overlay) | win-overlay should be used when virtual container networks are desired to be isolated from underlay of hosts (e.g. for security reasons). Allows for IPs to be re-used for different overlay networks (which have different VNID tags)  if you are restricted on IPs in your datacenter.  This option requires [KB4489899](https://support.microsoft.com/help/4489899) on Windows Server 2019. |
| Transparent (special use case for [ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes)) | Requires an external vSwitch. Containers are attached to an external vSwitch which enables intra-pod communication via logical networks (logical switches and routers). | Packet is encapsulated either via [GENEVE](https://datatracker.ietf.org/doc/draft-gross-geneve/) or [STT](https://datatracker.ietf.org/doc/draft-davie-stt/) tunneling to reach pods which are not on the same host.  <br/> Packets are forwarded or dropped via the tunnel metadata information supplied by the ovn network controller. <br/> NAT is done for north-south communication. | [ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes) | [Deploy via ansible](https://github.com/openvswitch/ovn-kubernetes/tree/master/contrib). Distributed ACLs can be applied via Kubernetes policies. IPAM support. Load-balancing can be achieved without kube-proxy. NATing is done without using iptables/netsh. |
| NAT (*not used in Kubernetes*) | Containers are given a vNIC connected to an internal vSwitch. DNS/DHCP is provided using an internal component called [WinNAT](https://techcommunity.microsoft.com/t5/virtualization/windows-nat-winnat-capabilities-and-limitations/ba-p/382303) | MAC and IP is rewritten to host MAC/IP. | [nat](https://github.com/Microsoft/windows-container-networking/tree/master/plugins/nat) | Included here for completeness |
-->
| 網路驅動 | 描述 | 容器數據包修改 | 網路插件 | 網路插件特點 |
| -------------- | ----------- | ------------------------------ | --------------- | ------------------------------ |
| L2bridge       | 容器掛接到一個外部 vSwitch。容器掛接到下層網路，但物理網路不需要了解容器的 MAC，因爲這些 MAC 在入站/出站時被重寫。 | MAC 被重寫爲主機 MAC，可使用 HNS OutboundNAT 策略將 IP 重寫爲主機 IP。 | [win-bridge](https://www.cni.dev/plugins/current/main/win-bridge/), [Azure-CNI](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md), [Flannel host-gateway](https://github.com/flannel-io/flannel/blob/master/Documentation/backends.md#host-gw) 使用 win-bridge| win-bridge 使用 L2bridge 網路模式，將容器連接到主機的下層，提供最佳性能。節點間連接需要使用者定義的路由（UDR）。 |
| L2Tunnel | 這是 L2bridge 的一種特例，但僅用在 Azure 上。所有數據包都會被髮送到應用了 SDN 策略的虛擬化主機。 | MAC 被重寫，IP 在下層網路上可見。| [Azure-CNI](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md) | Azure-CNI 允許將容器集成到 Azure vNET，允許容器充分利用 [Azure 虛擬網路](https://azure.microsoft.com/zh-cn/services/virtual-network/)所提供的能力集合。例如，安全地連接到 Azure 服務或使用 Azure NSG。參考 [azure-cni 瞭解有關示例](https://docs.microsoft.com/zh-cn/azure/aks/concepts-network#azure-cni-advanced-networking)。 |
| Overlay | 容器被賦予一個 vNIC，連接到外部 vSwitch。每個上層網路都有自己的 IP 子網，由自定義 IP 前綴進行定義。該上層網路驅動使用 VXLAN 封裝。 | 用外部頭進行封裝。 | [win-overlay](https://www.cni.dev/plugins/current/main/win-overlay/), [Flannel VXLAN](https://github.com/flannel-io/flannel/blob/master/Documentation/backends.md#vxlan)（使用 win-overlay） | 當需要將虛擬容器網路與主機的下層隔離時（例如出於安全原因），應使用 win-overlay。如果你的數據中心的 IP 個數有限，可以將 IP 在不同的上層網路中重用（帶有不同的 VNID 標記）。在 Windows Server 2019 上這個選項需要 [KB4489899](https://support.microsoft.com/zh-cn/help/4489899)。 |
| Transparent（[ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes) 的特殊用例） | 需要一個外部 vSwitch。容器掛接到一個外部 vSwitch，由後者通過邏輯網路（邏輯交換機和路由器）實現 Pod 內通信。 | 數據包通過 [GENEVE](https://datatracker.ietf.org/doc/draft-gross-geneve/) 或 [STT](https://datatracker.ietf.org/doc/draft-davie-stt/) 隧道進行封裝，以到達其它主機上的 Pod。  <br/> 數據包基於 OVN 網路控制器提供的隧道元數據信息被轉發或丟棄。<br/>南北向通信使用 NAT。 | [ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes) | [通過 ansible 部署](https://github.com/openvswitch/ovn-kubernetes/tree/master/contrib)。通過 Kubernetes 策略可以實施分佈式 ACL。支持 IPAM。無需 kube-proxy 即可實現負載均衡。無需 iptables/netsh 即可進行 NAT。 |
| NAT（**Kubernetes 中未使用**） | 容器被賦予一個 vNIC，連接到內部 vSwitch。DNS/DHCP 是使用一個名爲 [WinNAT 的內部組件](https://techcommunity.microsoft.com/t5/virtualization/windows-nat-winnat-capabilities-and-limitations/ba-p/382303)實現的 | MAC 和 IP 重寫爲主機 MAC/IP。 | [nat](https://github.com/Microsoft/windows-container-networking/tree/master/plugins/nat) | 放在此處保持完整性。 |

<!--
As outlined above, the [Flannel](https://github.com/coreos/flannel)
[CNI plugin](https://github.com/flannel-io/cni-plugin)
is also [supported](https://github.com/flannel-io/cni-plugin#windows-support-experimental) on Windows via the
[VXLAN network backend](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan) (**Beta support** ; delegates to win-overlay)
and [host-gateway network backend](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#host-gw) (stable support; delegates to win-bridge).
-->
如上所述，Windows 通過 [VXLAN 網路後端](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan)（**Beta 支持**；委派給 win-overlay）
和 [host-gateway 網路後端](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#host-gw)（穩定支持；委派給 win-bridge）
也[支持](https://github.com/flannel-io/cni-plugin#windows-support-experimental) [Flannel](https://github.com/coreos/flannel) 的 [CNI 插件](https://github.com/flannel-io/cni-plugin)。

<!--
This plugin supports delegating to one of the reference CNI plugins (win-overlay,
win-bridge), to work in conjunction with Flannel daemon on Windows (Flanneld) for
automatic node subnet lease assignment and HNS network creation. This plugin reads
in its own configuration file (cni.conf), and aggregates it with the environment
variables from the FlannelD generated subnet.env file. It then delegates to one of
the reference CNI plugins for network plumbing, and sends the correct configuration
containing the node-assigned subnet to the IPAM plugin (for example: `host-local`).
-->
此插件支持委派給參考 CNI 插件（win-overlay、win-bridge）之一，配合使用 Windows
上的 Flannel 守護程序（Flanneld），以便自動分配節點子網租賃並創建 HNS 網路。
該插件讀取自己的設定文件（cni.conf），並聚合 FlannelD 生成的 subnet.env 文件中的環境變量。
然後，委派給網路管道的參考 CNI 插件之一，並將包含節點分配子網的正確設定發送給 IPAM 插件（例如：`host-local`）。

<!--
For Node, Pod, and Service objects, the following network flows are supported for
TCP/UDP traffic:

* Pod → Pod (IP)
* Pod → Pod (Name)
* Pod → Service (Cluster IP)
* Pod → Service (PQDN, but only if there are no ".")
* Pod → Service (FQDN)
* Pod → external (IP)
* Pod → external (DNS)
* Node → Pod
* Pod → Node
-->
對於 Node、Pod 和 Service 對象，TCP/UDP 流量支持以下網路流：

* Pod → Pod（IP）
* Pod → Pod（名稱）
* Pod → Service（叢集 IP）
* Pod → Service（PQDN，但前提是沒有 "."）
* Pod → Service（FQDN）
* Pod → 外部（IP）
* Pod → 外部（DNS）
* Node → Pod
* Pod → Node

<!--
## IP address management (IPAM) {#ipam}

The following IPAM options are supported on Windows:

* [host-local](https://github.com/containernetworking/plugins/tree/master/plugins/ipam/host-local)
* [azure-vnet-ipam](https://github.com/Azure/azure-container-networking/blob/master/docs/ipam.md) (for azure-cni only)
* [Windows Server IPAM](https://docs.microsoft.com/windows-server/networking/technologies/ipam/ipam-top) (fallback option if no IPAM is set)
-->
## IP 地址管理（IPAM） {#ipam}

Windows 支持以下 IPAM 選項：

* [host-local](https://github.com/containernetworking/plugins/tree/master/plugins/ipam/host-local)
* [azure-vnet-ipam](https://github.com/Azure/azure-container-networking/blob/master/docs/ipam.md)（僅適用於 azure-cni）
* [Windows Server IPAM](https://docs.microsoft.com/zh-cn/windows-server/networking/technologies/ipam/ipam-top)（未設置 IPAM 時的回滾選項）

<!--
## Direct Server Return (DSR) {#dsr}
-->
## 直接伺服器返回（DSR）{#dsr}

{{< feature-state feature_gate_name="WinDSR" >}}

<!--
Load balancing mode where the IP address fixups and the LBNAT occurs at the container vSwitch port directly;
service traffic arrives with the source IP set as the originating pod IP.
This provides performance optimizations by allowing the return traffic routed through load balancers
to bypass the load balancer and respond directly to the client;
reducing load on the load balancer and also reducing overall latency.
For more information, read
[Direct Server Return (DSR) in a nutshell](https://techcommunity.microsoft.com/blog/networkingblog/direct-server-return-dsr-in-a-nutshell/693710).
-->
在負載均衡模式中 IP 地址修正和 LBNAT 直接發生在容器 vSwitch 端口；服務流量到達時源 IP 被設置爲原始 Pod IP。
這種模式通過允許返回流量繞過負載均衡器，直接響應客戶端，從而實現性能優化；
這不僅減輕了負載均衡器的壓力，還降低了整體延遲。更多信息請參閱
[Direct Server Return (DSR) 簡介](https://techcommunity.microsoft.com/blog/networkingblog/direct-server-return-dsr-in-a-nutshell/693710)。

<!--
## Load balancing and Services

A Kubernetes {{< glossary_tooltip text="Service" term_id="service" >}} is an abstraction
that defines a logical set of Pods and a means to access them over a network.
In a cluster that includes Windows nodes, you can use the following types of Service:
-->
## 負載均衡和 Service {#load-balancing-and-services}

Kubernetes {{< glossary_tooltip text="Service" term_id="service" >}} 是一種抽象：定義了邏輯上的一組 Pod 和一種通過網路訪問這些 Pod 的方式。
在包含 Windows 節點的叢集中，你可以使用以下類別的 Service：

* `NodePort`
* `ClusterIP`
* `LoadBalancer`
* `ExternalName`

<!--
Windows container networking differs in some important ways from Linux networking.
The [Microsoft documentation for Windows Container Networking](https://docs.microsoft.com/en-us/virtualization/windowscontainers/container-networking/architecture)
provides additional details and background.

On Windows, you can use the following settings to configure Services and load
balancing behavior:
-->
Windows 容器網路與 Linux 網路有着很重要的差異。
更多細節和背景信息，參考 [Microsoft Windows 容器網路文檔](https://docs.microsoft.com/zh-cn/virtualization/windowscontainers/container-networking/architecture)。

在 Windows 上，你可以使用以下設置來設定 Service 和負載均衡行爲：

<!--
{{< table caption="Windows Service Settings" >}}
| Feature | Description | Minimum Supported Windows OS build | How to enable |
| ------- | ----------- | -------------------------- | ------------- |
| Session affinity | Ensures that connections from a particular client are passed to the same Pod each time. | Windows Server 2022 | Set `service.spec.sessionAffinity` to "ClientIP" |
| Direct Server Return (DSR) | See [DSR](#dsr) notes above. | Windows Server 2019 | Set the following command line argument (assuming version {{< skew currentVersion >}}): ` --enable-dsr=true` |
| Preserve-Destination | Skips DNAT of service traffic, thereby preserving the virtual IP of the target service in packets reaching the backend Pod. Also disables node-node forwarding. | Windows Server, version 1903 | Set `"preserve-destination": "true"` in service annotations and enable DSR in kube-proxy. |
| IPv4/IPv6 dual-stack networking | Native IPv4-to-IPv4 in parallel with IPv6-to-IPv6 communications to, from, and within a cluster | Windows Server 2019 | See [IPv4/IPv6 dual-stack](/docs/concepts/services-networking/dual-stack/#windows-support) |
| Client IP preservation | Ensures that source IP of incoming ingress traffic gets preserved. Also disables node-node forwarding. |  Windows Server 2019  | Set `service.spec.externalTrafficPolicy` to "Local" and enable DSR in kube-proxy |
{{< /table >}}
-->
{{< table caption="Windows Service 設置" >}}
| 功能特性 | 描述 | 支持的 Windows 操作系統最低版本 | 啓用方式 |
| ------- | ----------- | -------------------------- | ------------- |
| 會話親和性 | 確保每次都將來自特定客戶端的連接傳遞到同一個 Pod。 | Windows Server 2022 | 將 `service.spec.sessionAffinity` 設爲 “ClientIP” |
| Direct Server Return (DSR) | 參見上文 [DSR](#dsr) 說明。 | Windows Server 2019 | 設置以下命令列參數（假設版本 {{< skew currentVersion >}}）：` --enable-dsr=true` |
| 保留目標（Preserve-Destination） | 跳過服務流量的 DNAT，從而在到達後端 Pod 的數據包中保留目標服務的虛擬 IP。也會禁用節點間的轉發。 | Windows Server，version 1903 | 在服務註解中設置 `"preserve-destination": "true"` 並在 kube-proxy 中啓用 DSR。 |
| IPv4/IPv6 雙棧網路 | 進出叢集和叢集內通信都支持原生的 IPv4 間與 IPv6 間流量 | Windows Server 2019 | 參考 [IPv4/IPv6 雙棧](/zh-cn/docs/concepts/services-networking/dual-stack/#windows-support)。 |
| 客戶端 IP 保留 | 確保入站流量的源 IP 得到保留。也會禁用節點間轉發。 |  Windows Server 2019  | 將 `service.spec.externalTrafficPolicy` 設置爲 “Local” 並在 kube-proxy 中啓用 DSR。 |
{{< /table >}}

<!--
## Limitations

The following networking functionality is _not_ supported on Windows nodes:

* Host networking mode
* Local NodePort access from the node itself (works for other nodes or external clients)
* More than 64 backend pods (or unique destination addresses) for a single Service
* IPv6 communication between Windows pods connected to overlay networks
* Local Traffic Policy in non-DSR mode
-->
## 限制 {#limitations}

Windows 節點**不支持**以下網路功能：

* 主機網路模式
* 從節點本身訪問本地 NodePort（可以從其他節點或外部客戶端進行訪問）
* 爲同一 Service 提供 64 個以上後端 Pod（或不同目的地址）
* 在連接到上層網路的 Windows Pod 之間使用 IPv6 通信
* 非 DSR 模式中的本地流量策略（Local Traffic Policy）

<!--
* Outbound communication using the ICMP protocol via the `win-overlay`, `win-bridge`, or using the Azure-CNI plugin.
  Specifically, the Windows data plane ([VFP](https://www.microsoft.com/research/project/azure-virtual-filtering-platform/))
  doesn't support ICMP packet transpositions, and this means:
  * ICMP packets directed to destinations within the same network (such as pod to pod communication via ping) 
    work as expected;
  * TCP/UDP packets work as expected;
  * ICMP packets directed to pass through a remote network (e.g. pod to external internet communication via ping) 
    cannot be transposed and thus will not be routed back to their source;
  * Since TCP/UDP packets can still be transposed, you can substitute `ping <destination>` with
    `curl <destination>` when debugging connectivity with the outside world.
-->
* 通過 `win-overlay`、`win-bridge` 使用 ICMP 協議，或使用 Azure-CNI 插件進行出站通信。  
  具體而言，Windows 數據平面（[VFP](https://www.microsoft.com/research/project/azure-virtual-filtering-platform/)）不支持 ICMP 數據包轉換，這意味着：
  * 指向同一網路內目的地址的 ICMP 數據包（例如 Pod 間的 ping 通信）可正常工作；
  * TCP/UDP 數據包可正常工作；
  * 通過遠程網路指向其它地址的 ICMP 數據包（例如通過 ping 從 Pod 到外部公網的通信）無法被轉換，
    因此無法被路由回到這些數據包的源點；
  * 由於 TCP/UDP 數據包仍可被轉換，所以在調試與外界的連接時，
    你可以將 `ping <destination>` 替換爲 `curl <destination>`。

<!--
Other limitations:

* Windows reference network plugins win-bridge and win-overlay do not implement
  [CNI spec](https://github.com/containernetworking/cni/blob/master/SPEC.md) v0.4.0,
  due to a missing `CHECK` implementation.
* The Flannel VXLAN CNI plugin has the following limitations on Windows:
  * Node-pod connectivity is only possible for local pods with Flannel v0.12.0 (or higher).
  * Flannel is restricted to using VNI 4096 and UDP port 4789. See the official
    [Flannel VXLAN](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan)
    backend docs for more details on these parameters.
-->
其他限制：

* 由於缺少 `CHECK` 實現，Windows 參考網路插件 win-bridge 和 win-overlay 未實現
[CNI 規約](https://github.com/containernetworking/cni/blob/master/SPEC.md) 的 v0.4.0 版本。
* Flannel VXLAN CNI 插件在 Windows 上有以下限制：
  * 使用 Flannel v0.12.0（或更高版本）時，節點到 Pod 的連接僅適用於本地 Pod。
  * Flannel 僅限於使用 VNI 4096 和 UDP 端口 4789。
  有關這些參數的更多詳細信息，請參考官方的 [Flannel VXLAN](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan) 後端文檔。
