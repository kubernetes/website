---
title: 调试运行中的 Pod
content_type: task
---
<!-- 
reviewers:
- verb
- soltysh
title: Debug Running Pods
content_type: task
-->

<!-- overview -->
<!--
This page explains how to debug Pods running (or crashing) on a Node.
-->
本页解释如何在节点上调试运行中（或崩溃）的 Pod。

## {{% heading "prerequisites" %}}

<!--
* Your {{< glossary_tooltip text="Pod" term_id="pod" >}} should already be
  scheduled and running. If your Pod is not yet running, start with [Debugging
  Pods](/docs/tasks/debug/debug-application/).
* For some of the advanced debugging steps you need to know on which Node the
  Pod is running and have shell access to run commands on that Node. You don't
  need that access to run the standard debug steps that use `kubectl`.
-->
* 你的 {{< glossary_tooltip text="Pod" term_id="pod" >}} 应该已经被调度并正在运行中，
  如果你的 Pod 还没有运行，请参阅[调试 Pod](/zh-cn/docs/tasks/debug/debug-application/)。

* 对于一些高级调试步骤，你应该知道 Pod 具体运行在哪个节点上，并具有在该节点上运行命令的 shell 访问权限。
  你不需要任何访问权限就可以使用 `kubectl` 去运行一些标准调试步骤。

<!--
## Using `kubectl describe pod` to fetch details about pods
-->
## 使用 `kubectl describe pod` 命令获取 Pod 详情

<!--
For this example we'll use a Deployment to create two pods, similar to the earlier example.
-->
与之前的例子类似，我们使用一个 Deployment 来创建两个 Pod。

{{% code_sample file="application/nginx-with-request.yaml" %}}

<!--
Create deployment by running following command:
-->
使用如下命令创建 Deployment：

```shell
kubectl apply -f https://k8s.io/examples/application/nginx-with-request.yaml
```

```
deployment.apps/nginx-deployment created
```

<!--
Check pod status by following command:
-->
使用如下命令查看 Pod 状态：

```shell
kubectl get pods
```

```
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-67d4bdd6f5-cx2nz   1/1     Running   0          13s
nginx-deployment-67d4bdd6f5-w6kd7   1/1     Running   0          13s
```

<!--
We can retrieve a lot more information about each of these pods using `kubectl describe pod`. For example:
-->
我们可以使用 `kubectl describe pod` 命令来查询每个 Pod 的更多信息，比如：

```shell
kubectl describe pod nginx-deployment-67d4bdd6f5-w6kd7
```

```none
Name:         nginx-deployment-67d4bdd6f5-w6kd7
Namespace:    default
Priority:     0
Node:         kube-worker-1/192.168.0.113
Start Time:   Thu, 17 Feb 2022 16:51:01 -0500
Labels:       app=nginx
              pod-template-hash=67d4bdd6f5
Annotations:  <none>
Status:       Running
IP:           10.88.0.3
IPs:
  IP:           10.88.0.3
  IP:           2001:db8::1
Controlled By:  ReplicaSet/nginx-deployment-67d4bdd6f5
Containers:
  nginx:
    Container ID:   containerd://5403af59a2b46ee5a23fb0ae4b1e077f7ca5c5fb7af16e1ab21c00e0e616462a
    Image:          nginx
    Image ID:       docker.io/library/nginx@sha256:2834dc507516af02784808c5f48b7cbe38b8ed5d0f4837f16e78d00deb7e7767
    Port:           80/TCP
    Host Port:      0/TCP
    State:          Running
      Started:      Thu, 17 Feb 2022 16:51:05 -0500
    Ready:          True
    Restart Count:  0
    Limits:
      cpu:     500m
      memory:  128Mi
    Requests:
      cpu:        500m
      memory:     128Mi
    Environment:  <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-bgsgp (ro)
Conditions:
  Type              Status
  Initialized       True 
  Ready             True 
  ContainersReady   True 
  PodScheduled      True 
Volumes:
  kube-api-access-bgsgp:
    Type:                    Projected (a volume that contains injected data from multiple sources)
    TokenExpirationSeconds:  3607
    ConfigMapName:           kube-root-ca.crt
    ConfigMapOptional:       <nil>
    DownwardAPI:             true
QoS Class:                   Guaranteed
Node-Selectors:              <none>
Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  34s   default-scheduler  Successfully assigned default/nginx-deployment-67d4bdd6f5-w6kd7 to kube-worker-1
  Normal  Pulling    31s   kubelet            Pulling image "nginx"
  Normal  Pulled     30s   kubelet            Successfully pulled image "nginx" in 1.146417389s
  Normal  Created    30s   kubelet            Created container nginx
  Normal  Started    30s   kubelet            Started container nginx
```

