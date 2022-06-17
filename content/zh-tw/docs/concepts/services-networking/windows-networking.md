---
title: Windows 網路
content_type: concept
weight: 75
---
<!--
reviewers:
- aravindhp
- jayunit100
- jsturtevant
- marosset
title: Networking on Windows
content_type: concept
weight: 75
-->
<!-- overview -->
<!--
Kubernetes supports running nodes on either Linux or Windows. You can mix both kinds of node within a single cluster.
This page provides an overview to networking specific to the Windows operating system.
-->
Kubernetes 支援執行 Linux 或 Windows 節點。
你可以在統一叢集內混布這兩種節點。
本頁提供了特定於 Windows 作業系統的網路概述。

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

Windows 容器網路透過 [CNI 外掛](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)暴露。
Windows 容器網路的工作方式與虛擬機器類似。
每個容器都有一個連線到 Hyper-V 虛擬交換機（vSwitch）的虛擬網路介面卡（vNIC）。
主機網路服務（Host Networking Service，HNS）和主機計算服務（Host Comute Service，HCS）
協同建立容器並將容器 vNIC 掛接到網路。
HCS 負責管理容器，而 HNS 負責管理以下網路資源：

* 虛擬網路（包括建立 vSwitch）
* Endpoint / vNIC
* 名稱空間
* 包括資料包封裝、負載均衡規則、ACL 和 NAT 規則在內的策略。

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
Windows HNS 和 vSwitch 實現名稱空間劃分，且可以按需為 Pod 或容器建立虛擬 NIC。
然而，諸如 DNS、路由和指標等許多配置將存放在 Windows 登錄檔資料庫中，
而不是像 Linux 將這些配置作為檔案存放在 `/etc` 內。
針對容器的 Windows 登錄檔與主機的登錄檔是分開的，因此將 `/etc/resolv.conf`
從主機對映到一個容器的類似概念與 Linux 上的效果不同。
這些必須使用容器環境中執行的 Windows API 進行配置。
因此，實現 CNI 時需要呼叫 HNS，而不是依賴檔案對映將網路詳情傳遞到 Pod 或容器中。

<!--
## Network modes

Windows supports five different networking drivers/modes: L2bridge, L2tunnel,
Overlay (Beta), Transparent, and NAT. In a heterogeneous cluster with Windows and Linux
worker nodes, you need to select a networking solution that is compatible on both
Windows and Linux. The following table lists the out-of-tree plugins are supported on Windows,
with recommendations on when to use each CNI:
-->
## 網路模式 {#network-mode}

Windows 支援五種不同的網路驅動/模式：L2bridge、L2tunnel、Overlay (Beta)、Transparent 和 NAT。
在 Windows 和 Linux 工作節點組成的異構叢集中，你需要選擇一個同時相容 Windows 和 Linux 的網路方案。
下表列出了 Windows 支援的樹外外掛，並給出了何時使用每種 CNI 的建議：

