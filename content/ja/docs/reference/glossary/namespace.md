---
title: Namespace
id: namespace
date: 2018-04-12
full_link: /docs/concepts/overview/working-with-objects/namespaces
short_description: >
  An abstraction used by Kubernetes to support multiple virtual clusters on the same physical cluster.

aka: 
tags:
- fundamental
---
 同一の物理{{< glossary_tooltip text="クラスター" term_id="cluster" >}}上で複数の仮想クラスターをサポートするための機能を抽象化したものです。

<!--more--> 

Namespaceはクラスター内のオブジェクトをまとめたり、クラスターのリソースを分離するための方法を提供します。  
リソース名は、Namespace内で一意である必要がありますが、Namespaceをまたいだ場合はその必要はないです。

