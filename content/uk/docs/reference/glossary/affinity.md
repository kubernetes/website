---
title: Спорідненість
id: affinity
full_link: /docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity
short_description: >
    Правила, що використовуються планувальником для визначення місця розташування Podʼів.

aka:
- Affinity
- Афінітет
tags:
- fundamental
---

У Kubernetes _Affinity_ — це набір правил, які дають підказки планувальнику, де розміщувати Podʼи.

<!--more-->

Є два види спорідненості:

* [спорідненість вузла](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)
* [спорідненість між Podʼами](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)

Правила визначаються за допомогою {{< glossary_tooltip term_id="label" text="міток">}}, та {{< glossary_tooltip term_id="selector" text="селекторів">}}, вказаних в {{< glossary_tooltip term_id="pod" text="Podʼах" >}}, і вони можуть бути обовʼязковими або бажаними, залежно від того, наскільки суворо ви хочете, щоб планувальник їх дотримувався.
