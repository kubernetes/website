---
title: affinity
id: affinity
date: 2019-01-11
full_link: /docs/tasks/configure-pod-container/assign-pods-nodes-using-node-affinity/
short_description: >
  Node affinity is a set of rules used by the scheduler to determine where a pod can be placed.
aka:
tags:
- core object
- fundamental
---
Node affinity is a set of rules used by the scheduler to determine where a pod can be placed.

<!--more-->

The rules are defined using the familiar concepts of custom labels on {{< glossary_tooltip term_id="node" text="nodes">}} 
and {{< glossary_tooltip term_id="selector" text="selectors">}} specified in {{< glossary_tooltip term_id="pod" text="pods" >}}, 
and they can be either required or preferred, depending on how strictly you want the scheduler to enforce them.
