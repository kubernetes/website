---
title: 临时容器
content_type: concept
weight: 80
---

<!--
title: Ephemeral Containers
content_type: concept
weight: 80
-->

<!-- overview -->

{{< feature-state state="alpha" for_k8s_version="v1.16" >}}

<!--
This page provides an overview of ephemeral containers: a special type of container
that runs temporarily in an existing {{< glossary_tooltip term_id="pod" >}} to
accomplish user-initiated actions such as troubleshooting. You use ephemeral
containers to inspect services rather than to build applications.
-->
本页面概述了临时容器：一种特殊的容器，该容器在现有 {{< glossary_tooltip text="Pod" term_id="pod" >}}
中临时运行，以便完成用户发起的操作，例如故障排查。
你会使用临时容器来检查服务，而不是用它来构建应用程序。

<!--
Ephemeral containers are in early alpha state and are not suitable for production
clusters. You should expect the feature not to work in some situations, such as
when targeting the namespaces of a container. In accordance with the [Kubernetes
Deprecation Policy](/docs/reference/using-api/deprecation-policy/), this alpha
feature could change significantly in the future or be removed entirely.
-->
{{< warning >}}
临时容器处于早期的 alpha 阶段，不适用于生产环境集群。
应该预料到临时容器在某些情况下不起作用，例如在定位容器的命名空间时。
根据 [Kubernetes 弃用政策](/zh/docs/reference/using-api/deprecation-policy/)，
此 alpha 功能将来可能发生重大变化或被完全删除。
{{< /warning >}}

<!-- body -->

<!--
## Understanding ephemeral containers

{{< glossary_tooltip text="Pods" term_id="pod" >}} are the fundamental building
block of Kubernetes applications. Since Pods are intended to be disposable and
replaceable, you cannot add a container to a Pod once it has been created.
Instead, you usually delete and replace Pods in a controlled fashion using
{{< glossary_tooltip text="deployments" term_id="deployment" >}}.
-->
## 了解临时容器

