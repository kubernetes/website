---
title: AdmissionWebhookMatchConditions
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.27"
    toVersion: "1.27"
  - stage: beta
    defaultValue: true
    fromVersion: "1.28"  
---

<!--
Enable [match conditions](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchconditions)
on mutating & validating admission webhooks.
-->
在变更性质和合法性检查性质的准入 Webhook
上启用[匹配状况](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchconditions)。
