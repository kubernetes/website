---
title: エンドポイント（Endpoints）
id: endpoints
date: 2020-04-23
full_link: 
short_description: >
  エンドポイントは、サービスのセレクターに一致するPodのIPアドレスを記録する責任があります。

aka:
tags:
- networking
---
エンドポイントは、{{< glossary_tooltip text="サービス" term_id="selector" >}}のセレクターに一致するPodのIPアドレスを記録する責任があります。

<!--more-->
セレクター識別子を指定せずに、{{< glossary_tooltip text="サービス" term_id="selector" >}}上でエンドポイントを手動で設定できます。
{{< glossary_tooltip text="EndpointSlice" term_id="endpoint-slice" >}}は、スケーラブルで拡張可能な代替手段を提供します。
