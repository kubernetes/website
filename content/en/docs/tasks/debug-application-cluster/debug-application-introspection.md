---
reviewers:
- janetkuo
- thockin
content_template: templates/concept
title: Application Introspection and Debugging
---

{{% capture overview %}}

Once your application is running, you'll inevitably need to debug problems with it.
Earlier we described how you can use `kubectl get pods` to retrieve simple status information about
your pods. But there are a number of ways to get even more information about your application.

{{% /capture %}}


{{% capture body %}}

## Using `kubectl describe pod` to fetch details about pods

For this example we'll use a Deployment to create two pods, similar to the earlier example.

{{< codenew file="application/nginx-with-request.yaml" >}}

Create deployment by running following command:

```shell
kubectl apply -f https://k8s.io/examples/application/nginx-with-request.yaml
```

```none
deployment.apps/nginx-deployment created
```

Check pod status by following command:

```shell
kubectl get pods
```

```none
NAME                                READY     STATUS    RESTARTS   AGE
nginx-deployment-1006230814-6winp   1/1       Running   0          11s
nginx-deployment-1006230814-fmgu3   1/1       Running   0          11s
```

We can retrieve a lot more information about each of these pods using `kubectl describe pod`. For example:

```shell
kubectl describe pod nginx-deployment-1006230814-6winp
```

```none
Name:		nginx-deployment-1006230814-6winp
Namespace:	default
Node:		kubernetes-node-wul5/10.240.0.9
Start Time:	Thu, 24 Mar 2016 01:39:49 +0000
Labels:		app=nginx,pod-template-hash=1006230814
Annotations:    kubernetes.io/created-by={"kind":"SerializedReference","apiVersion":"v1","reference":{"kind":"ReplicaSet","namespace":"default","name":"nginx-deployment-1956810328","uid":"14e607e7-8ba1-11e7-b5cb-fa16" ...
Status:		Running
IP:		10.244.0.6
Controllers:	ReplicaSet/nginx-deployment-1006230814
Containers:
  nginx:
    Container ID:	docker://90315cc9f513c724e9957a4788d3e625a078de84750f244a40f97ae355eb1149
    Image:		nginx
    Image ID:		docker://6f62f48c4e55d700cf3eb1b5e33fa051802986b77b874cc351cce539e5163707
    Port:		80/TCP
    QoS Tier:
      cpu:	Guaranteed
      memory:	Guaranteed
    Limits:
      cpu:	500m
      memory:	128Mi
    Requests:
      memory:		128Mi
      cpu:		500m
    State:		Running
      Started:		Thu, 24 Mar 2016 01:39:51 +0000
    Ready:		True
    Restart Count:	0
    Environment:        <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-5kdvl (ro)
Conditions:
  Type          Status
  Initialized   True
  Ready         True
  PodScheduled  True
Volumes:
  default-token-4bcbi:
    Type:	Secret (a volume populated by a Secret)
    SecretName:	default-token-4bcbi
    Optional:   false
QoS Class:      Guaranteed
Node-Selectors: <none>
Tolerations:    <none>
Events:
  FirstSeen	LastSeen	Count	From					SubobjectPath		Type		Reason		Message
  ---------	--------	-----	----					-------------		--------	------		-------
  54s		54s		1	{default-scheduler }						Normal		Scheduled	Successfully assigned nginx-deployment-1006230814-6winp to kubernetes-node-wul5
  54s		54s		1	{kubelet kubernetes-node-wul5}	spec.containers{nginx}	Normal		Pulling		pulling image "nginx"
  53s		53s		1	{kubelet kubernetes-node-wul5}	spec.containers{nginx}	Normal		Pulled		Successfully pulled image "nginx"
  53s		53s		1	{kubelet kubernetes-node-wul5}	spec.containers{nginx}	Normal		Created		Created container with docker id 90315cc9f513
  53s		53s		1	{kubelet kubernetes-node-wul5}	spec.containers{nginx}	Normal		Started		Started container with docker id 90315cc9f513
```

Here you can see configuration information about the container(s) and Pod (labels, resource requirements, etc.), as well as status information about the container(s) and Pod (state, readiness, restart count, events, etc.).

The container state is one of Waiting, Running, or Terminated. Depending on the state, additional information will be provided -- here you can see that for a container in Running state, the system tells you when the container started.