<!--
Here you can see configuration information about the container(s) and Pod (labels, resource requirements, etc.), as well as status information about the container(s) and Pod (state, readiness, restart count, events, etc.).
-->
在这里，你可以看到有关容器和 Pod 的配置信息（标签、资源需求等），
以及有关容器和 Pod 的状态信息（状态、就绪、重启计数、事件等）。

<!--
The container state is one of Waiting, Running, or Terminated. Depending on the state, additional information will be provided -- here you can see that for a container in Running state, the system tells you when the container started.
-->
容器状态是 Waiting、Running 和 Terminated 之一。
根据状态的不同，还有对应的额外的信息 —— 在这里你可以看到，
对于处于运行状态的容器，系统会告诉你容器的启动时间。

<!--
Ready tells you whether the container passed its last readiness probe. (In this case, the container does not have a readiness probe configured; the container is assumed to be ready if no readiness probe is configured.)
-->
Ready 指示是否通过了最后一个就绪态探测。
(在本例中，容器没有配置就绪态探测；如果没有配置就绪态探测，则假定容器已经就绪。)

<!--
Restart Count tells you how many times the container has been restarted; this information can be useful for detecting crash loops in containers that are configured with a restart policy of 'always.'
-->
Restart Count 告诉你容器已重启的次数；
这些信息对于定位配置了 “Always” 重启策略的容器持续崩溃问题非常有用。

<!--
Currently the only Condition associated with a Pod is the binary Ready condition, which indicates that the pod is able to service requests and should be added to the load balancing pools of all matching services.
-->
目前，唯一与 Pod 有关的状态是 Ready 状况，该状况表明 Pod 能够为请求提供服务，
并且应该添加到相应服务的负载均衡池中。

<!--
Lastly, you see a log of recent events related to your Pod. "From" indicates the component that is logging the event. "Reason" and "Message" tell you what happened.
-->
最后，你还可以看到与 Pod 相关的近期事件。
“From” 标明记录事件的组件，
“Reason” 和 “Message” 告诉你发生了什么。

<!--
## Example: debugging Pending Pods

A common scenario that you can detect using events is when you've created a Pod that won't fit on any node. For example, the Pod might request more resources than are free on any node, or it might specify a label selector that doesn't match any nodes. Let's say we created the previous Deployment with 5 replicas (instead of 2) and requesting 600 millicores instead of 500, on a four-node cluster where each (virtual) machine has 1 CPU. In that case one of the Pods will not be able to schedule. (Note that because of the cluster addon pods such as fluentd, skydns, etc., that run on each node, if we requested 1000 millicores then none of the Pods would be able to schedule.)
-->
## 例子: 调试 Pending 状态的 Pod

可以使用事件来调试的一个常见的场景是，你创建 Pod 无法被调度到任何节点。
比如，Pod 请求的资源比较多，没有任何一个节点能够满足，或者它指定了一个标签，没有节点可匹配。
假定我们创建之前的 Deployment 时指定副本数是 5（不再是 2），并且请求 600 毫核（不再是 500），
对于一个 4 个节点的集群，若每个节点只有 1 个 CPU，这时至少有一个 Pod 不能被调度。
（需要注意的是，其他集群插件 Pod，比如 fluentd、skydns 等等会在每个节点上运行，
如果我们需求 1000 毫核，将不会有 Pod 会被调度。）

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

<!--
To find out why the nginx-deployment-1370807587-fz9sd pod is not running, we can use `kubectl describe pod` on the pending Pod and look at its events:
-->
为了查找 Pod nginx-deployment-1370807587-fz9sd 没有运行的原因，我们可以使用
`kubectl describe pod` 命令描述 Pod，查看其事件：

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

<!--
Here you can see the event generated by the scheduler saying that the Pod failed to schedule for reason `FailedScheduling` (and possibly others).  The message tells us that there were not enough resources for the Pod on any of the nodes.
-->
这里你可以看到由调度器记录的事件，它表明了 Pod 不能被调度的原因是 `FailedScheduling`（也可能是其他值）。
其 message 部分表明没有任何节点拥有足够多的资源。

<!--
To correct this situation, you can use `kubectl scale` to update your Deployment to specify four or fewer replicas. (Or you could leave the one Pod pending, which is harmless.)
-->
要纠正这种情况，可以使用 `kubectl scale` 更新 Deployment，以指定 4 个或更少的副本。
(或者你可以让 Pod 继续保持这个状态，这是无害的。)

