---
title: Pod shared pool
id: pod-shared-pool
full_link: /docs/concepts/resource-management/pod-level-resource-managers/
short_description: >
  The portion of a Pod's allocated resources remaining after all exclusive
  slices are reserved, shared by containers without an exclusive allocation.

aka:
tags:
- fundamental
- architecture
---
Resources remaining after a Pod's exclusive slices have been reserved, shared by the containers that do not receive an exclusive allocation.

<!--more-->

While containers in this pool share resources with each other, they are strictly isolated from the exclusive slices and the general node-wide shared pool.

For more information, refer to [Pod level resource managers](/docs/concepts/resource-management/pod-level-resource-managers/).
