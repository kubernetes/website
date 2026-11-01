---
layout: blog
title: "Kubernetes v1.33: HorizontalPodAutoscalerの設定可能な許容値"
slug: kubernetes-v1-33-hpa-configurable-tolerance
math: true # for formulae
date: 2025-04-28T10:30:00-08:00
author: "Jean-Marc François (Google)"
translator: >
  [Takuya Kitamura](https://github.com/kfess)
---

この投稿では、Kubernetes 1.33で初めて利用可能になった新しいアルファ機能である、_HorizontalPodAutoscalerの設定可能な許容値_ について説明します。

## これは何ですか？

[水平Pod自動スケーリング](/ja/docs/tasks/run-application/horizontal-pod-autoscale/)は、Kubernetesのよく知られた機能であり、リソース使用率に基づいてレプリカを追加または削除することで、ワークロードのサイズを自動的に調整できます。

たとえば、Kubernetesクラスターで50個のレプリカを持つWebアプリケーションが稼働しているとします。
HorizontalPodAutoscaler(HPA)をCPU使用率に基づいてスケーリングするように構成し、目標使用率を75%に設定します。
現在の全レプリカにおけるCPU使用率が目標の75%を上回る90%であると仮定します。
このとき、HPAは次の式を使用して必要なレプリカ数を計算します。
```math
desiredReplicas = ceil\left\lceil currentReplicas \times \frac{currentMetricValue}{desiredMetricValue} \right\rceil
```

この例の場合では、下記のようになります。
```math
50 \times (90/75) = 60
```

そのため、HPAは各Podの負荷を軽減するために、レプリカ数を50から60に増やします。
同様に、CPU使用率が75%を下回った場合は、HPAがそれに応じてレプリカ数を縮小します。
Kubernetesのドキュメントでは、[スケーリングアルゴリズムの詳細な説明](https://kubernetes.io/ja/docs/tasks/run-application/horizontal-pod-autoscale/#algorithm-details)が提供されています。

小さなメトリクスの変動があるたびにレプリカが作成または削除されるのを防ぐために、Kubernetesはヒステリシスの仕組みを適用しています。
現在の値と目標値の差が10%を超えた場合にのみ、レプリカ数を変更します。
上記の例では、現在値と目標値の比率は\\(90/75\\)、すなわち目標を20%上回っており、10%の許容値を超えているため、スケールアップが実行されます。

この10%というデフォルトの許容値はクラスター全体に適用されるものであり、これまでのKubernetesのリリースでは細かく調整することができませんでした。
多くの用途には適していますが、10%の許容値が数十個のPodに相当するような大規模なデプロイメントには粗すぎます。
その結果、コミュニティでは、この値を調整可能にしてほしいという要望が以前から[寄せられてきました](https://github.com/kubernetes/kubernetes/issues/116984)。

Kubernetes v1.33では、これが可能になりました。

## どうやって使うのか？

Kubernetes v1.33クラスターで`HPAConfigurableTolerance`[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)を有効にした後、HorizontalPodAutoscalerオブジェクトに対して希望する許容値を設定できます。

許容値は`spec.behavior.scaleDown`および`spec.behavior.scaleUp`フィールドの下に指定され、スケールアップとスケールダウンで異なる値を設定することが可能です。
典型的な使い方としては、スケールアップには小さな許容範囲(スパイクに素早く反応するため)、スケールダウンには大きな許容範囲(メトリクスの小さな変動に対してレプリカを過剰に追加・削除しないようにするため)を指定することが挙げられます。

たとえば、スケールダウンに対して5%の許容値を、スケールアップに対して許容値を指定しないHPAは、次のようになります。

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-app
spec:
  ...
  behavior:
    scaleDown:
      tolerance: 0.05
    scaleUp:
      tolerance: 0
```

## すべての詳細を知りたい！

すべての技術的な詳細については、[KEP-4951](https://github.com/kubernetes/enhancements/tree/master/keps/sig-autoscaling/4951-configurable-hpa-tolerance)を参照してください。
また、[issue 4951](https://github.com/kubernetes/enhancements/issues/4951)をフォローすることで、この機能の安定版への移行についての通知を受け取ることができます。