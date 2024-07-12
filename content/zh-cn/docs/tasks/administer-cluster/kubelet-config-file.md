---
title: 通过配置文件设置 kubelet 参数
content_type: task
weight: 330
---
<!--
reviewers:
- mtaufen
- dawnchen
title: Set Kubelet Parameters Via A Configuration File
content_type: task
weight: 330
--->

## {{% heading "prerequisites" %}}

<!--
Some steps in this page use the `jq` tool. If you don't have `jq`, you can
install it via your operating system's software sources, or fetch it from
[https://jqlang.github.io/jq/](https://jqlang.github.io/jq/).

Some steps also involve installing `curl`, which can be installed via your
operating system's software sources.
-->
此页面中的某些步骤使用 `jq` 工具。如果你没有 `jq`，你可以通过操作系统的软件源安装它，或者从
[https://jqlang.github.io/jq/](https://jqlang.github.io/jq/) 中获取它。

某些步骤还涉及安装 `curl`，它可以通过操作系统的软件源安装。

<!-- overview -->

<!--
A subset of the kubelet's configuration parameters may be
set via an on-disk config file, as a substitute for command-line flags.
--->
通过保存在硬盘的配置文件设置 kubelet 的部分配置参数，这可以作为命令行参数的替代。

<!--
Providing parameters via a config file is the recommended approach because
it simplifies node deployment and configuration management.
--->
建议通过配置文件的方式提供参数，因为这样可以简化节点部署和配置管理。

<!-- steps -->

<!--
## Create the config file

The subset of the kubelet's configuration that can be configured via a file
is defined by the
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
struct.
-->
## 创建配置文件   {#create-config-file}

[`KubeletConfiguration`](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)
结构体定义了可以通过文件配置的 kubelet 配置子集，

<!--
The configuration file must be a JSON or YAML representation of the parameters
in this struct. Make sure the kubelet has read permissions on the file.

Here is an example of what this file might look like:
-->
配置文件必须是这个结构体中参数的 JSON 或 YAML 表现形式。
确保 kubelet 可以读取该文件。

下面是一个 kubelet 配置文件示例：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
address: "192.168.0.8"
port: 20250
serializeImagePulls: false
evictionHard:
    memory.available:  "100Mi"
    nodefs.available:  "10%"
    nodefs.inodesFree: "5%"
    imagefs.available: "15%"
```

<!--
In this example, the kubelet is configured with the following settings:
-->
在此示例中，kubelet 配置为以下设置：

<!--
1. `address`: The kubelet will serve on IP address `192.168.0.8`.
1. `port`: The kubelet will serve on port `20250`.
1. `serializeImagePulls`: Image pulls will be done in parallel.
1. `evictionHard`: The kubelet will evict Pods under one of the following conditions:

   - When the node's available memory drops below 100MiB.
   - When the node's main filesystem's available space is less than 10%.
   - When the image filesystem's available space is less than 15%.
   - When more than 95% of the node's main filesystem's inodes are in use.
-->
1. `address`：kubelet 将在 `192.168.0.8` IP 地址上提供服务。
2. `port`：kubelet 将在 `20250` 端口上提供服务。
3. `serializeImagePulls`：并行拉取镜像。
4. `evictionHard`：kubelet 将在以下情况之一驱逐 Pod：
   - 当节点的可用内存降至 100MiB 以下时。
   - 当节点主文件系统的已使用 inode 超过 95%。
   - 当镜像文件系统的可用空间小于 15% 时。
   - 当节点主文件系统的 inode 超过 95% 正在使用时。

{{< note >}}
<!--
In the example, by changing the default value of only one parameter for
evictionHard, the default values of other parameters will not be inherited and
will be set to zero. In order to provide custom values, you should provide all
the threshold values respectively.
-->
在示例中，通过只更改 evictionHard 的一个参数的默认值，
其他参数的默认值将不会被继承，他们会被设置为零。如果要提供自定义值，你应该分别设置所有阈值。
{{< /note >}}

<!--
The `imagefs` is an optional filesystem that container runtimes use to store container
images and container writable layers.
-->
`imagefs` 是一个可选的文件系统，容器运行时使用它来存储容器镜像和容器可写层。

<!--
## Start a kubelet process configured via the config file
--->
## 启动通过配置文件配置的 kubelet 进程   {#start-kubelet-via-config-file}

{{< note >}}
<!--
If you use kubeadm to initialize your cluster, use the kubelet-config while creating your cluster with `kubeadm init`.
See [configuring kubelet using kubeadm](/docs/setup/production-environment/tools/kubeadm/kubelet-integration/) for details.
-->
如果你使用 kubeadm 初始化你的集群，在使用 `kubeadm init` 创建你的集群的时候请使用 kubelet-config。
更多细节请阅读[使用 kubeadm 配置 kubelet](/zh-cn/docs/setup/production-environment/tools/kubeadm/kubelet-integration/)
{{< /note >}}

<!--
Start the kubelet with the `--config` flag set to the path of the kubelet's config file.
The kubelet will then load its config from this file.
-->
启动 kubelet 需要将 `--config` 参数设置为 kubelet 配置文件的路径。kubelet 将从此文件加载其配置。

<!--
Note that command line flags which target the same value as a config file will override that value.
This helps ensure backwards compatibility with the command-line API.
-->
请注意，命令行参数与配置文件有相同的值时，就会覆盖配置文件中的该值。
这有助于确保命令行 API 的向后兼容性。

<!--
Note that relative file paths in the kubelet config file are resolved relative to the
location of the kubelet config file, whereas relative paths in command line flags are resolved
relative to the kubelet's current working directory.
-->
请注意，kubelet 配置文件中的相对文件路径是相对于 kubelet 配置文件的位置解析的，
而命令行参数中的相对路径是相对于 kubelet 的当前工作目录解析的。

<!--
Note that some default values differ between command-line flags and the kubelet config file.
If `--config` is provided and the values are not specified via the command line, the
defaults for the `KubeletConfiguration` version apply.
In the above example, this version is `kubelet.config.k8s.io/v1beta1`.
--->
请注意，命令行参数和 kubelet 配置文件的某些默认值不同。
如果设置了 `--config`，并且没有通过命令行指定值，则 `KubeletConfiguration`
版本的默认值生效。在上面的例子中，version 是 `kubelet.config.k8s.io/v1beta1`。

<!--
## Drop-in directory for kubelet configuration files {#kubelet-conf-d}
-->
## kubelet 配置文件的插件目录   {#kubelet-conf-d}

{{<feature-state for_k8s_version="v1.30" state="beta" >}}

<!--
You can specify a drop-in configuration directory for the kubelet. By default, the kubelet does not look
for drop-in configuration files anywhere - you must specify a path.
For example: `--config-dir=/etc/kubernetes/kubelet.conf.d`
-->
你可以为 kubelet 指定一个插件配置目录。默认情况下，kubelet
不会在任何地方查找插件配置文件 - 你必须指定路径。
例如：`--config-dir=/etc/kubernetes/kubelet.conf.d`

<!--
For Kubernetes v1.28 to v1.29, you can only specify `--config-dir` if you also set
the environment variable `KUBELET_CONFIG_DROPIN_DIR_ALPHA` for the kubelet process (the value
of that variable does not matter).
-->
对于 Kubernetes v1.28 到 v1.29，如果你还为 kubelet
进程设置了环境变量 `KUBELET_CONFIG_DROPIN_DIR_ALPHA`（该变量的值无关紧要），
则只能指定 `--config-dir`。

{{< note >}}
<!--
The suffix of a valid kubelet drop-in configuration file **must** be `.conf`. For instance: `99-kubelet-address.conf`
-->
合法的 kubelet 插件配置文件的后缀**必须**为 `.conf`。例如 `99-kubelet-address.conf`。
{{< /note >}}

<!--
The kubelet processes files in its config drop-in directory by sorting the **entire file name** alphanumerically.
For instance, `00-kubelet.conf` is processed first, and then overridden with a file named `01-kubelet.conf`.
-->
kubelet 通过按字母数字顺序对**整个文件名**进行排序来处理其配置插件目录中的文件。
例如，首先处理 `00-kubelet.conf`，然后用名为 `01-kubelet.conf` 的文件覆盖。

<!--
These files may contain partial configurations but should not be invalid and must include type metadata, specifically `apiVersion` and `kind`.
Validation is only performed on the final resulting configuration structure stored internally in the kubelet.
This offers flexibility in managing and merging kubelet configurations from different sources while preventing undesirable configurations. 
However, it is important to note that behavior varies based on the data type of the configuration fields.
-->
这些文件可能包含部分配置，但不应无效，并且必须包含类型元数据，特别是 `apiVersion` 和 `kind`。
仅对 kubelet 内部存储的、最终生成的配置结构执行验证。
这为管理和合并来自不同来源的 kubelet 配置提供了灵活性，同时防止了不需要的配置。
但是，请务必注意，产生的行为会根据配置字段的数据类型而有所不同。

<!--
Different data types in the kubelet configuration structure merge differently. See the
[reference document](/docs/reference/node/kubelet-config-directory-merging)
for more information.
-->
kubelet 配置结构中不同数据类型的合并方式不同。
有关详细信息，请参阅[参考文档](/zh-cn/docs/reference/node/kubelet-config-directory-merging)。

<!--
### Kubelet configuration merging order
-->
### kubelet 配置合并顺序    {#kubelet-configuration-merging-order}

<!--
On startup, the kubelet merges configuration from:

* Feature gates specified over the command line (lowest precedence).
* The kubelet configuration.
* Drop-in configuration files, according to sort order.
* Command line arguments excluding feature gates (highest precedence).
-->
在启动时，kubelet 会合并来自以下几部分的配置：

* 在命令行中指定的特性门控（优先级最低）。
* kubelet 配置文件。
* 排序的插件配置文件。
* 不包括特性门控的命令行参数（优先级最高）。

{{< note >}}
<!--
The config drop-in dir mechanism for the kubelet is similar but different from how the `kubeadm` tool allows you to patch configuration.
The `kubeadm` tool uses a specific [patching strategy](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/#patches)
for its configuration, whereas the only patch strategy for kubelet configuration drop-in files is `replace`.
The kubelet determines the order of merges based on sorting the **suffixes** alphanumerically,
and replaces every field present in a higher priority file.
-->
kubelet 的配置插件目录机制类似，但与 `kubeadm` 工具允许 patch 配置的方式不同。
`kubeadm` 工具使用特定的[补丁策略](/zh-cn/docs/setup/production-environment/tools/kubeadm/control-plane-flags/#patches)，
而 kubelet 配置插件文件的唯一补丁策略是 `replace`。kubelet 根据字母数字对**后缀**进行排序来确定合并顺序，
并替换更高优先级文件中存在的每个字段。
{{< /note >}}

<!--
## Viewing the kubelet configuration
-->
## 查看 kubelet 配置   {#viewing-the-kubelet-configuration}

<!--
Since the configuration could now be spread over multiple files with this feature, if someone wants to inspect the final actuated configuration,
they can follow these steps to inspect the kubelet configuration:
-->
由于现在可以使用此特性将配置分布在多个文件中，因此如果有人想要检查最终启动的配置，
他们可以按照以下步骤检查 kubelet 配置：

<!--
1. Start a proxy server using [`kubectl proxy`](/docs/reference/kubectl/generated/kubectl-commands#proxy) in your terminal.
-->
1. 在终端中使用 [`kubectl proxy`](/docs/reference/kubectl/generated/kubectl-commands#proxy) 启动代理服务器。

   ```bash
   kubectl proxy
   ```

   <!--
   Which gives output like:
   -->
   其输出如下：

   ```none
   Starting to serve on 127.0.0.1:8001
   ```

<!--
1. Open another terminal window and use `curl` to fetch the kubelet configuration.
   Replace `<node-name>` with the actual name of your node:
-->
2. 打开另一个终端窗口并使用 `curl` 来获取 kubelet 配置。
   将 `<node-name>` 替换为节点的实际名称：

   ```bash
   curl -X GET http://127.0.0.1:8001/api/v1/nodes/<node-name>/proxy/configz | jq .
   ```

   ```json
   {
     "kubeletconfig": {
       "enableServer": true,
       "staticPodPath": "/var/run/kubernetes/static-pods",
       "syncFrequency": "1m0s",
       "fileCheckFrequency": "20s",
       "httpCheckFrequency": "20s",
       "address": "192.168.1.16",
       "port": 10250,
       "readOnlyPort": 10255,
       "tlsCertFile": "/var/lib/kubelet/pki/kubelet.crt",
       "tlsPrivateKeyFile": "/var/lib/kubelet/pki/kubelet.key",
       "rotateCertificates": true,
       "authentication": {
         "x509": {
           "clientCAFile": "/var/run/kubernetes/client-ca.crt"
         },
         "webhook": {
           "enabled": true,
           "cacheTTL": "2m0s"
         },
         "anonymous": {
           "enabled": true
         }
       },
       "authorization": {
         "mode": "AlwaysAllow",
         "webhook": {
           "cacheAuthorizedTTL": "5m0s",
           "cacheUnauthorizedTTL": "30s"
         }
       },
       "registryPullQPS": 5,
       "registryBurst": 10,
       "eventRecordQPS": 50,
       "eventBurst": 100,
       "enableDebuggingHandlers": true,
       "healthzPort": 10248,
       "healthzBindAddress": "127.0.0.1",
       "oomScoreAdj": -999,
       "clusterDomain": "cluster.local",
       "clusterDNS": [
         "10.0.0.10"
       ],
       "streamingConnectionIdleTimeout": "4h0m0s",
       "nodeStatusUpdateFrequency": "10s",
       "nodeStatusReportFrequency": "5m0s",
       "nodeLeaseDurationSeconds": 40,
       "imageMinimumGCAge": "2m0s",
       "imageMaximumGCAge": "0s",
       "imageGCHighThresholdPercent": 85,
       "imageGCLowThresholdPercent": 80,
       "volumeStatsAggPeriod": "1m0s",
       "cgroupsPerQOS": true,
       "cgroupDriver": "systemd",
       "cpuManagerPolicy": "none",
       "cpuManagerReconcilePeriod": "10s",
       "memoryManagerPolicy": "None",
       "topologyManagerPolicy": "none",
       "topologyManagerScope": "container",
       "runtimeRequestTimeout": "2m0s",
       "hairpinMode": "promiscuous-bridge",
       "maxPods": 110,
       "podPidsLimit": -1,
       "resolvConf": "/run/systemd/resolve/resolv.conf",
       "cpuCFSQuota": true,
       "cpuCFSQuotaPeriod": "100ms",
       "nodeStatusMaxImages": 50,
       "maxOpenFiles": 1000000,
       "contentType": "application/vnd.kubernetes.protobuf",
       "kubeAPIQPS": 50,
       "kubeAPIBurst": 100,
       "serializeImagePulls": true,
       "evictionHard": {
         "imagefs.available": "15%",
         "memory.available": "100Mi",
         "nodefs.available": "10%",
         "nodefs.inodesFree": "5%"
       },
       "evictionPressureTransitionPeriod": "1m0s",
       "enableControllerAttachDetach": true,
       "makeIPTablesUtilChains": true,
       "iptablesMasqueradeBit": 14,
       "iptablesDropBit": 15,
       "featureGates": {
         "AllAlpha": false
       },
       "failSwapOn": false,
       "memorySwap": {},
       "containerLogMaxSize": "10Mi",
       "containerLogMaxFiles": 5,
       "configMapAndSecretChangeDetectionStrategy": "Watch",
       "enforceNodeAllocatable": [
         "pods"
       ],
       "volumePluginDir": "/usr/libexec/kubernetes/kubelet-plugins/volume/exec/",
       "logging": {
         "format": "text",
         "flushFrequency": "5s",
         "verbosity": 3,
         "options": {
           "json": {
             "infoBufferSize": "0"
           }
         }
       },
       "enableSystemLogHandler": true,
       "enableSystemLogQuery": false,
       "shutdownGracePeriod": "0s",
       "shutdownGracePeriodCriticalPods": "0s",
       "enableProfilingHandler": true,
       "enableDebugFlagsHandler": true,
       "seccompDefault": false,
       "memoryThrottlingFactor": 0.9,
       "registerNode": true,
       "localStorageCapacityIsolation": true,
       "containerRuntimeEndpoint": "unix:///var/run/crio/crio.sock"
     }
   }
   ```

<!-- discussion -->

## {{% heading "whatsnext" %}}

<!--
- Learn more about kubelet configuration by checking the
  [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
  reference.
- Learn more about kubelet configuration merging in the
  [reference document](/docs/reference/node/kubelet-config-directory-merging).
--->
- 参阅 [`KubeletConfiguration`](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)
  进一步学习 kubelet 的配置。
- 在[参考文档](/zh-cn/docs/reference/node/kubelet-config-directory-merging)中了解有关
  kubelet 配置合并的更多信息。
