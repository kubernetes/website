---
title: PKI 证书和要求
content_type: concept
weight: 50
---
<!--
title: PKI certificates and requirements
reviewers:
- sig-cluster-lifecycle
content_type: concept
weight: 50
-->

<!-- overview -->

<!--
Kubernetes requires PKI certificates for authentication over TLS.
If you install Kubernetes with [kubeadm](/docs/reference/setup-tools/kubeadm/), the certificates
that your cluster requires are automatically generated.
You can also generate your own certificates -- for example, to keep your private keys more secure
by not storing them on the API server.
This page explains the certificates that your cluster requires.
-->
Kubernetes 需要 PKI 证书才能进行基于 TLS 的身份验证。如果你是使用
[kubeadm](/zh-cn/docs/reference/setup-tools/kubeadm/) 安装的 Kubernetes，
则会自动生成集群所需的证书。你还可以生成自己的证书。
例如，不将私钥存储在 API 服务器上，可以让私钥更加安全。此页面说明了集群必需的证书。

<!-- body -->

<!--
## How certificates are used by your cluster

Kubernetes requires PKI for the following operations:
-->
## 集群是如何使用证书的    {#how-certificates-are-used-by-your-cluster}

Kubernetes 需要 PKI 才能执行以下操作：

<!--
* Client certificates for the kubelet to authenticate to the API server
* Kubelet [server certificates](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#client-and-serving-certificates)
  for the API server to talk to the kubelets
* Server certificate for the API server endpoint
* Client certificates for administrators of the cluster to authenticate to the API server
* Client certificates for the API server to talk to the kubelets
* Client certificate for the API server to talk to etcd
* Client certificate/kubeconfig for the controller manager to talk to the API server
* Client certificate/kubeconfig for the scheduler to talk to the API server.
* Client and server certificates for the [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)
-->
* Kubelet 的客户端证书，用于 API 服务器身份验证
* Kubelet [服务端证书](/zh-cn/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#client-and-serving-certificates)，
  用于 API 服务器与 Kubelet 的会话
* API 服务器端点的证书
* 集群管理员的客户端证书，用于 API 服务器身份认证
* API 服务器的客户端证书，用于和 Kubelet 的会话
* API 服务器的客户端证书，用于和 etcd 的会话
* 控制器管理器的客户端证书或 kubeconfig，用于和 API 服务器的会话
* 调度器的客户端证书或 kubeconfig，用于和 API 服务器的会话
* [前端代理](/zh-cn/docs/tasks/extend-kubernetes/configure-aggregation-layer/)的客户端及服务端证书

{{< note >}}
<!--
`front-proxy` certificates are required only if you run kube-proxy to support
[an extension API server](/docs/tasks/extend-kubernetes/setup-extension-api-server/).
-->
只有当你运行 kube-proxy
并要支持[扩展 API 服务器](/zh-cn/docs/tasks/extend-kubernetes/setup-extension-api-server/)时，
才需要 `front-proxy` 证书。
{{< /note >}}

<!--
etcd also implements mutual TLS to authenticate clients and peers.
-->
etcd 还实现了双向 TLS 来对客户端和对其他对等节点进行身份验证。

<!--
## Where certificates are stored

If you install Kubernetes with kubeadm, most certificates are stored in `/etc/kubernetes/pki`.
All paths in this documentation are relative to that directory, with the exception of user account
certificates which kubeadm places in `/etc/kubernetes`.
-->
## 证书存放的位置    {#where-certificates-are-stored}

假如通过 kubeadm 安装 Kubernetes，大多数证书都存储在 `/etc/kubernetes/pki`。
本文档中的所有路径都是相对于该目录的，但用户账户证书除外，kubeadm 将其放在 `/etc/kubernetes` 中。

<!--
## Configure certificates manually

If you don't want kubeadm to generate the required certificates, you can create them using a
single root CA or by providing all certificates. See [Certificates](/docs/tasks/administer-cluster/certificates/)
for details on creating your own certificate authority. See
[Certificate Management with kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)
for more on managing certificates.
-->
## 手动配置证书    {#configure-certificates-manually}

如果你不想通过 kubeadm 生成这些必需的证书，你可以使用一个单一的根 CA
来创建这些证书或者直接提供所有证书。
参见[证书](/zh-cn/docs/tasks/administer-cluster/certificates/)以进一步了解创建自己的证书机构。
关于管理证书的更多信息，请参见[使用 kubeadm 进行证书管理](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)。

<!--
### Single root CA

You can create a single root CA, controlled by an administrator. This root CA can then create
multiple intermediate CAs, and delegate all further creation to Kubernetes itself.
-->
### 单根 CA    {#single-root-ca}

你可以创建由管理员控制的单根 CA。该根 CA 可以创建多个中间 CA，并将所有进一步的创建委托给 Kubernetes。

<!--
Required CAs:

| path                   | Default CN                | description                      |
|------------------------|---------------------------|----------------------------------|
| ca.crt,key             | kubernetes-ca             | Kubernetes general CA            |
| etcd/ca.crt,key        | etcd-ca                   | For all etcd-related functions   |
| front-proxy-ca.crt,key | kubernetes-front-proxy-ca | For the [front-end proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) |

On top of the above CAs, it is also necessary to get a public/private key pair for service account
management, `sa.key` and `sa.pub`.
-->
需要这些 CA：

| 路径                    | 默认 CN                    | 描述                             |
|------------------------|---------------------------|----------------------------------|
| ca.crt,key             | kubernetes-ca             | Kubernetes 通用 CA                |
| etcd/ca.crt,key        | etcd-ca                   | 与 etcd 相关的所有功能              |
| front-proxy-ca.crt,key | kubernetes-front-proxy-ca | 用于[前端代理](/zh-cn/docs/tasks/extend-kubernetes/configure-aggregation-layer/) |

上面的 CA 之外，还需要获取用于服务账户管理的密钥对，也就是 `sa.key` 和 `sa.pub`。

<!--
The following example illustrates the CA key and certificate files shown in the previous table:
-->
下面的例子说明了上表中所示的 CA 密钥和证书文件。

```console
/etc/kubernetes/pki/ca.crt
/etc/kubernetes/pki/ca.key
/etc/kubernetes/pki/etcd/ca.crt
/etc/kubernetes/pki/etcd/ca.key
/etc/kubernetes/pki/front-proxy-ca.crt
/etc/kubernetes/pki/front-proxy-ca.key
```

<!--
### All certificates

If you don't wish to copy the CA private keys to your cluster, you can generate all certificates yourself.

Required certificates:
-->
### 所有的证书    {#all-certificates}

如果你不想将 CA 的私钥拷贝至你的集群中，你也可以自己生成全部的证书。

需要这些证书：

<!--
| Default CN                    | Parent CA                 | O (in Subject) | kind             | hosts (SAN)                                         |
|-------------------------------|---------------------------|----------------|------------------|-----------------------------------------------------|
| kube-etcd                     | etcd-ca                   |                | server, client   | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-peer                | etcd-ca                   |                | server, client   | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-healthcheck-client  | etcd-ca                   |                | client           |                                                     |
| kube-apiserver-etcd-client    | etcd-ca                   | system:masters | client           |                                                     |
| kube-apiserver                | kubernetes-ca             |                | server           | `<hostname>`, `<Host_IP>`, `<advertise_IP>`, `[1]`  |
| kube-apiserver-kubelet-client | kubernetes-ca             | system:masters | client           |                                                     |
| front-proxy-client            | kubernetes-front-proxy-ca |                | client           |                                                     |
-->
| 默认 CN                       | 父级 CA                    |O（位于 Subject 中）| kind             | 主机 (SAN)                                          |
|-------------------------------|---------------------------|-------------------|------------------|-----------------------------------------------------|
| kube-etcd                     | etcd-ca                   |                   | server, client   | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-peer                | etcd-ca                   |                   | server, client   | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-healthcheck-client  | etcd-ca                   |                   | client           |                                                     |
| kube-apiserver-etcd-client    | etcd-ca                   | system:masters    | client           |                                                     |
| kube-apiserver                | kubernetes-ca             |                   | server           | `<hostname>`, `<Host_IP>`, `<advertise_IP>`, `[1]`  |
| kube-apiserver-kubelet-client | kubernetes-ca             | system:masters    | client           |                                                     |
| front-proxy-client            | kubernetes-front-proxy-ca |                   | client           |                                                     |

<!--
[1]: any other IP or DNS name you contact your cluster on (as used by [kubeadm](/docs/reference/setup-tools/kubeadm/)
the load balancer stable IP and/or DNS name, `kubernetes`, `kubernetes.default`, `kubernetes.default.svc`,
`kubernetes.default.svc.cluster`, `kubernetes.default.svc.cluster.local`)

where `kind` maps to one or more of the x509 key usage, which is also documented in the
`.spec.usages` of a [CertificateSigningRequest](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1#CertificateSigningRequest)
type:
-->
[1]: 用来连接到集群的不同 IP 或 DNS 名
（就像 [kubeadm](/zh-cn/docs/reference/setup-tools/kubeadm/) 为负载均衡所使用的固定
IP 或 DNS 名：`kubernetes`、`kubernetes.default`、`kubernetes.default.svc`、
`kubernetes.default.svc.cluster`、`kubernetes.default.svc.cluster.local`）。

其中 `kind` 对应一种或多种类型的 x509 密钥用途，也可记录在
[CertificateSigningRequest](/zh-cn/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1#CertificateSigningRequest)
类型的 `.spec.usages` 中：

<!--
| kind   | Key usage                                                                       |
|--------|---------------------------------------------------------------------------------|
| server | digital signature, key encipherment, server auth                                |
| client | digital signature, key encipherment, client auth                                |
-->
| kind   | 密钥用途                                                                         |
|--------|---------------------------------------------------------------------------------|
| server | 数字签名、密钥加密、服务端认证                                                     |
| client | 数字签名、密钥加密、客户端认证                                                     |

{{< note >}}
<!--
Hosts/SAN listed above are the recommended ones for getting a working cluster; if required by a
specific setup, it is possible to add additional SANs on all the server certificates.
-->
上面列出的 Hosts/SAN 是推荐的配置方式；如果需要特殊安装，则可以在所有服务器证书上添加其他 SAN。
{{< /note >}}

{{< note >}}
<!--
For kubeadm users only:

* The scenario where you are copying to your cluster CA certificates without private keys is
  referred as external CA in the kubeadm documentation.
* If you are comparing the above list with a kubeadm generated PKI, please be aware that
  `kube-etcd`, `kube-etcd-peer` and `kube-etcd-healthcheck-client` certificates are not generated
  in case of external etcd.
-->
对于 kubeadm 用户：

* 不使用私钥，将证书复制到集群 CA 的方案，在 kubeadm 文档中将这种方案称为外部 CA。
* 如果将以上列表与 kubeadm 生成的 PKI 进行比较，你会注意到，如果使用外部 etcd，则不会生成
  `kube-etcd`、`kube-etcd-peer` 和 `kube-etcd-healthcheck-client` 证书。

{{< /note >}}

<!--
### Certificate paths

Certificates should be placed in a recommended path (as used by [kubeadm](/docs/reference/setup-tools/kubeadm/)).
Paths should be specified using the given argument regardless of location.
-->
### 证书路径    {#certificate-paths}

证书应放置在建议的路径中（以便 [kubeadm](/zh-cn/docs/reference/setup-tools/kubeadm/)
使用）。无论使用什么位置，都应使用给定的参数指定路径。

<!--
| Default CN                   | recommended key path         | recommended cert path       | command                 | key argument                 | cert argument                             |
|------------------------------|------------------------------|-----------------------------|-------------------------|------------------------------|-------------------------------------------|
| etcd-ca                      | etcd/ca.key                  | etcd/ca.crt                 | kube-apiserver          |                              | --etcd-cafile                             |
| kube-apiserver-etcd-client   | apiserver-etcd-client.key    | apiserver-etcd-client.crt   | kube-apiserver          | --etcd-keyfile               | --etcd-certfile                           |
| kubernetes-ca                | ca.key                       | ca.crt                      | kube-apiserver          |                              | --client-ca-file                          |
| kubernetes-ca                | ca.key                       | ca.crt                      | kube-controller-manager | --cluster-signing-key-file   | --client-ca-file, --root-ca-file, --cluster-signing-cert-file |
| kube-apiserver               | apiserver.key                | apiserver.crt               | kube-apiserver          | --tls-private-key-file       | --tls-cert-file                           |
| kube-apiserver-kubelet-client| apiserver-kubelet-client.key | apiserver-kubelet-client.crt| kube-apiserver          | --kubelet-client-key         | --kubelet-client-certificate              |
| front-proxy-ca               | front-proxy-ca.key           | front-proxy-ca.crt          | kube-apiserver          |                              | --requestheader-client-ca-file            |
| front-proxy-ca               | front-proxy-ca.key           | front-proxy-ca.crt          | kube-controller-manager |                              | --requestheader-client-ca-file            |
| front-proxy-client           | front-proxy-client.key       | front-proxy-client.crt      | kube-apiserver          | --proxy-client-key-file      | --proxy-client-cert-file                  |
| etcd-ca                      | etcd/ca.key                  | etcd/ca.crt                 | etcd                    |                              | --trusted-ca-file, --peer-trusted-ca-file |
| kube-etcd                    | etcd/server.key              | etcd/server.crt             | etcd                    | --key-file                   | --cert-file                               |
| kube-etcd-peer               | etcd/peer.key                | etcd/peer.crt               | etcd                    | --peer-key-file              | --peer-cert-file                          |
| etcd-ca                      |                              | etcd/ca.crt                 | etcdctl                 |                              | --cacert                                  |
| kube-etcd-healthcheck-client | etcd/healthcheck-client.key  | etcd/healthcheck-client.crt | etcdctl                 | --key                        | --cert                                    |
-->
| 默认 CN                   | 建议的密钥路径         | 建议的证书路径       | 命令        | 密钥参数               | 证书参数                             |
|------------------------------|------------------------------|-----------------------------|----------------|------------------------------|-------------------------------------------|
| etcd-ca                      |     etcd/ca.key                         | etcd/ca.crt                 | kube-apiserver |                              | --etcd-cafile                             |
| kube-apiserver-etcd-client   | apiserver-etcd-client.key    | apiserver-etcd-client.crt   | kube-apiserver | --etcd-keyfile               | --etcd-certfile                           |
| kubernetes-ca                |    ca.key                          | ca.crt                      | kube-apiserver |                              | --client-ca-file                          |
| kubernetes-ca                |    ca.key                          | ca.crt                      | kube-controller-manager | --cluster-signing-key-file      | --client-ca-file, --root-ca-file, --cluster-signing-cert-file  |
| kube-apiserver               | apiserver.key                | apiserver.crt               | kube-apiserver | --tls-private-key-file       | --tls-cert-file                           |
| kube-apiserver-kubelet-client|     apiserver-kubelet-client.key                         | apiserver-kubelet-client.crt| kube-apiserver | --kubelet-client-key | --kubelet-client-certificate              |
| front-proxy-ca               |     front-proxy-ca.key                         | front-proxy-ca.crt          | kube-apiserver |                              | --requestheader-client-ca-file            |
| front-proxy-ca               |     front-proxy-ca.key                         | front-proxy-ca.crt          | kube-controller-manager |                              | --requestheader-client-ca-file |
| front-proxy-client           | front-proxy-client.key       | front-proxy-client.crt      | kube-apiserver | --proxy-client-key-file      | --proxy-client-cert-file                  |
| etcd-ca                      |         etcd/ca.key                     | etcd/ca.crt                 | etcd           |                              | --trusted-ca-file, --peer-trusted-ca-file |
| kube-etcd                    | etcd/server.key              | etcd/server.crt             | etcd           | --key-file                   | --cert-file                               |
| kube-etcd-peer               | etcd/peer.key                | etcd/peer.crt               | etcd           | --peer-key-file              | --peer-cert-file                          |
| etcd-ca                      |                              | etcd/ca.crt                 | etcdctl    |                              | --cacert                                  |
| kube-etcd-healthcheck-client | etcd/healthcheck-client.key  | etcd/healthcheck-client.crt | etcdctl     | --key                        | --cert                                    |

<!--
Same considerations apply for the service account key pair:
-->
注意事项同样适用于服务帐户密钥对：

<!--
| private key path  | public key path  | command                 | argument                             |
|-------------------|------------------|-------------------------|--------------------------------------|
|  sa.key           |                  | kube-controller-manager | --service-account-private-key-file   |
|                   | sa.pub           | kube-apiserver          | --service-account-key-file           |
-->
| 私钥路径           | 公钥路径         | 命令                     | 参数                                 |
|-------------------|------------------|-------------------------|--------------------------------------|
|  sa.key           |                  | kube-controller-manager | --service-account-private-key-file   |
|                   | sa.pub           | kube-apiserver          | --service-account-key-file           |

<!--
The following example illustrates the file paths [from the previous tables](#certificate-paths)
you need to provide if you are generating all of your own keys and certificates:
-->
下面的例子展示了自行生成所有密钥和证书时所需要提供的文件路径。
这些路径基于[前面的表格](/zh-cn/docs/setup/best-practices/certificates/#certificate-paths)。

```console
/etc/kubernetes/pki/etcd/ca.key
/etc/kubernetes/pki/etcd/ca.crt
/etc/kubernetes/pki/apiserver-etcd-client.key
/etc/kubernetes/pki/apiserver-etcd-client.crt
/etc/kubernetes/pki/ca.key
/etc/kubernetes/pki/ca.crt
/etc/kubernetes/pki/apiserver.key
/etc/kubernetes/pki/apiserver.crt
/etc/kubernetes/pki/apiserver-kubelet-client.key
/etc/kubernetes/pki/apiserver-kubelet-client.crt
/etc/kubernetes/pki/front-proxy-ca.key
/etc/kubernetes/pki/front-proxy-ca.crt
/etc/kubernetes/pki/front-proxy-client.key
/etc/kubernetes/pki/front-proxy-client.crt
/etc/kubernetes/pki/etcd/server.key
/etc/kubernetes/pki/etcd/server.crt
/etc/kubernetes/pki/etcd/peer.key
/etc/kubernetes/pki/etcd/peer.crt
/etc/kubernetes/pki/etcd/healthcheck-client.key
/etc/kubernetes/pki/etcd/healthcheck-client.crt
/etc/kubernetes/pki/sa.key
/etc/kubernetes/pki/sa.pub
```

<!--
## Configure certificates for user accounts

You must manually configure these administrator account and service accounts:
-->
## 为用户帐户配置证书    {#configure-certificates-for-user-accounts}

你必须手动配置以下管理员帐户和服务帐户：

<!--
| filename                | credential name            | Default CN                          | O (in Subject) |
|-------------------------|----------------------------|-------------------------------------|----------------|
| admin.conf              | default-admin              | kubernetes-admin                    | system:masters |
| kubelet.conf            | default-auth               | system:node:`<nodeName>` (see note) | system:nodes   |
| controller-manager.conf | default-controller-manager | system:kube-controller-manager      |                |
| scheduler.conf          | default-scheduler          | system:kube-scheduler               |                |
-->
| 文件名                  | 凭据名称                   | 默认 CN                        | O (位于 Subject 中) |
|-------------------------|----------------------------|--------------------------------|---------------------|
| admin.conf              | default-admin              | kubernetes-admin               | system:masters      |
| kubelet.conf            | default-auth               | system:node:`<nodeName>` （参阅注释） | system:nodes |
| controller-manager.conf | default-controller-manager | system:kube-controller-manager |                     |
| scheduler.conf          | default-scheduler          | system:kube-scheduler          |                     |

{{< note >}}
<!--
The value of `<nodeName>` for `kubelet.conf` **must** match precisely the value of the node name
provided by the kubelet as it registers with the apiserver. For further details, read the
[Node Authorization](/docs/reference/access-authn-authz/node/).
-->
`kubelet.conf` 中 `<nodeName>` 的值 **必须** 与 kubelet 向 apiserver 注册时提供的节点名称的值完全匹配。
有关更多详细信息，请阅读[节点授权](/zh-cn/docs/reference/access-authn-authz/node/)。
{{< /note >}}

<!--
1. For each config, generate an x509 cert/key pair with the given CN and O.

1. Run `kubectl` as follows for each config:
-->
1. 对于每个配置，请都使用给定的 CN 和 O 生成 x509 证书/密钥偶对。

1. 为每个配置运行下面的 `kubectl` 命令：

```
KUBECONFIG=<filename> kubectl config set-cluster default-cluster --server=https://<host ip>:6443 --certificate-authority <path-to-kubernetes-ca> --embed-certs
KUBECONFIG=<filename> kubectl config set-credentials <credential-name> --client-key <path-to-key>.pem --client-certificate <path-to-cert>.pem --embed-certs
KUBECONFIG=<filename> kubectl config set-context default-system --cluster default-cluster --user <credential-name>
KUBECONFIG=<filename> kubectl config use-context default-system
```

<!--
These files are used as follows:

| filename                | command                 | comment                                                               |
|-------------------------|-------------------------|-----------------------------------------------------------------------|
| admin.conf              | kubectl                 | Configures administrator user for the cluster                         |
| kubelet.conf            | kubelet                 | One required for each node in the cluster.                            |
| controller-manager.conf | kube-controller-manager | Must be added to manifest in `manifests/kube-controller-manager.yaml` |
| scheduler.conf          | kube-scheduler          | Must be added to manifest in `manifests/kube-scheduler.yaml`          |
-->
这些文件用途如下：

| 文件名                   | 命令                     | 说明                                                                 |
|-------------------------|-------------------------|-----------------------------------------------------------------------|
| admin.conf              | kubectl                 | 配置集群的管理员                                                        |
| kubelet.conf            | kubelet                 | 集群中的每个节点都需要一份                                               |
| controller-manager.conf | kube-controller-manager | 必需添加到 `manifests/kube-controller-manager.yaml` 清单中              |
| scheduler.conf          | kube-scheduler          | 必需添加到 `manifests/kube-scheduler.yaml` 清单中                       |

<!--
The following files illustrate full paths to the files listed in the previous table:
-->
下面是前表中所列文件的完整路径。

```console
/etc/kubernetes/admin.conf
/etc/kubernetes/kubelet.conf
/etc/kubernetes/controller-manager.conf
/etc/kubernetes/scheduler.conf
```
