---
title: Pod shared pool
id: pod-shared-pool
full_link: /docs/concepts/resource-management/pod-level-resource-managers/
short_description: >
  The subset of a Pod's allocated resources that remains after all exclusive slices have been reserved.

aka:
tags:
- architecture
---
The subset of a {{< glossary_tooltip term_id="pod" >}}'s allocated resources
that remains after all
[exclusive slices](/docs/concepts/resource-management/pod-level-resource-managers/#glossary)
have been reserved.

<!--more-->

These resources are shared by all containers in the Pod that do not receive an
exclusive allocation. While containers in this pool share resources with each
other, they are strictly isolated from the exclusive slices and from the
general node-wide shared pool.
