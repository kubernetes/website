---
title: Knoten
id: node
date: 2018-04-12
full_link: /docs/concepts/architecture/nodes/
short_description: >
  Ein Knoten ist eine Arbietermaschine in Kubernetes.

aka:
tags:
- fundamental
---
 Ein Knoten ist eine Arbietermaschine in Kubernetes.

<!--more-->

Ein Arbeiterknoten kann eine virtuelle Maschine oder physische Maschine sein, abhängig vom Cluster. Es hat lokale Daemons und Dienste, die nötig sind um {{< glossary_tooltip text="Pods" term_id="pod" >}} auszuführen, und wird von der Control Plane administriert. Die Daemonen auf einem Knoten beinhalten auch das {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}, {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}, und eine Container Runtime, die ein {{< glossary_tooltip text="CRI" term_id="cri" >}}, wie zum Beispiel {{< glossary_tooltip term_id="docker" >}}. implementieren.

In älteren Kubernetes Versionen wurden Knoten "Minions" genannt.
