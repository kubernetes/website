---
title: kubeadm init
content_type: concept
weight: 20
---

<!-- overview -->

<!--
This command initializes a Kubernetes control-plane node.
-->
此命令初始化一个 Kubernetes 控制平面节点。

<!-- body -->

{{< include "generated/kubeadm_init/_index.md" >}}

<!--
### Init workflow {#init-workflow}
-->
### Init 命令的工作流程 {#init-workflow}

<!--
`kubeadm init` bootstraps a Kubernetes control-plane node by executing the
following steps:
-->
`kubeadm init` 命令通过执行下列步骤来启动一个 Kubernetes 控制平面节点。

<!--
1. Runs a series of pre-flight checks to validate the system state
   before making changes. Some checks only trigger warnings, others are
   considered errors and will exit kubeadm until the problem is corrected or the
   user specifies `--ignore-preflight-errors=<list-of-errors>`.
-->
1. 在做出变更前运行一系列的预检项来验证系统状态。一些检查项目仅仅触发警告，
   其它的则会被视为错误并且退出 kubeadm，除非问题得到解决或者用户指定了
   `--ignore-preflight-errors=<错误列表>` 参数。

<!--
1. Generates a self-signed CA to set up identities for each component in the cluster. The user can provide their
   own CA cert and/or key by dropping it in the cert directory configured via `--cert-dir`
   (`/etc/kubernetes/pki` by default).
   The APIServer certs will have additional SAN entries for any `--apiserver-cert-extra-sans` arguments, lowercased if necessary.
-->
2. 生成一个自签名的 CA 证书来为集群中的每一个组件建立身份标识。
   用户可以通过将其放入 `--cert-dir` 配置的证书目录中（默认为 `/etc/kubernetes/pki`）
   来提供他们自己的 CA 证书以及/或者密钥。
   APIServer 证书将为任何 `--apiserver-cert-extra-sans` 参数值提供附加的 SAN 条目，必要时将其小写。

<!--
1. Writes kubeconfig files in `/etc/kubernetes/` for the kubelet, the controller-manager and the
   scheduler to use to connect to the API server, each with its own identity. Also
   additional kubeconfig files are written, for kubeadm as administrative entity (`admin.conf`)
   and for a super admin user that can bypass RBAC (`super-admin.conf`).
-->
3. 将 kubeconfig 文件写入 `/etc/kubernetes/` 目录以便 kubelet、控制器管理器和调度器用来连接到
   API 服务器，它们每一个都有自己的身份标识。再编写额外的 kubeconfig 文件，将 kubeadm
   作为管理实体（`admin.conf`）和可以绕过 RBAC 的超级管理员用户（`super-admin.conf`）。

<!--
1. Generates static Pod manifests for the API server,
   controller-manager and scheduler. In case an external etcd is not provided,
   an additional static Pod manifest is generated for etcd.

   Static Pod manifests are written to `/etc/kubernetes/manifests`; the kubelet
   watches this directory for Pods to create on startup.

   Once control plane Pods are up and running, the `kubeadm init` sequence can continue.
-->
4. 为 API 服务器、控制器管理器和调度器生成静态 Pod 的清单文件。假使没有提供一个外部的 etcd
   服务的话，也会为 etcd 生成一份额外的静态 Pod 清单文件。

   静态 Pod 的清单文件被写入到 `/etc/kubernetes/manifests` 目录；
   kubelet 会监视这个目录以便在系统启动的时候创建 Pod。

   一旦控制平面的 Pod 都运行起来，`kubeadm init` 的工作流程就继续往下执行。

<!--
1. Apply labels and taints to the control-plane node so that no additional workloads will
   run there.
-->
5. 对控制平面节点应用标签和污点标记以便不会在它上面运行其它的工作负载。

<!--
1. Generates the token that additional nodes can use to register
   themselves with a control-plane in the future. Optionally, the user can provide a
   token via `--token`, as described in the
   [kubeadm token](/docs/reference/setup-tools/kubeadm/kubeadm-token/) docs.
-->
6. 生成令牌，将来其他节点可使用该令牌向控制平面注册自己。如
   [kubeadm token](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-token/)
   文档所述，用户可以选择通过 `--token` 提供令牌。

