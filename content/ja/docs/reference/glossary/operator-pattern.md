---
title: オペレーターパターン
id: operator-pattern
full_link: /ja/docs/concepts/extend-kubernetes/operator/
short_description: >
  カスタムリソースを管理するために使用される専用のコントローラー。

aka:
tags:
- architecture
---
[オペレーターパターン](/ja/docs/concepts/extend-kubernetes/operator/)は、{{< glossary_tooltip text="コントローラー" term_id="controller" >}}を1つ以上のカスタムリソースにリンクさせるシステム設計です。

<!--more-->

Kubernetes自体の一部として提供される組み込みのコントローラーに加えて、クラスターにコントローラーを追加することで、Kubernetesを拡張できます。

実行中のアプリケーションがコントローラーとして振る舞い、コントロールプレーンに定義されたカスタムリソースに対してタスクを実行するためのAPIアクセスを持っている場合、それはオペレーターパターンの一例です。
