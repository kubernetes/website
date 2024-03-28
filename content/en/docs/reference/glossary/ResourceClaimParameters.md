---
title: ResourceClaimParameters
id: ResourceClaimParameters
date: 2023-10-16
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/
short_description: >
  Specification of what and how much of resources the ResourceClaim needs.
aka:
tags:
- extension
---
 {{< glossary_tooltip term_id="resource-driver" text="Resource Driver">}}-specific object, subject
to vendor implementation. Optional. Typically contains quantity and characteristics of the requested
resources.

<!--more-->

Not part of core Kubernetes. Referenced in `ParametersRef` field of
{{< glossary_tooltip term_id="ResourceClaim" text="ResourceClaim">}}.
