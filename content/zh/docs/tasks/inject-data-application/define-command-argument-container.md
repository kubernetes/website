---
title: 为容器设置启动时要执行的命令和参数
content_type: task
weight: 10
---
<!--
title: Define a Command and Arguments for a Container
content_type: task
weight: 10
-->

<!-- overview -->

<!--
This page shows how to define commands and arguments when you run a container
in a {{< glossary_tooltip term_id="pod" >}}.
-->
本页将展示如何为 {{< glossary_tooltip text="Pod" term_id="pod" >}} 
中容器设置启动时要执行的命令及其参数。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Define a command and arguments when you create a Pod

When you create a Pod, you can define a command and arguments for the
containers that run in the Pod. To define a command, include the `command`
field in the configuration file. To define arguments for the command, include
the `args` field in the configuration file. The command and arguments that
you define cannot be changed after the Pod is created.
-->
## 创建 Pod 时设置命令及参数

创建 Pod 时，可以为其下的容器设置启动时要执行的命令及其参数。如果要设置命令，就填写在配置文件的 `command` 字段下，如果要设置命令的参数，就填写在配置文件的 `args` 字段下。一旦 Pod 创建完成，该命令及其参数就无法再进行更改了。

<!--
The command and arguments that you define in the configuration file
override the default command and arguments provided by the container image.
If you define args, but do not define a command, the default command is used
with your new arguments.
-->
如果在配置文件中设置了容器启动时要执行的命令及其参数，那么容器镜像中自带的命令与参数将会被覆盖而不再执行。如果配置文件中只是设置了参数，却没有设置其对应的命令，那么容器镜像中自带的命令会使用该新参数作为其执行时的参数。

