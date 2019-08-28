---
title: Kubelet
id: kubelet
date: 2018-04-12
full_link: /docs/reference/generated/kubelet
short_description: >
  クラスター内の各ノードで稼働するエージェントです。コンテナがPod内で稼働していることを保証します。

aka: 
tags:
- fundamental
- core-object
---
 クラスター内の各ノードで稼働するエージェントです。コンテナがPod内で稼働していることを保証します。

<!--more--> 

Kubeletは、様々な機構から提供されるPodSpecs情報を受け取り、それらのPodSpecs情報に記述されているコンテナが正常に稼働していることを保証します。Kubeletは、Kubernetes外で作成されたコンテナは管理しません。

