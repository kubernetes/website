---
assignees:
- bprashanth
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton

---

{% capture overview %}
This task shows you how to debug a Stateful Set.
{% endcapture %}

{% capture prerequisites %}

* If you are not using Stateful Sets, you can skip this task now. 

{% endcapture %}

{% capture steps %}

### Debugging a Stateful Set

In order to list all the pods which belong to a Stateful Set, which have a label `app=myapp` set on them, you can use the following: 

```shell
kubectl get pods -l app=myapp
```
If you find that any Pods listed are in `Unknown` or `Terminating` state for an extended period of time, refer to the [Deleting Stateful Set Pods](/docs/tasks/stateful-sets/deleting-pods/) task for instructions on how to deal with them. You can debug individual Pods in a Stateful Set using the [debugging Pods guide](docs/user-guide/debugging-pods-and-replication-controllers/#debugging-pods). 

Stateful Sets provide a debug mechanism to pause all controller operations on Pods using an annotation. Setting the `pod.alpha.kubernetes.io/initialized` annotation to `"false"` on any Stateful Set Pod will *pause* all operations of the Stateful Set. When paused, the Stateful Set will not perform any scaling operations. Once the debug hook is set, you can execute commands within the containers of Stateful Set pods without interference from scaling operations.

```shell
kubectl annotate pods <pod-name> pod.alpha.kubernetes.io/initialized="false" --overwrite
```

Note that when the annotation is set to `"false"`, the Stateful Set will not respond to its Pods becoming unhealthy or unavailable. It will not create replacement Pods till the annotation is removed or set to `"true"` on each Stateful Set Pod. 

#### Step-wise Initialization

You can also use the same annotation to debug race conditions during bootstrapping of the Stateful Set by setting the `pod.alpha.kubernetes.io/initialized` annotation to `"false"` in the `.spec.template.metadata.annotations` field of the Stateful Set prior to creating it. 

```yaml
apiVersion: apps/v1beta1
kind: StatefulSet
metadata:
  name: my-app
spec:
  serviceName: "my-app"
  replicas: 3
  template:
    metadata:
      labels:
        app: my-app
      annotations:
        pod.alpha.kubernetes.io/initialized: "false"
...
...
... 

```

After setting the annotation, if you create the Stateful Set, you can wait for each Pod to come up and verify that it has initialized correctly. The Stateful Set will not create any subsequent Pods till the the debug annotation is set to `"true"` (or removed) on each Pod that has already been created.
 
```shell
kubectl annotate pods <pod-name> pod.alpha.kubernetes.io/initialized="true" --overwrite
```

{% endcapture %}

{% capture whatsnext %}
Learn more about debugging an init-container. *TODO: Link to Task: Debugging an init-container*
{% endcapture %}

{% include templates/task.md %}
