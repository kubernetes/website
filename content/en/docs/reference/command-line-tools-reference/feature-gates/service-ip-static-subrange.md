---
title: ServiceIPStaticSubrange
content_type: feature_gate
_build:
  list: never
  render: false
---
Enables a strategy for Services ClusterIP allocations, whereby the
ClusterIP range is subdivided. Dynamic allocated ClusterIP addresses will be allocated preferently
from the upper range allowing users to assign static ClusterIPs from the lower range with a low
risk of collision. See
[Avoiding collisions](/docs/reference/networking/virtual-ips/#avoiding-collisions)
for more details.
