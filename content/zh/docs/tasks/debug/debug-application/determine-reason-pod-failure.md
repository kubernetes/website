---
title: 确定POD失败原因
content_type: 任务
---

<!-- overview -->

这个页面展示了如何写和读容器终止的消息


终止消息为容器提供了一种写入的方式关于致命事件的信息很容易被仪表板等工具检索和监控软件展示出来。在大多数情况下，你的信息把终止消息也写进去一般
通用[Kubernetes 日志](/docs/concepts/cluster-administration/logging/).

在你开始之前：

您需要有一个Kubernetes集群，必须将kubectl命令行工具配置为与集群通信。建议在至少有两个不作为控制平面主机节点的集群上运行本教程。如果你还没有集群，你可以使用[minikube](https://minikube.sigs.k8s.io/docs/tutorials/multi_node/)创建一个集群，或者你可以使用下面其中之一Kubernetes场地:

[Katacoda](https://www.katacoda.com/courses/kubernetes/playground)


[Play with Kubernetes](http://labs.play-with-k8s.com/)


如果需要检查版本，输入kubectl version。




<!-- steps -->

## Writing and reading a termination message

在本练习中，您将创建一个运行一个容器的Pod。当容器启动时配置文件指定一个运行命令。



{{< codenew file="debug/termination.yaml" >}}



1. 基于以上YAML配置文件创建一个Pod

        kubectl apply -f https://k8s.io/examples/debug/termination.yaml

    在YAML文件的command和args字段中，您可以看到容器休眠了10秒，然后将“Sleep expired”写入/dev/terminate-log文件中。在容器写入“Sleep expired”消息后，它将终止。

    

2. 显示Pod信息::

        kubectl get pod termination-demo

    重复上述命令，直到Pod不再运行。

1. 显示Pod的详细信息:

        kubectl get pod termination-demo --output=yaml

    输出包括“Sleep expired”消息:

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

1. 使用Go template过滤输出，使其包含只有终止消息:

        kubectl get pod termination-demo -o go-template="{{range .status.containerStatuses}}{{.lastState.terminated.message}}{{end}}"

如果你正在运行一个多容器的POD，你可以使用一个Go template来包含容器的名称。通过这样做，你可以发现哪些容器失败了:

```shell
kubectl get pod multi-container-pod -o go-template='{{range .status.containerStatuses}}{{printf "%s:\n%s\n\n" .name .lastState.terminated.message}}{{end}}'
```

## 自定义终止消息

Kubernetes从终止消息文件中检索终止消息在容器的'terminationMessagePath '字段中指定，
它有一个默认值“/ dev/termination-log”。 通过定制这个字段，您可以告诉Kubernetes使用不同的文件。Kubernetes使用指定文件中的内容来
填充容器成功和失败的状态消息。

终止消息是简短的最终状态，例如明确的失败消息。
kubelet截断超过4096字节的消息. 每个容器所有消息的总长度
限制在12KiB。 默认终止消息路径为 `/dev/termination-log`.
无法在Pod启动后设置终止消息路径。

在下面的例子中，为Kubernetes检索，容器将终止消息写到 /tmp/my-log :

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: msg-path-demo
spec:
  containers:
  - name: msg-path-demo-container
    image: debian
    terminationMessagePath: "/tmp/my-log"
```

此外，用户可以进一步定制容器的' terminationMessagePolicy '字段。此字段默认为“File”，表示终止
消息只能从终止消息文件中检索。如果终止消息文件使用容器日志输出的最后一块为空，并且容器退出时出现错，你可以通过设置'terminationMessagePolicy'到'FallbackToLogsOnError'告诉Kubernetes。日志输出仅限于2048字节或80行，取较小的值。




## {{% heading "whatsnext" %}}


* 参见 [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core).' 中的terminationMessagePath '字段
* 更多参考 [retrieving logs](/docs/concepts/cluster-administration/logging/).
* 更多参考[Go templates](https://golang.org/pkg/text/template/).





