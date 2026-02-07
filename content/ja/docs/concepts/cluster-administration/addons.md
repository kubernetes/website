---
title: アドオンのインストール
content_type: concept
weight: 150
---

<!-- overview -->

{{% thirdparty-content %}}

アドオンはKubernetesの機能を拡張するものです。

このページでは、利用可能なアドオンの一部の一覧と、それぞれのアドオンのインストール方法へのリンクを提供します。
この一覧は、すべてを網羅するものではありません。

<!-- body -->

## ネットワークとネットワークポリシー {#networking-and-network-policy}

* [ACI](https://www.github.com/noironetworks/aci-containers)は、統合されたコンテナネットワークとネットワークセキュリティをCisco ACIを使用して提供します。
* [Antrea](https://antrea.io/)は、L3またはL4で動作して、Open vSwitchをネットワークデータプレーンとして活用する、Kubernetes向けのネットワークとセキュリティサービスを提供します。
  Antreaは[SandboxレベルのCNCFプロジェクト](https://www.cncf.io/projects/antrea/)です。
* [Calico](https://www.tigera.io/project-calico/)は、ネットワーキングおよびネットワークポリシーのプロバイダーです。
  Calicoは柔軟なネットワーキングオプションをサポートしており、BGPの有無を含む非オーバーレイネットワークやオーバーレイネットワークなど、状況に応じて最も効率的なオプションを選択できます。
  Calicoは、ホスト、Pod、および(IstioとEnvoyを使用している場合)サービスメッシュレイヤーのアプリケーションに対して、同じエンジンを使用してネットワークポリシーを適用します。
* [Canal](https://projectcalico.docs.tigera.io/getting-started/kubernetes/flannel/flannel)はFlannelとCalicoをあわせたもので、ネットワークとネットワークポリシーを提供します。
* [Cilium](https://github.com/cilium/cilium)は、eBPFベースのデータプレーンを備えたネットワーク、可観測性、およびセキュリティのソリューションです。
  Ciliumは、ネイティブなルーティングまたはoverlay/encapsulationモードのいずれかを用いて複数のクラスターにまたがることができる、シンプルでフラットなL3ネットワークを提供します。
  また、ネットワークのアドレス指定から切り離されたアイデンティティベースのセキュリティモデルを使用して、L3からL7のネットワークポリシーを適用することができます。
  Ciliumはkube-proxyの代替として機能し、オプトインにて可観測性およびセキュリティ機能も追加で提供しています。
  Ciliumは[GraduatedレベルのCNCFプロジェクト](https://www.cncf.io/projects/cilium/)です。
* [CNI-Genie](https://github.com/cni-genie/CNI-Genie)は、KubernetesをCalico、Canal、Flannel、Weaveなど選択したCNIプラグインをシームレスに接続できるようにするプラグインです。
  CNI-Genieは[SandboxレベルのCNCFプロジェクト](https://www.cncf.io/projects/cni-genie/)です。
* [Contiv](https://contivpp.io/)は、さまざまなユースケースと豊富なポリシーフレームワーク向けに設定可能なネットワーク(BGPを使用したネイティブのL3、vxlanを使用したオーバーレイ、古典的なL2、Cisco-SDN/ACI)を提供します。
  Contivプロジェクトは完全に[オープンソース](https://github.com/contiv)です。
  [インストーラー](https://github.com/contiv/install)はkubeadmとkubeadm以外の両方をベースとしたインストールオプションがあります。
* [Contrail](https://www.juniper.net/us/en/products-services/sdn/contrail/contrail-networking/)は、[Tungsten Fabric](https://tungsten.io)をベースにしている、オープンソースでマルチクラウドに対応したネットワーク仮想化およびポリシー管理プラットフォームです。
  ContrailおよびTungsten Fabricは、Kubernetes、OpenShift、OpenStack、Mesosなどのオーケストレーションシステムと統合されており、仮想マシン、コンテナ/Pod、ベアメタルのワークロードに隔離モードを提供します。
* [Flannel](https://github.com/flannel-io/flannel#deploying-flannel-manually)は、Kubernetesで使用できるオーバーレイネットワークプロバイダーです。
* [Gateway API](/docs/concepts/services-networking/gateway/)は、[SIG Network](https://github.com/kubernetes/community/tree/master/sig-network)コミュニティによって管理されているオープンソースプロジェクトで、サービスネットワーキングをモデル化するための表現力豊かで拡張可能、かつロール指向のAPIを提供します。
* [Knitter](https://github.com/ZTE/Knitter/)は、1つのKubernetes Podで複数のネットワークインターフェースをサポートするためのプラグインです。
* [Multus](https://github.com/k8snetworkplumbingwg/multus-cni)は、すべてのCNIプラグイン(たとえば、Calico、Cilium、Contiv、Flannel)に加えて、SRIOV、DPDK、OVS-DPDK、VPPをベースとするKubernetes上のワークロードをサポートする、複数のネットワークサポートのためのマルチプラグインです。
* [OVN-Kubernetes](https://github.com/ovn-org/ovn-kubernetes/)は、Open vSwitch(OVS)プロジェクトから生まれた仮想ネットワーク実装である[OVN(Open Virtual Network)](https://github.com/ovn-org/ovn/)をベースとする、Kubernetesのためのネットワークプロバイダーです。
  OVN-Kubernetesは、OVSベースのロードバランサーおよびネットワークポリシーの実装を含む、Kubernetes向けのオーバーレイベースのネットワーク実装を提供します。
* [Nodus](https://github.com/akraino-edge-stack/icn-nodus)は、OVNベースのCNIコントローラープラグインで、クラウドネイティブベースのService function chaining(SFC)を提供します。
* [NSX-T](https://docs.vmware.com/en/VMware-NSX-T-Data-Center/index.html) Container Plug-in(NCP)は、VMware NSX-TとKubernetesなどのコンテナオーケストレーター間のインテグレーションを提供します。
  また、NSX-Tと、Pivotal Container Service(PKS)とOpenShiftなどのコンテナベースのCaaS/PaaSプラットフォームとのインテグレーションも提供します。
* [Nuage](https://github.com/nuagenetworks/nuage-kubernetes/blob/v5.1.1-1/docs/kubernetes-1-installation.rst)は、Kubernetes Podと非Kubernetes環境間で可視化とセキュリティモニタリングを使用してポリシーベースのネットワークを提供するSDNプラットフォームです。
* [Romana](https://github.com/romana)は、[NetworkPolicy](/docs/concepts/services-networking/network-policies/) APIもサポートするPodネットワーク向けのL3のネットワークソリューションです。
* [Spiderpool](https://github.com/spidernet-io/spiderpool)は、Kubernetes向けのアンダーレイおよびRDMAネットワークソリューションです。
  Spiderpoolは、ベアメタル、仮想マシン、パブリッククラウド環境でサポートされています。
* [Terway](https://github.com/AliyunContainerService/terway/)は、AlibabaCloudのVPCおよびECSネットワーク製品をベースとしたCNIプラグインの一式です。
  AlibabaCloud環境でネイティブVPCネットワーキングとネットワークポリシーを提供します。
* [Weave Net](https://github.com/rajch/weave#using-weave-on-kubernetes)は、ネットワークパーティションの両面で機能し、外部データベースを必要とせずに、ネットワークとネットワークポリシーを提供します。

## サービスディスカバリ {#service-discovery}

* [CoreDNS](https://coredns.io)は、フレキシブルで拡張可能なDNSサーバーです。
  Pod向けのクラスター内DNSとして[インストール](https://github.com/coredns/helm)できます。

## 可視化と制御 {#visualization-amp-control}

* [Dashboard](https://github.com/kubernetes/dashboard#kubernetes-dashboard)はKubernetes向けのダッシュボードを提供するウェブインターフェースです。
* [Headlamp](https://headlamp.dev/)は、拡張可能なKubernetesのUIです。
  クラスター内にデプロイすることや、デスクトップアプリケーションとして使用することができます。

## インフラストラクチャ {#infrastructure}

* [KubeVirt](https://kubevirt.io/user-guide/#/installation/installation)は仮想マシンをKubernetes上で実行するためのアドオンです。
  通常、ベアメタルのクラスターで実行します。
* [node problem detector](https://github.com/kubernetes/node-problem-detector)はLinuxノード上で動作し、システムの問題を[Event](/docs/reference/kubernetes-api/cluster-resources/event-v1/)または[ノードのCondition](/docs/concepts/architecture/nodes/#condition)として報告します。

## 計測 {#instrumentation}

* [kube-state-metrics](/docs/concepts/cluster-administration/kube-state-metrics)

## レガシーなアドオン {#legacy-add-ons}

いくつかのアドオンは、廃止された[cluster/addons](https://git.k8s.io/kubernetes/cluster/addons)ディレクトリに掲載されています。

よくメンテナンスされたアドオンはここにリンクしてください。
PRを歓迎しています。
