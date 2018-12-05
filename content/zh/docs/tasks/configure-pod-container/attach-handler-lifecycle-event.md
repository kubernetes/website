---
title: 为容器生命周期事件添加处理程序
content_template: templates/task
weight: 140
---
<!--
{{% capture overview %}}

This page shows how to attach handlers to Container lifecycle events. Kubernetes supports
the postStart and preStop events. Kubernetes sends the postStart event immediately
after a Container is started, and it sends the preStop event immediately before the
Container is terminated.

{{% /capture %}}
-->

{{% capture overview %}}

本页面展示了如何将容器生命周期事件绑定到处理程序上。Kubernetes 支持 postStart 和 preStop 事件。Kubernetes 在启动容器之后会立即发送 postStart 事件
，在容器终止之前会立即发送 preStop 事件。

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

<!--
## Define postStart and preStop handlers

In this exercise, you create a Pod that has one Container. The Container has handlers
for the postStart and preStop events.

Here is the configuration file for the Pod:
-->

## 定义 postStart 和 preStop 处理程序

在本练习中，您将创建一个具有一个容器的 Pod。该容器包含用于处理 postStart 和 preStop 事件的程序。

这是 Pod 的配置文件：

{{< codenew file="pods/lifecycle-events.yaml" >}}

<!--
In the configuration file, you can see that the postStart command writes a `message`
file to the Container's `/usr/share` directory. The preStop command shuts down
nginx gracefully. This is helpful if the Container is being terminated because of a failure.
-->
在配置文件中，您可以看到 postStart 命令写入 `message` 文件到容器的的 `/usr/share` 目录。preStop 命令优雅地关闭了 nginx 。如果容器因故障而终止，这就会非常有用。

<!--
Create the Pod:

    kubectl create -f https://k8s.io/examples/pods/lifecycle-events.yaml
-->
创建 Pod:

    kubectl create -f https://k8s.io/examples/pods/lifecycle-events.yaml

<!--
Verify that the Container in the Pod is running:

    kubectl get pod lifecycle-demo
-->
验证 Pod 里的容器处于运行状态:

    kubectl get pod lifecycle-demo

<!--
Get a shell into the Container running in your Pod:

    kubectl exec -it lifecycle-demo -- /bin/bash
-->

获取一个访问 Pod 中运行容器的 shell:

    kubectl exec -it lifecycle-demo -- /bin/bash

<!--
In your shell, verify that the `postStart` handler created the `message` file:

    root@lifecycle-demo:/# cat /usr/share/message
-->
在 shell 中，验证 `postStart` 处理程序是否创建了 `message` 文件:

    root@lifecycle-demo:/# cat /usr/share/message
<!---
The output shows the text written by the postStart handler:

    Hello from the postStart handler
-->
输出显示 postStart 处理程序写入的文本:

    Hello from the postStart handler

{{% /capture %}}

{{% capture discussion %}}

<!--
## Discussion

Kubernetes sends the postStart event immediately after the Container is created.
There is no guarantee, however, that the postStart handler is called before
the Container's entrypoint is called. The postStart handler runs asynchronously
relative to the Container's code, but Kubernetes' management of the container
blocks until the postStart handler completes. The Container's status is not
set to RUNNING until the postStart handler completes.
-->

## 讨论

Kubernetes 在创建容器后立即发送 postStart 事件。但是，不能保证 postStart 处理程序
在容器的 entrypoint 调用之前被调用。相对于容器的代码，postStart 处理程序以异步方式运行，但 Kubernetes 对容器的管理
会阻塞直到 postStart 处理程序完成。容器的状态直到 postStart 处理程序完成后才会设置为 RUNNING 。

<!--
Kubernetes sends the preStop event immediately before the Container is terminated.
Kubernetes' management of the Container blocks until the preStop handler completes,
unless the Pod's grace period expires. For more details, see
[Termination of Pods](/docs/user-guide/pods/#termination-of-pods).
-->
Kubernetes 在容器终止之前立即发送 preStop 事件。
Kubernetes 对容器的管理一直阻塞直到 preStop 处理程序完成， 除非 Pod 的宽限期过期。有关详细信息，请参阅
[Pods 的终止](/docs/user-guide/pods/#termination-of-pods) 。

{{< note >}}
<!--
Kubernetes only sends the preStop event when a Pod is *terminated*.
This means that the preStop hook is not invoked when the Pod is *completed*. 
This limitation is tracked in [issue #55087](https://github.com/kubernetes/kubernetes/issues/55807).
-->
Kubernetes 仅在 Pod 是 *terminated* 时发送 preStop 事件。这意味着当 Pod 是 *completed* 状态时，preStop 钩子程序不会被触发。
这个限制被记录在 [issue #55087](https://github.com/kubernetes/kubernetes/issues/55807) 中。
{{< /note >}}

{{% /capture %}}


{{% capture whatsnext %}}

<!--
* Learn more about [Container lifecycle hooks](/docs/concepts/containers/container-lifecycle-hooks/).
* Learn more about the [lifecycle of a Pod](/docs/concepts/workloads/pods/pod-lifecycle/).
-->

* 进一步了解 [容器生命周期钩子](/docs/concepts/containers/container-lifecycle-hooks/).
* 进一步了解 [Pod 的生命周期](/docs/concepts/workloads/pods/pod-lifecycle/).

<!--
### Reference

* [Lifecycle](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#lifecycle-v1-core)
* [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* See `terminationGracePeriodSeconds` in [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
-->

### 参考

* [Lifecycle](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#lifecycle-v1-core)
* [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* 查看 [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core) 文档中关于 `terminationGracePeriodSeconds` 的说明

{{% /capture %}}
