---
title: 在容器的生命周期中设置钩子(handler)
content_template: templates/task
weight: 140
---
<!--
---
title: Attach Handlers to Container Lifecycle Events
content_template: templates/task
weight: 140
---
-->

{{% capture overview %}}

<!--
This page shows how to attach handlers to Container lifecycle events. Kubernetes supports
the postStart and preStop events. Kubernetes sends the postStart event immediately
after a Container is started, and it sends the preStop event immediately before the
Container is terminated.
-->
这个页面将演示如何在容器的声明周期中设置钩子。Kubernetes 支持设置启动后钩子(postStart)
和关闭前钩子(preStop)。当一个容器启动后，Kubernetes 将立即发送 postStart 事件，而当它关
闭前，Kubernetes 将发送一个 preStop 事件。

{{% /capture %}}


{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}


{{% capture steps %}}

<!--
## Define postStart and preStop handlers
-->
## 定义 postStart 和 preStop 钩子函数

<!--
In this exercise, you create a Pod that has one Container. The Container has handlers
for the postStart and preStop events.
-->
在本练习中，你将创建一个带有某个容器的 Pod，该容器有对应的钩子函数响应 postStart 和 preStop 事件

<!--
Here is the configuration file for the Pod:
-->
下面是对应 Pod 的配置文件

{{< codenew file="pods/lifecycle-events.yaml" >}}

<!--
In the configuration file, you can see that the postStart command writes a `message`
file to the Container's `/usr/share` directory. The preStop command shuts down
nginx gracefully. This is helpful if the Container is being terminated because of a failure.
-->
在上述配置文件中，你可以看到 postStart 命令写了相应的信息到容器的 `/usr/share` 目录下的
`message` 文件中，而 preStop 优雅的退出了 nginx。当程序发声错误时，上述命令对于容器的退
出将十分有用。

<!--
Create the Pod:
-->
创建 Pod：

    kubectl apply -f https://k8s.io/examples/pods/lifecycle-events.yaml

<!--
Verify that the Container in the Pod is running:
-->
验证 Pod 中的容器已经运行：

    kubectl get pod lifecycle-demo

<!--
Get a shell into the Container running in your Pod:
-->
使用 shell 连接到你的 Pod 里的容器：

    kubectl exec -it lifecycle-demo -- /bin/bash

<!--
In your shell, verify that the `postStart` handler created the `message` file:
-->
在 shell 中，验证 `postStart` 钩子创建了 `message` 文件：

    root@lifecycle-demo:/# cat /usr/share/message

<!--
The output shows the text written by the postStart handler:
-->
命令行将输出 `postStart` 钩子写入的内容

    Hello from the postStart handler

{{% /capture %}}



{{% capture discussion %}}

<!--
## Discussion
-->
## 讨论

<!--
Kubernetes sends the postStart event immediately after the Container is created.
There is no guarantee, however, that the postStart handler is called before
the Container's entrypoint is called. The postStart handler runs asynchronously
relative to the Container's code, but Kubernetes' management of the container
blocks until the postStart handler completes. The Container's status is not
set to RUNNING until the postStart handler completes.
-->
Kubernetes 在容器创建后立即发送 postStart 事件。然而，postStart 钩子函数不保证运行在容器
的控件挂载点(entrypoint)之前。postStart 钩子函数与容器的代码是异步化执行的，但 Kubernetes
在 postStart 钩子执行完毕前将一直阻塞容器。直到 postStart 钩子函数执行完毕，容器的状态才会变成
运行中(RUNNING)

<!--
Kubernetes sends the preStop event immediately before the Container is terminated.
Kubernetes' management of the Container blocks until the preStop handler completes,
unless the Pod's grace period expires. For more details, see
[Termination of Pods](/docs/user-guide/pods/#termination-of-pods).
-->
Kubernetes 在容器结束前立即发送 preStop 事件。除非 Pod 优雅阶段超时，Kubernetes 在
preStop 钩子执行完毕前将一直阻塞容器。更多的细节可以在
[Pods 的结束](/docs/user-guide/pods/#termination-of-pods)中了解。

<!--
{{< note >}}
Kubernetes only sends the preStop event when a Pod is *terminated*.
This means that the preStop hook is not invoked when the Pod is *completed*. 
This limitation is tracked in [issue #55087](https://github.com/kubernetes/kubernetes/issues/55807).
{{< /note >}}
-->
{{< note >}}
Kubernetes 只有在 Pod *结束*的时候才会发送 preStop 事件，这意味着在 Pod *完成* 时
preStop 的钩子将不会被触发。这个限制在
[issue #55087](https://github.com/kubernetes/kubernetes/issues/55807) 中被追踪。
{{< /note >}}

{{% /capture %}}


{{% capture whatsnext %}}

* 了解更多关于 [容器生命周期回调](/docs/concepts/containers/container-lifecycle-hooks/).
* 了解更多关于 [一个 Pod 的生命周期](/docs/concepts/workloads/pods/pod-lifecycle/).
<!--
* Learn more about [Container lifecycle hooks](/docs/concepts/containers/container-lifecycle-hooks/).
* Learn more about the [lifecycle of a Pod](/docs/concepts/workloads/pods/pod-lifecycle/).
-->


### 参考

* [声明周期](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#lifecycle-v1-core)
* [容器](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* 可以在 [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core) 了解更多`terminationGracePeriodSeconds`
<!--
### Reference

* [Lifecycle](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#lifecycle-v1-core)
* [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* See `terminationGracePeriodSeconds` in [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
-->

{{% /capture %}}


