---
title: ResourceQuota
id: resource-quota
date: 2018-04-12
full_link: /docs/concepts/policy/resource-quotas/
short_description: >
  Provides constraints that limit aggregate resource consumption per namespace.

aka: 
tags:
- fundamental
- operation
- architecture
---
Object that constrains aggregate resource
consumption, per {{< glossary_tooltip term_id="namespace" >}}.

<!--more-->

A ResourceQuota can either limits the quantity of {{< glossary_tooltip text="API resources" term_id="api-resource" >}}
that can be created in a namespace by type, or it can set a limit on the total amount of
{{< glossary_tooltip text="infrastructure resources" term_id="infrastructure-resource" >}}
that may be consumed on behalf of the namespace (and the objects within it).

