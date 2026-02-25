---
title: Вузол
id: node
short_description: >
  Вузол — це робоча машина в Kubernetes.

aka:
- Node
tags:
- fundamental
- core-object
---

Вузол — це робоча машина в Kubernetes.

<!--more-->

Робочий вузол може бути віртуальною машиною або фізичною машиною, залежно від кластера. На ньому працюють локальні служби або служби, необхідні для виконання {{< glossary_tooltip text="Podʼів" term_id="pod" >}}, і ним керує панель управління. Демони на вузлі включають {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}, {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} та середовище виконання контейнерів, яке реалізує {{< glossary_tooltip text="CRI" term_id="cri" >}}, наприклад {{< glossary_tooltip term_id="docker" >}}.

В ранніх версіях Kubernetes вузли називалися "Minions" (Міньйони).