<!--
| Network Driver | Description | Container Packet Modifications | Network Plugins | Network Plugin Characteristics |
| -------------- | ----------- | ------------------------------ | --------------- | ------------------------------ |
| L2bridge       | Containers are attached to an external vSwitch. Containers are attached to the underlay network, although the physical network doesn't need to learn the container MACs because they are rewritten on ingress/egress. | MAC is rewritten to host MAC, IP may be rewritten to host IP using HNS OutboundNAT policy. | [win-bridge](https://github.com/containernetworking/plugins/tree/master/plugins/main/windows/win-bridge), [Azure-CNI](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md), Flannel host-gateway uses win-bridge | win-bridge uses L2bridge network mode, connects containers to the underlay of hosts, offering best performance. Requires user-defined routes (UDR) for inter-node connectivity. |
| L2Tunnel | This is a special case of l2bridge, but only used on Azure. All packets are sent to the virtualization host where SDN policy is applied. | MAC rewritten, IP visible on the underlay network | [Azure-CNI](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md) | Azure-CNI allows integration of containers with Azure vNET, and allows them to leverage the set of capabilities that [Azure Virtual Network provides](https://azure.microsoft.com/en-us/services/virtual-network/). For example, securely connect to Azure services or use Azure NSGs. See [azure-cni for some examples](https://docs.microsoft.com/azure/aks/concepts-network#azure-cni-advanced-networking) |
| Overlay | Containers are given a vNIC connected to an external vSwitch. Each overlay network gets its own IP subnet, defined by a custom IP prefix.The overlay network driver uses VXLAN encapsulation. | Encapsulated with an outer header. | [win-overlay](https://github.com/containernetworking/plugins/tree/master/plugins/main/windows/win-overlay), Flannel VXLAN (uses win-overlay) | win-overlay should be used when virtual container networks are desired to be isolated from underlay of hosts (e.g. for security reasons). Allows for IPs to be re-used for different overlay networks (which have different VNID tags)  if you are restricted on IPs in your datacenter.  This option requires [KB4489899](https://support.microsoft.com/help/4489899) on Windows Server 2019. |
| Transparent (special use case for [ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes)) | Requires an external vSwitch. Containers are attached to an external vSwitch which enables intra-pod communication via logical networks (logical switches and routers). | Packet is encapsulated either via [GENEVE](https://datatracker.ietf.org/doc/draft-gross-geneve/) or [STT](https://datatracker.ietf.org/doc/draft-davie-stt/) tunneling to reach pods which are not on the same host.  <br/> Packets are forwarded or dropped via the tunnel metadata information supplied by the ovn network controller. <br/> NAT is done for north-south communication. | [ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes) | [Deploy via ansible](https://github.com/openvswitch/ovn-kubernetes/tree/master/contrib). Distributed ACLs can be applied via Kubernetes policies. IPAM support. Load-balancing can be achieved without kube-proxy. NATing is done without using iptables/netsh. |
| NAT (*not used in Kubernetes*) | Containers are given a vNIC connected to an internal vSwitch. DNS/DHCP is provided using an internal component called [WinNAT](https://techcommunity.microsoft.com/t5/virtualization/windows-nat-winnat-capabilities-and-limitations/ba-p/382303) | MAC and IP is rewritten to host MAC/IP. | [nat](https://github.com/Microsoft/windows-container-networking/tree/master/plugins/nat) | Included here for completeness |
-->
| 網路驅動 | 描述 | 容器資料包修改 | 網路外掛 | 網路外掛特點 |
| -------------- | ----------- | ------------------------------ | --------------- | ------------------------------ |
| L2bridge       | 容器掛接到一個外部 vSwitch。容器掛接到下層網路，但物理網路不需要了解容器的 MAC，因為這些 MAC 在入站/出站時被重寫。 | MAC 被重寫為主機 MAC，可使用 HNS OutboundNAT 策略將 IP 重寫為主機 IP。 | [win-bridge](https://github.com/containernetworking/plugins/tree/master/plugins/main/windows/win-bridge)、[Azure-CNI](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md)、Flannel host-gateway 使用 win-bridge| win-bridge 使用 L2bridge 網路模式，將容器連線到主機的下層，提供最佳效能。節點間連線需要使用者定義的路由（UDR）。 |
| L2Tunnel | 這是 L2bridge 的一種特例，但僅用在 Azure 上。所有資料包都會被髮送到應用了 SDN 策略的虛擬化主機。 | MAC 被重寫，IP 在下層網路上可見。| [Azure-CNI](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md) | Azure-CNI 允許將容器整合到 Azure vNET，允許容器充分利用 [Azure 虛擬網路](https://azure.microsoft.com/zh-cn/services/virtual-network/)所提供的能力集合。例如，安全地連線到 Azure 服務或使用 Azure NSG。參考 [azure-cni 瞭解有關示例](https://docs.microsoft.com/zh-cn/azure/aks/concepts-network#azure-cni-advanced-networking)。 |
| Overlay | 容器被賦予一個 vNIC，連線到外部 vSwitch。每個上層網路都有自己的 IP 子網，由自定義 IP 字首進行定義。該上層網路驅動使用 VXLAN 封裝。 | 用外部頭進行封裝。 | [win-overlay](https://github.com/containernetworking/plugins/tree/master/plugins/main/windows/win-overlay)、Flannel VXLAN（使用 win-overlay） | 當需要將虛擬容器網路與主機的下層隔離時（例如出於安全原因），應使用 win-overlay。如果你的資料中心的 IP 個數有限，可以將 IP 在不同的上層網路中重用（帶有不同的 VNID 標記）。在 Windows Server 2019 上這個選項需要 [KB4489899](https://support.microsoft.com/zh-cn/help/4489899)。 |
| Transparent（[ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes) 的特殊用例） | 需要一個外部 vSwitch。容器掛接到一個外部 vSwitch，由後者透過邏輯網路（邏輯交換機和路由器）實現 Pod 內通訊。 | 資料包透過 [GENEVE](https://datatracker.ietf.org/doc/draft-gross-geneve/) 或 [STT](https://datatracker.ietf.org/doc/draft-davie-stt/) 隧道進行封裝，以到達其它主機上的 Pod。  <br/> 資料包基於 OVN 網路控制器提供的隧道元資料資訊被轉發或丟棄。<br/>南北向通訊使用 NAT。 | [ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes) | [透過 ansible 部署](https://github.com/openvswitch/ovn-kubernetes/tree/master/contrib)。透過 Kubernetes 策略可以實施分散式 ACL。支援 IPAM。無需 kube-proxy 即可實現負載均衡。無需 iptables/netsh 即可進行 NAT。 |
| NAT（**Kubernetes 中未使用**） | 容器被賦予一個 vNIC，連線到內部 vSwitch。DNS/DHCP 是使用一個名為 [WinNAT 的內部元件](https://techcommunity.microsoft.com/t5/virtualization/windows-nat-winnat-capabilities-and-limitations/ba-p/382303)實現的 | MAC 和 IP 重寫為主機 MAC/IP。 | [nat](https://github.com/Microsoft/windows-container-networking/tree/master/plugins/nat) | 放在此處保持完整性。 |

<!--
As outlined above, the [Flannel](https://github.com/coreos/flannel)
[CNI plugin](https://github.com/flannel-io/cni-plugin)
is also [supported](https://github.com/flannel-io/cni-plugin#windows-support-experimental) on Windows via the
[VXLAN network backend](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan) (**Beta support** ; delegates to win-overlay)
and [host-gateway network backend](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#host-gw) (stable support; delegates to win-bridge).
-->
如上所述，Windows 透過 [VXLAN 網路後端](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan)（**Beta 支援**；委派給 win-overlay）
和 [host-gateway 網路後端](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#host-gw)（穩定支援；委派給 win-bridge）
也[支援](https://github.com/flannel-io/cni-plugin#windows-support-experimental) [Flannel](https://github.com/coreos/flannel) 的 [CNI 外掛](https://github.com/flannel-io/cni-plugin)。

<!--
This plugin supports delegating to one of the reference CNI plugins (win-overlay,
win-bridge), to work in conjunction with Flannel daemon on Windows (Flanneld) for
automatic node subnet lease assignment and HNS network creation. This plugin reads
in its own configuration file (cni.conf), and aggregates it with the environment
variables from the FlannelD generated subnet.env file. It then delegates to one of
the reference CNI plugins for network plumbing, and sends the correct configuration
containing the node-assigned subnet to the IPAM plugin (for example: `host-local`).
-->
此外掛支援委派給參考 CNI 外掛（win-overlay、win-bridge）之一，配合使用 Windows
上的 Flannel 守護程式（Flanneld），以便自動分配節點子網租賃並建立 HNS 網路。
該外掛讀取自己的配置檔案（cni.conf），並聚合 FlannelD 生成的 subnet.env 檔案中的環境變數。
然後，委派給網路管道的參考 CNI 外掛之一，並將包含節點分配子網的正確配置傳送給 IPAM 外掛（例如：`host-local`）。

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
對於 Node、Pod 和 Service 物件，TCP/UDP 流量支援以下網路流：

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

Windows 支援以下 IPAM 選項：

* [host-local](https://github.com/containernetworking/plugins/tree/master/plugins/ipam/host-local)
* [azure-vnet-ipam](https://github.com/Azure/azure-container-networking/blob/master/docs/ipam.md)（僅適用於 azure-cni）
* [Windows Server IPAM](https://docs.microsoft.com/zh-cn/windows-server/networking/technologies/ipam/ipam-top)（未設定 IPAM 時的回滾選項）

<!--
## Load balancing and Services

A Kubernetes {{< glossary_tooltip text="Service" term_id="service" >}} is an abstraction
that defines a logical set of Pods and a means to access them over a network.
In a cluster that includes Windows nodes, you can use the following types of Service:
-->
## 負載均衡和 Service {#load-balancing-and-services}

Kubernetes {{< glossary_tooltip text="Service" term_id="service" >}} 是一種抽象：定義了邏輯上的一組 Pod 和一種透過網路訪問這些 Pod 的方式。
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
Windows 容器網路與 Linux 網路有著很重要的差異。
更多細節和背景資訊，參考 [Microsoft Windows 容器網路文件](https://docs.microsoft.com/zh-cn/virtualization/windowscontainers/container-networking/architecture)。

在 Windows 上，你可以使用以下設定來配置 Service 和負載均衡行為：

<!--
{{< table caption="Windows Service Settings" >}}
| Feature | Description | Minimum Supported Windows OS build | How to enable |
| ------- | ----------- | -------------------------- | ------------- |
| Session affinity | Ensures that connections from a particular client are passed to the same Pod each time. | Windows Server 2022 | Set `service.spec.sessionAffinity` to "ClientIP" |
| Direct Server Return (DSR) | Load balancing mode where the IP address fixups and the LBNAT occurs at the container vSwitch port directly; service traffic arrives with the source IP set as the originating pod IP. | Windows Server 2019 | Set the following flags in kube-proxy: `--feature-gates="WinDSR=true" --enable-dsr=true` |
| Preserve-Destination | Skips DNAT of service traffic, thereby preserving the virtual IP of the target service in packets reaching the backend Pod. Also disables node-node forwarding. | Windows Server, version 1903 | Set `"preserve-destination": "true"` in service annotations and enable DSR in kube-proxy. |
| IPv4/IPv6 dual-stack networking | Native IPv4-to-IPv4 in parallel with IPv6-to-IPv6 communications to, from, and within a cluster | Windows Server 2019 | See [IPv4/IPv6 dual-stack](#ipv4ipv6-dual-stack) |
| Client IP preservation | Ensures that source IP of incoming ingress traffic gets preserved. Also disables node-node forwarding. |  Windows Server 2019  | Set `service.spec.externalTrafficPolicy` to "Local" and enable DSR in kube-proxy |
{{< /table >}}
-->
{{< table caption="Windows Service 設定" >}}
| 功能特性 | 描述 | 支援的 Windows 作業系統最低版本 | 啟用方式 |
| ------- | ----------- | -------------------------- | ------------- |
| 會話親和性 | 確保每次都將來自特定客戶端的連線傳遞到同一個 Pod。 | Windows Server 2022 | 將 `service.spec.sessionAffinity` 設為 “ClientIP” |
| Direct Server Return (DSR) | 在負載均衡模式中 IP 地址修正和 LBNAT 直接發生在容器 vSwitch 埠；服務流量到達時源 IP 設定為原始 Pod IP。 | Windows Server 2019 | 在 kube-proxy 中設定以下標誌：`--feature-gates="WinDSR=true" --enable-dsr=true` |
| 保留目標（Preserve-Destination） | 跳過服務流量的 DNAT，從而在到達後端 Pod 的資料包中保留目標服務的虛擬 IP。也會禁用節點間的轉發。 | Windows Server，version 1903 | 在服務註解中設定 `"preserve-destination": "true"` 並在 kube-proxy 中啟用 DSR。 |
| IPv4/IPv6 雙棧網路 | 進出叢集和叢集內通訊都支援原生的 IPv4 間與 IPv6 間流量 | Windows Server 2019 | 參考 [IPv4/IPv6 雙棧](#ipv4ipv6-dual-stack)。 |
| 客戶端 IP 保留 | 確保入站流量的源 IP 得到保留。也會禁用節點間轉發。 |  Windows Server 2019  | 將 `service.spec.externalTrafficPolicy` 設定為 “Local” 並在 kube-proxy 中啟用 DSR。 |
{{< /table >}}

<!--
There are known issue with NodePort Services on overlay networking, if the destination node is running Windows Server 2022.
To avoid the issue entirely, you can configure the service with `externalTrafficPolicy: Local`.

There are known issues with Pod to Pod connectivity on l2bridge network on Windows Server 2022 with KB5005619 or higher installed.
To workaround the issue and restore Pod to Pod connectivity, you can disable the WinDSR feature in kube-proxy.

These issues require OS fixes.
Please follow https://github.com/microsoft/Windows-Containers/issues/204 for updates.
-->
{{< warning >}} 
如果目的地節點在執行 Windows Server 2022，則上層網路的 NodePort Service 存在已知問題。
要完全避免此問題，可以使用 `externalTrafficPolicy: Local` 配置服務。

在安裝了 KB5005619 的 Windows Server 2022 或更高版本上，採用 L2bridge 網路時
Pod 間連線存在已知問題。
要解決此問題並恢復 Pod 間連線，你可以在 kube-proxy 中禁用 WinDSR 功能。

這些問題需要作業系統修復。
有關更新，請參考 https://github.com/microsoft/Windows-Containers/issues/204。
{{< /warning >}}

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

Windows 節點**不支援**以下網路功能：

* 主機網路模式
* 從節點本身訪問本地 NodePort（可以從其他節點或外部客戶端進行訪問）
* 為同一 Service 提供 64 個以上後端 Pod（或不同目的地址）
* 在連線到上層網路的 Windows Pod 之間使用 IPv6 通訊
* 非 DSR 模式中的本地流量策略（Local Traffic Policy）

<!--
* Outbound communication using the ICMP protocol via the `win-overlay`, `win-bridge`, or using the Azure-CNI plugin.\
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
* 透過 `win-overlay`、`win-bridge` 使用 ICMP 協議，或使用 Azure-CNI 外掛進行出站通訊。  
  具體而言，Windows 資料平面（[VFP](https://www.microsoft.com/research/project/azure-virtual-filtering-platform/)）不支援 ICMP 資料包轉換，這意味著：
  * 指向同一網路內目的地址的 ICMP 資料包（例如 Pod 間的 ping 通訊）可正常工作；
  * TCP/UDP 資料包可正常工作；
  * 透過遠端網路指向其它地址的 ICMP 資料包（例如透過 ping 從 Pod 到外部公網的通訊）無法被轉換，
    因此無法被路由回到這些資料包的源點；
  * 由於 TCP/UDP 資料包仍可被轉換，所以在除錯與外界的連線時，
    你可以將 `ping <destination>` 替換為 `curl <destination>`。

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

* 由於缺少 `CHECK` 實現，Windows 參考網路外掛 win-bridge 和 win-overlay 未實現
[CNI 規約](https://github.com/containernetworking/cni/blob/master/SPEC.md) 的 v0.4.0 版本。
* Flannel VXLAN CNI 外掛在 Windows 上有以下限制：
  * 使用 Flannel v0.12.0（或更高版本）時，節點到 Pod 的連線僅適用於本地 Pod。
  * Flannel 僅限於使用 VNI 4096 和 UDP 埠 4789。
  有關這些引數的更多詳細資訊，請參考官方的 [Flannel VXLAN](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan) 後端文件。
