---
title: エフェメラルコンテナ
id: ephemeral-container
full_link: /docs/concepts/workloads/pods/ephemeral-containers/
short_description: >
  Pod内で一時的に実行できるコンテナの一種

aka:
tags:
- fundamental
---
{{< glossary_tooltip term_id="pod" >}}内で一時的に実行できる{{< glossary_tooltip term_id="container" >}}の一種。

<!--more-->

問題が発生しているPodを調査したい場合、そのPodにエフェメラルコンテナを追加して診断を行うことができます。
エフェメラルコンテナは{{< glossary_tooltip text="リソース" term_id="infrastructure-resource" >}}やスケジューリングが保証されないため、たとえワークロードの一部であっても、その実行に使用すべきではありません。

エフェメラルコンテナは{{< glossary_tooltip text="static Pod" term_id="static-pod" >}}ではサポートされません。