{{< glossary_tooltip text="Pod" term_id="pod" >}} 是 Kubernetes 应用程序的基本构建块。
由于 Pod 是一次性且可替换的，因此一旦 Pod 创建，就无法将容器加入到 Pod 中。
取而代之的是，通常使用 {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
以受控的方式来删除并替换 Pod。

<!--
Sometimes it's necessary to inspect the state of an existing Pod, however, for
example to troubleshoot a hard-to-reproduce bug. In these cases you can run
an ephemeral container in an existing Pod to inspect its state and run
arbitrary commands.
-->
有时有必要检查现有 Pod 的状态。例如，对于难以复现的故障进行排查。
在这些场景中，可以在现有 Pod 中运行临时容器来检查其状态并运行任意命令。

<!--
### What is an ephemeral container?

Ephemeral containers differ from other containers in that they lack guarantees
for resources or execution, and they will never be automatically restarted, so
they are not appropriate for building applications.  Ephemeral containers are
described using the same `ContainerSpec` as regular containers, but many fields
are incompatible and disallowed for ephemeral containers.
-->
### 什么是临时容器？

临时容器与其他容器的不同之处在于，它们缺少对资源或执行的保证，并且永远不会自动重启，
因此不适用于构建应用程序。
临时容器使用与常规容器相同的 `ContainerSpec` 节来描述，但许多字段是不兼容和不允许的。

<!--
- Ephemeral containers may not have ports, so fields such as `ports`,
  `livenessProbe`, `readinessProbe` are disallowed.
- Pod resource allocations are immutable, so setting `resources` is disallowed.
- For a complete list of allowed fields, see the [EphemeralContainer reference
  documentation](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ephemeralcontainer-v1-core).
-->
- 临时容器没有端口配置，因此像 `ports`，`livenessProbe`，`readinessProbe`
  这样的字段是不允许的。

- Pod 资源分配是不可变的，因此 `resources` 配置是不允许的。

- 有关允许字段的完整列表，请参见
  [EphemeralContainer 参考文档](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ephemeralcontainer-v1-core)。

<!--
Ephemeral containers are created using a special `ephemeralcontainers` handler
in the API rather than by adding them directly to `pod.spec`, so it's not
possible to add an ephemeral container using `kubectl edit`.
-->
临时容器是使用 API 中的一种特殊的 `ephemeralcontainers` 处理器进行创建的，
而不是直接添加到 `pod.spec` 段，因此无法使用 `kubectl edit` 来添加一个临时容器。

<!--
Like regular containers, you may not change or remove an ephemeral container
after you have added it to a Pod.
-->
与常规容器一样，将临时容器添加到 Pod 后，将不能更改或删除临时容器。

<!--
## Uses for ephemeral containers

Ephemeral containers are useful for interactive troubleshooting when `kubectl
exec` is insufficient because a container has crashed or a container image
doesn't include debugging utilities.
-->
## 临时容器的用途

当由于容器崩溃或容器镜像不包含调试工具而导致 `kubectl exec` 无用时，
临时容器对于交互式故障排查很有用。

<!--
In particular, [distroless images](https://github.com/GoogleContainerTools/distroless)
enable you to deploy minimal container images that reduce attack surface
and exposure to bugs and vulnerabilities. Since distroless images do not include a
shell or any debugging utilities, it's difficult to troubleshoot distroless
images using `kubectl exec` alone.
-->
尤其是，[distroless 镜像](https://github.com/GoogleContainerTools/distroless)
允许用户部署最小的容器镜像，从而减少攻击面并减少故障和漏洞的暴露。
由于 distroless 镜像不包含 Shell 或任何的调试工具，因此很难单独使用
`kubectl exec` 命令进行故障排查。

<!--
When using ephemeral containers, it's helpful to enable [process namespace
sharing](/docs/tasks/configure-pod-container/share-process-namespace/) so
you can view processes in other containers.
-->
使用临时容器时，启用[进程名字空间共享](/zh/docs/tasks/configure-pod-container/share-process-namespace/)
很有帮助，可以查看其他容器中的进程。

<!--
### Examples

The examples in this section require the `EphemeralContainers` [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/) to be
enabled, and Kubernetes client and server version v1.16 or later.
-->
### 示例

{{< note >}}
本节中的示例要求启用 `EphemeralContainers`
[特性门控](/zh/docs/reference/command-line-tools-reference/feature-gates/)，
并且 kubernetes 客户端和服务端版本要求为 v1.16 或更高版本。
{{< /note >}}

<!--
The examples in this section demonstrate how ephemeral containers appear in
the API. You would normally use `kubectl debug` or another `kubectl`
[plugin](/docs/tasks/extend-kubectl/kubectl-plugins/) to automate these steps
rather than invoking the API directly.
-->
本节中的示例演示了临时容器如何出现在 API 中。
通常，你会使用 `kubectl debug` 或别的 `kubectl`
[插件](/zh/docs/tasks/extend-kubectl/kubectl-plugins/) 自动执行这些步骤，而不是直接调用API。

<!--
Ephemeral containers are created using the `ephemeralcontainers` subresource
of Pod, which can be demonstrated using `kubectl -raw`. First describe
the ephemeral container to add as an `EphemeralContainers` list:
-->
临时容器是使用 Pod 的 `ephemeralcontainers` 子资源创建的，可以使用
`kubectl --raw` 命令进行显示。
首先描述临时容器被添加为一个 `EphemeralContainers` 列表：

```json
{
    "apiVersion": "v1",
    "kind": "EphemeralContainers",
    "metadata": {
        "name": "example-pod"
    },
    "ephemeralContainers": [{
        "command": [
            "sh"
        ],
        "image": "busybox",
        "imagePullPolicy": "IfNotPresent",
        "name": "debugger",
        "stdin": true,
        "tty": true,
        "terminationMessagePolicy": "File"
    }]
}
```

<!--
To update the ephemeral containers of the already running `example-pod`:
-->
使用如下命令更新已运行的临时容器 `example-pod`：

```shell
kubectl replace --raw /api/v1/namespaces/default/pods/example-pod/ephemeralcontainers  -f ec.json
```

<!--
This will return the new list of ephemeral containers:
-->
这将返回临时容器的新列表：

```json
{
   "kind":"EphemeralContainers",
   "apiVersion":"v1",
   "metadata":{
      "name":"example-pod",
      "namespace":"default",
      "selfLink":"/api/v1/namespaces/default/pods/example-pod/ephemeralcontainers",
      "uid":"a14a6d9b-62f2-4119-9d8e-e2ed6bc3a47c",
      "resourceVersion":"15886",
      "creationTimestamp":"2019-08-29T06:41:42Z"
   },
   "ephemeralContainers":[
      {
         "name":"debugger",
         "image":"busybox",
         "command":[
            "sh"
         ],
         "resources":{

         },
         "terminationMessagePolicy":"File",
         "imagePullPolicy":"IfNotPresent",
         "stdin":true,
         "tty":true
      }
   ]
}
```

<!--
You can view the state of the newly created ephemeral container using `kubectl describe`:
-->
可以使用以下命令查看新创建的临时容器的状态：

```shell
kubectl describe pod example-pod
```

输出为：

```
...
Ephemeral Containers:
  debugger:
    Container ID:  docker://cf81908f149e7e9213d3c3644eda55c72efaff67652a2685c1146f0ce151e80f
    Image:         busybox
    Image ID:      docker-pullable://busybox@sha256:9f1003c480699be56815db0f8146ad2e22efea85129b5b5983d0e0fb52d9ab70
    Port:          <none>
    Host Port:     <none>
    Command:
      sh
    State:          Running
      Started:      Thu, 29 Aug 2019 06:42:21 +0000
    Ready:          False
    Restart Count:  0
    Environment:    <none>
    Mounts:         <none>
...
```

<!--
You can attach to the new ephemeral container using `kubectl attach`:
-->
可以使用以下命令连接到新的临时容器：

```shell
kubectl attach -it example-pod -c debugger
```

<!--
If process namespace sharing is enabled, you can see processes from all the containers in that Pod.
For example, after attaching, you run `ps` in the debugger container:
-->
如果启用了进程命名空间共享，则可以查看该 Pod 所有容器中的进程。
例如，运行上述 `attach` 操作后，在调试器容器中运行 `ps` 操作：

```shell
# 在 "debugger" 临时容器内中运行此 shell 命令
ps auxww
```

运行命令后，输出类似于：

```
PID   USER     TIME  COMMAND
    1 root      0:00 /pause
    6 root      0:00 nginx: master process nginx -g daemon off;
   11 101       0:00 nginx: worker process
   12 101       0:00 nginx: worker process
   13 101       0:00 nginx: worker process
   14 101       0:00 nginx: worker process
   15 101       0:00 nginx: worker process
   16 101       0:00 nginx: worker process
   17 101       0:00 nginx: worker process
   18 101       0:00 nginx: worker process
   19 root      0:00 /pause
   24 root      0:00 sh
   29 root      0:00 ps auxww
```