Ready tells you whether the container passed its last readiness probe. (In this case, the container does not have a readiness probe configured; the container is assumed to be ready if no readiness probe is configured.)

Restart Count tells you how many times the container has been restarted; this information can be useful for detecting crash loops in containers that are configured with a restart policy of 'always.'

Currently the only Condition associated with a Pod is the binary Ready condition, which indicates that the pod is able to service requests and should be added to the load balancing pools of all matching services.

Lastly, you see a log of recent events related to your Pod. The system compresses multiple identical events by indicating the first and last time it was seen and the number of times it was seen. "From" indicates the component that is logging the event, "SubobjectPath" tells you which object (e.g. container within the pod) is being referred to, and "Reason" and "Message" tell you what happened.

## Example: debugging Pending Pods

A common scenario that you can detect using events is when you've created a Pod that won't fit on any node. For example, the Pod might request more resources than are free on any node, or it might specify a label selector that doesn't match any nodes. Let's say we created the previous Deployment with 5 replicas (instead of 2) and requesting 600 millicores instead of 500, on a four-node cluster where each (virtual) machine has 1 CPU. In that case one of the Pods will not be able to schedule. (Note that because of the cluster addon pods such as fluentd, skydns, etc., that run on each node, if we requested 1000 millicores then none of the Pods would be able to schedule.)

```shell
kubectl get pods
```

```none
NAME                                READY     STATUS    RESTARTS   AGE
nginx-deployment-1006230814-6winp   1/1       Running   0          7m
nginx-deployment-1006230814-fmgu3   1/1       Running   0          7m
nginx-deployment-1370807587-6ekbw   1/1       Running   0          1m
nginx-deployment-1370807587-fg172   0/1       Pending   0          1m
nginx-deployment-1370807587-fz9sd   0/1       Pending   0          1m
```

To find out why the nginx-deployment-1370807587-fz9sd pod is not running, we can use `kubectl describe pod` on the pending Pod and look at its events:

```shell
kubectl describe pod nginx-deployment-1370807587-fz9sd
```

```none
  Name:		nginx-deployment-1370807587-fz9sd
  Namespace:	default
  Node:		/
  Labels:		app=nginx,pod-template-hash=1370807587
  Status:		Pending
  IP:
  Controllers:	ReplicaSet/nginx-deployment-1370807587
  Containers:
    nginx:
      Image:	nginx
      Port:	80/TCP
      QoS Tier:
        memory:	Guaranteed
        cpu:	Guaranteed
      Limits:
        cpu:	1
        memory:	128Mi
      Requests:
        cpu:	1
        memory:	128Mi
      Environment Variables:
  Volumes:
    default-token-4bcbi:
      Type:	Secret (a volume populated by a Secret)
      SecretName:	default-token-4bcbi
  Events:
    FirstSeen	LastSeen	Count	From			        SubobjectPath	Type		Reason			    Message
    ---------	--------	-----	----			        -------------	--------	------			    -------
    1m		    48s		    7	    {default-scheduler }			        Warning		FailedScheduling	pod (nginx-deployment-1370807587-fz9sd) failed to fit in any node
  fit failure on node (kubernetes-node-6ta5): Node didn't have enough resource: CPU, requested: 1000, used: 1420, capacity: 2000
  fit failure on node (kubernetes-node-wul5): Node didn't have enough resource: CPU, requested: 1000, used: 1100, capacity: 2000
```

Here you can see the event generated by the scheduler saying that the Pod failed to schedule for reason `FailedScheduling` (and possibly others).  The message tells us that there were not enough resources for the Pod on any of the nodes.

To correct this situation, you can use `kubectl scale` to update your Deployment to specify four or fewer replicas. (Or you could just leave the one Pod pending, which is harmless.)

Events such as the ones you saw at the end of `kubectl describe pod` are persisted in etcd and provide high-level information on what is happening in the cluster. To list all events you can use

```shell
kubectl get events
```

but you have to remember that events are namespaced. This means that if you're interested in events for some namespaced object (e.g. what happened with Pods in namespace `my-namespace`) you need to explicitly provide a namespace to the command:

```shell
kubectl get events --namespace=my-namespace
```

To see events from all namespaces, you can use the `--all-namespaces` argument.

