---
layout: blog
title: 'Kubernetes 1.24: Maximum Unavailable Replicas for StatefulSet'
date: 2022-05-27
slug: maxunavailable-for-statefulset
author: >
  Mayank Kumar (Salesforce)
---

Kubernetes [StatefulSets](/docs/concepts/workloads/controllers/statefulset/), since their introduction in 
1.5 and becoming stable in 1.9, have been widely used to run stateful applications. They provide stable pod identity, persistent
per pod storage and ordered graceful deployment, scaling and rolling updates. You can think of StatefulSet as the atomic building
block for running complex stateful applications. As the use of Kubernetes has grown, so has the number of scenarios requiring
StatefulSets. Many of these scenarios, require faster rolling updates than the currently supported one-pod-at-a-time updates, in the 
case where you're using the `OrderedReady` Pod management policy for a StatefulSet.

 
Here are some examples:

-  I am using a StatefulSet to orchestrate a multi-instance, cache based application where the size of the cache is large. The cache 
   starts cold and requires some significant amount of time before the container can start. There could be more initial startup tasks
   that are required. A RollingUpdate on this StatefulSet would take a lot of time before the application is fully updated. If the 
   StatefulSet supported updating more than one pod at a time, it would result in a much faster update.

-  My stateful application is composed of leaders and followers or one writer and multiple readers. I have multiple readers or 
   followers and my application can tolerate multiple pods going down at the same time. I want to update this application more than
   one pod at a time so that i get the new updates rolled out quickly, especially if the number of instances of my application are
   large. Note that my application still requires unique identity per pod.


In order to support such scenarios, Kubernetes 1.24 includes a new alpha feature to help. Before you can use the new feature you must
enable the `MaxUnavailableStatefulSet` feature flag. Once you enable that, you can specify a new field called `maxUnavailable`, part 
of the `spec` for a StatefulSet. For example: 

```
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
  namespace: default
spec:
  podManagementPolicy: OrderedReady  # you must set OrderedReady
  replicas: 5
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      # image changed since publication (previously used registry "k8s.gcr.io")
      - image: registry.k8s.io/nginx-slim:0.8
        imagePullPolicy: IfNotPresent
        name: nginx
  updateStrategy:
    rollingUpdate:
      maxUnavailable: 2 # this is the new alpha field, whose default value is 1
      partition: 0
    type: RollingUpdate
```

If you enable the new feature and you don't specify a value for `maxUnavailable` in a StatefulSet, Kubernetes applies a default
`maxUnavailable: 1`. This matches the behavior you would see if you don't enable the new feature.

I'll run through a scenario based on that example manifest to demonstrate how this feature works. I will deploy a StatefulSet that
has 5 replicas, with `maxUnavailable` set to 2 and `partition` set to 0.

I can trigger a rolling update by changing the image to `registry.k8s.io/nginx-slim:0.9`. Once I initiate the rolling update, I can 
watch the pods update 2 at a time as the current value of maxUnavailable is 2. The below output shows a span of time and is not 
complete.  The maxUnavailable can be an absolute number (for example, 2) or a percentage of desired Pods (for example, 10%). The 
absolute number is calculated from percentage by rounding up to the nearest integer.  
```
kubectl get pods --watch 
```

