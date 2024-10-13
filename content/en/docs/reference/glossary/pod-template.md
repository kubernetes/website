---
title: Pod Template
id: pod-template
date: 2024-10-13
short_description: >
  A Pod Template defines template for creating pods.

aka: 
tags:
- core-object

---
An API object that defines a template for creating {{< glossary_tooltip text="pod" term_id="pod" >}}, typically used in higher-level controllers.

<!--more--> 

Pod Templates provide a specification that includes metadata, labels, and a pod's desired state, which is utilized by controllers like {{< glossary_tooltip text="deployment" term_id="deployment" >}} and {{< glossary_tooltip text="statefulset" term_id="statefulset" >}} to create and manage multiple {{< glossary_tooltip text="replicas" term_id="" >}} of {{< glossary_tooltip text="pod" term_id="pod" >}}.
