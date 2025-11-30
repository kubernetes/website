---
title: クラウドコントローラーマネージャー
id: cloud-controller-manager
date: 2018-04-12
full_link: /ja/docs/concepts/architecture/cloud-controller/
short_description: >
  サードパーティクラウドプロバイダーにKubernetesを結合するコントロールプレーンコンポーネント
aka: 
tags:
- core-object
- architecture
- operation
---
 クラウド特有の制御ロジックを組み込むKubernetesの{{< glossary_tooltip text="コントロールプレーン" term_id="control-plane" >}}コンポーネントです。クラウドコントロールマネージャーは、クラスターをクラウドプロバイダーAPIとリンクし、クラスターのみで相互作用するコンポーネントからクラウドプラットフォームで相互作用するコンポーネントを分離します。

<!--more-->

Kubernetesと基盤となるクラウドインフラストラクチャ間の相互運用ロジックを分離することで、クラウドプロバイダーはcloud-controller-managerコンポーネントにより、メインのKubernetesプロジェクトとは異なるペースで機能をリリースできるようになります。
