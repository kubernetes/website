---
title: Initコンテナ
id: init-container
date: 2018-04-12
full_link: /docs/concepts/workloads/pods/init-containers/
short_description: >
  アプリケーションコンテナの起動前に実行が完了している必要がある、1つ以上の初期化コンテナです。
aka: 
tags:
- fundamental
---
アプリケーションコンテナの起動前に実行が完了している必要がある、1つ以上の初期化{{< glossary_tooltip text="コンテナ" term_id="container" >}}です。

<!--more--> 

初期化(Init)コンテナは通常のアプリケーションコンテナと似ていますが、違いが1つあります。
それは、アプリケーションコンテナが開始される前に、Initコンテナが完了していなければならない点です。
Initコンテナは順番に実行され、各Initコンテナが完了してから次のInitコンテナが開始されます。

{{< glossary_tooltip text="サイドカーコンテナ" term_id="sidecar-container" >}}とは異なり、InitコンテナはPod起動後に実行され続けることはありません。

詳細については、[Initコンテナ](/docs/concepts/workloads/pods/init-containers/)を参照してください。
