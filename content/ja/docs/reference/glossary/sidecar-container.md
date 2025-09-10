---
title: サイドカーコンテナ
id: sidecar-container
date: 2018-04-12
full_link: /ja/docs/concepts/workloads/pods/sidecar-containers/
short_description: >
  Podのライフサイクル全体を通して実行を続ける補助コンテナ。
tags:
- fundamental
---
サイドカーコンテナは1つ以上の{{< glossary_tooltip text="コンテナ" term_id="container" >}}で構成され、一般的にアプリケーションコンテナより先に起動されます。

<!--more-->

サイドカーコンテナは通常のアプリケーションコンテナと似ていますが、目的が違います: サイドカーコンテナは、同じPodで実行されるメインのアプリケーションコンテナに対してサービスを提供します。
{{< glossary_tooltip text="Initコンテナ" term_id="init-container" >}}とは異なり、サイドカーコンテナはPod起動後も実行を続けます。

詳細については、[サイドカーコンテナ](/ja/docs/concepts/workloads/pods/sidecar-containers/)をご参照ください。
