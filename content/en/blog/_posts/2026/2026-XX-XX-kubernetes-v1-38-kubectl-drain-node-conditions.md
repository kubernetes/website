---
layout: blog
title: "Kubernetes v1.38: Reporting Node Drain Progress"
# date: 2026-XX-XX
draft: true
slug: kubernetes-v1-38-kubectl-drain-node-conditions
author: Ryan Hallisey (NVIDIA)
---

When a Kubernetes administrator runs `kubectl drain` on a Node, the operation is
visible through the command's output. There are also signs that the Node is
cordoned and that Pods are being evicted, but there is no clear signal showing
when the command completes or that a drain is in fact on going. Other components
would benefit from knowing whether a Node is currently being drained and whether
its drain criteria have been met.

Kubernetes v1.38 adds an alpha capability that lets `kubectl drain` publish that
context through two well-known [Node lifecycle conditions](/docs/reference/node/node-lifecycle-conditions/):
`DrainInProgress` and `Drained`. This is the next step in
[Specialized Lifecycle Management](https://kep.k8s.io/5683), a broader effort to
give cluster administrators and ecosystem tools to better lifecycle Nodes.


<!--more-->

## A shared signal for Node lifecycle

Kubernetes already exposes several signals about a Node. The `Ready` condition
reports whether the Node is healthy and ready to accept Pods. The
`unschedulable` field and taints influence scheduling and eviction. Pod state
shows what is running or terminating.

Those signals are useful, but they do not directly say that an administrator is
draining a Node or that the drain criteria selected by that administrator have
been met. A shared lifecycle signal gives dashboards, maintenance controllers,
and other automation a way to observe that context without reconstructing it
from several resources.

Node Lifecycle Conditions also include conditions for planned maintenance,
active maintenance, and Graceful Node Shutdown:

| Condition | What it reports |
| --- | --- |
| `DrainInProgress` | The Node is actively being drained according to the selected drain criteria. |
| `Drained` | The selected drain criteria have been met. |
| `MaintenancePlanned` | The Node is expected to undergo a change in the future. |
| `MaintenanceInProgress` | The Node is actively undergoing maintenance. |
| `GracefulNodeShutdownInProgress` | Graceful Node Shutdown is determined to be in progress on the Node. |

The conditions are observations. They do not change scheduling, eviction, or
workload-controller behavior in v1.38.

## How kubectl reports drain progress

In the alpha release, drain condition reporting is disabled by default. Enable
it by setting `KUBECTL_DRAIN_NODE_CONDITIONS=true`:

```shell
KUBECTL_DRAIN_NODE_CONDITIONS=true kubectl drain <node-name>
```

When enabled, `kubectl` updates `DrainInProgress` and `Drained` as the drain
operation progresses:

| Event | `DrainInProgress` | `Drained` | Reason |
| --- | --- | --- | --- |
| `kubectl drain` starts processing the Node | `True` | `False` | `KubectlDrainStarted` |
| The selected drain criteria are met | `False` | `True` | `KubectlDrainCompleted` |
| The drain fails or times out | `False` | `False` | `KubectlDrainFailed` |
| `kubectl uncordon` clears the observations | `False` | `False` | `KubectlUncordoned` |

For example, after a successful drain, an administrator can inspect the
conditions with:

```shell
kubectl get node <node-name> \
  -o jsonpath='{range .status.conditions[?(@.type=="DrainInProgress" || @.type=="Drained")]}{.type}={.status} reason={.reason}{"\n"}{end}'
```

The result includes both the observed state and the reason that `kubectl`
reported it:

```text
DrainInProgress=False reason=KubectlDrainCompleted
Drained=True reason=KubectlDrainCompleted
```

`Drained=True` has a deliberately narrow meaning. It means that the criteria
selected by that particular `kubectl drain` invocation were met. It does not
necessarily mean that the Node has no Pods, that another drain implementation
would select the same Pods, or that the Node is ready for termination.

## Returning a Node to service

When maintenance is complete, use `kubectl uncordon` as usual. To clear the
conditions that `kubectl` published, enable the same alpha capability for the
uncordon command:

```shell
KUBECTL_DRAIN_NODE_CONDITIONS=true kubectl uncordon <node-name>
```

The uncordon operation sets both drain conditions to `False` with the
`KubectlUncordoned` reason.

## Permissions and failure handling

Publishing conditions uses the Node `status` subresource. The user running
`kubectl` needs `patch` permission on `nodes/status`; this is separate from the
permission to update the main `nodes` resource when cordoning a Node.

Condition reporting is best effort. If a status update fails, `kubectl` prints
a warning and preserves the original result of the drain operation. A process
or host failure can leave a stale `DrainInProgress=True` condition. An
authorized administrator can inspect the condition timestamps and correct or
clear stale state.

## Building on Node lifecycle context

This alpha capability makes drain progress observable without requiring every
consumer to infer it from cordoning, Pod state, and eviction results. Future
work can build on the signal to help controllers and lifecycle automation make
better decisions about Nodes undergoing maintenance or removal.

The conditions themselves do not prescribe those future behaviors. Keeping
observation separate from policy lets administrators and the Kubernetes
community evaluate how different consumers should use lifecycle context.

Learn more in the [Node lifecycle conditions reference
documentation](/docs/reference/node/node-lifecycle-conditions/) and follow the
[KEP-5683: Node Lifecycle Conditions](https://kep.k8s.io/5683) for what's
next.
