---
title: 在运行中的集群上重新配置节点的 kubelet
content_type: task
---

<!--
reviewers:
- mtaufen
- dawnchen
title: Reconfigure a Node's Kubelet in a Live Cluster
content_type: task
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.11" state="beta" >}}

<!--
[Dynamic Kubelet Configuration](https://github.com/kubernetes/enhancements/issues/281)
allows you to change the configuration of each Kubelet in a live Kubernetes
cluster by deploying a ConfigMap and configuring each Node to use it.
-->
[动态 kubelet 配置](https://github.com/kubernetes/enhancements/issues/281)
允许你在一个运行的 Kubernetes 集群上通过部署 ConfigMap
并配置每个节点来使用它来更改每个 kubelet 的配置，。

<!--
All kubelet configuration parameters can be changed dynamically,
but this is unsafe for some parameters. Before deciding to change a parameter
dynamically, you need a strong understanding of how that change will affect your
cluster's behavior. Always carefully test configuration changes on a small set
of nodes before rolling them out cluster-wide. Advice on configuring specific
fields is available in the inline `KubeletConfiguration`
[type documentation](https://github.com/kubernetes/kubernetes/blob/release-1.11/pkg/kubelet/apis/kubeletconfig/v1beta1/types.go).
-->
{{< warning >}}
所有 kubelet 配置参数都可以动态更改，但这对某些参数来说是不安全的。
在决定动态更改参数之前，你需要深刻理解这种变化将如何影响你的集群的行为。
在把一组变更推广到集群范围之前，需要在较小规模的节点集合上仔细地测试这些配置变化。
与特定字段配置相关的建议可以在源码中 `KubeletConfiguration`
[类型文档](https://github.com/kubernetes/kubernetes/blob/release-1.11/pkg/kubelet/apis/kubeletconfig/v1beta1/types.go)中找到。
{{< /warning >}}

## {{% heading "prerequisites" %}}

<!--
You need to have a Kubernetes cluster.
You also need kubectl v1.11 or higher, configured to communicate with your cluster.
{{< version-check >}}
Your cluster API server version (eg v1.12) must be no more than one minor
version away from the version of kubectl that you are using. For example,
if your cluster is running v1.16 then you can use kubectl v1.15, v1.16
or v1.17; other combinations
[aren't supported](/docs/setup/release/version-skew-policy/#kubectl).
-->
你需要一个 Kubernetes 集群。
你需要 v1.11 或更高版本的 kubectl，并以配置好与集群通信。
{{< version-check >}}
你的集群 API 服务器版本（如 v1.12）不能比你所用的 kubectl
的版本差不止一个小版本号。
例如，如果你的集群在运行 v1.16，那么你可以使用 v1.15、v1.16、v1.17 的 kubectl，
所有其他的组合都是
[不支持的](/zh/docs/setup/release/version-skew-policy/#kubectl)。

<!--
Some of the examples use the command line tool
[jq](https://stedolan.github.io/jq/). You do not need `jq` to complete the task,
because there are manual alternatives.

For each node that you're reconfiguring, you must set the kubelet
`-dynamic-config-dir` flag to a writable directory.
-->
某些例子中使用了命令行工具 [jq](https://stedolan.github.io/jq/)。
你并不一定需要 `jq` 才能完成这些任务，因为总是有一些手工替代的方式。

针对你所重新配置的每个节点，你必须设置 kubelet 的参数
`-dynamic-config-dir`，使之指向一个可写的目录。

<!-- steps -->

<!--
## Reconfiguring the kubelet on a running node in your cluster

### Basic Workflow Overview
-->
## 重配置 集群中运行节点上的 kubelet 

### 基本工作流程概述

<!--
The basic workflow for configuring a Kubelet in a live cluster is as follows:

1. Write a YAML or JSON configuration file containing the
Kubelet's configuration.
2. Wrap this file in a ConfigMap and save it to the Kubernetes control plane.
3. Update the Kubelet's corresponding Node object to use this ConfigMap.
-->
在运行中的集群中配置 kubelet 的基本工作流程如下：

1. 编写一个 YAML 或 JSON 的配置文件包含 kubelet 的配置。
2. 将此文件包装在 ConfigMap 中并将其保存到 Kubernetes 控制平面。
3. 更新 kubelet 的相应节点对象以使用此 ConfigMap。

<!--
Each kubelet watches a configuration reference on its respective Node object.
When this reference changes, the Kubelet downloads the new configuration,
updates a local reference to refer to the file, and exits.
For the feature to work correctly, you must be running an OS-level service
manager (such as systemd), which will restart the Kubelet if it exits. When the
Kubelet is restarted, it will begin using the new configuration.
-->
每个 kubelet 都会在其各自的节点对象上监测（Watch）配置引用。当引用更改时，kubelet 将下载新配置，
更新本地引用以引用该文件，然后退出。
要想使该功能正常地工作，你必须运行操作系统级别的服务管理器（如 systemd），
在 kubelet 退出时将其重启。
kubelet 重新启动时，将开始使用新配置。

<!--
The new configuration completely overrides configuration provided by `--config`,
and is overridden by command-line flags. Unspecified values in the new configuration
will receive default values appropriate to the configuration version
(e.g. `kubelet.config.k8s.io/v1beta1`), unless overridden by flags.
-->
这个新配置完全地覆盖 `--config` 所提供的配置，并被命令行标志覆盖。
新配置中未指定的值将收到适合配置版本的默认值
(e.g. `kubelet.config.k8s.io/v1beta1`)，除非被命令行标志覆盖。

<!--
The status of the Node's Kubelet configuration is reported via
`Node.Spec.Status.Config`. Once you have updated a Node to use the new
ConfigMap, you can observe this status to confirm that the Node is using the
intended configuration.
-->
节点 kubelet 配置状态可通过 `node.spec.status.config` 获取。
一旦你已经改变了一个节点去使用新的 ConfigMap，
就可以观察此状态以确认该节点正在使用的预期配置。

<!--
This document describes editing Nodes using `kubectl edit`.
There are other ways to modify a Node's spec, including `kubectl patch`, for
example, which facilitate scripted workflows.
-->
本文用命令 `kubectl edit` 描述节点的编辑，还有一些其他的方式去修改节点的规约，
包括更利于脚本化的工作流程的 `kubectl patch`。

<!--
This document only describes a single Node consuming each ConfigMap. Keep in
mind that it is also valid for multiple Nodes to consume the same ConfigMap.
-->
本文仅仅讲述在单节点上使用每个 ConfigMap。请注意对于多个节点使用相同的 ConfigMap
也是合法的。

<!--
While it is *possible* to change the configuration by
updating the ConfigMap in-place, this causes all Kubelets configured with
that ConfigMap to update simultaneously. It is much safer to treat ConfigMaps
as immutable by convention, aided by `kubectl`'s `-append-hash` option,
and incrementally roll out updates to `Node.Spec.ConfigSource`.
-->
{{< warning >}}
通过就地更新 ConfigMap 来更改配置是 *可能的*。
尽管如此，这样做会导致所有配置为使用该 ConfigMap 的 kubelet 被同时更新。
更安全的做法是按惯例将 ConfigMap 视为不可变更的，借助于
`kubectl` 的 `--append-hash` 选项逐步把更新推广到 `node.spec.configSource`。
{{< /warning >}}

<!--
### Automatic RBAC rules for Node Authorizer

Previously, you were required to manually create RBAC rules
to allow Nodes to access their assigned ConfigMaps. The Node Authorizer now
automatically configures these rules.
-->
### 节点鉴权器的自动 RBAC 规则

以前，你需要手动创建 RBAC 规则以允许节点访问其分配的 ConfigMap。节点鉴权器现在
能够自动配置这些规则。

<!--
### Generating a file that contains the current configuration

The Dynamic Kubelet Configuration feature allows you to provide an override for
the entire configuration object, rather than a per-field overlay. This is a
simpler model that makes it easier to trace the source of configuration values
and debug issues. The compromise, however, is that you must start with knowledge
of the existing configuration to ensure that you only change the fields you
intend to change.
-->
### 生成包含当前配置的文件

动态 kubelet 配置特性允许你为整个配置对象提供一个重载配置，而不是靠单个字段的叠加。 
这是一个更简单的模型，可以更轻松地跟踪配置值的来源，更便于调试问题。
然而，相应的代价是你必须首先了解现有配置，以确保你只更改你打算修改的字段。

<!--
The kubelet loads settings from its configuration file, but you can set command
line flags to override the configuration in the file. This means that if you
only know the contents of the configuration file, and you don't know the
command line overrides, then you do not know the running configuration either.
-->
组件 kubelet 从其配置文件中加载配置数据，不过你可以通过设置命令行标志
来重载文件中的一些配置。这意味着，如果你仅知道配置文件的内容，而你不知道
命令行重载了哪些配置，你就无法知道 kubelet 的运行时配置是什么。

<!--
Because you need to know the running configuration in order to override it,
you can fetch the running configuration from the kubelet. You can generate a
config file containing a Node's current configuration by accessing the kubelet's
`configz` endpoint, through `kubectl proxy`. The next section explains how to
do this.
-->
因为你需要知道运行时所使用的配置才能重载之，你可以从 kubelet 取回其运行时配置。
你可以通过访问 kubelet 的 `configz` 末端来生成包含节点当前配置的配置文件；
这一操作可以通过 `kubectl proxy` 来完成。
下一节解释如何完成这一操作。

<!--
The kubelet's `configz` endpoint is there to help with debugging, and is not
a stable part of kubelet behavior.
Do not rely on the behavior of this endpoint for production scenarios or for
use with automated tools.
-->
{{< caution >}}
组件 `kubelet` 上的 `configz` 末端是用来协助调试的，并非 kubelet 稳定行为的一部分。
请不要在产品环境下依赖此末端的行为，也不要在自动化工具中使用此末端。
{{< /caution >}}

<!--
For more information on configuring the kubelet via a configuration file, see
[Set kubelet parameters via a config file](/docs/tasks/administer-cluster/kubelet-config-file)).
-->
关于如何使用配置文件来配置 kubelet 行为的更多信息可参见
[通过配置文件设置 kubelet 参数](/zh/docs/tasks/administer-cluster/kubelet-config-file)
文档。

<!-- #### Generate the configuration file -->
#### 生成配置文件

<!--
The steps below use the `jq` command to streamline working with JSON.
To follow the tasks as written, you need to have `jq` installed. You can
adapt the steps if you prefer to extract the `kubeletconfig` subobject manually.
-->
{{< note >}}
下面的任务步骤中使用了 `jq` 命令以方便处理 JSON 数据。为了完成这里讲述的任务，
你需要安装 `jq`。如果你更希望手动提取 `kubeletconfig` 子对象，也可以对这里
的对应步骤做一些调整。
{{< /note >}}

<!--
1. Choose a Node to reconfigure. In this example, the name of this Node is
    referred to as `NODE_NAME`.
2. Start the kubectl proxy in the background using the following command:
-->
1. 选择要重新配置的节点。在本例中，此节点的名称为 `NODE_NAME`。
2. 使用以下命令在后台启动 kubectl 代理：

   ```bash
   kubectl proxy --port=8001 &
   ```
<!--
3. Run the following command to download and unpack the configuration from the
    `configz` endpoint. The command is long, so be careful when copying and
    pasting. **If you use zsh**, note that common zsh configurations add backslashes
    to escape the opening and closing curly braces around the variable name in the URL.
    For example: `${NODE_NAME}` will be rewritten as `$\{NODE_NAME\}` during the paste.
    You must remove the backslashes before running the command, or the command will fail.
-->
3. 运行以下命令从 `configz` 端点中下载并解压配置。这个命令很长，因此在复制粘贴时要小心。
   **如果你使用 zsh**，请注意常见的 zsh 配置要添加反斜杠转义 URL 中变量名称周围的大括号。
   例如：在粘贴时，`${NODE_NAME}` 将被重写为 `$\{NODE_NAME\}`。
   你必须在运行命令之前删除反斜杠，否则命令将失败。

   ```bash
   NODE_NAME="the-name-of-the-node-you-are-reconfiguring"; curl -sSL "http://localhost:8001/api/v1/nodes/${NODE_NAME}/proxy/configz" | jq '.kubeletconfig|.kind="KubeletConfiguration"|.apiVersion="kubelet.config.k8s.io/v1beta1"' > kubelet_configz_${NODE_NAME}
   ```

<!--
You need to manually add the `kind` and `apiVersion` to the downloaded
object，because they are not reported by the `configz` endpoint。
-->
{{< note >}}
你需要手动将 `kind` 和 `apiVersion` 添加到下载对象中，因为它们不是由 `configz` 末端
返回的。
{{< /note >}}

<!--
#### Edit the configuration file

Using a text editor, change one of the parameters in the
file generated by the previous procedure. For example, you
might edit the QPS parameter `eventRecordQPS`.
-->
#### 修改配置文件

使用文本编辑器，改变上述操作生成的文件中一个参数。
例如，你或许会修改 QPS 参数 `eventRecordQPS`。

<!--
#### Push the configuration file to the control plane

Push the edited configuration file to the control plane with the
following command:
-->
#### 把配置文件推送到控制平面

用以下命令把编辑后的配置文件推送到控制平面：

```bash
kubectl -n kube-system create configmap my-node-config \
  --from-file=kubelet=kubelet_configz_${NODE_NAME} \
  --append-hash -o yaml
```

<!--
This is an example of a valid response:
-->
下面是合法响应的一个例子：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2017-09-14T20:23:33Z
  name: my-node-config-gkt4c2m4b2
  namespace: kube-system
  resourceVersion: "119980"
  selfLink: /api/v1/namespaces/kube-system/configmaps/my-node-config-gkt4c2m4b2
  uid: 946d785e-998a-11e7-a8dd-42010a800006
data:
  kubelet: |
    {...}
```

<!--
You created that ConfigMap inside the `kube-system` namespace because the kubelet
is a Kubernetes system component.
-->
你会在 `kube-system` 命名空间中创建 ConfigMap，因为 kubelet 是 Kubernetes 的系统组件。

<!--
The `-append-hash` option appends a short checksum of the ConfigMap contents
to the name. This is convenient for an edit-then-push workflow, because it
automatically, yet deterministically, generates new names for new ConfigMaps.
The name that includes this generated hash is referred to as `CONFIG_MAP_NAME`
in the following examples.
-->
`--append-hash` 选项给 ConfigMap 内容附加了一个简短校验和。
这对于先编辑后推送的工作流程很方便，
因为它自动并确定地为新 ConfigMap 生成新的名称。
在以下示例中，包含生成的哈希字符串的对象名被称为 `CONFIG_MAP_NAME`。

<!--
#### Set the Node to use the new configuration


Edit the Node's reference to point to the new ConfigMap with the
following command:
-->
#### 配置节点使用新的配置

```bash
kubectl edit node ${NODE_NAME}
```

<!--
In your text editor, add the following YAML under `spec`:
-->
在你的文本编辑器中，在 `spec` 下增添以下 YAML：

```yaml
configSource:
    configMap:
        name: CONFIG_MAP_NAME
        namespace: kube-system
        kubeletConfigKey: kubelet
```

<!--
You must specify all three of `name`, `namespace`, and `kubeletConfigKey`.
The `kubeletConfigKey` parameter shows the Kubelet which key of the ConfigMap
contains its config.
-->
你必须同时指定 `name`、`namespace` 和 `kubeletConfigKey` 这三个属性。
`kubeletConfigKey` 这个参数通知 kubelet ConfigMap 中的哪个键下面包含所要的配置。

<!--
#### Observe that the Node begins using the new configuration

Retrieve the Node using the `kubectl get node ${NODE_NAME} -o yaml` command and inspect
`Node.Status.Config`. The config sources corresponding to the `active`,
`assigned`, and `lastKnownGood` configurations are reported in the status.

- The `active` configuration is the version the Kubelet is currently running with.
- The `assigned` configuration is the latest version the Kubelet has resolved based on
  `Node.Spec.ConfigSource`.
- The `lastKnownGood` configuration is the version the
  Kubelet will fall back to if an invalid config is assigned in `Node.Spec.ConfigSource`.
-->
#### 观察节点开始使用新配置

用 `kubectl get node ${NODE_NAME} -o yaml` 命令读取节点并检查 `node.status.config` 内容。
状态部分报告了对应 `active`（使用中的）配置、`assigned`（被赋予的）配置和
`lastKnownGood`（最近已知可用的）配置的配置源。

- `active` 是 kubelet 当前运行时所使用的版本。
- `assigned` 参数是 kubelet 基于 `node.spec.configSource` 所解析出来的最新版本。
- `lastKnownGood` 参数是 kubelet 的回退版本；如果在 `node.spec.configSource` 中
  包含了无效的配置值，kubelet 可以回退到这个版本。

<!--
The`lastKnownGood` configuration might not be present if it is set to its default value,
the local config deployed with the node. The status will update `lastKnownGood` to
match a valid `assigned` config after the Kubelet becomes comfortable with the config.
The details of how the Kubelet determines a config should become the `lastKnownGood` are
not guaranteed by the API, but is currently implemented as a 10-minute grace period.
-->
如果用本地配置部署节点，使其设置成默认值，这个 `lastKnownGood` 配置可能不存在。
在 kubelet 配置好后，将更新 `lastKnownGood` 为一个有效的 `assigned` 配置。
决定如何确定某配置成为 `lastKnownGood` 配置的细节并不在 API 保障范畴，
不过目前实现中采用了 10 分钟的宽限期。

<!--
You can use the following command (using `jq`) to filter down
to the config status:
-->
你可以使用以下命令（使用 `jq`）过滤出配置状态：

```bash
kubectl get no ${NODE_NAME} -o json | jq '.status.config'
```

<!--
The following is an example response:
-->
以下是一个响应示例：

```json
{
  "active": {
    "configMap": {
      "kubeletConfigKey": "kubelet",
      "name": "my-node-config-9mbkccg2cc",
      "namespace": "kube-system",
      "resourceVersion": "1326",
      "uid": "705ab4f5-6393-11e8-b7cc-42010a800002"
    }
  },
  "assigned": {
    "configMap": {
      "kubeletConfigKey": "kubelet",
      "name": "my-node-config-9mbkccg2cc",
      "namespace": "kube-system",
      "resourceVersion": "1326",
      "uid": "705ab4f5-6393-11e8-b7cc-42010a800002"
    }
  },
  "lastKnownGood": {
    "configMap": {
      "kubeletConfigKey": "kubelet",
      "name": "my-node-config-9mbkccg2cc",
      "namespace": "kube-system",
      "resourceVersion": "1326",
      "uid": "705ab4f5-6393-11e8-b7cc-42010a800002"
    }
  }
}
```

<!--
If you do not have `jq`, you can look at the whole response and find `Node.Status.Config`
by eye.
-->
如果你没有安装 `jq`，你可以查看整个响应对象，查找其中的 `node.status.config`
部分。

<!--
If an error occurs, the Kubelet reports it in the `Node.Status.Config.Error`
structure. Possible errors are listed in
[Understanding Node.Status.Config.Error messages](#understanding-node-status-config-error-messages).
You can search for the identical text in the Kubelet log for additional details
and context about the error.
-->
如果发生错误，kubelet 会在 `node.status.config.error` 中显示出错误信息的结构体。
可能的错误列在[了解节点配置错误信息](#understanding-node-config-status-errors)节。
你可以在 kubelet 日志中搜索相同的文本以获取更多详细信息和有关错误的上下文。

<!--
#### Make more changes

Follow the workflow above to make more changes and push them again. Each time
you push a ConfigMap with new contents, the -append-hash kubectl option creates
the ConfigMap with a new name. The safest rollout strategy is to first create a
new ConfigMap, and then update the Node to use the new ConfigMap.
-->
#### 做出更多的改变   {#make-more-changes}

按照下面的工作流程做出更多的改变并再次推送它们。
你每次推送一个 ConfigMap 的新内容时，kubeclt 的 `--append-hash` 选项都会给
ConfigMap 创建一个新的名称。
最安全的上线策略是首先创建一个新的 ConfigMap，然后更新节点以使用新的 ConfigMap。

<!--
#### Reset the Node to use its local default configuration

To reset the Node to use the configuration it was provisioned with, edit the
Node using `kubectl edit node ${NODE_NAME}` and remove the
`Node.Spec.ConfigSource` field.
-->
#### 重置节点以使用其本地默认配置

要重置节点，使其使用节点创建时使用的配置，可以用
`kubectl edit node $ {NODE_NAME}` 命令编辑节点，并删除 `node.spec.configSource`
字段。

<!-- 
#### Observe that the Node is using its local default configuration

After removing this subfield, `Node.Status.Config` eventually becomes
empty, since all config sources have been reset to `nil`, which indicates that
the local default config is `assigned`, `active`, and `lastKnownGood`, and no
error is reported.
-->
#### 观察节点正在使用本地默认配置

在删除此字段后，`node.status.config` 最终变成空，所有配置源都已重置为 `nil`。
这表示本地默认配置成为了 `assigned`、`active` 和 `lastKnownGood` 配置，
并且没有报告错误。

<!-- discussion -->

<!--
## `kubectl patch` example

You can change a Node's configSource using several different mechanisms.
This example uses `kubectl patch`:
-->
## `kubectl patch` 示例

你可以使用几种不同的机制来更改节点的 configSource。

本例使用`kubectl patch`：

```bash
kubectl patch node ${NODE_NAME} -p "{\"spec\":{\"configSource\":{\"configMap\":{\"name\":\"${CONFIG_MAP_NAME}\",\"namespace\":\"kube-system\",\"kubeletConfigKey\":\"kubelet\"}}}}"
```
<!--
## Understanding how the Kubelet checkpoints config

When a new config is assigned to the Node, the Kubelet downloads and unpacks the
config payload as a set of files on the local disk. The Kubelet also records metadata
that locally tracks the assigned and last-known-good config sources, so that the
Kubelet knows which config to use across restarts, even if the API server becomes
unavailable. After checkpointing a config and the relevant metadata, the Kubelet
exits if it detects that the assigned config has changed. When the Kubelet is
restarted by the OS-level service manager (such as `systemd`), it reads the new
metadata and uses the new config.
-->
## 了解 Kubelet 如何为配置生成检查点

当为节点赋予新配置时，kubelet 会下载并解压配置负载为本地磁盘上的一组文件。
kubelet 还记录一些元数据，用以在本地跟踪已赋予的和最近已知良好的配置源，以便
kubelet 在重新启动时知道使用哪个配置，即使 API 服务器变为不可用。
在为配置信息和相关元数据生成检查点之后，如果检测到已赋予的配置发生改变，则 kubelet 退出。
当 kubelet 被 OS 级服务管理器（例如 `systemd`）重新启动时，它会读取新的元数据并使用新配置。

<!--
The recorded metadata is fully resolved, meaning that it contains all necessary
information to choose a specific config version - typically a `UID` and `ResourceVersion`.
This is in contrast to `Node.Spec.ConfigSource`, where the intended config is declared
via the idempotent `namespace/name` that identifies the target ConfigMap; the Kubelet
tries to use the latest version of this ConfigMap.
-->
当记录的元数据已被完全解析时，意味着它包含选择一个指定的配置版本所需的所有信息
-- 通常是 `UID` 和 `ResourceVersion`。
这与 `node.spec.configSource` 形成对比，后者通过幂等的 `namespace/name` 声明来标识
目标 ConfigMap；kubelet 尝试使用此 ConfigMap 的最新版本。

<!--
When you are debugging problems on a node, you can inspect the Kubelet's config
metadata and checkpoints. The structure of the Kubelet's checkpointing directory is:
-->
当你在调试节点上问题时，可以检查 kubelet 的配置元数据和检查点。kubelet 的检查点目录结构是：

<!--
```none
- -dynamic-config-dir (root for managing dynamic config)
| - meta
  | - assigned (encoded kubeletconfig/v1beta1.SerializedNodeConfigSource object, indicating the assigned config)
  | - last-known-good (encoded kubeletconfig/v1beta1.SerializedNodeConfigSource object, indicating the last-known-good config)
| - checkpoints
  | - uid1 (dir for versions of object identified by uid1)
    | - resourceVersion1 (dir for unpacked files from resourceVersion1 of object with uid1)
    | - ...
  | - ...
```
-->

```none
- --dynamic-config-dir （用于管理动态配置的根目录）
|-- meta
  | - assigned （编码后的 kubeletconfig/v1beta1.SerializedNodeConfigSource 对象，对应赋予的配置）
  | - last-known-good （编码后的 kubeletconfig/v1beta1.SerializedNodeConfigSource 对象，对应最近已知可用配置）
| - checkpoints
  | - uid1 （用 uid1 来标识的对象版本目录)
    | - resourceVersion1 （uid1 对象 resourceVersion1 版本下所有解压文件的目录）
    | - ...
  | - ...
```

<!-- 
## Understanding Node.Status.Config.Error messages {#understanding-node-config-status-errors}

The following table describes error messages that can occur
when using Dynamic Kubelet Config. You can search for the identical text
in the Kubelet log for additional details and context about the error.
-->
## 了解节点配置错误信息 {#understanding-node-config-status-errors}

下表描述了使用动态 kubelet 配置时可能发生的错误消息。
你可以在 kubelet 日志中搜索相同的文本来获取有关错误的其他详细信息和上下文。

<!--
Error Message    | Possible Causes
:----------------| :----------------
failed to load config, see Kubelet log for details | The kubelet likely could not parse the downloaded config payload, or encountered a filesystem error attempting to load the payload from disk.
failed to validate config, see Kubelet log for details | The configuration in the payload, combined with any command-line flag overrides, and the sum of feature gates from flags, the config file, and the remote payload, was determined to be invalid by the kubelet.
invalid NodeConfigSource, exactly one subfield must be non-nil, but all were nil | Since Node.Spec.ConfigSource is validated by the API server to contain at least one non-nil subfield, this likely means that the kubelet is older than the API server and does not recognize a newer source type.
failed to sync: failed to download config, see Kubelet log for details | The kubelet could not download the config. It is possible that Node.Spec.ConfigSource could not be resolved to a concrete API object, or that network errors disrupted the download attempt. The kubelet will retry the download when in this error state.
failed to sync: internal failure, see Kubelet log for details | The kubelet encountered some internal problem and failed to update its config as a result. Examples include filesystem errors and reading objects from the internal informer cache.
internal failure, see Kubelet log for details | The kubelet encountered some internal problem while manipulating config, outside of the configuration sync loop.
-->

{{< table caption = "理解 node.status.config.error 消息" >}}
 错误信息        | 可能的原因
:----------------| :----------------
failed to load config, see Kubelet log for details | kubelet 可能无法解析下载配置的有效负载，或者当尝试从磁盘中加载有效负载时，遇到文件系统错误。
failed to validate config, see Kubelet log for details | 有效负载中的配置，与命令行标志所产生的覆盖配置以及特行门控的组合、配置文件本身、远程负载被 kubelet 判定为无效。
invalid NodeConfigSource, exactly one subfield must be non-nil, but all were nil | 由于 API 服务器负责对 node.spec.configSource 执行验证，检查其中是否包含至少一个非空子字段，这个消息可能意味着 kubelet 比 API 服务器版本低，因而无法识别更新的源类型。
failed to sync: failed to download config, see Kubelet log for details | kubelet 无法下载配置数据。可能是 node.spec.configSource 无法解析为具体的 API 对象，或者网络错误破坏了下载。处于此错误状态时，kubelet 将重新尝试下载。
failed to sync: internal failure, see Kubelet log for details | kubelet 遇到了一些内部问题，因此无法更新其配置。 例如：发生文件系统错误或无法从内部缓存中读取对象。
internal failure, see Kubelet log for details | 在对配置进行同步的循环之外操作配置时，kubelet 遇到了一些内部问题。

{{< /table >}}

## {{% heading "whatsnext" %}}

<!--
 - For more information on configuring the kubelet via a configuration file, see
[Set kubelet parameters via a config file](/docs/tasks/administer-cluster/kubelet-config-file).
- See the reference documentation for [`NodeConfigSource`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#nodeconfigsource-v1-core)
-->
- 关于如何通过配置文件来配置 kubelet 的更多细节信息，可参阅
  [使用配置文件设置 kubelet 参数](/zh/docs/tasks/administer-cluster/kubelet-config-file).
- 阅读 API 文档中 [`NodeConfigSource`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#nodeconfigsource-v1-core) 说明

