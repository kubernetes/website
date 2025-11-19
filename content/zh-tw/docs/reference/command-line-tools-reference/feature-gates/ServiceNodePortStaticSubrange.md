---
title: ServiceNodePortStaticSubrange
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
    toVersion: "1.28" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.29" 
    toVersion: "1.30" 

removed: true  
---

<!--
Enables the use of different port allocation
strategies for NodePort Services. For more details, see
[reserve NodePort ranges to avoid collisions](/docs/concepts/services-networking/service/#avoid-nodeport-collisions).
-->
允許對 NodePort Service 使用不同的端口分配策略。
有關更多詳細信息，
請參閱[保留 NodePort 範圍以避免衝突](/zh-cn/docs/concepts/services-networking/service/#avoid-nodeport-collisions)。
