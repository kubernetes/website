---
reviewers:
- janetkuo
- thockin
title: 应用程序自检和调试
---
<!--
---
reviewers:
- janetkuo
- thockin
title: Application Introspection and Debugging
---
-->

<!--
Once your application is running, you'll inevitably need to debug problems with it.
Earlier we described how you can use `kubectl get pods` to retrieve simple status information about
your pods. But there are a number of ways to get even more information about your application.
-->
一旦你的应用程序运行起来了，你将不可避免地需要对它进行调试。
之前我们介绍过如何使用 `kubectl get pod` 来检索有关您的 pod 的简单状态信息。但还有很多方法可以获得有关应用程序的更多信息。

* TOC
{:toc}

<!--
## Using `kubectl describe pod` to fetch details about pods

For this example we'll use a Deployment to create two pods, similar to the earlier example.
-->
## 使用 `kubectl describe pod` 来获取有关 pod 的详细信息

在这个例子中，我们将使用 Deployment 来创建两个 pod，与前面的示例类似。

{% include code.html language="yaml" file="nginx-dep.yaml" ghlink="/docs/tasks/debug-application-cluster/nginx-dep.yaml" %}

<!--
Create deployment by running following command:
-->
使用如下命令来创建 deployment：

```shell
$ kubectl create -f https://k8s.io/docs/tasks/debug-application-cluster/nginx-dep.yaml
deployment "nginx-deployment" created
```

```shell
$ kubectl get pods
NAME                                READY     STATUS    RESTARTS   AGE
nginx-deployment-1006230814-6winp   1/1       Running   0          11s
nginx-deployment-1006230814-fmgu3   1/1       Running   0          11s
```

<!--
We can retrieve a lot more information about each of these pods using `kubectl describe pod`. For example:
-->
我们可以使用 `kubectl describe pod` 获取每个 pod 的更多信息。例如：

