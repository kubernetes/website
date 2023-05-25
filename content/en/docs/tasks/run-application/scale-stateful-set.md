---
reviewers:
- bprashanth
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton
title: Scale a StatefulSet
content_type: task
weight: 50
---

<!-- overview -->

This task shows how to scale a StatefulSet. Scaling a StatefulSet refers to
increasing or decreasing the number of replicas.

## {{% heading "prerequisites" %}}

- StatefulSets are only available in Kubernetes version 1.5 or later.
  To check your version of Kubernetes, run `kubectl version`.

- Not all stateful applications scale nicely. If you are unsure about whether
  to scale your StatefulSets, see [StatefulSet concepts](/docs/concepts/workloads/controllers/statefulset/)
  or [StatefulSet tutorial](/docs/tutorials/stateful-application/basic-stateful-set/) for further information.

- You should perform scaling only when you are confident that your stateful application
  cluster is completely healthy.

<!-- steps -->

## Scaling StatefulSets

### Use kubectl to scale StatefulSets

First, find the StatefulSet you want to scale.

```shell
kubectl get statefulsets <stateful-set-name>
```

Change the number of replicas of your StatefulSet:

```shell
kubectl scale statefulsets <stateful-set-name> --replicas=<new-replicas>
```

### Make in-place updates on your StatefulSets

Alternatively, you can do
[in-place updates](/docs/concepts/cluster-administration/manage-deployment/#in-place-updates-of-resources)
on your StatefulSets.

If your StatefulSet was initially created with `kubectl apply`,
update `.spec.replicas` of the StatefulSet manifests, and then do a `kubectl apply`:

```shell
kubectl apply -f <stateful-set-file-updated>
```

Otherwise, edit that field with `kubectl edit`:

```shell
kubectl edit statefulsets <stateful-set-name>
```

Or use `kubectl patch`:

```shell
kubectl patch statefulsets <stateful-set-name> -p '{"spec":{"replicas":<new-replicas>}}'
```

## Troubleshooting

### Scaling down does not work right

You cannot scale down a StatefulSet when any of the stateful Pods it manages is
unhealthy. Scaling down only takes place after those stateful Pods become running and ready.

If spec.replicas > 1, Kubernetes cannot determine the reason for an unhealthy Pod.
It might be the result of a permanent fault or of a transient fault. A transient
fault can be caused by a restart required by upgrading or maintenance.

If the Pod is unhealthy due to a permanent fault, scaling
without correcting the fault may lead to a state where the StatefulSet membership
drops below a certain minimum number of replicas that are needed to function
correctly. This may cause your StatefulSet to become unavailable.

If the Pod is unhealthy due to a transient fault and the Pod might become available again,
the transient error may interfere with your scale-up or scale-down operation. Some distributed
databases have issues when nodes join and leave at the same time. It is better
to reason about scaling operations at the application level in these cases, and
perform scaling only when you are sure that your stateful application cluster is
completely healthy.

## {{% heading "whatsnext" %}}

- Learn more about [deleting a StatefulSet](/docs/tasks/run-application/delete-stateful-set/).
