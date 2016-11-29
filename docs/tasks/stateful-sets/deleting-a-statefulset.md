---
assignees:
- bprashanth
- erictune
- foxish
- janetkuo
- smarterclayton

---

{% capture overview %}
This task shows you how to delete a Stateful Set.
{% endcapture %}

{% capture prerequisites %}

* If you are not using Stateful Sets, you can skip this task now. 

{% endcapture %}

{% capture steps %}

### Deleting a StatefulSet

A Stateful Set can be deleted like other resources in Kubernetes. 

```shell
kubectl delete -f <file.yaml> 
```

or

```shell
kubectl delete statefulsets <statefulset-name>
```

The associated headless service may need to be deleted separately after the Stateful Set itself is deleted.

```shell
kubectl delete service <service-name>
```

Deleting a Stateful Set through kubectl will scale it down to 0, thereby deleting all pods that are a part of it. If you wish to delete just the Stateful Set and not the pods, use `--cascade=false`.

```shell
kubectl delete -f <file.yaml> --cascade=false
```
Setting `--cascade=false` causes the Pods managed by the Stateful Set to be left behind even after the Stateful Set object itself is deleted.
If the pods have a label `app=myapp`, they can then be deleted as follows.

```shell
kubectl delete pods -l app=myapp
```

#### Persistent Volumes

Deleting the pods will *not* delete the volumes. This is to ensure that you have the chance to copy data off the volume before deleting it. Deleting the PVC after the pods have left the [terminating state](/docs/user-guide/pods/index#termination-of-pods) may trigger deletion of the backing Persistent Volumes depending on the storage class and reclaim policy. You should never assume ability to access a volume after claim deletion.

**Note: you may lose all your data once the PVC is deleted, do this with caution.**

#### Complete deletion of a Stateful Set

If you simply want to clean everything in a Stateful Set containing pods which have the label `app=myapp`:

```shell
grace=$(kubectl get pods <stateful-set-pod> --template '{{.spec.terminationGracePeriodSeconds}}')
kubectl delete statefulset -l app=myapp
sleep $grace
kubectl delete pvc -l app=myapp
```

#### Force deletion of Stateful Set pods

If you find that some pods in your Stateful Set are stuck in the 'Terminating' or 'Unknown' states for an extended period of time, you may need to manually intervene to forcefully delete the pods from the apiserver. This is a potentially dangerous task. Refer to [deleting Stateful Set pods](/docs/tasks/stateful-sets/deleting-pods/) for details.

{% endcapture %}

{% capture whatsnext %}
Learn more about debugging a Stateful Set. *TODO: Link to the task for debugging a Stateful Set*
{% endcapture %}

{% include templates/task.md %}
