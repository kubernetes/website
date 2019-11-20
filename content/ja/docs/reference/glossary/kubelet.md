---
title: Kubelet
id: kubelet
date: 2018-04-12
full_link: /docs/reference/generated/kubelet
short_description: >
  クラスター内の各ノードで実行されるエージェントです。各コンテナがPodで実行されていることを保証します。

aka: 
tags:
- fundamental
- core-object
---
 クラスター内の各ノードで実行されるエージェントです。各コンテナがPodで実行されていることを保証します。

<!--more-->

kubeletは、さまざまなメカニズムを通じて提供されるPodSpecのセットを取得し、それらのPodSpecに記述されているコンテナが正常に実行されている状態に保ちます。kubeletは、Kubernetesが作成したものではないコンテナは管理しません。
