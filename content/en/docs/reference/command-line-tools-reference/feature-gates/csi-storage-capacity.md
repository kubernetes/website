---
title: CSIStorageCapacity
content_type: feature_gate
_build:
  list: never
  render: false
---
Enables CSI drivers to publish storage capacity information
and the Kubernetes scheduler to use that information when scheduling pods. See
[Storage Capacity](/docs/concepts/storage/storage-capacity/).
Check the [`csi` volume type](/docs/concepts/storage/volumes/#csi) documentation for more details.