<!--
1. Makes all the necessary configurations for allowing node joining with the
   [Bootstrap Tokens](/docs/reference/access-authn-authz/bootstrap-tokens/) and
   [TLS Bootstrap](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
   mechanism:

   - Write a ConfigMap for making available all the information required
     for joining, and set up related RBAC access rules.

   - Let Bootstrap Tokens access the CSR signing API.

   - Configure auto-approval for new CSR requests.

   See [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) for additional info.
-->
7. 为了使得节点能够遵照[启动引导令牌](/zh-cn/docs/reference/access-authn-authz/bootstrap-tokens/)和
   [TLS 启动引导](/zh-cn/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
   这两份文档中描述的机制加入到集群中，kubeadm 会执行所有的必要配置：

   - 创建一个 ConfigMap 提供添加集群节点所需的信息，并为该 ConfigMap 设置相关的 RBAC 访问规则。

   - 允许启动引导令牌访问 CSR 签名 API。

   - 配置自动签发新的 CSR 请求。

   更多相关信息，请查看 [kubeadm join](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-join/)。

<!--
1. Installs a DNS server (CoreDNS) and the kube-proxy addon components via the API server.
   In Kubernetes version 1.11 and later CoreDNS is the default DNS server.
   Please note that although the DNS server is deployed, it will not be scheduled until CNI is installed.
-->
8. 通过 API 服务器安装一个 DNS 服务器 (CoreDNS) 和 kube-proxy 附加组件。
   在 Kubernetes v1.11 和更高版本中，CoreDNS 是默认的 DNS 服务器。
   请注意，尽管已部署 DNS 服务器，但直到安装 CNI 时才调度它。

   {{< warning >}}
   <!--
   kube-dns usage with kubeadm is deprecated as of v1.18 and is removed in v1.21.
   -->
   从 v1.18 开始，在 kubeadm 中使用 kube-dns 的支持已被废弃，并已在 v1.21 版本中移除。
   {{< /warning >}}

<!--
### Using init phases with kubeadm {#init-phases}

Kubeadm allows you to create a control-plane node in phases using the `kubeadm init phase` command.
-->
### 在 kubeadm 中使用 init 阶段 {#init-phases}

Kubeadm 允许你使用 `kubeadm init phase` 命令分阶段创建控制平面节点。

<!--
To view the ordered list of phases and sub-phases you can call `kubeadm init -help`. 
The list will be located at the top of the help screen and each phase will have a description next to it.
Note that by calling `kubeadm init` all of the phases and sub-phases will be executed in this exact order.
-->
要查看阶段和子阶段的有序列表，可以调用 `kubeadm init --help`。
该列表将位于帮助屏幕的顶部，每个阶段旁边都有一个描述。
注意，通过调用 `kubeadm init`，所有阶段和子阶段都将按照此确切顺序执行。

<!--
Some phases have unique flags, so if you want to have a look at the list of available options add `-help`, for example:
-->
某些阶段具有唯一的标志，因此，如果要查看可用选项的列表，请添加 `--help`，例如：

```shell
sudo kubeadm init phase control-plane controller-manager --help
```

<!--
You can also use `--help` to see the list of sub-phases for a certain parent phase:
-->
你也可以使用 `--help` 查看特定父阶段的子阶段列表：

```shell
sudo kubeadm init phase control-plane --help
```

<!--
`kubeadm init` also exposes a flag called `--skip-phases` that can be used to skip certain phases.
The flag accepts a list of phase names and the names can be taken from the above ordered list.
-->
`kubeadm init` 还公开了一个名为 `--skip-phases` 的参数，该参数可用于跳过某些阶段。
参数接受阶段名称列表，并且这些名称可以从上面的有序列表中获取。

<!--
An example:
-->
例如：

<!--
# you can now modify the control plane and etcd manifest files
-->
```shell
sudo kubeadm init phase control-plane all --config=configfile.yaml
sudo kubeadm init phase etcd local --config=configfile.yaml
# 你现在可以修改控制平面和 etcd 清单文件
sudo kubeadm init --skip-phases=control-plane,etcd --config=configfile.yaml
```

<!--
What this example would do is write the manifest files for the control plane and etcd in
`/etc/kubernetes/manifests` based on the configuration in `configfile.yaml`. This allows you to
modify the files and then skip these phases using `--skip-phases`. By calling the last command you
will create a control plane node with the custom manifest files.
-->
该示例将执行的操作是基于 `configfile.yaml` 中的配置在 `/etc/kubernetes/manifests`
中写入控制平面和 etcd 的清单文件。
这允许你修改文件，然后使用 `--skip-phases` 跳过这些阶段。
通过调用最后一个命令，你将使用自定义清单文件创建一个控制平面节点。

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

<!--
Alternatively, you can use the `skipPhases` field under `InitConfiguration`.
-->
或者，你可以使用 `InitConfiguration` 下的 `skipPhases` 字段。

<!--
### Using kubeadm init with a configuration file {#config-file}
-->
### 结合一份配置文件来使用 kubeadm init {#config-file}

{{< caution >}}
<!--
The config file is still considered beta and may change in future versions.
-->
配置文件的功能仍然处于 Beta 状态并且在将来的版本中可能会改变。
{{< /caution >}}

<!--
It's possible to configure `kubeadm init` with a configuration file instead of command
line flags, and some more advanced features may only be available as
configuration file options. This file is passed using the `--config` flag and it must
contain a `ClusterConfiguration` structure and optionally more structures separated by `---\n`
Mixing `--config` with others flags may not be allowed in some cases.
-->
通过一份配置文件而不是使用命令行参数来配置 `kubeadm init` 命令是可能的，
但是一些更加高级的功能只能够通过配置文件设定。
这份配置文件通过 `--config` 选项参数指定的，
它必须包含 `ClusterConfiguration` 结构，并可能包含更多由 `---\n` 分隔的结构。
在某些情况下，可能不允许将 `--config` 与其他标志混合使用。

<!--
The default configuration can be printed out using the
[kubeadm config print](/docs/reference/setup-tools/kubeadm/kubeadm-config/) command.

If your configuration is not using the latest version it is **recommended** that you migrate using
the [kubeadm config migrate](/docs/reference/setup-tools/kubeadm/kubeadm-config/) command.

For more information on the fields and usage of the configuration you can navigate to our
[API reference page](/docs/reference/config-api/kubeadm-config.v1beta4/).
-->
可以使用 [kubeadm config print](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-config/)
命令打印出默认配置。

如果你的配置没有使用最新版本，**推荐**使用
[kubeadm config migrate](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-config/)
命令进行迁移。

关于配置的字段和用法的更多信息，你可以访问 [API 参考页面](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)。

<!--
### Using kubeadm init with feature gates {#feature-gates}
-->
### 使用 kubeadm init 时设置特性门控 {#feature-gates}

<!--
Kubeadm supports a set of feature gates that are unique to kubeadm and can only be applied
during cluster creation with `kubeadm init`. These features can control the behavior
of the cluster. Feature gates are removed after a feature graduates to GA.
-->
Kubeadm 支持一组独有的特性门控，只能在 `kubeadm init` 创建集群期间使用。
这些特性可以控制集群的行为。特性门控会在毕业到 GA 后被移除。

<!--
To pass a feature gate you can either use the `--feature-gates` flag for
`kubeadm init`, or you can add items into the `featureGates` field when you pass
a [configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/#kubeadm-k8s-io-v1beta4-ClusterConfiguration)
using `--config`.
-->
你可以使用 `--feature-gates` 标志来为 `kubeadm init` 设置特性门控，
或者你可以在用 `--config`
传递[配置文件](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/#kubeadm-k8s-io-v1beta4-ClusterConfiguration)时添加条目到
`featureGates` 字段中。

<!--
Passing [feature gates for core Kubernetes components](/docs/reference/command-line-tools-reference/feature-gates)
directly to kubeadm is not supported. Instead, it is possible to pass them by
[Customizing components with the kubeadm API](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/).
-->
直接传递 [Kubernetes 核心组件的特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates)给 kubeadm 是不支持的。
相反，可以通过[使用 kubeadm API 的自定义组件](/zh-cn/docs/setup/production-environment/tools/kubeadm/control-plane-flags/)来传递。

<!--
List of feature gates:
-->
特性门控的列表：

<!--
{{< table caption="kubeadm feature gates" >}}
Feature | Default | Alpha | Beta | GA
:-------|:--------|:------|:-----|:----
`ControlPlaneKubeletLocalMode` | `false` | 1.31 | - | -
`EtcdLearnerMode` | `true` | 1.27 | 1.29 | -
`PublicKeysECDSA` | `false` | 1.19 | - | -
`WaitForAllControlPlaneComponents` | `false` | 1.30 | - | -
{{< /table >}}
-->
{{< table caption="kubeadm 特性门控" >}}
特性 | 默认值 | Alpha | Beta | GA
:-------|:--------|:------|:-----|:----
`ControlPlaneKubeletLocalMode` | `false` | 1.31 | - | -
`EtcdLearnerMode` | `true` | 1.27 | 1.29 | -
`PublicKeysECDSA` | `false` | 1.19 | - | -
`WaitForAllControlPlaneComponents` | `false` | 1.30 | - | -
{{< /table >}}

{{< note >}}
<!--
Once a feature gate goes GA its value becomes locked to `true` by default.
-->
一旦特性门控变成了 GA，它的值会被默认锁定为 `true`。
{{< /note >}}

<!--
Feature gate descriptions:
-->
特性门控的描述：

<!--
`ControlPlaneKubeletLocalMode`
: With this feature gate enabled, when joining a new control plane node, kubeadm will configure the kubelet
to connect to the local kube-apiserver. This ensures that there will not be a violation of the version skew
policy during rolling upgrades.
-->
`ControlPlaneKubeletLocalMode`
: 启用此特性门控后，当加入新的控制平面节点时，
  kubeadm 将配置 kubelet 连接到本地 kube-apiserver。
  这将确保在滚动升级期间不会违反版本偏差策略。

<!--
`EtcdLearnerMode`
: With this feature gate enabled, when joining a new control plane node, a new etcd member will be created
as a learner and promoted to a voting member only after the etcd data are fully aligned.
-->
`EtcdLearnerMode`
: 启用此特性门控后，当加入新的控制平面节点时，将创建一个新的 etcd
  成员作为学习者（learner），并仅在 etcd 数据完全对齐后进级为投票成员（voting member）。

<!--
`PublicKeysECDSA`
: Can be used to create a cluster that uses ECDSA certificates instead of the default RSA algorithm.
Renewal of existing ECDSA certificates is also supported using `kubeadm certs renew`, but you cannot
switch between the RSA and ECDSA algorithms on the fly or during upgrades. Kubernetes
{{< skew currentVersion >}} has a bug where keys in generated kubeconfig files are set use RSA
despite the feature gate being enabled. Kubernetes versions before v1.31 had a bug where keys in generated kubeconfig files
were set use RSA, even when you had enabled the `PublicKeysECDSA` feature gate.
-->
`PublicKeysECDSA`
: 可用于创建集群时使用 ECDSA 证书而不是默认 RSA 算法。
  支持用 `kubeadm certs renew` 更新现有 ECDSA 证书，
  但你不能在集群运行期间或升级期间切换 RSA 和 ECDSA 算法。
  Kubernetes {{< skew currentVersion >}} 有一个错误，尽管开启了特性门控，
  所生成的 kubeconfig 文件中的密钥仍使用 RSA 设置。
  在 v1.31 之前的 Kubernetes 版本中，即使启用了 `PublicKeysECDSA` 特性门控，
  所生成的 kubeconfig 文件中的密钥仍然被设置为使用 RSA。

<!--
`WaitForAllControlPlaneComponents`
: With this feature gate enabled kubeadm will wait for all control plane components (kube-apiserver,
kube-controller-manager, kube-scheduler) on a control plane node to report status 200 on their `/healthz`
endpoints. These checks are performed on `https://127.0.0.1:PORT/healthz`, where `PORT` is taken from
`--secure-port` of a component. If you specify custom `--secure-port` values in the kubeadm configuration
they will be respected. Without the feature gate enabled, kubeadm will only wait for the kube-apiserver
on a control plane node to become ready. The wait process starts right after the kubelet on the host
is started by kubeadm. You are advised to enable this feature gate in case you wish to observe a ready
state from all control plane components during the `kubeadm init` or `kubeadm join` command execution.
-->
`WaitForAllControlPlaneComponents`
: 启用此特性门控后，kubeadm 将等待控制平面节点上的所有控制平面组件
  （kube-apiserver、kube-controller-manager、kube-scheduler）在其 `/healthz`
  端点上报告 200 状态码。这些检测在 `https://127.0.0.1:PORT/healthz` 上执行，其中
  `PORT` 取自组件的 `--secure-port` 标志。
  如果没有启用此特性门控，kubeadm 将仅等待控制平面节点上的 kube-apiserver 准备就绪。
  等待过程在 kubeadm 启动主机上的 kubelet 后立即开始。如果你希望在 `kubeadm init`
  或 `kubeadm join` 命令执行期间观察所有控制平面组件的就绪状态，建议你启用此特性门控。

<!--
List of deprecated feature gates:
-->
已弃用特性门控的列表：

<!--
{{< table caption="kubeadm deprecated feature gates" >}}
Feature | Default | Alpha | Beta | GA | Deprecated
:-------|:--------|:------|:-----|:---|:----------
`RootlessControlPlane` | `false` | 1.22 | - | - | 1.31
{{< /table >}}
-->
{{< table caption="kubeadm 弃用的特性门控" >}}
特性 | 默认值 | Alpha | Beta | GA |  弃用
:-------|:--------|:------|:-----|:---|:----------
`RootlessControlPlane` | `false` | 1.22 | - | - | 1.31
{{< /table >}}

<!--
Feature gate descriptions:
-->
特性门控描述：

<!--
`RootlessControlPlane`
: Setting this flag configures the kubeadm deployed control plane component static Pod containers
for `kube-apiserver`, `kube-controller-manager`, `kube-scheduler` and `etcd` to run as non-root users.
If the flag is not set, those components run as root. You can change the value of this feature gate before
you upgrade to a newer version of Kubernetes.
-->
`RootlessControlPlane`
: 设置此标志来配置 kubeadm 所部署的控制平面组件中的静态 Pod 容器
  `kube-apiserver`、`kube-controller-manager`、`kube-scheduler` 和 `etcd`
  以非 root 用户身份运行。如果未设置该标志，则这些组件以 root 身份运行。
  你可以在升级到更新版本的 Kubernetes 之前更改此特性门控的值。

<!--
List of removed feature gates:
-->
已移除的特性门控列表：

<!--
{{< table caption="kubeadm removed feature gates" >}}
Feature | Alpha | Beta | GA | Removed
:-------|:------|:-----|:---|:-------
`IPv6DualStack` | 1.16 | 1.21 | 1.23 | 1.24
`UnversionedKubeletConfigMap` | 1.22 | 1.23 | 1.25 | 1.26
`UpgradeAddonsBeforeControlPlane` | 1.28 | - | - | 1.31
{{< /table >}}
-->
{{< table caption="kubeadm 已移除的特性门控" >}}
特性 | Alpha | Beta | GA | 移除
:-------|:------|:-----|:---|:-------
`IPv6DualStack` | 1.16 | 1.21 | 1.23 | 1.24
`UnversionedKubeletConfigMap` | 1.22 | 1.23 | 1.25 | 1.26
`UpgradeAddonsBeforeControlPlane` | 1.28 | - | - | 1.31
{{< /table >}}

<!--
Feature gate descriptions:
-->
特性门控的描述：

<!--
`IPv6DualStack`
: This flag helps to configure components dual stack when the feature is in progress. For more details on Kubernetes
dual-stack support see [Dual-stack support with kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support/).
-->
`IPv6DualStack`
: 在 IP 双栈特性处于开发过程中时，此标志有助于配置组件的双栈支持。有关 Kubernetes
  双栈支持的更多详细信息，请参阅 [kubeadm 的双栈支持](/zh-cn/docs/setup/production-environment/tools/kubeadm/dual-stack-support/)。

<!--
`UnversionedKubeletConfigMap`
: This flag controls the name of the {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} where kubeadm stores
kubelet configuration data. With this flag not specified or set to `true`, the ConfigMap is named `kubelet-config`.
If you set this flag to `false`, the name of the ConfigMap includes the major and minor version for Kubernetes
(for example: `kubelet-config-{{< skew currentVersion >}}`). Kubeadm ensures that RBAC rules for reading and writing
that ConfigMap are appropriate for the value you set. When kubeadm writes this ConfigMap (during `kubeadm init`
or `kubeadm upgrade apply`), kubeadm respects the value of `UnversionedKubeletConfigMap`. When reading that ConfigMap
(during `kubeadm join`, `kubeadm reset`, `kubeadm upgrade ...`), kubeadm attempts to use unversioned ConfigMap name first;
if that does not succeed, kubeadm falls back to using the legacy (versioned) name for that ConfigMap.
-->
`UnversionedKubeletConfigMap`
: 此标志控制 kubeadm 存储 kubelet 配置数据的 {{<glossary_tooltip text="ConfigMap" term_id="configmap" >}} 的名称。
  在未指定此标志或设置为 `true` 的情况下，此 ConfigMap 被命名为 `kubelet-config`。
  如果将此标志设置为 `false`，则此 ConfigMap 的名称会包括 Kubernetes 的主要版本和次要版本
  （例如：`kubelet-config-{{< skew currentVersion >}}`）。
  kubeadm 会确保用于读写 ConfigMap 的 RBAC 规则适合你设置的值。
  当 kubeadm 写入此 ConfigMap 时（在 `kubeadm init` 或 `kubeadm upgrade apply` 期间），
  kubeadm 根据 `UnversionedKubeletConfigMap` 的设置值来执行操作。
  当读取此 ConfigMap 时（在执行 `kubeadm join`、`kubeadm reset`、`kubeadm upgrade` 等操作期间），
  kubeadm 尝试首先使用无版本（后缀）的 ConfigMap 名称；
  如果不成功，kubeadm 将回退到使用该 ConfigMap 的旧（带版本号的）名称。

<!--
`UpgradeAddonsBeforeControlPlane`
: This feature gate has been removed. It was introduced in v1.28 as a deprecated feature and then removed in v1.31. For documentation on older versions, please switch to the corresponding website version.
-->
`UpgradeAddonsBeforeControlPlane`
: 此特性门控已被移除。它在 v1.28 中作为一个已弃用的特性被引入，在 v1.31 中被移除。
  有关旧版本的文档，请切换到相应的网站版本。

<!--
### Adding kube-proxy parameters {#kube-proxy}

For information about kube-proxy parameters in the kubeadm configuration see:
- [kube-proxy reference](/docs/reference/config-api/kube-proxy-config.v1alpha1/)

For information about enabling IPVS mode with kubeadm see:
- [IPVS](https://github.com/kubernetes/kubernetes/blob/master/pkg/proxy/ipvs/README.md)
-->
### 添加 kube-proxy 参数 {#kube-proxy}

kubeadm 配置中有关 kube-proxy 的说明请查看：

- [kube-proxy 参考](/zh-cn/docs/reference/config-api/kube-proxy-config.v1alpha1/)

使用 kubeadm 启用 IPVS 模式的说明请查看：

- [IPVS](https://github.com/kubernetes/kubernetes/blob/master/pkg/proxy/ipvs/README.md)

<!--
### Passing custom flags to control plane components {#control-plane-flags}

For information about passing flags to control plane components see:
- [control-plane-flags](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/)
-->
### 向控制平面组件传递自定义的命令行参数 {#control-plane-flags}

有关向控制平面组件传递命令行参数的说明请查看：

- [控制平面命令行参数](/zh-cn/docs/setup/production-environment/tools/kubeadm/control-plane-flags/)

<!--
### Running kubeadm without an Internet connection {#without-internet-connection}

For running kubeadm without an Internet connection you have to pre-pull the required control-plane images.

You can list and pull the images using the `kubeadm config images` sub-command:
-->
### 在没有互联网连接的情况下运行 kubeadm {#without-internet-connection}

要在没有互联网连接的情况下运行 kubeadm，你必须提前拉取所需的控制平面镜像。

你可以使用 `kubeadm config images` 子命令列出并拉取镜像：

```shell
kubeadm config images list
kubeadm config images pull
```

<!--
You can pass `--config` to the above commands with a [kubeadm configuration file](#config-file)
to control the `kubernetesVersion` and `imageRepository` fields.
-->
你可以通过 `--config` 把 [kubeadm 配置文件](#config-file) 传递给上述命令来控制
`kubernetesVersion` 和 `imageRepository` 字段。

<!--
All default `registry.k8s.io` images that kubeadm requires support multiple architectures.
-->
kubeadm 需要的所有默认 `registry.k8s.io` 镜像都支持多种硬件体系结构。

<!--
### Using custom images {#custom-images}

By default, kubeadm pulls images from `registry.k8s.io`. If the
requested Kubernetes version is a CI label (such as `ci/latest`)
`gcr.io/k8s-staging-ci-images` is used.
-->
### 使用自定义的镜像 {#custom-images}

默认情况下，kubeadm 会从 `registry.k8s.io` 仓库拉取镜像。如果请求的 Kubernetes 版本是 CI 标签
（例如 `ci/latest`），则使用 `gcr.io/k8s-staging-ci-images`。

<!--
You can override this behavior by using [kubeadm with a configuration file](#config-file).
Allowed customization are:

* To provide `kubernetesVersion` which affects the version of the images.
* To provide an alternative `imageRepository` to be used instead of
  `registry.k8s.io`.
* To provide a specific `imageRepository` and `imageTag` for etcd or CoreDNS.
-->
你可以通过使用[带有配置文件的 kubeadm](#config-file) 来重写此操作。
允许的自定义功能有：

* 提供影响镜像版本的 `kubernetesVersion`。
* 使用其他的 `imageRepository` 来代替 `registry.k8s.io`。
* 为 etcd 或 CoreDNS 提供特定的 `imageRepository` 和 `imageTag`。

<!--
Image paths between the default `registry.k8s.io` and a custom repository specified using
`imageRepository` may differ for backwards compatibility reasons. For example,
one image might have a subpath at `registry.k8s.io/subpath/image`, but be defaulted
to `my.customrepository.io/image` when using a custom repository.
-->
由于向后兼容的原因，使用 `imageRepository` 所指定的定制镜像库可能与默认的
`registry.k8s.io` 镜像路径不同。例如，某镜像的子路径可能是 `registry.k8s.io/subpath/image`，
但使用自定义仓库时默认为 `my.customrepository.io/image`。

<!--
To ensure you push the images to your custom repository in paths that kubeadm
can consume, you must:
-->
确保将镜像推送到 kubeadm 可以使用的自定义仓库的路径中，你必须：

<!--
* Pull images from the defaults paths at `registry.k8s.io` using `kubeadm config images {list|pull}`.
* Push images to the paths from `kubeadm config images list --config=config.yaml`,
where `config.yaml` contains the custom `imageRepository`, and/or `imageTag`
for etcd and CoreDNS.
* Pass the same `config.yaml` to `kubeadm init`.
-->
* 使用 `kubeadm config images {list|pull}` 从 `registry.k8s.io` 的默认路径中拉取镜像。
* 将镜像推送到 `kubeadm config images list --config=config.yaml` 的路径，
  其中 `config.yaml` 包含自定义的 `imageRepository` 和/或用于 etcd 和 CoreDNS 的 `imageTag`。
* 将相同的 `config.yaml` 传递给 `kubeadm init`。

<!--
#### Custom sandbox (pause) images {#custom-pause-image}

To set a custom image for these you need to configure this in your
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
to use the image.
Consult the documentation for your container runtime to find out how to change this setting;
for selected container runtimes, you can also find advice within the
[Container Runtimes](/docs/setup/production-environment/container-runtimes/) topic.
-->
#### 定制沙箱（pause）镜像  {#custom-pause-image}

如果需要为这些组件设置定制的镜像，
你需要在你的{{< glossary_tooltip text="容器运行时" term_id="container-runtime" >}}中完成一些配置。
参阅你的容器运行时的文档以了解如何改变此设置。
对于某些容器运行时而言，
你可以在[容器运行时](/zh-cn/docs/setup/production-environment/container-runtimes/)主题下找到一些建议。

<!--
### Uploading control-plane certificates to the cluster

By adding the flag `--upload-certs` to `kubeadm init` you can temporary upload
the control-plane certificates to a Secret in the cluster. Please note that this Secret
will expire automatically after 2 hours. The certificates are encrypted using
a 32byte key that can be specified using `--certificate-key`. The same key can be used
to download the certificates when additional control-plane nodes are joining, by passing
`--control-plane` and `--certificate-key` to `kubeadm join`.
-->
### 将控制平面证书上传到集群  {#uploading-control-plane-certificates-to-the-cluster}

通过将参数 `--upload-certs` 添加到 `kubeadm init`，你可以将控制平面证书临时上传到集群中的 Secret。
请注意，此 Secret 将在 2 小时后自动过期。这些证书使用 32 字节密钥加密，可以使用 `--certificate-key` 指定该密钥。
通过将 `--control-plane` 和 `--certificate-key` 传递给 `kubeadm join`，
可以在添加其他控制平面节点时使用相同的密钥下载证书。

<!--
The following phase command can be used to re-upload the certificates after expiration:
-->
以下阶段命令可用于证书到期后重新上传证书：

```shell
kubeadm init phase upload-certs --upload-certs --config=SOME_YAML_FILE
```

{{< note >}}
<!--
A predefined `certificateKey` can be provided in `InitConfiguration` when passing the
[configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/) with `--config`.
-->
在使用 `--config`
传递[配置文件](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)时，
可以在 `InitConfiguration` 中提供预定义的 `certificateKey`。
{{< /note >}}

<!--
If a predefined certificate key is not passed to `kubeadm init` and
`kubeadm init phase upload-certs` a new key will be generated automatically.

The following command can be used to generate a new key on demand:
-->
如果未将预定义的证书密钥传递给 `kubeadm init` 和 `kubeadm init phase upload-certs`，
则会自动生成一个新密钥。

以下命令可用于按需生成新密钥：

```shell
kubeadm certs certificate-key
```

<!--
### Certificate management with kubeadm

For detailed information on certificate management with kubeadm see
[Certificate Management with kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/).
The document includes information about using external CA, custom certificates
and certificate renewal.
-->
### 使用 kubeadm 管理证书  {#certificate-management-with-kubeadm}

有关使用 kubeadm 进行证书管理的详细信息，
请参阅[使用 kubeadm 进行证书管理](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)。
该文档包括有关使用外部 CA、自定义证书和证书续订的信息。

<!--
### Managing the kubeadm drop-in file for the kubelet {#kubelet-drop-in}

The `kubeadm` package ships with a configuration file for running the `kubelet` by `systemd`.
Note that the kubeadm CLI never touches this drop-in file. This drop-in file is part of the kubeadm
DEB/RPM package.
-->
### 管理 kubeadm 为 kubelet 提供的 systemd 配置文件 {#kubelet-drop-in}

`kubeadm` 包自带了关于 `systemd` 如何运行 `kubelet` 的配置文件。
请注意 `kubeadm` 客户端命令行工具永远不会修改这份 `systemd` 配置文件。
这份 `systemd` 配置文件属于 kubeadm DEB/RPM 包。

<!--
For further information, see [Managing the kubeadm drop-in file for systemd](/docs/setup/production-environment/tools/kubeadm/kubelet-integration/#the-kubelet-drop-in-file-for-systemd).
-->
有关更多信息，请阅读[管理 systemd 的 kubeadm 内嵌文件](/zh-cn/docs/setup/production-environment/tools/kubeadm/kubelet-integration/#the-kubelet-drop-in-file-for-systemd)。

<!--
### Use kubeadm with CRI runtimes

By default kubeadm attempts to detect your container runtime. For more details on this detection,
see the [kubeadm CRI installation guide](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime).
-->
### 结合 CRI 运行时使用 kubeadm   {#use-kubeadm-with-cri-runtimes}

默认情况下，kubeadm 尝试检测你的容器运行环境。有关此检测的更多详细信息，请参见
[kubeadm CRI 安装指南](/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime)。

<!--
### Setting the node name

By default, `kubeadm` assigns a node name based on a machine's host address.
You can override this setting with the `--node-name` flag.
The flag passes the appropriate [`--hostname-override`](/docs/reference/command-line-tools-reference/kubelet/#options)
value to the kubelet.
-->
### 设置节点的名称  {#setting-the-node-name}

默认情况下，`kubeadm` 基于机器的主机地址分配一个节点名称。你可以使用 `--node-name` 参数覆盖此设置。
此标识将合适的 [`--hostname-override`](/zh-cn/docs/reference/command-line-tools-reference/kubelet/#options)
值传递给 kubelet。

<!--
Be aware that overriding the hostname can
[interfere with cloud providers](https://github.com/kubernetes/website/pull/8873).
-->
要注意，重载主机名可能会[与云驱动发生冲突](https://github.com/kubernetes/website/pull/8873)。

<!--
### Automating kubeadm

Rather than copying the token you obtained from `kubeadm init` to each node, as
in the [basic kubeadm tutorial](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/),
you can parallelize the token distribution for easier automation. To implement this automation,
you must know the IP address that the control-plane node will have after it is started, or use a
DNS name or an address of a load balancer.
-->
### kubeadm 自动化   {#automating-kubeadm}

除了像文档
[kubeadm 基础教程](/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)中所描述的那样，
将从 `kubeadm init` 取得的令牌复制到每个节点，你还可以并行地分发令牌以实现更简单的自动化。
要实现自动化，你必须知道控制平面节点启动后将拥有的 IP 地址，或使用 DNS 名称或负载均衡器的地址。

<!--
1. Generate a token. This token must have the form  `<6 character string>.<16
   character string>`. More formally, it must match the regex:
   `[a-z0-9]{6}\.[a-z0-9]{16}`.

   kubeadm can generate a token for you:
-->
1. 生成一个令牌。这个令牌必须采用的格式为：`<6 个字符的字符串>.<16 个字符的字符串>`。
   更加正式的说法是，它必须符合正则表达式：`[a-z0-9]{6}\.[a-z0-9]{16}`。

   kubeadm 可以为你生成一个令牌：

   ```shell
   kubeadm token generate
   ```

<!--
1. Start both the control-plane node and the worker nodes concurrently with this token.
   As they come up they should find each other and form the cluster.  The same
   `--token` argument can be used on both `kubeadm init` and `kubeadm join`.
-->
2. 使用这个令牌同时启动控制平面节点和工作节点。这些节点一旦运行起来应该就会互相寻找对方并且形成集群。
   同样的 `--token` 参数可以同时用于 `kubeadm init` 和 `kubeadm join` 命令。

<!--
1. Similar can be done for `--certificate-key` when joining additional control-plane
   nodes. The key can be generated using:
-->
3. 当接入其他控制平面节点时，可以对 `--certificate-key` 执行类似的操作。可以使用以下方式生成密钥：

   ```shell
   kubeadm certs certificate-key
   ```

<!--
Once the cluster is up, you can use the `/etc/kubernetes/admin.conf` file from
a control-plane node to talk to the cluster with administrator credentials or
[Generating kubeconfig files for additional users](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#kubeconfig-additional-users).
-->
一旦集群启动起来，你就可以从控制平面节点的 `/etc/kubernetes/admin.conf` 文件获取管理凭证，
并使用这个凭证同集群通信。

一旦集群启动起来，你就可以从控制平面节点中的 `/etc/kubernetes/admin.conf`
文件获取管理凭证或通过[为其他用户生成的 kubeconfig 文件](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#kubeconfig-additional-users)与集群通信。

<!--
Note that this style of bootstrap has some relaxed security guarantees because
it does not allow the root CA hash to be validated with
`--discovery-token-ca-cert-hash` (since it's not generated when the nodes are
provisioned). For details, see the [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/).
-->
注意这种搭建集群的方式在安全保证上会有一些宽松，因为这种方式不允许使用
`--discovery-token-ca-cert-hash` 来验证根 CA 的哈希值
（因为当配置节点的时候，它还没有被生成）。
更多信息请参阅 [kubeadm join](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-join/) 文档。

## {{% heading "whatsnext" %}}

<!--
* [kubeadm init phase](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/) to understand more about
  `kubeadm init` phases
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to bootstrap a Kubernetes
  worker node and join it to the cluster
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/) to upgrade a Kubernetes
  cluster to a newer version
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) to revert any changes made
  to this host by `kubeadm init` or `kubeadm join`
-->
* 进一步阅读了解 [kubeadm init 阶段](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/)
* [kubeadm join](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-join/)
  启动一个 Kubernetes 工作节点并且将其加入到集群
* [kubeadm upgrade](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/)
  将 Kubernetes 集群升级到新版本
* [kubeadm reset](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-reset/)
  恢复 `kubeadm init` 或 `kubeadm join` 命令对节点所作的变更
