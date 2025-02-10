---
title: フィーチャーゲート(Feature gate)
id: feature-gate
date: 2023-01-12
full_link: /ja/docs/reference/command-line-tools-reference/feature-gates/
short_description: >
  特定のKubernetes機能を有効にするかどうかを制御する方法。

aka: 
tags:
- fundamental
- operation
---
フィーチャーゲートはクラスター内でどのKubernetes機能を有効にするかを制御するために使用できるキー(不透明な文字列値)のセットです。

<!--more-->
各Kubernetesコンポーネントで`--feature-gates`コマンドラインフラグを使用して、これらの機能をオンまたはオフにすることができます。
各Kubernetesコンポーネントでは、そのコンポーネントに関連する一連のフィーチャーゲートを有効または無効にすることができます。
Kubernetesのドキュメントには、現在のすべての[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)とその制御対象がリストされています。
