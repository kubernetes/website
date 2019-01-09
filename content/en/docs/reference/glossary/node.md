---
title: Node
id: node
date: 2018-04-12
full_link: /docs/concepts/architecture/nodes/
short_description: >
  The control plane manages the Kubernetes cluster

aka: 
tags:
- fundamental
---
 A node is a machine that can run Kubernetes {{< glossary_tooltip text="Pods" term_id="pod" >}}.

<!--more--> 

A node may be a VM or physical machine, depending on the cluster.  It has the {{< glossary_tooltip text="Services" term_id="service" >}} necessary to run {{< glossary_tooltip text="Pods" term_id="pod" >}} and is managed by the master components. The {{< glossary_tooltip text="Services" term_id="service" >}} on a node include a {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}, {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}, and {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}.

