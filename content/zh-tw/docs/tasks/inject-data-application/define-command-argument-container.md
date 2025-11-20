---
title: 爲容器設置啓動時要執行的命令和參數
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
本頁將展示如何爲 {{< glossary_tooltip text="Pod" term_id="pod" >}}
中容器設置啓動時要執行的命令及其參數。

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
## 創建 Pod 時設置命令及參數   {#define-a-command-and-arguments-when-you-create-a-pod}

創建 Pod 時，可以爲其下的容器設置啓動時要執行的命令及其參數。如果要設置命令，就填寫在設定檔案的
`command` 字段下，如果要設置命令的參數，就填寫在設定檔案的 `args` 字段下。
一旦 Pod 創建完成，該命令及其參數就無法再進行更改了。

<!--
The command and arguments that you define in the configuration file
override the default command and arguments provided by the container image.
If you define args, but do not define a command, the default command is used
with your new arguments.
-->
如果在設定檔案中設置了容器啓動時要執行的命令及其參數，那麼容器映像檔中自帶的命令與參數將會被覆蓋而不再執行。
如果設定檔案中只是設置了參數，卻沒有設置其對應的命令，那麼容器映像檔中自帶的命令會使用該新參數作爲其執行時的參數。

{{< note >}}
<!--
The `command` field corresponds to `ENTRYPOINT`, and the `args` field corresponds to `CMD` in some container runtimes.
-->
`command` 字段對應於 `ENTRYPOINT`，而 `args` 字段對應於某些容器運行時的 `CMD`。
{{< /note >}}

<!--
In this exercise, you create a Pod that runs one container. The configuration
file for the Pod defines a command and two arguments:
-->
本示例中，將創建一個只包含單個容器的 Pod。在此 Pod 設定檔案中設置了一個命令與兩個參數：

{{% code_sample file="pods/commands.yaml" %}}

<!--
1. Create a Pod based on the YAML configuration file:
-->
1. 基於 YAML 檔案創建一個 Pod：

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/commands.yaml
   ```

<!--
1. List the running Pods:
-->
2. 獲取正在運行的 Pod：

   ```shell
   kubectl get pods
   ```

   <!--
   The output shows that the container that ran in the command-demo Pod has
   completed.
   -->
   查詢結果顯示在 command-demo 這個 Pod 下運行的容器已經啓動完成。

<!--
1. To see the output of the command that ran in the container, view the logs
from the Pod:
-->
3. 如果要獲取容器啓動時執行命令的輸出結果，可以通過 Pod 的日誌進行查看：

   ```shell
   kubectl logs command-demo
   ```

   <!--
   The output shows the values of the HOSTNAME and KUBERNETES_PORT environment
   variables:
   -->
   日誌中顯示了 HOSTNAME 與 KUBERNETES_PORT 這兩個環境變量的值：

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
## 使用環境變量來設置參數   {#use-env-var-to-define-arguments}

在上面的示例中，我們直接將一串字符作爲命令的參數。除此之外，我們還可以將環境變量作爲命令的參數。

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
這意味着你可以將那些用來設置環境變量的方法應用於設置命令的參數，其中包括了
[ConfigMap](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/) 與
[Secret](/zh-cn/docs/concepts/configuration/secret/)。

{{< note >}}
<!--
The environment variable appears in parentheses, `"$(VAR)"`. This is
required for the variable to be expanded in the `command` or `args` field.
-->
環境變量需要加上括號，類似於 `"$(VAR)"`。這是在 `command` 或 `args` 字段使用變量的格式要求。
{{< /note >}}

<!--
## Run a command in a shell

In some cases, you need your command to run in a shell. For example, your
command might consist of several commands piped together, or it might be a shell
script. To run your command in a shell, wrap it like this:
-->
## 在 Shell 來執行命令   {#run-a-command-in-a-shell}

有時候，你需要在 Shell 腳本中運行命令。
例如，你要執行的命令可能由多個命令組合而成，或者它就是一個 Shell 腳本。
這時，就可以通過如下方式在 Shell 中執行命令：

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
* 進一步瞭解[設定 Pod 和容器](/zh-cn/docs/tasks/)
* 進一步瞭解[在容器中運行命令](/zh-cn/docs/tasks/debug/debug-application/get-shell-running-container/)
* 參閱 [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
  API 資源
