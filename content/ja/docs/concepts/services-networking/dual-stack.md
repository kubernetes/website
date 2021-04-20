---
title: IPv4/IPv6デュアルスタック
feature:
  title: IPv4/IPv6デュアルスタック
  description: >
    IPv4およびIPv6のアドレスをPodとServiceに割り当てる
content_type: concept
weight: 70
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.16" state="alpha" >}}

 IPv4/IPv6デュアルスタックを利用すると、IPv4とIPv6のアドレスの両方を{{< glossary_tooltip text="Pod" term_id="pod" >}}および{{< glossary_tooltip text="Service" term_id="service" >}}に指定できるようになります。

 KubernetesクラスターでIPv4/IPv6デュアルスタックのネットワークを有効にすれば、クラスターはIPv4とIPv6のアドレスの両方を同時に割り当てることをサポートするようになります。

<!-- body -->

## サポートされている機能

KubernetesクラスターでIPv4/IPv6デュアルスタックを有効にすると、以下の機能が提供されます。

   * デュアルスタックのPodネットワーク(PodごとにIPv4とIPv6のアドレスが1つずつ割り当てられます)
   * IPv4およびIPv6が有効化されたService(各Serviceは1つのアドレスファミリーでなければなりません)
   * IPv4およびIPv6インターフェイスを経由したPodのクラスター外向きの(たとえば、インターネットへの)ルーティング

## 前提条件

IPv4/IPv6デュアルスタックのKubernetesクラスターを利用するには、以下の前提条件を満たす必要があります。

   * Kubernetesのバージョンが1.16以降である
   * プロバイダーがデュアルスタックのネットワークをサポートしている(クラウドプロバイダーなどが、ルーティング可能なIPv4/IPv6ネットワークインターフェイスが搭載されたKubernetesを提供可能である)
   * ネットワークプラグインがデュアルスタックに対応している(KubenetやCalicoなど)

## IPv4/IPv6デュアルスタックを有効にする

IPv4/IPv6デュアルスタックを有効にするには、クラスターの関連コンポーネントで`IPv6DualStack`[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)を有効にして、デュアルスタックのクラスターネットワークの割り当てを以下のように設定します。

   * kube-apiserver:
      * `--feature-gates="IPv6DualStack=true"`
      * `--service-cluster-ip-range=<IPv4 CIDR>,<IPv6 CIDR>
   * kube-controller-manager:
      * `--feature-gates="IPv6DualStack=true"`
      * `--cluster-cidr=<IPv4 CIDR>,<IPv6 CIDR>`
      * `--service-cluster-ip-range=<IPv4 CIDR>,<IPv6 CIDR>`
      * `--node-cidr-mask-size-ipv4|--node-cidr-mask-size-ipv6` デフォルトのサイズは、IPv4では/24、IPv6では/64です
   * kubelet:
      * `--feature-gates="IPv6DualStack=true"`
   * kube-proxy:
      * `--cluster-cidr=<IPv4 CIDR>,<IPv6 CIDR>`
      * `--feature-gates="IPv6DualStack=true"`

{{< note >}}
IPv4 CIDRの例: `10.244.0.0/16` (自分のクラスターのアドレス範囲を指定してください)

IPv6 CIDRの例: `fdXY:IJKL:MNOP:15::/64` (これはフォーマットを示すための例であり、有効なアドレスではありません。詳しくは[RFC 4193](https://tools.ietf.org/html/rfc4193)を参照してください)

{{< /note >}}

## Service

クラスターでIPv4/IPv6デュアルスタックのネットワークを有効にした場合、IPv4またはIPv6のいずれかのアドレスを持つ{{< glossary_tooltip text="Service" term_id="service" >}}を作成できます。Serviceのcluster IPのアドレスファミリーは、Service上に`.spec.ipFamily`フィールドを設定することで選択できます。このフィールドを設定できるのは、新しいServiceの作成時のみです。`.spec.ipFamily`フィールドの指定はオプションであり、{{< glossary_tooltip text="Service" term_id="service" >}}と{{< glossary_tooltip text="Ingress" term_id="ingress" >}}でIPv4とIPv6を有効にする予定がある場合にのみ使用するべきです。このフィールドの設定は、[外向きのトラフィック](#egress-traffic)に対する要件には含まれません。

{{< note >}}
クラスターのデフォルトのアドレスファミリーは、kube-controller-managerに`--service-cluster-ip-range`フラグで設定した、最初のservice cluster IPの範囲のアドレスファミリーです。
{{< /note >}}

`.spec.ipFamily`は、次のいずれかに設定できます。

   * `IPv4`: APIサーバーは`ipv4`の`service-cluster-ip-range`の範囲からIPアドレスを割り当てます
   * `IPv6`: APIサーバーは`ipv6`の`service-cluster-ip-range`の範囲からIPアドレスを割り当てます

次のServiceのspecには`ipFamily`フィールドが含まれていません。Kubernetesは、最初に設定した`service-cluster-ip-range`の範囲からこのServiceにIPアドレス(別名「cluster IP」)を割り当てます。

{{< codenew file="service/networking/dual-stack-default-svc.yaml" >}}

次のServiceのspecには`ipFamily`フィールドが含まれています。Kubernetesは、最初に設定した`service-cluster-ip-range`の範囲からこのServiceにIPv6のアドレス(別名「cluster IP」)を割り当てます。

{{< codenew file="service/networking/dual-stack-ipv6-svc.yaml" >}}

比較として次のServiceのspecを見ると、このServiceには最初に設定した`service-cluster-ip-range`の範囲からIPv4のアドレス(別名「cluster IP」)が割り当てられます。

{{< codenew file="service/networking/dual-stack-ipv4-svc.yaml" >}}

### Type LoadBalancer

IPv6が有効になった外部ロードバランサーをサポートしているクラウドプロバイダーでは、`type`フィールドに`LoadBalancer`を指定し、`ipFamily`フィールドに`IPv6`を指定することにより、クラウドロードバランサーをService向けにプロビジョニングできます。

## 外向きのトラフィック {#egress-traffic}

パブリックおよび非パブリックでのルーティングが可能なIPv6アドレスのブロックを利用するためには、クラスターがベースにしている{{< glossary_tooltip text="CNI" term_id="cni" >}}プロバイダーがIPv6の転送を実装している必要があります。もし非パブリックでのルーティングが可能なIPv6アドレスを使用するPodがあり、そのPodをクラスター外の送信先(例:パブリックインターネット)に到達させたい場合、外向きのトラフィックと応答の受信のためにIPマスカレードを設定する必要があります。[ip-masq-agent](https://github.com/kubernetes-sigs/ip-masq-agent)はデュアルスタックに対応しているため、デュアルスタックのクラスター上でのIPマスカレードにはip-masq-agentが利用できます。

## 既知の問題

   * Kubenetは、IPv4,IPv6の順番にIPを報告することを強制します(--cluster-cidr)

## {{% heading "whatsnext" %}}

* [IPv4/IPv6デュアルスタックのネットワークを検証する](/docs/tasks/network/validate-dual-stack)
