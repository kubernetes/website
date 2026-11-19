---
title: LegacyCgroupDriverFallback
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.38"
---
Allow the kubelet to fall back to the `cgroupDriver` configuration setting
(or deprecated `--cgroup-driver` command line argument) when the container runtime
doesn't support the `RuntimeConfig`
{{<glossary_tooltip term_id="cri" text="CRI">}} call.
With this feature gate disabled, the kubelet does not start with such a runtime,
nor with `cgroupDriver` set.
Enable it only while you upgrade the container runtime, as
[cgroup drivers](/docs/setup/production-environment/container-runtimes/#cgroup-drivers)
describes. The `kubelet_cri_losing_support` metric shows which nodes rely on the fallback.
