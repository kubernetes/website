---
title: kube-controller-manager
id: kube-controller-manager
date: 2018-04-12
full_link: /docs/reference/generated/kube-controller-manager/
short_description: >
  Komponente auf der Control Plane, auf der Controller ausgeführt werden.

aka:
tags:
- architecture
- fundamental
---
 Komponente auf der Control Plane, auf der {{< glossary_tooltip text="Controller" term_id="controller" >}} ausgeführt werden.

<!--more-->

Logisch gesehen ist jeder {{< glossary_tooltip text="Controller" term_id="controller" >}} ein separater Prozess, aber zur Vereinfachung der Komplexität werden sie alle zu einer einzigen Binärdatei zusammengefasst und in einem einzigen Prozess ausgeführt.

