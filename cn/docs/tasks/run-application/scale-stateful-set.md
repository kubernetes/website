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
---

{% capture overview %}
This page shows how to scale a StatefulSet.
{% endcapture %}

{% capture prerequisites %}

* StatefulSets are only available in Kubernetes version 1.5 or later.
* **Not all stateful applications scale nicely.** You need to understand your StatefulSets well before continuing. If you're unsure, remember that it might not be safe to scale your StatefulSets.
* You should perform scaling only when you're sure that your stateful application
  cluster is completely healthy.

{% endcapture %}

{% capture steps %}

## Use `kubectl` to scale StatefulSets

Make sure you have `kubectl` upgraded to Kubernetes version 1.5 or later before
continuing. If you're unsure, run `kubectl version` and check `Client Version`
for which kubectl you're using.

### `kubectl scale`

First, find the StatefulSet you want to scale. Remember, you need to first understand if you can scale it or not.

```shell
kubectl get statefulsets <stateful-set-name>
```

Change the number of replicas of your StatefulSet:

```shell
kubectl scale statefulsets <stateful-set-name> --replicas=<new-replicas>
```

### Alternative: `kubectl apply` / `kubectl edit` / `kubectl patch`

Alternatively, you can do [in-place updates](/docs/concepts/cluster-administration/manage-deployment/#in-place-updates-of-resources) on your StatefulSets.

If your StatefulSet was initially created with `kubectl apply` or `kubectl create --save-config`,
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

### Scaling down doesn't work right

You cannot scale down a StatefulSet when any of the stateful Pods it manages is unhealthy. Scaling down only takes place
after those stateful Pods become running and ready.

With a StatefulSet of size > 1, if there is an unhealthy Pod, there is no way
for Kubernetes to know (yet) if it is due to a permanent fault or a transient
one (upgrade/maintenance/node reboot). If the Pod is unhealthy due to a permanent fault, scaling
without correcting the fault may lead to a state where the StatefulSet membership
drops below a certain minimum number of "replicas" that are needed to function
correctly. This may cause your StatefulSet to become unavailable.

If the Pod is unhealthy due to a transient fault and the Pod might become available again,
the transient error may interfere with your scale-up/scale-down operation. Some distributed
databases have issues when nodes join and leave at the same time. It is better
to reason about scaling operations at the application level in these cases, and
perform scaling only when you're sure that your stateful application cluster is
completely healthy.


{% endcapture %}

{% capture whatsnext %}

Learn more about [deleting a StatefulSet](/docs/tasks/manage-stateful-set/deleting-a-statefulset/).

{% endcapture %}

{% include templates/task.md %}
