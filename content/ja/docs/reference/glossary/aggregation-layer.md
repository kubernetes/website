---
title: アグリゲーションレイヤー
id: aggregation-layer
date: 2018-10-08
full_link: /docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/
short_description: >
  アグリゲーションレイヤーを使用すると、追加のKubernetesスタイルのAPIをクラスターにインストールできます。

aka: 
tags:
- architecture
- extension
- operation
---
 アグリゲーションレイヤーを使用すると、追加のKubernetesスタイルのAPIをクラスターにインストールできます。

<!--more-->

{{< glossary_tooltip text="Kubernetes APIサーバー" term_id="kube-apiserver" >}}を[support additional APIs](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)に設定すると、`APIService`オブジェクトを追加して、Kubernetes APIのURLパスを「要求」することができます。
