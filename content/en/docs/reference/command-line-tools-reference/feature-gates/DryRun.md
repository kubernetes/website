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
Enable server-side [dry run](/docs/reference/using-api/api-concepts/#dry-run) requests
so that validation, merging, and mutation can be tested without committing.
