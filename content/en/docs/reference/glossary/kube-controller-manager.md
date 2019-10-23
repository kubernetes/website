---
title: kube-controller-manager
id: kube-controller-manager
date: 2018-04-12
full_link: /docs/reference/generated/kube-controller-manager/
short_description: >
  Component on the master that runs controllers.

aka: 
tags:
- architecture
- fundamental
---
 Component on the master that runs {{< glossary_tooltip text="controllers" term_id="controller" >}}.

<!--more--> 

Logically, each {{< glossary_tooltip text="controller" term_id="controller" >}} is a separate process, but to reduce complexity, they are all compiled into a single binary and run in a single process.

