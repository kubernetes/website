---
title: ネットワークポリシー
id: network-policy
date: 2018-04-12
full_link: /ja/docs/concepts/services-networking/network-policies/
short_description: >
  一連のPodがPod同士やその他のネットワークエンドポイントとどのように通信することを許可されるかを定める規定。

aka: 
tags:
- networking
- architecture
- extension
- core-object
---
 一連のPodがPod同士やその他のネットワークエンドポイントとどのように通信することを許可されるかを定める規定。

<!--more--> 

ネットワークポリシーは、どのPodが互いに接続を許可されるか、どのNamespaceが通信を許可されるか、そしてより具体的には各ポリシーを適用するポート番号を宣言的に設定することができます。
`NetworkPolicy`リソースはラベルを使用してPodを選択し、選択されたPodに対して許可するトラフィックを指定するルールを定義します。
ネットワークポリシーはネットワークプロバイダーが提供するネットワークプラグインによって実装されます。
ネットワークポリシーを実装するためのコントローラーを使用せずにネットワークリソースを作成しても効果がないことに注意してください。
