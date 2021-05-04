---
reviewers:
- sig-cluster-lifecycle
title: 使用 kubeadm 配置集群中的每个 kubelet
content_type: concept
weight: 80
---
<!--
reviewers:
- sig-cluster-lifecycle
title: Configuring each kubelet in your cluster using kubeadm
content_type: concept
weight: 80
-->

<!-- overview -->

{{< feature-state for_k8s_version="1.11" state="stable" >}}

<!--
The lifecycle of the kubeadm CLI tool is decoupled from the
[kubelet](/docs/reference/command-line-tools-reference/kubelet), which is a daemon that runs
on each node within the Kubernetes cluster. The kubeadm CLI tool is executed by the user when Kubernetes is
initialized or upgraded, where as the kubelet is always running in the background.

Since the kubelet is a daemon, it needs to be maintained by some kind of an init
system or service manager. When the kubelet is installed using DEBs or RPMs,
systemd is configured to manage the kubelet. You can use a different service
manager instead, but you need to configure it manually.

Some kubelet configuration details need to be the same across all kubelets involved in the cluster, while
other configuration aspects need to be set on a per-kubelet basis to accommodate the different
characteristics of a given machine (such as OS, storage, and networking). You can manage the configuration
of your kubelets manually, but kubeadm now provides a `KubeletConfiguration` API type for
[managing your kubelet configurations centrally](#configure-kubelets-using-kubeadm).
-->
kubeadm CLI 工具的生命周期与 [kubelet](/zh/docs/reference/command-line-tools-reference/kubelet)
解耦；kubelet 是一个守护程序，在 Kubernetes 集群中的每个节点上运行。
当 Kubernetes 初始化或升级时，kubeadm CLI 工具由用户执行，而 kubelet 始终在后台运行。

由于kubelet是守护程序，因此需要通过某种初始化系统或服务管理器进行维护。
当使用 DEB 或 RPM 安装 kubelet 时，配置系统去管理 kubelet。
你可以改用其他服务管理器，但需要手动地配置。

集群中涉及的所有 kubelet 的一些配置细节都必须相同，
而其他配置方面则需要基于每个 kubelet 进行设置，以适应给定机器的不同特性（例如操作系统、存储和网络）。
你可以手动地管理 kubelet 的配置，但是 kubeadm 现在提供一种 `KubeletConfiguration` API 类型
用于[集中管理 kubelet 的配置](#configure-kubelets-using-kubeadm)。

<!-- body -->

<!--
## Kubelet configuration patterns

The following sections describe patterns to kubelet configuration that are simplified by
using kubeadm, rather than managing the kubelet configuration for each Node manually.
-->
## Kubelet 配置模式

以下各节讲述了通过使用 kubeadm 简化 kubelet 配置模式，而不是在每个节点上手动地管理 kubelet 配置。

<!--
### Propagating cluster-level configuration to each kubelet

You can provide the kubelet with default values to be used by `kubeadm init` and `kubeadm join`
commands. Interesting examples include using a different CRI runtime or setting the default subnet
used by services.

If you want your services to use the subnet `10.96.0.0/12` as the default for services, you can pass
the `--service-cidr` parameter to kubeadm:

```bash
kubeadm init --service-cidr 10.96.0.0/12
```

Virtual IPs for services are now allocated from this subnet. You also need to set the DNS address used
by the kubelet, using the `--cluster-dns` flag. This setting needs to be the same for every kubelet
on every manager and Node in the cluster. The kubelet provides a versioned, structured API object
that can configure most parameters in the kubelet and push out this configuration to each running
kubelet in the cluster. This object is called
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/). 
The `KubeletConfiguration` allows the user to specify flags such as the cluster DNS IP addresses expressed as
a list of values to a camelCased key, illustrated by the following example:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
clusterDNS:
- 10.96.0.10
```

For more details on the `KubeletConfiguration` have a look at [this section](#configure-kubelets-using-kubeadm).
-->
### 将集群级配置传播到每个 kubelet 中

你可以通过使用 `kubeadm init` 和 `kubeadm join` 命令为 kubelet 提供默认值。
有趣的示例包括使用其他 CRI 运行时或通过服务器设置不同的默认子网。

如果你想使用子网 `10.96.0.0/12` 作为默认的服务，你可以给 kubeadm 传递 `--service-cidr` 参数：

```bash
kubeadm init --service-cidr 10.96.0.0/12
```

现在，可以从该子网分配服务的虚拟 IP。
你还需要通过 kubelet 使用 `--cluster-dns` 标志设置 DNS 地址。
在集群中的每个管理器和节点上的 kubelet 的设置需要相同。
kubelet 提供了一个版本化的结构化 API 对象，该对象可以配置 kubelet 中的大多数参数，并将此配置推送到集群中正在运行的每个 kubelet 上。
此对象被称为 [`KubeletConfiguration`](/zh/docs/reference/config-api/kubelet-config.v1beta1/)。
`KubeletConfiguration` 允许用户指定标志，例如用骆峰值代表集群的 DNS IP 地址，如下所示：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
clusterDNS:
- 10.96.0.10
```

有关 `KubeletConfiguration` 的更多详细信息，亲参阅[本节](#configure-kubelets-using-kubeadm)。

<!--
### Providing instance-specific configuration details

Some hosts require specific kubelet configurations due to differences in hardware, operating system,
networking, or other host-specific parameters. The following list provides a few examples.

- The path to the DNS resolution file, as specified by the `--resolv-conf` kubelet
  configuration flag, may differ among operating systems, or depending on whether you are using
  `systemd-resolved`. If this path is wrong, DNS resolution will fail on the Node whose kubelet
  is configured incorrectly.

- The Node API object `.metadata.name` is set to the machine's hostname by default,
  unless you are using a cloud provider. You can use the `--hostname-override` flag to override the
  default behavior if you need to specify a Node name different from the machine's hostname.

- Currently, the kubelet cannot automatically detect the cgroup driver used by the CRI runtime,
  but the value of `--cgroup-driver` must match the cgroup driver used by the CRI runtime to ensure
  the health of the kubelet.

- Depending on the CRI runtime your cluster uses, you may need to specify different flags to the kubelet.
  For instance, when using Docker, you need to specify flags such as `--network-plugin=cni`, but if you
  are using an external runtime, you need to specify `--container-runtime=remote` and specify the CRI
  endpoint using the `--container-runtime-endpoint=<path>`.

You can specify these flags by configuring an individual kubelet's configuration in your service manager,
such as systemd.
-->
### 提供指定实例的详细配置信息

由于硬件、操作系统、网络或者其他主机特定参数的差异。某些主机需要特定的 kubelet 配置。
以下列表提供了一些示例。

- 由 kubelet 配置标志 `--resolv-conf` 指定的 DNS 解析文件的路径在操作系统之间可能有所不同，
  它取决于你是否使用 `systemd-resolved`。
  如果此路径错误，则在其 kubelet 配置错误的节点上 DNS 解析也将失败。

- 除非你使用云驱动，否则默认情况下 Node API 对象的 `.metadata.name` 会被设置为计算机的主机名。
  如果你需要指定一个与机器的主机名不同的节点名称，你可以使用 `--hostname-override` 标志覆盖默认值。

- 当前，kubelet 无法自动检测 CRI 运行时使用的 cgroup 驱动程序，
  但是值 `--cgroup-driver` 必须与 CRI 运行时使用的 cgroup 驱动程序匹配，以确保 kubelet 的健康运行状况。

- 取决于你的集群所使用的 CRI 运行时，你可能需要为 kubelet 指定不同的标志。
  例如，当使用 Docker 时，你需要指定如 `--network-plugin=cni` 这类标志；但是如果你使用的是外部运行时，
  则需要指定 `--container-runtime=remote` 并使用 `--container-runtime-endpoint=<path>` 指定 CRI 端点。

你可以在服务管理器（例如 systemd）中设定某个 kubelet 的配置来指定这些参数。

<!--
## Configure kubelets using kubeadm

It is possible to configure the kubelet that kubeadm will start if a custom `KubeletConfiguration`
API object is passed with a configuration file like so `kubeadm ... --config some-config-file.yaml`.

By calling `kubeadm config print init-defaults --component-configs KubeletConfiguration` you can
see all the default values for this structure.

Also have a look at the
[reference for the KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/)
for more information on the individual fields.
-->
## 使用 kubeadm 配置 kubelet

如果自定义的 `KubeletConfiguration` API 对象使用像  `kubeadm ... --config some-config-file.yaml` 这样的配置文件进行传递，则可以配置 kubeadm 启动的 kubelet。

通过调用 `kubeadm config print init-defaults --component-configs KubeletConfiguration`，
你可以看到此结构中的所有默认值。

也可以阅读 [KubeletConfiguration 参考](/docs/reference/config-api/kubelet-config.v1beta1/)
来获取有关各个字段的更多信息。

<!--
### Workflow when using `kubeadm init`

When you call `kubeadm init`, the kubelet configuration is marshalled to disk
at `/var/lib/kubelet/config.yaml`, and also uploaded to a ConfigMap in the cluster. The ConfigMap
is named `kubelet-config-1.X`, where `X` is the minor version of the Kubernetes version you are
initializing. A kubelet configuration file is also written to `/etc/kubernetes/kubelet.conf` with the
baseline cluster-wide configuration for all kubelets in the cluster. This configuration file
points to the client certificates that allow the kubelet to communicate with the API server. This
addresses the need to
[propagate cluster-level configuration to each kubelet](#propagating-cluster-level-configuration-to-each-kubelet).

To address the second pattern of
[providing instance-specific configuration details](#providing-instance-specific-configuration-details),
kubeadm writes an environment file to `/var/lib/kubelet/kubeadm-flags.env`, which contains a list of
flags to pass to the kubelet when it starts. The flags are presented in the file like this:

```bash
KUBELET_KUBEADM_ARGS="--flag1=value1 --flag2=value2 ..."
```

In addition to the flags used when starting the kubelet, the file also contains dynamic
parameters such as the cgroup driver and whether to use a different CRI runtime socket
(`--cri-socket`).

After marshalling these two files to disk, kubeadm attempts to run the following two
commands, if you are using systemd:

```bash
systemctl daemon-reload && systemctl restart kubelet
```

If the reload and restart are successful, the normal `kubeadm init` workflow continues.
-->
### 当使用 `kubeadm init`时的工作流程

当调用 `kubeadm init` 时，kubelet 配置被编组到磁盘上的 `/var/lib/kubelet/config.yaml` 中，
并且上传到集群中的 ConfigMap。
ConfigMap 名为 `kubelet-config-1.X`，其中 `X` 是你正在初始化的 kubernetes 版本的次版本。
在集群中所有 kubelet 的基准集群范围内配置，将 kubelet 配置文件写入 `/etc/kubernetes/kubelet.conf` 中。
此配置文件指向允许 kubelet 与 API 服务器通信的客户端证书。
这解决了 [将集群级配置传播到每个 kubelet](#propagating-cluster-level-configuration-to-each-kubelet)的需求。

该文档 [提供特定实例的配置详细信息](#providing-instance-specific-configuration-details) 是第二种解决模式，
kubeadm 将环境文件写入 `/var/lib/kubelet/kubeadm-flags.env`，其中包含了一个标志列表，
当 kubelet 启动时，该标志列表会传递给 kubelet 标志在文件中的显示方式如下：

```bash
KUBELET_KUBEADM_ARGS="--flag1=value1 --flag2=value2 ..."
```

除了启动 kubelet 时使用该标志外，该文件还包含动态参数，例如 cgroup 驱动程序以及是否使用其他 CRI 运行时 socket（`--cri-socket`）。

将这两个文件编组到磁盘后，如果使用 systemd，则 kubeadm 尝试运行以下两个命令：

```bash
systemctl daemon-reload && systemctl restart kubelet
```

如果重新加载和重新启动成功，则正常的 `kubeadm init` 工作流程将继续。

<!--
### Workflow when using `kubeadm join`

When you run `kubeadm join`, kubeadm uses the Bootstrap Token credential to perform
a TLS bootstrap, which fetches the credential needed to download the
`kubelet-config-1.X` ConfigMap and writes it to `/var/lib/kubelet/config.yaml`. The dynamic
environment file is generated in exactly the same way as `kubeadm init`.

Next, `kubeadm` runs the following two commands to load the new configuration into the kubelet:

```bash
systemctl daemon-reload && systemctl restart kubelet
```

After the kubelet loads the new configuration, kubeadm writes the
`/etc/kubernetes/bootstrap-kubelet.conf` KubeConfig file, which contains a CA certificate and Bootstrap
Token. These are used by the kubelet to perform the TLS Bootstrap and obtain a unique
credential, which is stored in `/etc/kubernetes/kubelet.conf`. When this file is written, the kubelet
has finished performing the TLS Bootstrap.
-->
### 当使用 `kubeadm join`时的工作流程

当运行 `kubeadm join` 时，kubeadm 使用 Bootstrap Token 证书执行 TLS 引导，该引导会获取一份证书，该证书需要下载 `kubelet-config-1.X` ConfigMap 并把它写入 `/var/lib/kubelet/config.yaml` 中。
动态环境文件的生成方式恰好与 `kubeadm init` 相同。

接下来，kubeadm 运行以下两个命令将新配置加载到 kubelet 中：

```bash
systemctl daemon-reload && systemctl restart kubelet
```

在 kubelet 加载新配置后，kubeadm 将写入 `/etc/kubernetes/bootstrap-kubelet.conf` KubeConfig 文件中，
该文件包含 CA 证书和引导程序令牌。
kubelet 使用这些证书执行 TLS 引导程序并获取唯一的凭据，该凭据被存储在 `/etc/kubernetes/kubelet.conf` 中。
当此文件被写入后，kubelet 就完成了执行 TLS 引导程序。

<!--
##  The kubelet drop-in file for systemd

`kubeadm` ships with configuration for how systemd should run the kubelet.
Note that the kubeadm CLI command never touches this drop-in file.

This configuration file installed by the `kubeadm`
[DEB](https://github.com/kubernetes/release/blob/master/cmd/kubepkg/templates/latest/deb/kubeadm/10-kubeadm.conf) or
[RPM package](https://github.com/kubernetes/release/blob/master/cmd/kubepkg/templates/latest/rpm/kubeadm/10-kubeadm.conf) is written to
`/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` and is used by systemd.
It augments the basic
[`kubelet.service` for RPM](https://github.com/kubernetes/release/blob/master/cmd/kubepkg/templates/latest/rpm/kubelet/kubelet.service) or
[`kubelet.service` for DEB](https://github.com/kubernetes/release/blob/master/cmd/kubepkg/templates/latest/deb/kubelet/lib/systemd/system/kubelet.service):

```none
[Service]
Environment="KUBELET_KUBECONFIG_ARGS=--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf
--kubeconfig=/etc/kubernetes/kubelet.conf"
Environment="KUBELET_CONFIG_ARGS=--config=/var/lib/kubelet/config.yaml"
# This is a file that "kubeadm init" and "kubeadm join" generate at runtime, populating
the KUBELET_KUBEADM_ARGS variable dynamically
EnvironmentFile=-/var/lib/kubelet/kubeadm-flags.env
# This is a file that the user can use for overrides of the kubelet args as a last resort.
# Preferably, the user should use the .NodeRegistration.KubeletExtraArgs object in the configuration files instead.
# KUBELET_EXTRA_ARGS should be sourced from this file.
EnvironmentFile=-/etc/default/kubelet
ExecStart=
ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_CONFIG_ARGS $KUBELET_KUBEADM_ARGS $KUBELET_EXTRA_ARGS
```

This file specifies the default locations for all of the files managed by kubeadm for the kubelet.

- The KubeConfig file to use for the TLS Bootstrap is `/etc/kubernetes/bootstrap-kubelet.conf`,
  but it is only used if `/etc/kubernetes/kubelet.conf` does not exist.
- The KubeConfig file with the unique kubelet identity is `/etc/kubernetes/kubelet.conf`.
- The file containing the kubelet's ComponentConfig is `/var/lib/kubelet/config.yaml`.
- The dynamic environment file that contains `KUBELET_KUBEADM_ARGS` is sourced from `/var/lib/kubelet/kubeadm-flags.env`.
- The file that can contain user-specified flag overrides with `KUBELET_EXTRA_ARGS` is sourced from
  `/etc/default/kubelet` (for DEBs), or `/etc/sysconfig/kubelet` (for RPMs). `KUBELET_EXTRA_ARGS`
  is last in the flag chain and has the highest priority in the event of conflicting settings.
-->
##  kubelet 的 systemd 文件 {#the-kubelet-drop-in-file-for-systemd}

`kubeadm` 中附带了有关系统如何运行 kubelet 的 systemd 配置文件。
请注意 kubeadm CLI 命令不会修改此文件。

通过 `kubeadm` [DEB](https://github.com/kubernetes/release/blob/master/cmd/kubepkg/templates/latest/deb/kubeadm/10-kubeadm.conf) 
或者 [RPM 包](https://github.com/kubernetes/release/blob/master/cmd/kubepkg/templates/latest/rpm/kubeadm/10-kubeadm.conf) 
安装的配置文件被写入 `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` 并由系统使用。
它对原来的 [RPM 版本 `kubelet.service`](https://github.com/kubernetes/release/blob/master/cmd/kubepkg/templates/latest/rpm/kubelet/kubelet.service) 
或者 [DEB 版本 `kubelet.service`](https://github.com/kubernetes/release/blob/master/cmd/kubepkg/templates/latest/deb/kubelet/lib/systemd/system/kubelet.service)
作了增强：

```none
[Service]
Environment="KUBELET_KUBECONFIG_ARGS=--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf
--kubeconfig=/etc/kubernetes/kubelet.conf"
Environment="KUBELET_CONFIG_ARGS=--config=/var/lib/kubelet/config.yaml"
# 这是 "kubeadm init" 和 "kubeadm join" 运行时生成的文件，动态地填充 KUBELET_KUBEADM_ARGS 变量
EnvironmentFile=-/var/lib/kubelet/kubeadm-flags.env
# 这是一个文件，用户在不得已下可以将其用作替代 kubelet args。
# 用户最好使用 .NodeRegistration.KubeletExtraArgs 对象在配置文件中替代。
# KUBELET_EXTRA_ARGS 应该从此文件中获取。
EnvironmentFile=-/etc/default/kubelet
ExecStart=
ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_CONFIG_ARGS $KUBELET_KUBEADM_ARGS $KUBELET_EXTRA_ARGS
```

该文件为 kubelet 指定由 kubeadm 管理的所有文件的默认位置。

- 用于 TLS 引导程序的 KubeConfig 文件为 `/etc/kubernetes/bootstrap-kubelet.conf`，
  但仅当 `/etc/kubernetes/kubelet.conf` 不存在时才能使用。
- 具有唯一 kubelet 标识的 KubeConfig 文件为 `/etc/kubernetes/kubelet.conf`。
- 包含 kubelet 的组件配置的文件为 `/var/lib/kubelet/config.yaml`。
- 包含的动态环境的文件 `KUBELET_KUBEADM_ARGS` 是来源于 `/var/lib/kubelet/kubeadm-flags.env`。
- 包含用户指定标志替代的文件 `KUBELET_EXTRA_ARGS` 是来源于
  `/etc/default/kubelet`（对于 DEB），或者 `/etc/sysconfig/kubelet`（对于 RPM）。
  `KUBELET_EXTRA_ARGS` 在标志链中排在最后，并且在设置冲突时具有最高优先级。

<!--
## Kubernetes binaries and package contents

The DEB and RPM packages shipped with the Kubernetes releases are:

| Package name   | Description |
|----------------|-------------|
| `kubeadm`      | Installs the `/usr/bin/kubeadm` CLI tool and the [kubelet drop-in file](#the-kubelet-drop-in-file-for-systemd) for the kubelet. |
| `kubelet`      | Installs the kubelet binary in `/usr/bin` and CNI binaries in `/opt/cni/bin`. |
| `kubectl`      | Installs the `/usr/bin/kubectl` binary. |
| `cri-tools`    | Installs the `/usr/bin/crictl` binary from the [cri-tools git repository](https://github.com/kubernetes-sigs/cri-tools). |
-->
## Kubernetes 可执行文件和软件包内容

Kubernetes 版本对应的 DEB 和 RPM 软件包是：

| Package name | Description |
|--------------|-------------|
| `kubeadm`    | 给 kubelet 安装 `/usr/bin/kubeadm` CLI 工具和 [kubelet 的 systemd 文件](#the-kubelet-drop-in-file-for-systemd)。 |
| `kubelet`    | 安装 kublet 可执行文件到 `/usr/bin` 路径，安装 CNI 可执行文件到 `/opt/cni/bin` 路径。 |
| `kubectl`    | 安装 `/usr/bin/kubectl` 可执行文件。 |
| `cri-tools` | 从 [cri-tools git 仓库](https://github.com/kubernetes-sigs/cri-tools)中安装 `/usr/bin/crictl` 可执行文件。 |

