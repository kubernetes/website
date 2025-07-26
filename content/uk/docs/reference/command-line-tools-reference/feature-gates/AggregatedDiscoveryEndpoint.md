---
title: AggregatedDiscoveryEndpoint
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
    toVersion: "1.29"
  - stage: stable
    defaultValue: true
    fromVersion: "1.30"
    toVersion: "1.32"

removed: true
---
Вмикає єдину точку доступу до HTTP `/discovery/<version>`, яка підтримує власне кешування HTTP за допомогою теґів, що містять усі відомі APIResources на сервері API.
