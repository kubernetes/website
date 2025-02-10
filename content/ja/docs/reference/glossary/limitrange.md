---
title: LimitRange
id: limitrange
date: 2019-04-15
full_link:  /ja/docs/concepts/policy/limit-range/
short_description: >
  各Namespace内のコンテナまたはPodごとのリソース消費量を制限するための制約を提供します。

aka: 
tags:
- core-object
- fundamental
- architecture
related:
 - pod
 - container

---
 各Namespace内の{{< glossary_tooltip text="コンテナ" term_id="container" >}}または{{< glossary_tooltip text="Pod" term_id="pod" >}}ごとのリソース消費量を制限するための制約を提供します。

<!--more--> 
LimitRangeは、タイプごとに作成できるオブジェクトの数量を制限するだけでなく、Namespace内の個々の{{< glossary_tooltip text="コンテナ" term_id="container" >}}または{{< glossary_tooltip text="Pod" term_id="pod" >}}によって要求または消費される計算リソースの量も制限します。