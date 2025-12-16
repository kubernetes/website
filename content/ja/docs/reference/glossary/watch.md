---
title: Watch
id: watch
date: 2024-07-02
full_link: /docs/reference/using-api/api-concepts/#api-verbs
short_description: >
  Kubernetes内のオブジェクトへの変更をストリームとして追跡するために使用される動詞です。

aka:
tags:
- API verb
- fundamental
---
Kubernetes内のオブジェクトへの変更をストリームとして追跡するために使用される動詞です。
変更の効率的な検出に使用されます。

<!--more-->

Kubernetes内のオブジェクトへの変更をストリームとして追跡するために使用される動詞です。Watchは変更の効率的な検出を可能にします。
例えば、ConfigMapが変更されたことを知る必要がある{{< glossary_tooltip term_id="controller" text="コントローラー">}}は、ポーリングではなくWatchを使用できます。

詳細については、[APIの基本概念に関するドキュメント内の変更の効率的検出](/docs/reference/using-api/api-concepts/#efficient-detection-of-changes)を参照してください。
