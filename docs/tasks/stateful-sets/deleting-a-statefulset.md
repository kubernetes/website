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

A Stateful Set can be deleted like other resources in kubernetes. 

```shell
$ kubectl delete -f statefulset.yaml 
statefulset "web" deleted

```


```shell
$ kubectl delete statefulsets web
statefulset "web" deleted

```

The associated headless service may need to be deleted separately after the Stateful Set itself is deleted.

```shell
$ kubectl delete service web
service "web" deleted

```

Deleting a Stateful Set through kubectl will scale it down to 0, thereby deleting all pods that are a part of it. If you wish to delete just the Stateful Set and not the pods, please use --cascade=false.

```shell
$ kubectl delete -f statefulset.yaml --cascade=false
petset "web" deleted

$ kubectl get po -l app=myapp
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          21h
web-1     1/1       Running   0          21h

$ kubectl delete po -l app=myapp
pod "web-0" deleted
pod "web-1" deleted
```

#### Persistent Volumes

Deleting the pods will *not* delete the volumes. Until we finalize the recycle policy for these volumes they will have to get cleaned up by an admin. This is to ensure that you have the chance to copy data off the volume before deleting it. Simply deleting the PVC after the pods have left the [terminating state](/docs/user-guide/pods/index#termination-of-pods) should trigger deletion of the backing Persistent Volumes. 

**Note: you will lose all your data once the PVC is deleted, do this with caution.**

```shell
$ kubectl get pvc -l app=myapp
NAME        STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
www-web-0   Bound     pvc-62d271cd-3822-11e6-b1b7-42010af00002   0                        21h
www-web-1   Bound     pvc-62d6750e-3822-11e6-b1b7-42010af00002   0                        21h

$ kubectl delete pvc -l app=myapp
$ kubectl get pv
```

#### Complete deletion of a Stateful Set

If you simply want to clean everything:

```shell{% raw %}
$ grace=$(kubectl get po web-0 --template '{{.spec.terminationGracePeriodSeconds}}')
$ kubectl delete petset,po -l app=nginx
$ sleep $grace
$ kubectl delete pvc -l app=nginx
{% endraw %}
```

#### Force deletion of Stateful Set pods

If you find that some pods in your Stateful Set are stuck in the 'Terminating' or 'Unknown' states for an extended period of time, you may need to manually intervene to forcefully delete the pods from the apiserver. This is a potentially dangerous task. Please refer to *TODO: Link to the task for force deleting a Stateful Set pod* for details.

{% endcapture %}

{% capture whatsnext %}
Learn more about debugging a Stateful Set. *TODO: Link to the task for debugging a Stateful Set*
{% endcapture %}

{% include templates/task.md %}
