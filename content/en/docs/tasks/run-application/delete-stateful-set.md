---
reviewers:
- bprashanth
- erictune
- foxish
- janetkuo
- smarterclayton
title: Delete a StatefulSet
content_type: task
weight: 60
---

<!-- overview -->

This task shows you how to delete a {{< glossary_tooltip term_id="StatefulSet" >}}.

## {{% heading "prerequisites" %}}

- This task assumes you have an application running on your cluster represented by a StatefulSet.

<!-- steps -->

## Deleting a StatefulSet

You can delete a StatefulSet in the same way you delete other resources in Kubernetes:
use the `kubectl delete` command, and specify the StatefulSet either by file or by name.

```shell
kubectl delete -f <file.yaml>
```

```shell
kubectl delete statefulsets <statefulset-name>
```

You may need to delete the associated headless service separately after the StatefulSet itself is deleted.

```shell
kubectl delete service <service-name>
```

When deleting a StatefulSet through `kubectl`, the StatefulSet scales down to 0.
All Pods that are part of this workload are also deleted. If you want to delete
only the StatefulSet and not the Pods, use `--cascade=orphan`. For example:

```shell
kubectl delete -f <file.yaml> --cascade=orphan
```

By passing `--cascade=orphan` to `kubectl delete`, the Pods managed by the StatefulSet
are left behind even after the StatefulSet object itself is deleted. If the pods have
a label `app.kubernetes.io/name=MyApp`, you can then delete them as follows:

```shell
kubectl delete pods -l app.kubernetes.io/name=MyApp
```

### Persistent Volumes

Deleting the Pods in a StatefulSet will not delete the associated volumes.
This is to ensure that you have the chance to copy data off the volume before
deleting it. Deleting the PVC after the pods have terminated might trigger
deletion of the backing Persistent Volumes depending on the storage class
and reclaim policy. You should never assume ability to access a volume
after claim deletion.

{{< note >}}
Use caution when deleting a PVC, as it may lead to data loss.
{{< /note >}}

### Complete deletion of a StatefulSet

To delete everything in a StatefulSet, including the associated pods,
you can run a series of commands similar to the following:

```shell
grace=$(kubectl get pods <stateful-set-pod> --template '{{.spec.terminationGracePeriodSeconds}}')
kubectl delete statefulset -l app.kubernetes.io/name=MyApp
sleep $grace
kubectl delete pvc -l app.kubernetes.io/name=MyApp

```

In the example above, the Pods have the label `app.kubernetes.io/name=MyApp`;
substitute your own label as appropriate.

### Force deletion of StatefulSet pods

If you find that some pods in your StatefulSet are stuck in the 'Terminating'
or 'Unknown' states for an extended period of time, you may need to manually
intervene to forcefully delete the pods from the apiserver.
This is a potentially dangerous task. Refer to
[Force Delete StatefulSet Pods](/docs/tasks/run-application/force-delete-stateful-set-pod/)
for details.

## {{% heading "whatsnext" %}}

Learn more about [force deleting StatefulSet Pods](/docs/tasks/run-application/force-delete-stateful-set-pod/).
