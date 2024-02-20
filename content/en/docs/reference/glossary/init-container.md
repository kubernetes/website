---
title: Init Container
id: init-container
date: 2018-04-12
full_link: 
short_description: >
  One or more initialization containers that must run to completion before any app containers run.
full_link: /docs/concepts/workloads/pods/init-containers/
aka: 
tags:
- fundamental
---
 One or more initialization {{< glossary_tooltip text="containers" term_id="container" >}} that must run to completion before any app containers run.

<!--more--> 

Initialization (init) containers are like regular app containers, with one difference: init containers must run to completion before any app containers can start. Init containers run in series: each init container must run to completion before the next init container begins.

Unlike {{< glossary_tooltip text="sidecar containers" term_id="sidecar-container" >}}, init containers do not remain running after Pod startup.

For more information, read [init containers](/docs/concepts/workloads/pods/init-containers/).
