---
title: kube-scheduler
id: kube-scheduler
date: 2018-04-12
full_link: /docs/reference/command-line-tools-reference/kube-scheduler/
short_description: >
  A control plane component that watches for new unassigned Pods and chooses a node for them. 
aka: 
tags:
- architecture
---
A control plane component that watches 
for new unassigned {{< glossary_tooltip term_id="pod" text="Pods" >}} 
and chooses a {{< glossary_tooltip term_id="node" text="node">}} for them.

<!--more-->

Factors taken into account for scheduling decisions include:

- individual and collective resource requirements
- hardware/software/policy constraints
- affinity and anti-affinity specifications
- data locality
- inter-workload interference
- deadlines

These factors are very important for ensuring that workloads are scheduled 
in a way that maximizes resource utilization, 
with low latency and meets the application-specific requirements.
