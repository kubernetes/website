---
title: DaemonSet
id: daemonset
full_link: /docs/concepts/workloads/controllers/daemonset
short_description: >
  Забезпечує запуск копії обʼєкта Pod на певному наборі вузлів у кластері.

aka:
tags:
- fundamental
- core-object
- workload
---

Забезпечує запуск копії обʼєкта {{< glossary_tooltip text="Pod" term_id="pod" >}} на певному наборі вузлів у {{< glossary_tooltip text="кластері." term_id="cluster" >}}

<!--more-->

Використовується для розгортання системних служб, таких як збирачі логів та агенти моніторингу, які, як правило, повинні працювати на кожному {{< glossary_tooltip term_id="node" text="вузлі" >}}.
