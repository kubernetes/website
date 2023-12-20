---
title: DelegateFSGroupToCSIDriver
content_type: feature_gate
_build:
  list: never
  render: false
---
If supported by the CSI driver, delegates the
role of applying `fsGroup` from a Pod's `securityContext` to the driver by
passing `fsGroup` through the NodeStageVolume and NodePublishVolume CSI calls.
