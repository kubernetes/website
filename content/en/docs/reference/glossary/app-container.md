---
title: App Container
id: app-container
date: 2019-02-12
full_link:
short_description: >
  A container used to run part of a workload. Compare with init container.

aka:
tags:
- workload
---
 Application containers (or app containers) are the {{< glossary_tooltip text="containers" term_id="container" >}} in a {{< glossary_tooltip text="pod" term_id="pod" >}} that are started after any {{< glossary_tooltip text="init containers" term_id="init-container" >}} have completed.

<!--more-->

An init container lets you separate initialization details that are important for the overall 
{{< glossary_tooltip text="workload" term_id="workload" >}}, and that don't need to keep running
once the application container has started.
If a pod doesn't have any init containers configured, all the containers in that pod are app containers.
