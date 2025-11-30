---
title: Kubernetes API
id: kubernetes-api
date: 2018-04-12
full_link: /docs/concepts/overview/kubernetes-api/
short_description: >
  RESTfulインターフェースを通じてKubernetesの機能を提供し、クラスターの状態を保存するアプリケーション。

aka:
tags:
- fundamental
- architecture
---
RESTfulインターフェースを通じてKubernetesの機能を提供し、クラスターの状態を保存するアプリケーション。

<!--more-->

Kubernetesのリソースと「意図の記録」はすべてAPIオブジェクトとして保存され、RESTfulなAPI呼び出しによって変更されます。APIを使用すると、宣言的な方法で設定を管理できます。ユーザーはKubernetes APIを直接操作することも、`kubectl`などのツールを介して操作することもできます。KubernetesコアAPIは柔軟性が高く、カスタムリソースをサポートするように拡張することも可能です。