In addition to `kubectl describe pod`, another way to get extra information about a pod (beyond what is provided by `kubectl get pod`) is to pass the `-o yaml` output format flag to `kubectl get pod`. This will give you, in YAML format, even more information than `kubectl describe pod`--essentially all of the information the system has about the Pod. Here you will see things like annotations (which are key-value metadata without the label restrictions, that is used internally by Kubernetes system components), restart policy, ports, and volumes.

```shell
kubectl get pod nginx-deployment-1006230814-6winp -o yaml
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  annotations:
    kubernetes.io/created-by: |
      {"kind":"SerializedReference","apiVersion":"v1","reference":{"kind":"ReplicaSet","namespace":"default","name":"nginx-deployment-1006230814","uid":"4c84c175-f161-11e5-9a78-42010af00005","apiVersion":"extensions","resourceVersion":"133434"}}
  creationTimestamp: 2016-03-24T01:39:50Z
  generateName: nginx-deployment-1006230814-
  labels:
    app: nginx
    pod-template-hash: "1006230814"
  name: nginx-deployment-1006230814-6winp
  namespace: default
  resourceVersion: "133447"
  uid: 4c879808-f161-11e5-9a78-42010af00005
spec:
  containers:
  - image: nginx
    imagePullPolicy: Always
    name: nginx
    ports:
    - containerPort: 80
      protocol: TCP
    resources:
      limits:
        cpu: 500m
        memory: 128Mi
      requests:
        cpu: 500m
        memory: 128Mi
    terminationMessagePath: /dev/termination-log
    volumeMounts:
    - mountPath: /var/run/secrets/kubernetes.io/serviceaccount
      name: default-token-4bcbi
      readOnly: true
  dnsPolicy: ClusterFirst
  nodeName: kubernetes-node-wul5
  restartPolicy: Always
  securityContext: {}
  serviceAccount: default
  serviceAccountName: default
  terminationGracePeriodSeconds: 30
  volumes:
  - name: default-token-4bcbi
    secret:
      secretName: default-token-4bcbi
status:
  conditions:
  - lastProbeTime: null
    lastTransitionTime: 2016-03-24T01:39:51Z
    status: "True"
    type: Ready
  containerStatuses:
  - containerID: docker://90315cc9f513c724e9957a4788d3e625a078de84750f244a40f97ae355eb1149
    image: nginx
    imageID: docker://6f62f48c4e55d700cf3eb1b5e33fa051802986b77b874cc351cce539e5163707
    lastState: {}
    name: nginx
    ready: true
    restartCount: 0
    state:
      running:
        startedAt: 2016-03-24T01:39:51Z
  hostIP: 10.240.0.9
  phase: Running
  podIP: 10.244.0.6
  startTime: 2016-03-24T01:39:49Z
```

## Example: debugging a down/unreachable node

Sometimes when debugging it can be useful to look at the status of a node -- for example, because you've noticed strange behavior of a Pod that's running on the node, or to find out why a Pod won't schedule onto the node. As with Pods, you can use `kubectl describe node` and `kubectl get node -o yaml` to retrieve detailed information about nodes. For example, here's what you'll see if a node is down (disconnected from the network, or kubelet dies and won't restart, etc.). Notice the events that show the node is NotReady, and also notice that the pods are no longer running (they are evicted after five minutes of NotReady status).

```shell
kubectl get nodes
```

```none
NAME                     STATUS       ROLES     AGE     VERSION
kubernetes-node-861h     NotReady     <none>    1h      v1.13.0
kubernetes-node-bols     Ready        <none>    1h      v1.13.0
kubernetes-node-st6x     Ready        <none>    1h      v1.13.0
kubernetes-node-unaj     Ready        <none>    1h      v1.13.0
```

```shell
kubectl describe node kubernetes-node-861h
```

