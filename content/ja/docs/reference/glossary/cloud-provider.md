---
title: Cloud Provider
id: cloud-provider
date: 2018-04-12
short_description: >
  クラウドコンピューティングプラットフォームを提供する組織。

aka:
  - Cloud Service Provider
tags:
  - community
---

クラウドコンピューティングプラットフォームを提供する企業やその他の組織。

<!--more-->

Cloud Providerは、Cloud Service Provider（CSP）と呼ばれることもあり、クラウドコンピューティングプラットフォームやサービスを提供しています。

多くのCloud Providerは、マネージドインフラストラクチャー（Infrastructure as a ServiceやIaaSとも呼ばれる）を提供しています。
マネージドインフラストラクチャーでは、Cloud Providerがサーバー、ストレージ、ネットワーキングの責任を負い、ユーザーはKubernetesクラスタの実行など、その上のレイヤーを管理します。

Kubernetesはマネージドサービスとしても提供されています。これは、Platform as a Service（PaaS）と呼ばれることもあります。マネージドKubernetesでは、Cloud Providerは、Kubernetesのコントロールプレーンだけでなく、{{< glossary_tooltip term_id="node" text="ノード" >}}と、それらが依存するインフラストラクチャー（ネットワーク、ストレージ、場合によってはロードバランサーなどの他要素）にも責任を負います。
