---
title: Node
id: node
date: 2018-04-12
full_link: /docs/concepts/architecture/nodes/
short_description: >
  A node is a machine within a Kubernetes cluster that hosts pods.

aka:
tags:
- core-object
- fundamental
---
 A node is a machine within a Kubernetes {{< glossary_tooltip text="cluster" term_id="cluster" >}} that hosts {{< glossary_tooltip text="pods" term_id="pod" >}}.

<!--more-->

A node may be a VM or physical machine, depending on the cluster.  The term *node* is often used as an abbreviation for the term *worker node*, given that most nodes host {{< glossary_tooltip text="workloads" term_id="workload" >}}.  However it is possible for nodes to host control plane components within pods, and these nodes may be referred to as control plane nodes.  Thus it's possible for a node to be both a worker node and a control plane node, though this is less likely in production environments, as having a machine co-host workloads and control plane components goes against best practices. 

Each node is managed by the {{< glossary_tooltip text="control plane" term_id="control-plane" >}} and has the local daemons or services necessary to run pods. The daemons on a node include {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}, {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}, and a container runtime implementing the {{< glossary_tooltip text="CRI" term_id="cri" >}} such as {{< glossary_tooltip term_id="docker" >}}.

In early Kubernetes versions, worker nodes were called "Minions".
