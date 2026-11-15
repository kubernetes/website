---
title: ResourceQuota
id: resource-quota
full_link: /docs/concepts/policy/resource-quotas/
short_description: >
  Встановлює обмеження на загальне споживання ресурсів для кожного простору імен.

aka:
tags:
- fundamental
- operation
- architecture
---

Обʼєкт, що обмежує загальне споживання ресурсів для кожного {{< glossary_tooltip text="простору імен" term_id="namespace" >}}.

<!--more-->

ResourceQuota може або обмежувати кількість {{< glossary_tooltip text="ресурсів API" term_id="api-resource" >}}, які можна створити в просторі імен за типом, або встановлювати обмеження на загальний обсяг {{< glossary_tooltip text="ресурсів інфраструктури" term_id="infrastructure-resource" >}}, який можна використати від імені простору імен (та обʼєктів у ньому).
