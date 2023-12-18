---
# Removed from Kubernetes
title: ExperimentalCriticalPodAnnotation
content_type: feature_gate

_build:
  list: never
  render: false
---
Enable annotating specific pods as *critical*
so that their [scheduling is guaranteed](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/).
This feature is deprecated by Pod Priority and Preemption as of v1.13.
