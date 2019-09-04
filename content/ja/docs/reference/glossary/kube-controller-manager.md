---
title: kube-controller-manager
id: kube-controller-manager
date: 2018-04-12
full_link: /docs/reference/generated/kube-controller-manager/
short_description: >
  Master上に存在し、コントローラーを実行するコンポーネント。

aka: 
tags:
- architecture
- fundamental
---
 Master上に存在し、{{< glossary_tooltip text="コントローラー" term_id="controller" >}}を実行するコンポーネント。

<!--more--> 

論理的には各{{< glossary_tooltip text="コントローラー" term_id="controller" >}}は個別のプロセスですが、複雑さを軽減するために、すべて単一のバイナリにコンパイルされ、単一のプロセスで実行されます。


