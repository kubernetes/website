---
title: RemoveSelfLink
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.16"
    toVersion: "1.19"
  - stage: beta
    defaultValue: true
    fromVersion: "1.20"  
    toVersion: "1.23" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.24"  
    toVersion: "1.29"

removed: true
---
Встановлює поле `.metadata.selfLink` порожнім (порожній рядок) для всіх обʼєктів і колекцій. Це поле застаріло з випуску Kubernetes v1.16. Коли цю можливість увімкнено, поле `.metadata.selfLink` залишається частиною API Kubernetes, але завжди не встановлене.
