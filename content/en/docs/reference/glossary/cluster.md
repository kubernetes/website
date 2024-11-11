---
title: Cluster
id: cluster
date: 2019-06-15
full_link: 
short_description: >
   A set of machines hosting containerized workloads, in the form of pods, and the control plane that manages them.  
aka: 
tags:
- fundamental
- operation
---
A set of machines hosting containerized {{< glossary_tooltip text="workloads" term_id="workload" >}}, in the form of {{< glossary_tooltip text="pods" term_id="pod" >}}, and the {{< glossary_tooltip text="control plane" term_id="control-plane" >}} that manages them.  

<!--more-->
Machines may be physical or virtual.  Machines that host pods are referred to as {{< glossary_tooltip text="nodes" term_id="node" >}}.  Nodes that host workloads are referred to as worker nodes. There must be at least one worker node within a cluster. 

Control plane components run on one or more of the machines within the cluster. They may execute directly in the context of the operating system of a machine, or within pods.  When control plane components run within pods on a machine, the machine may also be referred to as a control plane node.  

In production environments, the cluster typically consists of multiple machines, with the control plane components and workloads distributed across them for scale, resilience and high availability.  It is a best practice in production environments to have workloads hosted on machines that do not host control plane components.


