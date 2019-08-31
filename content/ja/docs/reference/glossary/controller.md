---
title: Controller
id: controller
date: 2018-04-12
full_link: /docs/admin/kube-controller-manager/
short_description: >
  apiserverを介してクラスターの共有された状態を監視し、現在の状態をdesired state (望ましい状態)に向けて変更しようとする制御ループ。

aka: 
tags:
- architecture
- fundamental
---
 {{< glossary_tooltip text="apiserver" term_id="kube-apiserver" >}}を介してクラスターの共有された状態を監視し、現在の状態をdesired state (望ましい状態)に向けて変更しようとする制御ループ。

<!--more--> 

現在Kubernetesに同梱されているコントローラーの例には、レプリケーションコントローラー、エンドポイントコントローラー、名前空間コントローラー、およびサービスアカウントコントローラーがあります。


