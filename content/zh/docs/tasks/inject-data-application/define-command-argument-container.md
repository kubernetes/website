---
title: 为容器设置启动时要执行的命令及其入参
content_template: templates/task
---

{{% capture overview %}}

本页将展示如何为Kubernetes Pod下的容器设置启动时要执行的命令及其入参。

{{% /capture %}}


{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}


{{% capture steps %}}

## 创建Pod时为其下的容器设置启动时要执行的命令及其入参

创建Pod时，可以为其下的容器设置启动时要执行的命令及其入参。如果要设置命令，就
填写在配置文件的`command`字段下，如果要设置命令的入参，就填写在配置文件的`args
`字段下。一旦Pod创建完成，该命令及其入参就无法再进行更改了。

如果在配置文件中设置了容器启动时要执行的命令及其入参，那么容器镜像中自带的命令
与入参将会被覆盖而不再执行。如果配置文件中只是设置了入参，却没有设置其对应的命
令，那么容器镜像中自带的命令会使用该新入参作为其执行时的入参。

本示例中，将创建一个只包含单个容器的Pod。在Pod配置文件中设置了一个命令与两个入参：

{{< code file="commands.yaml" >}}

1. 基于YAML文件创建一个Pod：

    ```shell
    kubectl create -f https://k8s.io/docs/tasks/inject-data-application/commands.yaml
    ```

2. List the running Pods:

	获取正在运行的 pod

	```shell
	kubectl get pods
	```

    查询结果显示在command-demo这个Pod下运行的容器已经启动完成

3. 如果要获取容器启动时执行命令的输出结果，可以通过Pod的日志进行查看

    ```shell
    kubectl logs command-demo
    ```

    日志中显示了HOSTNAME 与KUBERNETES_PORT 这两个环境变量的值：
    
    ```
    command-demo
    tcp://10.3.240.1:443
    ```
	
## 使用环境变量来设置入参

在上面的示例中，我们直接将一串字符作为命令的入参。除此之外，我们还可以
将环境变量作为命令的入参。

```yaml
env:
- name: MESSAGE
  value: "hello world"
command: ["/bin/echo"]
args: ["$(MESSAGE)"]
```

这样一来，我们就可以将那些用来设置环境变量的方法应用于设置命令的入参，其
中包括了[ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/)
与
[Secrets](/docs/concepts/configuration/secret/).

{{< note >}}
**注意：** 环境变量需要加上括号，类似于`"$(VAR)"`。这是在`command` 
或 `args`字段使用变量的格式要求。
{{< /note >}}

## 通过shell来执行命令

有时候，需要通过shell来执行命令。 例如，命令可能由多个命令组合而成，抑或包含
在一个shell脚本中。这时，就可以通过如下方式在shell中执行命令：

```shell
command: ["/bin/sh"]
args: ["-c", "while true; do echo hello; sleep 10;done"]
```

## 注意

下表给出了Docker 与 Kubernetes中对应的字段名称。

|              Description               |    Docker field name   | Kubernetes field name |
|----------------------------------------|------------------------|-----------------------|
|  The command run by the container      |   Entrypoint           |      command          |
|  The arguments passed to the command   |   Cmd                  |      args             |

如果要覆盖默认的Entrypoint 与 Cmd，需要遵循如下规则：

* 如果在容器配置中没有设置`command` 或者 `args`，那么将使用Docker镜像自带的命
令及其入参。

* 如果在容器配置中只设置了`command`但是没有设置`args`,那么容器启动时只会执行该
命令，Docker镜像中自带的命令及其入参会被忽略。

* 如果在容器配置中只设置了`args`,那么Docker镜像中自带的命令会使用该新入参作为
其执行时的入参。

* 如果在容器配置中同时设置了`command` 与 `args`，那么Docker镜像中自带的命令及
其入参会被忽略。容器启动时只会执行配置中设置的命令，并使用配置中设置的入参作为
命令的入参。

下表涵盖了各类设置场景：

| Image Entrypoint   |    Image Cmd     | Container command   |  Container args    |    Command run   |
|--------------------|------------------|---------------------|--------------------|------------------|
|     `[/ep-1]`      |   `[foo bar]`    |   &lt;not set&gt;   |   &lt;not set&gt;  | `[ep-1 foo bar]` |
|     `[/ep-1]`      |   `[foo bar]`    |      `[/ep-2]`      |   &lt;not set&gt;  |     `[ep-2]`     |
|     `[/ep-1]`      |   `[foo bar]`    |   &lt;not set&gt;   |     `[zoo boo]`    | `[ep-1 zoo boo]` |
|     `[/ep-1]`      |   `[foo bar]`    |   `[/ep-2]`         |     `[zoo boo]`    | `[ep-2 zoo boo]` |


{{% /capture %}}

{{% capture whatsnext %}}

* 获取更多资讯可参考 [containers and commands](/docs/user-guide/containers/).
* 获取更多资讯可参考 [configuring pods and containers](/docs/tasks/).
* 获取更多资讯可参考 [running commands in a container](/docs/tasks/debug-application-cluster/get-shell-running-container/).
* 参考 [Container](/docs/api-reference/{{< param "version" >}}/#container-v1-core).

{{% /capture %}}



