---
title: cAdvisor
id: cadvisor
date: 2021-12-09
full_link: https://github.com/google/cadvisor/
short_description: >
  コンテナのリソース使用量とパフォーマンス特性を理解するためのツール
aka:
tags:
- tool
---
cAdvisor(Container Advisor)は、コンテナユーザーに実行中の{{< glossary_tooltip text="コンテナ" term_id="container" >}}のリソース使用量とパフォーマンス特性を理解させることができます。

<!--more-->

これは、実行中のコンテナに関する情報を収集、集約、処理、エクスポートするデーモンです。具体的には、コンテナごとにリソース分離パラメーター、リソース使用量の履歴、完全なリソース使用量の履歴のヒストグラム、およびネットワーク統計を保持します。このデータは、コンテナごととマシン全体でエクスポートされます。