<!--
Events such as the ones you saw at the end of `kubectl describe pod` are persisted in etcd and provide high-level information on what is happening in the cluster. To list all events you can use
-->
你在 `kubectl describe pod` 结尾处看到的事件都保存在 etcd 中，
并提供关于集群中正在发生的事情的高级信息。
如果需要列出所有事件，可使用命令：

```shell
kubectl get events
```

<!--
but you have to remember that events are namespaced. This means that if you're interested in events for some namespaced object (e.g. what happened with Pods in namespace `my-namespace`) you need to explicitly provide a namespace to the command:
-->
但是，需要注意的是，事件是区分名字空间的。
如果你对某些名字空间域的对象（比如 `my-namespace` 名字下的 Pod）的事件感兴趣,
你需要显式地在命令行中指定名字空间：

```shell
kubectl get events --namespace=my-namespace
```

<!--
To see events from all namespaces, you can use the `--all-namespaces` argument.
-->
查看所有 namespace 的事件，可使用 `--all-namespaces` 参数。

<!--
In addition to `kubectl describe pod`, another way to get extra information about a pod (beyond what is provided by `kubectl get pod`) is to pass the `-o yaml` output format flag to `kubectl get pod`. This will give you, in YAML format, even more information than `kubectl describe pod`--essentially all of the information the system has about the Pod. Here you will see things like annotations (which are key-value metadata without the label restrictions, that is used internally by Kubernetes system components), restart policy, ports, and volumes.
-->
除了 `kubectl describe pod` 以外，另一种获取 Pod 额外信息（除了 `kubectl get pod`）的方法
是给 `kubectl get pod` 增加 `-o yaml` 输出格式参数。
该命令将以 YAML 格式为你提供比 `kubectl describe pod` 更多的信息 —— 实际上是系统拥有的关于 Pod 的所有信息。
在这里，你将看到注解（没有标签限制的键值元数据，由 Kubernetes 系统组件在内部使用）、
重启策略、端口和卷等。

```shell
kubectl get pod nginx-deployment-1006230814-6winp -o yaml
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: "2022-02-17T21:51:01Z"
  generateName: nginx-deployment-67d4bdd6f5-
  labels:
    app: nginx
    pod-template-hash: 67d4bdd6f5
  name: nginx-deployment-67d4bdd6f5-w6kd7
  namespace: default
  ownerReferences:
  - apiVersion: apps/v1
    blockOwnerDeletion: true
    controller: true
    kind: ReplicaSet
    name: nginx-deployment-67d4bdd6f5
    uid: 7d41dfd4-84c0-4be4-88ab-cedbe626ad82
  resourceVersion: "1364"
  uid: a6501da1-0447-4262-98eb-c03d4002222e
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
    terminationMessagePolicy: File
    volumeMounts:
    - mountPath: /var/run/secrets/kubernetes.io/serviceaccount
      name: kube-api-access-bgsgp
      readOnly: true
  dnsPolicy: ClusterFirst
  enableServiceLinks: true
  nodeName: kube-worker-1
  preemptionPolicy: PreemptLowerPriority
  priority: 0
  restartPolicy: Always
  schedulerName: default-scheduler
  securityContext: {}
  serviceAccount: default
  serviceAccountName: default
  terminationGracePeriodSeconds: 30
  tolerations:
  - effect: NoExecute
    key: node.kubernetes.io/not-ready
    operator: Exists
    tolerationSeconds: 300
  - effect: NoExecute
    key: node.kubernetes.io/unreachable
    operator: Exists
    tolerationSeconds: 300
  volumes:
  - name: kube-api-access-bgsgp
    projected:
      defaultMode: 420
      sources:
      - serviceAccountToken:
          expirationSeconds: 3607
          path: token
      - configMap:
          items:
          - key: ca.crt
            path: ca.crt
          name: kube-root-ca.crt
      - downwardAPI:
          items:
          - fieldRef:
              apiVersion: v1
              fieldPath: metadata.namespace
            path: namespace
status:
  conditions:
  - lastProbeTime: null
    lastTransitionTime: "2022-02-17T21:51:01Z"
    status: "True"
    type: Initialized
  - lastProbeTime: null
    lastTransitionTime: "2022-02-17T21:51:06Z"
    status: "True"
    type: Ready
  - lastProbeTime: null
    lastTransitionTime: "2022-02-17T21:51:06Z"
    status: "True"
    type: ContainersReady
  - lastProbeTime: null
    lastTransitionTime: "2022-02-17T21:51:01Z"
    status: "True"
    type: PodScheduled
  containerStatuses:
  - containerID: containerd://5403af59a2b46ee5a23fb0ae4b1e077f7ca5c5fb7af16e1ab21c00e0e616462a
    image: docker.io/library/nginx:latest
    imageID: docker.io/library/nginx@sha256:2834dc507516af02784808c5f48b7cbe38b8ed5d0f4837f16e78d00deb7e7767
    lastState: {}
    name: nginx
    ready: true
    restartCount: 0
    started: true
    state:
      running:
        startedAt: "2022-02-17T21:51:05Z"
  hostIP: 192.168.0.113
  phase: Running
  podIP: 10.88.0.3
  podIPs:
  - ip: 10.88.0.3
  - ip: 2001:db8::1
  qosClass: Guaranteed
  startTime: "2022-02-17T21:51:01Z"
```

