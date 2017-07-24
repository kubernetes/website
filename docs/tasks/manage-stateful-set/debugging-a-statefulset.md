---
assignees:
- bprashanth
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton
title: Debugging a StatefulSet
---

{% capture overview %}

This task shows you how to debug a StatefulSet.

{% endcapture %}

{% capture prerequisites %}


* You need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. 
* You should have a StatefulSet running that you want to investigate.

{% endcapture %}

{% capture steps %}

## Debugging a StatefulSet

In order to list all the pods which belong to a StatefulSet, which have a label `app=myapp` set on them, you can use the following: 

```shell
kubectl get pods -l app=myapp
```

If you find that any Pods listed are in `Unknown` or `Terminating` state for an extended period of time, refer to the [Deleting StatefulSet Pods](/docs/tasks/manage-stateful-set/delete-pods/) task for instructions on how to deal with them. You can debug individual Pods in a StatefulSet using the [Debugging Pods](/docs/user-guide/debugging-pods-and-replication-controllers/#debugging-pods) guide. 

StatefulSets provide a debug mechanism to pause all controller operations on Pods using an annotation. Setting the `pod.alpha.kubernetes.io/initialized` annotation to `"false"` on any StatefulSet Pod will *pause* all operations of the StatefulSet. When paused, the StatefulSet will not perform any scaling operations. Once the debug hook is set, you can execute commands within the containers of StatefulSet pods without interference from scaling operations. You can set the annotation to `"false"` by executing the following:

```shell
kubectl annotate pods <pod-name> pod.alpha.kubernetes.io/initialized="false" --overwrite
```

When the annotation is set to `"false"`, the StatefulSet will not respond to its Pods becoming unhealthy or unavailable. It will not create replacement Pods till the annotation is removed or set to `"true"` on each StatefulSet Pod. 

### Step-wise Initialization

You can also use the same annotation to debug race conditions during bootstrapping of the StatefulSet by setting the `pod.alpha.kubernetes.io/initialized` annotation to `"false"` in the `.spec.template.metadata.annotations` field of the StatefulSet prior to creating it. 

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

After setting the annotation, if you create the StatefulSet, you can wait for each Pod to come up and verify that it has initialized correctly. The StatefulSet will not create any subsequent Pods till the debug annotation is set to `"true"` (or removed) on each Pod that has already been created. You can set the annotation to `"true"` by executing the following:
 
```shell
kubectl annotate pods <pod-name> pod.alpha.kubernetes.io/initialized="true" --overwrite
```

{% endcapture %}

{% capture whatsnext %}

Learn more about [debugging an init-container](/docs/tasks/troubleshoot/debug-init-containers/).

{% endcapture %}

{% include templates/task.md %}
