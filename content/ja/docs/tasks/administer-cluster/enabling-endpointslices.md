---
title: EndpointSliceの有効化
content_type: task
---

<!-- overview -->
このページはKubernetesのEndpointSliceの有効化の概要を説明します。



## {{% heading "prerequisites" %}}

  {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


<!-- steps -->

## 概要

EndpointSliceは、KubernetesのEndpointsに対してスケーラブルで拡張可能な代替手段を提供します。Endpointsが提供する機能のベースの上に構築し、スケーラブルな方法で拡張します。Serviceが多数(100以上)のネットワークエンドポイントを持つ場合、それらは単一の大きなEndpointsリソースではなく、複数の小さなEndpointSliceに分割されます。

## EndpointSliceの有効化

{{< feature-state for_k8s_version="v1.17" state="beta" >}}

{{< note >}}
EndpointSliceは、最終的には既存のEndpointsを置き換える可能性がありますが、多くのKubernetesコンポーネントはまだ既存のEndpointsに依存しています。現時点ではEndpointSliceを有効化することは、Endpointsの置き換えではなく、クラスター内のEndpointsへの追加とみなされる必要があります。
{{< /note >}}

EndpointSliceはベータ版の機能とみなされますが、デフォルトではAPIのみが有効です。kube-proxyによるEndpointSliceコントローラーとEndpointSliceの使用は、デフォルトでは有効になっていません。

EndpointSliceコントローラーはクラスター内にEndpointSliceを作成し、管理します。これは、{{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}}と{{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}}の`EndpointSlice`の[フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/)で有効にできます(`--feature-gates=EndpointSlice=true`)。

スケーラビリティ向上のため、{{<glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}でフィーチャーゲートを有効にして、Endpointsの代わりにEndpointSliceをデータソースとして使用することもできます。

## EndpointSliceの使用

クラスター内でEndpointSliceを完全に有効にすると、各Endpointsリソースに対応するEndpointSliceリソースが表示されます。既存のEndpointsの機能をサポートすることに加えて、EndpointSliceはトポロジーなどの新しい情報を含める必要があります。これらにより、クラスター内のネットワークエンドポイントのスケーラビリティと拡張性が大きく向上します。

## {{% heading "whatsnext" %}}


* [EndpointSlice](/docs/concepts/services-networking/endpoint-slices/)を参照してください。
* [サービスとアプリケーションの接続](/ja/docs/concepts/services-networking/connect-applications-service/)を参照してください。


