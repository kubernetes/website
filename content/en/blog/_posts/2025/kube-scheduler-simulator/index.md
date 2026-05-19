---
layout: blog
title: "Introducing kube-scheduler-simulator"
date: 2025-04-07
draft: false 
slug: introducing-kube-scheduler-simulator
author: Kensei Nakada (Tetrate)
---

The Kubernetes Scheduler is a crucial control plane component that determines which node a Pod will run on. 
Thus, anyone utilizing Kubernetes relies on a scheduler.

[kube-scheduler-simulator](https://github.com/kubernetes-sigs/kube-scheduler-simulator) is a _simulator_ for the Kubernetes scheduler, that started as a [Google Summer of Code 2021](https://summerofcode.withgoogle.com/) project developed by me (Kensei Nakada) and later received a lot of contributions.
This tool allows users to closely examine the scheduler’s behavior and decisions. 

It is useful for casual users who employ scheduling constraints (for example, [inter-Pod affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity/#affinity-and-anti-affinity))
and experts who extend the scheduler with custom plugins.

## Motivation

The scheduler often appears as a black box, 
composed of many plugins that each contribute to the scheduling decision-making process from their unique perspectives. 
Understanding its behavior can be challenging due to the multitude of factors it considers. 

Even if a Pod appears to be scheduled correctly in a simple test cluster, it might have been scheduled based on different calculations than expected. This discrepancy could lead to unexpected scheduling outcomes when deployed in a large production environment.

Also, testing a scheduler is a complex challenge.
There are countless patterns of operations executed within a real cluster, making it unfeasible to anticipate every scenario with a finite number of tests. 
More often than not, bugs are discovered only when the scheduler is deployed in an actual cluster.
Actually, many bugs are found by users after shipping the release, 
even in the upstream kube-scheduler. 

Having a development or sandbox environment for testing the scheduler — or, indeed, any Kubernetes controllers — is a common practice.
However, this approach falls short of capturing all the potential scenarios that might arise in a production cluster 
because a development cluster is often much smaller with notable differences in workload sizes and scaling dynamics.
It never sees the exact same use or exhibits the same behavior as its production counterpart.

The kube-scheduler-simulator aims to solve those problems.
It enables users to test their scheduling constraints, scheduler configurations, 
and custom plugins while checking every detailed part of scheduling decisions.
It also allows users to create a simulated cluster environment, where they can test their scheduler
with the same resources as their production cluster without affecting actual workloads.

## Features of the kube-scheduler-simulator

The kube-scheduler-simulator’s core feature is its ability to expose the scheduler's internal decisions.
The scheduler operates based on the [scheduling framework](/docs/concepts/scheduling-eviction/scheduling-framework/), 
using various plugins at different extension points,
filter nodes (Filter phase), score nodes (Score phase), and ultimately determine the best node for the Pod.

The simulator allows users to create Kubernetes resources and observe how each plugin influences the scheduling decisions for Pods.
This visibility helps users understand the scheduler’s workings and define appropriate scheduling constraints.

{{< figure src="/images/blog/2025-04-07-kube-scheduler-simulator/simulator.png" alt="Screenshot of the simulator web frontend that shows the detailed scheduling results per node and per extension point" title="The simulator web frontend" >}}

Inside the simulator, a debuggable scheduler runs instead of the vanilla scheduler. 
This debuggable scheduler outputs the results of each scheduler plugin at every extension point to the Pod’s annotations like the following manifest shows
and the web front end formats/visualizes the scheduling results based on these annotations.

```yaml
kind: Pod
apiVersion: v1
metadata:
  # The JSONs within these annotations are manually formatted for clarity in the blog post. 
  annotations:
    kube-scheduler-simulator.sigs.k8s.io/bind-result: '{"DefaultBinder":"success"}'
    kube-scheduler-simulator.sigs.k8s.io/filter-result: >-
      {
        "node-jjfg5":{
            "NodeName":"passed",
            "NodeResourcesFit":"passed",
            "NodeUnschedulable":"passed",
            "TaintToleration":"passed"
        },
        "node-mtb5x":{
            "NodeName":"passed",
            "NodeResourcesFit":"passed",
            "NodeUnschedulable":"passed",
            "TaintToleration":"passed"
        }
      }
    kube-scheduler-simulator.sigs.k8s.io/finalscore-result: >-
      {
        "node-jjfg5":{
            "ImageLocality":"0",
            "NodeAffinity":"0",
            "NodeResourcesBalancedAllocation":"52",
            "NodeResourcesFit":"47",
            "TaintToleration":"300",
            "VolumeBinding":"0"
        },
        "node-mtb5x":{
            "ImageLocality":"0",
            "NodeAffinity":"0",
            "NodeResourcesBalancedAllocation":"76",
            "NodeResourcesFit":"73",
            "TaintToleration":"300",
            "VolumeBinding":"0"
        }
      } 
    kube-scheduler-simulator.sigs.k8s.io/permit-result: '{}'
    kube-scheduler-simulator.sigs.k8s.io/permit-result-timeout: '{}'
    kube-scheduler-simulator.sigs.k8s.io/postfilter-result: '{}'
    kube-scheduler-simulator.sigs.k8s.io/prebind-result: '{"VolumeBinding":"success"}'
    kube-scheduler-simulator.sigs.k8s.io/prefilter-result: '{}'
    kube-scheduler-simulator.sigs.k8s.io/prefilter-result-status: >-
      {
        "AzureDiskLimits":"",
        "EBSLimits":"",
        "GCEPDLimits":"",
        "InterPodAffinity":"",
        "NodeAffinity":"",
        "NodePorts":"",
        "NodeResourcesFit":"success",
        "NodeVolumeLimits":"",
        "PodTopologySpread":"",
        "VolumeBinding":"",
        "VolumeRestrictions":"",
        "VolumeZone":""
      }
    kube-scheduler-simulator.sigs.k8s.io/prescore-result: >-
      {
        "InterPodAffinity":"",
        "NodeAffinity":"success",
        "NodeResourcesBalancedAllocation":"success",
        "NodeResourcesFit":"success",
        "PodTopologySpread":"",
        "TaintToleration":"success"
      }
    kube-scheduler-simulator.sigs.k8s.io/reserve-result: '{"VolumeBinding":"success"}'
    kube-scheduler-simulator.sigs.k8s.io/result-history: >-
      [
        {
            "kube-scheduler-simulator.sigs.k8s.io/bind-result":"{\"DefaultBinder\":\"success\"}",
            "kube-scheduler-simulator.sigs.k8s.io/filter-result":"{\"node-jjfg5\":{\"NodeName\":\"passed\",\"NodeResourcesFit\":\"passed\",\"NodeUnschedulable\":\"passed\",\"TaintToleration\":\"passed\"},\"node-mtb5x\":{\"NodeName\":\"passed\",\"NodeResourcesFit\":\"passed\",\"NodeUnschedulable\":\"passed\",\"TaintToleration\":\"passed\"}}",
            "kube-scheduler-simulator.sigs.k8s.io/finalscore-result":"{\"node-jjfg5\":{\"ImageLocality\":\"0\",\"NodeAffinity\":\"0\",\"NodeResourcesBalancedAllocation\":\"52\",\"NodeResourcesFit\":\"47\",\"TaintToleration\":\"300\",\"VolumeBinding\":\"0\"},\"node-mtb5x\":{\"ImageLocality\":\"0\",\"NodeAffinity\":\"0\",\"NodeResourcesBalancedAllocation\":\"76\",\"NodeResourcesFit\":\"73\",\"TaintToleration\":\"300\",\"VolumeBinding\":\"0\"}}",
            "kube-scheduler-simulator.sigs.k8s.io/permit-result":"{}",
            "kube-scheduler-simulator.sigs.k8s.io/permit-result-timeout":"{}",
            "kube-scheduler-simulator.sigs.k8s.io/postfilter-result":"{}",
            "kube-scheduler-simulator.sigs.k8s.io/prebind-result":"{\"VolumeBinding\":\"success\"}",
            "kube-scheduler-simulator.sigs.k8s.io/prefilter-result":"{}",
            "kube-scheduler-simulator.sigs.k8s.io/prefilter-result-status":"{\"AzureDiskLimits\":\"\",\"EBSLimits\":\"\",\"GCEPDLimits\":\"\",\"InterPodAffinity\":\"\",\"NodeAffinity\":\"\",\"NodePorts\":\"\",\"NodeResourcesFit\":\"success\",\"NodeVolumeLimits\":\"\",\"PodTopologySpread\":\"\",\"VolumeBinding\":\"\",\"VolumeRestrictions\":\"\",\"VolumeZone\":\"\"}",
            "kube-scheduler-simulator.sigs.k8s.io/prescore-result":"{\"InterPodAffinity\":\"\",\"NodeAffinity\":\"success\",\"NodeResourcesBalancedAllocation\":\"success\",\"NodeResourcesFit\":\"success\",\"PodTopologySpread\":\"\",\"TaintToleration\":\"success\"}",
            "kube-scheduler-simulator.sigs.k8s.io/reserve-result":"{\"VolumeBinding\":\"success\"}",
            "kube-scheduler-simulator.sigs.k8s.io/score-result":"{\"node-jjfg5\":{\"ImageLocality\":\"0\",\"NodeAffinity\":\"0\",\"NodeResourcesBalancedAllocation\":\"52\",\"NodeResourcesFit\":\"47\",\"TaintToleration\":\"0\",\"VolumeBinding\":\"0\"},\"node-mtb5x\":{\"ImageLocality\":\"0\",\"NodeAffinity\":\"0\",\"NodeResourcesBalancedAllocation\":\"76\",\"NodeResourcesFit\":\"73\",\"TaintToleration\":\"0\",\"VolumeBinding\":\"0\"}}",
            "kube-scheduler-simulator.sigs.k8s.io/selected-node":"node-mtb5x"
        }
      ]
    kube-scheduler-simulator.sigs.k8s.io/score-result: >-
      {
        "node-jjfg5":{
            "ImageLocality":"0",
            "NodeAffinity":"0",
            "NodeResourcesBalancedAllocation":"52",
            "NodeResourcesFit":"47",
            "TaintToleration":"0",
            "VolumeBinding":"0"
        },
        "node-mtb5x":{
            "ImageLocality":"0",
            "NodeAffinity":"0",
            "NodeResourcesBalancedAllocation":"76",
            "NodeResourcesFit":"73",
            "TaintToleration":"0",
            "VolumeBinding":"0"
        }
      }
    kube-scheduler-simulator.sigs.k8s.io/selected-node: node-mtb5x
```

Users can also integrate [their custom plugins](/docs/concepts/scheduling-eviction/scheduling-framework/) or [extenders](https://github.com/kubernetes/design-proposals-archive/blob/main/scheduling/scheduler_extender.md), into the debuggable scheduler and visualize their results. 

This debuggable scheduler can also run standalone, for example, on any Kubernetes cluster or in integration tests. 
This would be useful to custom plugin developers who want to test their plugins or examine their custom scheduler in a real cluster with better debuggability.

## The simulator as a better dev cluster

As mentioned earlier, with a limited set of tests, it is impossible to predict every possible scenario in a real-world cluster.
Typically, users will test the scheduler in a small, development cluster before deploying it to production, hoping that no issues arise.

[The simulator’s importing feature](https://github.com/kubernetes-sigs/kube-scheduler-simulator/blob/master/simulator/docs/import-cluster-resources.md)
provides a solution by allowing users to simulate deploying a new scheduler version in a production-like environment without impacting their live workloads.

By continuously syncing between a production cluster and the simulator, users can safely test a new scheduler version with the same resources their production cluster handles. 
Once confident in its performance, they can proceed with the production deployment, reducing the risk of unexpected issues.

## What are the use cases?

1. **Cluster users**: Examine if scheduling constraints (for example, PodAffinity, PodTopologySpread) work as intended.
1. **Cluster admins**: Assess how a cluster would behave with changes to the scheduler configuration.
1. **Scheduler plugin developers**: Test a custom scheduler plugins or extenders, use the debuggable scheduler in integration tests or development clusters, or use the [syncing](https://github.com/kubernetes-sigs/kube-scheduler-simulator/blob/simulator/v0.3.0/simulator/docs/import-cluster-resources.md) feature for testing within a production-like environment.

## Getting started

The simulator only requires Docker to be installed on a machine; a Kubernetes cluster is not necessary.

```
git clone git@github.com:kubernetes-sigs/kube-scheduler-simulator.git
cd kube-scheduler-simulator
make docker_up
```

You can then access the simulator's web UI at `http://localhost:3000`.

Visit the [kube-scheduler-simulator repository](https://sigs.k8s.io/kube-scheduler-simulator) for more details!

## Getting involved 

The scheduler simulator is developed by [Kubernetes SIG Scheduling](https://github.com/kubernetes/community/blob/master/sig-scheduling/README.md#kube-scheduler-simulator). Your feedback and contributions are welcome!

Open issues or PRs at the [kube-scheduler-simulator repository](https://sigs.k8s.io/kube-scheduler-simulator).
Join the conversation on the [#sig-scheduling](https://kubernetes.slack.com/messages/sig-scheduling) slack channel.


## Acknowledgments

The simulator has been maintained by dedicated volunteer engineers, overcoming many challenges to reach its current form. 

A big shout out to all [the awesome contributors](https://github.com/kubernetes-sigs/kube-scheduler-simulator/graphs/contributors)!
