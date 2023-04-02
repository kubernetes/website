---
title: kube-scheduler
id: kube-scheduler
date: 2018-04-12
full_link: /docs/reference/command-line-tools-reference/kube-scheduler/
short_description: >
  Control plane component that watches for newly created pods with no assigned node, and selects a node for them to run on.

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

Individual and collective resource requirements: The CPU and memory requirements 
of each pod when scheduling it onto a node is only considered. It is also considers
the avalable resources of each node to ensure that the pod can be run without 
resource contention. Collective resource requirements refer to the resource needs of a 
group of pods, such as those that make up a service, and te scheduler tries to schedule them in a 
way that ensures that they have enough resources to function optimally.

Hardware/software/policy constraints: The scheduler takes into account 
hardware and softeware constraints, such as the availability of certain 
types of hardware, as well as policy constraints such as the need to 
distibute workloads across different availability zones or regions.

Affinity and anti-affinity specifications: This define the relationship between 
pods and nodes. They can be used to specify that certain pods should or 
should not be scheduled together or apart from each other. 
This can be useful for load balancing or ensuring 
that certain services have high availability.

Data locality: Data locality is the principle that data should be 
stored and processed on the same node to minimize network latency. 
Kubernetes allows pods to specify their data locality requirements, 
and the scheduler tries to schedule them onto nodes that have the required data.

Inter-workload interference: This occurs when multiple workloads 
are scheduled onto the same node and compete for resources, leading to performance degradation. 
Kubernetes takes this into account when scheduling workloads to avoid resource contention.

Deadlines: Kubernetes allows pods to specify their deadline requirements, 
and the scheduler tries to schedule them in a way that ensures that the deadline is met. 
This can be useful for time-sensitive workloads, such as those that process real-time data.

These factors are very important for ensuring that workloads are scheduled 
in a way that maximizes resource utilization, 
with low latency and meets the application-specific requirements.
