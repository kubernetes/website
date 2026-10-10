---
title: DryRun
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.12"
    toVersion: "1.12"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.13"
    toVersion: "1.18"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.19"
    toVersion: "1.27"    

removed: true  
---
<!--
Enable server-side [dry run](/docs/reference/using-api/api-concepts/#dry-run) requests
so that validation, merging, and mutation can be tested without committing.
-->
启用在服务器端对请求进行
[试运行（Dry Run）](/zh-cn/docs/reference/using-api/api-concepts/#dry-run)，
以便在不提交的情况下测试验证、合并和变更。

