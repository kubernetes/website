---
title: kube-controller-manager
id: kube-controller-manager
date: 2018-04-12
full_link: /docs/reference/generated/kube-controller-manager/
short_description: >
  マスター上で動く、コントローラー群を動かすコンポーネントです。

aka: 
tags:
- architecture
- fundamental
---
 マスター上で動く、{{< glossary_tooltip text="controllers" term_id="controller" >}}を動かすコンポーネントです。

<!--more--> 

論理的には、各{{< glossary_tooltip text="controller" term_id="controller" >}}は、それぞれ別のプロセスですが、複雑になるのを避けるため、一つの実行ファイルにまとめてコンパイルされ、単一のプロセスとして動きます。

