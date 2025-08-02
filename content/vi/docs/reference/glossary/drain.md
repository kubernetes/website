---
title: Drain
id: drain
date: 2024-12-27
full_link:
short_description: >
  Safely evicts Pods from a Node to prepare for maintenance or removal.
tags:
- fundamental
- operation
---
The process of safely evicting {{< glossary_tooltip text="Pods" term_id="pod" >}} from a {{< glossary_tooltip text="Node" term_id="node" >}} to prepare it for maintenance or removal from a {{< glossary_tooltip text="cluster" term_id="cluster" >}}.

<!--more-->

The `kubectl drain` command is used to mark a {{< glossary_tooltip text="Node" term_id="node" >}} as going out of service. 
When executed, it evicts all {{< glossary_tooltip text="Pods" term_id="pod" >}} from the {{< glossary_tooltip text="Node" term_id="node" >}}. 
If an eviction request is temporarily rejected, `kubectl drain` retries until all {{< glossary_tooltip text="Pods" term_id="pod" >}} are terminated or a configurable timeout is reached.
