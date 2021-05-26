---
title: クラスターのネットワーク
content_type: concept
weight: 50
---

<!-- overview -->

ネットワークはKubernetesにおける中心的な部分ですが、どのように動作するかを正確に理解することは難解な場合もあります。
Kubernetesには、4つの異なる対応すべきネットワークの問題があります:

1. 高度に結合されたコンテナ間の通信: これは、{{< glossary_tooltip text="Pod" term_id="pod" >}}および`localhost`通信によって解決されます。
2. Pod間の通信: 本ドキュメントの主な焦点です。
3. Podからサービスへの通信：これは[Service](/ja/docs/concepts/services-networking/service/)でカバーされています。
4. 外部からサービスへの通信：これは[Service](/ja/docs/concepts/services-networking/service/)でカバーされています。




<!-- body -->

Kubernetesは、言ってしまえばアプリケーション間でマシンを共有するためのものです。通常、マシンを共有するには、2つのアプリケーションが同じポートを使用しないようにする必要があります。
複数の開発者間でポートを調整することは、大規模に行うことは非常に難しく、ユーザーが制御できないクラスターレベルの問題に見合うことがあります。

動的ポート割り当てはシステムに多くの複雑さをもたらします。すべてのアプリケーションはパラメータとしてポートを管理する必要があり、APIサーバーにて動的なポート番号を設定値として注入する方法が必要となり、各サービスはお互いにお互いを見つける方法が必要です。Kubernetesはこれに対処するのではなく、別のアプローチを取ります。

## Kubernetesのネットワークモデル {#the-kubernetes-network-model}

すべての`Pod`は独自のIPアドレスを持ちます。これは、`Pod`間のリンクを明示的に作成する必要がなく、コンテナポートをホストポートにマッピングする必要がほとんどないことを意味します。こうすることで、ポート割り当て、名前解決、サービスディスカバリー、負荷分散、アプリケーション設定、および移行の観点から、`Pod`をVMまたは物理ホストと同様に扱うことができる、クリーンで後方互換性のあるモデルを生み出しています。

Kubernetesは、ネットワークの実装に次の基本的な要件を課しています(意図的なネットワークセグメンテーションポリシーを除きます):

   * ノード上のPodが、NATなしですべてのノード上のすべてのPodと通信できること
   * systemdやkubeletなどノード上にあるエージェントが、そのノード上のすべてのPodと通信できること

注: ホストネットワークで実行される`Pod`をサポートするプラットフォームの場合(Linuxなど):

   * ノードのホストネットワーク内のPodは、NATなしですべてのノード上のすべてのPodと通信できます

このモデルは全体としてそれほど複雑ではないことに加え、KubernetesがVMからコンテナへのアプリへの移植を簡単にするという要望と基本的に互換性があります。ジョブがVMで実行されていた頃も、VMにはIPがあってプロジェクト内の他のVMと通信できました。これは同じ基本モデルです。

KubernetesのIPアドレスは`Pod`スコープに存在します。`Pod`内のコンテナは、IPアドレスとMACアドレスを含むネットワーク名前空間を共有します。これは、`Pod`内のコンテナがすべて`localhost`上の互いのポートに到達できることを意味します。また、`Pod`内のコンテナがポートの使用を調整する必要があることも意味しますが、これもVM内のプロセスと同じです。これのことを「IP-per-pod(Pod毎のIP)」モデルと呼びます。

この実装方法は実際に使われているコンテナランタイムの詳細部分です。

`Pod`に転送する`ノード`自体のポート(ホストポートと呼ばれる)を要求することは可能ですが、これは非常にニッチな操作です。このポート転送の実装方法も、コンテナランタイムの詳細部分です。`Pod`自体は、ホストポートの有無を認識しません。

## Kubernetesネットワークモデルの実装方法 {#how-to-implement-the-kubernetes-networking-model}

