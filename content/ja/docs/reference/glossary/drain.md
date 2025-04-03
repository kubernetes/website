---
title: Drain
id: drain
date: 2024-12-27
full_link:
short_description: >
  メンテナンスや削除に備え、Podをノードから安全に退避します。
tags:
- fundamental
- operation
---
メンテナンスや{{< glossary_tooltip text="クラスター" term_id="cluster" >}}からの削除に備え、{{< glossary_tooltip text="Pod" term_id="pod" >}}を{{< glossary_tooltip text="ノード" term_id="node" >}}から安全に退避する処理です。

<!--more-->

`kubectl drain`コマンドは、{{< glossary_tooltip text="ノード" term_id="node" >}}をサービス停止中としてマークするために使用されます。
コマンドを実行すると、マークした{{< glossary_tooltip text="ノード" term_id="node" >}}からすべての{{< glossary_tooltip text="Pod" term_id="pod" >}}が退避されます。
退避要求が一時的に拒否された場合、`kubectl drain`はすべての{{< glossary_tooltip text="Pod" term_id="pod" >}}が終了するか、設定可能なタイムアウトに達するまで再試行します。
