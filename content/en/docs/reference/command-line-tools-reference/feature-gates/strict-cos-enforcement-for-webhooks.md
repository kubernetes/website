---
title: StrictCostEnforcementForWebhooks
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.30"
    
---
Enable enforcement of the strict cost calculation for CEL extended libraries within the
`matchConditions` field for
[admission webhooks](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks).