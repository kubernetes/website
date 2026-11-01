---
title: Classe QoS
id: qos-class
full_link: /docs/concepts/workloads/pods/pod-qos/
short_description: >
  La classe QoS (Quality of Service) permet à Kubernetes de classer les Pods afin de prendre des décisions d’ordonnancement et d’éviction.

aka: 
tags:
- fundamental
- architecture
related:
 - pod
---

La classe QoS (Quality of Service) permet à Kubernetes de classer les Pods en différentes catégories afin de prendre des décisions concernant leur ordonnancement et leur éviction.

<!--more-->

La classe QoS d’un Pod est définie lors de sa création, en fonction des paramètres de requêtes et de limites de ressources.

Ces classes sont utilisées pour prioriser les Pods lors de l’ordonnancement et pour déterminer lesquels peuvent être évincés en cas de manque de ressources.

Kubernetes peut attribuer l’une des classes QoS suivantes à un Pod : `Guaranteed`, `Burstable` ou `BestEffort`.
