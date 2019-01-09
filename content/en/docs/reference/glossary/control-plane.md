---
title: Control Plane
id: control-plane
date: 2019-01-09
full_link: /docs/concepts/
short_description: >
  The services that manage a {{< glossary_tooltip text="cluster" term_id="cluster" >}}.

aka: 
tags:
- architecture
- fundamental
---
 The services that manage a {{< glossary_tooltip text="cluster" term_id="cluster" >}}.

<!--more--> 

The various parts of the control plane govern how Kubernetes communicates with your cluster.
The control plane maintains a record of all of the Kubernetes {{< glossary_tooltip text="Objects" term_id="object" >}} in the system, and runs continuous control loops to manage those objects' state.
At any given time, the control plane's control loops will respond to changes in the cluster and work to make the actual state of all the objects in the system match the desired state that you provided.