<!--
## Examining pod logs {#examine-pod-logs}

First, look at the logs of the affected container:
-->
## 检查 Pod 的日志 {#examine-pod-logs}

首先，查看受到影响的容器的日志：

```shell
kubectl logs ${POD_NAME} ${CONTAINER_NAME}
```

<!--
If your container has previously crashed, you can access the previous container's crash log with:
-->
如果你的容器之前崩溃过，你可以通过下面命令访问之前容器的崩溃日志：

```shell
kubectl logs --previous ${POD_NAME} ${CONTAINER_NAME}
```

<!--
## Debugging with container exec {#container-exec}

If the {{< glossary_tooltip text="container image" term_id="image" >}} includes
debugging utilities, as is the case with images built from Linux and Windows OS
base images, you can run commands inside a specific container with
`kubectl exec`:
-->
## 使用容器 exec 进行调试 {#container-exec}

如果 {{< glossary_tooltip text="容器镜像" term_id="image" >}} 包含调试程序，
比如从 Linux 和 Windows 操作系统基础镜像构建的镜像，你可以使用 `kubectl exec` 命令
在特定的容器中运行一些命令：

```shell
kubectl exec ${POD_NAME} -c ${CONTAINER_NAME} -- ${CMD} ${ARG1} ${ARG2} ... ${ARGN}
```

{{< note >}}
<!--
`-c ${CONTAINER_NAME}` is optional. You can omit it for Pods that only contain a single container.
-->
`-c ${CONTAINER_NAME}` 是可选择的。如果 Pod 中仅包含一个容器，就可以忽略它。
{{< /note >}}

<!--
As an example, to look at the logs from a running Cassandra pod, you might run
-->
例如，要查看正在运行的 Cassandra Pod 中的日志，可以运行：

```shell
kubectl exec cassandra -- cat /var/log/cassandra/system.log
```

<!--
You can run a shell that's connected to your terminal using the `-i` and `-t`
arguments to `kubectl exec`, for example:
-->
你可以在 `kubectl exec` 命令后面加上 `-i` 和 `-t` 来运行一个连接到你的终端的 Shell，比如：

```shell
kubectl exec -it cassandra -- sh
```

<!--
For more details, see [Get a Shell to a Running Container](
/docs/tasks/debug/debug-application/get-shell-running-container/).
-->
若要了解更多内容，可查看[获取正在运行容器的 Shell](/zh-cn/docs/tasks/debug/debug-application/get-shell-running-container/)。

<!--
## Debugging with an ephemeral debug container {#ephemeral-container}

