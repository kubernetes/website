---
title: Pod Security Policy
id: pod-security-policy
date: 2018-04-12
full_link: /docs/concepts/security/pod-security-policy/
short_description: >
  Enables fine-grained authorization of pod creation and updates.

aka: 
tags:
- core-object
- fundamental
---
 Enables fine-grained authorization of {{< glossary_tooltip term_id="pod" >}} creation and updates.

<!--more--> 

A cluster-level resource that controls security sensitive aspects of the Pod specification. The `PodSecurityPolicy` objects define a set of conditions that a Pod must run with in order to be accepted into the system, as well as defaults for the related fields. Pod Security Policy control is implemented as an optional admission controller.

PodSecurityPolicy was deprecated as of Kubernetes v1.21, and removed in v1.25.
As an alternative, use [Pod Security Admission](/docs/concepts/security/pod-security-admission/) or a 3rd party admission plugin.
