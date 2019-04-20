---
title: Node
id: node
date: 2018-04-12
full_link: /docs/concepts/architecture/nodes/
short_description: >
  A node is a worker machine in Kubernetes.

aka: 
tags:
- fundamental
---
 A node is a worker machine in Kubernetes.

<!--more--> 

A worker machine may be a VM or physical machine, depending on the cluster. It has the {{< glossary_tooltip text="Services" term_id="service" >}} necessary to run {{< glossary_tooltip text="Pods" term_id="pod" >}} and is managed by the master components. The {{< glossary_tooltip text="Services" term_id="service" >}} on a node include Docker, kubelet and kube-proxy.

