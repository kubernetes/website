---
# Removed from Kubernetes
title: VolumeScheduling
content_type: feature_gate

_build:
  list: never
  render: false
---
Enable volume topology aware scheduling and make the PersistentVolumeClaim
(PVC) binding aware of scheduling decisions. It also enables the usage of
[`local`](/docs/concepts/storage/volumes/#local) volume type when used together with the
`PersistentLocalVolumes` feature gate.
