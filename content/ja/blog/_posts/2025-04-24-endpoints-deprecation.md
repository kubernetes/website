---
layout: blog
title: "Kubernetes v1.33: EndpointsからEndpointSliceへの継続的な移行を進める"
slug: endpoints-deprecation
date: 2025-04-24T10:30:00-08:00
author: >
  Dan Winship (Red Hat)
translator: >
  [Takuto Nagami](https://github.com/logica0419) (千葉工業大学)
---

[EndpointSlice] ([KEP-752])がv1.15でアルファとして導入され、v1.21でGAとなって以来、Endpoints APIはKubernetesの中でほぼ使われず、埃を被っています。
[デュアルスタックネットワーク]や[トラフィック分散]など、Serviceの新機能はEndpointSlice APIでのみサポートされているため、全てのサービスプロキシ、Gateway API実装、及び同様のコントローラーはEndpointsからEndpointSliceへの移行を余儀なくされました。
現時点のEndpoints APIは、未だにEndpointsを使っているエンドユーザーのワークロードやスクリプトの互換性を維持するための存在に過ぎません。

Kubernetes 1.33以降、Endpoints APIは正式に非推奨となり、Endpointsリソースを読み書きするユーザーに対して、EndpointSliceを使用するようAPIサーバーから警告が返されるようになりました。

最終的には、「ServiceとPodに基づいてEndpointsオブジェクトを生成する _Endpointsコントローラー_ がクラスター内で実行されている」という基準を[Kubernetes Conformance]から除外することが[KEP-4974]にて計画されています。
これの実現によって、現代的なほとんどのクラスターにおいて不要な作業を回避することができます。

[Kubernetes非推奨ポリシー]に従うと、Endpointsタイプ自体が完全に廃止されることはおそらく無いですが、Endpoints APIを使うワークロードやスクリプトを保有しているユーザーはEndpointSliceへの移行が推奨されます。

[EndpointSlice]: /blog/2020/09/02/scaling-kubernetes-networking-with-endpointslices/
[KEP-752]: https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/0752-endpointslices/README.md
[デュアルスタックネットワーク]: /ja/docs/concepts/services-networking/dual-stack/
[トラフィック分散]: /docs/reference/networking/virtual-ips/#traffic-distribution
[Kubernetes非推奨ポリシー]: /ja/docs/reference/using-api/deprecation-policy/
[KEP-4974]: https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/4974-deprecate-endpoints/README.md
[Kubernetes Conformance]: https://www.cncf.io/training/certification/software-conformance/

## EndpointsからEndpointSliceへの移行に関する注意点

### EndpointSliceを利用する

エンドユーザーにとって、Endpoints APIとEndpointSlice APIの最大の違いは、`selector`を持つ全てのServiceが自身と同じ名前のEndpointsオブジェクトを必ず1つずつ持つのに対し、1つのServiceに紐づけられるEndpointSliceは複数存在する可能性がある、という点です。

```console
$ kubectl get endpoints myservice
Warning: v1 Endpoints is deprecated in v1.33+; use discovery.k8s.io/v1 EndpointSlice
NAME        ENDPOINTS          AGE
myservice   10.180.3.17:443    1h

$ kubectl get endpointslice -l kubernetes.io/service-name=myservice
NAME              ADDRESSTYPE   PORTS   ENDPOINTS          AGE
myservice-7vzhx   IPv4          443     10.180.3.17        21s
myservice-jcv8s   IPv6          443     2001:db8:0123::5   21s
```

この場合、Serviceがデュアルスタックであるため、EndpointSliceがIPv4アドレス用とIPv6アドレス用の2つ存在します。
(Endpoints APIはデュアルスタックをサポートしていないため、Endpointsオブジェクトにはクラスターのプライマリアドレスファミリーのアドレスのみが表示されています。)

複数のEndpointSliceを持つ _可能性_ は、複数のエンドポイントが存在するあらゆるServiceにありますが、代表的なケースが3つ存在します。

  - EndpointSliceは単一のIPファミリーのエンドポイントしか表現できないため、デュアルスタックServiceの場合、IPv4用とIPv6用のEndpointSliceがそれぞれ作成されます。

  - 単一のEndpointSlice内のエンドポイントは、全て同じポートを対象とする必要があります。例えば、エンドポイントとなるPodをロールアウトして、リッスンするポート番号を80から8080に更新する場合、ロールアウト中はServiceに2つのEndpointSliceが必要になります。1つはポート80をリッスンしているエンドポイント用、もう1つはポート8080をリッスンしているエンドポイント用です。

  - Serviceに100以上のエンドポイントが存在する場合、Endpointsコントローラーは1つの巨大なオブジェクトにエンドポイントを集約していましたが、EndpointSliceコントローラーはこれらを複数のEndpointSliceに分割します。

ServiceとEndpointSliceの間に予測可能な1対1の対応関係はないため、あるServiceに紐づけられるEndpointSliceリソースの実際の名前を事前に知ることはできません。
そのため、Serviceに紐づけられるEndpointSliceリソースを取得する際は、名前で取得するのではなく、`"kubernetes.io/service-name"`[ラベル](/ja/docs/concepts/overview/working-with-objects/labels/)が目的のServiceを指しているEndpointSliceを全て取得する必要があります。

```console
kubectl get endpointslice -l kubernetes.io/service-name=myservice
```

Goのコードでも同様の変更が必要です。
Endpointsを使用して次のように記述していたところは、

```go
// `namespace`内の`name`という名前のEndpointsを取得する
endpoint, err := client.CoreV1().Endpoints(namespace).Get(ctx, name, metav1.GetOptions{})
if err != nil {
  if apierrors.IsNotFound(err) {
    // サービスに対応するEndpointsが(まだ)存在しない
    ...
  }
    // 他のエラーを処理
  ...
}

// `endpoint`を使った処理を続ける
...
```

EndpointSliceを使うと次のようになります。

```go
// `namespace`内の`name`というServiceに紐づいた全てのEndpointSliceを取得する
slices, err := client.DiscoveryV1().EndpointSlices(namespace).List(ctx,
  metav1.ListOptions{LabelSelector: discoveryv1.LabelServiceName + "=" + name})
if err != nil {
  // エラーを処理
  ...
} else if len(slices.Items) == 0 {
  // Serviceに対応するEndpointSliceが(まだ)存在しない
  ...
}

// `slices.Items`を使った処理を続ける
...
```

### EndpointSliceを生成する

手作業でEndpointsを生成している箇所やコントローラーについては、複数のEndpointSliceを考慮しなくてもよい場合が多いため、比較的簡単にEndpointSliceへの移行ができます。
Endpointsから少し情報の整理の仕方は変わっていますが、単にEndpointSliceという新しい型を使用するようにYAMLやGoのコードを更新するだけで済みます。

例えばこのようなEndpointsオブジェクトの場合、

```yaml
apiVersion: v1
kind: Endpoints
metadata:
  name: myservice
subsets:
  - addresses:
      - ip: 10.180.3.17
        nodeName: node-4
      - ip: 10.180.5.22
        nodeName: node-9
      - ip: 10.180.18.2
        nodeName: node-7
    notReadyAddresses:
      - ip: 10.180.6.6
        nodeName: node-8
    ports:
      - name: https
        protocol: TCP
        port: 443
```

次のようなEndpointSliceオブジェクトになります。

```yaml
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: myservice
  labels:
    kubernetes.io/service-name: myservice
addressType: IPv4
endpoints:
  - addresses:
      - 10.180.3.17
    nodeName: node-4
  - addresses:
      - 10.180.5.22
    nodeName: node-9
  - addresses:
      - 10.180.18.12
    nodeName: node-7
  - addresses:
      - 10.180.6.6
    nodeName: node-8
    conditions:
      ready: false
ports:
  - name: https
    protocol: TCP
    port: 443
```

いくつか留意点があります。

1. この例では明示的に`name`を指定していますが、`generateName`を使用することでAPIサーバーにユニークなサフィックスを付加させることもできます。重要なのは名前自体ではなく、Serviceを指す`"kubernetes.io/service-name"`ラベルです。

2. 明示的に`addressType: IPv4`(または`IPv6`)を指定する必要があります。

3. EndpointSliceは、Endpointsの`"subsets"`フィールドの一要素と類似しています。複数のsubsetsを持つEndpointsオブジェクトを表現する場合、基本的には異なる`"ports"`を持つ複数のEndpointSliceにする必要があります。

4. `endpoints`フィールドと`addresses`フィールドはどちらも配列ですが、慣習的に`addresses`フィールドは1つの要素しか含みません。Serviceに複数のエンドポイントがある場合は、`endpoints`フィールドに複数の要素を持たせ、それぞれの`addresses`フィールドには1つの要素のみを含める必要があります。

5. Endpoints APIでは「ready」と「not-ready」のエンドポイントが別々に列挙されますが、EndpointSlice APIでは各エンドポイントに対してconditions(`ready: false`など)を設定することができます。

もちろん、ひとたびEndpointSliceに移行すれば、topology hintsやterminating endpointsなどEndpointSlice特有の機能を活用できます。
詳細は[EndpointSlice APIのドキュメント](/docs/reference/kubernetes-api/service-resources/endpoint-slice-v1)をご参照下さい。
