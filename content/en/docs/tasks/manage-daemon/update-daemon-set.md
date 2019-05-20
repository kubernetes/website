---
reviewers:
- janetkuo
title: Perform a Rolling Update on a DaemonSet
content_template: templates/task
weight: 10
---

{{% capture overview %}}

This page shows how to perform a rolling update on a DaemonSet.

{{% /capture %}}


{{% capture prerequisites %}}

* The DaemonSet rolling update feature is only supported in Kubernetes version 1.6 or later.

{{% /capture %}}


{{% capture steps %}}

## DaemonSet Update Strategy

DaemonSet has two update strategy types:

* OnDelete:  With `OnDelete` update strategy, after you update a DaemonSet template, new
  DaemonSet pods will *only* be created when you manually delete old DaemonSet
  pods. This is the same behavior of DaemonSet in Kubernetes version 1.5 or
  before.
* RollingUpdate: This is the default update strategy.  
  With `RollingUpdate` update strategy, after you update a
  DaemonSet template, old DaemonSet pods will be killed, and new DaemonSet pods
  will be created automatically, in a controlled fashion.

## Performing a Rolling Update

To enable the rolling update feature of a DaemonSet, you must set its
`.spec.updateStrategy.type` to `RollingUpdate`.

You may want to set [`.spec.updateStrategy.rollingUpdate.maxUnavailable`](/docs/concepts/workloads/controllers/deployment/#max-unavailable) (default
to 1) and [`.spec.minReadySeconds`](/docs/concepts/workloads/controllers/deployment/#min-ready-seconds) (default to 0) as well.


### Step 1: Checking DaemonSet `RollingUpdate` update strategy

First, check the update strategy of your DaemonSet, and make sure it's set to
`RollingUpdate`:

```shell
kubectl get ds/<daemonset-name> -o go-template='{{.spec.updateStrategy.type}}{{"\n"}}'
```

If you haven't created the DaemonSet in the system, check your DaemonSet
manifest with the following command instead:

```shell
kubectl apply -f ds.yaml --dry-run -o go-template='{{.spec.updateStrategy.type}}{{"\n"}}'
```

The output from both commands should be:

```shell
RollingUpdate
```

If the output isn't `RollingUpdate`, go back and modify the DaemonSet object or
manifest accordingly.

### Step 2: Creating a DaemonSet with `RollingUpdate` update strategy

If you have already created the DaemonSet, you may skip this step and jump to
step 3.

After verifying the update strategy of the DaemonSet manifest, create the DaemonSet:

```shell
kubectl apply -f ds.yaml
```

Alternatively, use `kubectl apply` to create the same DaemonSet if you plan to
update the DaemonSet with `kubectl apply`.

```shell
kubectl apply -f ds.yaml
```

### Step 3: Updating a DaemonSet template

Any updates to a `RollingUpdate` DaemonSet `.spec.template` will trigger a rolling
update. This can be done with several different `kubectl` commands.

#### Declarative commands

If you update DaemonSets using
[configuration files](/docs/concepts/overview/object-management-kubectl/declarative-config/),
use `kubectl apply`:

```shell
kubectl apply -f ds-v2.yaml
```

#### Imperative commands

If you update DaemonSets using
[imperative commands](/docs/concepts/overview/object-management-kubectl/imperative-command/),
use `kubectl edit` or `kubectl patch`:

```shell
kubectl edit ds/<daemonset-name>
```

```shell
kubectl patch ds/<daemonset-name> -p=<strategic-merge-patch>
```

##### Updating only the container image

If you just need to update the container image in the DaemonSet template, i.e.
`.spec.template.spec.containers[*].image`, use `kubectl set image`:

```shell
kubectl set image ds/<daemonset-name> <container-name>=<container-new-image>
```

### Step 4: Watching the rolling update status

Finally, watch the rollout status of the latest DaemonSet rolling update:

```shell
kubectl rollout status ds/<daemonset-name>
```

When the rollout is complete, the output is similar to this:

```shell
daemonset "<daemonset-name>" successfully rolled out
```

## Troubleshooting

### DaemonSet rolling update is stuck

Sometimes, a DaemonSet rolling update may be stuck. Here are some possible
causes:

#### Some nodes run out of resources

The rollout is stuck because new DaemonSet pods can't be scheduled on at least one
node. This is possible when the node is
[running out of resources](/docs/tasks/administer-cluster/out-of-resource/).

When this happens, find the nodes that don't have the DaemonSet pods scheduled on
by comparing the output of `kubectl get nodes` and the output of:

```shell
kubectl get pods -l <daemonset-selector-key>=<daemonset-selector-value> -o wide
```

Once you've found those nodes, delete some non-DaemonSet pods from the node to
make room for new DaemonSet pods.

{{< note >}}
This will cause service disruption when deleted pods are not controlled by any controllers or pods are not
replicated. This does not respect [PodDisruptionBudget](/docs/tasks/configure-pod-container/configure-pod-disruption-budget/)
either.
{{< /note >}}

#### Broken rollout

If the recent DaemonSet template update is broken, for example, the container is
crash looping, or the container image doesn't exist (often due to a typo),
DaemonSet rollout won't progress.

To fix this, just update the DaemonSet template again. New rollout won't be
blocked by previous unhealthy rollouts.

#### Clock skew

If `.spec.minReadySeconds` is specified in the DaemonSet, clock skew between
master and nodes will make DaemonSet unable to detect the right rollout
progress.


{{% /capture %}}


{{% capture whatsnext %}}

* See [Task: Performing a rollback on a
  DaemonSet](/docs/tasks/manage-daemon/rollback-daemon-set/)
* See [Concepts: Creating a DaemonSet to adopt existing DaemonSet pods](/docs/concepts/workloads/controllers/daemonset/)

{{% /capture %}}
