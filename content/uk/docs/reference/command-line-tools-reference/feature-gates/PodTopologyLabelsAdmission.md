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
---
Вмикає втулок доступу `PodTopologyLabels`. Докладні відомості наведено у статті [Мітки топології podʼів](docs/reference/access-authn-authz/admission-controllers#podtopologylabels).
