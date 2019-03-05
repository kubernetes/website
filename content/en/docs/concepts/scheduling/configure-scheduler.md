---
title: How to Configure Your Kubernetes Scheduler
reviewers:
- wgliang
- tengqm
content_template: templates/concept
weight: 30
toc_hide: false
---

{{% capture overview %}}

This page explains how to configure Kubernetes scheduler.

{{% /capture %}}

{{% capture body %}}

## Scheduler

The Kubernetes scheduler is a main component of Kubernetes. It is responsible for selecting the best node for the pod based on predicates and priorites policies. Kubenetes provides the default scheduler and policies to place the pod on the appropriate node in a Kubernetes cluster.

## Configure the Policies

The Kubernetes scheduler plugin frameworks provides the user with the ability to:

1. Customize the default scheduler policies. 
2. Extend the scheduler.
3. Write the new scheduler(s) to either run alongside the default scheduler or replace the default scheduler.

The default scheduler policies fit most use cases. Users can fine-tune the scheduler behavior without modifying the default scheduler by specifying the customized-policy file when the  starts with the `--policy-config-file` option.

The following is an example the policy configration file [scheduler-policy-config.json](https://github.com/kubernetes/kubernetes/blob/c014cc274049ab1ab28b3acdd87da68eab5ffb30/examples/scheduler-policy-config.json),

```json
{
"kind" : "Policy",
"apiVersion" : "v1",
"predicates" : [
	{"name" : "PodFitsHostPorts"},
	{"name" : "PodFitsResources"},
	{"name" : "NoDiskConflict"},
	{"name" : "NoVolumeZoneConflict"},
	{"name" : "MatchNodeSelector"},
	{"name" : "HostName"}
	],
"priorities" : [
	{"name" : "LeastRequestedPriority", "weight" : 1},
	{"name" : "BalancedResourceAllocation", "weight" : 1},
	{"name" : "ServiceSpreadingPriority", "weight" : 1},
	{"name" : "EqualPriority", "weight" : 1}
	],
"hardPodAffinitySymmetricWeight" : 10,
"alwaysCheckAllPredicates" : false
}
```

## Predicates and Priorites

The scheduler policy is mainly composed of predicates and priorities rules. The predicates rules are used to filter the nodes and the priorities rules are used to elect the best fit node. Each priority rule has a `weight`, which specifies the factor of each rule. The scheduler calculates the score of each candidate node and the node with the highest rank is elected to host the pod.

The default scheduler doesn't facilitate all the predicates, based on the restrictiveness and computation complexity of predicates, the available predicates and its orders are listed in [Kubernetes Scheduler's Predicates and Orders](/docs/reference/kube-scheduler/predicates). 

The default scheduler facilitates some of the priority rules with default weight value, the available priorities and its weights are listed in [Kubernetes Scheduler's Priorities and Weights](/docs/reference/kube-scheduler/priorities).

## User Cases

### checkServiceAffinity

checkServiceAffinity is a predicate which matches nodes in such a way to force that
ServiceAffinity.labels are homogenous for pods that are scheduled to a node.
(i.e. it returns true IFF this pod can be added to this node such that all other pods in
the same service are running on nodes with the exact same ServiceAffinity.label values).

For example:

If the first pod of a service was scheduled to a node with label "region=foo",
all the other subsequent pods belong to the same service will be schedule on
nodes with the same "region=foo" label.

{{% /capture %}}

{{% capture whatsnext %}} 
* [Configure Multiple Schedulers](/docs/tasks/administer-cluster/configure-multiple-schedulers/).
* See [kube-scheduler](docs/reference/command-line-tools-reference/kube-scheduler/) for command line reference.

{{% /capture %}}


