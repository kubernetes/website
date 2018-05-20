---
reviewers:
- bprashanth
- erictune
- foxish
- janetkuo
- smarterclayton
title: Delete a StatefulSet
content_template: templates/task
weight: 60
---

{{% capture overview %}}

This task shows you how to delete a StatefulSet.

{{% /capture %}}

{{% capture prerequisites %}}

* This task assumes you have an application running on your cluster represented by a StatefulSet.

{{% /capture %}}

{{% capture steps %}}

## Deleting a StatefulSet

You can delete a StatefulSet in the same way you delete other resources in Kubernetes: use the `kubectl delete` command, and specify the StatefulSet either by file or by name.

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

Deleting a StatefulSet through kubectl will scale it down to 0, thereby deleting all pods that are a part of it. 
If you want to delete just the StatefulSet and not the pods, use `--cascade=false`.

```shell
kubectl delete -f <file.yaml> --cascade=false
```

By passing `--cascade=false` to `kubectl delete`, the Pods managed by the StatefulSet are left behind even after the StatefulSet object itself is deleted. If the pods have a label `app=myapp`, you can then delete them as follows:

```shell
kubectl delete pods -l app=myapp
```

### Persistent Volumes

Deleting the Pods in a StatefulSet will not delete the associated volumes. This is to ensure that you have the chance to copy data off the volume before deleting it. Deleting the PVC after the pods have left the [terminating state](/docs/concepts/workloads/pods/pod/#termination-of-pods) might trigger deletion of the backing Persistent Volumes depending on the storage class and reclaim policy. You should never assume ability to access a volume after claim deletion.

**Note: Use caution when deleting a PVC, as it may lead to data loss.**

### Complete deletion of a StatefulSet

To simply delete everything in a StatefulSet, including the associated pods, you can run a series of commands similar to the following:

```shell
grace=$(kubectl get pods <stateful-set-pod> --template '{{.spec.terminationGracePeriodSeconds}}')
kubectl delete statefulset -l app=myapp
sleep $grace
kubectl delete pvc -l app=myapp

```

In the example above, the Pods have the label `app=myapp`; substitute your own label as appropriate.

### Force deletion of StatefulSet pods

If you find that some pods in your StatefulSet are stuck in the 'Terminating' or 'Unknown' states for an extended period of time, you may need to manually intervene to forcefully delete the pods from the apiserver. This is a potentially dangerous task. Refer to [Deleting StatefulSet Pods](/docs/tasks/manage-stateful-set/delete-pods/) for details.

{{% /capture %}}

{{% capture whatsnext %}}

Learn more about [force deleting StatefulSet Pods](/docs/tasks/run-application/force-delete-stateful-set-pod/).

{{% /capture %}}


