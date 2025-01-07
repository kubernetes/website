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
Enable support for the kubelet to receive container life cycle events from the
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}} via
an extension to {{<glossary_tooltip term_id="cri" text="CRI">}}.
(PLEG is an abbreviation for “Pod lifecycle event generator”).
For this feature to be useful, you also need to enable support for container lifecycle events
in each container runtime running in your cluster. If the container runtime does not announce
support for container lifecycle events then the kubelet automatically switches to the legacy
generic PLEG mechanism, even if you have this feature gate enabled.
