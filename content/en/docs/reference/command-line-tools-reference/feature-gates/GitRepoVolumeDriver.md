---
title: GitRepoVolumeDriver
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.33"

---
This controls if the `gitRepo` volume plugin is supported or not.
The `gitRepo` volume plugin is disabled by default starting v1.33 release.
This provides a way for users to enable it.
