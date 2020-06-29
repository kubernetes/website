---
title: 在实时集群上重新配置节点的 Kubelet
content_type: task
---

<!--

---
reviewers:
- mtaufen
- dawnchen
title: Reconfigure a Node's Kubelet in a Live Cluster
content_type: task
---

-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.11" state="beta" >}}

<!--
[Dynamic Kubelet Configuration](https://github.com/kubernetes/enhancements/issues/281)
allows you to change the configuration of each Kubelet in a live Kubernetes
cluster by deploying a ConfigMap and configuring each Node to use it.
-->
[动态Kubelet配置](https://github.com/kubernetes/enhancements/issues/281)
引导你在一个运行的 Kubernetes 集群上更改每一个 Kubelet 的配置，通过部署 ConfigMap 并配置每个节点来使用它。

{{< warning >}}
<!--
All Kubelet configuration parameters can be changed dynamically,
but this is unsafe for some parameters. Before deciding to change a parameter
dynamically, you need a strong understanding of how that change will affect your
cluster's behavior. Always carefully test configuration changes on a small set
of nodes before rolling them out cluster-wide. Advice on configuring specific
fields is available in the inline `KubeletConfiguration`
[type documentation](https://github.com/kubernetes/kubernetes/blob/release-1.11/pkg/kubelet/apis/kubeletconfig/v1beta1/types.go).
-->
**警告**：所有Kubelet配置参数都可以动态地更改，但这对某些参数来说是不安全的。在决定动态更改参数之前，你需要深刻理解这种变化将如何影响你的集群的行为。
在把一组节点推广到集群范围之前，都要仔细地测试这些节点上的配置变化。与配置相关的建议可以在具体的文件下找到，内联 `KubeletConfiguration`
[类型文档](https://github.com/kubernetes/kubernetes/blob/release-1.11/pkg/kubelet/apis/kubeletconfig/v1beta1/types.go)。
{{< /warning >}}



## {{% heading "prerequisites" %}}

<!--
- Kubernetes v1.11 or higher on both the Master and the Nodes
- kubectl v1.11 or higher, configured to communicate with the cluster
- The Kubelet's `--dynamic-config-dir` flag must be set to a writable
 directory on the Node.
-->

- Kubernetes v1.11 或者更高版本配置在主节点和节点上
- kubectl v1.11 或者更高版本和集群配置通信
- The Kubelet `--dynamic-config-dir` flag 必须设置在节点的可写目录上



<!-- steps -->

<!-- ## Reconfiguring the Kubelet on a Live Node in your Cluster -->
## 在你集群中的一个实时节点上配置Kubelet

<!-- ### Basic Workflow Overview -->
### 基本工作流程概述

<!--
The basic workflow for configuring a Kubelet in a live cluster is as follows:

1. Write a YAML or JSON configuration file containing the
Kubelet's configuration.
2. Wrap this file in a ConfigMap and save it to the Kubernetes control plane.
3. Update the Kubelet's corresponding Node object to use this ConfigMap.
-->
在实时集群中配置 Kubelet 的基本工作流程如下：

1. 编写一个 YAML 或 JSON 的配置文件包含 Kubelet 的配置。
2. 将此文件包装在 ConfigMap 中并将其保存到 Kubernetes 控制平面。
3. 更新 Kubelet 的相应节点对象以使用此 ConfigMap。

<!--
Each Kubelet watches a configuration reference on its respective Node object.
When this reference changes, the Kubelet downloads the new configuration,
updates a local reference to refer to the file, and exits.
For the feature to work correctly, you must be running an OS-level service
manager (such as systemd), which will restart the Kubelet if it exits. When the
Kubelet is restarted, it will begin using the new configuration.
-->
每个 Kubelet 都会在其各自的节点对象上查看配置引用。当此引用更改时，Kubelet 将下载新配置，
更新本地引用以引用该文件，然后退出。
要想使该功能正常地工作，您必须运行操作系统级别的服务管理器（如systemd），如果退出，将重启Kubelet。
当Kubelet重新启动时，它将开始使用新配置。

<!--
The new configuration completely overrides configuration provided by `--config`,
and is overridden by command-line flags. Unspecified values in the new configuration
will receive default values appropriate to the configuration version
(e.g. `kubelet.config.k8s.io/v1beta1`), unless overridden by flags.
-->
这个新配置完全地覆盖 `--config` 所提供的配置，并被命令行标志覆盖。新配置中未指定的值将收到适合配置版本的默认值
(e.g. `kubelet.config.k8s.io/v1beta1`)，除非被标志覆盖。

<!--
The status of the Node's Kubelet configuration is reported via
`Node.Spec.Status.Config`. Once you have updated a Node to use the new
ConfigMap, you can observe this status to confirm that the Node is using the
intended configuration.
-->
这个节点的 Kubelet 配置状态通过命令 `Node.Spec.Status.Config` 获取。一旦您已经改变了一个节点去使用新的 ConfigMap ，
您就可以观察此状态以确认这个节点正在使用的预期配置。

<!--
This document describes editing Nodes using `kubectl edit`.
There are other ways to modify a Node's spec, including `kubectl patch`, for
example, which facilitate scripted workflows.
-->
这个文档描述编辑节点信息用命令 `kubectl edit`，还有一些其他的方式去修改节点的规范，包括命令 `kubectl patch`，
例如，哪一个更利于脚本化的工作流程。

<!--
This document only describes a single Node consuming each ConfigMap. Keep in
mind that it is also valid for multiple Nodes to consume the same ConfigMap.
-->
这个文档仅仅讲述了在单节点上使用每一个 ConfigMap。请注意对于多个节点使用相同的 ConfigMap 也是有效的。

{{< warning >}}
<!--
While it is *possible* to change the configuration by
updating the ConfigMap in-place, this causes all Kubelets configured with
that ConfigMap to update simultaneously. It is much safer to treat ConfigMaps
as immutable by convention, aided by `kubectl`'s `--append-hash` option,
and incrementally roll out updates to `Node.Spec.ConfigSource`.
-->
**警告**：通过更新本地的 ConfigMap *有可能* 会改变配置信息，这样会导致所有 Kubelets 所配置的 ConfigMap 同步更新。
它是更安全的去处理 ConfigMap 按照惯例不变，借助于 `kubectl`'s `--append-hash` 选项，并逐步把更新推广到 `Node.Spec.ConfigSource`。
{{< /warning >}}

<!-- ### Automatic RBAC rules for Node Authorizer -->
### 节点授权器的自动RBAC规则

<!--
Previously, you were required to manually create RBAC rules
to allow Nodes to access their assigned ConfigMaps. The Node Authorizer now
automatically configures these rules.
-->
以前，您需要手动创建RBAC规则允许节点访问其分配的ConfigMaps。 节点授权器现在
自动地配置这些规则。

<!-- ### Generating a file that contains the current configuration -->
### 生成包含当前配置的文件

<!--
The Dynamic Kubelet Configuration feature allows you to provide an override for
the entire configuration object, rather than a per-field overlay. This is a
simpler model that makes it easier to trace the source of configuration values
and debug issues. The compromise, however, is that you must start with knowledge
of the existing configuration to ensure that you only change the fields you
intend to change.
-->
动态 Kubelet 配置特性允许您提供覆盖对于整个配置对象，而不是每个字段的叠加。 这是一个
更简单的模型，可以更轻松地跟踪配置值的来源和调试问题。 然而，妥协是你必须从现有配置的认识开始，
以确保您只更改您打算修改的字段。

<!--
Ideally, the Kubelet would be bootstrapped from a file on disk
and you could edit this file (which could also be version-controlled),
to create the first Kubelet ConfigMap
(see [Set Kubelet parameters via a config file](/docs/tasks/administer-cluster/kubelet-config-file)),
Currently, the Kubelet is bootstrapped with **a combination of this file and command-line flags**
that can override the configuration in the file.
As a workaround, you can generate a config file containing a Node's current
configuration by accessing the Kubelet server's `configz` endpoint via the
kubectl proxy. This endpoint, in its current implementation, is intended to be
used only as a debugging aid. Do not rely on the  of this endpoint for
production scenarios. The examples below use the `jq` command to streamline
working with JSON. To follow the tasks as written, you need to have `jq`
installed, but you can adapt the tasks if you prefer to extract the
`kubeletconfig` subobject manually.
-->
理想情况下，Kubelet 将被引导从磁盘上的一个文件，并且你可以编辑这个文件（也可以是版本控制的），
去创建第一个 Kubelet ConfigMap (参考文档 [通过配置文件设置Kubelet参数](/docs/tasks/administer-cluster/kubelet-config-file))，
目前，Kubelet 使用 **文件和命令行标志的组合** 进行引导来覆盖文件中的配置。
作为解决方法，您可以生成一个配置文件包含节点当前的组态，通过 kubectl 代理访问Kubelet服务器的 `configz` 端点。
该端点在其当前实现中，旨在被用来作为一个调试辅助工具。在生产环境下，不要依赖此端点的特性。
下面的例子使用 `jq` 命令来简化使用 JSON。按照所写的步骤，您需要安装 `jq` ，
但如果您喜欢手动提取 `kubeletconfig` 子对象，您也可以完成这个任务。

<!-- #### Generate the configuration file -->
#### 生成配置文件

<!--
1. Choose a Node to reconfigure. In this example, the name of this Node is
    referred to as `NODE_NAME`.
2. Start the kubectl proxy in the background using the following command:

      ```bash
      kubectl proxy --port=8001 &
      ```

3. Run the following command to download and unpack the configuration from the
    `configz` endpoint. The command is long, so be careful when copying and
    pasting. **If you use zsh**, note that common zsh configurations add backslashes
    to escape the opening and closing curly braces around the variable name in the URL.
    For example: `${NODE_NAME}` will be rewritten as `$\{NODE_NAME\}` during the paste.
    You must remove the backslashes before running the command, or the command will fail.

      ```bash
      NODE_NAME="the-name-of-the-node-you-are-reconfiguring"; curl -sSL "http://localhost:8001/api/v1/nodes/${NODE_NAME}/proxy/configz" | jq '.kubeletconfig|.kind="KubeletConfiguration"|.apiVersion="kubelet.config.k8s.io/v1beta1"' > kubelet_configz_${NODE_NAME}
      ```
-->

1. 选择一个节点去重新配置，在此示例中，此节点的名称为 `NODE_NAME`。
2. 使用以下命令在后台启动 kubectl 代理：

      ```bash
      kubectl proxy --port=8001 &
      ```

3. 运行以下命令从 `configz` 端点中下载并解压配置。这个命令很长，因此在复制和黏贴时要小心。
**如果您使用 zsh**，请注意常见的 zsh 配置添加反斜杠转义 URL 中变量名称周围的大括号的开始和结束。
例如：在粘贴期间，`$ {NODE_NAME}` 将被重写为 `$\{NODE_NAME\}`。
您必须在运行命令之前删除反斜杠，否则命令将失败。

 ```bash
      NODE_NAME="the-name-of-the-node-you-are-reconfiguring"; curl -sSL "http://localhost:8001/api/v1/nodes/${NODE_NAME}/proxy/configz" | jq '.kubeletconfig|.kind="KubeletConfiguration"|.apiVersion="kubelet.config.k8s.io/v1beta1"' > kubelet_configz_${NODE_NAME}
 ```

{{< note >}}

**注意**：You need to manually add the `kind` and `apiVersion` to the downloaded
object，because they are not reported by the `configz` endpoint。
您需要手动将 `kind` 和 `apiVersion` 添加到下载对象中，因为它们不是由 `configz` 端点报出的。

{{< /note >}}

<!-- #### Edit the configuration file -->
#### 修改配置文件
<!--
Using a text editor, change one of the parameters in the
file generated by the previous procedure. For example, you
might edit the QPS parameter `eventRecordQPS`.
-->

使用文本编辑器，在这个文件里，改变之前的程序生成的一个参数。例如，你或许会修改 QPS 参数  `eventRecordQPS`。

<!-- #### Push the configuration file to the control plane -->
#### 把配置文件推送到控制平面

<!--
Push the edited configuration file to the control plane with the
following command:

```bash
kubectl -n kube-system create configmap my-node-config --from-file=kubelet=kubelet_configz_${NODE_NAME} --append-hash -o yaml
```
-->

用以下命令把配置文件推送到控制平面：

```bash
kubectl -n kube-system create configmap my-node-config --from-file=kubelet=kubelet_configz_${NODE_NAME} --append-hash -o yaml
```

<!--
This is an example of a valid response:

```none
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
-->
这是一个有效响应的例子：

```none
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
The ConfigMap is created in the `kube-system` namespace because this
ConfigMap configures a Kubelet, which is Kubernetes system component.
-->

ConfigMap 是在 `kube-system` 命名空间中创建的，因为 ConfigMap 配置了 Kubelet，它是 Kubernetes 的系统组件。

<!--
The `--append-hash` option appends a short checksum of the ConfigMap contents
to the name. This is convenient for an edit-then-push workflow, because it
automatically, yet deterministically, generates new names for new ConfigMaps.
The name that includes this generated hash is referred to as `CONFIG_MAP_NAME`
in the following examples.
-->

`--append-hash` 选项给 ConfigMap 内容附加了一个简短校验和。这对于编辑然后推送工作流程很方便，因为它
自动并确定地为新 ConfigMaps 生成新的名称。在以下示例中，包含生成的哈希名称为 `CONFIG_MAP_NAME`。

<!-- #### Set the Node to use the new configuration -->
#### 用新配置创建新的节点

<!--
Edit the Node's reference to point to the new ConfigMap with the
following command:

```bash
kubectl edit node ${NODE_NAME}
```

In your text editor, add the following YAML under `spec`:

```yaml
configSource:
    configMap:
        name: CONFIG_MAP_NAME
        namespace: kube-system
        kubeletConfigKey: kubelet
```
-->

用下面的命令行编辑节点的参数来指向新的 ConfigMap：

```bash
kubectl edit node ${NODE_NAME}
```

<!-- In your text editor, add the following YAML under `spec`: -->
在您的文本编辑器中，在 `spec` 下增添以下 YAML：

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

您必须指定这三个参数中的每一个`name`，`namespace`和`kubeletConfigKey`。
`kubeletConfigKey`这个参数显示出 Kubelet 上的哪个 key 包含了 ConfigMap 的配置。

<!-- #### Observe that the Node begins using the new configuration -->
#### 使用新配置监察节点

<!--
Retrieve the Node using the `kubectl get node ${NODE_NAME} -o yaml` command and inspect
`Node.Status.Config`. The config sources corresponding to the `active`,
`assigned`, and `lastKnownGood` configurations are reported in the status.

- The `active` configuration is the version the Kubelet is currently running with.
- The `assigned` configuration is the latest version the Kubelet has resolved based on
  `Node.Spec.ConfigSource`.
- The `lastKnownGood` configuration is the version the
  Kubelet will fall back to if an invalid config is assigned in `Node.Spec.ConfigSource`.
-->

用 `kubectl get node ${NODE_NAME} -o yaml` 命令回收节点并用命令 `Node.Status.Config` 检查节点状态配置。
在这个状态报告的配置里，对应这些配置源`active`，`assigned`和 `lastKnownGood`。

- `active` 是 Kubelet 当前运行的版本。
- `assigned` 参数是 Kubelet 基于 `Node.Spec.ConfigSource` 的最新版本。
- `lastKnownGood` 参数是 Kubelet 的回退版本，如果在 `Node.Spec.ConfigSource` 中分配了无效的配置。

<!--
The`lastKnownGood` configuration might not be present if it is set to its default value,
the local config deployed with the node. The status will update `lastKnownGood` to
match a valid `assigned` config after the Kubelet becomes comfortable with the config.
The details of how the Kubelet determines a config should become the `lastKnownGood` are
not guaranteed by the API, but is currently implemented as a 10-minute grace period.
-->

如果用本地的配置部署节点，使其设置成默认值，这个`lastKnownGood`配置可能不存在。
在 Kubelet 配置好后，将更新 `lastKnownGood` 去匹配一个有效的 `assigned` 配置。
判断如何配置 Kubelet 的细节是使`lastKnownGood`不受 API 限制，但目前实施为 10 分钟的宽限期。

<!--
You can use the following command (using `jq`) to filter down
to the config status:

```bash
kubectl get no ${NODE_NAME} -o json | jq '.status.config'
```

The following is an example response:

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
-->
您可以使用以下命令（using `jq`）过滤到配置状态：

```bash
kubectl get no ${NODE_NAME} -o json | jq '.status.config'
```

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
If an error occurs, the Kubelet reports it in the `Node.Status.Config.Error`
structure. Possible errors are listed in
[Understanding Node.Status.Config.Error messages](#understanding-node-status-config-error-messages).
You can search for the identical text in the Kubelet log for additional details
and context about the error.
-->

如果发生错误，Kubelet 会在 `Node.Status.Config.Error` 中显示出它的结构体。可能的错误列在 [了解节点配置错误信息](#了解节点配置错误信息)。
您可以在 Kubelet 日志中搜索相同的文本以获取更多详细信息和有关错误的上下文。

<!-- #### Make more changes -->
#### 做出更多的改变

<!--
Follow the workflow above to make more changes and push them again. Each time
you push a ConfigMap with new contents, the --append-hash kubectl option creates
the ConfigMap with a new name. The safest rollout strategy is to first create a
new ConfigMap, and then update the Node to use the new ConfigMap.
-->

按照下面的工作流程做出更多的改变并再次推送它们。你每次推送一个 ConfigMap 的新内容时，--append-hash kubectl 选项都会给 ConfigMap 创建一个新的名称。
最安全的推出策略是首先创建一个新的 ConfigMap，然后更新 节点 以使用新的 ConfigMap。

<!-- #### Reset the Node to use its local default configuration -->
#### 重置节点以使用其本地默认配置

<!--
To reset the Node to use the configuration it was provisioned with, edit the
Node using `kubectl edit node ${NODE_NAME}` and remove the
`Node.Spec.ConfigSource` field.
-->
重置节点去使用已经配好的的配置，用 `kubectl edit node $ {NODE_NAME}` 命令编辑节点，并删除
`Node.Spec.ConfigSource` 字段。

<!-- #### Observe that the Node is using its local default configuration -->
#### 监察正在使用本地默认配置的节点

<!--
After removing this subfield, `Node.Status.Config` eventually becomes
empty, since all config sources have been reset to `nil`, which indicates that
the local default config is `assigned`, `active`, and `lastKnownGood`, and no
error is reported.
-->
在删除此字段后，`Node.Status.Config` 最终变成空，所有配置源都已重置为 `nil`，这表示
本地默认配置是`assigned`，`active` 和 `lastKnownGood`这三个参数，没有报告错误。



<!-- discussion -->

<!-- ## Kubectl Patch Example -->
## Kubectl 补丁示例

<!--
You can change a Node's configSource using several different mechanisms.
This example uses `kubectl patch`:

```bash
kubectl patch node ${NODE_NAME} -p "{\"spec\":{\"configSource\":{\"configMap\":{\"name\":\"${CONFIG_MAP_NAME}\",\"namespace\":\"kube-system\",\"kubeletConfigKey\":\"kubelet\"}}}}"
```
-->

您可以使用几种不同的机制来更改节点的 configSource。
这个例子使用`kubectl patch`：

```bash
kubectl patch node ${NODE_NAME} -p "{\"spec\":{\"configSource\":{\"configMap\":{\"name\":\"${CONFIG_MAP_NAME}\",\"namespace\":\"kube-system\",\"kubeletConfigKey\":\"kubelet\"}}}}"
```

<!-- ## Understanding how the Kubelet checkpoints config -->

## 了解 Kubelet 检查点的配置方式

<!--
When a new config is assigned to the Node, the Kubelet downloads and unpacks the
config payload as a set of files on the local disk. The Kubelet also records metadata
that locally tracks the assigned and last-known-good config sources, so that the
Kubelet knows which config to use across restarts, even if the API server becomes
unavailable. After checkpointing a config and the relevant metadata, the Kubelet
exits if it detects that the assigned config has changed. When the Kubelet is
restarted by the OS-level service manager (such as `systemd`), it reads the new
metadata and uses the new config.
-->

当为节点分配新配置时，Kubelet 会在本地磁盘上，下载并解压配置负载为一组文件。Kubelet 还记录元数据
在本地跟踪已分配和最后已知良好的配置源，以便 Kubelet 知道在重新启动时使用哪个配置，即使 API 服务器变为不可用。在检查点配置和相关元数据之后，如果检测到已分配的配置改变了，则 Kubelet 退出。当 Kubelet 被 OS 级服务管理器（例如`systemd`）重新启动时，它会读取新的元数据并使用新配置。

<!--
The recorded metadata is fully resolved, meaning that it contains all necessary
information to choose a specific config version - typically a `UID` and `ResourceVersion`.
This is in contrast to `Node.Spec.ConfigSource`, where the intended config is declared
via the idempotent `namespace/name` that identifies the target ConfigMap; the Kubelet
tries to use the latest version of this ConfigMap.
-->
当记录的元数据已被完全解析时，意味着它包含的所有必需的信息去选择一个指定的
配置版本通常是`UID`和`ResourceVersion`。与`Node.Spec.ConfigSource`形成对比，
通过幂等`namespace/name`预期声明配置来标识目标 ConfigMap；Kubelet 尝试使用此 ConfigMap 的最新版本。

<!--
When you are debugging problems on a node, you can inspect the Kubelet's config
metadata and checkpoints. The structure of the Kubelet's checkpointing directory is:

```none
- --dynamic-config-dir (root for managing dynamic config)
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

当您在节点上调试问题时，可以检查 Kubelet 的配置元数据和检查点。Kubelet 的检查点目录结构是：

```none
- --dynamic-config-dir (root for managing dynamic config)
| - meta
  | - assigned (encoded kubeletconfig/v1beta1.SerializedNodeConfigSource object, indicating the assigned config)
  | - last-known-good (encoded kubeletconfig/v1beta1.SerializedNodeConfigSource object, indicating the last-known-good config)
| - checkpoints
  | - uid1 (dir for versions of object identified by uid1)
    | - resourceVersion1 (dir for unpacked files from resourceVersion1 of object with uid1)
    | - ...
  | - ...
```

<!-- ## Understanding Node.Status.Config.Error messages -->

## 了解节点配置错误信息

<!--
The following table describes error messages that can occur
when using Dynamic Kubelet Config. You can search for the identical text
in the Kubelet log for additional details and context about the error.
-->

下表描述了使用 Dynamic Kubelet 配置时可能发生的错误消息。您可以在 Kubelet 日志中搜索相同的文本
来获取有关错误的其他详细信息和上下文。

<!--
<table>
<table align="left">
<tr>
    <th>Error Message</th>
    <th>Possible Causes</th>
</tr>
<tr>
    <td><p>failed to load config, see Kubelet log for details</p></td>
    <td><p>The Kubelet likely could not parse the downloaded config payload, or encountered a filesystem error attempting to load the payload from disk.</p></td>
</tr>
<tr>
    <td><p>failed to validate config, see Kubelet log for details</p></td>
    <td><p>The configuration in the payload, combined with any command-line flag overrides, and the sum of feature gates from flags, the config file, and the remote payload, was determined to be invalid by the Kubelet.</p></td>
</tr>
<tr>
    <td><p>invalid NodeConfigSource, exactly one subfield must be non-nil, but all were nil</p></td>
    <td><p>Since Node.Spec.ConfigSource is validated by the API server to contain at least one non-nil subfield, this likely means that the Kubelet is older than the API server and does not recognize a newer source type.</p></td>
</tr>
<tr>
    <td><p>failed to sync: failed to download config, see Kubelet log for details</p></td>
    <td><p>The Kubelet could not download the config. It is possible that Node.Spec.ConfigSource could not be resolved to a concrete API object, or that network errors disrupted the download attempt. The Kubelet will retry the download when in this error state.</p></td>
</tr>
<tr>
    <td><p>failed to sync: internal failure, see Kubelet log for details</p></td>
    <td><p>The Kubelet encountered some internal problem and failed to update its config as a result. Examples include filesystem errors and reading objects from the internal informer cache.</p></td>
</tr>
<tr>
    <td><p>internal failure, see Kubelet log for details</p></td>
    <td><p>The Kubelet encountered some internal problem while manipulating config, outside of the configuration sync loop.</p></td>
</tr>
</table>
-->
<table>
<table align="left">
<tr>
    <th>错误信息</th>
    <th>可能的原因</th>
</tr>
<tr>
    <td><p>无法加载配置，请参阅 Kubelet 日志了解详细信息</p></td>
    <td><p>Kubelet可能无法解析下载配置的有效负载，或者当尝试从磁盘中加载有效负载时，遇到文件系统错误。</p></td>
</tr>
<tr>
    <td><p>无法验证配置，请参阅 Kubelet 日志了解详细信息</p></td>
    <td><p>有效负载中的配置将任何命令行标志所覆盖的和这些标志的特性们合并，包括配置文件和远程有效负载，
    它们一起被 Kubelet 确定为无效。</p></td>
</tr>
<tr>
    <td><p>无效的 NodeConfigSource，理应刚好一个子字段必须是非空的，但这些字段都是空的</p></td>
    <td><p>由 API 服务器验证 Node.Spec.ConfigSource 是否包含至少一个非空子字段，可能原因是 Kubelet 比 API 服务器版本低，不识别更新的源类型。</p></td>
</tr>
<tr>
    <td><p>无法同步：无法下载配置，请参阅 Kubelet 日志了解详细信息</p></td>
    <td><p>Kubelet 无法下载配置。可能是 Node.Spec.ConfigSource 无法解析为具体的 API 对象，或者网络错误中断了下载。 当处于此错误状态时，Kubelet 将重新下载。</p></td>
</tr>
<tr>
    <td><p>无法同步：内部故障，请参阅 Kubelet 日志了解详细信息</p></td>
    <td><p>Kubelet遇到了一些内部问题，因此无法更新其配置。 例如包括文件系统错误和从内部函数缓存中读取对象。</p></td>
</tr>
<tr>
    <td><p>内部故障，请参阅 Kubelet 日志了解详细信息</p></td>
    <td><p>在配置同步循环之外操作配置时，Kubelet 遇到了一些内部问题。</p></td>
</tr>
</table>


