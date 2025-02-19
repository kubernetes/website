---
title: " Advanced Scheduling in Kubernetes "
date: 2017-03-31
slug: advanced-scheduling-in-kubernetes
url: /blog/2017/03/Advanced-Scheduling-In-Kubernetes
author: >
  Ian Lewis (Google),
  David Oppenheimer (Google)
---
_Editor’s note: this post is part of a [series of in-depth articles](https://kubernetes.io/blog/2017/03/five-days-of-kubernetes-1-6) on what's new in Kubernetes 1.6_

The Kubernetes scheduler’s default behavior works well for most cases -- for example, it ensures that pods are only placed on nodes that have sufficient free resources, it ties to spread pods from the same set ([ReplicaSet](/docs/user-guide/replicasets/), [StatefulSet](/docs/concepts/workloads/controllers/statefulset/), etc.) across nodes, it tries to balance out the resource utilization of nodes, etc.  

But sometimes you want to control how your pods are scheduled. For example, perhaps you want to ensure that certain pods only schedule on nodes with specialized hardware, or you want to co-locate services that communicate frequently, or you want to dedicate a set of nodes to a particular set of users. Ultimately, you know much more about how your applications should be scheduled and deployed than Kubernetes ever will. So **[Kubernetes 1.6](https://kubernetes.io/blog/2017/03/kubernetes-1-6-multi-user-multi-workloads-at-scale) offers four advanced scheduling features: node affinity/anti-affinity, taints and tolerations, pod affinity/anti-affinity, and custom schedulers**. Each of these features are now in _beta_ in Kubernetes 1.6.

**Node Affinity/Anti-Affinity**  

[Node Affinity/Anti-Affinity](/docs/user-guide/node-selection/#node-affinity-beta-feature) is one way to set rules on which nodes are selected by the scheduler. This feature is a generalization of the [nodeSelector](/docs/user-guide/node-selection/#nodeselector) feature which has been in Kubernetes since version 1.0. The rules are defined using the familiar concepts of custom labels on nodes and selectors specified in pods, and they can be either required or preferred, depending on how strictly you want the scheduler to enforce them.   

Required rules must be met for a pod to schedule on a particular node. If no node matches the criteria (plus all of the other normal criteria, such as having enough free resources for the pod’s resource request), then the pod won’t be scheduled. Required rules are specified in the requiredDuringSchedulingIgnoredDuringExecution field of nodeAffinity.   

For example, if we want to require scheduling on a node that is in the us-central1-a GCE zone of a multi-zone Kubernetes cluster, we can specify the following affinity rule as part of the Pod spec:  


```
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
          - matchExpressions:
            - key: "failure-domain.beta.kubernetes.io/zone"
              operator: In
              values: ["us-central1-a"]
 ```


“IgnoredDuringExecution” means that the pod will still run if labels on a node change and affinity rules are no longer met. There are future plans to offer requiredDuringSchedulingRequiredDuringExecution which will evict pods from nodes as soon as they don’t satisfy the node affinity rule(s).  

Preferred rules mean that if nodes match the rules, they will be chosen first, and only if no preferred nodes are available will non-preferred nodes be chosen. You can prefer instead of require that pods are deployed to us-central1-a by slightly changing the pod spec to use preferredDuringSchedulingIgnoredDuringExecution:  


```
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
          - matchExpressions:
            - key: "failure-domain.beta.kubernetes.io/zone"
              operator: In
              values: ["us-central1-a"]
 ```


Node anti-affinity can be achieved by using negative operators. So for instance if we want our pods to avoid us-central1-a we can do this:  



```
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
          - matchExpressions:
            - key: "failure-domain.beta.kubernetes.io/zone"
              operator: NotIn
              values: ["us-central1-a"]
 ```


Valid operators you can use are In, NotIn, Exists, DoesNotExist. Gt, and Lt.  

Additional use cases for this feature are to restrict scheduling based on nodes’ hardware architecture, operating system version, or specialized hardware. Node affinity/anti-affinity is _beta_ in Kubernetes 1.6.   

**Taints and Tolerations**  

A related feature is “[taints and tolerations](/docs/user-guide/node-selection/#taints-and-toleations-beta-feature),” which allows you to mark (“taint”) a node so that no pods can schedule onto it unless a pod explicitly “tolerates” the taint. Marking nodes instead of pods (as in node affinity/anti-affinity) is particularly useful for situations where most pods in the cluster should avoid scheduling onto the node. For example, you might want to mark your master node as schedulable only by Kubernetes system components, or dedicate a set of nodes to a particular group of users, or keep regular pods away from nodes that have special hardware so as to leave room for pods that need the special hardware.  

The kubectl command allows you to set taints on nodes, for example:  



```
kubectl taint nodes node1 key=value:NoSchedule
```


creates a taint that marks the node as unschedulable by any pods that do not have a toleration for taint with key key, value value, and effect NoSchedule. (The other taint effects are PreferNoSchedule, which is the preferred version of NoSchedule, and NoExecute, which means any pods that are running on the node when the taint is applied will be evicted unless they tolerate the taint.) The toleration you would add to a PodSpec to have the corresponding pod tolerate this taint would look like this  



```
  tolerations:
  - key: "key"
    operator: "Equal"
    value: "value"
    effect: "NoSchedule"
 ```



In addition to moving taints and tolerations to _beta_ in Kubernetes 1.6, we have introduced an _alpha_ feature that uses taints and tolerations to allow you to customize how long a pod stays bound to a node when the node experiences a problem like a network partition instead of using the default five minutes. See [this section](/docs/user-guide/node-selection/#per-pod-configurable-eviction-behavior-when-there-are-node-problems-alpha-feature) of the documentation for more details.



**Pod Affinity/Anti-Affinity**



Node affinity/anti-affinity allows you to constrain which nodes a pod can run on based on the nodes’ labels. But what if you want to specify rules about how pods should be placed relative to one another, for example to spread or pack pods within a service or relative to pods in other services? For that you can use [pod affinity/anti-affinity](/docs/user-guide/node-selection/#inter-pod-affinity-and-anti-affinity-beta-feature), which is also _beta_ in Kubernetes 1.6.



Let’s look at an example. Say you have front-ends in service S1, and they communicate frequently with back-ends that are in service S2 (a “north-south” communication pattern). So you want these two services to be co-located in the same cloud provider zone, but you don’t want to have to choose the zone manually--if the zone fails, you want the pods to be rescheduled to another (single) zone. You can specify this with a pod affinity rule that looks like this (assuming you give the pods of this service a label “service=S2” and the pods of the other service a label “service=S1”):



```
affinity:
    podAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchExpressions:
          - key: service
            operator: In
            values: [“S1”]
        topologyKey: failure-domain.beta.kubernetes.io/zone
 ```


As with node affinity/anti-affinity, there is also a preferredDuringSchedulingIgnoredDuringExecution variant.  

Pod affinity/anti-affinity is very flexible. Imagine you have profiled the performance of your services and found that containers from service S1 interfere with containers from service S2 when they share the same node, perhaps due to cache interference effects or saturating the network link. Or maybe due to security concerns you never want containers of S1 and S2 to share a node. To implement these rules, just make two changes to the snippet above -- change podAffinity to podAntiAffinity and change topologyKey to kubernetes.io/hostname.  

**Custom Schedulers**  

If the Kubernetes scheduler’s various features don’t give you enough control over the scheduling of your workloads, you can delegate responsibility for scheduling arbitrary subsets of pods to your own custom scheduler(s) that run(s) alongside, or instead of, the default Kubernetes scheduler. [Multiple schedulers](/docs/admin/multiple-schedulers/) is _beta_ in Kubernetes 1.6.  

Each new pod is normally scheduled by the default scheduler. But if you provide the name of your own custom scheduler, the default scheduler will ignore that Pod and allow your scheduler to schedule the Pod to a node. Let’s look at an example.  

Here we have a Pod where we specify the schedulerName field:  


```
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  schedulerName: my-scheduler
  containers:
  - name: nginx
    image: nginx:1.10
 ```



If we create this Pod without deploying a custom scheduler, the default scheduler will ignore it and it will remain in a Pending state. So we need a custom scheduler that looks for, and schedules, pods whose schedulerName field is my-scheduler.



A custom scheduler can be written in any language and can be as simple or complex as you need. Here is a very simple example of a custom scheduler written in Bash that assigns a node randomly. Note that you need to run this along with kubectl proxy for it to work.



```
#!/bin/bash

SERVER='localhost:8001'

while true;

do

    for PODNAME in $(kubectl --server $SERVER get pods -o json | jq '.items[] | select(.spec.schedulerName == "my-scheduler") | select(.spec.nodeName == null) | .metadata.name' | tr -d '"')

;

    do

        NODES=($(kubectl --server $SERVER get nodes -o json | jq '.items[].metadata.name' | tr -d '"'))


        NUMNODES=${#NODES[@]}

        CHOSEN=${NODES[$[$RANDOM % $NUMNODES]]}

        curl --header "Content-Type:application/json" --request POST --data '{"apiVersion":"v1", "kind": "Binding", "metadata": {"name": "'$PODNAME'"}, "target": {"apiVersion": "v1", "kind"

: "Node", "name": "'$CHOSEN'"}}' http://$SERVER/api/v1/namespaces/default/pods/$PODNAME/binding/

        echo "Assigned $PODNAME to $CHOSEN"

    done

    sleep 1

done
```  



**Learn more**



The Kubernetes 1.6 [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG.md#v160) have more information about these features, including details about how to change your configurations if you are already using the alpha version of one or more of these features (this is required, as the move from alpha to beta is a breaking change for these features).



**Acknowledgements**



The features described here, both in their alpha and beta forms, were a true community effort, involving engineers from Google, Huawei, IBM, Red Hat and more.



**Get Involved**



Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/blob/master/communication.md#weekly-meeting):

- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
- Connect with the community on [Slack](http://slack.k8s.io/) (room #sig-scheduling)


Many thanks for your contributions.

