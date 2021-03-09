---
title: 使用 Seccomp 限制容器的系统调用
content_type: tutorial
weight: 20
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.19" state="stable" >}}

<!--
Seccomp stands for secure computing mode and has been a feature of the Linux
kernel since version 2.6.12.  It can be used to sandbox the privileges of a
process, restricting the calls it is able to make from userspace into the
kernel. Kubernetes lets you automatically apply seccomp profiles loaded onto a
Node to your Pods and containers.

Identifying the privileges required for your workloads can be difficult. In this
tutorial, you will go through how to load seccomp profiles into a local
Kubernetes cluster, how to apply them to a Pod, and how you can begin to craft
profiles that give only the necessary privileges to your container processes.
-->
Seccomp 代表安全计算模式，自 2.6.12 版本以来一直是 Linux 内核的功能。
它可以用来对进程的特权进行沙盒处理，从而限制了它可以从用户空间向内核进行的调用。
Kubernetes 允许你将加载到节点上的 seccomp 配置文件自动应用于 Pod 和容器。

确定工作负载所需的特权可能很困难。在本教程中，你将了解如何将 seccomp 配置文件
加载到本地 Kubernetes 集群中，如何将它们应用到 Pod，以及如何开始制作仅向容器
进程提供必要特权的配置文件。

## {{% heading "objectives" %}}

<!--
* Learn how to load seccomp profiles on a node
* Learn how to apply a seccomp profile to a container
* Observe auditing of syscalls made by a container process
* Observe behavior when a missing profile is specified
* Observe a violation of a seccomp profile
* Learn how to create fine-grained seccomp profiles
* Learn how to apply a container runtime default seccomp profile
-->
* 了解如何在节点上加载 seccomp 配置文件
* 了解如何将 seccomp 配置文件应用于容器
* 观察由容器进程进行的系统调用的审核
* 观察当指定了一个不存在的配置文件时的行为
* 观察违反 seccomp 配置的情况
* 了解如何创建精确的 seccomp 配置文件
* 了解如何应用容器运行时默认 seccomp 配置文件

## {{% heading "prerequisites" %}}

