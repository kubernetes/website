---
title: kube-controller-manager
id: kube-controller-manager
full_link: /docs/reference/command-line-tools-reference/kube-controller-manager/
short_description: >
  Компонент панелі управління, який запускає процеси контролера.

aka:
tags:
- architecture
- fundamental
---

Компонент панелі управління, який запускає процеси {{< glossary_tooltip text="контролера" term_id="controller" >}}.

<!--more-->

За логікою, кожен {{< glossary_tooltip text="контролер" term_id="controller" >}} є окремим процесом. Однак для спрощення їх збирають в один бінарний файл і запускають як єдиний процес.
