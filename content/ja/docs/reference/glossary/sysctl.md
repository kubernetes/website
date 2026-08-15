---
title: sysctl
id: sysctl
full_link: /docs/tasks/administer-cluster/sysctl-cluster/
short_description: >
  Unixのカーネルパラメーターを取得、設定するためのインターフェースです。

aka:
tags:
- tool
---
 `sysctl`は、実行中のUnixカーネルの属性を読み取ったり変更したりするための、準標準化されたインターフェースです。

<!--more-->

Unix系のシステムでは、`sysctl`は管理者がこれらの設定を表示、変更するために使用するツールの名前であり、またそのツールが使用するシステムコールでもあります。

{{< glossary_tooltip text="コンテナ" term_id="container" >}}ランタイムやネットワークプラグインは、`sysctl`の値が特定の方法で設定されていることに依存している場合があります。
