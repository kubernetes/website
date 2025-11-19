---
title: RemainingItemCount
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.15"
    toVersion: "1.15"
  - stage: beta
    defaultValue: true
    fromVersion: "1.16"
    toVersion: "1.28"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.29"   
    toVersion: "1.32"

removed: true
---

<!--
Allow the API servers to show a count of remaining
items in the response to a
[chunking list request](/docs/reference/using-api/api-concepts/#retrieving-large-results-sets-in-chunks).
-->
允許 API
服務器在[分塊列表請求](/zh-cn/docs/reference/using-api/api-concepts/#retrieving-large-results-sets-in-chunks)的響應中顯示剩餘條目的個數。
