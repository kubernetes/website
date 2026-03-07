---
title: Process ID Limits and Reservations
id: pid-limits
date: 2025-06-20
full_link: /docs/concepts/policy/pid-limiting/
short_description: >
  Kubernetes allow you to limit the number of process IDs (PIDs) that a Pod can use.
  You can also reserve a number of allocatable PIDs for each node for use by the
  operating system and daemons (rather than by Pods).

aka: 
tags:
- fundamental
- operation
- architecture
---

Kubernetes allow you to limit the number of process IDs (PIDs) that a
{{< glossary_tooltip term_id="Pod" text="Pod" >}} can use.
You can also reserve a number of allocatable PIDs for each {{< glossary_tooltip term_id="node" text="node" >}}
for use by the operating system and daemons (rather than by Pods).
