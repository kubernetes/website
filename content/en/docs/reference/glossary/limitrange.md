---
title: LimitRange
id: limitrange
date: 2019-04-15
full_link:  /docs/concepts/policy/limit-range/
short_description: >
  ネームスペース内のコンテナまたはポッドごとのリソース消費を制限するための制約を提供します。

aka: 
tags:
- core-object
- fundamental
- architecture
related:
 - pod
 - container

---
{{< glossary_tooltip text="コンテナ" term_id="container" >}}または{{< glossary_tooltip text="ポッド" term_id="pod" >}}ごとのリソース消費を制限するための制約を提供します。

<!--more--> 
LimitRangeは、オブジェクトの作成可能な数量をタイプごとに制限し、また、ネームスペース内の個々の{{< glossary_tooltip text="コンテナ" term_id="container" >}}または{{< glossary_tooltip text="ポッド" term_id="pod" >}}が要求または消費できるコンピューティングリソースの量を制限します。