このネットワークモデルを実装する方法はいくつかあります。このドキュメントは、こうした方法を網羅的にはカバーしませんが、いくつかの技術の紹介として、また出発点として役立つことを願っています。

この一覧はアルファベット順にソートされており、順序は優先ステータスを意味するものではありません。

{{% thirdparty-content %}}

### ACI

[Cisco Application Centric Infrastructure](https://www.cisco.com/c/en/us/solutions/data-center-virtualization/application-centric-infrastructure/index.html) offers an integrated overlay and underlay SDN solution that supports containers, virtual machines, and bare metal servers.
[ACI](https://www.github.com/noironetworks/aci-containers) provides container networking integration for ACI.
An overview of the integration is provided [here](https://www.cisco.com/c/dam/en/us/solutions/collateral/data-center-virtualization/application-centric-infrastructure/solution-overview-c22-739493.pdf).

### Antrea

Project [Antrea](https://github.com/vmware-tanzu/antrea) is an opensource Kubernetes networking solution intended to be Kubernetes native.
It leverages Open vSwitch as the networking data plane.
Open vSwitch is a high-performance programmable virtual switch that supports both Linux and Windows.
Open vSwitch enables Antrea to implement Kubernetes Network Policies in a high-performance and efficient manner.
Thanks to the "programmable" characteristic of Open vSwitch, Antrea is able to implement an extensive set of networking and security features and services on top of Open vSwitch.

### AOS from Apstra

[AOS](https://www.apstra.com/products/aos/) is an Intent-Based Networking system that creates and manages complex datacenter environments from a simple integrated platform.  AOS leverages a highly scalable distributed design to eliminate network outages while minimizing costs.

The AOS Reference Design currently supports Layer-3 connected hosts that eliminate legacy Layer-2 switching problems.  These Layer-3 hosts can be Linux servers (Debian, Ubuntu, CentOS) that create BGP neighbor relationships directly with the top of rack switches (TORs).  AOS automates the routing adjacencies and then provides fine grained control over the route health injections (RHI) that are common in a Kubernetes deployment.

AOS has a rich set of REST API endpoints that enable Kubernetes to quickly change the network policy based on application requirements.  Further enhancements will integrate the AOS Graph model used for the network design with the workload provisioning, enabling an end to end management system for both private and public clouds.

AOS supports the use of common vendor equipment from manufacturers including Cisco, Arista, Dell, Mellanox, HPE, and a large number of white-box systems and open network operating systems like Microsoft SONiC, Dell OPX, and Cumulus Linux.

Details on how the AOS system works can be accessed here: https://www.apstra.com/products/how-it-works/

### AWS VPC CNI for Kubernetes

[AWS VPC CNI](https://github.com/aws/amazon-vpc-cni-k8s)は、Kubernetesクラスター向けの統合されたAWS Virtual Private Cloud(VPC)ネットワーキングを提供します。このCNIプラグインは、高いスループットと可用性、低遅延、および最小のネットワークジッタを提供します。さらに、ユーザーは、Kubernetesクラスターを構築するための既存のAWS VPCネットワーキングとセキュリティのベストプラクティスを適用できます。これには、ネットワークトラフィックの分離にVPCフローログ、VPCルーティングポリシー、およびセキュリティグループを使用する機能が含まれます。

このCNIプラグインを使用すると、Kubernetes PodはVPCネットワーク上と同じIPアドレスをPod内に持つことができます。CNIはAWS Elastic Networking Interface(ENI)を各Kubernetesノードに割り当て、ノード上のPodに各ENIのセカンダリIP範囲を使用します。このCNIには、Podの起動時間を短縮するためのENIとIPアドレスの事前割り当ての制御が含まれており、最大2,000ノードの大規模クラスターが可能です。

さらに、このCNIは[ネットワークポリシーの適用のためにCalico](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/calico.html)と一緒に実行できます。AWS VPC CNIプロジェクトは、[GitHubのドキュメント](https://github.com/aws/amazon-vpc-cni-k8s)とともにオープンソースで公開されています。

### Azure CNI for Kubernetes
[Azure CNI](https://docs.microsoft.com/en-us/azure/virtual-network/container-networking-overview) is an [open source](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md) plugin that integrates Kubernetes Pods with an Azure Virtual Network (also known as VNet) providing network performance at par with VMs. Pods can connect to peered VNet and to on-premises over Express Route or site-to-site VPN and are also directly reachable from these networks. Pods can access Azure services, such as storage and SQL, that are protected by Service Endpoints or Private Link. You can use VNet security policies and routing to filter Pod traffic. The plugin assigns VNet IPs to Pods by utilizing a pool of secondary IPs pre-configured on the Network Interface of a Kubernetes node.

Azure CNI is available natively in the [Azure Kubernetes Service (AKS)] (https://docs.microsoft.com/en-us/azure/aks/configure-azure-cni).


### Big Cloud Fabric from Big Switch Networks

[Big Cloud Fabric](https://www.bigswitch.com/container-network-automation) is a cloud native networking architecture, designed to run Kubernetes in private cloud/on-premises environments. Using unified physical & virtual SDN, Big Cloud Fabric tackles inherent container networking problems such as load balancing, visibility, troubleshooting, security policies & container traffic monitoring.

With the help of the Big Cloud Fabric's virtual pod multi-tenant architecture, container orchestration systems such as Kubernetes, RedHat OpenShift, Mesosphere DC/OS & Docker Swarm will be natively integrated alongside with VM orchestration systems such as VMware, OpenStack & Nutanix. Customers will be able to securely inter-connect any number of these clusters and enable inter-tenant communication between them if needed.

BCF was recognized by Gartner as a visionary in the latest [Magic Quadrant](https://go.bigswitch.com/17GatedDocuments-MagicQuadrantforDataCenterNetworking_Reg.html). One of the BCF Kubernetes on-premises deployments (which includes Kubernetes, DC/OS & VMware running on multiple DCs across different geographic regions) is also referenced [here](https://portworx.com/architects-corner-kubernetes-satya-komala-nio/).

### Calico

[Calico](https://docs.projectcalico.org/)は、コンテナ、仮想マシン、ホストベースのワークロードのためのオープンソースのネットワーク及びネットワークセキュリティのソリューションです。Calicoは、純粋なLinuxのeBPFデータプレーンや、Linuxの標準的なネットワークデータプレーン、WindowsのHNSデータプレーンを含む、複数のデータプレーンをサポートしています。Calicoは完全なネットワークスタックを提供していますが、[クラウドプロバイダーのCNI](https://docs.projectcalico.org/networking/determine-best-networking#calico-compatible-cni-plugins-and-cloud-provider-integrations)と組み合わせてネットワークポリシーを提供することもできます。

### Cilium

[Cilium](https://github.com/cilium/cilium) is open source software for
providing and transparently securing network connectivity between application
containers. Cilium is L7/HTTP aware and can enforce network policies on L3-L7
using an identity based security model that is decoupled from network
addressing, and it can be used in combination with other CNI plugins.

### CNI-Genie from Huawei

[CNI-Genie](https://github.com/Huawei-PaaS/CNI-Genie) is a CNI plugin that enables Kubernetes to [simultaneously have access to different implementations](https://github.com/Huawei-PaaS/CNI-Genie/blob/master/docs/multiple-cni-plugins/README.md#what-cni-genie-feature-1-multiple-cni-plugins-enables) of the [Kubernetes network model](/ja/docs/concepts/cluster-administration/networking/#the-kubernetes-network-model) in runtime. This includes any implementation that runs as a [CNI plugin](https://github.com/containernetworking/cni#3rd-party-plugins), such as [Flannel](https://github.com/coreos/flannel#flannel), [Calico](http://docs.projectcalico.org/), [Romana](http://romana.io), [Weave-net](https://www.weave.works/products/weave-net/).

CNI-Genie also supports [assigning multiple IP addresses to a pod](https://github.com/Huawei-PaaS/CNI-Genie/blob/master/docs/multiple-ips/README.md#feature-2-extension-cni-genie-multiple-ip-addresses-per-pod), each from a different CNI plugin.

### cni-ipvlan-vpc-k8s
[cni-ipvlan-vpc-k8s](https://github.com/lyft/cni-ipvlan-vpc-k8s) contains a set
of CNI and IPAM plugins to provide a simple, host-local, low latency, high
throughput, and compliant networking stack for Kubernetes within Amazon Virtual
Private Cloud (VPC) environments by making use of Amazon Elastic Network
Interfaces (ENI) and binding AWS-managed IPs into Pods using the Linux kernel's
IPvlan driver in L2 mode.

The plugins are designed to be straightforward to configure and deploy within a
VPC. Kubelets boot and then self-configure and scale their IP usage as needed
without requiring the often recommended complexities of administering overlay
networks, BGP, disabling source/destination checks, or adjusting VPC route
tables to provide per-instance subnets to each host (which is limited to 50-100
entries per VPC). In short, cni-ipvlan-vpc-k8s significantly reduces the
network complexity required to deploy Kubernetes at scale within AWS.

### Coil

[Coil](https://github.com/cybozu-go/coil)は、容易に連携できるよう設計されていて、フレキシブルなEgressネットワークを提供することができるCNIプラグインです。
Coilはベアメタルと比較して低いオーバーヘッドで操作することができ、また外部のネットワークへの任意のEgress NATゲートウェイを定義することができます。

### Contiv

[Contiv](https://github.com/contiv/netplugin) provides configurable networking (native l3 using BGP, overlay using vxlan,  classic l2, or Cisco-SDN/ACI) for various use cases. [Contiv](https://contiv.io) is all open sourced.

### Contrail / Tungsten Fabric

[Contrail](https://www.juniper.net/us/en/products-services/sdn/contrail/contrail-networking/), based on [Tungsten Fabric](https://tungsten.io), is a truly open, multi-cloud network virtualization and policy management platform. Contrail and Tungsten Fabric are integrated with various orchestration systems such as Kubernetes, OpenShift, OpenStack and Mesos, and provide different isolation modes for virtual machines, containers/pods and bare metal workloads.

### DANM

[DANM](https://github.com/nokia/danm) is a networking solution for telco workloads running in a Kubernetes cluster. It's built up from the following components:

   * A CNI plugin capable of provisioning IPVLAN interfaces with advanced features
   * An in-built IPAM module with the capability of managing multiple, cluster-wide, discontinuous L3 networks and provide a dynamic, static, or no IP allocation scheme on-demand
   * A CNI metaplugin capable of attaching multiple network interfaces to a container, either through its own CNI, or through delegating the job to any of the popular CNI solution like SRI-OV, or Flannel in parallel
   * A Kubernetes controller capable of centrally managing both VxLAN and VLAN interfaces of all Kubernetes hosts
   * Another Kubernetes controller extending Kubernetes' Service-based service discovery concept to work over all network interfaces of a Pod

With this toolset DANM is able to provide multiple separated network interfaces, the possibility to use different networking back ends and advanced IPAM features for the pods.

### Flannel

[Flannel](https://github.com/coreos/flannel#flannel) is a very simple overlay
network that satisfies the Kubernetes requirements. Many
people have reported success with Flannel and Kubernetes.

### Google Compute Engine (GCE)

For the Google Compute Engine cluster configuration scripts, [advanced
routing](https://cloud.google.com/vpc/docs/routes) is used to
assign each VM a subnet (default is `/24` - 254 IPs).  Any traffic bound for that
subnet will be routed directly to the VM by the GCE network fabric.  This is in
addition to the "main" IP address assigned to the VM, which is NAT'ed for
outbound internet access.  A linux bridge (called `cbr0`) is configured to exist
on that subnet, and is passed to docker's `--bridge` flag.

Docker is started with:

```shell
DOCKER_OPTS="--bridge=cbr0 --iptables=false --ip-masq=false"
```

This bridge is created by Kubelet (controlled by the `--network-plugin=kubenet`
flag) according to the `Node`'s `.spec.podCIDR`.

Docker will now allocate IPs from the `cbr-cidr` block.  Containers can reach
each other and `Nodes` over the `cbr0` bridge.  Those IPs are all routable
within the GCE project network.

GCE itself does not know anything about these IPs, though, so it will not NAT
them for outbound internet traffic.  To achieve that an iptables rule is used
to masquerade (aka SNAT - to make it seem as if packets came from the `Node`
itself) traffic that is bound for IPs outside the GCE project network
(10.0.0.0/8).

```shell
iptables -t nat -A POSTROUTING ! -d 10.0.0.0/8 -o eth0 -j MASQUERADE
```

Lastly IP forwarding is enabled in the kernel (so the kernel will process
packets for bridged containers):

```shell
sysctl net.ipv4.ip_forward=1
```

The result of all this is that all `Pods` can reach each other and can egress
traffic to the internet.

### Jaguar

[Jaguar](https://gitlab.com/sdnlab/jaguar) is an open source solution for Kubernetes's network based on OpenDaylight. Jaguar provides overlay network using vxlan and Jaguar CNIPlugin provides one IP address per pod.

### k-vswitch

[k-vswitch](https://github.com/k-vswitch/k-vswitch) is a simple Kubernetes networking plugin based on [Open vSwitch](https://www.openvswitch.org/). It leverages existing functionality in Open vSwitch to provide a robust networking plugin that is easy-to-operate, performant and secure.

### Knitter

[Knitter](https://github.com/ZTE/Knitter/) is a network solution which supports multiple networking in Kubernetes. It provides the ability of tenant management and network management. Knitter includes a set of end-to-end NFV container networking solutions besides multiple network planes, such as keeping IP address for applications, IP address migration, etc.

### Kube-OVN

[Kube-OVN](https://github.com/alauda/kube-ovn) is an OVN-based kubernetes network fabric for enterprises. With the help of OVN/OVS, it provides some advanced overlay network features like subnet, QoS, static IP allocation, traffic mirroring, gateway, openflow-based network policy and service proxy.

### Kube-router

[Kube-router](https://github.com/cloudnativelabs/kube-router) is a purpose-built networking solution for Kubernetes that aims to provide high performance and operational simplicity. Kube-router provides a Linux [LVS/IPVS](https://www.linuxvirtualserver.org/software/ipvs.html)-based service proxy, a Linux kernel forwarding-based pod-to-pod networking solution with no overlays, and iptables/ipset-based network policy enforcer.

### L2 networks and linux bridging

If you have a "dumb" L2 network, such as a simple switch in a "bare-metal"
environment, you should be able to do something similar to the above GCE setup.
Note that these instructions have only been tried very casually - it seems to
work, but has not been thoroughly tested.  If you use this technique and
perfect the process, please let us know.

Follow the "With Linux Bridge devices" section of
[this very nice tutorial](http://blog.oddbit.com/2014/08/11/four-ways-to-connect-a-docker/) from
Lars Kellogg-Stedman.

### Multus (a Multi Network plugin)

[Multus](https://github.com/Intel-Corp/multus-cni) is a Multi CNI plugin to support the Multi Networking feature in Kubernetes using CRD based network objects in Kubernetes.

Multus supports all [reference plugins](https://github.com/containernetworking/plugins) (eg. [Flannel](https://github.com/containernetworking/plugins/tree/master/plugins/meta/flannel), [DHCP](https://github.com/containernetworking/plugins/tree/master/plugins/ipam/dhcp), [Macvlan](https://github.com/containernetworking/plugins/tree/master/plugins/main/macvlan)) that implement the CNI specification and 3rd party plugins (eg. [Calico](https://github.com/projectcalico/cni-plugin), [Weave](https://github.com/weaveworks/weave), [Cilium](https://github.com/cilium/cilium), [Contiv](https://github.com/contiv/netplugin)). In addition to it, Multus supports [SRIOV](https://github.com/hustcat/sriov-cni), [DPDK](https://github.com/Intel-Corp/sriov-cni), [OVS-DPDK & VPP](https://github.com/intel/vhost-user-net-plugin) workloads in Kubernetes with both cloud native and NFV based applications in Kubernetes.

### OVN4NFV-K8s-Plugin (OVN based CNI controller & plugin)

[OVN4NFV-K8S-Plugin](https://github.com/opnfv/ovn4nfv-k8s-plugin) is OVN based CNI controller plugin to provide cloud native based Service function chaining(SFC), Multiple OVN overlay networking, dynamic subnet creation, dynamic creation of virtual networks, VLAN Provider network, Direct provider network and pluggable with other Multi-network plugins, ideal for edge based cloud native workloads in Multi-cluster networking

### NSX-T

[VMware NSX-T](https://docs.vmware.com/en/VMware-NSX-T/index.html) is a network virtualization and security platform. NSX-T can provide network virtualization for a multi-cloud and multi-hypervisor environment and is focused on emerging application frameworks and architectures that have heterogeneous endpoints and technology stacks. In addition to vSphere hypervisors, these environments include other hypervisors such as KVM, containers, and bare metal.

[NSX-T Container Plug-in (NCP)](https://docs.vmware.com/en/VMware-NSX-T/2.0/nsxt_20_ncp_kubernetes.pdf) provides integration between NSX-T and container orchestrators such as Kubernetes, as well as integration between NSX-T and container-based CaaS/PaaS platforms such as Pivotal Container Service (PKS) and OpenShift.

### Nuage Networks VCS (Virtualized Cloud Services)

[Nuage](https://www.nuagenetworks.net) provides a highly scalable policy-based Software-Defined Networking (SDN) platform. Nuage uses the open source Open vSwitch for the data plane along with a feature rich SDN Controller built on open standards.

The Nuage platform uses overlays to provide seamless policy-based networking between Kubernetes Pods and non-Kubernetes environments (VMs and bare metal servers). Nuage's policy abstraction model is designed with applications in mind and makes it easy to declare fine-grained policies for applications.The platform's real-time analytics engine enables visibility and security monitoring for Kubernetes applications.

### OpenVSwitch

[OpenVSwitch](https://www.openvswitch.org/) is a somewhat more mature but also
complicated way to build an overlay network.  This is endorsed by several of the
"Big Shops" for networking.

### OVN (Open Virtual Networking)

OVN is an opensource network virtualization solution developed by the
Open vSwitch community.  It lets one create logical switches, logical routers,
stateful ACLs, load-balancers etc to build different virtual networking
topologies.  The project has a specific Kubernetes plugin and documentation
at [ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes).

### Romana

[Romana](https://romana.io) is an open source network and security automation solution that lets you deploy Kubernetes without an overlay network. Romana supports Kubernetes [Network Policy](/docs/concepts/services-networking/network-policies/) to provide isolation across network namespaces.

### Weave Net from Weaveworks

[Weave Net](https://www.weave.works/products/weave-net/) is a
resilient and simple to use network for Kubernetes and its hosted applications.
Weave Net runs as a [CNI plug-in](https://www.weave.works/docs/net/latest/cni-plugin/)
or stand-alone.  In either version, it doesn't require any configuration or extra code
to run, and in both cases, the network provides one IP address per pod - as is standard for Kubernetes.


## {{% heading "whatsnext" %}}


ネットワークモデルの初期設計とその根拠、および将来の計画については、[ネットワーク設計ドキュメント](https://git.k8s.io/community/contributors/design-proposals/network/networking.md)で詳細に説明されています。
