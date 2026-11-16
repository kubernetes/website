---
title: DaemonSet
id: daemonset
full_link: /docs/concepts/workloads/controllers/daemonset
short_description: >
  Забезпечує роботу копії Podʼа на певному наборі вузлів у кластері.

aka:
tags:
- fundamental
- core-object
- workload
---

Забезпечує роботу копії {{< glossary_tooltip text="Podʼа" term_id="pod" >}} на певному наборі вузлів у {{< glossary_tooltip text="кластері" term_id="cluster" >}}.

<!--more-->

Використовується для розгортання системних фонових процесів (демонів), як-от збирачів логів і агентів моніторингу, які зазвичай мають працювати на кожному {{< glossary_tooltip term_id="node" text="вузлі" >}}.
