---
title: Спорідненість
id: affinity
full_link: /docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity
short_description: >
    Правила, які планувальник використовує, щоб визначити, де розмістити Podʼи.

aka:
- Affinity
tags:
- fundamental
---

У Kubernetes _спорідненість_ (affinity) — це набір правил, які підказують планувальнику, де розміщувати Podʼи.

<!--more-->

Є два види спорідненості:

* [спорідненість вузлів](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)
* [спорідненість між Podʼами](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)

Правила визначаються за допомогою {{< glossary_tooltip term_id="label" text="міток">}} Kubernetes і {{< glossary_tooltip term_id="selector" text="селекторів">}}, вказаних у {{< glossary_tooltip term_id="pod" text="Podʼах" >}}, і можуть бути обовʼязковими або бажаними залежно від того, наскільки суворо ви хочете, щоб планувальник їх дотримувався.
