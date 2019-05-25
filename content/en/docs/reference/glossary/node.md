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

A worker machine may be a VM or physical machine, depending on the cluster. It has the Kubernetes services necessary to run {{< glossary_tooltip text="Pods" term_id="pod" >}} and is managed by the master components. The services on a node include {{< glossary_tooltip text="container runtime interface" term_id="cri" >}}, {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} and {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}.

