---
title: kubeadm init
content_template: templates/concept
weight: 20
---
{{% capture overview %}}
<!-- This command initializes a Kubernetes master node. -->
此命令初始化一个 Kubernetes master 节点
{{% /capture %}}

{{% capture body %}}

{{< include "generated/kubeadm_init.md" >}}

<!-- ### Init workflow {#init-workflow} -->
### Init 命令的工作流程 {#init-workflow}
<!-- `kubeadm init` bootstraps a Kubernetes master node by executing the
following steps: -->
`kubeadm init` 命令通过执行下列步骤来启动一个 Kubernetes master 节点。

<!-- 1. Runs a series of pre-flight checks to validate the system state
   before making changes. Some checks only trigger warnings, others are
   considered errors and will exit kubeadm until the problem is corrected or the
   user specifies `--ignore-preflight-errors=<list-of-errors>`. -->
1. 在做出变更前运行一系列的预检项来验证系统状态。 一些检查项目仅仅触发警告，其它的则会被视为错误并且退出 kubeadm，除非问题被解决或者用户指定了 `--ignore-preflight-errors=<list-of-errors>` 参数。

<!-- 2. Generates a self-signed CA (or using an existing one if provided) to set up
   identities for each component in the cluster. If the user has provided their
   own CA cert and/or key by dropping it in the cert directory configured via `--cert-dir`
   (`/etc/kubernetes/pki` by default) this step is skipped as described in the
   [Using custom certificates](#custom-certificates) document.
   The APIServer certs will have additional SAN entries for any `--apiserver-cert-extra-sans` arguments, lowercased if necessary. -->
2. 生成一个自签名的 CA证书 (或者使用现有的证书，如果提供的话) 来为集群中的每一个组件建立身份标识。如果用户已经通过 `--cert-dir` 配置的证书目录（缺省值为 `/etc/kubernetes/pki`）提供了他们自己的 CA证书 以及/或者 密钥， 那么将会跳过这个步骤，正如文档[使用自定义证书](#custom-certificates)中所描述的那样。
   如果指定了 `--apiserver-cert-extra-sans` 参数, APIServer 的证书将会有额外的 SAN 条目，如果必要的话，将会被转为小写。

<!-- 3. Writes kubeconfig files in `/etc/kubernetes/`  for
   the kubelet, the controller-manager and the scheduler to use to connect to the
   API server, each with its own identity, as well as an additional
   kubeconfig file for administration named `admin.conf`. -->
1. 将 kubeconfig 文件写入 `/etc/kubernetes/` 目录以便 kubelet、controller-manager 和 scheduler 用来连接到 API server，它们每一个都有自己的身份标识，同时生成一个名为 admin.conf 的独立的 kubeconfig 文件，用于管理操作。

<!-- 4. If kubeadm is invoked with `--feature-gates=DynamicKubeletConfig` enabled,
   it writes the kubelet init configuration into the `/var/lib/kubelet/config/init/kubelet` file.
   See [Set Kubelet parameters via a config file](/docs/tasks/administer-cluster/kubelet-config-file/)
   and [Reconfigure a Node's Kubelet in a Live Cluster](/docs/tasks/administer-cluster/reconfigure-kubelet/)
   for more information about Dynamic Kubelet Configuration.
   This functionality is now by default disabled as it is behind a feature gate, but is expected to be a default in future versions. -->
4. 如果 kubeadm 被调用时附带了 `--feature-gates=DynamicKubeletConfig` 参数,
   它会将 kubelet 的初始化配置写入 `/var/lib/kubelet/config/init/kubelet` 文件中。
   参阅 [通过配置文件设置 Kubelet 参数](/docs/tasks/administer-cluster/kubelet-config-file/)以及 [在一个现有的集群中重新配置节点的 Kubelet 设置](/docs/tasks/administer-cluster/reconfigure-kubelet/)来获取更多关于动态配置 Kubelet 的信息。
   这个功能现在是默认关闭的，正如你所见它通过一个功能开关控制开闭, 但是在未来的版本中很有可能会默认启用。

<!-- 5. Generates static Pod manifests for the API server,
   controller manager and scheduler. In case an external etcd is not provided,
   an additional static Pod manifest are generated for etcd. -->
5. 为 API server、controller manager 和 scheduler 生成静态 Pod 的清单文件。假使没有提供一个外部的 etcd 服务的话，也会为 etcd 生成一份额外的静态 Pod 清单文件。

<!-- Static Pod manifests are written to `/etc/kubernetes/manifests`; the kubelet
   watches this directory for Pods to create on startup. -->
静态 Pod 的清单文件被写入到 `/etc/kubernetes/manifests` 目录; kubelet 会监视这个目录以便在系统启动的时候创建 Pods。

<!-- Once control plane Pods are up and running, the `kubeadm init` sequence can continue. -->
一旦 control plane 的 Pods 都运行起来， `kubeadm init` 的工作流程就继续往下执行。

<!-- 1. If kubeadm is invoked with `--feature-gates=DynamicKubeletConfig` enabled,
   it completes the kubelet dynamic configuration by creating a ConfigMap and some RBAC rules that enable
   kubelets to access to it, and updates the node by pointing `Node.spec.configSource` to the
   newly-created ConfigMap.
   This functionality is now by default disabled as it is behind a feature gate, but is expected to be a default in future versions. -->
1. 如果 kubeadm 被调用时附带了 `--feature-gates=DynamicKubeletConfig` 参数,
   它将创建一份 ConfigMap 和一些便于 kubelet 访问这份 ConfigMap 的 RBAC 规则，并且通过将 `Node.spec.configSource` 指向到新创建的 ConfigMap 来更新节点设置。这样它就完成了对 Kubelet 的动态配置。
   这个功能现在是默认关闭的，正如你所见它通过一个功能开关控制开闭, 但是在未来的版本中很有可能会默认启用。

<!-- 2. Apply labels and taints to the master node so that no additional workloads will
   run there. -->
2. 对 master 节点应用 labels 和 taints 以便不会在它上面运行其它的工作负载。

<!-- 3. Generates the token that additional nodes can use to register
   themselves with the master in the future.  Optionally, the user can provide a
   token via `--token`, as described in the
   [kubeadm token](/docs/reference/setup-tools/kubeadm/kubeadm-token/) docs. -->
3. 生成令牌以便其它节点以后可以使用这个令牌向 master 节点注册它们自己。 可选的，用户可以通过 `--token` 提供一个令牌, 正如文档[kubeadm 的令牌](/docs/reference/setup-tools/kubeadm/kubeadm-token/) 描述的那样。  

<!-- 4. Makes all the necessary configurations for allowing node joining with the
   [Bootstrap Tokens](/docs/reference/access-authn-authz/bootstrap-tokens/) and
   [TLS Bootstrap](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/)
   mechanism:

   - Write a ConfigMap for making available all the information required
     for joining, and set up related RBAC access rules.

   - Let Bootstrap Tokens access the CSR signing API.

   - Configure auto-approval for new CSR requests. -->
4. 为了使得节点能够遵照 [Bootstrap Tokens](/docs/reference/access-authn-authz/bootstrap-tokens/) 和 [TLS Bootstrap](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/)这两份文档中描述的机制加入到集群中，kubeadm 会执行所有的必要配置：

   - 创建一份 ConfigMap 提供添加集群节点所需的信息，并为该 ConfigMap 设置相关的 RBAC 访问规则。

   - 使得 Bootstrap Tokens 可以访问 CSR 签名 API。

   - 对新的 CSR 请求配置为自动签发。

查阅 [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) 文档以获取更多信息。

<!-- 1.  Installs a DNS server (CoreDNS) and the kube-proxy addon components via the API server.
   In Kubernetes version 1.11 and later CoreDNS is the default DNS server.
   To install kube-dns instead of CoreDNS, kubeadm must be invoked with `--feature-gates=CoreDNS=false`.
   Please note that although the DNS server is deployed, it will not be scheduled until CNI is installed. -->
1. 通过 API server 安装一个 DNS 服务器 (CoreDNS) 和 kube-proxy 附加组件。
   在 1.11 版本以及更新版本的 Kubernetes 中 CoreDNS 是默认的 DNS 服务器。
   如果要安装 kube-dns 而不是 CoreDNS, 你需要在调用 kubeadm 的时候附加 `--feature-gates=CoreDNS=false` 参数。请注意，尽管 DNS 服务器已经被部署了，它并不会被调度直到你安装好了 CNI 网络插件。

<!-- 2. If `kubeadm init` is invoked with the alpha self-hosting feature enabled,
   (`--feature-gates=SelfHosting=true`), the static Pod based control plane is
   transformed into a [self-hosted control plane](#self-hosting). -->
2. 如果调用 `kubeadm init` 命令时启用了 alpha 状态的 self-hosting 功能(`--feature-gates=SelfHosting=true`)，基于静态 Pod 的 control plane 将被转换为 [self-hosted control plane](#self-hosting)。

<!-- ### Using kubeadm init with a configuration file {#config-file} -->
### 结合一份配置文件来使用 kubeadm init {#config-file}

{{< caution >}}
<!-- **Caution:** The config file is
still considered alpha and may change in future versions. -->
**注意:** 配置文件的功能仍然处于 alpha 状态并且在将来的版本中可能会改变。
{{< /caution >}}

<!-- It's possible to configure `kubeadm init` with a configuration file instead of command
line flags, and some more advanced features may only be available as
configuration file options. This file is passed in the `--config` option. -->
通过一份配置文件而不是使用命令行参数来配置 `kubeadm init` 命令是可能的，并且一些更加高级的功能只能够通过配置文件设定。 这份配置文件通过 `--config` 选项参数指定。

<!-- In Kubernetes 1.11 and later, the default configuration can be printed out using the
[kubeadm config print-default](/docs/reference/setup-tools/kubeadm/kubeadm-config/) command.
It is **recommended** that you migrate your old `v1alpha3` configuration to `v1beta1` using
the [kubeadm config migrate](/docs/reference/setup-tools/kubeadm/kubeadm-config/) command,
because `v1alpha3` will be removed in Kubernetes 1.14. -->
在 Kubernetes 1.11 以及之后的版本中，默认的配置可以通过 [kubeadm config print-default](/docs/reference/setup-tools/kubeadm/kubeadm-config/) 命令打印出来。
**推荐**使用 [kubeadm config migrate](/docs/reference/setup-tools/kubeadm/kubeadm-config/) 命令将你的旧的 `v1alpha3` 版本的配置迁移到 `v1beta1` 版本。因为在 Kubernetes 1.14 版本中将会移除对 `v1alpha3` 这个版本的支持。

<!-- For more details on each field in the `v1beta1` configuration you can navigate to our
[API reference pages.] (https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta1) -->
如果你想获取 `v1beta1` 版本配置中每个字段的细节说明，你可以查看我们的[API reference 页面]。 (https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta1)

<!-- ### Adding kube-proxy parameters {#kube-proxy} -->
### 添加 kube-proxy 参数 {#kube-proxy}

<!-- For information about kube-proxy parameters in the kubeadm configuration see:
- [kube-proxy](https://godoc.org/k8s.io/kubernetes/pkg/proxy/apis/config#KubeProxyConfiguration) -->
kubeadm 配置中有关 kube-proxy 的说明请查看:
- [kube-proxy](https://godoc.org/k8s.io/kubernetes/pkg/proxy/apis/config#KubeProxyConfiguration)

<!-- For information about enabling IPVS mode with kubeadm see:
- [IPVS](https://github.com/kubernetes/kubernetes/blob/master/pkg/proxy/ipvs/README.md) -->
使用 kubeadm 启用 IPVS 模式的说明请查看:
- [IPVS](https://github.com/kubernetes/kubernetes/blob/master/pkg/proxy/ipvs/README.md)

<!-- ### Passing custom flags to control plane components {#control-plane-flags} -->
### 向 control plane 组件传递自定义的 flags {#control-plane-flags}

<!-- For information about passing flags to control plane components see:
- [control-plane-flags](/docs/setup/independent/control-plane-flags/) -->
有关向 control plane 组件传递 flags 的说明请查看:
- [control-plane-flags](/docs/setup/independent/control-plane-flags/)

<!-- ### Using custom images {#custom-images} -->
### 使用自定义的镜像 {#custom-images}

<!-- By default, kubeadm pulls images from `k8s.gcr.io`, unless
the requested Kubernetes version is a CI version. In this case,
`gcr.io/kubernetes-ci-images` is used. -->
默认情况下, kubeadm 会从 `k8s.gcr.io` 仓库拉取镜像, 除非请求的 Kubernetes 版本是一个持续集成版本。这这种情况下，则会使用 `gcr.io/kubernetes-ci-images` 仓库。

<!-- You can override this behavior by using [kubeadm with a configuration file](#config-file). -->
你可以通过这份文档里描述的方法 [结合一份配置文件来使用 kubeadm](#config-file) 来改变镜像拉取的策略。
<!-- Allowed customization are: -->
允许的自定义功能有:

<!-- * To provide an alternative `imageRepository` to be used instead of
  `k8s.gcr.io`.
* To provide a `unifiedControlPlaneImage` to be used instead of different images for control plane components.
* To provide a specific `etcd.image` to be used instead of the image available at`k8s.gcr.io`. -->
* 提供一个替代的镜像仓库 `imageRepository` 而不是使用 `k8s.gcr.io`。
* 提供一个统一的 Control Plane 镜像 `unifiedControlPlaneImage` 而不是对每一个 control plane 组件使用不同的镜像。
* 提供一个指定的 etcd 服务的镜像 `etcd.image` 而不是在 `k8s.gcr.io` 仓库中的可用镜像。

<!-- Please note that the configuration field `kubernetesVersion` or the command line flag
`--kubernetes-version` affect the version of the images. -->
请注意配置文件中的配置项 `kubernetesVersion` 或者命令行参数 `--kubernetes-version` 会影响到镜像的版本。

<!-- ### Using custom certificates {#custom-certificates} -->
### 使用自定义的证书 {#custom-certificates}

<!-- By default, kubeadm generates all the certificates needed for a cluster to run.
You can override this behavior by providing your own certificates. -->
默认情况下, kubeadm 会生成运行一个集群所需的全部证书。
你可以通过提供你自己的证书来改变这个行为策略。

<!-- To do so, you must place them in whatever directory is specified by the
`--cert-dir` flag or `CertificatesDir` configuration file key. By default this
is `/etc/kubernetes/pki`. -->
如果要这样做, 你必须将证书文件放置在通过 `--cert-dir` 命令行参数或者配置文件里的 `CertificatesDir` 配置项指明的目录中。默认的值是 `/etc/kubernetes/pki`。

<!-- If a given certificate and private key pair exists, kubeadm skips the
generation step and existing files are used for the prescribed
use case. This means you can, for example, copy an existing CA into `/etc/kubernetes/pki/ca.crt`
and `/etc/kubernetes/pki/ca.key`, and kubeadm will use this CA for signing the rest
of the certs. -->
如果给定的证书和密钥对已经存在，kubeadm 将会跳过生成证书的步骤并且直接将已经存在的文件用于规定的案例中。也就是说你可以拷贝一份已存在的 CA 文件到 `/etc/kubernetes/pki/ca.crt` 和 `/etc/kubernetes/pki/ca.key`，kubeadm将会使用这份 CA 来签发其余的证书。

<!-- #### External CA mode {#external-ca-mode} -->
#### 外部 CA 模式 {#external-ca-mode}

<!-- It is also possible to provide just the `ca.crt` file and not the
`ca.key` file (this is only available for the root CA file, not other cert pairs).
If all other certificates and kubeconfig files are in place, kubeadm recognizes
this condition and activates the "External CA" mode. kubeadm will proceed without the
CA key on disk. -->
如果只提供了 `ca.crt` 文件但是没有提供 `ca.key` 文件也是可以的 (这只对 CA 根证书可用，其它证书不可用)。
如果所有的其它证书和 kubeconfig 文件已就位， kubeadm 检测到满足以上条件就会激活 "外部 CA" 模式。 kubeadm 将会在没有 CA 密钥文件的情况下继续执行。

<!-- Instead, run the controller-manager standalone with `--controllers=csrsigner` and
point to the CA certificate and key. -->
否则, kubeadm 将独立运行 controller-manager，附加一个 `--controllers=csrsigner` 的参数，并且指明 CA 证书和密钥。

<!-- ### Managing the kubeadm drop-in file for the kubelet {#kubelet-drop-in} -->
### 管理 kubeadm 为 kubelet 提供的 systemd 配置文件 {#kubelet-drop-in}

<!-- The kubeadm package ships with configuration for how the kubelet should
be run. Note that the `kubeadm` CLI command never touches this drop-in file.
This drop-in file belongs to the kubeadm deb/rpm package. -->
kubeadm 包自带了关于 kubelet 应该如何运行的配置文件。请注意 `kubeadm` 客户端命令行工具永远不会修改这份 systemd 配置文件。这份 systemd 配置文件属于 kubeadm deb/rpm 包。

<!-- This is what it looks like: -->
这份文件应该看起来像这样:


```
[Service]
Environment="KUBELET_KUBECONFIG_ARGS=--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf"
Environment="KUBELET_SYSTEM_PODS_ARGS=--pod-manifest-path=/etc/kubernetes/manifests --allow-privileged=true"
Environment="KUBELET_NETWORK_ARGS=--network-plugin=cni --cni-conf-dir=/etc/cni/net.d --cni-bin-dir=/opt/cni/bin"
Environment="KUBELET_DNS_ARGS=--cluster-dns=10.96.0.10 --cluster-domain=cluster.local"
Environment="KUBELET_AUTHZ_ARGS=--authorization-mode=Webhook --client-ca-file=/etc/kubernetes/pki/ca.crt"
Environment="KUBELET_CADVISOR_ARGS="
Environment="KUBELET_CERTIFICATE_ARGS=--rotate-certificates=true --cert-dir=/var/lib/kubelet/pki"
ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_SYSTEM_PODS_ARGS $KUBELET_NETWORK_ARGS $KUBELET_DNS_ARGS $KUBELET_AUTHZ_ARGS $KUBELET_CADVISOR_ARGS $KUBELET_CERTIFICATE_ARGS $KUBELET_EXTRA_ARGS
```

<!-- Here's a breakdown of what/why: -->
以下是这份文件的详解：

<!-- * `--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf` path to a kubeconfig
   file that is used to get client certificates for kubelet during node join.
   On success, a kubeconfig file is written to the path specified by `--kubeconfig`. -->
* `--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf` 一份 kubeconfig 文件的路径，在加入节点时这份文件被 kubelet 用于获取客户端证书。如果证书获取成功, 一份 kubeconfig 文件将会被写入到由  `--kubeconfig` 参数指明的路径。
<!-- * `--kubeconfig=/etc/kubernetes/kubelet.conf` points to the kubeconfig file that
   tells the kubelet where the API server is. This file also has the kubelet's
   credentials. -->
* `--kubeconfig=/etc/kubernetes/kubelet.conf` 指向 kubeconfig 文件，这份文件为 kubelet 指明 API server 的地址。这份文件也包含了 kubelet 的证书。
<!-- * `--pod-manifest-path=/etc/kubernetes/manifests` specifies from where to read
   static Pod manifests used for starting the control plane. -->
* `--pod-manifest-path=/etc/kubernetes/manifests` 指明从哪里读取静态 Pod 的清单文件用于启动 control plane。
<!-- * `--allow-privileged=true` allows this kubelet to run privileged Pods. -->
* `--allow-privileged=true` 允许 kubelet 运行 privileged Pods。
<!-- * `--network-plugin=cni` uses CNI networking. -->
* `--network-plugin=cni` 使用 CNI 网络。
<!-- * `--cni-conf-dir=/etc/cni/net.d` specifies where to look for the
   [CNI spec file(s)](https://github.com/containernetworking/cni/blob/master/SPEC.md). -->
* `--cni-conf-dir=/etc/cni/net.d` 指明从哪里查找[CNI 规格文件](https://github.com/containernetworking/cni/blob/master/SPEC.md)。
<!-- * `--cni-bin-dir=/opt/cni/bin` specifies where to look for the actual CNI binaries. -->
* `--cni-bin-dir=/opt/cni/bin` 指明从哪里查找实际使用的 CNI 二进制文件。
<!-- * `--cluster-dns=10.96.0.10` use this cluster-internal DNS server for `nameserver`
   entries in Pods' `/etc/resolv.conf`. -->
* `--cluster-dns=10.96.0.10` 使用这个集群内部的 DNS 服务器作为 Pods 内 `/etc/resolv.conf` 文件中`nameserver` 的设定值。
<!-- * `--cluster-domain=cluster.local` uses this cluster-internal DNS domain for
   `search` entries in Pods' `/etc/resolv.conf`. -->
* `--cluster-domain=cluster.local` 使用这个集群内部的 DNS 域名作为 Pods 内 `/etc/resolv.conf` 文件中`search` 的设定值。
<!-- * `--client-ca-file=/etc/kubernetes/pki/ca.crt` authenticates requests to the Kubelet
   API using this CA certificate. -->
* `--client-ca-file=/etc/kubernetes/pki/ca.crt` 使用这个 CA 证书认证发往 Kubelet API 的请求。
<!-- * `--authorization-mode=Webhook` authorizes requests to the Kubelet API by `POST`-ing
   a `SubjectAccessReview` to the API server. -->
* `--authorization-mode=Webhook` 通过 `POST` 方法向 API server 发送一个 `SubjectAccessReview` 对象来授权发往 Kubelet API 的请求。
<!-- * `--rotate-certificates` auto rotate the kubelet client certificates by requesting new
   certificates from the `kube-apiserver` when the certificate expiration approaches. -->
* `--rotate-certificates` 当证书临近过期的时候，通过从 `kube-apiserver` 请求新证书来自动替换 kubelet 客户端证书。
<!-- * `--cert-dir`the directory where the TLS certs are located. -->
* `--cert-dir` TLS 证书所在的目录。

<!-- ### Use kubeadm with CRI runtimes -->
### 结合 CRI 运行时使用 kubeadm

<!-- Since v1.6.0, Kubernetes has enabled the use of CRI, Container Runtime Interface, by default.
The container runtime used by default is Docker, which is enabled through the built-in
`dockershim` CRI implementation inside of the `kubelet`. -->
从v1.6.0版本开始, Kubernetes 默认启用了 CRI, 容器运行时接口。
默认使用的容器运行时是 Docker, 这通过 `kubelet` 内置的 `dockershim` CRI 实现支持。

<!-- Other CRI-based runtimes include: -->
其它的基于 CRI 的运行时包括:

- [cri-containerd](https://github.com/containerd/cri-containerd)
- [cri-o](https://github.com/kubernetes-incubator/cri-o)
- [frakti](https://github.com/kubernetes/frakti)
- [rkt](https://github.com/kubernetes-incubator/rktlet)

<!-- Refer to the [CRI installation instructions](/docs/setup/cri) for more information. -->
查阅 [CRI 安装指南](/docs/setup/cri) 获取更多信息。

<!-- After you have successfully installed `kubeadm` and `kubelet`, execute
these two additional steps: -->
在你成功安装了 `kubeadm` 和 `kubelet` 工具后, 执行这两个额外的步骤：

<!-- 1. Install the runtime shim on every node, following the installation
   document in the runtime shim project listing above. -->
1. 遵照以上列出的 runtime shim 项目中的安装文档，在每一个节点上安装 runtime shim。

<!-- 2. Configure kubelet to use the remote CRI runtime. Please remember to change
   `RUNTIME_ENDPOINT` to your own value like `/var/run/{your_runtime}.sock`: -->
2. 配置 kubelet 使用远程 CRI 运行时。对应你自己环境，请记得改变 `RUNTIME_ENDPOINT` 的值，这个值类似 `/var/run/{your_runtime}.sock`:

```shell
cat > /etc/systemd/system/kubelet.service.d/20-cri.conf <<EOF
[Service]
Environment="KUBELET_EXTRA_ARGS=--container-runtime=remote --container-runtime-endpoint=$RUNTIME_ENDPOINT"
EOF
systemctl daemon-reload
```

<!-- Now `kubelet` is ready to use the specified CRI runtime, and you can continue
with the `kubeadm init` and `kubeadm join` workflow to deploy Kubernetes cluster. -->
现在 `kubelet` 已经准备好使用指定的 CRI 运行时了, 你可以继续使用 `kubeadm init` 和 `kubeadm join` 工作流来部署你的 Kubernetes 集群。

<!-- You may also want to set `--cri-socket` to `kubeadm init` and `kubeadm reset` when
using an external CRI implementation. -->
当使用一个外部的 CRI 实现时， 你也许也想为 `kubeadm init` 和 `kubeadm reset` 设置 `--cri-socket`。

<!-- ### Using internal IPs in your cluster -->
### 在你的集群中使用内网 IP

<!-- In order to set up a cluster where the master and worker nodes communicate with internal IP addresses (instead of public ones), execute following steps. -->
为了配置一个 master 与 worker 节点间使用内网 IP 地址通信的集群（而不是使用公网地址），执行以下操作。

<!-- 1. When running init, you must make sure you specify an internal IP for the API server's bind address, like so: -->
1. 当运行 init 命令的时候, 你必须为 API server 指定一个内网 IP 作为监听地址，像这样：

   `kubeadm init --apiserver-advertise-address=<private-master-ip>`

<!-- 2. When a master or worker node has been provisioned, add a flag to `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` that specifies the private IP of the worker node: -->
2. 当一个 master 或者 worker 节点可供使用时，向 `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` 文件添加一个标记指明 worker 节点的私有 IP。

   `--node-ip=<private-node-ip>`

<!-- 3. Finally, when you run `kubeadm join`, make sure you provide the private IP of the API server addressed as defined in step 1. -->
3. 最后, 当你运行 `kubeadm join` 的时候, 确保你提供了正确的 API server 所在的、步骤 1 中定义的私有 IP。

<!-- ### Setting the node name -->
### 设置节点的名称

<!-- By default, `kubeadm` assigns a node name based on a machine's host address. You can override this setting with the  `--node-name`flag. -->
默认情况下, `kubeadm` 基于机器的 host 地址分配一个节点名称。你可以使用 `--node-name` 参数覆盖这个设置。
<!-- The flag passes the appropriate [`--hostname-override`](https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/#options) to the kubelet. -->
这个参数会向 kubelet 传递相应的 [`--hostname-override`](https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/#options) 参数。

<!-- Be aware that overriding the hostname can [interfere with cloud providers](https://github.com/kubernetes/website/pull/8873). -->
注意覆盖主机名称可能会 [干扰到云服务提供商](https://github.com/kubernetes/website/pull/8873)。

<!-- ### Self-hosting the Kubernetes control plane {#self-hosting} -->
### Self-hosting Kubernetes control plane {#self-hosting}

<!-- As of 1.8, you can experimentally create a _self-hosted_ Kubernetes control plane. This means that key components such as the API server, controller manager, and scheduler run as [DaemonSet pods](/docs/concepts/workloads/controllers/daemonset/) configured via the Kubernetes API instead of [static pods](/docs/tasks/administer-cluster/static-pod/) configured in the kubelet via static files. -->
从1.8开始, 你可以试验性地创建一个 _self-hosted_ Kubernetes control plane. 这意味着诸如 API server、controller manager、 以及 scheduler 这些关键组件将作为通过 Kubernetes API 配置的 [DaemonSet pods](/docs/concepts/workloads/controllers/daemonset/) 运行，而不是在 kubelet 中通过静态文件配置的 [static pods](/docs/tasks/administer-cluster/static-pod/)。

<!-- To create a self-hosted cluster, pass the flag `--feature-gates=SelfHosting=true` to `kubeadm init`. -->
若要创建一个 self-hosted 的集群, 向 `kubeadm init` 命令传递 `--feature-gates=SelfHosting=true` 参数。

{{< caution >}}
<!-- **Caution:** `SelfHosting` is an alpha feature. It is deprecated in 1.12
and will be removed in 1.13. -->
**小心:** `SelfHosting` 还是一个 alpha 功能。它在 1.12 版本中被标记为废弃，并且将在 1.13 版本中移除。
{{< /caution >}}

{{< warning >}}
<!-- **Warning:** See self-hosted caveats and limitations. -->
**警告:** 查看有关 self-hosted 的注意事项和限制。
{{< /warning >}}

<!-- #### Caveats -->
#### 注意事项

<!-- Self-hosting in 1.8 has some important limitations. In particular, a
self-hosted cluster _cannot recover from a reboot of the master node_
without manual intervention. This and other limitations are expected to be
resolved before self-hosting graduates from alpha. -->
1.8 版本中的 Self-hosting 功能有一些重要的限制。特别的, 一个 self-hosted 的集群如果不手动介入的话 _不能够从 master node 的重新启动中恢复_ 。 这个以及其它的一些限制被期望在 self-hosting 功能从 alpha 状态毕业前解决。

<!-- By default, self-hosted control plane Pods rely on credentials loaded from [`hostPath`](https://kubernetes.io/docs/concepts/storage/volumes/#hostpath) volumes. Except for initial creation, these credentials are not managed by kubeadm. You can use `--feature-gates=StoreCertsInSecrets=true` to enable an experimental mode where control plane credentials are loaded from Secrets instead. This requires very careful control over the authentication and authorization configuration for your cluster, and may not be appropriate for your environment. -->
默认情况下, self-hosted control plane Pods 依赖位于 [`hostPath`](https://kubernetes.io/docs/concepts/storage/volumes/#hostpath) 数据卷中的证书。除了初始化创建证书的过程, 这些证书不被 kubeadm 管理。你可以使用 `--feature-gates=StoreCertsInSecrets=true` 参数来启用一个试验性的模式，在这个模式中 control plane 证书从 Secrets 加载。 这要求对你的集群进行非常小心的对鉴权和授权配置的控制, 并且可能并不适合你的环境。

{{< caution >}}
<!-- **Caution:** `StoreCertsInSecrets` is an alpha feature. It is deprecated in 1.12
and will be removed in 1.13. -->
**小心:** `StoreCertsInSecrets` 是一个 alpha 功能。 它在 1.12 版本中被标记为废弃，并且将在 1.13 版本中移除。
{{< /caution >}}

<!-- In kubeadm 1.8, the self-hosted portion of the control plane does not include etcd,
which still runs as a static Pod. -->
在 kubeadm 1.8 版本中, control plane 的 self-hosted 的组件并不包含 etcd，它仍然是作为静态 Pod 运行的。

#### 流程

<!-- The self-hosting bootstrap process is documented in the [kubeadm design document](https://github.com/kubernetes/kubeadm/blob/master/docs/design/design_v1.9.md#optional-self-hosting). -->
self-hosting 集群的启动过程写在了这份 [kubeadm 设计文档](https://github.com/kubernetes/kubeadm/blob/master/docs/design/design_v1.9.md#optional-self-hosting) 文档中。

<!-- In summary, `kubeadm init --feature-gates=SelfHosting=true` works as follows: -->
总的说来, `kubeadm init --feature-gates=SelfHosting=true` 是按照以下步骤工作的:

  <!-- 1. Waits for this bootstrap static control plane to be running and
    healthy. This is identical to the `kubeadm init` process without self-hosting. -->
  1. 等待 control plane 的相关组件成功运行起来。这与没有启用 self-hosting 的 `kubeadm init` 指令的流程是一致的。

  <!-- 2. Uses the static control plane Pod manifests to construct a set of
    DaemonSet manifests that will run the self-hosted control plane.
    It also modifies these manifests where necessary, for example adding new volumes
    for secrets. -->
  2. 使用静态的 control plane Pod 清单文件构建一个 DaemonSet 清单文件用来运行 self-hosted control plane。有时也会在必要的时候修改这些清单文件，比如为 secrets 添加新的数据卷。

  <!-- 3. Creates DaemonSets in the `kube-system` namespace and waits for the
     resulting Pods to be running. -->
  3. 在 `kube-system` 命名空间下创建 DaemonSets 并且等待相应的 Pods 运行起来。

  <!-- 4. Once self-hosted Pods are operational, their associated static Pods are deleted
     and kubeadm moves on to install the next component. This triggers kubelet to
     stop those static Pods. -->
  4. 一旦 self-hosted Pods 可供使用了, 它们相关的静态 Pods 就会被删除并且 kubeadm 继续安装下一个组件。这将触发 kubelet 停止这些静态 Pods。

  <!-- 5. When the original static control plane stops, the new self-hosted control
    plane is able to bind to listening ports and become active. -->
  5. 当原始的 static control plane 停止的时候, 新创建的 self-hosted control
    plane 就能够绑定到端口并且可供使用。

<!-- This process (steps 3-6) can also be triggered with `kubeadm phase selfhosting convert-from-staticpods`. -->
这个过程 （3-6步） 也可以通过 `kubeadm phase selfhosting convert-from-staticpods` 指令触发。

<!-- ### Running kubeadm without an internet connection -->
### 在没有互联网连接的情况下运行 kubeadm

<!-- For running kubeadm without an internet connection you have to pre-pull the required master images for the version of choice: -->
如果要在没有网络的情况下运行 kubeadm，你需要预先拉取所选版本的主要镜像:

| Image Name                                 | v1.10 release branch version |
|--------------------------------------------|------------------------------|
| k8s.gcr.io/kube-apiserver-${ARCH}          | v1.10.x                      |
| k8s.gcr.io/kube-controller-manager-${ARCH} | v1.10.x                      |
| k8s.gcr.io/kube-scheduler-${ARCH}          | v1.10.x                      |
| k8s.gcr.io/kube-proxy-${ARCH}              | v1.10.x                      |
| k8s.gcr.io/etcd-${ARCH}                    | 3.1.12                       |
| k8s.gcr.io/pause-${ARCH}                   | 3.1                          |
| k8s.gcr.io/k8s-dns-sidecar-${ARCH}         | 1.14.8                       |
| k8s.gcr.io/k8s-dns-kube-dns-${ARCH}        | 1.14.8                       |
| k8s.gcr.io/k8s-dns-dnsmasq-nanny-${ARCH}   | 1.14.8                       |
| coredns/coredns                            | 1.0.6                        |

<!-- Here `v1.10.x` means the "latest patch release of the v1.10 branch". -->
此处 `v1.10.x` 意为 "v1.10 分支上的最新的 patch release"。

<!-- `${ARCH}` can be one of: `amd64`, `arm`, `arm64`, `ppc64le` or `s390x`. -->
`${ARCH}` 可以是以下的值: `amd64`, `arm`, `arm64`, `ppc64le` 或者 `s390x`。

<!-- If you run Kubernetes version 1.10 or earlier, and if you set `--feature-gates=CoreDNS=true`,
you must also use the `coredns/coredns` image, instead of the three `k8s-dns-*` images. -->
如果你运行1.10或者更早版本的 Kubernetes，并且你设置了 `--feature-gates=CoreDNS=true`，
你必须也使用 `coredns/coredns` 镜像, 而不是使用三个 `k8s-dns-*` 镜像。

<!-- In Kubernetes 1.11 and later, you can list and pull the images using the `kubeadm config images` sub-command: -->
在 Kubernetes 1.11版本以及之后的版本中，你可以使用 `kubeadm config images` 的子命令来列出和拉取相关镜像:
```
kubeadm config images list
kubeadm config images pull
```

<!-- Starting with Kubernetes 1.12, the `k8s.gcr.io/kube-*`, `k8s.gcr.io/etcd` and `k8s.gcr.io/pause` images don't require an `-${ARCH}` suffix. -->
从 Kubernetes 1.12 版本开始, `k8s.gcr.io/kube-*`、 `k8s.gcr.io/etcd` 和 `k8s.gcr.io/pause` 镜像不再要求 `-${ARCH}` 后缀。

<!-- ### Automating kubeadm -->
### kubeadm 自动化

<!-- Rather than copying the token you obtained from `kubeadm init` to each node, as in the [basic kubeadm tutorial](/docs/setup/independent/create-cluster-kubeadm/), you can parallelize the token distribution for easier automation. To implement this automation, you must know the IP address that the master will have after it is started. -->
与其如文档 [kubeadm 基础教程](/docs/setup/independent/create-cluster-kubeadm/) 所述，将从 `kubeadm init` 取得的令牌拷贝到每一个节点, 倒不如你可以使用更加简单的自动化的方式将令牌并行地分发出去。如果要实现这个自动化，你必须要知道 master node 启动后的 IP 地址。

<!-- 1.  Generate a token. This token must have the form  `<6 character string>.<16
    character string>`.  More formally, it must match the regex:
    `[a-z0-9]{6}\.[a-z0-9]{16}`.

    kubeadm can generate a token for you: -->
1.  生成一个令牌. 这个令牌必须具有以下格式：`<6个字符的字符串>.<16字符的字符串>`。更加正式地说法是，它必须符合以下正则表达式：
    `[a-z0-9]{6}\.[a-z0-9]{16}`。

    kubeadm 可以为你生成一个令牌:

    ```bash
    kubeadm token generate
    ```

<!-- 2. Start both the master node and the worker nodes concurrently with this token.
   As they come up they should find each other and form the cluster.  The same
   `--token` argument can be used on both `kubeadm init` and `kubeadm join`. -->
2. 使用这个令牌同时启动 master node 和 worker nodes。它们一旦运行起来应该就会互相寻找对方并且建立集群。同样的 `--token` 参数可以同时用于 `kubeadm init` 和 `kubeadm join` 命令。

<!-- Once the cluster is up, you can grab the admin credentials from the master node
at `/etc/kubernetes/admin.conf` and use that to talk to the cluster. -->
一旦集群启动起来，你就可以从 master node 的 `/etc/kubernetes/admin.conf` 文件获取管理凭证，然后你就可以使用这个凭证同集群通信了。

<!-- Note that this style of bootstrap has some relaxed security guarantees because
it does not allow the root CA hash to be validated with
`--discovery-token-ca-cert-hash` (since it's not generated when the nodes are
provisioned). For details, see the [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/). -->
注意这种搭建集群的方式在安全保证上会有一些宽松，因为这种方式不允许使用 `--discovery-token-ca-cert-hash` 来验证根 CA 的哈希值（因为当配置节点的时候，它还没有被生成）。如需更多信息，请参阅 [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) 文档。

{{% /capture %}}

{{% capture whatsnext %}}
<!-- * [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to bootstrap a Kubernetes worker node and join it to the cluster
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/) to upgrade a Kubernetes cluster to a newer version
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) to revert any changes made to this host by `kubeadm init` or `kubeadm join` -->
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) 启动一个 Kubernetes worker node 并且将其加入到集群
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/) 将 Kubernetes 集群升级到新版本
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) 使用 `kubeadm init` 或者 `kubeadm join`来恢复对节点的改变
{{% /capture %}}
