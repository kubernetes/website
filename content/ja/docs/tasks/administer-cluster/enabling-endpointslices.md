---
title: EndpointSliceの有効化
content_template: templates/task
---

{{% capture overview %}}
このページはKubernetesのEndpointSliceの有効化の概要を説明します。
{{% /capture %}}


{{% capture prerequisites %}}
  {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
{{% /capture %}}

{{% capture steps %}}

## 概要

EndpointSliceは、KubernetesのEndpointに対してスケーラブルで拡張可能な代替手段を提供します。Endpointが提供する機能のベースの上に構築し、スケーラブルな方法で拡張します。Serviceが多数(100以上)のネットワークEndpointを持つ場合、それらは単一の大きなEndpointリソースではなく、複数の小さなEndpointに分割されます。

## EndpointSliceの有効化

{{< feature-state for_k8s_version="v1.17" state="beta" >}}

{{< note >}}
EndpointSliceは、最終的には既存のEndpointを置き換える可能性がありますが、多くのKubernetesコンポーネントはまだ既存のEndpointに依存しています。現時点ではEndpointSliceを有効化することは、Endpointの置き換えではなく、クラスター内のEndpointへの追加とみなされる必要があります。
{{< /note >}}

アルファ版では、EndpointSliceはKubernetesでデフォルトで有効になっていません。有効にするには、EndpointSliceのfeature gateを有効化する必要があります(`--feature-gates=EndpointSlice=true`)。

## EndpointSliceの使用

クラスター内でEndpointSliceを完全に有効にすると、各Endpointリソースに対応するEndpointSliceリソースが表示されます。既存のEndpointの機能をサポートすることに加えて、EndpointSliceはトポロジーなどの新しい情報を含める必要があります。これらにより、クラスター内のネットワークEndpointのスケーラビリティと拡張性が大きく向上します。