{{< glossary_tooltip text="Ephemeral containers" term_id="ephemeral-container" >}}
are useful for interactive troubleshooting when `kubectl exec` is insufficient
because a container has crashed or a container image doesn't include debugging
utilities, such as with [distroless images](
https://github.com/GoogleContainerTools/distroless).
-->
## 使用临时调试容器来进行调试 {#ephemeral-container}

{{< feature-state state="stable" for_k8s_version="v1.25" >}}

当由于容器崩溃或容器镜像不包含调试程序（例如[无发行版镜像](https://github.com/GoogleContainerTools/distroless)等）
而导致 `kubectl exec` 无法运行时，{{< glossary_tooltip text="临时容器" term_id="ephemeral-container" >}}对于排除交互式故障很有用。

<!--
### Example debugging using ephemeral containers {#ephemeral-container-example}

You can use the `kubectl debug` command to add ephemeral containers to a
running Pod. First, create a pod for the example:
-->
## 使用临时容器来调试的例子 {#ephemeral-container-example}

你可以使用 `kubectl debug` 命令来给正在运行中的 Pod 增加一个临时容器。
首先，像示例一样创建一个 pod：

```shell
kubectl run ephemeral-demo --image=registry.k8s.io/pause:3.1 --restart=Never
```

<!--
The examples in this section use the `pause` container image because it does not
contain debugging utilities, but this method works with all container
images.
-->
本节示例中使用 `pause` 容器镜像，因为它不包含调试程序，但是这个方法适用于所有容器镜像。

<!--
If you attempt to use `kubectl exec` to create a shell you will see an error
because there is no shell in this container image.
-->
如果你尝试使用 `kubectl exec` 来创建一个 shell，你将会看到一个错误，因为这个容器镜像中没有 shell。

```shell
kubectl exec -it ephemeral-demo -- sh
```

```
OCI runtime exec failed: exec failed: container_linux.go:346: starting container process caused "exec: \"sh\": executable file not found in $PATH": unknown
```

<!-- 
You can instead add a debugging container using `kubectl debug`. If you
specify the `-i`/`--interactive` argument, `kubectl` will automatically attach
to the console of the Ephemeral Container.
-->

你可以改为使用 `kubectl debug` 添加调试容器。
如果你指定 `-i` 或者 `--interactive` 参数，`kubectl` 将自动挂接到临时容器的控制台。

```shell
kubectl debug -it ephemeral-demo --image=busybox:1.28 --target=ephemeral-demo
```

```
Defaulting debug container name to debugger-8xzrl.
If you don't see a command prompt, try pressing enter.
/ #
```

<!--
This command adds a new busybox container and attaches to it. The `--target`
parameter targets the process namespace of another container. It's necessary
here because `kubectl run` does not enable [process namespace sharing](
/docs/tasks/configure-pod-container/share-process-namespace/) in the pod it
creates.
-->
此命令添加一个新的 busybox 容器并将其挂接到该容器。`--target` 参数指定另一个容器的进程命名空间。
这个指定进程命名空间的操作是必需的，因为 `kubectl run` 不能在它创建的 Pod
中启用[共享进程命名空间](/zh-cn/docs/tasks/configure-pod-container/share-process-namespace/)。

{{< note >}}
<!--
The `--target` parameter must be supported by the {{< glossary_tooltip
text="Container Runtime" term_id="container-runtime" >}}. When not supported,
the Ephemeral Container may not be started, or it may be started with an
isolated process namespace so that `ps` does not reveal processes in other
containers.
-->
{{< glossary_tooltip text="容器运行时" term_id="container-runtime" >}}必须支持 `--target` 参数。
如果不支持，则临时容器可能不会启动，或者可能使用隔离的进程命名空间启动，
导致 `ps` 不显示其他容器内的进程。
{{< /note >}}

<!--
You can view the state of the newly created ephemeral container using `kubectl describe`:
-->
你可以使用 `kubectl describe` 查看新创建的临时容器的状态：

```shell
kubectl describe pod ephemeral-demo
```

```
...
Ephemeral Containers:
  debugger-8xzrl:
    Container ID:   docker://b888f9adfd15bd5739fefaa39e1df4dd3c617b9902082b1cfdc29c4028ffb2eb
    Image:          busybox
    Image ID:       docker-pullable://busybox@sha256:1828edd60c5efd34b2bf5dd3282ec0cc04d47b2ff9caa0b6d4f07a21d1c08084
    Port:           <none>
    Host Port:      <none>
    State:          Running
      Started:      Wed, 12 Feb 2020 14:25:42 +0100
    Ready:          False
    Restart Count:  0
    Environment:    <none>
    Mounts:         <none>
...
```

<!--
Use `kubectl delete` to remove the Pod when you're finished:
-->
使用 `kubectl delete` 来移除已经结束掉的 Pod：

```shell
kubectl delete pod ephemeral-demo
```

<!--
## Debugging using a copy of the Pod
-->
## 通过 Pod 副本调试 {#debugging-using-a-copy-of-the-pod}

<!--
Sometimes Pod configuration options make it difficult to troubleshoot in certain
situations. For example, you can't run `kubectl exec` to troubleshoot your
container if your container image does not include a shell or if your application
crashes on startup. In these situations you can use `kubectl debug` to create a
copy of the Pod with configuration values changed to aid debugging.
-->
有些时候 Pod 的配置参数使得在某些情况下很难执行故障排查。
例如，在容器镜像中不包含 shell 或者你的应用程序在启动时崩溃的情况下，
就不能通过运行 `kubectl exec` 来排查容器故障。
在这些情况下，你可以使用 `kubectl debug` 来创建 Pod 的副本，通过更改配置帮助调试。

<!--
### Copying a Pod while adding a new container
-->
### 在添加新的容器时创建 Pod 副本

<!--
Adding a new container can be useful when your application is running but not
behaving as you expect and you'd like to add additional troubleshooting
utilities to the Pod.
-->
当应用程序正在运行但其表现不符合预期时，你会希望在 Pod 中添加额外的调试工具，
这时添加新容器是很有用的。

<!--
For example, maybe your application's container images are built on `busybox`
but you need debugging utilities not included in `busybox`. You can simulate
this scenario using `kubectl run`:
-->
例如，应用的容器镜像是建立在 `busybox` 的基础上，
但是你需要 `busybox` 中并不包含的调试工具。
你可以使用 `kubectl run` 模拟这个场景:

```shell
kubectl run myapp --image=busybox:1.28 --restart=Never -- sleep 1d
```

<!--
Run this command to create a copy of `myapp` named `myapp-debug` that adds a
new Ubuntu container for debugging:
-->
通过运行以下命令，建立 `myapp` 的一个名为 `myapp-debug` 的副本，
新增了一个用于调试的 Ubuntu 容器，

```shell
kubectl debug myapp -it --image=ubuntu --share-processes --copy-to=myapp-debug
```

```
Defaulting debug container name to debugger-w7xmf.
If you don't see a command prompt, try pressing enter.
root@myapp-debug:/#
```

{{< note >}}
<!--
* `kubectl debug` automatically generates a container name if you don't choose
  one using the `--container` flag.
* The `-i` flag causes `kubectl debug` to attach to the new container by
  default.  You can prevent this by specifying `--attach=false`. If your session
  becomes disconnected you can reattach using `kubectl attach`.
* The `--share-processes` allows the containers in this Pod to see processes
  from the other containers in the Pod. For more information about how this
  works, see [Share Process Namespace between Containers in a Pod](
  /docs/tasks/configure-pod-container/share-process-namespace/).
-->
* 如果你没有使用 `--container` 指定新的容器名，`kubectl debug` 会自动生成的。
* 默认情况下，`-i` 标志使 `kubectl debug` 附加到新容器上。
  你可以通过指定 `--attach=false` 来防止这种情况。
  如果你的会话断开连接，你可以使用 `kubectl attach` 重新连接。
* `--share-processes` 允许在此 Pod 中的其他容器中查看该容器的进程。
  参阅[在 Pod 中的容器之间共享进程命名空间](/zh-cn/docs/tasks/configure-pod-container/share-process-namespace/)
  获取更多信息。
{{< /note >}}

<!--
Don't forget to clean up the debugging Pod when you're finished with it:
-->
不要忘了清理调试 Pod：

```shell
kubectl delete pod myapp myapp-debug
```

<!--
### Copying a Pod while changing its command
-->
### 在改变 Pod 命令时创建 Pod 副本

<!--
Sometimes it's useful to change the command for a container, for example to
add a debugging flag or because the application is crashing.
-->
有时更改容器的命令很有用，例如添加调试标志或因为应用崩溃。

<!--
To simulate a crashing application, use `kubectl run` to create a container
that immediately exits:
-->
为了模拟应用崩溃的场景，使用 `kubectl run` 命令创建一个立即退出的容器：

```
kubectl run --image=busybox:1.28 myapp -- false
```

<!--
You can see using `kubectl describe pod myapp` that this container is crashing:
-->
使用 `kubectl describe pod myapp` 命令，你可以看到容器崩溃了：

```
Containers:
  myapp:
    Image:         busybox
    ...
    Args:
      false
    State:          Waiting
      Reason:       CrashLoopBackOff
    Last State:     Terminated
      Reason:       Error
      Exit Code:    1
```

<!--
You can use `kubectl debug` to create a copy of this Pod with the command
changed to an interactive shell:
-->
你可以使用 `kubectl debug` 命令创建该 Pod 的一个副本，
在该副本中命令改变为交互式 shell：

```
kubectl debug myapp -it --copy-to=myapp-debug --container=myapp -- sh
```

```
If you don't see a command prompt, try pressing enter.
/ #
```

<!--
Now you have an interactive shell that you can use to perform tasks like
checking filesystem paths or running the container command manually.
-->
现在你有了一个可以执行类似检查文件系统路径或者手动运行容器命令的交互式 shell。

{{< note >}}
<!--
* To change the command of a specific container you must
  specify its name using `--container` or `kubectl debug` will instead
  create a new container to run the command you specified.
* The `-i` flag causes `kubectl debug` to attach to the container by default.
  You can prevent this by specifying `--attach=false`. If your session becomes
  disconnected you can reattach using `kubectl attach`.
-->
* 要更改指定容器的命令，你必须用 `--container` 命令指定容器的名字，
  否则 `kubectl debug` 将建立一个新的容器运行你指定的命令。
* 默认情况下，标志 `-i` 使 `kubectl debug` 附加到容器。
  你可通过指定 `--attach=false` 来防止这种情况。
  如果你的断开连接，可以使用 `kubectl attach` 重新连接。
{{< /note >}} 

<!--
Don't forget to clean up the debugging Pod when you're finished with it:
-->
不要忘了清理调试 Pod：

```shell
kubectl delete pod myapp myapp-debug
```

<!--
### Copying a Pod while changing container images

In some situations you may want to change a misbehaving Pod from its normal
production container images to an image containing a debugging build or
additional utilities.

As an example, create a Pod using `kubectl run`:
-->
### 在更改容器镜像时拷贝 Pod

在某些情况下，你可能想要改动一个行为异常的 Pod，即从其正常的生产容器镜像更改为包含调试构建程序或其他实用程序的镜像。

下面的例子，用 `kubectl run` 创建一个 Pod：

```shell
kubectl run myapp --image=busybox:1.28 --restart=Never -- sleep 1d
```

<!--
Now use `kubectl debug` to make a copy and change its container image
to `ubuntu`:
-->
现在可以使用 `kubectl debug` 创建一个拷贝并将其容器镜像更改为 `ubuntu`：

```shell
kubectl debug myapp --copy-to=myapp-debug --set-image=*=ubuntu
```

<!--
The syntax of `--set-image` uses the same `container_name=image` syntax as
`kubectl set image`. `*=ubuntu` means change the image of all containers
to `ubuntu`.

Don't forget to clean up the debugging Pod when you're finished with it:
-->
`--set-image` 与 `container_name=image` 使用相同的 `kubectl set image` 语法。
`*=ubuntu` 表示把所有容器的镜像改为 `ubuntu`。

```shell
kubectl delete pod myapp myapp-debug
```

<!--
## Debugging via a shell on the node {#node-shell-session}

If none of these approaches work, you can find the Node on which the Pod is
running and create a Pod running on the Node. To create
an interactive shell on a Node using `kubectl debug`, run:
-->
## 在节点上通过 shell 来进行调试 {#node-shell-session}

如果这些方法都不起作用，你可以找到运行 Pod 的节点，然后创建一个 Pod 运行在该节点上。
你可以通过 `kubectl debug` 在节点上创建一个交互式 Shell：

```shell
kubectl debug node/mynode -it --image=ubuntu
```

```
Creating debugging pod node-debugger-mynode-pdx84 with container debugger on node mynode.
If you don't see a command prompt, try pressing enter.
root@ek8s:/#
```

<!--
When creating a debugging session on a node, keep in mind that:

* `kubectl debug` automatically generates the name of the new Pod based on
  the name of the Node.
* The root filesystem of the Node will be mounted at `/host`.
* The container runs in the host IPC, Network, and PID namespaces, although
  the pod isn't privileged, so reading some process information may fail,
  and `chroot /host` may fail.
* If you need a privileged pod, create it manually or use the `--profile=sysadmin` flag.

Don't forget to clean up the debugging Pod when you're finished with it:
-->
当在节点上创建调试会话，注意以下要点：
* `kubectl debug` 基于节点的名字自动生成新的 Pod 的名字。
* 节点的根文件系统会被挂载在 `/host`。
* 新的调试容器运行在主机 IPC 名字空间、主机网络名字空间以及主机 PID 名字空间内，
  Pod 没有特权，因此读取某些进程信息可能会失败，并且 `chroot /host` 也可能会失败。
* 如果你需要一个特权 Pod，需要手动创建或使用 `--profile=sysadmin` 标志。

当你完成节点调试时，不要忘记清理调试 Pod：

```shell
kubectl delete pod node-debugger-mynode-pdx84
```

<!--
## Debugging Profiles {#debugging-profiles}

When using `kubectl debug` to debug a node via a debugging Pod, a Pod via an ephemeral container, 
or a copied Pod, you can apply a debugging profile to them using the `--profile` flag.
By applying a profile, specific properties such as [securityContext](/docs/tasks/configure-pod-container/security-context/)
are set, allowing for adaptation to various scenarios.

The available profiles are as follows:
-->
## 调试配置   {#debugging-profiles}

使用 `kubectl debug` 通过调试 Pod 来调试节点、通过临时容器来调试 Pod 或者调试复制的 Pod 时，
你可以使用 `--profile` 标志为其应用调试配置（Debugging Profile）。通过应用配置，可以设置特定的属性（如
[securityContext](/zh-cn/docs/tasks/configure-pod-container/security-context/)），
以适应各种场景。

可用的配置如下：

<!--
| Profile      | Description                                                     |
| ------------ | --------------------------------------------------------------- |
| legacy       | A set of properties backwards compatibility with 1.22 behavior |
| general      | A reasonable set of generic properties for each debugging journey |
| baseline     | A set of properties compatible with [PodSecurityStandard baseline policy](/docs/concepts/security/pod-security-standards/#baseline) |
| restricted   | A set of properties compatible with [PodSecurityStandard restricted policy](/docs/concepts/security/pod-security-standards/#restricted) |
| netadmin     | A set of properties including Network Administrator privileges |
| sysadmin     | A set of properties including System Administrator (root) privileges |
-->
| 配置         | 描述                                                      |
| ----------- | --------------------------------------------------------- |
| legacy      | 一组与 1.22 行为向后兼容的属性                                |
| general     | 一组对大多数调试过程而言均合理的通用属性                         |
| baseline    | 一组与 [PodSecurityStandard Baseline 策略](/zh-cn/docs/concepts/security/pod-security-standards/#baseline)兼容的属性 |
| restricted  | 一组与 [PodSecurityStandard Restricted 策略](/zh-cn/docs/concepts/security/pod-security-standards/#restricted)兼容的属性 |
| netadmin    | 一组包含网络管理员特权的属性                                   |
| sysadmin    | 一组包含系统管理员（root）特权的属性                            |


{{< note >}}
<!--
If you don't specify `--profile`, the `legacy` profile is used by default, but it is planned to be deprecated in the near future.
So it is recommended to use other profiles such as `general`.
-->
如果你不指定 `--profile`，`legacy` 配置被默认使用，但此配置计划在不久的将来弃用。
因此建议使用 `general` 等其他配置。
{{< /note >}}

<!--
Assume that you create a Pod and debug it.
First, create a Pod named `myapp` as an example:
-->
假设你要创建一个 Pod 并进行调试。
先创建一个名为 `myapp` 的 Pod 作为示例：

```shell
kubectl run myapp --image=busybox:1.28 --restart=Never -- sleep 1d
```

<!--
Then, debug the Pod using an ephemeral container.
If the ephemeral container needs to have privilege, you can use the `sysadmin` profile:
-->
然后，使用临时容器调试 Pod。
如果临时容器需要具有特权，你可以使用 `sysadmin` 配置：

```shell
kubectl debug -it myapp --image=busybox:1.28 --target=myapp --profile=sysadmin
```

```
Targeting container "myapp". If you don't see processes from this container it may be because the container runtime doesn't support this feature.
Defaulting debug container name to debugger-6kg4x.
If you don't see a command prompt, try pressing enter.
/ #
```

<!--
Check the capabilities of the ephemeral container process by running the following command inside the container:
-->
通过在容器内运行以下命令检查临时容器进程的权能：

```shell
/ # grep Cap /proc/$$/status
```

```
...
CapPrm:	000001ffffffffff
CapEff:	000001ffffffffff
...
```

<!--
This means the container process is granted full capabilities as a privileged container by applying `sysadmin` profile.
See more details about [capabilities](/docs/tasks/configure-pod-container/security-context/#set-capabilities-for-a-container).

You can also check that the ephemeral container was created as a privileged container:
-->
这意味着通过应用 `sysadmin` 配置，容器进程被授予了作为特权容器的全部权能。
更多细节参见[权能](/zh-cn/docs/tasks/configure-pod-container/security-context/#set-capabilities-for-a-container)。

你还可以检查临时容器是否被创建为特权容器：

```shell
kubectl get pod myapp -o jsonpath='{.spec.ephemeralContainers[0].securityContext}'
```

```
{"privileged":true}
```

<!--
Clean up the Pod when you're finished with it:
-->
你在完成上述操作后，可运行以下命令清理 Pod：

```shell
kubectl delete pod myapp
```
