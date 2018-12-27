---
reviewers:
- sig-cluster-lifecycle
title: 使用kubeadm配置群集中的每个kubelet
content_template: templates/concept
weight: 80
---

{{% capture overview %}}

{{< feature-state for_k8s_version="1.11" state="stable" >}}

<!--The lifecycle of the kubeadm CLI tool is decoupled from the
[kubelet](/docs/reference/command-line-tools-reference/kubelet), which is a daemon that runs
on each node within the Kubernetes cluster. The kubeadm CLI tool is executed by the user when Kubernetes is
initialized or upgraded, whereas the kubelet is always running in the background.-->
kubeadm命令行接口工具的生命周期和kubelet是分离的，它是一个运行在集群中每个节点上的守护进程。当Kubernetes初始化或者升级时，kubeadm命令行接口工具将会被用户执行，然而kubelet始终在后台运行。

<!--Since the kubelet is a daemon, it needs to be maintained by some kind of a init
system or service manager. When the kubelet is installed using DEBs or RPMs,
systemd is configured to manage the kubelet. You can use a different service
manager instead, but you need to configure it manually.-->
由于kubelet是一个守护进程，它需要由某种init系统或服务管理器维护。使用DEB或RPM安装kubelet时，systemd配置为管理kubelet。您可以改用其它服务管理器，但需要手动配置它。

