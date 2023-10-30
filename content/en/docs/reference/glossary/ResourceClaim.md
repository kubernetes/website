---
title: ResourceClaim
id: ResourceClaim
date: 2023-10-16
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/
short_description: >
  Defines what kind of resource is needed and what the parameters for it are.
aka:
tags:
- core-object
- fundamental
---
 Additional parameters are provided by a cluster admin in
{{< glossary_tooltip text="ResourceClass" term_id="ResourceClass" >}}.

<!--more-->

Can reference
{{< glossary_tooltip term_id="ResourceClaimParameters" text="ResourceClaimParameters">}}
with {{< glossary_tooltip term_id="resource-driver" text="Resource Driver">}}-specific details.
