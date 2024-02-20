---
title: ServiceAccountTokenPodNodeInfo
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.29"
---
Controls whether the apiserver embeds the node name and uid
for the associated node when issuing service account tokens bound to Pod objects.
