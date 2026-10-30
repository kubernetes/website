---
title: Вузол
id: node
full_link: /docs/concepts/architecture/nodes/
short_description: >
  Вузол — це робоча машина в Kubernetes.

aka:
- Node
tags:
- core-object
- fundamental
---

Вузол — це робоча машина в Kubernetes.

<!--more-->

Робочий вузол може бути віртуальною або фізичною машиною, залежно від кластера. На ньому працюють локальні демони або служби, необхідні для виконання {{< glossary_tooltip text="Podʼів" term_id="pod" >}}, і ним керує керівний вузол (control-plane node). До демонів на вузлі належать {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}, {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} та середовище виконання контейнерів, яке реалізує {{< glossary_tooltip text="CRI" term_id="cri" >}}, наприклад {{< glossary_tooltip term_id="docker" >}}.

У ранніх версіях Kubernetes вузли називалися "Minions" (Міньйони).
