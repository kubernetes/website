---
title: 确定 Pod 失败的原因
cn-approvers:
- chentao1596
cn-reviewers:
- zjj2wry
---

{% capture overview %}

<!--
This page shows how to write and read a Container
termination message.
-->
本页展示了怎么样读写容器的终止信息。

<!--
Termination messages provide a way for containers to write
information about fatal events to a location where it can
be easily retrieved and surfaced by tools like dashboards
and monitoring software. In most cases, information that you
put in a termination message should also be written to
the general
[Kubernetes logs](/docs/concepts/cluster-administration/logging/).
-->
终止信息为容器提供了一种把致命事件的信息写入指定位置的方法，该位置的内容可以很方便的通过 dashboards、监控软件等工具检索和展示。大部分情况下，终止信息的内容应该同时写入 [Kubernetes 日志](/docs/concepts/cluster-administration/logging/)。

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture steps %}

<!--
## Writing and reading a termination message
-->
## 写入和读取终止消息

<!--
In this exercise, you create a Pod that runs one container.
The configuration file specifies a command that runs when
the container starts.
-->
本次练习中，您将创建一个运行单个容器的 Pod。Pod 配置文件指定了容器启动时运行的命令。

{% include code.html language="yaml" file="termination.yaml" ghlink="/docs/tasks/debug-application-cluster/termination.yaml" %}

<!--
1. Create a Pod based on the YAML configuration file:
-->
1. 基于 YAML 配置文件创建一个 Pod

       kubectl create -f https://k8s.io/docs/tasks/debug-application-cluster/termination.yaml

	<!--
    In the YAML file, in the `cmd` and `args` fields, you can see that the
    container sleeps for 10 seconds and then writes "Sleep expired" to
    the `/dev/termination-log` file. After the container writes
    the "Sleep expired" message, it terminates.
	-->
	查看 YAML 文件的 `cmd` 和 `args` 字段，您可以看到，容器将运行 10 秒钟，然后把 "Sleep expired" 写入文件 `/dev/termination-log`。容器在写完 "Sleep expired" 后终止。

<!--
1. Display information about the Pod:
-->
1. 显示 Pod 的信息：

       kubectl get pod termination-demo

	<!--
    Repeat the preceding command until the Pod is no longer running.
	-->
	重复上面的命令，直到 Pod 不再处于运行状态为止。

<!--
1. Display detailed information about the Pod:
-->
1. 显示 Pod 的详细信息：

       kubectl get pod --output=yaml

	<!--
    The output includes the "Sleep expired" message:
	-->
	输出的内容包含了 "Sleep expired" 信息：

        apiVersion: v1
        kind: Pod
        ...
            lastState:
              terminated:
                containerID: ...
                exitCode: 0
                finishedAt: ...
                message: |
                  Sleep expired
                ...

<!--
1. Use a Go template to filter the output so that it includes
only the termination message:
-->
1. 使用 Go 模板过滤输出的内容，以便只包含终止信息：

```
{% raw %}  kubectl get pod termination-demo -o go-template="{{range .status.containerStatuses}}{{.lastState.terminated.message}}{{end}}"{% endraw %}
```

<!--
## Setting the termination log file
-->
## 设置终止日志文件

<!--
By default Kubernetes retrieves termination messages from
`/dev/termination-log`. To change this to a different file,
specify a `terminationMessagePath` field for your Container.
-->
默认情况下，Kubernetes 从 `/dev/termination-log` 文件检索终止信息。如果希望从其它文件检索，您需要在容器中指定 `terminationMessagePath` 字段。

<!--
For example, suppose your Container writes termination messages to
`/tmp/my-log`, and you want Kubernetes to retrieve those messages.
Set `terminationMessagePath` as shown here:
-->
例如，假如您容器的终止信息写到了 `/tmp/my-log`，而您希望 Kubernetes 能够检索到这些信息。可以按照如下方式设置 `terminationMessagePath`：

    apiVersion: v1
    kind: Pod
    metadata:
      name: msg-path-demo
    spec:
      containers:
      - name: msg-path-demo-container
        image: debian
        terminationMessagePath: "/tmp/my-log"

{% endcapture %}

{% capture whatsnext %}

<!--
* See the `terminationMessagePath` field in
  [Container](/docs/api-reference/{{page.version}}/#container-v1-core).
* Learn about [retrieving logs](/docs/concepts/cluster-administration/logging/).
* Learn about [Go templates](https://golang.org/pkg/text/template/).
-->
* 查看 [容器](/docs/api-reference/{{page.version}}/#container-v1-core) 中的 `terminationMessagePath` 字段。
* 了解 [检索日志](/docs/concepts/cluster-administration/logging/)。
* 了解 [Go 模板](https://golang.org/pkg/text/template/)。

{% endcapture %}


{% include templates/task.md %}
