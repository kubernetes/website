---
title: アドオンのインストール
content_type: concept
---

<!-- overview -->

{{% thirdparty-content %}}

アドオンはKubernetesの機能を拡張するものです。

このページでは、利用可能なアドオンの一部の一覧と、それぞれのアドオンのインストール方法へのリンクを提供します。

<!-- body -->

## ネットワークとネットワークポリシー

* [ACI](https://www.github.com/noironetworks/aci-containers)は、統合されたコンテナネットワークとネットワークセキュリティをCisco ACIを使用して提供します。
* [Antrea](https://antrea.io/)は、L3またはL4で動作して、Open vSwitchをネットワークデータプレーンとして活用する、Kubernetes向けのネットワークとセキュリティサービスを提供します。
* [Calico](https://docs.projectcalico.org/latest/introduction/)はネットワークとネットワークプリシーのプロバイダーです。Calicoは、BGPを使用または未使用の非オーバーレイおよびオーバーレイネットワークを含む、フレキシブルなさまざまなネットワークオプションをサポートします。Calicoはホスト、Pod、そして(IstioとEnvoyを使用している場合には)サービスメッシュ上のアプリケーションに対してネットワークポリシーを強制するために、同一のエンジンを使用します。
* [Canal](https://github.com/tigera/canal/tree/master/k8s-install)はFlannelとCalicoをあわせたもので、ネットワークとネットワークポリシーを提供します。
* [Cilium](https://github.com/cilium/cilium)は、L3のネットワークとネットワークポリシーのプラグインで、HTTP/API/L7のポリシーを透過的に強制できます。ルーティングとoverlay/encapsulationモードの両方をサポートしており、他のCNIプラグイン上で機能できます。
* [CNI-Genie](https://github.com/Huawei-PaaS/CNI-Genie)は、KubernetesをCalico、Canal、Flannel、Romana、Weaveなど選択したCNIプラグインをシームレスに接続できるようにするプラグインです。
* [Contiv](https://contiv.github.io)は、さまざまなユースケースと豊富なポリシーフレームワーク向けに設定可能なネットワーク(BGPを使用したネイティブのL3、vxlanを使用したオーバーレイ、古典的なL2、Cisco-SDN/ACI)を提供します。Contivプロジェクトは完全に[オープンソース](https://github.com/contiv)です。[インストーラ](https://github.com/contiv/install)はkubeadmとkubeadm以外の両方をベースとしたインストールオプションがあります。
* [Contrail](https://www.juniper.net/us/en/products-services/sdn/contrail/contrail-networking/)は、[Tungsten Fabric](https://tungsten.io)をベースにしている、オープンソースでマルチクラウドに対応したネットワーク仮想化およびポリシー管理プラットフォームです。ContrailおよびTungsten Fabricは、Kubernetes、OpenShift、OpenStack、Mesosなどのオーケストレーションシステムと統合されており、仮想マシン、コンテナ/Pod、ベアメタルのワークロードに隔離モードを提供します。
* [Flannel](https://github.com/coreos/flannel/blob/master/Documentation/kubernetes.md)は、Kubernetesで使用できるオーバーレイネットワークプロバイダーです。
* [Knitter](https://github.com/ZTE/Knitter/)は、1つのKubernetes Podで複数のネットワークインターフェイスをサポートするためのプラグインです。
* [Multus](https://github.com/Intel-Corp/multus-cni)は、すべてのCNIプラグイン(たとえば、Calico、Cilium、Contiv、Flannel)に加えて、SRIOV、DPDK、OVS-DPDK、VPPをベースとするKubernetes上のワークロードをサポートする、複数のネットワークサポートのためのマルチプラグインです。
* [OVN-Kubernetes](https://github.com/ovn-org/ovn-kubernetes/)は、Open vSwitch(OVS)プロジェクトから生まれた仮想ネットワーク実装である[OVN(Open Virtual Network)](https://github.com/ovn-org/ovn/)をベースとする、Kubernetesのためのネットワークプロバイダです。OVN-Kubernetesは、OVSベースのロードバランサーおよびネットワークポリシーの実装を含む、Kubernetes向けのオーバーレイベースのネットワーク実装を提供します。
* [OVN4NFV-K8S-Plugin](https://github.com/opnfv/ovn4nfv-k8s-plugin)は、クラウドネイティブベースのService function chaining(SFC)、Multiple OVNオーバーレイネットワーク、動的なサブネットの作成、動的な仮想ネットワークの作成、VLANプロバイダーネットワーク、Directプロバイダーネットワークを提供し、他のMulti-networkプラグインと付け替え可能なOVNベースのCNIコントローラープラグインです。
* [NSX-T](https://docs.vmware.com/en/VMware-NSX-T/2.0/nsxt_20_ncp_kubernetes.pdf) Container Plug-in(NCP)は、VMware NSX-TとKubernetesなどのコンテナオーケストレーター間のインテグレーションを提供します。また、NSX-Tと、Pivotal Container Service(PKS)とOpenShiftなどのコンテナベースのCaaS/PaaSプラットフォームとのインテグレーションも提供します。
* [Nuage](https://github.com/nuagenetworks/nuage-kubernetes/blob/v5.1.1-1/docs/kubernetes-1-installation.rst)は、Kubernetes Podと非Kubernetes環境間で可視化とセキュリティモニタリングを使用してポリシーベースのネットワークを提供するSDNプラットフォームです。
* [Romana](https://romana.io)は、[NetworkPolicy API](/docs/concepts/services-networking/network-policies/)もサポートするPodネットワーク向けのL3のネットワークソリューションです。Kubeadmアドオンのインストールの詳細は[こちら](https://github.com/romana/romana/tree/master/containerize)で確認できます。
* [Weave Net](https://www.weave.works/docs/net/latest/kubernetes/kube-addon/)は、ネットワークパーティションの両面で機能し、外部データベースを必要とせずに、ネットワークとネットワークポリシーを提供します。

## サービスディスカバリ

* [CoreDNS](https://coredns.io)は、フレキシブルで拡張可能なDNSサーバーです。Pod向けのクラスター内DNSとして[インストール](https://github.com/coredns/deployment/tree/master/kubernetes)できます。

## 可視化と制御

* [Dashboard](https://github.com/kubernetes/dashboard#kubernetes-dashboard)はKubernetes向けのダッシュボードを提供するウェブインターフェイスです。
* [Weave Scope](https://www.weave.works/documentation/scope-latest-installing/#k8s)は、コンテナ、Pod、Serviceなどをグラフィカルに可視化するツールです。[Weave Cloud account](https://cloud.weave.works/)と組み合わせて使うか、UIを自分でホストして使います。

## インフラストラクチャ

* [KubeVirt](https://kubevirt.io/user-guide/#/installation/installation)は仮想マシンをKubernetes上で実行するためのアドオンです。通常、ベアメタルのクラスタで実行します。

## レガシーなアドオン

いくつかのアドオンは、廃止された[cluster/addons](https://git.k8s.io/kubernetes/cluster/addons)ディレクトリに掲載されています。

よくメンテナンスされたアドオンはここにリンクしてください。PRを歓迎しています。