<!--
In order to complete all steps in this tutorial, you must install
[kind](https://kind.sigs.k8s.io/docs/user/quick-start/) and
[kubectl](/docs/tasks/tools/install-kubectl/). This tutorial will show examples
with both alpha (pre-v1.19) and generally available seccomp functionality, so
make sure that your cluster is [configured
correctly](https://kind.sigs.k8s.io/docs/user/quick-start/#setting-kubernetes-version)
for the version you are using.
-->
为了完成本教程中的所有步骤，你必须安装 [kind](https://kind.sigs.k8s.io/docs/user/quick-start/) 
和 [kubectl](/zh/docs/tasks/tools/install-kubectl/)。本教程将显示同时具有 alpha（v1.19 之前的版本）
和通常可用的 seccomp 功能的示例，因此请确保为所使用的版本[正确配置](https://kind.sigs.k8s.io/docs/user/quick-start/#setting-kubernetes-version)了集群。

<!-- steps -->
<!--
## Create Seccomp Profiles

The contents of these profiles will be explored later on, but for now go ahead
and download them into a directory named `profiles/` so that they can be loaded
into the cluster.
-->
## 创建 Seccomp 文件

这些配置文件的内容将在以后进行探讨，但现在继续进行，并将其下载到名为 `profiles/` 的目录中，以便可以将其加载到集群中。

{{< tabs name="tab_with_code" >}}
{{{< tab name="audit.json" >}}
{{< codenew file="pods/security/seccomp/profiles/audit.json" >}}
{{< /tab >}}
{{< tab name="violation.json" >}}
{{< codenew file="pods/security/seccomp/profiles/violation.json" >}}
{{< /tab >}}}
{{< tab name="fine-grained.json" >}}
{{< codenew file="pods/security/seccomp/profiles/fine-grained.json" >}}
{{< /tab >}}}
{{< /tabs >}}

<!--
## Create a Local Kubernetes Cluster with Kind

For simplicity, [kind](https://kind.sigs.k8s.io/) can be used to create a single
node cluster with the seccomp profiles loaded. Kind runs Kubernetes in Docker,
so each node of the cluster is actually just a container. This allows for files
to be mounted in the filesystem of each container just as one might load files
onto a node.

Download the example above, and save it to a file named `kind.yaml`. Then create
the cluster with the configuration.
-->
## 使用 Kind 创建一个本地 Kubernetes 集群

为简单起见，可以使用 [kind](https://kind.sigs.k8s.io/) 创建一个已经加载 seccomp 配置文件的单节点集群。
Kind 在 Docker 中运行 Kubernetes，因此集群的每个节点实际上只是一个容器。这允许将文件挂载到每个容器的文件系统中，
就像将文件挂载到节点上一样。

{{< codenew file="pods/security/seccomp/kind.yaml" >}}
<br>

下载上面的这个示例，并将其保存为 `kind.yaml`。然后使用这个配置创建集群。

```
kind create cluster --config=kind.yaml
```

<!--
Once the cluster is ready, identify the container running as the single node
cluster:
-->
一旦这个集群已经就绪，找到作为单节点集群运行的容器：

```
docker ps
```

<!--
You should see output indicating that a container is running with name
`kind-control-plane`.
-->
你应该看到输出显示正在运行的容器名称为 `kind-control-plane`。

```
CONTAINER ID        IMAGE                  COMMAND                  CREATED             STATUS              PORTS                       NAMES
6a96207fed4b        kindest/node:v1.18.2   "/usr/local/bin/entr…"   27 seconds ago      Up 24 seconds       127.0.0.1:42223->6443/tcp   kind-control-plane
```

<!--
If observing the filesystem of that container, one should see that the
`profiles/` directory has been successfully loaded into the default seccomp path
of the kubelet. Use `docker exec` to run a command in the Pod:
-->
如果观察该容器的文件系统，则应该看到 `profiles/` 目录已成功加载到 kubelet 的默认 seccomp 路径中。
使用 `docker exec` 在 Pod 中运行命令：

```
docker exec -it 6a96207fed4b ls /var/lib/kubelet/seccomp/profiles
```

```
audit.json  fine-grained.json  violation.json
```

<!--
## Create a Pod with a Seccomp profile for syscall auditing

To start off, apply the `audit.json` profile, which will log all syscalls of the
process, to a new Pod.

Download the correct manifest for your Kubernetes version:
-->
## 使用 Seccomp 配置文件创建 Pod 以进行系统调用审核

首先，将 `audit.json` 配置文件应用到新的 Pod 中，该配置文件将记录该进程的所有系统调用。

为你的 Kubernetes 版本下载正确的清单：

{{< tabs name="audit_pods" >}}
{{< tab name="v1.19 或更新版本（GA）" >}}
{{< codenew file="pods/security/seccomp/ga/audit-pod.yaml" >}}
{{< /tab >}}}
{{{< tab name="v1.19之前版本（alpha）" >}}
{{< codenew file="pods/security/seccomp/alpha/audit-pod.yaml" >}}
{{< /tab >}}
{{< /tabs >}}
<br>

<!--
Create the Pod in the cluster:
-->
在集群中创建 Pod：

```
kubectl apply -f audit-pod.yaml
```

<!--
This profile does not restrict any syscalls, so the Pod should start
successfully.
-->
这个配置文件并不限制任何系统调用，所以这个 Pod 应该会成功启动。

```
kubectl get pod/audit-pod
```

```
NAME        READY   STATUS    RESTARTS   AGE
audit-pod   1/1     Running   0          30s
```

<!--
In order to be able to interact with this endpoint exposed by this
container,create a NodePort Service that allows access to the endpoint from
inside the kind control plane container.
-->
为了能够与该容器公开的端点进行交互，请创建一个 NodePort 服务，
该服务允许从 kind 控制平面容器内部访问该端点。

```
kubectl expose pod/audit-pod --type NodePort --port 5678
```

<!--
Check what port the Service has been assigned on the node.
-->
检查这个服务在这个节点上被分配了什么端口。

```
kubectl get svc/audit-pod
```

```
NAME        TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
audit-pod   NodePort   10.111.36.142   <none>        5678:32373/TCP   72s
```

<!--
Now you can `curl` the endpoint from inside the kind control plane container at
the port exposed by this Service. Use `docker exec` to run a command in the Pod:
-->
现在你可以使用 `curl` 命令从 kind 控制平面容器内部通过该服务暴露出来的端口来访问这个端点。

```
docker exec -it 6a96207fed4b curl localhost:32373
```

```
just made some syscalls!
```

<!--
You can see that the process is running, but what syscalls did it actually make?
Because this Pod is running in a local cluster, you should be able to see those
in `/var/log/syslog`. Open up a new terminal window and `tail` the output for
calls from `http-echo`:

```
tail -f /var/log/syslog | grep 'http-echo'
```

You should already see some logs of syscalls made by `http-echo`, and if you
`curl` the endpoint in the control plane container you will see more written.
-->
你可以看到该进程正在运行，但是实际上执行了哪些系统调用？因为该 Pod 是在本地集群中运行的，
你应该可以在 `/var/log/syslog` 日志中看到这些。打开一个新的终端窗口，使用 `tail` 命令来
查看来自 `http-echo` 的调用输出：

```
tail -f /var/log/syslog | grep 'http-echo'
```

你应该已经可以看到 `http-echo` 发出的一些系统调用日志，
如果你在控制面板容器内 `curl` 了这个端点，你会看到更多的日志。

```
Jul  6 15:37:40 my-machine kernel: [369128.669452] audit: type=1326 audit(1594067860.484:14536): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=51 compat=0 ip=0x46fe1f code=0x7ffc0000
Jul  6 15:37:40 my-machine kernel: [369128.669453] audit: type=1326 audit(1594067860.484:14537): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=54 compat=0 ip=0x46fdba code=0x7ffc0000
Jul  6 15:37:40 my-machine kernel: [369128.669455] audit: type=1326 audit(1594067860.484:14538): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=202 compat=0 ip=0x455e53 code=0x7ffc0000
Jul  6 15:37:40 my-machine kernel: [369128.669456] audit: type=1326 audit(1594067860.484:14539): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=288 compat=0 ip=0x46fdba code=0x7ffc0000
Jul  6 15:37:40 my-machine kernel: [369128.669517] audit: type=1326 audit(1594067860.484:14540): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=0 compat=0 ip=0x46fd44 code=0x7ffc0000
Jul  6 15:37:40 my-machine kernel: [369128.669519] audit: type=1326 audit(1594067860.484:14541): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=270 compat=0 ip=0x4559b1 code=0x7ffc0000
Jul  6 15:38:40 my-machine kernel: [369188.671648] audit: type=1326 audit(1594067920.488:14559): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=270 compat=0 ip=0x4559b1 code=0x7ffc0000
Jul  6 15:38:40 my-machine kernel: [369188.671726] audit: type=1326 audit(1594067920.488:14560): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=202 compat=0 ip=0x455e53 code=0x7ffc0000
```

<!--
You can begin to understand the syscalls required by the `http-echo` process by
looking at the `syscall=` entry on each line. While these are unlikely to
encompass all syscalls it uses, it can serve as a basis for a seccomp profile
for this container.

Clean up that Pod and Service before moving to the next section:

```
kubectl delete pod/audit-pod
kubectl delete svc/audit-pod
```
-->
通过查看每一行上的 `syscall=` 条目，你可以开始了解 `http-echo` 进程所需的系统调用。
尽管这些不太可能包含它使用的所有系统调用，但它可以作为该容器的 seccomp 配置文件的基础。

开始下一节之前，请清理该 Pod 和 Service：

```
kubectl delete pod/audit-pod
kubectl delete svc/audit-pod
```

<!--
## Create Pod with Seccomp Profile that Causes Violation

For demonstration, apply a profile to the Pod that does not allow for any
syscalls.

Download the correct manifest for your Kubernetes version:
-->
## 使用导致违规的 Seccomp 配置文件创建 Pod

为了进行演示，请将不允许任何系统调用的配置文件应用于 Pod。

为你的 Kubernetes 版本下载正确的清单：

{{< tabs name="violation_pods" >}}
{{< tab name="v1.19 或更新版本（GA）" >}}
{{< codenew file="pods/security/seccomp/ga/violation-pod.yaml" >}}
{{< /tab >}}}
{{{< tab name="v1.19 之前版本（alpha）" >}}
{{< codenew file="pods/security/seccomp/alpha/violation-pod.yaml" >}}
{{< /tab >}}
{{< /tabs >}}
<br>

<!--
Create the Pod in the cluster:
-->
在集群中创建 Pod：

```
kubectl apply -f violation-pod.yaml
```

<!--
If you check the status of the Pod, you should see that it failed to start.
-->
如果你检查 Pod 的状态，你将会看到该 Pod 启动失败。

```
kubectl get pod/violation-pod
```

```
NAME            READY   STATUS             RESTARTS   AGE
violation-pod   0/1     CrashLoopBackOff   1          6s
```

<!--
As seen in the previous example, the `http-echo` process requires quite a few
syscalls. Here seccomp has been instructed to error on any syscall by setting
`"defaultAction": "SCMP_ACT_ERRNO"`. This is extremely secure, but removes the
ability to do anything meaningful. What you really want is to give workloads
only the privileges they need.

Clean up that Pod and Service before moving to the next section:
-->
如上例所示，`http-echo` 进程需要大量的系统调用。通过设置 `"defaultAction": "SCMP_ACT_ERRNO"`，
来指示 seccomp 在任何系统调用上均出错。这是非常安全的，但是会删除执行有意义的操作的能力。
你真正想要的只是给工作负载所需的特权。

开始下一节之前，请清理该 Pod 和 Service：

```
kubectl delete pod/violation-pod
kubectl delete svc/violation-pod
```

<!--
## Create Pod with Seccomp Profile that Only Allows Necessary Syscalls

If you take a look at the `fine-pod.json`, you will notice some of the syscalls
seen in the first example where the profile set `"defaultAction":
"SCMP_ACT_LOG"`. Now the profile is setting `"defaultAction": "SCMP_ACT_ERRNO"`,
but explicitly allowing a set of syscalls in the `"action": "SCMP_ACT_ALLOW"`
block. Ideally, the container will run successfully and you will see no messages
sent to `syslog`.

Download the correct manifest for your Kubernetes version:
-->
## 使用设置仅允许需要的系统调用的配置文件来创建 Pod

如果你看一下 `fine-pod.json` 文件，你会注意到在第一个示例中配置文件设置为 `"defaultAction": "SCMP_ACT_LOG"` 的一些系统调用。
现在，配置文件设置为 `"defaultAction": "SCMP_ACT_ERRNO"`，但是在 `"action": "SCMP_ACT_ALLOW"` 块中明确允许一组系统调用。
理想情况下，容器将成功运行，并且你将不会看到任何发送到 `syslog` 的消息。

为你的 Kubernetes 版本下载正确的清单：

{{< tabs name="fine_pods" >}}
{{< tab name="v1.19 或更新版本（GA）" >}}
{{< codenew file="pods/security/seccomp/ga/fine-pod.yaml" >}}
{{< /tab >}}}
{{{< tab name="v1.19 之前版本（alpha）" >}}
{{< codenew file="pods/security/seccomp/alpha/fine-pod.yaml" >}}
{{< /tab >}}
{{< /tabs >}}
<br>

<!--
Create the Pod in your cluster:
-->
在你的集群上创建Pod：

```
kubectl apply -f fine-pod.yaml
```

<!--
The Pod should start successfully.
-->
Pod 应该被成功启动。

```
kubectl get pod/fine-pod
```

```
NAME        READY   STATUS    RESTARTS   AGE
fine-pod   1/1     Running   0          30s
```

<!--
Open up a new terminal window and `tail` the output for calls from `http-echo`:
-->
打开一个新的终端窗口，使用 `tail` 命令查看来自 `http-echo` 的调用的输出：

```
tail -f /var/log/syslog | grep 'http-echo'
```

<!--
Expose the Pod with a NodePort Service:
-->
使用 NodePort 服务为该 Pod 开一个端口：

```
kubectl expose pod/fine-pod --type NodePort --port 5678
```

<!--
Check what port the Service has been assigned on the node:
-->
检查服务在该节点被分配了什么端口：

```
kubectl get svc/fine-pod
```

```
NAME        TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
fine-pod    NodePort   10.111.36.142   <none>        5678:32373/TCP   72s
```

<!--
`curl` the endpoint from inside the kind control plane container:
-->
使用 `curl` 命令从 kind 控制面板容器内部请求这个端点：

```
docker exec -it 6a96207fed4b curl localhost:32373
```

```
just made some syscalls!
```

<!--
You should see no output in the `syslog` because the profile allowed all
necessary syscalls and specified that an error should occur if one outside of
the list is invoked. This is an ideal situation from a security perspective, but
required some effort in analyzing the program. It would be nice if there was a
simple way to get closer to this security without requiring as much effort.

Clean up that Pod and Service before moving to the next section:
-->
你会看到 `syslog` 中没有任何输出，因为这个配置文件允许了所有需要的系统调用，
并指定如果有发生列表之外的系统调用将发生错误。从安全角度来看，这是理想的情况，
但是在分析程序时需要多付出一些努力。如果有一种简单的方法无需花费太多精力就能更接近此安全性，那就太好了。

开始下一节之前，请清理该 Pod 和 Service：

```
kubectl delete pod/fine-pod
kubectl delete svc/fine-pod
```

<!--
## Create Pod that uses the Container Runtime Default Seccomp Profile

Most container runtimes provide a sane set of default syscalls that are allowed
or not. The defaults can easily be applied in Kubernetes by using the
`runtime/default` annotation or setting the seccomp type in the security context
of a pod or container to `RuntimeDefault`.

Download the correct manifest for your Kubernetes version:
-->
## 使用容器运行时默认的 Seccomp 配置文件创建 Pod

大多数容器运行时都提供一组允许或不允许的默认系统调用。通过使用 `runtime/default` 注释
或将 Pod 或容器的安全上下文中的 seccomp 类型设置为 `RuntimeDefault`，可以轻松地在 Kubernetes 中应用默认值。

为你的 Kubernetes 版本下载正确的清单：

{{< tabs name="default_pods" >}}
{{< tab name="v1.19 或更新版本（GA）" >}}
{{< codenew file="pods/security/seccomp/ga/default-pod.yaml" >}}
{{< /tab >}}}
{{{< tab name="v1.19 之前版本（alpha）" >}}
{{< codenew file="pods/security/seccomp/alpha/default-pod.yaml" >}}
{{< /tab >}}
{{< /tabs >}}
<br>

<!--
The default seccomp profile should provide adequate access for most workloads.
-->
默认的 seccomp 配置文件应该为大多数工作负载提供足够的权限。

## {{% heading "whatsnext" %}}

<!--
Additional resources:

* [A Seccomp Overview](https://lwn.net/Articles/656307/)
* [Seccomp Security Profiles for Docker](https://docs.docker.com/engine/security/seccomp/)
-->
额外的资源：

* [Seccomp 概要](https://lwn.net/Articles/656307/)
* [Seccomp 在 Docker 中的安全配置](https://docs.docker.com/engine/security/seccomp/)