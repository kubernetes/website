---
reviewers:
- mikedanese
- thockin
title: 排查应用故障
cn-approvers:
- chentao1596
---
<!--
---
reviewers:
- mikedanese
- thockin
title: Troubleshoot Applications
---
-->

<!--
This guide is to help users debug applications that are deployed into Kubernetes and not behaving correctly.
This is *not* a guide for people who want to debug their cluster.  For that you should check out
[this guide](/docs/admin/cluster-troubleshooting).
-->
本指南旨在帮助用户调试那些部署到 Kubernetes 中但是行为不正确的应用。这 *不是* 针对想要调试集群的人员的指南。如果想要调试集群，您应该看看 [这个指南](/docs/admin/cluster-troubleshooting)。

* TOC
{:toc}

<!--
## Diagnosing the problem
-->
## 诊断问题

<!--
The first step in troubleshooting is triage.  What is the problem?  Is it your Pods, your Replication Controller or
your Service?
-->
故障排查的第一步是分诊。问题是什么？是您的 Pod？您的副本控制器（RC：Replication Controller）？还是您的服务？

<!--
   * [Debugging Pods](#debugging-pods)
   * [Debugging Replication Controllers](#debugging-replication-controllers)
   * [Debugging Services](#debugging-services)
-->
   * [调试 Pod](#调试-Pod)
   * [调试副本控制器](#调试副本控制器)
   * [调试服务](#调试服务)

<!--
### Debugging Pods
-->
### 调试 Pod

<!--
The first step in debugging a Pod is taking a look at it.  Check the current state of the Pod and recent events with the following command:
-->
调试 Pod 的第一步是查看它。使用以下命令检查 Pod 以及最近事件的状态：

```shell
$ kubectl describe pods ${POD_NAME}
```

<!--
Look at the state of the containers in the pod.  Are they all `Running`?  Have there been recent restarts?
-->
查看 pod 中容器的状态。它们都是Running？最近有没有重新启动？

<!--
Continue debugging depending on the state of the pods.
-->
根据 pod 的状态继续调试。

<!--
#### My pod stays pending
-->
#### pod 一直是 pending 状态

<!--
If a Pod is stuck in `Pending` it means that it can not be scheduled onto a node.  Generally this is because
there are insufficient resources of one type or another that prevent scheduling.  Look at the output of the
`kubectl describe ...` command above.  There should be messages from the scheduler about why it can not schedule
your pod.  Reasons include:
-->
如果 pod 卡在 `Pending` 状态，意味着它不能被调度到节点上。通常这是因为没有足够的资源导致调度被阻止了。查看 `kubectl describe ...` 命令的输出。应该有来自调度器说明为什么它无法调度您的 pod 的消息。原因包括：

<!--
* **You don't have enough resources**:  You may have exhausted the supply of CPU or Memory in your cluster, in this case
you need to delete Pods, adjust resource requests, or add new nodes to your cluster. See [Compute Resources document](/docs/user-guide/compute-resources/#my-pods-are-pending-with-event-message-failedscheduling) for more information.
-->
* **您没有足够的资源**：您可能已经耗尽了集群中 CPU 或内存的供应，在这种情况下，您需要删除 Pod、调整资源请求或向集群添加新节点。请参阅 [计算资源文档](/docs/user-guide/compute-resources/#my-pods-are-pending-with-event-message-failedscheduling) 获取这方面的更多信息。

<!--
* **You are using `hostPort`**:  When you bind a Pod to a `hostPort` there are a limited number of places that pod can be
scheduled.  In most cases, `hostPort` is unnecessary, try using a Service object to expose your Pod.  If you do require
`hostPort` then you can only schedule as many Pods as there are nodes in your Kubernetes cluster.
-->
* **您正在使用 `hostPort`**：当您将 Pod 绑定到一个 `hostPort`，可调度的 pod 的数量是有限的。在大多数情况下，`hostPort` 是不需要的，可以尝试使用 Service 对象来暴露您的 Pod。如果您确实需要 `hostPort`，那么您只能调度与 Kubernetes 集群中节点数量相同的 Pod。

<!--
#### My pod stays waiting
-->
#### pod 一直是 waiting 状态

<!--
If a Pod is stuck in the `Waiting` state, then it has been scheduled to a worker node, but it can't run on that machine.
Again, the information from `kubectl describe ...` should be informative.  The most common cause of `Waiting` pods is a failure to pull the image.  There are three things to check:
-->
如果一个 Pod 停留在 `Waiting` 状态，则它已被调度到一个工作节点，但不能在该机器上运行。同样，来自 `kubectl describe ...` 命令的信息应该是可以分析其原因的。`Waiting`  pod 最常见的原因是无法拉取镜像。有三件事要检查：

<!--
* Make sure that you have the name of the image correct.
* Have you pushed the image to the repository?
* Run a manual `docker pull <image>` on your machine to see if the image can be pulled.
-->
* 确保您有正确的镜像名称。
* 您是否将镜像推送到仓库？
* 在您的机器运行 `docker pull <image>`，查看镜像是否能够拉取。

<!--
#### My pod is crashing or otherwise unhealthy
-->
#### pod 崩溃或者其它不健康状态

<!--
First, take a look at the logs of
the current container:
-->
首先，查看当前容器的日志：

```shell
$ kubectl logs ${POD_NAME} ${CONTAINER_NAME}
```

<!--
If your container has previously crashed, you can access the previous container's crash log with:
-->
如果您的容器先前已崩溃，则可以通过以下方式访问先前容器的崩溃日志：

```shell
$ kubectl logs --previous ${POD_NAME} ${CONTAINER_NAME}
```

<!--
Alternately, you can run commands inside that container with `exec`:
-->
或者，您可以在该容器中运行命令 `exec`：

```shell
$ kubectl exec ${POD_NAME} -c ${CONTAINER_NAME} -- ${CMD} ${ARG1} ${ARG2} ... ${ARGN}
```

<!--
Note that `-c ${CONTAINER_NAME}` is optional and can be omitted for Pods that only contain a single container.
-->
请注意，`-c ${CONTAINER_NAME}` 是可选的，对于只包含单个容器的 pod 可以省略。

<!--
As an example, to look at the logs from a running Cassandra pod, you might run
-->
例如，要查看正在运行的 Cassandra pod 的日志，您可以运行

```shell
$ kubectl exec cassandra -- cat /var/log/cassandra/system.log
```

<!--
If none of these approaches work, you can find the host machine that the pod is running on and SSH into that host,
but this should generally not be necessary given tools in the Kubernetes API. Therefore, if you find yourself needing to ssh into a machine, please file a
feature request on GitHub describing your use case and why these tools are insufficient.
-->
如果这些方法都不起作用，您可以找到运行 pod 的主机并通过 SSH 连接到该主机，但是，在 Kubernetes API 中，通常是没有必要使用这些工具的。因此，如果您发现自己需要 SSH 进入一台机器，请在 GitHub 上提交描述您使用案例的功能请求，以及为什么这些工具不足。

<!--
#### My pod is running but not doing what I told it to do
-->
#### pod 正在运行，但没有按照我所说的去做

<!--
If your pod is not behaving as you expected, it may be that there was an error in your
pod description (e.g. `mypod.yaml` file on your local machine), and that the error
was silently ignored when you created the pod.  Often a section of the pod description
is nested incorrectly, or a key name is typed incorrectly, and so the key is ignored.
For example, if you misspelled `command` as `commnd` then the pod will be created but
will not use the command line you intended it to use.
-->
如果您的 pod 没有按照您的预期运行，则可能是您的 pod 描述中存在错误（例如，本地计算机上的 `mypod.yaml` 文件），并且在创建 pod 时错误被默默地忽略了。通常情况下，包括 pod 描述的一部分被错误的嵌套、或者某个键名称键入错误，因此该键被忽略。例如，如果将 `command` 错误地拼写为 `commnd`，那么会创建 pod，但不会使用您打算使用的命令行。

<!--
The first thing to do is to delete your pod and try creating it again with the `--validate` option.
For example, run `kubectl create --validate -f mypod.yaml`.
If you misspelled `command` as `commnd` then  will give an error like this:
-->
首先要做的是删除您的 pod，然后尝试使用 `--validate` 选项重新创建它。例如，运行 `kubectl create --validate -f mypod.yaml`。如果将 `command` 错误地拼写为 `commnd`，那么会出现如下错误：

```shell
I0805 10:43:25.129850   46757 schema.go:126] unknown field: commnd
I0805 10:43:25.129973   46757 schema.go:129] this may be a false alarm, see https://github.com/kubernetes/kubernetes/issues/6842
pods/mypod
```

<!-- TODO: Now that #11914 is merged, this advice may need to be updated -->

<!--
The next thing to check is whether the pod on the apiserver
matches the pod you meant to create (e.g. in a yaml file on your local machine).
For example, run `kubectl get pods/mypod -o yaml > mypod-on-apiserver.yaml` and then
manually compare the original pod description, `mypod.yaml` with the one you got
back from apiserver, `mypod-on-apiserver.yaml`.  There will typically be some
lines on the "apiserver" version that are not on the original version.  This is
expected.  However, if there are lines on the original that are not on the apiserver
version, then this may indicate a problem with your pod spec.
-->
接下来要检查 apiserver 上的 pod 是否与您要创建的 pod 相匹配（例如，在本地机器上的 yaml 文件）。例如，运行 `kubectl get pods/mypod -o yaml > mypod-on-apiserver.yaml` 并手动比较原始 pod 描述和从 apiserver 获取的描述 `mypod-on-apiserver.yaml`。“apiserver” 版本通常会有一些不在原始版本上出现的行，这是预料之中的。但是，如果原件上的某些行在 apiserver 版本上没有，则可能表明您的 pod 描述存在问题。

<!--
### Debugging Replication Controllers
-->
### 调试副本控制器

<!--
Replication controllers are fairly straightforward.  They can either create Pods or they can't.  If they can't
create pods, then please refer to the [instructions above](#debugging-pods) to debug your pods.
-->
副本控制器相当直接。它们要么能够创建 Pod 要么不能。如果他们无法创建 pod，请参阅 [上面的说明](#调试-Pod) 来调试您的 pod。

<!--
You can also use `kubectl describe rc ${CONTROLLER_NAME}` to introspect events related to the replication
controller.
-->
您也可以使用 `kubectl describe rc ${CONTROLLER_NAME}` 内省与副本控制器相关的事件。

<!--
### Debugging Services
-->
### 调试服务

<!--
Services provide load balancing across a set of pods.  There are several common problems that can make Services
not work properly.  The following instructions should help debug Service problems.
-->
服务提供跨一组 Pod 的负载平衡。有几个常见问题可能会导致服务无法正常工作。以下说明应该有助于调试服务问题。

<!--
First, verify that there are endpoints for the service. For every Service object, the apiserver makes an `endpoints` resource available.
-->
首先，确认服务有 endpoints。对于每个服务对象，apiserver 都提供 `endpoints` 资源。

<!--
You can view this resource with:
-->
您可以查看这个资源：

```shell
$ kubectl get endpoints ${SERVICE_NAME}
```

<!--
Make sure that the endpoints match up with the number of containers that you expect to be a member of your service.
For example, if your Service is for an nginx container with 3 replicas, you would expect to see three different
IP addresses in the Service's endpoints.
-->
确保 endpoints 符合您希望成为服务成员的容器数量。例如，如果您的服务是针对具有 3 个复本的 nginx 容器，则您希望在服务的 endpoints 中看到三个不同的 IP 地址。

<!--
#### My service is missing endpoints
-->
#### 服务缺少 endpoints

<!--
If you are missing endpoints, try listing pods using the labels that Service uses.  Imagine that you have
a Service where the labels are:
-->
如果缺少 endpoints，请尝试使用 Service 中使用的标签列出 pod。想象一下，您有一个服务，标签是：

```yaml
...
spec:
  - selector:
     name: nginx
     type: frontend
```

<!--
You can use:
-->
您可以使用：

```shell
$ kubectl get pods --selector=name=nginx,type=frontend
```

<!--
to list pods that match this selector.  Verify that the list matches the Pods that you expect to provide your Service.
-->
列出与此选择器匹配的 pod。请验证列表是否与您希望提供服务的 pod 相匹配。

<!--
If the list of pods matches expectations, but your endpoints are still empty, it's possible that you don't
have the right ports exposed.  If your service has a `containerPort` specified, but the Pods that are
selected don't have that port listed, then they won't be added to the endpoints list.
-->
如果 pod 列表符合期望值，但您的 endpoints 仍为空，则可能是因为没有暴露正确的端口。如果您的服务有一个指定的 `containerPort`，但所选的 Pod 没有列出该端口，则不会将其添加到 endpoint 列表中。

<!--
Verify that the pod's `containerPort` matches up with the Service's `containerPort`
-->
验证 pod 的 `containerPort`与服务的`containerPort` 匹配

<!--
#### Network traffic is not forwarded
-->
#### 网络流量未被转发

<!--
If you can connect to the service, but the connection is immediately dropped, and there are endpoints
in the endpoints list, it's likely that the proxy can't contact your pods.
-->
如果您可以连接到服务，但连接会马上断开，并且 endpoints 列表中有 endpoints，则有可能是代理无法联系到您的 pod。

<!--
There are three things to
check:
-->
有三件事要检查：

<!--
   * Are your pods working correctly?  Look for restart count, and [debug pods](#debugging-pods).
   * Can you connect to your pods directly?  Get the IP address for the Pod, and try to connect directly to that IP.
   * Is your application serving on the port that you configured?  Kubernetes doesn't do port remapping, so if your application serves on 8080, the `containerPort` field needs to be 8080.
-->
   * 您的 pod 工作正常吗？查找重新启动次数，并 [调试 pod](#调试-Pod)。
   * 您可以直接连接到您的 pod 吗？获取 Pod 的 IP 地址，并尝试直接连接到该 IP。
   * 您的应用是否在您配置的端口上运行？Kubernetes 不会执行端口重映射，所以如果您的应用在 8080 上运行，则该 `containerPort` 字段需要为8080。

<!--
#### More information
-->
#### 更多信息

<!--
If none of the above solves your problem, follow the instructions in [Debugging Service document](/docs/user-guide/debugging-services) to make sure that your `Service` is running, has `Endpoints`, and your `Pods` are actually serving; you have DNS working, iptables rules installed, and kube-proxy does not seem to be misbehaving.
-->
如果以上都不能解决您的问题，请按照 [调试服务文档](/docs/user-guide/debugging-services) 中的说明操作，以确保您的 `Service` 正在运行、拥有 `Endpoints` 以及您的 `Pods`  确实正在服务中；您有正在工作中的 DNS、安装了 iptables 规则，并且 kube-proxy 似乎没有什么不妥之处。

<!--
You may also visit [troubleshooting document](/docs/troubleshooting/) for more information.
-->
您也可以访问 [故障排查文档](/docs/troubleshooting/) 获取更多信息。
