---
title: Pod shared pool
id: pod-shared-pool
full_link: /docs/concepts/resource-management/pod-level-resource-managers/
short_description: >
  The subset of a Pod's allocated resources that remains after all exclusive
  slices have been reserved, shared by containers without an exclusive allocation.

aka:
tags:
- fundamental
- architecture
---
The subset of a Pod's allocated resources that remains after all exclusive slices have been reserved. These resources are shared by all containers in the Pod that do not receive an exclusive allocation.

<!--more-->

While containers in this pool share resources with each other, they are strictly isolated from the exclusive slices and the general node-wide shared pool.

For more information, refer to [Pod level resource managers](/docs/concepts/resource-management/pod-level-resource-managers/).
