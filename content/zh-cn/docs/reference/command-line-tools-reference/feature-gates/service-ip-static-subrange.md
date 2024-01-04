---
title: ServiceIPStaticSubrange
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.24"
    toVersion: "1.24"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.25"
    toVersion: "1.25"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.26"
    toVersion: "1.27"    

removed: true  
---
<!--
Enables a strategy for Services ClusterIP allocations, whereby the
ClusterIP range is subdivided. Dynamic allocated ClusterIP addresses will be allocated preferently
from the upper range allowing users to assign static ClusterIPs from the lower range with a low
risk of collision. See
[Avoiding collisions](/docs/reference/networking/virtual-ips/#avoiding-collisions)
for more details.
-->
启用 Service 的 ClusterIP 分配策略，从而细分 ClusterIP 范围。
动态分配的 ClusterIP 地址将优先从较高范围分配，
以允许用户从较低范围分配静态 ClusterIP，进而降低发生冲突的风险。
更多详细信息请参阅[避免冲突](/zh-cn/docs/reference/networking/virtual-ips/#avoiding-collisions)。
