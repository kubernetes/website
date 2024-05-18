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
## 创建 Pod 时设置命令及参数   {#define-a-command-and-arguments-when-you-create-a-pod}

创建 Pod 时，可以为其下的容器设置启动时要执行的命令及其参数。如果要设置命令，就填写在配置文件的
`command` 字段下，如果要设置命令的参数，就填写在配置文件的 `args` 字段下。
一旦 Pod 创建完成，该命令及其参数就无法再进行更改了。

<!--
The command and arguments that you define in the configuration file
override the default command and arguments provided by the container image.
If you define args, but do not define a command, the default command is used
with your new arguments.
-->
如果在配置文件中设置了容器启动时要执行的命令及其参数，那么容器镜像中自带的命令与参数将会被覆盖而不再执行。
如果配置文件中只是设置了参数，却没有设置其对应的命令，那么容器镜像中自带的命令会使用该新参数作为其执行时的参数。

{{< note >}}
<!--
The `command` field corresponds to `ENTRYPOINT`, and the `args` field corresponds to `CMD` in some container runtimes.
-->
`command` 字段对应于 `ENTRYPOINT`，而 `args` 字段对应于某些容器运行时的 `CMD`。
{{< /note >}}

<!--
In this exercise, you create a Pod that runs one container. The configuration
file for the Pod defines a command and two arguments:
-->
本示例中，将创建一个只包含单个容器的 Pod。在此 Pod 配置文件中设置了一个命令与两个参数：

{{% code_sample file="pods/commands.yaml" %}}

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
2. 获取正在运行的 Pod：

   ```shell
   kubectl get pods
   ```

   <!--
   The output shows that the container that ran in the command-demo Pod has
   completed.
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
   The output shows the values of the HOSTNAME and KUBERNETES_PORT environment
   variables:
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
## 使用环境变量来设置参数   {#use-env-var-to-define-arguments}

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
[ConfigMap](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/) 与
[Secret](/zh-cn/docs/concepts/configuration/secret/)。

{{< note >}}
<!--
The environment variable appears in parentheses, `"$(VAR)"`. This is
required for the variable to be expanded in the `command` or `args` field.
-->
环境变量需要加上括号，类似于 `"$(VAR)"`。这是在 `command` 或 `args` 字段使用变量的格式要求。
{{< /note >}}

<!--
## Run a command in a shell

In some cases, you need your command to run in a shell. For example, your
command might consist of several commands piped together, or it might be a shell
script. To run your command in a shell, wrap it like this:
-->
## 在 Shell 来执行命令   {#run-a-command-in-a-shell}

有时候，你需要在 Shell 脚本中运行命令。
例如，你要执行的命令可能由多个命令组合而成，或者它就是一个 Shell 脚本。
这时，就可以通过如下方式在 Shell 中执行命令：

```shell
command: ["/bin/sh"]
args: ["-c", "while true; do echo hello; sleep 10;done"]
```

## {{% heading "whatsnext" %}}

<!--
* Learn more about [configuring pods and containers](/docs/tasks/).
* Learn more about [running commands in a container](/docs/tasks/debug/debug-application/get-shell-running-container/).
* See [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core).
-->
* 进一步了解[配置 Pod 和容器](/zh-cn/docs/tasks/)
* 进一步了解[在容器中运行命令](/zh-cn/docs/tasks/debug/debug-application/get-shell-running-container/)
* 参阅 [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
  API 资源
