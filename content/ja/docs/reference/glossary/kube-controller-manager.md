---
title: kube-controller-manager
id: kube-controller-manager
date: 2018-04-12
full_link: /docs/reference/generated/kube-controller-manager/
short_description: >
  マスター上に存在し、コントローラーを実行するコンポーネントです。

aka: 
tags:
- architecture
- fundamental
---
 マスター上に存在し、{{< glossary_tooltip text="controllers" term_id="controller" >}}を実行するコンポーネントです。

<!--more--> 

論理的には、各{{< glossary_tooltip text="controller" term_id="controller" >}}は個別のプロセスですが、複雑になるのを避けるために一つの実行ファイルにまとめてコンパイルされ、単一のプロセスとして動きます。
