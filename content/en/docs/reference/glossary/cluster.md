---
title: Cluster
id: cluster
date: 2019-06-15
full_link: 
short_description: >
   A set of worker machines, called nodes, that run containerized applications. Every cluster has at least one worker node.

aka: 
tags:
- fundamental
- operation
---
A Kubernetes cluster consists of a set of worker machines, called nodes, that run containerized applications.

<!--more-->

The {{< glossary_tooltip text="control plane" term_id="control-plane" >}} manages the nodes and the {{< glossary_tooltip text="Pods" term_id="pod" >}} in the cluster. In production environments, the control plane usually runs across multiple computers and a cluster usually runs multiple nodes, providing fault-tolerance and high availability.