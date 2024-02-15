---
title: ResourceClass
id: ResourceClass
date: 2023-10-16
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/
short_description: >
  Describes the type of resources that a resource driver can allocate.
aka:
tags:
- core-object
- fundamental
---
 Abstract object that links {{< glossary_tooltip term_id="ResourceClaim" text="ResourceClaims">}}
and {{< glossary_tooltip term_id="resource-driver" text="Resource Drivers">}}.

<!--more-->

When ResourceClaim needs resources allocation, its `resourceClassName` field indicates which
ResourceClass will be used to initiate allocation. ResourceClass contains the name of the driver,
that will perform the allocation, in `driverName` field, and optionally
{{< glossary_tooltip term_id="ResourceClassParameters" text="ResourceClassParameters">}}
reference to provide Resource Driver with further allocation process customization.

Same Resource Driver can be referenced in many ResourceClasses, typically in such case, ResourceClasses
have different {{< glossary_tooltip term_id="ResourceClassParameters" text="ResourceClassParameters">}}
telling driver to do the allocation differently for each of them. For instance, one class can be
used to allocate shared resources, another - to allocate resources exclusively.

Typically managed by the cluster admin.
