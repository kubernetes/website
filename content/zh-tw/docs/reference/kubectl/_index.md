---
title: 命令行工具 (kubectl)
content_type: reference
weight: 110
no_list: true
card:
  name: reference
  title: kubectl 命令行工具
  weight: 20
---
<!--
title: Command line tool (kubectl)
content_type: reference
weight: 110
no_list: true
card:
  name: reference
  title: kubectl command line tool
  weight: 20
-->
<!-- overview -->

{{< glossary_definition prepend="Kubernetes 提供" term_id="kubectl" length="short" >}}

<!--
This tool is named `kubectl`.
-->
這個工具叫做 `kubectl`。

<!--
For configuration, `kubectl` looks for a file named `config` in the `$HOME/.kube` directory.
You can specify other [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
files by setting the `KUBECONFIG` environment variable or by setting the
[`--kubeconfig`](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) flag.
-->

針對配置信息，`kubectl` 在 `$HOME/.kube` 目錄中查找一個名爲 `config` 的配置文件。
你可以通過設置 `KUBECONFIG` 環境變量或設置
[`--kubeconfig`](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)

參數來指定其它 [kubeconfig](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/) 文件。

<!--
This overview covers `kubectl` syntax, describes the command operations, and provides common examples.
For details about each command, including all the supported flags and subcommands, see the
[kubectl](/docs/reference/kubectl/generated/kubectl/)  reference documentation.
-->
本文概述了 `kubectl` 語法和命令操作描述，並提供了常見的示例。
有關每個命令的詳細信息，包括所有受支持的參數和子命令，
請參閱 [kubectl](/zh-cn/docs/reference/kubectl/generated/kubectl/) 參考文檔。

<!--
For installation instructions, see [Installing kubectl](/docs/tasks/tools/#kubectl);
for a quick guide, see the [cheat sheet](/docs/reference/kubectl/quick-reference/).
If you're used to using the `docker` command-line tool,
[`kubectl` for Docker Users](/docs/reference/kubectl/docker-cli-to-kubectl/)
explains some equivalent commands for Kubernetes.
-->
有關安裝說明，請參見[安裝 kubectl](/zh-cn/docs/tasks/tools/#kubectl)；
如需快速指南，請參見[備忘單](/zh-cn/docs/reference/kubectl/quick-reference/)。
如果你更習慣使用 `docker` 命令行工具，
[Docker 用戶的 `kubectl`](/zh-cn/docs/reference/kubectl/docker-cli-to-kubectl/)
介紹了一些 Kubernetes 的等價命令。

<!-- body -->
<!--
## Syntax

Use the following syntax to run `kubectl` commands from your terminal window:
-->
## 語法   {#syntax}

使用以下語法從終端窗口運行 `kubectl` 命令：

```shell
kubectl [command] [TYPE] [NAME] [flags]
```

<!--
where `command`, `TYPE`, `NAME`, and `flags` are:
-->
其中 `command`、`TYPE`、`NAME` 和 `flags` 分別是：

<!--
* `command`: Specifies the operation that you want to perform on one or more resources,
  for example `create`, `get`, `describe`, `delete`.

* `TYPE`: Specifies the [resource type](#resource-types). Resource types are case-insensitive and
  you can specify the singular, plural, or abbreviated forms.
  For example, the following commands produce the same output:
-->
* `command`：指定要對一個或多個資源執行的操作，例如 `create`、`get`、`describe`、`delete`。

* `TYPE`：指定[資源類型](#resource-types)。資源類型不區分大小寫，
  可以指定單數、複數或縮寫形式。例如，以下命令輸出相同的結果：

  ```shell
  kubectl get pod pod1
  kubectl get pods pod1
  kubectl get po pod1
  ```

<!--
* `NAME`: Specifies the name of the resource. Names are case-sensitive. If the name is omitted,
  details for all resources are displayed, for example `kubectl get pods`.

  When performing an operation on multiple resources, you can specify each resource by type
  and name or specify one or more files:
-->
* `NAME`：指定資源的名稱。名稱區分大小寫。
  如果省略名稱，則顯示所有資源的詳細信息。例如：`kubectl get pods`。

  在對多個資源執行操作時，你可以按類型和名稱指定每個資源，或指定一個或多個文件：

<!--
  * To specify resources by type and name:

    * To group resources if they are all the same type:  `TYPE1 name1 name2 name<#>`.<br/>
      Example: `kubectl get pod example-pod1 example-pod2`

    * To specify multiple resource types individually:  `TYPE1/name1 TYPE1/name2 TYPE2/name3 TYPE<#>/name<#>`.<br/>
      Example: `kubectl get pod/example-pod1 replicationcontroller/example-rc1`

  * To specify resources with one or more files:  `-f file1 -f file2 -f file<#>`

    * [Use YAML rather than JSON](/docs/concepts/configuration/overview/#general-configuration-tips)
      since YAML tends to be more user-friendly, especially for configuration files.<br/>
      Example: `kubectl get -f ./pod.yaml`
-->
 * 要按類型和名稱指定資源：

  * 要對所有類型相同的資源進行分組，請執行以下操作：`TYPE1 name1 name2 name<#>`。<br/>
    例子：`kubectl get pod example-pod1 example-pod2`

  * 分別指定多個資源類型：`TYPE1/name1 TYPE1/name2 TYPE2/name3 TYPE<#>/name<#>`。<br/>
    例子：`kubectl get pod/example-pod1 replicationcontroller/example-rc1`

 * 用一個或多個文件指定資源：`-f file1 -f file2 -f file<#>`

  * [使用 YAML 而不是 JSON](/zh-cn/docs/concepts/configuration/overview/#general-configuration-tips)，
    因爲 YAML 對用戶更友好, 特別是對於配置文件。<br/>
    例子：`kubectl get -f ./pod.yaml`

<!--
* `flags`: Specifies optional flags. For example, you can use the `-s` or `--server` flags
  to specify the address and port of the Kubernetes API server.<br/>
-->
* `flags`： 指定可選的參數。例如，可以使用 `-s` 或 `--server` 參數指定
  Kubernetes API 服務器的地址和端口。

{{< caution >}}
<!--
Flags that you specify from the command line override default values and any corresponding environment variables.
-->
從命令行指定的參數會覆蓋默認值和任何相應的環境變量。
{{< /caution >}}

<!--
If you need help, run `kubectl help` from the terminal window.
-->
如果你需要幫助，在終端窗口中運行 `kubectl help`。

<!--
## In-cluster authentication and namespace overrides
-->
## 集羣內身份驗證和命名空間覆蓋   {#in-cluster-authentication-and-namespace-overrides}

<!--
By default `kubectl` will first determine if it is running within a pod, and thus in a cluster.
It starts by checking for the `KUBERNETES_SERVICE_HOST` and `KUBERNETES_SERVICE_PORT` environment
variables and the existence of a service account token file at `/var/run/secrets/kubernetes.io/serviceaccount/token`.
If all three are found in-cluster authentication is assumed.
-->
默認情況下，`kubectl` 命令首先確定它是否在 Pod 中運行，從而被視爲在集羣中運行。
它首先檢查 `KUBERNETES_SERVICE_HOST` 和 `KUBERNETES_SERVICE_PORT` 環境變量以及
`/var/run/secrets/kubernetes.io/serviceaccount/token` 中是否存在服務帳戶令牌文件。
如果三個條件都被滿足，則假定在集羣內進行身份驗證。

<!--
To maintain backwards compatibility, if the `POD_NAMESPACE` environment variable is set
during in-cluster authentication it will override the default namespace from the
service account token. Any manifests or tools relying on namespace defaulting will be affected by this.
-->
爲保持向後兼容性，如果在集羣內身份驗證期間設置了 `POD_NAMESPACE`
環境變量，它將覆蓋服務帳戶令牌中的默認命名空間。
任何依賴默認命名空間的清單或工具都會受到影響。

<!--
**`POD_NAMESPACE` environment variable**
-->
**`POD_NAMESPACE` 環境變量**

<!--
If the `POD_NAMESPACE` environment variable is set, cli operations on namespaced resources
will default to the variable value. For example, if the variable is set to `seattle`,
`kubectl get pods` would return pods in the `seattle` namespace. This is because pods are
a namespaced resource, and no namespace was provided in the command. Review the output
of `kubectl api-resources` to determine if a resource is namespaced. 
-->
如果設置了 `POD_NAMESPACE` 環境變量，對命名空間資源的 CLI 操作對象將使用該變量值作爲默認值。
例如，如果該變量設置爲 `seattle`，`kubectl get pods` 將返回 `seattle` 命名空間中的 Pod。
這是因爲 Pod 是一個命名空間資源，且命令中沒有提供命名空間。
請查看 `kubectl api-resources` 的輸出，以確定某個資源是否是命名空間資源。

<!--
Explicit use of `--namespace <value>` overrides this behavior.
-->
直接使用 `--namespace <value>` 會覆蓋此行爲。

<!--
**How kubectl handles ServiceAccount tokens**
-->
**kubectl 如何處理 ServiceAccount 令牌**

<!--
If:
* there is Kubernetes service account token file mounted at
  `/var/run/secrets/kubernetes.io/serviceaccount/token`, and
* the `KUBERNETES_SERVICE_HOST` environment variable is set, and
* the `KUBERNETES_SERVICE_PORT` environment variable is set, and
* you don't explicitly specify a namespace on the kubectl command line
-->
假設：
* 有 Kubernetes 服務帳戶令牌文件掛載在
  `/var/run/secrets/kubernetes.io/serviceaccount/token` 上，並且
* 設置了 `KUBERNETES_SERVICE_HOST` 環境變量，並且
* 設置了 `KUBERNETES_SERVICE_PORT` 環境變量，並且
* 你沒有在 kubectl 命令行上明確指定命名空間。

<!--
then kubectl assumes it is running in your cluster. The kubectl tool looks up the
namespace of that ServiceAccount (this is the same as the namespace of the Pod)
and acts against that namespace. This is different from what happens outside of a
cluster; when kubectl runs outside a cluster and you don't specify a namespace,
the kubectl command acts against the namespace set for the current context in your
client configuration. To change the default namespace for your kubectl you can use the
following command:
-->
然後 kubectl 假定它正在你的集羣中運行。
kubectl 工具查找該 ServiceAccount 的命名空間
（該命名空間與 Pod 的命名空間相同）並針對該命名空間進行操作。
這與集羣外運行的情況不同；
當 kubectl 在集羣外運行並且你沒有指定命名空間時，
kubectl 命令會針對你在客戶端配置中爲當前上下文設置的命名空間進行操作。
要爲你的 kubectl 更改默認的命名空間，你可以使用以下命令：

```shell
kubectl config set-context --current --namespace=<namespace-name>
```

<!--
## Operations
-->
## 操作   {#operations}

<!--
The following table includes short descriptions and the general syntax for all of the `kubectl` operations:
-->
下表包含所有 `kubectl` 操作的簡短描述和普通語法：

<!--
Operation       | Syntax    |       Description
-------------------- | -------------------- | --------------------
`alpha`    | `kubectl alpha SUBCOMMAND [flags]` | List the available commands that correspond to alpha features, which are not enabled in Kubernetes clusters by default.
`annotate`    | <code>kubectl annotate (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--overwrite] [--all] [--resource-version=version] [flags]</code> | Add or update the annotations of one or more resources.
`api-resources`    | `kubectl api-resources [flags]` | List the API resources that are available.
`api-versions`    | `kubectl api-versions [flags]` | List the API versions that are available.
`apply`            | `kubectl apply -f FILENAME [flags]`| Apply a configuration change to a resource from a file or stdin.
`attach`        | `kubectl attach POD -c CONTAINER [-i] [-t] [flags]` | Attach to a running container either to view the output stream or interact with the container (stdin).
`auth`    | `kubectl auth [flags] [options]` | Inspect authorization.
`autoscale`    | <code>kubectl autoscale (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) [--min=MINPODS] --max=MAXPODS [--cpu-percent=CPU] [flags]</code> | Automatically scale the set of pods that are managed by a replication controller.
`certificate`    | `kubectl certificate SUBCOMMAND [options]` | Modify certificate resources.
`cluster-info`    | `kubectl cluster-info [flags]` | Display endpoint information about the master and services in the cluster.
`completion`    | `kubectl completion SHELL [options]` | Output shell completion code for the specified shell (bash or zsh).
`config`        | `kubectl config SUBCOMMAND [flags]` | Modifies kubeconfig files. See the individual subcommands for details.
`convert`    | `kubectl convert -f FILENAME [options]` | Convert config files between different API versions. Both YAML and JSON formats are accepted. Note - requires `kubectl-convert` plugin to be installed.
`cordon`    | `kubectl cordon NODE [options]` | Mark node as unschedulable.
`cp`    | `kubectl cp <file-spec-src> <file-spec-dest> [options]` | Copy files and directories to and from containers.
`create`        | `kubectl create -f FILENAME [flags]` | Create one or more resources from a file or stdin.
`delete`        | <code>kubectl delete (-f FILENAME &#124; TYPE [NAME &#124; /NAME &#124; -l label &#124; --all]) [flags]</code> | Delete resources either from a file, stdin, or specifying label selectors, names, resource selectors, or resources.
`describe`    | <code>kubectl describe (-f FILENAME &#124; TYPE [NAME_PREFIX &#124; /NAME &#124; -l label]) [flags]</code> | Display the detailed state of one or more resources.
`diff`        | `kubectl diff -f FILENAME [flags]`| Diff file or stdin against live configuration.
`drain`    | `kubectl drain NODE [options]` | Drain node in preparation for maintenance.
`edit`        | <code>kubectl edit (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) [flags]</code> | Edit and update the definition of one or more resources on the server by using the default editor.
`events`      | `kubectl events` | List events
`exec`        | `kubectl exec POD [-c CONTAINER] [-i] [-t] [flags] [-- COMMAND [args...]]` | Execute a command against a container in a pod.
`explain`    | `kubectl explain TYPE [--recursive=false] [flags]` | Get documentation of various resources. For instance pods, nodes, services, etc.
`expose`        | <code>kubectl expose (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) [--port=port] [--protocol=TCP&#124;UDP] [--target-port=number-or-name] [--name=name] [--external-ip=external-ip-of-service] [--type=type] [flags]</code> | Expose a replication controller, service, or pod as a new Kubernetes service.
`get`        | <code>kubectl get (-f FILENAME &#124; TYPE [NAME &#124; /NAME &#124; -l label]) [--watch] [--sort-by=FIELD] [[-o &#124; --output]=OUTPUT_FORMAT] [flags]</code> | List one or more resources.
`kustomize`    | `kubectl kustomize <dir> [flags] [options]` | List a set of API resources generated from instructions in a kustomization.yaml file. The argument must be the path to the directory containing the file, or a git repository URL with a path suffix specifying same with respect to the repository root.
`label`        | <code>kubectl label (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--overwrite] [--all] [--resource-version=version] [flags]</code> | Add or update the labels of one or more resources.
`logs`        | `kubectl logs POD [-c CONTAINER] [--follow] [flags]` | Print the logs for a container in a pod.
`options`    | `kubectl options` | List of global command-line options, which apply to all commands.
`patch`        | <code>kubectl patch (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) --patch PATCH [flags]</code> | Update one or more fields of a resource by using the strategic merge patch process.
`plugin`    | `kubectl plugin [flags] [options]` | Provides utilities for interacting with plugins.
`port-forward`    | `kubectl port-forward POD [LOCAL_PORT:]REMOTE_PORT [...[LOCAL_PORT_N:]REMOTE_PORT_N] [flags]` | Forward one or more local ports to a pod.
`proxy`        | `kubectl proxy [--port=PORT] [--www=static-dir] [--www-prefix=prefix] [--api-prefix=prefix] [flags]` | Run a proxy to the Kubernetes API server.
`replace`        | `kubectl replace -f FILENAME` | Replace a resource from a file or stdin.
`rollout`    | `kubectl rollout SUBCOMMAND [options]` | Manage the rollout of a resource. Valid resource types include: deployments, daemonsets and statefulsets.
`run`        | <code>kubectl run NAME --image=image [--env="key=value"] [--port=port] [--dry-run=server&#124;client&#124;none] [--overrides=inline-json] [flags]</code> | Run a specified image on the cluster.
`scale`        | <code>kubectl scale (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) --replicas=COUNT [--resource-version=version] [--current-replicas=count] [flags]</code> | Update the size of the specified replication controller.
`set`    | `kubectl set SUBCOMMAND [options]` | Configure application resources.
`taint`    | `kubectl taint NODE NAME KEY_1=VAL_1:TAINT_EFFECT_1 ... KEY_N=VAL_N:TAINT_EFFECT_N [options]` | Update the taints on one or more nodes.
`top`    | <code>kubectl top (POD &#124; NODE) [flags] [options]</code> | Display Resource (CPU/Memory/Storage) usage of pod or node.
`uncordon`    | `kubectl uncordon NODE [options]` | Mark node as schedulable.
`version`        | `kubectl version [--client] [flags]` | Display the Kubernetes version running on the client and server.
`wait`    | <code>kubectl wait ([-f FILENAME] &#124; resource.group/resource.name &#124; resource.group [(-l label &#124; --all)]) [--for=delete&#124;--for condition=available] [options]</code> | Experimental: Wait for a specific condition on one or many resources.
-->
操作             | 語法      |       描述
-------------------- | -------------------- | --------------------
`alpha`    | `kubectl alpha SUBCOMMAND [flags]` | 列出與 Alpha 級別特性對應的可用命令，這些特性在 Kubernetes 集羣中默認情況下是不啓用的。
`annotate`    | <code>kubectl annotate (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--overwrite] [--all] [--resource-version=version] [flags]</code> | 添加或更新一個或多個資源的註解。
`api-resources`    | `kubectl api-resources [flags]` | 列出可用的 API 資源。
`api-versions`    | `kubectl api-versions [flags]` | 列出可用的 API 版本。
`apply`            | `kubectl apply -f FILENAME [flags]`| 從文件或 stdin 對資源應用配置更改。
`attach`        | `kubectl attach POD -c CONTAINER [-i] [-t] [flags]` | 掛接到正在運行的容器，查看輸出流或與容器（stdin）交互。
`auth`    | `kubectl auth [flags] [options]` | 檢查授權。
`autoscale`    | <code>kubectl autoscale (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) [--min=MINPODS] --max=MAXPODS [--cpu-percent=CPU] [flags]</code> | 自動擴縮由副本控制器管理的一組 pod。
`certificate`    | `kubectl certificate SUBCOMMAND [options]` | 修改證書資源。
`cluster-info`    | `kubectl cluster-info [flags]` | 顯示有關集羣中主服務器和服務的端口信息。
`completion`    | `kubectl completion SHELL [options]` | 爲指定的 Shell（Bash 或 Zsh）輸出 Shell 補齊代碼。
`config`        | `kubectl config SUBCOMMAND [flags]` | 修改 kubeconfig 文件。有關詳細信息，請參閱各個子命令。
`convert`    | `kubectl convert -f FILENAME [options]` | 在不同的 API 版本之間轉換配置文件。配置文件可以是 YAML 或 JSON 格式。注意 - 需要安裝 `kubectl-convert` 插件。
`cordon`    | `kubectl cordon NODE [options]` | 將節點標記爲不可調度。
`cp`    | `kubectl cp <file-spec-src> <file-spec-dest> [options]` | 從容器複製文件、目錄或將文件、目錄複製到容器。
`create`        | `kubectl create -f FILENAME [flags]` | 從文件或 stdin 創建一個或多個資源。
`delete`        |  <code>kubectl delete (-f FILENAME &#124; TYPE [NAME &#124; /NAME &#124; -l label &#124; --all]) [flags]</code> |  基於文件、標準輸入或通過指定標籤選擇器、名稱、資源選擇器或資源本身，刪除資源。
`describe`    | <code>kubectl describe (-f FILENAME &#124; TYPE [NAME_PREFIX &#124; /NAME &#124; -l label]) [flags]</code> | 顯示一個或多個資源的詳細狀態。
`diff`        | `kubectl diff -f FILENAME [flags]`| 在當前起作用的配置和文件或標準輸之間作對比（**BETA**）
`drain`    | `kubectl drain NODE [options]` | 騰空節點以準備維護。
`edit`        | <code>kubectl edit (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) [flags]</code> | 使用默認編輯器編輯和更新服務器上一個或多個資源的定義。
`events`      | `kubectl events` | 列舉事件。
`exec`        | `kubectl exec POD [-c CONTAINER] [-i] [-t] [flags] [-- COMMAND [args...]]` | 對 Pod 中的容器執行命令。
`explain`    | `kubectl explain TYPE [--recursive=false] [flags]` | 獲取多種資源的文檔。例如 Pod、Node、Service 等。
`expose`        | <code>kubectl expose (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) [--port=port] [--protocol=TCP&#124;UDP] [--target-port=number-or-name] [--name=name] [--external-ip=external-ip-of-service] [--type=type] [flags]</code> | 將副本控制器、Service 或 Pod 作爲新的 Kubernetes 服務暴露。
`get`        | <code>kubectl get (-f FILENAME &#124; TYPE [NAME &#124; /NAME &#124; -l label]) [--watch] [--sort-by=FIELD] [[-o &#124; --output]=OUTPUT_FORMAT] [flags]</code> | 列出一個或多個資源。
`kustomize`    | <code>kubectl kustomize <dir> [flags] [options]` </code> | 列出從 kustomization.yaml 文件中的指令生成的一組 API 資源。參數必須是包含文件的目錄的路徑，或者是 git 存儲庫 URL，其路徑後綴相對於存儲庫根目錄指定了相同的路徑。
`label`        | <code>kubectl label (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--overwrite] [--all] [--resource-version=version] [flags]</code> | 添加或更新一個或多個資源的標籤。
`logs`        | `kubectl logs POD [-c CONTAINER] [--follow] [flags]` |  打印 Pod 中容器的日誌。
`options`    | `kubectl options` | 全局命令行選項列表，這些選項適用於所有命令。
`patch`        | <code>kubectl patch (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) --patch PATCH [flags]</code> | 使用策略合併流程更新資源的一個或多個字段。
`plugin`    | `kubectl plugin [flags] [options]` | 提供用於與插件交互的實用程序。
`port-forward`    | `kubectl port-forward POD [LOCAL_PORT:]REMOTE_PORT [...[LOCAL_PORT_N:]REMOTE_PORT_N] [flags]` | 將一個或多個本地端口轉發到一個 Pod。
`proxy`        | `kubectl proxy [--port=PORT] [--www=static-dir] [--www-prefix=prefix] [--api-prefix=prefix] [flags]` | 運行訪問 Kubernetes API 服務器的代理。
`replace`        | `kubectl replace -f FILENAME` |  基於文件或標準輸入替換資源。
`rollout`    | `kubectl rollout SUBCOMMAND [options]` | 管理資源的上線。有效的資源類型包括：Deployment、 DaemonSet 和 StatefulSet。
`run`        | <code>kubectl run NAME --image=image [--env="key=value"] [--port=port] [--dry-run=server &#124; client &#124; none] [--overrides=inline-json] [flags]</code> | 在集羣上運行指定的鏡像。
`scale`        | <code>kubectl scale (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) --replicas=COUNT [--resource-version=version] [--current-replicas=count] [flags]</code> | 更新指定副本控制器的大小。
`set`    | `kubectl set SUBCOMMAND [options]` | 配置應用資源。
`taint`    | `kubectl taint NODE NAME KEY_1=VAL_1:TAINT_EFFECT_1 ... KEY_N=VAL_N:TAINT_EFFECT_N [options]` | 更新一個或多個節點上的污點。
`top`    | <code>kubectl top (POD &#124; NODE) [flags] [options]</code> | 顯示 Pod 或節點的資源（CPU/內存/存儲）使用情況。
`uncordon`    | `kubectl uncordon NODE [options]` | 將節點標記爲可調度。
`version`        | `kubectl version [--client] [flags]` | 顯示運行在客戶端和服務器上的 Kubernetes 版本。
`wait`    | <code>kubectl wait ([-f FILENAME] &#124; resource.group/resource.name &#124; resource.group [(-l label &#124; --all)]) [--for=delete&#124;--for condition=available] [options]</code> | 實驗特性：等待一種或多種資源的特定狀況。

<!--
To learn more about command operations, see the [kubectl](/docs/reference/kubectl/kubectl/) reference documentation.
-->
瞭解更多有關命令操作的信息，
請參閱 [kubectl](/zh-cn/docs/reference/kubectl/kubectl/) 參考文檔。

<!--
## Resource types
-->
## 資源類型   {#resource-types}

<!--
The following table includes a list of all the supported resource types and their abbreviated aliases.
-->
下表列出所有受支持的資源類型及其縮寫別名。

<!--
(This output can be retrieved from `kubectl api-resources`, and was accurate as of Kubernetes 1.25.0)
-->
(以下輸出可以通過 `kubectl api-resources` 獲取，內容以 Kubernetes 1.25.0 版本爲準。)

<!--
| NAME | SHORTNAMES | APIVERSION | NAMESPACED | KIND |
|---|---|---|---|---|
-->
| 資源名 | 縮寫名 | API 版本 | 按命名空間 | 資源類型 |
|---|---|---|---|---|
| `bindings` |  | v1 | true | Binding |
| `componentstatuses` | `cs` | v1 | false | ComponentStatus |
| `configmaps` | `cm` | v1 | true | ConfigMap |
| `endpoints` | `ep` | v1 | true | Endpoints |
| `events` | `ev` | v1 | true | Event |
| `limitranges` | `limits` | v1 | true | LimitRange |
| `namespaces` | `ns` | v1 | false | Namespace |
| `nodes` | `no` | v1 | false | Node |
| `persistentvolumeclaims` | `pvc` | v1 | true | PersistentVolumeClaim |
| `persistentvolumes` | `pv` | v1 | false | PersistentVolume |
| `pods` | `po` | v1 | true | Pod |
| `podtemplates` |  | v1 | true | PodTemplate |
| `replicationcontrollers` | `rc` | v1 | true | ReplicationController |
| `resourcequotas` | `quota` | v1 | true | ResourceQuota |
| `secrets` |  | v1 | true | Secret |
| `serviceaccounts` | `sa` | v1 | true | ServiceAccount |
| `services` | `svc` | v1 | true | Service |
| `mutatingwebhookconfigurations` |  | admissionregistration.k8s.io/v1 | false | MutatingWebhookConfiguration |
| `validatingwebhookconfigurations` |  | admissionregistration.k8s.io/v1 | false | ValidatingWebhookConfiguration |
| `customresourcedefinitions` | `crd,crds` | apiextensions.k8s.io/v1 | false | CustomResourceDefinition |
| `apiservices` |  | apiregistration.k8s.io/v1 | false | APIService |
| `controllerrevisions` |  | apps/v1 | true | ControllerRevision |
| `daemonsets` | `ds` | apps/v1 | true | DaemonSet |
| `deployments` | `deploy` | apps/v1 | true | Deployment |
| `replicasets` | `rs` | apps/v1 | true | ReplicaSet |
| `statefulsets` | `sts` | apps/v1 | true | StatefulSet |
| `tokenreviews` |  | authentication.k8s.io/v1 | false | TokenReview |
| `localsubjectaccessreviews` |  | authorization.k8s.io/v1 | true | LocalSubjectAccessReview |
| `selfsubjectaccessreviews` |  | authorization.k8s.io/v1 | false | SelfSubjectAccessReview |
| `selfsubjectrulesreviews` |  | authorization.k8s.io/v1 | false | SelfSubjectRulesReview |
| `subjectaccessreviews` |  | authorization.k8s.io/v1 | false | SubjectAccessReview |
| `horizontalpodautoscalers` | `hpa` | autoscaling/v2 | true | HorizontalPodAutoscaler |
| `cronjobs` | `cj` | batch/v1 | true | CronJob |
| `jobs` |  | batch/v1 | true | Job |
| `certificatesigningrequests` | `csr` | certificates.k8s.io/v1 | false | CertificateSigningRequest |
| `leases` |  | coordination.k8s.io/v1 | true | Lease |
| `endpointslices` |  | discovery.k8s.io/v1 | true | EndpointSlice |
| `events` | `ev` | events.k8s.io/v1 | true | Event |
| `flowschemas` |  | flowcontrol.apiserver.k8s.io/v1beta2 | false | FlowSchema |
| `prioritylevelconfigurations` |  | flowcontrol.apiserver.k8s.io/v1beta2 | false | PriorityLevelConfiguration |
| `ingressclasses` |  | networking.k8s.io/v1 | false | IngressClass |
| `ingresses` | `ing` | networking.k8s.io/v1 | true | Ingress |
| `networkpolicies` | `netpol` | networking.k8s.io/v1 | true | NetworkPolicy |
| `runtimeclasses` |  | node.k8s.io/v1 | false | RuntimeClass |
| `poddisruptionbudgets` | `pdb` | policy/v1 | true | PodDisruptionBudget |
| `podsecuritypolicies` | `psp` | policy/v1beta1 | false | PodSecurityPolicy |
| `clusterrolebindings` |  | rbac.authorization.k8s.io/v1 | false | ClusterRoleBinding |
| `clusterroles` |  | rbac.authorization.k8s.io/v1 | false | ClusterRole |
| `rolebindings` |  | rbac.authorization.k8s.io/v1 | true | RoleBinding |
| `roles` |  | rbac.authorization.k8s.io/v1 | true | Role |
| `priorityclasses` | `pc` | scheduling.k8s.io/v1 | false | PriorityClass |
| `csidrivers` |  | storage.k8s.io/v1 | false | CSIDriver |
| `csinodes` |  | storage.k8s.io/v1 | false | CSINode |
| `csistoragecapacities` |  | storage.k8s.io/v1 | true | CSIStorageCapacity |
| `storageclasses` | `sc` | storage.k8s.io/v1 | false | StorageClass |
| `volumeattachments` |  | storage.k8s.io/v1 | false | VolumeAttachment |

<!--
## Output options
-->
## 輸出選項   {#output-options}

<!--
Use the following sections for information about how you can format or sort the output
of certain commands. For details about which commands support the various output options,
see the [kubectl](/docs/reference/kubectl/kubectl/) reference documentation.
-->
有關如何格式化或排序某些命令的輸出的信息，請參閱以下章節。有關哪些命令支持不同輸出選項的詳細信息，
請參閱 [kubectl](/zh-cn/docs/reference/kubectl/kubectl/) 參考文檔。

<!--
### Formatting output
-->
### 格式化輸出   {#formatting-output}

<!--
The default output format for all `kubectl` commands is the human readable plain-text format.
To output details to your terminal window in a specific format, you can add either the `-o`
or `--output` flags to a supported `kubectl` command.
-->
所有 `kubectl` 命令的默認輸出格式都是人類可讀的純文本格式。要以特定格式在終端窗口輸出詳細信息，
可以將 `-o` 或 `--output` 參數添加到受支持的 `kubectl` 命令中。

<!--
#### Syntax
-->
#### 語法

```shell
kubectl [command] [TYPE] [NAME] -o <output_format>
```

<!--
Depending on the `kubectl` operation, the following output formats are supported:
-->
取決於具體的 `kubectl` 操作，支持的輸出格式如下：

<!--
Output format | Description
--------------| -----------
`-o custom-columns=<spec>` | Print a table using a comma separated list of [custom columns](#custom-columns).
`-o custom-columns-file=<filename>` | Print a table using the [custom columns](#custom-columns) template in the `<filename>` file.
`-o json`     | Output a JSON formatted API object.
`-o jsonpath=<template>` | Print the fields defined in a [jsonpath](/docs/reference/kubectl/jsonpath/) expression.
`-o jsonpath-file=<filename>` | Print the fields defined by the [jsonpath](/docs/reference/kubectl/jsonpath/) expression in the `<filename>` file.
`-o name`     | Print only the resource name and nothing else.
`-o wide`     | Output in the plain-text format with any additional information. For pods, the node name is included.
`-o yaml`     | Output a YAML formatted API object.
-->
輸出格式                             |  描述
------------------------------------| -----------
`-o custom-columns=<spec>`          | 使用逗號分隔的[自定義列](#custom-columns)列表打印表。
`-o custom-columns-file=<filename>` | 使用 `<filename>` 文件中的[自定義列](#custom-columns)模板打印表。
`-o json`                           | 輸出 JSON 格式的 API 對象
`-o jsonpath=<template>`            | 打印 [jsonpath](/zh-cn/docs/reference/kubectl/jsonpath/) 表達式定義的字段
`-o jsonpath-file=<filename>`       | 打印 `<filename>` 文件中 [jsonpath](/zh-cn/docs/reference/kubectl/jsonpath/) 表達式定義的字段。
`-o name`                           | 僅打印資源名稱而不打印任何其他內容。
`-o wide`                           | 以純文本格式輸出，包含所有附加信息。對於 Pod 包含節點名。
`-o yaml`                           | 輸出 YAML 格式的 API 對象。

<!--
##### Example
-->
##### 示例

<!--
In this example, the following command outputs the details for a single pod as a YAML formatted object:
-->
在此示例中，以下命令將單個 Pod 的詳細信息輸出爲 YAML 格式的對象：

```shell
kubectl get pod web-pod-13je7 -o yaml
```
<!--
Remember: See the [kubectl](/docs/reference/kubectl/kubectl/) reference documentation
for details about which output format is supported by each command.
-->
請記住：有關每個命令支持哪種輸出格式的詳細信息，
請參閱 [kubectl](/zh-cn/docs/reference/kubectl/kubectl/) 參考文檔。

<!--
#### Custom columns
-->
#### 自定義列   {#custom-columns}

<!--
To define custom columns and output only the details that you want into a table, you can use the `custom-columns` option.
You can choose to define the custom columns inline or use a template file: `-o custom-columns=<spec>` or `-o custom-columns-file=<filename>`.
-->
要定義自定義列並僅將所需的詳細信息輸出到表中，可以使用 `custom-columns` 選項。
你可以選擇內聯定義自定義列或使用模板文件：`-o custom-columns=<spec>` 或
`-o custom-columns-file=<filename>`。

<!--
##### Examples
-->
##### 示例

<!--
Inline:
-->
內聯：

```shell
kubectl get pods <pod-name> -o custom-columns=NAME:.metadata.name,RSRC:.metadata.resourceVersion
```

<!--
Template file:
-->
模板文件：

```shell
kubectl get pods <pod-name> -o custom-columns-file=template.txt
```

<!--
where the `template.txt` file contains:
-->
其中，`template.txt` 文件包含：

```
NAME          RSRC
metadata.name metadata.resourceVersion
```

<!--
The result of running either command is similar to:
-->
運行這兩個命令之一的結果類似於：

```
NAME           RSRC
submit-queue   610995
```

<!--
#### Server-side columns
-->
#### Server-side 列

<!--
`kubectl` supports receiving specific column information from the server about objects.
This means that for any given resource, the server will return columns and rows relevant to that resource, for the client to print.
This allows for consistent human-readable output across clients used against the same cluster, by having the server encapsulate the details of printing.
-->
`kubectl` 支持從服務器接收關於對象的特定列信息。
這意味着對於任何給定的資源，服務器將返回與該資源相關的列和行，以便客戶端打印。
通過讓服務器封裝打印的細節，這允許在針對同一集羣使用的客戶端之間提供一致的人類可讀輸出。

<!--
This feature is enabled by default. To disable it, add the
`--server-print=false` flag to the `kubectl get` command.
-->
此功能默認啓用。要禁用它，請將該 `--server-print=false` 參數添加到 `kubectl get` 命令中。

<!--
##### Examples
-->
##### 例子

<!--
To print information about the status of a pod, use a command like the following:
-->
要打印有關 Pod 狀態的信息，請使用如下命令：

```shell
kubectl get pods <pod-name> --server-print=false
```

<!--
The output is similar to:
-->
輸出類似於：

```
NAME       AGE
pod-name   1m
```

<!--
### Sorting list objects
-->
### 排序列表對象

<!--
To output objects to a sorted list in your terminal window, you can add the `--sort-by` flag
to a supported `kubectl` command. Sort your objects by specifying any numeric or string field
with the `--sort-by` flag. To specify a field, use a [jsonpath](/docs/reference/kubectl/jsonpath/) expression.
-->
要將對象排序後輸出到終端窗口，可以將 `--sort-by` 參數添加到支持的 `kubectl` 命令。
通過使用 `--sort-by` 參數指定任何數字或字符串字段來對對象進行排序。
要指定字段，請使用 [jsonpath](/zh-cn/docs/reference/kubectl/jsonpath/) 表達式。

<!--
#### Syntax
-->
#### 語法

```shell
kubectl [command] [TYPE] [NAME] --sort-by=<jsonpath_exp>
```

<!--
##### Example
-->
##### 示例

<!--
To print a list of pods sorted by name, you run:
-->
要打印按名稱排序的 Pod 列表，請運行：

```shell
kubectl get pods --sort-by=.metadata.name
```

<!--
## Examples: Common operations
-->
## 示例：常用操作

<!--
Use the following set of examples to help you familiarize yourself with running the commonly used `kubectl` operations:
-->
使用以下示例集來幫助你熟悉運行常用 `kubectl` 操作：

<!--
`kubectl apply` - Apply or Update a resource from a file or stdin.
-->
`kubectl apply` - 以文件或標準輸入爲準應用或更新資源。

<!--
```shell
# Create a service using the definition in example-service.yaml.
kubectl apply -f example-service.yaml

# Create a replication controller using the definition in example-controller.yaml.
kubectl apply -f example-controller.yaml

# Create the objects that are defined in any .yaml, .yml, or .json file within the <directory> directory.
kubectl apply -f <directory>
```
-->
```shell
# 使用 example-service.yaml 中的定義創建 Service。
kubectl apply -f example-service.yaml

# 使用 example-controller.yaml 中的定義創建 replication controller。
kubectl apply -f example-controller.yaml

# 使用 <directory> 路徑下的任意 .yaml、.yml 或 .json 文件 創建對象。
kubectl apply -f <directory>
```

<!--
`kubectl get` - List one or more resources.
-->
`kubectl get` - 列出一個或多個資源。

<!--
# List all pods in plain-text output format.
kubectl get pods

# List all pods in plain-text output format and include additional information (such as node name).
kubectl get pods -o wide

# List the replication controller with the specified name in plain-text output format. Tip: You can shorten and replace the 'replicationcontroller' resource type with the alias 'rc'.
kubectl get replicationcontroller <rc-name>

# List all replication controllers and services together in plain-text output format.
kubectl get rc,services

# List all daemon sets in plain-text output format.
kubectl get ds

# List all pods running on node server01
kubectl get pods --field-selector=spec.nodeName=server01
-->

```shell
# 以純文本輸出格式列出所有 Pod。
kubectl get pods

# 以純文本輸出格式列出所有 Pod，幷包含附加信息(如節點名)。
kubectl get pods -o wide

# 以純文本輸出格式列出具有指定名稱的副本控制器。提示：你可以使用別名 'rc' 縮短和替換 'replicationcontroller' 資源類型。
kubectl get replicationcontroller <rc-name>

# 以純文本輸出格式列出所有副本控制器和 Service。
kubectl get rc,services

# 以純文本輸出格式列出所有守護程序集，包括未初始化的守護程序集。
kubectl get ds --include-uninitialized

# 列出在節點 server01 上運行的所有 Pod
kubectl get pods --field-selector=spec.nodeName=server01
```

<!--
`kubectl describe` - Display detailed state of one or more resources, including the uninitialized ones by default.
-->
`kubectl describe` - 顯示一個或多個資源的詳細狀態，默認情況下包括未初始化的資源。

<!--
# Display the details of the node with name <node-name>.
kubectl describe nodes <node-name>

# Display the details of the pod with name <pod-name>.
kubectl describe pods/<pod-name>

# Display the details of all the pods that are managed by the replication controller named <rc-name>.
# Remember: Any pods that are created by the replication controller get prefixed with the name of the replication controller.
kubectl describe pods <rc-name>

# Describe all pods
kubectl describe pods
-->

```shell
# 顯示名爲 <pod-name> 的 Pod 的詳細信息。
kubectl describe nodes <node-name>

# 顯示名爲 <pod-name> 的 Pod 的詳細信息。
kubectl describe pods/<pod-name>

# 顯示由名爲 <rc-name> 的副本控制器管理的所有 Pod 的詳細信息。
# 記住：副本控制器創建的任何 Pod 都以副本控制器的名稱爲前綴。
kubectl describe pods <rc-name>

# 描述所有的 Pod
kubectl describe pods
```

{{< note >}}

<!--
The `kubectl get` command is usually used for retrieving one or more
resources of the same resource type. It features a rich set of flags that allows
you to customize the output format using the `-o` or `--output` flag, for example.
You can specify the `-w` or `--watch` flag to start watching updates to a particular
object. The `kubectl describe` command is more focused on describing the many
related aspects of a specified resource. It may invoke several API calls to the
API server to build a view for the user. For example, the `kubectl describe node`
command retrieves not only the information about the node, but also a summary of
the pods running on it, the events generated for the node etc.
-->
`kubectl get` 命令通常用於檢索同一資源類別的一個或多個資源。
它具有豐富的參數，允許你使用 `-o` 或 `--output` 參數自定義輸出格式。
你可以指定 `-w` 或 `--watch` 參數以開始監測特定對象的更新。
`kubectl describe` 命令更側重於描述指定資源的許多相關方面。它可以調用對 `API 服務器` 的多個 API 調用來爲用戶構建視圖。
例如，該 `kubectl describe node` 命令不僅檢索有關節點的信息，還檢索在其上運行的 Pod 的摘要，爲節點生成的事件等。

{{< /note >}}

<!--
`kubectl delete` - Delete resources either from a file, stdin, or specifying label selectors, names, resource selectors, or resources.
-->
`kubectl delete` - 基於文件、標準輸入或通過指定標籤選擇器、名稱、資源選擇器或資源來刪除資源。

<!--
```shell
# Delete a pod using the type and name specified in the pod.yaml file.
kubectl delete -f pod.yaml

# Delete all the pods and services that have the label '<label-key>=<label-value>'.
kubectl delete pods,services -l <label-key>=<label-value>

# Delete all pods, including uninitialized ones.
kubectl delete pods --all
```
-->

```shell
# 使用 pod.yaml 文件中指定的類型和名稱刪除 Pod。
kubectl delete -f pod.yaml

# 刪除所有帶有 '<label-key>=<label-value>' 標籤的 Pod 和 Service。
kubectl delete pods,services -l <label-key>=<label-value>

# 刪除所有 Pod，包括未初始化的 Pod。
kubectl delete pods --all
```

<!--
`kubectl exec` - Execute a command against a container in a pod.
-->
`kubectl exec` - 對 Pod 中的容器執行命令。

<!--
# Get output from running 'date' from pod <pod-name>. By default, output is from the first container.
kubectl exec <pod-name> -- date

# Get output from running 'date' in container <container-name> of pod <pod-name>.
kubectl exec <pod-name> -c <container-name> -- date

# Get an interactive TTY and run /bin/bash from pod <pod-name>. By default, output is from the first container.
kubectl exec -ti <pod-name> -- /bin/bash
-->
```shell
# 從 Pod <pod-name> 中獲取運行 'date' 的輸出。默認情況下，輸出來自第一個容器。
kubectl exec <pod-name> -- date

# 運行輸出 'date' 獲取在 Pod <pod-name> 中容器 <container-name> 的輸出。
kubectl exec <pod-name> -c <container-name> -- date

# 獲取一個交互 TTY 並在 Pod  <pod-name> 中運行 /bin/bash。默認情況下，輸出來自第一個容器。
kubectl exec -ti <pod-name> -- /bin/bash
```

<!--
`kubectl logs` - Print the logs for a container in a pod.
-->
`kubectl logs` - 打印 Pod 中容器的日誌。

<!--
# Return a snapshot of the logs from pod <pod-name>.
kubectl logs <pod-name>

# Start streaming the logs from pod <pod-name>. This is similar to the 'tail -f' Linux command.
kubectl logs -f <pod-name>
-->

```shell
# 返回 Pod <pod-name> 的日誌快照。
kubectl logs <pod-name>

# 從 Pod <pod-name> 開始流式傳輸日誌。這類似於 'tail -f' Linux 命令。
kubectl logs -f <pod-name>
```

<!--
`kubectl diff` - View a diff of the proposed updates to a cluster.

```shell
# Diff resources included in "pod.json".
kubectl diff -f pod.json

# Diff file read from stdin.
cat service.yaml | kubectl diff -f -
```
-->
`kubectl diff` - 查看集羣建議更新的差異。

```shell
# “pod.json” 中包含的差異資源。
kubectl diff -f pod.json

# 從標準輸入讀取的差異文件。
cat service.yaml | kubectl diff -f -
```

<!--
## Examples: Creating and using plugins
-->
## 示例：創建和使用插件

<!--
Use the following set of examples to help you familiarize yourself with writing and using `kubectl` plugins:
-->
使用以下示例來幫助你熟悉編寫和使用 `kubectl` 插件：

<!--
```shell
# create a simple plugin in any language and name the resulting executable file
# so that it begins with the prefix "kubectl-"
cat ./kubectl-hello
```
-->
```shell
# 用任何語言創建一個簡單的插件，併爲生成的可執行文件命名
# 以前綴 "kubectl-" 開始
cat ./kubectl-hello
```

<!--
```shell
#!/bin/sh

# this plugin prints the words "hello world"
echo "hello world"
```
-->

```shell
#!/bin/sh

# 這個插件打印單詞 "hello world"
echo "hello world"
```

<!--
With a plugin written, let's make it executable:
```bash
chmod a+x ./kubectl-hello

# and move it to a location in our PATH
sudo mv ./kubectl-hello /usr/local/bin
sudo chown root:root /usr/local/bin

# You have now created and "installed" a kubectl plugin.
# You can begin using this plugin by invoking it from kubectl as if it were a regular command
kubectl hello
```
-->
這個插件寫好了，把它變成可執行的：

```bash
sudo chmod a+x ./kubectl-hello

# 並將其移動到路徑中的某個位置
sudo mv ./kubectl-hello /usr/local/bin
sudo chown root:root /usr/local/bin

# 你現在已經創建並"安裝了"一個 kubectl 插件。
# 你可以開始使用這個插件，從 kubectl 調用它，就像它是一個常規命令一樣
kubectl hello
```

```
hello world
```

<!--
```shell
# You can "uninstall" a plugin, by removing it from the folder in your
# $PATH where you placed it
sudo rm /usr/local/bin/kubectl-hello
```
-->
```shell
# 你可以"卸載"一個插件，只需從你的 $PATH 中刪除它
sudo rm /usr/local/bin/kubectl-hello
```

<!--
In order to view all of the plugins that are available to `kubectl`, use
the `kubectl plugin list` subcommand:
-->
爲了查看可用的所有 `kubectl` 插件，你可以使用 `kubectl plugin list` 子命令：

```shell
kubectl plugin list
```
<!--
The output is similar to:
-->
輸出類似於：

```
The following kubectl-compatible plugins are available:

/usr/local/bin/kubectl-hello
/usr/local/bin/kubectl-foo
/usr/local/bin/kubectl-bar
```
<!--
`kubectl plugin list` also warns you about plugins that are not
executable, or that are shadowed by other plugins; for example:
```shell
sudo chmod -x /usr/local/bin/kubectl-foo # remove execute permission
kubectl plugin list
```
-->
`kubectl plugin list` 指令也可以向你告警哪些插件被運行，或是被其它插件覆蓋了，例如：

```shell
sudo chmod -x /usr/local/bin/kubectl-foo # 刪除執行權限
kubectl plugin list
```

```
The following kubectl-compatible plugins are available:

/usr/local/bin/kubectl-hello
/usr/local/bin/kubectl-foo
  - warning: /usr/local/bin/kubectl-foo identified as a plugin, but it is not executable
/usr/local/bin/kubectl-bar

error: one plugin warning was found
```

<!--
You can think of plugins as a means to build more complex functionality on top
of the existing kubectl commands:
-->
你可以將插件視爲在現有 kubectl 命令之上構建更復雜功能的一種方法：

```shell
cat ./kubectl-whoami
```

<!--
The next few examples assume that you already made `kubectl-whoami` have
the following contents:
-->
接下來的幾個示例假設你已經將 `kubectl-whoami` 設置爲以下內容：

<!--
```shell
#!/bin/bash

# this plugin makes use of the `kubectl config` command in order to output
# information about the current user, based on the currently selected context
kubectl config view --template='{{ range .contexts }}{{ if eq .name "'$(kubectl config current-context)'" }}Current user: {{ printf "%s\n" .context.user }}{{ end }}{{ end }}'
```
-->
```shell
#!/bin/bash

#這個插件利用 `kubectl config` 命令基於當前所選上下文輸出當前用戶的信息
kubectl config view --template='{{ range .contexts }}{{ if eq .name "'$(kubectl config current-context)'" }}Current user: {{ printf "%s\n" .context.user }}{{ end }}{{ end }}'
```

<!--
Running the above command gives you an output containing the user for the
current context in your KUBECONFIG file:
-->
運行以上命令將爲你提供一個輸出，其中包含 KUBECONFIG 文件中當前上下文的用戶：

<!--
```shell
# make the file executable
sudo chmod +x ./kubectl-whoami

# and move it into your PATH
sudo mv ./kubectl-whoami /usr/local/bin

kubectl whoami
Current user: plugins-user
```
-->
```shell
#!/bin/bash
# 使文件成爲可執行的
sudo chmod +x ./kubectl-whoami

# 然後移動到你的路徑中
sudo mv ./kubectl-whoami /usr/local/bin

kubectl whoami
Current user: plugins-user
```

## {{% heading "whatsnext" %}}

<!--
* Read the `kubectl` reference documentation:
  * the kubectl [command reference](/docs/reference/kubectl/kubectl/)
  * the [command line arguments](/docs/reference/kubectl/generated/kubectl/) reference
* Learn about [`kubectl` usage conventions](/docs/reference/kubectl/conventions/)
* Read about [JSONPath support](/docs/reference/kubectl/jsonpath/) in kubectl
* Read about how to [extend kubectl with plugins](/docs/tasks/extend-kubectl/kubectl-plugins)
  * To find out more about plugins, take a look at the [example CLI plugin](https://github.com/kubernetes/sample-cli-plugin).
-->
* 閱讀 `kubectl` 參考文檔：
  * kubectl [命令參考](/zh-cn/docs/reference/kubectl/kubectl/)
  * 參考[命令行參數](/docs/reference/kubectl/generated/kubectl/)
* 學習關於 [`kubectl` 使用約定](/zh-cn/docs/reference/kubectl/conventions/)
* 閱讀 kubectl 中的 [JSONPath 支持](/zh-cn/docs/reference/kubectl/jsonpath/)
* 瞭解如何[使用插件擴展 kubectl](/zh-cn/docs/tasks/extend-kubectl/kubectl-plugins)
  * 查看更多[示例 CLI 插件](https://github.com/kubernetes/sample-cli-plugin)。
