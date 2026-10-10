---
# Removed from Kubernetes
title: APISelfSubjectReview
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.26"
    toVersion: "1.26"
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"  
    toVersion: "1.27" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.28"  
    toVersion: "1.29"
removed: true
---
Activate the `SelfSubjectReview` API which allows users
to see the requesting subject's authentication information.
See [API access to authentication information for a client](/docs/reference/access-authn-authz/authentication/#self-subject-review)
for more details.
