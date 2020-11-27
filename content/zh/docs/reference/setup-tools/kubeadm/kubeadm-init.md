---
title: kubeadm init
content_type: concept
weight: 20
---

<!--
reviewers:
- mikedanese
- luxas
- jbeda
title: kubeadm init
content_type: concept
weight: 20
-->
<!-- overview -->

<!--
This command initializes a Kubernetes control-plane node.
-->
此命令初始化一个 Kubernetes 控制平面节点。


<!-- body -->

{{< include "generated/kubeadm_init.md" >}}

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
   user specifies `-ignore-preflight-errors=<list-of-errors>`.
-->
1. 在做出变更前运行一系列的预检项来验证系统状态。一些检查项目仅仅触发警告，
   其它的则会被视为错误并且退出 kubeadm，除非问题得到解决或者用户指定了
   `--ignore-preflight-errors=<list-of-errors>` 参数。

<!--
2. Generates a self-signed CA (or using an existing one if provided) to set up
   identities for each component in the cluster. If the user has provided their
   own CA cert and/or key by dropping it in the cert directory configured via `-cert-dir`
   (`/etc/kubernetes/pki` by default) this step is skipped as described in the
   [Using custom certificates](#custom-certificates) document.
   The APIServer certs will have additional SAN entries for any `-apiserver-cert-extra-sans` arguments, lowercased if necessary.
-->
2. 生成一个自签名的 CA 证书 (或者使用现有的证书，如果提供的话) 来为集群中的每一个组件建立身份标识。
   如果用户已经通过 `--cert-dir` 配置的证书目录（默认为 `/etc/kubernetes/pki`）提供了他们自己的
   CA 证书以及/或者密钥，那么将会跳过这个步骤，正如文档[使用自定义证书](#custom-certificates)所述。
   如果指定了 `--apiserver-cert-extra-sans` 参数, APIServer 的证书将会有额外的 SAN 条目，
   如果必要的话，将会被转为小写。

<!--
3. Writes kubeconfig files in `/etc/kubernetes/`  for
   the kubelet, the controller-manager and the scheduler to use to connect to the
   API server, each with its own identity, as well as an additional
   kubeconfig file for administration named `admin.conf`.
-->
3. 将 kubeconfig 文件写入 `/etc/kubernetes/` 目录以便 kubelet、控制器管理器和调度器用来连接到
   API 服务器，它们每一个都有自己的身份标识，同时生成一个名为 `admin.conf` 的独立的 kubeconfig
   文件，用于管理操作。

<!--
4. Generates static Pod manifests for the API server,controller-manager and scheduler. In case an external etcd is not provided,an additional static Pod manifest is generated for etcd.
-->
4. 为 API 服务器、控制器管理器和调度器生成静态 Pod 的清单文件。假使没有提供一个外部的 etcd
   服务的话，也会为 etcd 生成一份额外的静态 Pod 清单文件。

<!--
Static Pod manifests are written to `/etc/kubernetes/manifests`; the kubelet watches this directory for Pods to create on startup.

Once control plane Pods are up and running, the `kubeadm init` sequence can continue.
-->
静态 Pod 的清单文件被写入到 `/etc/kubernetes/manifests` 目录; kubelet 会监视这个目录以便在系统启动的时候创建 Pod。

一旦控制平面的 Pod 都运行起来， `kubeadm init` 的工作流程就继续往下执行。

<!--
1. Apply labels and taints to the control-plane node so that no additional workloads will
run there.
-->
1. 对控制平面节点应用 labels 和 taints 标记以便不会在它上面运行其它的工作负载。

<!--
2. Generates the token that additional nodes can use to register themselves with a control-plane in the future. Optionally, the user can provide a token via `-token`, as described in the [kubeadm token](/docs/reference/setup-tools/kubeadm/kubeadm-token/) docs.
-->
2. 生成令牌以便其它节点以后可以使用这个令牌向控制平面节点注册它们自己。
   (可选)，用户可以通过 `--token` 提供一个令牌，正如文档
   [kubeadm token](/zh/docs/reference/setup-tools/kubeadm/kubeadm-token/) 所述。

<!--
3. Makes all the necessary configurations for allowing node joining with the [Bootstrap Tokens](/docs/reference/access-authn-authz/bootstrap-tokens/) and [TLS Bootstrap](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/) mechanism:
- Write a ConfigMap for making available all the information required for joining, and set up related RBAC access rules.
- Let Bootstrap Tokens access the CSR signing API.
- Configure auto-approval for new CSR requests.
-->
3. 为了使得节点能够遵照[启动引导令牌](/zh/docs/reference/access-authn-authz/bootstrap-tokens/)
   和 [TLS 启动引导](/zh/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/)
   这两份文档中描述的机制加入到集群中，kubeadm 会执行所有的必要配置：

   - 创建一份 ConfigMap 提供添加集群节点所需的信息，并为该 ConfigMap 设置相关的 RBAC 访问规则。
   - 使得 Bootstrap Tokens 可以访问 CSR 签名 API。
   - 对新的 CSR 请求配置为自动签发。

<!--
See [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) for additional info.
-->
查阅[kubeadm join](/zh/docs/reference/setup-tools/kubeadm/kubeadm-join/)文档以获取更多信息。

<!-- 
1. Installs a DNS server (CoreDNS) and the kube-proxy addon components via the API server.
   In Kubernetes version 1.11 and later CoreDNS is the default DNS server.
   To install kube-dns instead of CoreDNS, the DNS addon has to be configured in the kubeadm `ClusterConfiguration`. For more information about the configuration see the section
   `Using kubeadm init with a configuration file` below.
   Please note that although the DNS server is deployed, it will not be scheduled until CNI is installed. -->
1.  通过 API 服务器安装一个 DNS 服务器 (CoreDNS) 和 kube-proxy 附加组件。
   在 1.11 版本以及更新版本的 Kubernetes 中 CoreDNS 是默认的 DNS 服务器。
   要安装 kube-dns 而不是 CoreDNS，必须在 kubeadm `ClusterConfiguration` 中配置 DNS 插件。
   有关配置的更多信息，请参见下面的"带配置文件使用 kubeadm init" 一节。
   请注意，尽管已部署 DNS 服务器，但直到安装 CNI 时才调度它。

<!--
### Using init phases with kubeadm {#init-phases}
-->
### 在 kubeadm 中使用 init phases {#init-phases}

<!--
Kubeadm allows you to create a control-plane node in phases using the `kubeadm init phase` command.
-->
Kubeadm 允许你使用 `kubeadm init phase` 命令分阶段创建控制平面节点。

<!--
To view the ordered list of phases and sub-phases you can call `kubeadm init -help`. The list will be located at the top of the help screen and each phase will have a description next to it.
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
You can also use `-help` to see the list of sub-phases for a certain parent phase:
-->
你也可以使用 `--help` 查看特定父阶段的子阶段列表：

```shell
sudo kubeadm init phase control-plane --help
```

<!--
`kubeadm init` also exposes a flag called `-skip-phases` that can be used to skip certain phases. The flag accepts a list of phase names and the names can be taken from the above ordered list.
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
What this example would do is write the manifest files for the control plane and etcd in `/etc/kubernetes/manifests` based on the configuration in `configfile.yaml`. This allows you to modify the files and then skip these phases using `-skip-phases`. By calling the last command you will create a control plane node with the custom manifest files.
-->
该示例将执行的操作是基于 `configfile.yaml` 中的配置在 `/etc/kubernetes/manifests` 
中写入控制平面和 etcd 的清单文件。
这允许你修改文件，然后使用 `--skip-phases` 跳过这些阶段。
通过调用最后一个命令，你将使用自定义清单文件创建一个控制平面节点。

<!--
### Using kubeadm init with a configuration file {#config-file}
-->
### 结合一份配置文件来使用 kubeadm init {#config-file}

<!--
The config file is still considered beta and may change in future versions.
-->
{{< caution >}}
配置文件的功能仍然处于 alpha 状态并且在将来的版本中可能会改变。
{{< /caution >}}

<!--
It's possible to configure `kubeadm init` with a configuration file instead of command
line flags, and some more advanced features may only be available as
configuration file options. This file is passed with the `-config` option.
-->
通过一份配置文件而不是使用命令行参数来配置 `kubeadm init` 命令是可能的，
但是一些更加高级的功能只能够通过配置文件设定。这份配置文件通过 `--config` 选项参数指定。

<!--
The default configuration can be printed out using the
[kubeadm config print](/docs/reference/setup-tools/kubeadm/kubeadm-config/) command.

It is **recommended** that you migrate your old `v1beta1` configuration to `v1beta2` using
the [kubeadm config migrate](/docs/reference/setup-tools/kubeadm/kubeadm-config/) command.

For more details on each field in the `v1beta2` configuration you can navigate to our
[API reference pages](https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta2).
-->
可以使用 [kubeadm config print](/zh/docs/reference/setup-tools/kubeadm/kubeadm-config/)命令打印出默认配置。

**推荐**使用 [kubeadm config migrate](/zh/docs/reference/setup-tools/kubeadm/kubeadm-config/)
命令将旧的 `v1beta1` 版本的配置迁移到 `v1beta2` 版本。

获取 `v1beta2` 版本配置中每个字段的细节说明，查看我们的
[API 参考页面](https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta2)。

<!--
### Adding kube-proxy parameters {#kube-proxy}
-->
### 添加 kube-proxy 参数 {#kube-proxy}

<!--
For information about kube-proxy parameters in the kubeadm configuration see:
- [kube-proxy](https://godoc.org/k8s.io/kubernetes/pkg/proxy/apis/config#KubeProxyConfiguration)

For information about enabling IPVS mode with kubeadm see:
- [IPVS](https://github.com/kubernetes/kubernetes/blob/master/pkg/proxy/ipvs/README.md)
-->
kubeadm 配置中有关 kube-proxy 的说明请查看：
- [kube-proxy](https://godoc.org/k8s.io/kubernetes/pkg/proxy/apis/config#KubeProxyConfiguration)

使用 kubeadm 启用 IPVS 模式的说明请查看：
- [IPVS](https://github.com/kubernetes/kubernetes/blob/master/pkg/proxy/ipvs/README.md)

<!--
### Passing custom flags to control plane components {#control-plane-flags}
-->
### 向控制平面组件传递自定义的命令行参数 {#control-plane-flags}

<!--
For information about passing flags to control plane components see:
- [control-plane-flags](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/) -->
有关向控制平面组件传递命令行参数的说明请查看：
[控制平面命令行参数](//zh/docs/setup/production-environment/tools/kubeadm/control-plane-flags/)

<!--
### Using custom images {#custom-images}
-->
### 使用自定义的镜像 {#custom-images}

<!--
By default, kubeadm pulls images from `k8s.gcr.io`. If the
requested Kubernetes version is a CI label (such as `ci/latest`)
`gcr.io/kubernetes-ci-images` is used.
-->
默认情况下, kubeadm 会从 `k8s.gcr.io` 仓库拉取镜像。如果请求的 Kubernetes 版本是 CI 标签
（例如 `ci/latest`），则使用 `gcr.io/kubernetes-ci-images`。

<!--
You can override this behavior by using [kubeadm with a configuration file](#config-file).
-->
你可以通过使用[带有配置文件的 kubeadm](#config-file)来重写此操作。

<!--
Allowed customization are:

* To provide an alternative `imageRepository` to be used instead of
  `k8s.gcr.io`.
* To set `useHyperKubeImage` to `true` to use the HyperKube image.
* To provide a specific `imageRepository` and `imageTag` for etcd or DNS add-on.
-->
允许的自定义功能有：

* 使用其他的 `imageRepository` 来代替 `k8s.gcr.io`。
* 将 `useHyperKubeImage` 设置为 `true`，使用 HyperKube 镜像。
* 为 etcd 或 DNS 附件提供特定的 `imageRepository` 和 `imageTag`。

<!--
Please note that the configuration field `kubernetesVersion` or the command line flag
`-kubernetes-version` affect the version of the images.
-->
请注意配置文件中的配置项 `kubernetesVersion` 或者命令行参数 `--kubernetes-version`
会影响到镜像的版本。

<!--
### Uploading control-plane certificates to the cluster
-->
### 将控制平面证书上传到集群

<!--
By adding the flag `-upload-certs` to `kubeadm init` you can temporary upload
the control-plane certificates to a Secret in the cluster. Please note that this Secret
will expire automatically after 2 hours. The certificates are encrypted using
a 32byte key that can be specified using `-certificate-key`. The same key can be used
to download the certificates when additional control-plane nodes are joining, by passing
`-control-plane` and `-certificate-key` to `kubeadm join`.
-->
通过将参数 `--upload-certs` 添加到 `kubeadm init`，你可以将控制平面证书临时上传到集群中的 Secret。
请注意，此 Secret 将在 2 小时后自动过期。证书使用 32 字节密钥加密，可以使用 `--certificate-key` 指定。
通过将 `--control-plane` 和 `--certificate-key` 传递给 `kubeadm join`，
可以在添加其他控制平面节点时使用相同的密钥下载证书。

<!--
The following phase command can be used to re-upload the certificates after expiration:
-->
以下阶段命令可用于证书到期后重新上传证书：

```
kubeadm init phase upload-certs --upload-certs --certificate-key=SOME_VALUE
```

<!--
If the flag `-certificate-key` is not passed to `kubeadm init` and
`kubeadm init phase upload-certs` a new key will be generated automatically.
-->
如果未将参数 `--certificate-key` 传递给 `kubeadm init` 和 `kubeadm init phase upload-certs`，
则会自动生成一个新密钥。

<!--
The following command can be used to generate a new key on demand:
-->
以下命令可用于按需生成新密钥：

```
kubeadm alpha certs certificate-key
```

<!--
### Using custom certificates {#custom-certificates}
-->
### 使用自定义的证书 {#custom-certificates}

<!--
By default, kubeadm generates all the certificates needed for a cluster to run.
You can override this behavior by providing your own certificates.
-->
默认情况下, kubeadm 会生成运行一个集群所需的全部证书。
你可以通过提供你自己的证书来改变这个行为策略。

<!--
To do so, you must place them in whatever directory is specified by the
`-cert-dir` flag or `CertificatesDir` configuration file key. By default this
is `/etc/kubernetes/pki`.
-->
如果要这样做, 你必须将证书文件放置在通过 `--cert-dir` 命令行参数或者配置文件里的
`CertificatesDir` 配置项指明的目录中。默认的值是 `/etc/kubernetes/pki`。

<!--
If a given certificate and private key pair exists before running `kubeadm init`,
kubeadm will not overwrite them. This means you can, for example, copy an existing
CA into `/etc/kubernetes/pki/ca.crt` and `/etc/kubernetes/pki/ca.key`,
and kubeadm will use this CA for signing the rest of the certificates.
-->
如果在运行 `kubeadm init` 之前存在给定的证书和私钥对，则 kubeadm 将不会重写它们。
例如，这意味着你可以将现有的 CA 复制到 `/etc/kubernetes/pki/ca.crt` 和
`/etc/kubernetes/pki/ca.key` 中，而 kubeadm 将使用此 CA 对其余证书进行签名。

<!--
#### External CA mode {#external-ca-mode}
-->
#### 外部 CA 模式 {#external-ca-mode}

<!--
It is also possible to provide just the `ca.crt` file and not the
`ca.key` file (this is only available for the root CA file, not other cert pairs).
If all other certificates and kubeconfig files are in place, kubeadm recognizes
this condition and activates the "External CA" mode. kubeadm will proceed without the
CA key on disk.
-->
如果只提供了 `ca.crt` 文件但是没有提供 `ca.key` 文件也是可以的 (这只对 CA 根证书可用，其它证书不可用)。
如果所有的其它证书和 kubeconfig 文件已就绪， kubeadm 检测到满足以上条件就会激活 "外部 CA" 模式。
kubeadm 将会在没有 CA 密钥文件的情况下继续执行。

<!--
Instead, run the controller-manager standalone with `-controllers=csrsigner` and
point to the CA certificate and key.
-->
否则, kubeadm 将独立运行 controller-manager，附加一个 `--controllers=csrsigner` 的参数，
并且指明 CA 证书和密钥。

<!--
### Managing the kubeadm drop-in file for the kubelet {#kubelet-drop-in}
-->
### 管理 kubeadm 为 kubelet 提供的 systemd 配置文件 {#kubelet-drop-in}

<!--
The `kubeadm` package ships with a configuration file for running the `kubelet` by `systemd`. Note that the kubeadm CLI never touches this drop-in file. This drop-in file is part of the kubeadm DEB/RPM package.
-->
`kubeadm` 包自带了关于 `systemd` 如何运行 `kubelet` 的配置文件。
请注意 `kubeadm` 客户端命令行工具永远不会修改这份 `systemd` 配置文件。
这份 `systemd` 配置文件属于 kubeadm DEB/RPM 包。

<!--
For further information, see [Managing the kubeadm drop-in file for systemd](/docs/setup/production-environment/tools/kubeadm/kubelet-integration/#the-kubelet-drop-in-file-for-systemd).
-->
有关更多信息，请阅读
[管理 systemd 的 kubeadm 内嵌文件](/zh/docs/setup/production-environment/tools/kubeadm/kubelet-integration/#the-kubelet-drop-in-file-for-systemd)。

<!--
### Use kubeadm with CRI runtimes
-->
### 结合 CRI 运行时使用 kubeadm

<!--
By default kubeadm attempts to detect your container runtime. For more details on this detection, see
the [kubeadm CRI installation guide](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime).
-->
默认情况下，kubeadm 尝试检测你的容器运行环境。有关此检测的更多详细信息，请参见
[kubeadm CRI 安装指南](/zh/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime)。

<!--
### Setting the node name
-->
### 设置节点的名称

<!--
By default, `kubeadm` assigns a node name based on a machine's host address. You can override this setting with the `-node-name` flag.
The flag passes the appropriate [`-hostname-override`](/docs/reference/command-line-tools-reference/kubelet/#options)
value to the kubelet.
-->
默认情况下, `kubeadm` 基于机器的主机地址分配一个节点名称。你可以使用 `--node-name` 参数覆盖此设置。
此标识将合适的
[`--hostname-override`](/zh/docs/reference/command-line-tools-reference/kubelet/#options)
值传递给 kubelet。

<!--
### Running kubeadm without an internet connection
-->
### 在没有互联网连接的情况下运行 kubeadm

<!--
For running kubeadm without an internet connection you have to pre-pull the required control-plane images.
-->
要在没有互联网连接的情况下运行 kubeadm，你必须提前拉取所需的控制平面镜像。

<!--
You can list and pull the images using the `kubeadm config images` sub-command:
-->
你可以使用 `kubeadm config images` 子命令列出并拉取镜像：

```shell
kubeadm config images list
kubeadm config images pull
```

<!--
All images that kubeadm requires such as `k8s.gcr.io/kube-*`, `k8s.gcr.io/etcd` and `k8s.gcr.io/pause` support multiple architectures.
-->
kubeadm 需要的所有镜像，例如 `k8s.gcr.io/kube-*`、`k8s.gcr.io/etcd` 和 `k8s.gcr.io/pause` 都支持多种架构。

<!--
### Automating kubeadm
-->
### kubeadm 自动化

<!--
Rather than copying the token you obtained from `kubeadm init` to each node, as
in the [basic kubeadm tutorial](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/), you can parallelize the
token distribution for easier automation. To implement this automation, you must
know the IP address that the control-plane node will have after it is started,
or use a DNS name or an address of a load balancer.
-->
不必像文档[kubeadm 基础教程](/zh/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)所述，
将从 `kubeadm init` 取得的令牌复制到每个节点，你可以并行地分发令牌以实现简单自动化。要实现自动化，
你必须知道控制平面节点启动后将拥有的 IP 地址，或使用 DNS 名称或负载均衡器的地址。

<!--
1.  Generate a token. This token must have the form  `<6 character string>.<16
character string>`. More formally, it must match the regex: `[a-z0-9]{6}\.[a-z0-9]{16}`.
kubeadm can generate a token for you: -->
1. 生成一个令牌。这个令牌必须具有以下格式：`< 6 个字符的字符串>.< 16 个字符的字符串>`。
   更加正式的说法是，它必须符合以下正则表达式：`[a-z0-9]{6}\.[a-z0-9]{16}`。
   kubeadm 可以为你生成一个令牌：

   ```shell
   kubeadm token generate
   ```

<!--
2.  Start both the control-plane node and the worker nodes concurrently with this token.
As they come up they should find each other and form the cluster. The same `-token` argument can be used on both `kubeadm init` and `kubeadm join`. 
-->
2. 使用这个令牌同时启动控制平面节点和工作节点。它们一旦运行起来应该就会互相寻找对方并且建立集群。
   同样的 `--token` 参数可以同时用于 `kubeadm init` 和 `kubeadm join` 命令。

<!--
3.  Similar can be done for `-certificate-key` when joining additional control-plane nodes. The key can be generated using:
-->
3. 当加入其他控制平面节点时，可以对 `--certificate-key` 执行类似的操作。可以使用以下方式生成密钥：

   ```shell
   kubeadm alpha certs certificate-key
   ```

<!--
Once the cluster is up, you can grab the admin credentials from the control-plane node
at `/etc/kubernetes/admin.conf` and use that to talk to the cluster.
-->
一旦集群启动起来，你就可以从控制平面节点的 `/etc/kubernetes/admin.conf` 文件获取管理凭证，
并使用这个凭证同集群通信。

<!--
Note that this style of bootstrap has some relaxed security guarantees because
it does not allow the root CA hash to be validated with
`-discovery-token-ca-cert-hash` (since it's not generated when the nodes are
provisioned). For details, see the [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/).
-->
注意这种搭建集群的方式在安全保证上会有一些宽松，因为这种方式不允许使用 `--discovery-token-ca-cert-hash` 
来验证根 CA 的哈希值（因为当配置节点的时候，它还没有被生成）。
更多信息请参阅[kubeadm join](/zh/docs/reference/setup-tools/kubeadm/kubeadm-join/)文档。

## {{% heading "whatsnext" %}}

<!--
* [kubeadm init phase](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/) to understand more about
`kubeadm init` phases
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to bootstrap a Kubernetes worker node and join it to the cluster
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/) to upgrade a Kubernetes cluster to a newer version
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) to revert any changes made to this host by `kubeadm init` or `kubeadm join`
-->
* 进一步阅读了解[kubeadm init 阶段](/zh/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/)
* [kubeadm join](/zh/docs/reference/setup-tools/kubeadm/kubeadm-join/)启动一个 Kubernetes 工作节点并且将其加入到集群
* [kubeadm upgrade](/zh/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/)将 Kubernetes 集群升级到新版本
* [kubeadm reset](/zh/docs/reference/setup-tools/kubeadm/kubeadm-reset/)使用 `kubeadm init` 或 `kubeadm join` 来恢复对节点的变更