```shell
$ kubectl describe pod nginx-deployment-1006230814-6winp
Name:		nginx-deployment-1006230814-6winp
Namespace:	default
Node:		kubernetes-node-wul5/10.240.0.9
Start Time:	Thu, 24 Mar 2016 01:39:49 +0000
Labels:		app=nginx,pod-template-hash=1006230814
Annotations:    kubernetes.io/created-by={"kind":"SerializedReference","apiVersion":"v1","reference":{"kind"                           :"ReplicaSet","namespace":"default","name":"nginx-deployment-1956810328","uid":"14e607e7-8ba1-11e7-b5cb-fa16"                             ...
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

<!--
Here you can see configuration information about the container(s) and Pod (labels, resource requirements, etc.), as well as status information about the container(s) and Pod (state, readiness, restart count, events, etc.).

The container state is one of Waiting, Running, or Terminated. Depending on the state, additional information will be provided -- here you can see that for a container in Running state, the system tells you when the container started.
-->
在这里您可以看到有关容器和 Pod 的配置信息（标签，资源需求等），以及有关容器和 Pod 的状态信息（状态，准备情况，重新启动次数，事件等）。

容器状态是 Waiting，Running 或 Terminated 之一。根据状态，可以获得更多信息 -- 在这里您可以看到，对于处于运行状态的容器，系统会告诉您何时启动的容器。

<!--
Ready tells you whether the container passed its last readiness probe. (In this case, the container does not have a readiness probe configured; the container is assumed to be ready if no readiness probe is configured.)

Restart Count tells you how many times the container has been restarted; this information can be useful for detecting crash loops in containers that are configured with a restart policy of 'always.'
-->
Ready 告诉您容器是否通过了最后一次准备就绪探测。（在这种情况下，容器没有配置就绪探针；如果未配置准备就绪探针，则假定容器已准备就绪。）

重启数量会告诉您容器重新启动的次数; 此信息可用于检测重启策略为 'always' 的容器的循环崩溃。

<!--
Currently the only Condition associated with a Pod is the binary Ready condition, which indicates that the pod is able to service requests and should be added to the load balancing pools of all matching services.

Lastly, you see a log of recent events related to your Pod. The system compresses multiple identical events by indicating the first and last time it was seen and the number of times it was seen. "From" indicates the component that is logging the event, "SubobjectPath" tells you which object (e.g. container within the pod) is being referred to, and "Reason" and "Message" tell you what happened.
-->
目前，与 Pod 相关的唯一条件是二进制 Ready 状态，这表明该 Pod 可以处理请求，并且应该添加到所有匹配服务的负载均衡池中。

最后，您会看到与您的 Pod 有关的最近事件日志。系统压缩多个相同的事件，只显示第一次和最后一次出现的时间以及出现的次数。"From" 表示记录事件的组件，"SubobjectPath" 告诉您哪个对象（例如容器内的容器）被引用，"Reason" 和 "Message" 告诉您发生了什么。

<!--
## Example: debugging Pending Pods

A common scenario that you can detect using events is when you've created a Pod that won't fit on any node. For example, the Pod might request more resources than are free on any node, or it might specify a label selector that doesn't match any nodes. Let's say we created the previous Deployment with 5 replicas (instead of 2) and requesting 600 millicores instead of 500, on a four-node cluster where each (virtual) machine has 1 CPU. In that case one of the Pods will not be able to schedule. (Note that because of the cluster addon pods such as fluentd, skydns, etc., that run on each node, if we requested 1000 millicores then none of the Pods would be able to schedule.)
-->
## 示例：调试 Pending 状态的 Pod

通过事件排查的一种常见情况是创建了不适合任何节点的 Pod。例如，Pod 可能会请求比任何节点上的空闲资源更多的资源，或者可能会指定一个不匹配任何节点的标签选择器。 假设我们在上面的 Deployment 例子中创建 5 个 replicas（而不是 2 个），并请求 600 millicores 而不是 500 millicores，集群拥有 4 个节点，每个（虚拟）机器有 1 个 CPU。 在这种情况下，其中一个 Pod 将无法调度。（请注意，由于在每个节点上运行了集群附加 pod，例如 fluentd 和 skydns 等，如果我们请求 1000 millicores，则没有任何一个 pod 可以成功调度。）

```shell
$ kubectl get pods
NAME                                READY     STATUS    RESTARTS   AGE
nginx-deployment-1006230814-6winp   1/1       Running   0          7m
nginx-deployment-1006230814-fmgu3   1/1       Running   0          7m
nginx-deployment-1370807587-6ekbw   1/1       Running   0          1m
nginx-deployment-1370807587-fg172   0/1       Pending   0          1m
nginx-deployment-1370807587-fz9sd   0/1       Pending   0          1m
```

<!--
To find out why the nginx-deployment-1370807587-fz9sd pod is not running, we can use `kubectl describe pod` on the pending Pod and look at its events:
-->
要找出 nginx-deployment-1370807587-fz9sd pod 未运行的原因，我们可以在待处理的 Pod 上使用 `kubectl describe pod` 并查看其事件：

```shell
$ kubectl describe pod nginx-deployment-1370807587-fz9sd
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

<!--
Here you can see the event generated by the scheduler saying that the Pod failed to schedule for reason `FailedScheduling` (and possibly others).  The message tells us that there were not enough resources for the Pod on any of the nodes.

To correct this situation, you can use `kubectl scale` to update your Deployment to specify four or fewer replicas. (Or you could just leave the one Pod pending, which is harmless.)

Events such as the ones you saw at the end of `kubectl describe pod` are persisted in etcd and provide high-level information on what is happening in the cluster. To list all events you can use
-->
在这里，您可以看到 scheduler 生成的事件，表明由于 `FailedScheduling`（可能还有其他原因），Pod 无法调度。该消息告诉我们没有任何节点能够满足 Pod 的需求。

要解决这种情况，可以使用 `kubectl scale` 来更新您的部署以指定 4 个或更少的 replicas。（或者您可以让一个Pod 保持 pending，这是无害的。）

在 etcd 中存储了类似于 `kubectl describe pod` 结尾处看到的事件，并提供有关集群中正在发生的事情的高级信息。您可以使用如下命令列出所有事件：

```shell
kubectl get events
```

<!--
but you have to remember that events are namespaced. This means that if you're interested in events for some namespaced object (e.g. what happened with Pods in namespace `my-namespace`) you need to explicitly provide a namespace to the command:
-->
但是您需要记住事件是具有命名空间的。这意味着如果您对某些命名空间对象的事件感兴趣（例如，命名空间 my-namespace 中的 Pod 发生了什么），则需要明确地为命令提供一个命名空间：

```shell
kubectl get events --namespace=my-namespace
```

<!--
To see events from all namespaces, you can use the `--all-namespaces` argument.

