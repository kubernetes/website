---
title: Service
id: service
date: 2018-04-12
full_link: /docs/concepts/services-networking/service/
short_description: >
  Eine Methode um Anwendungen, die auf einem Satz Pods laufen, als Netzwerkdienst freizugeben.
tags:
- fundamental
- core-object
---
Eine Methode um Netwzwerkanwendungen freizugeben, die als einen oder mehrere {{< glossary_tooltip text="Pods" term_id="pod" >}} in Ihrem Cluster laufen.

<!--more-->

Der Satz Pods, der von einem Servie anvisiert ist, wird durch einen {{< glossary_tooltip text="Selector" term_id="selector" >}} bestimmt. Wenn mehrere Pods hinzugefügt oder entfernt werden, ändert sich der Satz Pods die zum Selector passen. Der Service versichert, dass Netzwerkverkehr an den aktuellen Satz Pods für die Arbeitslast gelenkt werden kann.

Kubernetes Services verwenden entweder IP Netzwerke (IPv4, IPv6, oder beide), oder referenzieren einen externen Namen im Domain Name System (DNS).

Die Service Abstraktion ermöglicht andere Mechanismen, wie Ingress und Gateway.
