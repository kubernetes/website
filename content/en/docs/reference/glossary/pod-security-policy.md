---
title: Pod Security Policy
id: pod-security-policy
date: 2018-04-12
full_link: /docs/concepts/security/pod-security-policy/
short_description: >
  Removed API that enforced Pod security restrictions.
aka: 
tags:
- security
---
A former Kubernetes API that enforced security restrictions during {{< glossary_tooltip term_id="pod" >}} creation and updates.

<!--more--> 

PodSecurityPolicy was deprecated as of Kubernetes v1.21, and removed in v1.25.
As an alternative, use [Pod Security Admission](/docs/concepts/security/pod-security-admission/) or a 3rd party admission plugin.
