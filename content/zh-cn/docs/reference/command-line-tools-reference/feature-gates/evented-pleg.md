---
title: EventedPLEG
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.25"
---
<!--
Enable support for the kubelet to receive container life cycle events from the
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}} via
an extension to {{<glossary_tooltip term_id="cri" text="CRI">}}.
(PLEG is an abbreviation for “Pod lifecycle event generator”).
For this feature to be useful, you also need to enable support for container lifecycle events
in each container runtime running in your cluster. If the container runtime does not announce
support for container lifecycle events then the kubelet automatically switches to the legacy
generic PLEG mechanism, even if you have this feature gate enabled.
-->
启用此特性后，kubelet 能够通过
{{<glossary_tooltip term_id="cri" text="CRI">}}
扩展从{{< glossary_tooltip text="容器运行时" term_id="container-runtime" >}}接收容器生命周期事件。
（PLEG 是 “Pod lifecycle event generator” 的缩写，即 Pod 生命周期事件生成器）。
要使用此特性，你还需要在集群中运行的每个容器运行时中启用对容器生命周期事件的支持。
如果容器运行时未宣布支持容器生命周期事件，即使你已启用了此特性门控，
kubelet 也会自动切换到原有的通用 PLEG 机制。