```none
Name:			kubernetes-node-861h
Role
Labels:		 kubernetes.io/arch=amd64
           kubernetes.io/os=linux
           kubernetes.io/hostname=kubernetes-node-861h
Annotations:        node.alpha.kubernetes.io/ttl=0
                    volumes.kubernetes.io/controller-managed-attach-detach=true
Taints:             <none>
CreationTimestamp:	Mon, 04 Sep 2017 17:13:23 +0800
Phase:
Conditions:
  Type		Status		LastHeartbeatTime			LastTransitionTime			Reason					Message
  ----    ------    -----------------     ------------------      ------          -------
  OutOfDisk             Unknown         Fri, 08 Sep 2017 16:04:28 +0800         Fri, 08 Sep 2017 16:20:58 +0800         NodeStatusUnknown       Kubelet stopped posting node status.
  MemoryPressure        Unknown         Fri, 08 Sep 2017 16:04:28 +0800         Fri, 08 Sep 2017 16:20:58 +0800         NodeStatusUnknown       Kubelet stopped posting node status.
  DiskPressure          Unknown         Fri, 08 Sep 2017 16:04:28 +0800         Fri, 08 Sep 2017 16:20:58 +0800         NodeStatusUnknown       Kubelet stopped posting node status.
  Ready                 Unknown         Fri, 08 Sep 2017 16:04:28 +0800         Fri, 08 Sep 2017 16:20:58 +0800         NodeStatusUnknown       Kubelet stopped posting node status.
Addresses:	10.240.115.55,104.197.0.26
Capacity:
 cpu:           2
 hugePages:     0
 memory:        4046788Ki
 pods:          110
Allocatable:
 cpu:           1500m
 hugePages:     0
 memory:        1479263Ki
 pods:          110
System Info:
 Machine ID:                    8e025a21a4254e11b028584d9d8b12c4
 System UUID:                   349075D1-D169-4F25-9F2A-E886850C47E3
 Boot ID:                       5cd18b37-c5bd-4658-94e0-e436d3f110e0
 Kernel Version:                4.4.0-31-generic
 OS Image:                      Debian GNU/Linux 8 (jessie)
 Operating System:              linux
 Architecture:                  amd64
 Container Runtime Version:     docker://1.12.5
 Kubelet Version:               v1.6.9+a3d1dfa6f4335
 Kube-Proxy Version:            v1.6.9+a3d1dfa6f4335
ExternalID:                     15233045891481496305
Non-terminated Pods:            (9 in total)
  Namespace                     Name                                            CPU Requests    CPU Limits      Memory Requests Memory Limits
  ---------                     ----                                            ------------    ----------      --------------- -------------
......
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  CPU Requests  CPU Limits      Memory Requests         Memory Limits
  ------------  ----------      ---------------         -------------
  900m (60%)    2200m (146%)    1009286400 (66%)        5681286400 (375%)
Events:         <none>
```

```shell
kubectl get node kubernetes-node-861h -o yaml
```

```yaml
apiVersion: v1
kind: Node
metadata:
  creationTimestamp: 2015-07-10T21:32:29Z
  labels:
    kubernetes.io/hostname: kubernetes-node-861h
  name: kubernetes-node-861h
  resourceVersion: "757"
  uid: 2a69374e-274b-11e5-a234-42010af0d969
spec:
  externalID: "15233045891481496305"
  podCIDR: 10.244.0.0/24
  providerID: gce://striped-torus-760/us-central1-b/kubernetes-node-861h
status:
  addresses:
  - address: 10.240.115.55
    type: InternalIP
  - address: 104.197.0.26
    type: ExternalIP
  capacity:
    cpu: "1"
    memory: 3800808Ki
    pods: "100"
  conditions:
  - lastHeartbeatTime: 2015-07-10T21:34:32Z
    lastTransitionTime: 2015-07-10T21:35:15Z
    reason: Kubelet stopped posting node status.
    status: Unknown
    type: Ready
  nodeInfo:
    bootID: 4e316776-b40d-4f78-a4ea-ab0d73390897
    containerRuntimeVersion: docker://Unknown
    kernelVersion: 3.16.0-0.bpo.4-amd64
    kubeProxyVersion: v0.21.1-185-gffc5a86098dc01
    kubeletVersion: v0.21.1-185-gffc5a86098dc01
    machineID: ""
    osImage: Debian GNU/Linux 7 (wheezy)
    systemUUID: ABE5F6B4-D44B-108B-C46A-24CCE16C8B6E
```

{{% /capture %}}

{{% capture whatsnext %}}

Learn about additional debugging tools, including:

* [Logging](/docs/concepts/cluster-administration/logging/)
* [Monitoring](/docs/tasks/debug-application-cluster/resource-usage-monitoring/)
* [Getting into containers via `exec`](/docs/tasks/debug-application-cluster/get-shell-running-container/)
* [Connecting to containers via proxies](/docs/tasks/access-kubernetes-api/http-proxy-access-api/)
* [Connecting to containers via port forwarding](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
* [Inspect Kubernetes node with crictl](/docs/tasks/debug-application-cluster/crictl/)

{{% /capture %}}