In addition to `kubectl describe pod`, another way to get extra information about a pod (beyond what is provided by `kubectl get pod`) is to pass the `-o yaml` output format flag to `kubectl get pod`. This will give you, in YAML format, even more information than `kubectl describe pod`--essentially all of the information the system has about the Pod. Here you will see things like annotations (which are key-value metadata without the label restrictions, that is used internally by Kubernetes system components), restart policy, ports, and volumes.
-->
要查看来自所有命名空间的事件，可以使用 `--all-namespaces` 参数。

除 `kubectl describe pod` 之外，另一种获得关于 pod 额外信息的方法（超出了 `kubectl get pod` 提供的内容）是将 `-o yaml` 输出格式标志传递给 `kubectl get pod`。 这会给你 YAML 格式的信息，甚至比 `kubectl describe pod` 更多的信息 -- 基本上是系统拥有的 Pod 的所有信息。 在这里，您将看到类似注解（这是没有标签限制的键值元数据，给 Kubernetes 系统组件内部使用）、重新启动策略、端口和卷。

```yaml
$ kubectl get pod nginx-deployment-1006230814-6winp -o yaml
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
  selfLink: /api/v1/namespaces/default/pods/nginx-deployment-1006230814-6winp
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

<!--
## Example: debugging a down/unreachable node

Sometimes when debugging it can be useful to look at the status of a node -- for example, because you've noticed strange behavior of a Pod that's running on the node, or to find out why a Pod won't schedule onto the node. As with Pods, you can use `kubectl describe node` and `kubectl get node -o yaml` to retrieve detailed information about nodes. For example, here's what you'll see if a node is down (disconnected from the network, or kubelet dies and won't restart, etc.). Notice the events that show the node is NotReady, and also notice that the pods are no longer running (they are evicted after five minutes of NotReady status).
-->
## 示例：调试一个关闭（或者无法到达）的节点

有时，在调试时，查看节点的状态可能很有用 -- 例如，您已经注意到节点上运行的 Pod 的奇怪行为，或想查明 Pod 不调度到节点上的原因。与 Pod 一样，可以使用 `kubectl describe node` 和 `kubectl get node -o yaml` 来检索有关节点的详细信息。例如，如果某个节点关闭（从网络断开连接，或 kubelet 死亡并不会重新启动等），您将看到以下内容。 注意显示节点为 NotReady 的事件，并且还注意到 Pod 不再运行（它们在 NotReady 状态五分钟后被驱逐）。

```shell
$ kubectl get nodes
NAME                     STATUS        AGE     VERSION
kubernetes-node-861h     NotReady      1h      v1.6.0+fff5156
kubernetes-node-bols     Ready         1h      v1.6.0+fff5156
kubernetes-node-st6x     Ready         1h      v1.6.0+fff5156
kubernetes-node-unaj     Ready         1h      v1.6.0+fff5156

$ kubectl describe node kubernetes-node-861h
Name:			kubernetes-node-861h
Role
Labels:		 beta.kubernetes.io/arch=amd64
           beta.kubernetes.io/os=linux
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

$ kubectl get node kubernetes-node-861h -o yaml
apiVersion: v1
kind: Node
metadata:
  creationTimestamp: 2015-07-10T21:32:29Z
  labels:
    kubernetes.io/hostname: kubernetes-node-861h
  name: kubernetes-node-861h
  resourceVersion: "757"
  selfLink: /api/v1/nodes/kubernetes-node-861h
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

<!--
## What's next?

Learn about additional debugging tools, including:

* [Logging](/docs/concepts/cluster-administration/logging/)
* [Monitoring](/docs/tasks/debug-application-cluster/resource-usage-monitoring/)
* [Getting into containers via `exec`](/docs/tasks/debug-application-cluster/get-shell-running-container/)
* [Connecting to containers via proxies](/docs/tasks/access-kubernetes-api/http-proxy-access-api/)
* [Connecting to containers via port forwarding](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
-->
## 接下来还有什么？

了解更多调试工具，包括：

* [日志记录](/docs/concepts/cluster-administration/logging/)
* [管理](/docs/tasks/debug-application-cluster/resource-usage-monitoring/)
* [通过 `exec` 进入容器](/docs/tasks/debug-application-cluster/get-shell-running-container/)
* [通过代理连接到容器](/docs/tasks/access-kubernetes-api/http-proxy-access-api/)
* [通过端口转发连接到容器](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)


