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
Визначає, чи підтримується втулок томів `gitRepo`. Втулок томів `gitRepo` стандартно вимкнений, починаючи з версії 1.33. Це дає користувачам можливість увімкнути його.
