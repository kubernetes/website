---
title: ServiceのClusterIPの割り当て
content_type: concept
weight: 120
---


<!-- overview -->

Kubernetesでは、[Service](/ja/docs/concepts/services-networking/service/)はPodの集合上で実行しているアプリケーションを抽象的に公開する方法です。Serviceはクラスター内で仮想IPアドレス(type: ClusterIPのServiceを使用)を持つことができます。クライアントはその仮想IPアドレスを使用してServiceに接続することができます。そしてKubernetesは、そのServiceへのトラフィックを異なる背後のPod間で負荷分散します。

<!-- body -->

## どのようにServiceのClusterIPが割り当てられるのか？

KubernetesがServiceに仮想IPアドレスを割り当てる必要がある場合、2つの方法の内どちらかの方法で行われます:

_動的割り当て_
: クラスターのコントロールプレーンは自動的に`type: ClusterIP`のServiceのために設定されたIP範囲の中から未割り当てのIPアドレスを選びます。

_静的割り当て_
: Serviceのために設定されたIP範囲の中から自身でIPアドレスを選びます。

クラスター全体を通して、Serviceの`ClusterIP`はユニークでなければいけません。割り当て済みの`ClusterIP`を使用してServiceを作成しようとするとエラーが返ってきます。

## なぜServiceのClusterIPを予約する必要があるのか？

時には、クラスター内の他のコンポーネントやユーザーが利用できるように、Serviceをよく知られたIPアドレスで実行したい場合があります。

その最たる例がクラスターのDNS Serviceです。慣習として、一部のKubernetesインストーラーはServiceのIP範囲の10番目のIPアドレスをDNS Serviceに割り当てます。ServiceのIP範囲を10.96.0.0/16とするクラスターを構成し、DNS ServiceのIPを10.96.0.10にするとします。この場合、下記のようなServiceを作成する必要があります。

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    k8s-app: kube-dns
    kubernetes.io/cluster-service: "true"
    kubernetes.io/name: CoreDNS
  name: kube-dns
  namespace: kube-system
spec:
  clusterIP: 10.96.0.10
  ports:
  - name: dns
    port: 53
    protocol: UDP
    targetPort: 53
  - name: dns-tcp
    port: 53
    protocol: TCP
    targetPort: 53
  selector:
    k8s-app: kube-dns
  type: ClusterIP
```

しかし、前述したように10.96.0.10のIPアドレスは予約されていません。他のServiceが動的割り当てよりも前に、または同時に作成された場合、このIPアドレスがそのServiceに割り当てられる可能性があります。その場合、競合エラーで失敗しDNS Serviceを作成することができません。

## どのようにServiceのClusterIPの競合を回避するのか？ {#avoid-ClusterIP-conflict}

Kubernetesで実装されているServiceへのClusterIPの割り当て戦略は、衝突リスクを軽減します。

`ClusterIP`の範囲は、`min(max(16, cidrSize / 16), 256)`という式に基づいて分割されます。_最小で16、最大でも256で、その範囲内で段階的に変化する_ ように表されます。

動的IP割り当てはデフォルトで上位の帯域を使用し、それが使い切られると下位の範囲を使用します。これにより、ユーザーは下位の帯域を使用して静的な割り当てを行うことができ、衝突のリスクを抑えることができます。


## 例 {#allocation-examples}

### 例1 {#allocation-example-1}

この例ではServiceのIPアドレスとして、10.96.0.0/24(CIDR表記法)のIPアドレスの範囲を使用します。

範囲の大きさ: 2<sup>8</sup> - 2 = 254
帯域のオフセット(開始位置): `min(max(16, 256/16), 256)` = `min(16, 256)` = 16
静的割り当ての帯域の開始: 10.96.0.1
静的割り当ての帯域の終了: 10.96.0.16
範囲の終了: 10.96.0.254

{{< mermaid >}}
pie showData
    title 10.96.0.0/24
    "静的割り当て" : 16
    "動的割り当て" : 238
{{< /mermaid >}}

### 例2 {#allocation-example-2}

この例では、ServiceのIPアドレスとして、10.96.0.0/20(CIDR表記法)のIPアドレスの範囲を使用します。

範囲の大きさ: 2<sup>12</sup> - 2 = 4094
帯域のオフセット(開始位置): `min(max(16, 4096/16), 256)` = `min(256, 256)` = 256
静的割り当ての帯域の開始: 10.96.0.1
静的割り当ての帯域の終了: 10.96.1.0
範囲の終了: 10.96.15.254

{{< mermaid >}}
pie showData
    title 10.96.0.0/20
    "静的割り当て" : 256
    "動的割り当て" : 3838
{{< /mermaid >}}

### 例3 {#allocation-example-3}

この例ではServiceのIPアドレスとして、10.96.0.0/16(CIDR表記法)のIPアドレスの範囲を使用します。

範囲の大きさ: 2<sup>16</sup> - 2 = 65534
帯域のオフセット(開始位置): `min(max(16, 65536/16), 256)` = `min(4096, 256)` = 256
静的割り当ての帯域の開始: 10.96.0.1
静的割り当ての帯域の終了: 10.96.1.0
範囲の終了: 10.96.255.254

{{< mermaid >}}
pie showData
    title 10.96.0.0/16
    "静的割り当て" : 256
    "動的割り当て" : 65278
{{< /mermaid >}}

## {{% heading "whatsnext" %}}

* [Serviceの外部トラフィックのポリシー](/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)を参照してください。
* [アプリケーションをServiceに接続する](/ja/docs/tutorials/services/connect-applications-service/)を参照してください。
* [Service](/ja/docs/concepts/services-networking/service/)を参照してください。