<!--Some kubelet configuration details need to be the same across all kubelets involved in the cluster, while
other configuration aspects need to be set on a per-kubelet basis, to accommodate the different
characteristics of a given machine, such as OS, storage, and networking. You can manage the configuration
of your kubelets manually, but [kubeadm now provides a `KubeletConfiguration` API type for managing your
kubelet configurations centrally](#configure-kubelets-using-kubeadm).-->
一些kubelet的配置细节必须和集群中其它的节点的kubelet配置相同，然而其它方面的配置需要在每个节点的kubelet的基础上设置，以适应不同的机器特征，例如操作系统，存储和网络。你可以手动地管理kubelet
配置，但是[kubeadm现在提供了一个‘KubeletConfiguration’API类型来集中管理您的kubelet配置](#configure-kubelets-using-kubeadm)

{{% /capture %}}

{{% capture body %}}

<!--## Kubelet configuration patterns -->
## Kubelet配置模式

<!--The following sections describe patterns to kubelet configuration that are simplified by
using kubeadm, rather than managing the kubelet configuration for each Node manually.-->

以下部分描述了简化的kubelet配置模式使用kubeadm，而不是手动管理每个节点的kubelet配置。

<!--### Propagating cluster-level configuration to each kubelet-->
### 将集群级别的配置传播到每个kubelet中去

<!--You can provide the kubelet with default values to be used by `kubeadm init` and `kubeadm join`
commands. Interesting examples include using a different CRI runtime or setting the default subnet
used by services.-->
你可以使用‘kubeadm init’和‘kubeadm join’命令来给kubelet提供默认的值。有趣的例子包括使用一个不用的CRI运行时或者设置服务使用的默认子网。

<!--If you want your services to use the subnet `10.96.0.0/12` as the default for services, you can pass
the `--service-cidr` parameter to kubeadm:-->
如果你想要你的服务使用子网`10.96.0.0/12`作为默认的子网，你可以向kubeadm提供`--service-cidr` 参数：

```bash
kubeadm init --service-cidr 10.96.0.0/12
```

<!--Virtual IPs for services are now allocated from this subnet. You also need to set the DNS address used
by the kubelet, using the `--cluster-dns` flag. This setting needs to be the same for every kubelet
on every manager and Node in the cluster. The kubelet provides a versioned, structured API object
that can configure most parameters in the kubelet and push out this configuration to each running
kubelet in the cluster. This object is called **the kubelet's ComponentConfig**.
The ComponentConfig allows the user to specify flags such as the cluster DNS IP addresses expressed as
a list of values to a camelCased key, illustrated by the following example:-->
现在，从该子网分配服务的虚拟IP。 您还需要使用`--cluster-dns`标志设置kubelet使用的DNS地址。 对于群集中每个管理器和节点上的每个kubelet，此设置必须相同。 kubelet提供了一个版本化的结构化API对象，可以配置kubelet中的大多数参数，并将此配置推送到每个运行集群中的kubelet。此对象称为kubelet的ComponentConfig **。ComponentConfig允许用户指定标志，例如表示为camelCased键的值列表的集群DNS IP地址，如以下示例所示：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
clusterDNS:
- 10.96.0.10
```

<!--For more details on the ComponentConfig have a look at [this section](#configure-kubelets-using-kubeadm).-->
有关ComponentConfig的更多详细信息，请参阅[此节]（＃configure-kubelets-using-kubeadm）。

<!--### Providing instance-specific configuration details-->
### 提供给定实例的详细配置信息

<!--Some hosts require specific kubelet configurations, due to differences in hardware, operating system,
networking, or other host-specific parameters. The following list provides a few examples.-->
由于不同的硬件、操作系统、网络，一些主机需要特定的kebelet配置，或者其他特定于主机的参数。以下提供了一些实例。

<!--- The path to the DNS resolution file, as specified by the `--resolv-conf` kubelet
  configuration flag, may differ among operating systems, or depending on whether you are using
  `systemd-resolved`. If this path is wrong, DNS resolution will fail on the Node whose kubelet
  is configured incorrectly.-->
- 由`--resolv-conf` kubelet配置标志指定的DNS解析文件的路径可能因操作系统而异，或取决于您是否使用
  `systemd-resolved`。 如果此路径错误，则在其kubelet配置不正确的节点上DNS解析将失败
  
<!--- The Node API object `.metadata.name` is set to the machine's hostname by default,
  unless you are using a cloud provider. You can use the `--hostname-override` flag to override the
  default behavior if you need to specify a Node name different from the machine's hostname.-->
- 默认情况下，Node API对象`.metadata.name`设置为计算机的主机名，除非您使用的是云提供程序。 如果需要
  指定与计算机主机名不同的节点名，则可以使用`--hostname-override`标志覆盖默认行为。
  
<!--- Currently, the kubelet cannot automatically detects the cgroup driver used by the CRI runtime,
  but the value of `--cgroup-driver` must match the cgroup driver used by the CRI runtime to ensure
  the health of the kubelet.-->
- 目前，kubelet不能使用CRI运行时自动检测cgroup驱动，但是`--cgroup-driver`选项的值必须和被CRI运行时的cgroup驱动一样才
  能确认kubelet的健康。
  
<!--- Depending on the CRI runtime your cluster uses, you may need to specify different flags to the kubelet. For 
  instance, when using Docker, you need to specify flags such as `--network-plugin=cni`, but if you are using an 
  external runtime, you need to specify `--container-runtime=remote` and specify the CRI endpoint using the 
  `--container-runtime-path-endpoint=<path>`.-->
- 根据您的群集使用的CRI运行时，您可能需要为kubelet指定不同的标志。例如，在使用Docker时，您需要指定标志，例
  如`--network-plugin = cni`，但如果您使用的是 在外部运行时，您需要指定`--container-runtime = remote`并使
  用`--container-runtime-path-endpoint = <path>`指定CRI端点。

<!--You can specify these flags by configuring an individual kubelet's configuration in your service manager, such as
   systemd.-->
您可以通过在服务管理器中配置单个kubelet的配置来指定这些选项，比如systemd。

<!--## Configure kubelets using kubeadm-->
##使用kubeadm来配置kubelets

<!--It is possible to configure the kubelet that kubeadm will start if a custom `KubeletConfiguration`
API object is passed with a configuration file like so `kubeadm ... --config some-config-file.yaml`.-->
如果使用像`kubeadm ... --config some-config-file.yaml`这样的配置文件传递自定义`KubeletConfiguration`API对象，则可以配置kubeadm即将启动的kubelet。

<!--By calling `kubeadm config print-default --api-objects KubeletConfiguration` you can
see all the default values for this structure.-->
通过调用`kubeadm config print-default --api-objects KubeletConfiguration`，您可以看到此结构的所有默认值。

<!--Also have a look at the [API reference for the
kubelet ComponentConfig](https://godoc.org/k8s.io/kubernetes/pkg/kubelet/apis/config#KubeletConfiguration)
for more information on the individual fields.-->
另请参阅[API参考资料kubelet ComponentConfig](https://godoc.org/k8s.io/kubernetes/pkg/kubelet/apis/config#KubeletConfiguration)有关各个字段的更多信息。

<!-- ### Workflow when using `kubeadm init`-->
### 使用‘kubeadm init’时的工作流

<!--When you call `kubeadm init`, the kubelet configuration is marshalled to disk
at `/var/lib/kubelet/config.yaml`, and also uploaded to a ConfigMap in the cluster. The ConfigMap
is named `kubelet-config-1.X`, where `.X` is the minor version of the Kubernetes version you are
initializing. A kubelet configuration file is also written to `/etc/kubernetes/kubelet.conf` with the
baseline cluster-wide configuration for all kubelets in the cluster. This configuration file
points to the client certificates that allow the kubelet to communicate with the API server. This
addresses the need to
[propagate cluster-level configuration to each kubelet](#propagating-cluster-level-configuration-to-each-kubelet).-->
当你调用`kubeadm init`时，kubelet配置在`/var/lib/kubelet/config.yaml`编组到磁盘，并上传到集群中的ConfigMap。 
ConfigMap被命名为`kubelet-config-1.X`，其中`.X`是您正在初始化的Kubernetes版本的次要版本。 还将kubelet配置文件
写入`/etc/kubernetes/kubelet.conf`，并为群集中的所有kubelet提供基线群集范围配置。 此配置文件指向允许kubelet与
API服务器通信的客户端证书。[传播集群级别的配置到每个kubelet中去](#propagating-cluster-level-configuration-to-each-kubelet).

<!--To address the second pattern of
[providing instance-specific configuration details](#providing-instance-specific-configuration-details),
kubeadm writes an environment file to `/var/lib/kubelet/kubeadm-flags.env`, which contains a list of
flags to pass to the kubelet when it starts. The flags are presented in the file like this:-->
解决第二种模式[提供特定于实例的配置详细信息](#providing-instance-specific-configuration-details)，
kubeadm将环境文件写入`/var/lib/kubelet/kubeadm-flags.env`，其中包含一个列表标志在启动时传递给kubelet。 标志在文件中显示如下：

```bash
KUBELET_KUBEADM_ARGS="--flag1=value1 --flag2=value2 ..."
```

<!--In addition to the flags used when starting the kubelet, the file also contains dynamic
parameters such as the cgroup driver and whether to use a different CRI runtime socket
(`--cri-socket`).-->
除了启动kubelet时使用的标志，该文件还包含动态参数，如cgroup驱动程序以及是否使用不同的CRI运行时套接字（`--cri-socket`）。

<!--After marshalling these two files to disk, kubeadm attempts to run the following two
commands, if you are using systemd:-->
将这两个文件写到到磁盘后，如果您使用的是systemd，kubeadm会尝试运行以下两个命令：

```bash
systemctl daemon-reload && systemctl restart kubelet
```

<!--If the reload and restart are successful, the normal `kubeadm init` workflow continues.-->
如果重新加载和重新启动成功，则正常的`kubeadm init`工作流继续。

<!--### Workflow when using `kubeadm join`-->
### 使用‘kubeadm join’时的工作流

<!--When you run `kubeadm join`, kubeadm uses the Bootstrap Token credential perform
a TLS bootstrap, which fetches the credential needed to download the
`kubelet-config-1.X` ConfigMap and writes it to `/var/lib/kubelet/config.yaml`. The dynamic
environment file is generated in exactly the same way as `kubeadm init`.-->
运行`kubeadm join`时，kubeadm使用Bootstrap Token凭证执行一个TLS引导程序，它获取下载所需的凭证
`kubelet-config-1.X`配置映射并将其写入`/var/lib/kubelet/config.yaml`。 动态环境文件的生成方式与`kubeadm init`完全相同。

<!--Next, `kubeadm` runs the following two commands to load the new configuration into the kubelet:-->
接下来，`kubeadm`运行以下两个命令将新配置加载到kubelet中：

```bash
systemctl daemon-reload && systemctl restart kubelet
```

<!--After the kubelet loads the new configuration, kubeadm writes the
`/etc/kubernetes/bootstrap-kubelet.conf` KubeConfig file, which contains a CA certificate and Bootstrap
Token. These are used by the kubelet to perform the TLS Bootstrap and obtain a unique
credential, which is stored in `/etc/kubernetes/kubelet.conf`. When this file is written, the kubelet
has finished performing the TLS Bootstrap.-->
在kubelet加载新配置后，kubeadm会写入`/etc/kubernetes/bootstrap-kubelet.conf` KubeConfig文件，其中包含CA证书和Bootstrap
令牌。 这些由kubelet用于执行TLS Bootstrap并获得唯一的凭证，存储在`/etc/kubernetes/kubelet.conf`中。 写入此文件时，kubelet
已经完成了TLS Bootstrap的执行。

<!--##  The kubelet drop-in file for systemd-->
##  systemd的kubelet drop-in文件

<!--The configuration file installed by the kubeadm DEB or RPM package is written to
`/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` and is used by systemd.-->
由kubeadm DEB或RPM软件包安装的配置文件将写入`/etc/systemd/system/kubelet.service.d/10-kubeadm.conf`并由systemd使用。

```none
[Service]
Environment="KUBELET_KUBECONFIG_ARGS=--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf
--kubeconfig=/etc/kubernetes/kubelet.conf"
Environment="KUBELET_CONFIG_ARGS=--config=/var/lib/kubelet/config.yaml"
# This is a file that "kubeadm init" and "kubeadm join" generates at runtime, populating
the KUBELET_KUBEADM_ARGS variable dynamically
EnvironmentFile=-/var/lib/kubelet/kubeadm-flags.env
# This is a file that the user can use for overrides of the kubelet args as a last resort. Preferably,
#the user should use the .NodeRegistration.KubeletExtraArgs object in the configuration files instead.
# KUBELET_EXTRA_ARGS should be sourced from this file.
EnvironmentFile=-/etc/default/kubelet
ExecStart=
ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_CONFIG_ARGS $KUBELET_KUBEADM_ARGS $KUBELET_EXTRA_ARGS
```

<!--This file specifies the default locations for all of the files managed by kubeadm for the kubelet.-->
此文件指定kubeadm为kubelet管理的所有文件的默认位置。

<!--- The KubeConfig file to use for the TLS Bootstrap is `/etc/kubernetes/bootstrap-kubelet.conf`,
  but it is only used if `/etc/kubernetes/kubelet.conf` does not exist.
- The KubeConfig file with the unique kubelet identity is `/etc/kubernetes/kubelet.conf`.
- The file containing the kubelet's ComponentConfig is `/var/lib/kubelet/config.yaml`.
- The dynamic environment file that contains `KUBELET_KUBEADM_ARGS` is sourced from `/var/lib/kubelet/kubeadm-flags.env`.
- The file that can contain user-specified flag overrides with `KUBELET_EXTRA_ARGS` is sourced from
  `/etc/default/kubelet` (for DEBs), or `/etc/systconfig/kubelet` (for RPMs). `KUBELET_EXTRA_ARGS`
  is last in the flag chain and has the highest priority in the event of conflicting settings.-->
  
- 用于TLS Bootstrap的KubeConfig文件是`/etc/kubernetes/bootstrap-kubelet.conf`，但它仅在`/etc/kubernetes/kubelet.conf`不存在时使用。
- 具有唯一kubelet标识的KubeConfig文件是`/etc/kubernetes/kubelet.conf`。
- 包含kubelet的ComponentConfig的文件是`/var/lib/kubelet/config.yaml`。
- 包含`KUBELET_KUBEADM_ARGS`的动态环境文件来自`/var/lib/kubelet/kubeadm-flags.env`。
- 可以包含用户指定的标志覆盖`KUBELET_EXTRA_ARGS`的文件来自`/etc/default/kubelet`（对于DEB）
  或`/etc/systconfig/kubelet`（对于RPM）。 `KUBELET_EXTRA_ARGS`是标志链中的最后一个，并且在设置冲突时具有最高优先级。
  
  

<!--## Kubernetes binaries and package contents-->
## Kubernetes二进制文件和包内容

<!--The DEB and RPM packages shipped with the Kubernetes releases are:-->
Kubernetes版本附带的DEB和RPM软件包包括：

| Package name | Description |
|--------------|-------------|
| `kubeadm`    | 为kubelet安装 `/usr/bin/kubeadm` 命令行工具和[kubelet的drop-in文件(#the-kubelet-drop-in-file-for-systemd) |
| `kubelet`    | 安装`/usr/bin/kubelet`二进制文件 |
| `kubectl`    | 安装`/usr/bin/kubectl`二进制文件 |
| `kubernetes-cni` | 将官方CNI二进制文件安装到`/opt/cni/bin`目录中 |
| `cri-tools` | 从[https://github.com/kubernetes-incubator/cri-tools](https://github.com/kubernetes-incubator/cri-tools)安装`/ usr / bin / crictl`二进制文件 |

{{% /capture %}}
