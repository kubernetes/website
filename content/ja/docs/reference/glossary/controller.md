---
title: Controller
id: controller
date: 2018-04-12
full_link: /docs/admin/kube-controller-manager/
short_description: >
  クラスターの状態をAPIサーバーから取得、見張る制御ループで、現在の状態を望ましい状態に移行するように更新します。

aka: 
tags:
- architecture
- fundamental
---
 クラスターの状態を{{< glossary_tooltip text="apiserver" term_id="kube-apiserver" >}}から取得して監視する制御ループで、現在の状態を望ましい状態に移行するように更新します。

<!--more--> 

現在Kubernetesに同梱されているコントローラーの例には、レプリケーションコントローラー、エンドポイントコントローラー、名前空間コントローラー、およびサービスアカウントコントローラーがあります。
