---
title: リソースクォータ(ResourceQuota)
id: resource-quota
full_link: /docs/concepts/policy/resource-quotas/
short_description: >
  名前空間ごとの総リソース消費を制限するための制約を提供します。

aka: 
tags:
- fundamental
- operation
- architecture
---
{{< glossary_tooltip text="名前空間" term_id="namespace" >}}ごとの総リソース消費を制限するオブジェクトです。
<!--more-->

リソースクォータは名前空間内で作成できる{{< glossary_tooltip text="APIリソース" term_id="api-resource" >}}の数を種別ごとに制限したり、その名前空間(およびその中にあるオブジェクト)の代わりに消費される{{< glossary_tooltip text="インフラストラクチャリソース" term_id="infrastructure-resource" >}}の総量に制限を設けることができます。

