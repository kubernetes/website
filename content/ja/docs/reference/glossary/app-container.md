---
title: Appコンテナ
id: app-container
date: 2019-02-12
full_link:
short_description: >
 ワークロードの一部を実行するために使用されるコンテナ。Initコンテナと比較してください。
aka:
tags:
- workload
---
 アプリケーションコンテナ(またはAppコンテナ)は、{{< glossary_tooltip text="Initコンテナ" term_id="init-container" >}}が完了したあとに開始される{{< glossary_tooltip text="Pod" term_id="pod" >}}内の{{< glossary_tooltip text="コンテナ" term_id="container" >}}です。
<!--more-->

Initコンテナを使用すると、{{< glossary_tooltip text="ワークロード" term_id="workload" >}}全体にとって重要であり、アプリケーションコンテナの開始後に実行し続ける必要のない初期化の詳細を分離できます。
PodにInitコンテナが構成されていない場合、そのPod内のすべてのコンテナはAppコンテナになります。
