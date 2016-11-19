---
assignees:
- bprashanth
- erictune
- foxish
- janetkuo
- smarterclayton

---

{% capture overview %}
This task shows you how to delete a StatefulSet.
{% endcapture %}

{% capture prerequisites %}

* If you are not using StatefulSets, you can skip this task now. 

{% endcapture %}

{% capture steps %}

### Deleting a StatefulSet

A StatefulSet can be deleted like other resources in kubernetes. 

```shell
kubectl delete -f <file.yaml> 
```

or

```shell
kubectl delete statefulsets <statefulset-name>
```

The associated headless service may need to be deleted separately after the StatefulSet itself is deleted.

```shell
kubectl delete service <service-name>
```

Deleting a StatefulSet through kubectl will scale it down to 0, thereby deleting all pods that are a part of it. If you wish to delete just the StatefulSet and not the pods, please use --cascade=false.


```shell
kubectl delete -f <file.yaml> --cascade=false
```
Setting `--cascade=false` causes the Pods managed by the StatefulSet to be left behind even after the StatefulSet object itself is deleted.
If the pods have a label `app=myapp`, they can then be deleted as follows.

```shell
kubectl delete pods -l app=myapp
```

#### Persistent Volumes

Deleting the pods will *not* delete the volumes. This is to ensure that you have the chance to copy data off the volume before deleting it. Deleting the PVC after the pods have left the [terminating state](/docs/user-guide/pods/index#termination-of-pods) may trigger deletion of the backing Persistent Volumes depending on the storage class and reclaim policy. You should never assume ability to access a volume after claim deletion.

**Note: you may lose all your data once the PVC is deleted, do this with caution.**

#### Complete deletion of a StatefulSet

If you simply want to clean everything in a StatefulSet containing pods which have the label `app=myapp`:

```shell
grace=$(kubectl get pods <stateful-set-pod> --template '{{.spec.terminationGracePeriodSeconds}}')
kubectl delete statefulset -l app=myapp
sleep $grace
kubectl delete pvc -l app=myapp
```

#### Force deletion of StatefulSet pods

If you find that some pods in your StatefulSet are stuck in the 'Terminating' or 'Unknown' states for an extended period of time, you may need to manually intervene to forcefully delete the pods from the apiserver. This is a potentially dangerous task. Refer to [Deleting StatefulSet Pods](/docs/tasks/stateful-sets/deleting-pods/) for details.

{% endcapture %}

{% capture whatsnext %}
Learn more about debugging a StatefulSet. *TODO: Link to the task for debugging a StatefulSet*
{% endcapture %}

{% include templates/task.md %}
