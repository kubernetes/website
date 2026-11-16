---
title: Kubernetes API
id: kubernetes-api
full_link: /docs/concepts/overview/kubernetes-api/
short_description: >
  ユーザー、クラスターコンポーネント、および外部コンポーネントが相互に通信し、Kubernetesオブジェクトの状態を照会または操作できるようにするHTTP APIです。

aka: 
tags:
- fundamental
- architecture
---
 ユーザー、クラスターコンポーネント、および外部コンポーネントが相互に通信し、Kubernetesオブジェクトの状態を照会または操作できるようにするHTTP APIです。

<!--more--> 

Kubernetesリソースと「意図の記録」は、APIオブジェクトとして全て保存され、APIへのRESTful呼び出し経由で変更されます。
APIは設定を宣言的な方法で管理できるようにします。
ユーザーはKubernetes APIと直接もしくは`kubectl`のようなツールを通して対話することができます。
中核となるKubernetes APIは柔軟で、カスタムリソースをサポートするために、拡張することも可能になっています。
