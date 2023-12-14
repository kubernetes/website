---
title: SELinuxMountReadWriteOncePod
content_type: feature_gate
_build:
  list: never
  render: false
---
Speeds up container startup by allowing kubelet to mount volumes
for a Pod directly with the correct SELinux label instead of changing each file on the volumes
recursively. The initial implementation focused on ReadWriteOncePod volumes.
