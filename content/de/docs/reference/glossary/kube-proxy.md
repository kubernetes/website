---
title: kube-proxy
id: kube-proxy
date: 2018-04-12
full_link: /docs/reference/command-line-tools-reference/kube-proxy/
short_description: >
  `kube-proxy` ist ein Netzwerkproxy, der auf jedem Knoten im Cluster läuft.

aka:
tags:
- fundamental
- networking
---
 kube-proxy ist ein Netwzwerkproxy, der auf jedem {{< glossary_tooltip text="Knoten" term_id="node" >}} in Ihrem Cluster läuft, und ein Teil des Kubernetes {{< glossary_tooltip text="Service" term_id="service">}} Konzepts implementiert.

<!--more-->

[kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/)
pflegt Netzwerkregeln auf den Knoten. Diese Netzwerkregeln erlauben Nezwerkkommunikation zu Ihren Pods von Netzwerksitzungen innerhalb und außerhalb Ihres Clusters.

kube-proxy verwendet die Paketfilterungsschicht des Betriebssystems, wenn eine existiert und verfügbar ist. Ansonsten leitet kube-proxy den Verkehr selbst weiter.
