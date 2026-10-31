---
title: Pod shared pool
id: pod-shared-pool
full_link: /docs/concepts/resource-management/pod-level-resource-managers/
short_description: >
  Pod resources remaining after reserving exclusive slices, shared among
  non-exclusive containers.
tags:
- architecture
---
The Pod shared pool consists of the resources remaining after a Pod's exclusive slices have been reserved. These resources are shared by any containers within the Pod that do not receive an exclusive allocation.

<!--more-->

The Pod shared pool forms only when the Topology Manager scope is `pod`. While containers in this pool share resources with each other, they are strictly isolated from both the exclusive slices and the general node-wide shared pool.

For more information, refer to [Pod level resource managers](/docs/concepts/resource-management/pod-level-resource-managers/).