<!--
The `command` field corresponds to `entrypoint` in some container
runtimes. Refer to the [Notes](#notes) below.
-->
{{< note >}}
在有些容器运行时中，`command` 字段对应 `entrypoint`，请参阅下面的
[说明事项](#notes)。
{{< /note >}}

<!--
In this exercise, you create a Pod that runs one container. The configuration
file for the Pod defines a command and two arguments:
-->
本示例中，将创建一个只包含单个容器的 Pod。在 Pod 配置文件中设置了一个命令与两个参数：

{{< codenew file="pods/commands.yaml" >}}

<!--
1. Create a Pod based on the YAML configuration file:
-->
1. 基于 YAML 文件创建一个 Pod：

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/commands.yaml
   ```

<!--
1. List the running Pods:
-->
2. 获取正在运行的 Pods：
	
   ```shell
   kubectl get pods
   ```

   <!--
   The output shows that the container that ran in the command-demo Pod has completed.
   -->
   查询结果显示在 command-demo 这个 Pod 下运行的容器已经启动完成。

<!--
1. To see the output of the command that ran in the container, view the logs
from the Pod:
-->
3. 如果要获取容器启动时执行命令的输出结果，可以通过 Pod 的日志进行查看：

   ```shell
   kubectl logs command-demo
   ```

   <!--
   The output shows the values of the HOSTNAME and KUBERNETES_PORT environment variables:
   -->
   日志中显示了 HOSTNAME 与 KUBERNETES_PORT 这两个环境变量的值：
   
   ```
   command-demo
   tcp://10.3.240.1:443
   ```
	
<!--
## Use environment variables to define arguments

In the preceding example, you defined the arguments directly by
providing strings. As an alternative to providing strings directly,
you can define arguments by using environment variables:
-->
## 使用环境变量来设置参数

在上面的示例中，我们直接将一串字符作为命令的参数。除此之外，我们还可以将环境变量作为命令的参数。

```yaml
env:
- name: MESSAGE
  value: "hello world"
command: ["/bin/echo"]
args: ["$(MESSAGE)"]
```

<!--
This means you can define an argument for a Pod using any of
the techniques available for defining environment variables, including
[ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/)
and
[Secrets](/docs/concepts/configuration/secret/).
-->
这意味着你可以将那些用来设置环境变量的方法应用于设置命令的参数，其中包括了
[ConfigMaps](/zh/docs/tasks/configure-pod-container/configure-pod-configmap/) 与
[Secrets](/zh/docs/concepts/configuration/secret/)。

<!--
The environment variable appears in parentheses, `"$(VAR)"`. This is
required for the variable to be expanded in the `command` or `args` field.
-->
{{< note >}}
环境变量需要加上括号，类似于 `"$(VAR)"`。这是在 `command` 或 `args` 字段使用变量的格式要求。
{{< /note >}}

<!--
## Run a command in a shell

In some cases, you need your command to run in a shell. For example, your
command might consist of several commands piped together, or it might be a shell
script. To run your command in a shell, wrap it like this:
-->
## 在 Shell 来执行命令

有时候，你需要在 Shell 脚本中运行命令。
例如，你要执行的命令可能由多个命令组合而成，或者它就是一个 Shell 脚本。
这时，就可以通过如下方式在 Shell 中执行命令：

```shell
command: ["/bin/sh"]
args: ["-c", "while true; do echo hello; sleep 10;done"]
```

<!--
## Notes

This table summarizes the field names used by Docker and Kubernetes.

|              Description               |    Docker field name   | Kubernetes field name |
|----------------------------------------|------------------------|---------------------|
|  The command run by the container      |   Entrypoint           |      command        |
|  The arguments passed to the command   |   Cmd                  |      args           |
-->
## 说明事项  {#notes}

下表给出了 Docker 与 Kubernetes 中对应的字段名称。

|       描述         |   Docker 字段名称  | Kubernetes 字段名称    |
|--------------------|--------------------|-----------------------|
| 容器执行的命令     |   Entrypoint       |      command          |
| 传给命令的参数     |   Cmd              |      args             |

<!--
When you override the default Entrypoint and Cmd, these rules apply:

* If you do not supply `command` or `args` for a Container, the defaults defined
in the Docker image are used.

* If you supply a `command` but no `args` for a Container, only the supplied
`command` is used. The default EntryPoint and the default Cmd defined in the Docker
image are ignored.

* If you supply only `args` for a Container, the default Entrypoint defined in
the Docker image is run with the `args` that you supplied.

* If you supply a `command` and `args`, the default Entrypoint and the default
Cmd defined in the Docker image are ignored. Your `command` is run with your
`args`.
-->
如果要覆盖默认的 Entrypoint 与 Cmd，需要遵循如下规则：

* 如果在容器配置中没有设置 `command` 或者 `args`，那么将使用 Docker 镜像自带的命令及其参数。

* 如果在容器配置中只设置了 `command` 但是没有设置 `args`，那么容器启动时只会执行该命令，
  Docker 镜像中自带的命令及其参数会被忽略。

* 如果在容器配置中只设置了 `args`，那么 Docker 镜像中自带的命令会使用该新参数作为其执行时的参数。

* 如果在容器配置中同时设置了 `command` 与 `args`，那么 Docker 镜像中自带的命令及其参数会被忽略。
  容器启动时只会执行配置中设置的命令，并使用配置中设置的参数作为命令的参数。

<!--
Here are some examples:

| Image Entrypoint   |    Image Cmd     | Container command   |  Container args    |    Command run   |
|--------------------|------------------|---------------------|--------------------|------------------|
|     `[/ep-1]`      |   `[foo bar]`    |   &lt;not set&gt;   |   &lt;not set&gt;  | `[ep-1 foo bar]` |
|     `[/ep-1]`      |   `[foo bar]`    |      `[/ep-2]`      |   &lt;not set&gt;  |     `[ep-2]`     |
|     `[/ep-1]`      |   `[foo bar]`    |   &lt;not set&gt;   |     `[zoo boo]`    | `[ep-1 zoo boo]` |
|     `[/ep-1]`      |   `[foo bar]`    |   `[/ep-2]`         |     `[zoo boo]`    | `[ep-2 zoo boo]` |
-->
下面是一些例子：

|   镜像 Entrypoint  |     镜像 Cmd     |     容器 command    |     容器 args      |     命令执行      |
|--------------------|------------------|---------------------|--------------------|------------------|
|     `[/ep-1]`      |   `[foo bar]`    |   &lt;not set&gt;   |   &lt;not set&gt;  | `[ep-1 foo bar]` |
|     `[/ep-1]`      |   `[foo bar]`    |      `[/ep-2]`      |   &lt;not set&gt;  |     `[ep-2]`     |
|     `[/ep-1]`      |   `[foo bar]`    |   &lt;not set&gt;   |     `[zoo boo]`    | `[ep-1 zoo boo]` |
|     `[/ep-1]`      |   `[foo bar]`    |   `[/ep-2]`         |     `[zoo boo]`    | `[ep-2 zoo boo]` |


## {{% heading "whatsnext" %}}

<!--
* Learn more about [configuring pods and containers](/docs/tasks/).
* Learn more about [running commands in a container](/docs/tasks/debug-application-cluster/get-shell-running-container/).
* See [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core).
-->
* 进一步了解[配置 Pod 和容器](/zh/docs/tasks/)
* 进一步了解[在容器中运行命令](/zh/docs/tasks/debug-application-cluster/get-shell-running-container/)
* 参阅 [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
  API 资源

