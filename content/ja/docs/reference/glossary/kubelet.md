---
title: Kubelet
id: kubelet
date: 2018-04-12
full_link: /docs/reference/command-line-tools-reference/kubelet
short_description: >
  クラスター内の各ノードで実行されるエージェント。コンテナがPod内で実行されていることを保証します。

aka:
tags:
- fundamental
---
 クラスター内の各{{< glossary_tooltip text="ノード" term_id="node" >}}上で実行されるエージェント。
 {{< glossary_tooltip text="コンテナ" term_id="container" >}}が{{< glossary_tooltip text="Pod" term_id="pod" >}}内で実行されていることを保証します。

<!--more-->

[kubelet](/docs/reference/command-line-tools-reference/kubelet/)は、さまざまなメカニズムを通じて提供される一連のPodSpecを受け取り、そのPodSpecに記述されたコンテナが実行され、正常であることを保証します。
kubeletは、Kubernetesによって作成されていないコンテナを管理しません。
