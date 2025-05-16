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

<!--
Enables the `PodTopologyLabels` admission plugin.
See [Pod Topology Labels](docs/reference/access-authn-authz/admission-controllers#podtopologylabels)
for details.
-->
启用 `PodTopologyLabels` 准入插件。  
有关细节参见 [Pod 拓扑标签](/zh-cn/docs/reference/access-authn-authz/admission-controllers#podtopologylabels)。
