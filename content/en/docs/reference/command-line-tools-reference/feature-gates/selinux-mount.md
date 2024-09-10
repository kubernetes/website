---
title: SELinuxMount
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.30"
---
Speeds up container startup by allowing kubelet to mount volumes
for a Pod directly with the correct SELinux label instead of changing each file on the volumes
recursively.
It widens the performance improvements behind the `SELinuxMountReadWriteOncePod`
feature gate by extending the implementation to all volumes.

Enabling the `SELinuxMount` feature gate requires the feature gate `SELinuxMountReadWriteOncePod` to
be enabled.
