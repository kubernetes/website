---
title: GitRepoVolumeDriver
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: deprecated
    defaultValue: false
    locked: true
    fromVersion: "1.33"
---
This controls if the `gitRepo` volume plugin is supported or not.
The `gitRepo` volume plugin has been disabled and locked to disabled since v1.33.
It can no longer be enabled.
