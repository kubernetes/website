---
title: App Container
id: app-container
date: 2019-02-12
full_link:
short_description: >
  A container used to run part of a workload. Contrast with init container.

aka:
tags:
- workload
---
 Application containers (or app containers) are the {{< glossary_tooltip text="containers" term_id="container" >}} in a {{< glossary_tooltip text="pod" term_id="pod" >}} that are started after any {{< glossary_tooltip text="init containers" term_id="init-container" >}} have completed.

<!--more-->

If a pod doesn't have any init containers configured, all the containers in that pod are app containers.
