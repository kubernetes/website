---
cn-approvers:
- tianshapjq
approvers:
- mikedanese
- luxas
- jbeda
title: kubeadm init
---
<!--
---
approvers:
- mikedanese
- luxas
- jbeda
title: kubeadm init
---
-->
{% capture overview %}
{% endcapture %}

{% capture body %}
{% include_relative generated/kubeadm_init.md %}

<!--
### Init workflow {#init-workflow}
`kubeadm init` bootstraps a Kubernetes master node by executing the
following steps:
-->
### 初始化工作流 {#init-workflow}
`kubeadm init` 通过执行以下步骤引导一个 Kubernetes master 节点：

<!--
1. Runs a series of pre-flight checks to validate the system state
   before making changes. Some checks only trigger warnings, others are
   considered errors and will exit kubeadm until the problem is corrected or the
   user specifies `--skip-preflight-checks`.
-->
1. 在进行更改之前，运行一系列检查以验证系统状态。一些检查只会触发警告，有些检查会被视为错误并会退出 kubeadm，直到问题得到解决或用户指定了 `--skip-preflight-checks`。

<!--
1. Generates a self-signed CA (or using an existing one if provided) to set up
   identities for each component in the cluster. If the user has provided their
   own CA cert and/or key by dropping it in the cert directory configured via `--cert-dir`
   (`/etc/kubernetes/pki` by default) this step is skipped as described in the
   [Using custom certificates](#custom-certificates) document.
-->
1. 生成自签名的 CA，（或使用现有的 CA，如果用户提供）为集群中的每个组件设置身份。如 [使用自定义证书](#custom-certificates) 中所述，如果用户在通过 `--cert-dir` 配置的目录中（默认为 `/etc/kubernetes/pki`）提供了自己的 CA 证书和（或）密钥，则跳过此步骤。

<!--
1. Writes kubeconfig files in `/etc/kubernetes/`  for
   the kubelet, the controller-manager and the scheduler to use to connect to the
   API server, each with its own identity, as well as an additional
   kubeconfig file for administration named `admin.conf`.
-->
1. 在 `/etc/kubernetes/` 中为 kubelet、controller-manager 和 scheduler 编写配置文件，让它们能够连接 API server，每个文件都需要有自己的标识。同时还需要为管理用途编写名称为 `admin.conf` 的文件。

<!--
1. If kubeadm is invoked with `--feature-gates=DynamicKubeletConfig` enabled,
   it writes the kubelet init configuration into the `/var/lib/kubelet/config/init/kubelet` file. 
   See [Set Kubelet parameters via a config file](/docs/tasks/administer-cluster/kubelet-config-file.md) 
   and [Reconfigure a Node's Kubelet in a Live Cluster](/docs/tasks/administer-cluster/reconfigure-kubelet.md) 
   for more information about Dynamic Kubelet Configuration.
   This functionality is now by default disabled as it is behind a feature gate, but is expected to be a default in future versions.
-->
1. 如果 kubeadm 的 `--feature-gates=DynamicKubeletConfig` 参数被启用，它将会把 kubelet 的初始配置信息写入 `/var/lib/kubelet/config/init/kubelet` 文件中。参阅 [通过配置文件设置 kubelet 参数](/docs/tasks/administer-cluster/kubelet-config-file.md) 和 [在存活集群中重新配置节点  kubelet](/docs/tasks/administer-cluster/reconfigure-kubelet.md) 获取更多关于 Kubelet 动态配置的信息。此功能现在默认处于禁用状态，因为它受 feature gate 控制，但预计在未来的版本中将成为默认功能。

<!--
1. Generates static Pod manifests for the API server,
   controller manager and scheduler. In case an external etcd is not provided,
   an additional static Pod manifest are generated for etcd.

   Static Pod manifests are written to `/etc/kubernetes/manifests`; the kubelet
   watches this directory for Pods to create on startup.

   Once control plane Pods are up and running, the `kubeadm init` sequence can continue.
-->
1. 为 API server、controller manager 和 scheduler 生成静态 Pod 的 manifest 文件。如果没有提供外部 etcd，也会为 etcd 生成一个额外的静态 Pod manifest 文件。

   静态 Pod 的 manifest 文件将会写入 `/etc/kubernetes/manifests`；kubelet 监控这个目录以在启动时判断是否生成 Pod。

   一旦控制平面 Pod 启动并运行，`kubeadm init` 将会继续进行。

<!--
1. If kubeadm is invoked with `--feature-gates=DynamicKubeletConfig` enabled,
   it completes the kubelet dynamic configuration by creating a ConfigMap and some RBAC rules that enable
   kubelets to access to it, and updates the node by pointing `Node.spec.configSource` to the 
   newly-created ConfigMap. 
   This functionality is now by default disabled as it is behind a feature gate, but is expected to be a default in future versions.
-->
1. 如果 kubeadm 的 `--feature-gates=DynamicKubeletConfig` 参数被启用，它将通过创建一个 ConfigMap 和一些 RBAC 规则来完成 kubelet 动态配置，这些规则让 kubelet 能够访问配置文件，并且更新节点以让 `Node.spec.configSource` 指向新创建的 ConfigMap。
   此功能现在默认处于禁用状态，因为它受 feature gate 控制，但预计在未来的版本中将成为默认功能。

<!--
1. Apply labels and taints to the master node so that no additional workloads will 
   run there.
-->
1. 将标签和 taint 应用到 master 节点，这样就不会有额外的工作负载运行在该节点上。

<!--
1. Generates the token that additional nodes can use to register
   themselves with the master in the future.  Optionally, the user can provide a
   token via `--token`, as described in the
   [kubeadm token](kubeadm-token.md) docs.
-->
1. 生成 token 以让额外的 node 能够将它们自己注册到这个 master。可选地，用户可以通过 `--token` 来提供一个 token，如 [kubeadm token](kubeadm-token.md) 文档所述。

<!--
1. Makes all the necessary configurations for allowing node joining with the
   [Bootstrap Tokens](/docs/admin/bootstrap-tokens/) and
   [TLS Bootstrap](/docs/admin/kubelet-tls-bootstrapping/)
   mechanism:

   - Write a ConfigMap for making available all the information required
     for joining, and set up related RBAC access rules.

   - Let Bootstrap Tokens access the CSR signing API.

   - Configure auto-approval for new CSR requests.

   See [kubeadm join](kubeadm-join.md) for additional info.
-->
1. 创建所有必需的配置以让 node 能够通过 [Bootstrap Tokens](/docs/admin/bootstrap-tokens/) 和 [TLS Bootstrap](/docs/admin/kubelet-tls-bootstrapping/) 机制来加入集群：

   - 编写一个 ConfigMap 来提供加入集群所需要的所有信息，并设置相关的 RBAC 访问规则。

   - 让 Bootstrap Token 能够访问 CSR 鉴权 API。

   - 为所有新的 CSR 请求配置 auto-approval。

   参阅 [kubeadm join](kubeadm-join.md) 获取更多信息。

<!--
1. Installs the internal DNS server and the kube-proxy addon components via the API server.  
   Please note that although the DNS server is deployed, it will not be scheduled until CNI is installed.
-->
1. 安装内部的 DNS 服务，并且通过 API server 安装 kube-proxy 插件组件。
   请注意，就算部署了 DNS 服务，但是在安装 CNI 之前它也不会被调度到 node 上。

<!--
1. If `kubeadm init` is invoked with the alpha self-hosting feature enabled,
   (`--feature-gates=SelfHosting=true`), the static Pod based control plane is
   transformed into a [self-hosted control plane](#self-hosting).
-->
1. 如果在调用 `kubeadm init` 时启用 alpha 特性 self-hosting(`--feature-gates=SelfHosting=true`) ，那么基于静态 Pod 的控制平面将会转变为 [自托管控制平面(self-hosted control plane)](#self-hosting)。

<!--
### Using kubeadm init with a configuration file {#config-file}
-->
### 通过配置文件使用 kubeadm init {#config-file}

<!--
**Caution:** The config file is
still considered alpha and may change in future versions.
-->
**警告:** 通过配置文件的方式仍然处于 alpha 阶段，未来的版本可能会发生改变。
{: .caution}

<!--
It's possible to configure `kubeadm init` with a configuration file instead of command
line flags, and some more advanced features may only be available as
configuration file options.  This file is passed in the `--config` option.
-->
可以使用配置文件而不是命令行参数来配置 `kubeadm init`，并且一些更高级的功能可能只作为配置文件的选项。通过 `--config` 选项来指定配置文件。

```yaml
apiVersion: kubeadm.k8s.io/v1alpha1
kind: MasterConfiguration
api:
  advertiseAddress: <address|string>
  bindPort: <int>
etcd:
  endpoints:
  - <endpoint1|string>
  - <endpoint2|string>
  caFile: <path|string>
  certFile: <path|string>
  keyFile: <path|string>
  dataDir: <path|string>
  extraArgs:
    <argument>: <value|string>
    <argument>: <value|string>
  image: <string>
networking:
  dnsDomain: <string>
  serviceSubnet: <cidr>
  podSubnet: <cidr>
kubernetesVersion: <string>
cloudProvider: <string>
nodeName: <string>
authorizationModes:
- <authorizationMode1|string>
- <authorizationMode2|string>
token: <string>
tokenTTL: <time duration>
selfHosted: <bool>
apiServerExtraArgs:
  <argument>: <value|string>
  <argument>: <value|string>
controllerManagerExtraArgs:
  <argument>: <value|string>
  <argument>: <value|string>
schedulerExtraArgs:
  <argument>: <value|string>
  <argument>: <value|string>
apiServerExtraVolumes:
- name: <value|string>
  hostPath: <value|string>
  mountPath: <value|string>
controllerManagerExtraVolumes:
- name: <value|string>
  hostPath: <value|string>
  mountPath: <value|string>
schedulerExtraVolumes:
- name: <value|string>
  hostPath: <value|string>
  mountPath: <value|string>
apiServerCertSANs:
- <name1|string>
- <name2|string>
certificatesDir: <string>
imageRepository: <string>
unifiedControlPlaneImage: <string>
featureGates:
  <feature>: <bool>
  <feature>: <bool>
```

<!--
### Passing custom arguments to control plane components {#custom-args}
-->
### 传递自定义参数到控制平面组件 {#custom-args}

<!--
If you would like to override or extend the behaviour of a control plane component, you can provide 
extra arguments to kubeadm. When the component is deployed, these additional arguments are added to 
the Pod command itself.
-->
如果您想要覆盖或扩展控制平面组件的行为，可以设置附加的参数到 kubeadm。部署组件时，这些附加参数会被添加到 Pod 自身的命令中。

<!--
For example, to add additional feature-gate arguments to the API server, your [configuration file](#config-file) 
will need to look like this:
-->
例如，要向 API server 添加 feature-gate 参数，您需要以下面的方式编写您的 [配置文件](#config-file)：

```
apiVersion: kubeadm.k8s.io/v1alpha1
kind: MasterConfiguration
apiServerExtraArgs:
  feature-gates: APIResponseCompression=true
```

<!--
To customize the scheduler or controller-manager, use `schedulerExtraArgs` and `controllerManagerExtraArgs` respectively.
-->
如果想要定制 scheduler 或者 controller-manager，请分别使用`schedulerExtraArgs` 和 `controllerManagerExtraArgs`。

<!--
More information on custom arguments can be found here:
-->
更多关于定制参数的信息可以在以下查询：
- [kube-apiserver](/docs/admin/kube-apiserver/)
- [kube-controller-manager](/docs/admin/kube-controller-manager/)
- [kube-scheduler](/docs/admin/kube-scheduler/)

<!--
### Using custom images {#custom-images}
-->
### 使用自定义镜像 {#custom-images}

<!--
By default, kubeadm pulls images from `k8s.gcr.io`, unless
the requested Kubernetes version is a CI version. In this case,
`gcr.io/kubernetes-ci-images` is used.
-->
默认情况下，kubeadm 从 `k8s.gcr.io` 拉取镜像，除非请求的 Kubernetes 是一个 CI 版本，在这种情况下将会使用 `gcr.io/kubernetes-ci-images`。

<!--
You can override this behavior by using [kubeadm with a configuration file](#config-file).
Allowed customization are:
-->
您能 [通过配置文件使用 kubeadm init](#config-file) 来覆盖这个行为。允许的自定义项包括：

<!--
* To provide an alternative `imageRepository` to be used instead of
  `k8s.gcr.io`.
* To provide a `unifiedControlPlaneImage` to be used instead of different images for control plane components.
* To provide a specific `etcd.image` to be used instead of the image available at`k8s.gcr.io`.
-->
* 提供 `imageRepository` 来替换 `k8s.gcr.io` 地址。
* 提供 `unifiedControlPlaneImage` 来替换控制平面组件的镜像。
* 提供指定的 `etcd.image` 来替代 `k8s.gcr.io` 的可用镜像。

<!--
### Using custom certificates {#custom-certificates}
-->
### 使用自定义证书 {#custom-certificates}

<!--
By default, kubeadm generates all the certificates needed for a cluster to run.
You can override this behavior by providing your own certificates.
-->
默认情况下，kubeadm 会生成集群运行所需的所有证书。您可以通过提供自己的证书来覆盖此行为。

<!--
To do so, you must place them in whatever directory is specified by the
`--cert-dir` flag or `CertificatesDir` configuration file key. By default this
is `/etc/kubernetes/pki`.
-->
要做到这一点，您必须把它们放在 `--cert-dir` 参数或者配置文件中的 `CertificatesDir` 指定的目录。默认目录为 `/etc/kubernetes/pki`。

<!--
If a given certificate and private key pair exists, kubeadm skips the
generation step and existing files are used for the prescribed
use case. This means you can, for example, copy an existing CA into `/etc/kubernetes/pki/ca.crt`
and `/etc/kubernetes/pki/ca.key`, and kubeadm will use this CA for signing the rest 
of the certs.
-->
如果存在一个给定的证书和密钥对，kubeadm 将会跳过生成步骤并且使用已存在的文件。例如，您可以拷贝一个已有的 CA 到 `/etc/kubernetes/pki/ca.crt` 和 `/etc/kubernetes/pki/ca.key`，kubeadm 将会使用这个 CA 来签署其余的证书。

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
也可以只提供 `ca.crt` 文件，而不是 `ca.key` 文件（这只适用于根 CA 文件，不适用于其他的证书对）。
如果所有其他证书和 kubeconfig 文件都在，kubeadm 将会识别这种情况并激活 "外部 CA" 模式。kubeadm 将会在缺失 CA key 的情况下继续执行。

<!--
Instead, run the controller-manager standalone with `--controllers=csrsigner` and
point to the CA certificate and key.
-->
或者，给 controller-manager 设置 `--controllers=csrsigner` 并指定 CA 证书和密钥来运行 controller-manager。

<!--
### Managing the kubeadm drop-in file for the kubelet {#kubelet-drop-in}
-->
### 管理 kubeadm 中用于配置 kubelet 的插入文件（drop-in file）

<!--
The kubeadm package ships with configuration for how the kubelet should
be run. Note that the `kubeadm` CLI command never touches this drop-in file.
This drop-in file belongs to the kubeadm deb/rpm package.

This is what it looks like:
-->
kubeadm 包中包含用于配置 kubelet 如何运行的配置文件。需要注意的是，`kubeadm` CLI 命令永远不会涉及到这个插入文件（drop-in file）。这个插入文件属于 kubeadm deb/rpm 包。

以下是该文件可能的内容：


```
[Service]
Environment="KUBELET_KUBECONFIG_ARGS=--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf"
Environment="KUBELET_SYSTEM_PODS_ARGS=--pod-manifest-path=/etc/kubernetes/manifests --allow-privileged=true"
Environment="KUBELET_NETWORK_ARGS=--network-plugin=cni --cni-conf-dir=/etc/cni/net.d --cni-bin-dir=/opt/cni/bin"
Environment="KUBELET_DNS_ARGS=--cluster-dns=10.96.0.10 --cluster-domain=cluster.local"
Environment="KUBELET_AUTHZ_ARGS=--authorization-mode=Webhook --client-ca-file=/etc/kubernetes/pki/ca.crt"
Environment="KUBELET_CADVISOR_ARGS=--cadvisor-port=0"
Environment="KUBELET_CERTIFICATE_ARGS=--rotate-certificates=true --cert-dir=/var/lib/kubelet/pki"
ExecStart=
ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_SYSTEM_PODS_ARGS $KUBELET_NETWORK_ARGS $KUBELET_DNS_ARGS $KUBELET_AUTHZ_ARGS $KUBELET_CADVISOR_ARGS $KUBELET_CERTIFICATE_ARGS $KUBELET_EXTRA_ARGS
```

<!--
Here's a breakdown of what/why:
-->
以下是对上述参数的分解：

<!--
* `--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf` path to a kubeconfig 
   file that is used to get client certificates for kubelet during node join. 
   On success, a kubeconfig file is written to the path specified by `--kubeconfig`. 
-->
* `--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf` 用于指定 kubeconfig 文件的路径，该文件用于在 node 加入集群时获取 kubelet 的客户端证书。如果成功执行，那么将会在 `--kubeconfig` 指定的位置写入一个 kubeconfig 文件。
<!--
* `--kubeconfig=/etc/kubernetes/kubelet.conf` points to the kubeconfig file that
   tells the kubelet where the API server is. This file also has the kubelet's
   credentials.
-->
* `--kubeconfig=/etc/kubernetes/kubelet.conf` 指向 kubeconfig 文件，以告诉 kubelet API server 的地址。这个文件也包含了 kubelet 的证书。
<!--
* `--pod-manifest-path=/etc/kubernetes/manifests` specifies from where to read
   static Pod manifests used for starting the control plane the control plane.
-->
* `--pod-manifest-path=/etc/kubernetes/manifests` 指定从哪里读取静态 Pod 的 manifest 文件，这些静态 Pod 是用来启动控制平面的。
<!--
* `--allow-privileged=true` allows this kubelet to run privileged Pods.
-->
* `--allow-privileged=true` 允许 kubelet 运行特权 Pod（privileged Pods）。
<!--
* `--network-plugin=cni` uses CNI networking.
-->
* `--network-plugin=cni` 使用 CNI 网络。
<!--
* `--cni-conf-dir=/etc/cni/net.d` specifies where to look for the
   [CNI spec file(s)](https://github.com/containernetworking/cni/blob/master/SPEC.md).
-->
* `--cni-conf-dir=/etc/cni/net.d` 指定在哪里查找 [CNI spec 文件](https://github.com/containernetworking/cni/blob/master/SPEC.md).
<!--
* `--cni-bin-dir=/opt/cni/bin` specifies where to look for the actual CNI binaries.
-->
* `--cni-bin-dir=/opt/cni/bin` 指定在哪里查找真正的 CNI 二进制文件。
<!--
* `--cluster-dns=10.96.0.10` use this cluster-internal DNS server for `nameserver`
   entries in Pods' `/etc/resolv.conf`.
-->
* `--cluster-dns=10.96.0.10` 在 Pod 的 `/etc/resolv.conf` 中使用这个集群内部的 DNS 服务来作为 `nameserver` 入口。
<!--
* `--cluster-domain=cluster.local` uses this cluster-internal DNS domain for
   `search` entries in Pods' `/etc/resolv.conf`.
-->
* `--cluster-domain=cluster.local` 在 Pod 的 `/etc/resolv.conf` 中使用这个集群内部的 DNS 域来作为 `search` 入口。
<!--
* `--client-ca-file=/etc/kubernetes/pki/ca.crt` authenticates requests to the Kubelet
   API using this CA certificate.
-->
* `--client-ca-file=/etc/kubernetes/pki/ca.crt` 使用此 CA 证书来验证对 Kubelet API 的请求。
<!--
* `--authorization-mode=Webhook` authorizes requests to the Kubelet API by `POST`-ing
   a `SubjectAccessReview` to the API server.
-->
* `--authorization-mode=Webhook` 验证对 Kubelet API 的请求，该请求通过向 API server `POST` 一个 `SubjectAccessReview` 来实现对 Kubelet API 的请求。
<!--
* `--cadvisor-port=0` disables cAdvisor from listening to `0.0.0.0:4194` by default.
   cAdvisor will still be run inside of the kubelet and its API can be accessed at
   `https://{node-ip}:10250/stats/`. If you want to enable cAdvisor to listen on a
   wide-open port, run:
-->
* `--cadvisor-port=0` 将禁用 cAdvisor 监听 `0.0.0.0:4194` 的默认行为。cAdvisor 将继续运行在 kubelet 内部并且能够通过 `https://{node-ip}:10250/stats/` 访问它的 API。如果您想要 cAdvisor 监听更多的端口，请运行：

   ```bash
   sed -e "/cadvisor-port=0/d" -i /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
   systemctl daemon-reload
   systemctl restart kubelet
   ```
<!--
* `--rotate-certificates` auto rotate the kubelet client certificates by requesting new 
   certificates from the `kube-apiserver` when the certificate expiration approaches.
-->
* `--rotate-certificates` 当证书到期时，将会通过 `kube-apiserver` 来请求新证书，并自动更新 kubelet 客户端证书。
<!--
* `--cert-dir`the directory where the TLS certs are located.
-->
* `--cert-dir` TLS 证书的所在目录。

<!--
### Use kubeadm with other CRI runtimes
-->
### 在其它 CRI 运行时（runtime）上使用 kubeadm

<!--
Since v1.6.0, Kubernetes has enabled the use of CRI, Container Runtime Interface, by default.
The container runtime used by default is Docker, which is enabled through the built-in
`dockershim` CRI implementation inside of the `kubelet`.
-->
从v1.6.0开始，Kubernetes 默认启用了 CRI（Container Runtime Interface）。
默认情况下使用的容器运行时是 Docker，通过启用 `kubelet` 里内置的 CRI 实现机制 `dockershim` 来实现。

<!--
Other CRI-based runtimes include:
-->
其它基于 CRI 的运行时包括：

- [cri-o](https://github.com/kubernetes-incubator/cri-o)
- [frakti](https://github.com/kubernetes/frakti)
- [rkt](https://github.com/kubernetes-incubator/rktlet)

<!--
After you have successfully installed `kubeadm` and `kubelet`, execute
these two additional steps:
-->
当您成功安装 `kubeadm` 和 `kubelet` 后，执行下面两个额外的步骤：

<!--
1. Install the runtime shim on every node, following the installation
   document in the runtime shim project listing above.
-->
1. 遵循上述运行时 shim （runtime shim）的安装文档，在每个 node 上安装运行时 shim （runtime shim）。

<!--
1. Configure kubelet to use the remote CRI runtime. Please remember to change
   `RUNTIME_ENDPOINT` to your own value like `/var/run/{your_runtime}.sock`:
-->
1. 配置 kubelet 以使用远端 CRI 运行时。请修改 `RUNTIME_ENDPOINT` 为您自己的值，如 `/var/run/{your_runtime}.sock`:

```shell
cat > /etc/systemd/system/kubelet.service.d/20-cri.conf <<EOF
Environment="KUBELET_EXTRA_ARGS=--container-runtime=remote --container-runtime-endpoint=$RUNTIME_ENDPOINT"
EOF
systemctl daemon-reload
```

<!--
Now `kubelet` is ready to use the specified CRI runtime, and you can continue
with the `kubeadm init` and `kubeadm join` workflow to deploy Kubernetes cluster.

You may also want to set `--cri-socket` to `kubeadm init` and `kubeadm reset` when
using an external CRI implementation.
-->
现在 `kubelet` 已经能够使用指定的 CRI 运行时，您可以接着使用 `kubeadm init` 和 `kubeadm join` 来部署 Kubernetes 集群。

当使用外部的 CRI 实现机制时，您可能还需要设置 `kubeadm init` 和 `kubeadm reset` 中的 `--cri-socket`。

<!--
### Using internal IPs in your cluster
-->
### 在您的集群中使用内部 IP

<!--
In order to set up a cluster where the master and worker nodes communicate with internal IP addresses (instead of public ones), execute following steps.

1. When running init, you must make sure you specify an internal IP for the API server's bind address, like so:

   `kubeadm init --apiserver-advertise-address=<private-master-ip>`

2. When a worker node has been provisioned, add a flag to `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` that specifies the private IP of the worker node:

   `--node-ip=<private-node-ip>`

3. Finally, when you run `kubeadm join`, make sure you provide the private IP of the API server addressed as defined in step 1.
-->
如果想要建立一个 master 和 node 通过内部 IP 地址进行通讯的集群（而不是通过公共 IP），需要执行以下步骤。

1. 当运行 init 时，您必须保证指定一个内部 IP 作为 API server 的绑定地址，例如：

   `kubeadm init --apiserver-advertise-address=<private-master-ip>`

2. 当工作 node 配置好后，添加一个指定工作 node 私有 IP 的参数到 `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` 中：

   `--node-ip=<private-node-ip>`

3. 最后，当您运行 `kubeadm join` 时，确保提供在步骤1中定义的 API server 的私有 IP 地址。

<!--
### Self-hosting the Kubernetes control plane {#self-hosting}
-->
### 自托管（Self-hosting） Kubernetes 控制平面 {#self-hosting}

<!--
As of 1.8, you can experimentally create a _self-hosted_ Kubernetes control
plane. This means that key components such as the API server, controller
manager, and scheduler run as [DaemonSet pods](/docs/concepts/workloads/controllers/daemonset/)
configured via the Kubernetes API instead of [static pods](/docs/tasks/administer-cluster/static-pod/)
configured in the kubelet via static files.
-->
从 1.8 版本开始，您可以实验性地创建一个 _自托管（self-hosted）_ Kubernetes 控制平面。这表示关键的组件如 API server、controller manager 和 scheduler 都将以 [DaemonSet pods](/docs/concepts/workloads/controllers/daemonset/) 方式运行，DaemonSet pod 通过 Kubernetes API 配置而不是通过 kubelet 的静态文件配置。

<!--
**Caution:** Self-hosting is alpha, but is expected to become the default in
a future version. To create a self-hosted cluster, pass the `--feature-gates=SelfHosting=true`
flag to `kubeadm init`.
-->
**警告:** 自托管目前仍是 alpha 阶段，但有望在未来的版本中成为默认行为。要创建自托管的集群，请传递 `--feature-gates=SelfHosting=true` 参数到 `kubeadm init`。
{: .caution}

<!--
**Warning:** see self-hosted caveats and limitations. 
-->
**警告:** 请参阅自托管的注意事项和局限性。 
{: .warning}

<!--
#### Caveats
-->
#### 注意事项

<!--
Self-hosting in 1.8 has some important limitations. In particular, a
self-hosted cluster _cannot recover from a reboot of the master node_
without manual intervention. This and other limitations are expected to be
resolved before self-hosting graduates from alpha.
-->
1.8 版本中的自托管有非常重大的局限性。特别是，如果没有人工干预，一个自托管的集群 _无法在 master 节点重启后自动恢复_。这些局限性有望在自托管的 alpha 版本中得到解决。

<!--
By default, self-hosted control plane Pods rely on credentials loaded from
[`hostPath`](https://kubernetes.io/docs/concepts/storage/volumes/#hostpath)
volumes. Except for initial creation, these credentials are not managed by
kubeadm. You can use `--feature-gates=StoreCertsInSecrets=true` to enable an
experimental mode where control plane credentials are loaded from Secrets
instead. This requires very careful control over the authentication and
authorization configuration for your cluster, and may not be appropriate for
your environment.
-->
默认情况下，自托管的控制平面的 Pod 需要依赖于从 [`hostPath`](https://kubernetes.io/docs/concepts/storage/volumes/#hostpath) 卷中载入的证书。除初始创建外，这些凭据不受 kubeadm 管理。您可以使用 `--feature-gates=StoreCertsInSecrets=true` 来从 Secret 中读取控制平面证书，不过这个方式仍然处于实验阶段。这需要您非常小心地控制集群的认证和授权，这很可能并不适合您的环境。

<!--
In kubeadm 1.8, the self-hosted portion of the control plane does not include etcd,
which still runs as a static Pod.
-->
在 kubeadm 1.8 版本中，控制平面中自托管的部分并不包含 etcd，它仍然运行在一个静态 Pod 中。

<!--
#### Process
-->
#### 过程（Process）

<!--
The self-hosting bootstrap process is documented in the [kubeadm design
document](https://github.com/kubernetes/kubeadm/blob/master/docs/design/design_v1.9.md#optional-self-hosting).
-->
在 [kubeadm 设计文档](https://github.com/kubernetes/kubeadm/blob/master/docs/design/design_v1.9.md#optional-self-hosting) 中描述了自托管引导流程。

<!--
In summary, `kubeadm init --feature-gates=SelfHosting=true` works as follows:
-->
总体上，`kubeadm init --feature-gates=SelfHosting=true` 按照如下流程工作：

<!--
  1. Waits for this bootstrap static control plane to be running and
    healthy. This is identical to the `kubeadm init` process without self-hosting.
-->
  1. 等待引导静态控制平面（bootstrap static control plane）运行并且处于健康状态。这对于不是自托管的 `kubeadm init` 流程来说非常重要。

<!--
  1. Uses the static control plane Pod manifests to construct a set of
    DaemonSet manifests that will run the self-hosted control plane.
    It also modifies these manifests where necessary, for example adding new volumes 
    for secrets.
-->
  1. 使用静态控制平面 Pod 的 manifest 文件来构建一个 DaemonSet manifest 集合，该集合将运行自托管的控制平面。`kubeadm init --feature-gates=SelfHosting=true` 在必要时也会修改这些 manifest 文件，例如为 secret 增加新的卷。

<!--
  1. Creates DaemonSets in the `kube-system` namespace and waits for the
     resulting Pods to be running.
-->
  1. 在 `kube-system` 命名空间中创建 DaemonSet 并等待其中的 Pod 成为 running 状态。

<!--
  1. Once self-hosted Pods are operational, it's associated static Pods are deleted 
     and kubeadm moves on to install the next component. This triggers kubelet to 
     stop those static Pods.
-->
  1. 一旦自托管的 Pod 能够被操作了，与其关联的静态 Pod 将会被删除，因为 kubeadm 需要继续安装下一个组件，将会触发 kubelet 停止这些静态 Pod。

<!--
  1. When the original static control plane stops, the new self-hosted control
    plane is able to bind to listening ports and become active.
-->
  1. 当最开始的静态控制平面停止后，新的自托管控制平面就能绑定并且监听端口，从而成为 active 状态。

<!--
This process (steps 3-6) can also be triggered with `kubeadm phase selfhosting convert-from-staticpods`.
-->
其中第 3-6 步的过程也能够通过 `kubeadm phase selfhosting convert-from-staticpods` 来触发。

<!--
### Running kubeadm without an internet connection
-->
### 没有互联网连接的情况下运行 kubeadm

<!--
For running kubeadm without an internet connection you have to pre-pull the required master images for the version of choice:
-->
如果想要在没有互联网连接的情况下运行 kubeadm，您需要根据所需版本提前拉取需要的 master 镜像：

<!--
| Image Name                                               | v1.8 release branch version | v1.9 release branch version |
-->
| 镜像名                                                   | v1.8 发布版本               | v1.9 发布版本               |
|----------------------------------------------------------|-----------------------------|-----------------------------|
| k8s.gcr.io/kube-apiserver-${ARCH}          | v1.8.x                      | v1.9.x                      |
| k8s.gcr.io/kube-controller-manager-${ARCH} | v1.8.x                      | v1.9.x                      |
| k8s.gcr.io/kube-scheduler-${ARCH}          | v1.8.x                      | v1.9.x                      |
| k8s.gcr.io/kube-proxy-${ARCH}              | v1.8.x                      | v1.9.x                      |
| k8s.gcr.io/etcd-${ARCH}                    | 3.0.17                      | 3.1.10                      |
| k8s.gcr.io/pause-${ARCH}                   | 3.0                         | 3.0                         |
| k8s.gcr.io/k8s-dns-sidecar-${ARCH}         | 1.14.5                      | 1.14.7                      |
| k8s.gcr.io/k8s-dns-kube-dns-${ARCH}        | 1.14.5                      | 1.14.7                      |
| k8s.gcr.io/k8s-dns-dnsmasq-nanny-${ARCH}   | 1.14.5                      | 1.14.7                      |

<!--
Here `v1.8.x` means the "latest patch release of the v1.8 branch".

`${ARCH}` can be one of: `amd64`, `arm`, `arm64`, `ppc64le` or `s390x`.

If using `--feature-gates=CoreDNS` image `coredns/coredns:1.0.0` is required (instead of the three `k8s-dns-*` images).
-->
这里的 `v1.8.x` 指的是 "v1.8 分支的最新补丁版本"。

`${ARCH}` 可以是这些选项的其中一个：`amd64`、`arm`、`arm64`、`ppc64le` 或者 `s390x`。

如果使用 `--feature-gates=CoreDNS` 那么就需要 `coredns/coredns:1.0.0` 镜像（替代那三个 `k8s-dns-*` 镜像）。

<!--
### Automating kubeadm
-->
### kubeadm 自动化

<!--
Rather than copying the token you obtained from `kubeadm init` to each node, as
in the [basic kubeadm tutorial](/docs/setup/independent/create-cluster-kubeadm/), you can parallelize the
token distribution for easier automation. To implement this automation, you must
know the IP address that the master will have after it is started.
-->
就像 [kubeadm 基础教程](/docs/setup/independent/create-cluster-kubeadm/) 所述，您可以并行化 token 分配以达到更好的自动化，而不是拷贝从 `kubeadm init` 获得的 token 到每一个节点上。要实现这个自动化，您必须知道 master 节点安装完成后该节点的 IP 地址。

<!--
1.  Generate a token. This token must have the form  `<6 character string>.<16
    character string>`.  More formally, it must match the regex:
    `[a-z0-9]{6}\.[a-z0-9]{16}`.

    kubeadm can generate a token for you:
-->
1.  创建一个 token。该 token 必须符合 `<6 个字符>.<16 个字符>` 的格式。更严格的，它必须符合以下正则表达式：
    `[a-z0-9]{6}\.[a-z0-9]{16}`

    kubeadm 也能为您创建一个 token:

    ```bash
    kubeadm token generate
    ```

<!--
1. Start both the master node and the worker nodes concurrently with this token.
   As they come up they should find each other and form the cluster.  The same
   `--token` argument can be used on both `kubeadm init` and `kubeadm join`.
-->
1. 使用这个 token 来同时启动 master 节点和工作节点。当它们启动后它们应该能够找到彼此并且组成集群。`kubeadm init` 和 `kubeadm join` 都能使用同样的 `--token` 参数。

<!--
Once the cluster is up, you can grab the admin credentials from the master node
at `/etc/kubernetes/admin.conf` and use that to talk to the cluster.
-->
当集群建立后，您就能从 master 节点的 `/etc/kubernetes/admin.conf` 路径获得管理员证书，并且使用这个证书来和集群通信。

<!--
Note that this style of bootstrap has some relaxed security guarantees because
it does not allow the root CA hash to be validated with
`--discovery-token-ca-cert-hash` (since it's not generated when the nodes are
provisioned). For details, see the [kubeadm join](kubeadm-join.md).
-->
请注意，这种引导风格并没有做到严密的安全保证，因为它不能通过 `--discovery-token-ca-cert-hash` 来验证根 CA 哈希值（因为当节点创建时根 CA 还没有生成）。详细信息请参阅 [kubeadm join](kubeadm-join.md)。

{% endcapture %}

{% capture whatsnext %}
<!--
* [kubeadm join](kubeadm-join.md) to bootstrap a Kubernetes worker node and join it to the cluster
* [kubeadm upgrade](kubeadm-upgrade.md) to upgrade a Kubernetes cluster to a newer version
* [kubeadm reset](kubeadm-reset.md) to revert any changes made to this host by `kubeadm init` or `kubeadm join`
-->
* [kubeadm join](kubeadm-join.md) 引导一个 Kubernetes 工作节点并将其加入到集群中
* [kubeadm upgrade](kubeadm-upgrade.md) 升级一个 Kubernetes 集群到更新的版本
* [kubeadm reset](kubeadm-reset.md) 恢复由 `kubeadm init` 或者 `kubeadm join` 对主机所做的任何修改
{% endcapture %}

{% include templates/concept.md %}
