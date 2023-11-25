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
2. `port`: The kubelet will serve on port `20250`.
3. `serializeImagePulls`: Image pulls will be done in parallel.
4. `evictionHard`: The kubelet will evict Pods under one of the following conditions:
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

As of Kubernetes v1.28.0, the Kubelet has been extended to support a drop-in configuration directory. The location of it can be specified with
`--config-dir` flag, and it defaults to `""`, or disabled, by default.
-->
## kubelet 配置文件的插件目录   {#kubelet-conf-d}

自 Kubernetes v1.28.0 起，kubelet 被扩展以支持一个插件配置目录。
该目录的位置可以使用 `--config-dir` 标志来指定，默认为 `""`，也就是被禁用状态。

<!--
You can only set `--config-dir` if you set the environment variable `KUBELET_CONFIG_DROPIN_DIR_ALPHA` for the kubelet process (the value of that variable does not matter).
For Kubernetes v{{< skew currentVersion >}}, the kubelet returns an error if you specify `--config-dir` without that variable set, and startup fails.
You cannot specify the drop-in configuration directory using the kubelet configuration file; only the CLI argument `--config-dir` can set it.
-->
只有在为 kubelet 进程设置环境变量 `KUBELET_CONFIG_DROPIN_DIR_ALPHA`
（该变量的值无关紧要）时才可以设置 `--config-dir`。对于 Kubernetes v{{< skew currentVersion >}}，
如果你未设置该变量而指定了 `--config-dir`，kubelet 将返回错误并且启动失败。
你不能使用 kubelet 配置文件指定插件配置目录；只能使用 CLI 参数 `--config-dir` 进行设置。

<!--
One can use the kubelet configuration directory in a similar way to the kubelet config file.
-->
你可以以类似于 kubelet 配置文件的方式使用 kubelet 配置目录。

{{< note >}}
<!--
The suffix of a valid kubelet drop-in configuration file must be `.conf`. For instance: `99-kubelet-address.conf`
-->
合法的 kubelet 插件配置文件的后缀必须为 `.conf`。例如 `99-kubelet-address.conf`。
{{< /note >}}

<!--
For instance, you may want a baseline kubelet configuration for all nodes, but you may want to customize the `address` field. This can be done as follows:

Main kubelet configuration file contents:
-->
例如，你可能想要为所有节点设置一个基准的 kubelet 配置，但你可能想要自定义 `address` 字段。
可以按如下方式操作：

kubelet 配置文件的主要内容如下：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
port: 20250
serializeImagePulls: false
evictionHard:
    memory.available:  "200Mi"
```

<!--
Contents of a file in `--config-dir` directory:
-->
`--config-dir` 目录中某个文件的内容如下：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
address: "192.168.0.8"
```

<!--
On startup, the kubelet merges configuration from:

* Command line arguments (lowest precedence).
* the kubelet configuration
* Drop-in configuration files, according to sort order.
* Feature gates specified over the command line (highest precedence).
-->
在启动时，kubelet 会合并来自以下几部分的配置：

* 命令行参数（优先级最低）。
* kubelet 配置文件。
* 排序的插件配置文件。
* 在命令行中指定的特性门控（优先级最高）。

<!--
This produces the same outcome as if you used the [single configuration file](#create-the-config-file) used in the earlier example.
-->
这将产生与之前示例中使用的[单个配置文件](#create-the-config-file)相同的结果。

<!-- discussion -->

## {{% heading "whatsnext" %}}

<!--
- Learn more about kubelet configuration by checking the
  [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
  reference.
--->
- 参阅 [`KubeletConfiguration`](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)
  进一步学习 kubelet 的配置。
