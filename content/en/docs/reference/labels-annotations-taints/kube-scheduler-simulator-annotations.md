---
title: kube-scheduler-simulator Annotations
content_type: concept
weight: 72
---

Annotations in this page are used by the
[kube-scheduler-simulator project](https://sigs.k8s.io/kube-scheduler-simulator).

## Annotations used by the kube-scheduler-simulator

### kube-scheduler-simulator.sigs.k8s.io/bind-result

Example: `kube-scheduler-simulator.sigs.k8s.io/bind-result: '{"DefaultBinder":"success"}'`

Used on: Pod

This annotation records the result of bind scheduler plugins.

### kube-scheduler-simulator.sigs.k8s.io/filter-result

Example: 

```yaml
kube-scheduler-simulator.sigs.k8s.io/filter-result: >-
      {"node-282x7":{"AzureDiskLimits":"passed","EBSLimits":"passed","GCEPDLimits":"passed","InterPodAffinity":"passed","NodeAffinity":"passed","NodeName":"passed","NodePorts":"passed","NodeResourcesFit":"passed","NodeUnschedulable":"passed","NodeVolumeLimits":"passed","PodTopologySpread":"passed","TaintToleration":"passed","VolumeBinding":"passed","VolumeRestrictions":"passed","VolumeZone":"passed"},"node-gp9t4":{"AzureDiskLimits":"passed","EBSLimits":"passed","GCEPDLimits":"passed","InterPodAffinity":"passed","NodeAffinity":"passed","NodeName":"passed","NodePorts":"passed","NodeResourcesFit":"passed","NodeUnschedulable":"passed","NodeVolumeLimits":"passed","PodTopologySpread":"passed","TaintToleration":"passed","VolumeBinding":"passed","VolumeRestrictions":"passed","VolumeZone":"passed"}}
```

Used on: Pod

This annotation records the result of filter scheduler plugins.

### kube-scheduler-simulator.sigs.k8s.io/finalscore-result

Example: 

```yaml
kube-scheduler-simulator.sigs.k8s.io/finalscore-result: >-
      {"node-282x7":{"ImageLocality":"0","InterPodAffinity":"0","NodeAffinity":"0","NodeNumber":"0","NodeResourcesBalancedAllocation":"76","NodeResourcesFit":"73","PodTopologySpread":"200","TaintToleration":"300","VolumeBinding":"0"},"node-gp9t4":{"ImageLocality":"0","InterPodAffinity":"0","NodeAffinity":"0","NodeNumber":"0","NodeResourcesBalancedAllocation":"76","NodeResourcesFit":"73","PodTopologySpread":"200","TaintToleration":"300","VolumeBinding":"0"}}
```

Used on: Pod

This annotation records the final scores that the scheduler calculates
from the scores from Score scheduler plugins.

### kube-scheduler-simulator.sigs.k8s.io/permit-result

Example: `kube-scheduler-simulator.sigs.k8s.io/permit-result: '{"CustomPermitPlugin":"success"}'`

Used on: Pod

This annotation records the result of Permit scheduler plugins.

### kube-scheduler-simulator.sigs.k8s.io/permit-result-timeout

Example: `kube-scheduler-simulator.sigs.k8s.io/permit-result-timeout: '{"CustomPermitPlugin":"10s"}'`

Used on: Pod

This annotation records the timeouts returned from Permit scheduler plugins.

### kube-scheduler-simulator.sigs.k8s.io/postfilter-result

Example: `kube-scheduler-simulator.sigs.k8s.io/postfilter-result: '{"DefaultPreemption":"success"}'`

Used on: Pod

This annotation records the result of PostFilter scheduler plugins.

### kube-scheduler-simulator.sigs.k8s.io/prebind-result

Example: `kube-scheduler-simulator.sigs.k8s.io/prebind-result: '{"VolumeBinding":"success"}'`

Used on: Pod

This annotation records the result of PreBind scheduler plugins.

### kube-scheduler-simulator.sigs.k8s.io/prefilter-result

Example: `kube-scheduler-simulator.sigs.k8s.io/prebind-result: '{"NodeAffinity":"[\"node-\a"]"}'`

Used on: Pod

This annotation records the PreFilter result of PreFilter scheduler plugins.

### kube-scheduler-simulator.sigs.k8s.io/prefilter-result-status

Example: 

```yaml
kube-scheduler-simulator.sigs.k8s.io/prefilter-result-status: >-
      {"InterPodAffinity":"success","NodeAffinity":"success","NodePorts":"success","NodeResourcesFit":"success","PodTopologySpread":"success","VolumeBinding":"success","VolumeRestrictions":"success"}
```

Used on: Pod

This annotation records the result of PreFilter scheduler plugins.

### kube-scheduler-simulator.sigs.k8s.io/prescore-result

Example: 

```yaml
    kube-scheduler-simulator.sigs.k8s.io/prescore-result: >-
      {"InterPodAffinity":"success","NodeAffinity":"success","NodeNumber":"success","PodTopologySpread":"success","TaintToleration":"success"}
```

Used on: Pod

This annotation records the result of PreScore scheduler plugins.

### kube-scheduler-simulator.sigs.k8s.io/reserve-result

Example: `kube-scheduler-simulator.sigs.k8s.io/reserve-result: '{"VolumeBinding":"success"}'`

Used on: Pod

This annotation records the result of Reserve scheduler plugins.

### kube-scheduler-simulator.sigs.k8s.io/result-history

Example: `kube-scheduler-simulator.sigs.k8s.io/result-history: '[]'`

Used on: Pod

This annotation records all the past scheduling results from scheduler plugins.

### kube-scheduler-simulator.sigs.k8s.io/score-result

```yaml
    kube-scheduler-simulator.sigs.k8s.io/score-result: >-
      {"node-282x7":{"ImageLocality":"0","InterPodAffinity":"0","NodeAffinity":"0","NodeNumber":"0","NodeResourcesBalancedAllocation":"76","NodeResourcesFit":"73","PodTopologySpread":"0","TaintToleration":"0","VolumeBinding":"0"},"node-gp9t4":{"ImageLocality":"0","InterPodAffinity":"0","NodeAffinity":"0","NodeNumber":"0","NodeResourcesBalancedAllocation":"76","NodeResourcesFit":"73","PodTopologySpread":"0","TaintToleration":"0","VolumeBinding":"0"}}
```

Used on: Pod

This annotation records the result of Score scheduler plugins.

### kube-scheduler-simulator.sigs.k8s.io/selected-node

Example: `kube-scheduler-simulator.sigs.k8s.io/selected-node: node-282x7`

Used on: Pod

This annotation records the node that is selected by the scheduling cycle.

