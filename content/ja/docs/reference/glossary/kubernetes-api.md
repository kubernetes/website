---
title: Kubernetes API
id: kubernetes-api
full_link: /docs/concepts/overview/kubernetes-api/
short_description: >
  RESTfulインターフェースを通してKubernetesの機能を提供し、クラスターの状態を保存するアプリケーションです。

aka: 
tags:
- fundamental
- architecture
---
 アプリケーションは、RESTfulインターフェースを通してKubernetesの機能を提供し、クラスターの状態を保存します。

<!--more--> 

Kubernetesリソースと「意図の記録」は、APIオブジェクトとして全て保存され、APIへのRESTful呼び出し経由で変更されます。
APIは設定を宣言的な方法で管理できるようにします。
ユーザーはKubernetes APIと直接もしくは `kubectl` のようなツールを通して対話することができます。
中核となるKubernetes APIは柔軟で、カスタムリソースをサポートするために、拡張することも可能になっています。
