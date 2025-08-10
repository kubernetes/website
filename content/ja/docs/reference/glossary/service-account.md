---
title: サービスアカウント
id: service-account
date: 2018-04-12
full_link: /docs/tasks/configure-pod-container/configure-service-account/
short_description: >
  Pod内で動作するプロセスのアイデンティティを提供します。

aka: 
tags:
- fundamental
- core-object
---
 {{< glossary_tooltip text="Pod" term_id="pod" >}}内で動作するプロセスのアイデンティティを提供します。

<!--more-->

Pod内のプロセスがクラスターへアクセスする際、それらはAPIサーバーによって特定のサービスアカウント(例：`default`)として認証されます。
Podを作成する際にサービスアカウントを指定しない場合、同じ{{< glossary_tooltip text="Namespace" term_id="namespace" >}}内のデフォルトのサービスアカウントが自動的に割り当てられます。
