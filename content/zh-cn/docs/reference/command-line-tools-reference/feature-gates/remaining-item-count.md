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
---

<!--
Allow the API servers to show a count of remaining
items in the response to a
[chunking list request](/docs/reference/using-api/api-concepts/#retrieving-large-results-sets-in-chunks).
-->
允许 API 服务器在[分块列表请求](/zh-cn/docs/reference/using-api/api-concepts/#retrieving-large-results-sets-in-chunks)
的响应中显示剩余条目的个数。
