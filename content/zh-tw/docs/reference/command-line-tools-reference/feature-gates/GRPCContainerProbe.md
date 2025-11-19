---
title: GRPCContainerProbe
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.23"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.26"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.28"    

removed: true 
---

<!--
Enables the gRPC probe method for {Liveness,Readiness,Startup}Probe.
See [Configure Liveness, Readiness and Startup Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-grpc-liveness-probe).
-->
爲活躍態、就緒態和啓動探針啓用 gRPC 探針。
參閱[設定活躍態、就緒態和啓動探針](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-grpc-liveness-probe)。
