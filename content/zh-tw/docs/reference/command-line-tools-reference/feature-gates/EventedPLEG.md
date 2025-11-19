---
title: EventedPLEG
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.26"
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
啓用此特性後，kubelet 能夠通過
{{<glossary_tooltip term_id="cri" text="CRI">}}
擴展從{{< glossary_tooltip text="容器運行時" term_id="container-runtime" >}}接收容器生命週期事件。
（PLEG 是 “Pod lifecycle event generator” 的縮寫，即 Pod 生命週期事件生成器）。
要使用此特性，你還需要在集羣中運行的每個容器運行時中啓用對容器生命週期事件的支持。
如果容器運行時未宣佈支持容器生命週期事件，即使你已啓用了此特性門控，
kubelet 也會自動切換到原有的通用 PLEG 機制。
