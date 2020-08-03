---
title: Serviceトポロジーを有効にする
content_type: task
---

<!-- overview -->
このページでは、Kubernetes上でServiceトポロジーを有効にする方法の概要について説明します。


## {{% heading "prerequisites" %}}

  {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


<!-- steps -->

## はじめに

*Serviceトポロジー*は、クラスターのノードのトポロジーに基づいてトラフィックをルーティングできるようにする機能です。たとえば、あるServiceのトラフィックに対して、できるだけ同じノードや同じアベイラビリティゾーン上にあるエンドポイントを優先してルーティングするように指定できます。

## 前提

トポロジーを考慮したServiceのルーティングを有効にするには、以下の前提を満たしている必要があります。

   * Kubernetesバージョン1.17以降である
   * {{< glossary_tooltip text="Kube-proxy" term_id="kube-proxy" >}}がiptableモードまたはIPVSモードで稼働している
   * [Endpoint Slice](/docs/concepts/services-networking/endpoint-slices/)を有効にしている

## Serviceトポロジーを有効にする

{{< feature-state for_k8s_version="v1.17" state="alpha" >}}

Serviceトポロジーを有効にするには、すべてのKubernetesコンポーネントで`ServiceTopology`と`EndpointSlice`フィーチャーゲートを有効にする必要があります。

```
--feature-gates="ServiceTopology=true,EndpointSlice=true"
```

## {{% heading "whatsnext" %}}

* [Serviceトポロジー](/ja/docs/concepts/services-networking/service-topology)のコンセプトについて読む
* [Endpoint Slice](/docs/concepts/services-networking/endpoint-slices)について読む
* [サービスとアプリケーションの接続](/ja/docs/concepts/services-networking/connect-applications-service/)を読む

