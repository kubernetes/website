---
title: Master
id: master
date: 2020-04-16
short_description: >
  Veralteter Begriff, verwendet als Synonym für die Knoten auf denen die Control Plane läuft. 

aka:
tags:
- fundamental
---
 Veralteter Begriff, verwendet als Synonym für die {{< glossary_tooltip text="Knoten" term_id="node" >}} auf denen die {{< glossary_tooltip text="Control Plane" term_id="control-plane" >}} läuft.

<!--more-->
Dieser Begriff wird noch durch einige Provisionierungswerkzeuge verwendet, wie zum Beispiel {{< glossary_tooltip text="kubeadm" term_id="kubeadm" >}}, und gemanagte Dienste, um {{< glossary_tooltip text="Knoten" term_id="node" >}} mit dem `kubernetes.io/role` {{< glossary_tooltip text="Label" term_id="label" >}} zu kennzeichnen, und {{< glossary_tooltip text="Pods" term_id="pod" >}} auf der {{< glossary_tooltip text="Control Plane" term_id="control-plane" >}} zu platzieren.