---
title: Container Runtime
id: container-runtime
date: 2019-01-09
full_link: /docs/concepts/overview/components/#node-components
short_description: >
  A container runtime is node is a machine that can run Kubernetes {{< glossary_tooltip text="Pods" term_id="pod" >}}.

aka: 
tags:
- operation
---
 The container runtime is the software that is responsible for running {{< glossary_tooltip text="containers" term_id="container" >}}.

<!--more--> 

The container runtime is the software that is responsible for running {{< glossary_tooltip text="containers" term_id="container" >}}.
Kubernetes supports several runtimes via the [Container Runtime Interface (CRI)](/docs/setup/cri).