```
NAME    READY   STATUS    RESTARTS   AGE
web-0   1/1     Running   0          85s
web-1   1/1     Running   0          2m6s
web-2   1/1     Running   0          106s
web-3   1/1     Running   0          2m47s
web-4   1/1     Running   0          2m27s
web-4   1/1     Terminating   0          5m43s ----> start terminating 4
web-3   1/1     Terminating   0          6m3s  ----> start terminating 3
web-3   0/1     Terminating   0          6m7s
web-3   0/1     Pending       0          0s
web-3   0/1     Pending       0          0s
web-4   0/1     Terminating   0          5m48s
web-4   0/1     Terminating   0          5m48s
web-3   0/1     ContainerCreating   0          2s
web-3   1/1     Running             0          2s
web-4   0/1     Pending             0          0s
web-4   0/1     Pending             0          0s
web-4   0/1     ContainerCreating   0          0s
web-4   1/1     Running             0          1s
web-2   1/1     Terminating         0          5m46s ----> start terminating 2 (only after both 4 and 3 are running)
web-1   1/1     Terminating         0          6m6s  ----> start terminating 1
web-2   0/1     Terminating         0          5m47s
web-1   0/1     Terminating         0          6m7s
web-1   0/1     Pending             0          0s
web-1   0/1     Pending             0          0s
web-1   0/1     ContainerCreating   0          1s
web-1   1/1     Running             0          2s
web-2   0/1     Pending             0          0s
web-2   0/1     Pending             0          0s
web-2   0/1     ContainerCreating   0          0s
web-2   1/1     Running             0          1s
web-0   1/1     Terminating         0          6m6s ----> start terminating 0 (only after 2 and 1 are running)
web-0   0/1     Terminating         0          6m7s
web-0   0/1     Pending             0          0s
web-0   0/1     Pending             0          0s
web-0   0/1     ContainerCreating   0          0s
web-0   1/1     Running             0          1s
```
Note that as soon as the rolling update starts, both 4 and 3 (the two highest ordinal pods) start terminating at the same time. Pods 
with ordinal 4 and 3 may become ready at their own pace. As soon as both pods 4 and 3 are ready, pods 2 and 1 start terminating at the
same time. When pods 2 and 1 are both running and ready, pod 0 starts terminating. 

In Kubernetes, updates to StatefulSets follow a strict ordering when updating Pods. In this example, the update starts at replica 4, then
replica 3, then replica 2, and so on, one pod at a time. When going one pod at a time, its not possible for 3 to be running and ready 
before 4. When `maxUnavailable` is more than 1 (in the example scenario I set `maxUnavailable` to 2), it is possible that replica 3 becomes 
ready and running before replica 4 is ready&mdash;and that is ok. If you're a developer and you set `maxUnavailable` to more than 1, you should 
know that this outcome is possible and you must ensure that your application is able to handle such ordering issues that occur
if any. When you set `maxUnavailable` greater than 1, the ordering is guaranteed in between each batch of pods being updated. That guarantee
means that pods in update batch 2 (replicas 2 and 1) cannot start updating until the pods from batch 0 (replicas 4 and 3) are ready.

Although Kubernetes refers to these as _replicas_, your stateful application may have a different view and each pod of the StatefulSet may
be holding completely different data than other pods. The important thing here is that updates to StatefulSets happen in batches, and you can
now have a batch size larger than 1 (as an alpha feature).

Also note, that the above behavior is with `podManagementPolicy: OrderedReady`. If you defined a StatefulSet as `podManagementPolicy: Parallel`,
not only `maxUnavailable` number of replicas are terminated at the same time; `maxUnavailable` number of replicas start in `ContainerCreating`
phase at the same time as well. This is called bursting.

So, now you may have a lot of questions about:-
- What is the behavior when you set `podManagementPolicy: Parallel`?
- What is the behavior when `partition` to a value other than `0`?

It might be better to try and see it for yourself. This is an alpha feature, and the Kubernetes contributors are looking for feedback on this feature. Did
this help you achieve your stateful scenarios Did you find a bug or do you think the behavior as implemented is not intuitive or can
break applications or catch them by surprise? Please [open an issue](https://github.com/kubernetes/kubernetes/issues) to let us know.

## Further reading and next steps {#next-steps}
- [Maximum unavailable Pods](/docs/concepts/workloads/controllers/statefulset/#maximum-unavailable-pods)
- [KEP for MaxUnavailable for StatefulSet](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/961-maxunavailable-for-statefulset)
- [Implementation](https://github.com/kubernetes/kubernetes/pull/82162/files)
- [Enhancement Tracking Issue](https://github.com/kubernetes/enhancements/issues/961)
