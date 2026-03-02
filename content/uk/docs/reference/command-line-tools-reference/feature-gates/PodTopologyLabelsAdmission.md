---
title: PodTopologyLabelsAdmission
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
    toVersion: "1.34"
  - stage: beta
    defaultValue: true
    fromVersion: "1.35"
---

Вмикає втулок доступу `PodTopologyLabels`. Докладні відомості наведено у статті [Мітки топології podʼів](/docs/reference/access-authn-authz/admission-controllers#podtopologylabels).
