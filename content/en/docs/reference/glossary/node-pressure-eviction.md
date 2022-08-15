---
title: Node-pressure eviction
id: node-pressure-eviction
date: 2021-05-13
full_link: /docs/concepts/scheduling-eviction/node-pressure-eviction/
short_description: >
  Node-pressure eviction is the process by which the kubelet proactively fails
  pods to reclaim resources on nodes.
aka:
- kubelet eviction
tags:
- operation
---
Node-pressure eviction is the process by which the {{<glossary_tooltip term_id="kubelet" text="kubelet">}} proactively terminates
pods to reclaim resources on nodes.

<!--more-->

The kubelet monitors resources like CPU, memory, disk space, and filesystem 
inodes on your cluster's nodes. When one or more of these resources reach
specific consumption levels, the kubelet can proactively fail one or more pods
on the node to reclaim resources and prevent starvation. 

Node-pressure eviction is not the same as [API-initiated eviction](/docs/concepts/scheduling-eviction/api-eviction/).
