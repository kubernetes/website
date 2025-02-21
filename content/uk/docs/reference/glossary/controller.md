---
title: Контролер
id: controller
date: 2018-04-12
full_link: /docs/concepts/architecture/controller/
short_description: >
  Контролер — цикл управління, що спостерігає за загальним станом кластера через apiserver і вносить зміни в намаганні наблизити поточний стан до бажаного.

aka:
tags:
- architecture
- fundamental
---

У Kubernetes контролери — це цикли управління, які спостерігають за станом вашого {{< glossary_tooltip term_id="cluster" text="кластера">}}, а потім вносять або запитують зміни там, де це необхідно. Кожен контролер намагається наблизити поточний стан кластера до бажаного.

<!--more-->

Контролери спостерігають за загальним станом вашого кластера через {{< glossary_tooltip text="apiserver" term_id="kube-apiserver" >}} (частина {{< glossary_tooltip term_id="control-plane" text="Панелі управління" >}}).

Деякі контролери також працюють всередині панелі управління, забезпечуючи цикли управління, які є ключовими для операцій Kubernetes. Наприклад, контролер Deployment, контролер DaemonSet, контролер Namespace та контролер постійних томів (і інші) всі працюють всередині {{< glossary_tooltip term_id="kube-controller-manager" >}}.
