---
title: PKI 证书和需求
content_template: templates/concept
--- 
<!-- 
---
title: PKI Certificates and Requirements
reviewers:
- sig-cluster-lifecycle 
content_template: templates/concept
--- 
-->

{{% capture overview %}}

<!-- 
Kubernetes requires PKI certificates for authentication over TLS.
If you install Kubernetes with [kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm/), the certificates that your cluster requires are automatically generated.
You can also generate your own certificates -- for example, to keep your private keys more secure by not storing them on the API server.
This page explains the certificates that your cluster requires. 
-->
Kubernetes 需要 PKI 证书才能通过 TLS 进行身份验证。如果使用 [kubeadm](/zh/docs/reference/setup-tools/kubeadm/kubeadm/) 安装 Kubernetes，集群所需的证书会被自动生成。
您还可以生成自己的证书——例如，通过不将私钥保存在 API 服务器上，来更安全地保护它们。。
此页面说明了集群所需的证书。

{{% /capture %}}

{{% capture body %}}

<!-- 
## How certificates are used by your cluster 
-->
## 集群如何使用证书

<!-- 
Kubernetes requires PKI for the following operations: 
-->
Kubernetes 在执行以下操作时需要相应的证书：

<!-- 
* Client certificates for the kubelet to authenticate to the API server
* Server certificate for the API server endpoint
* Client certificates for administrators of the cluster to authenticate to the API server
* Client certificates for the API server to talk to the kubelets
* Client certificate for the API server to talk to etcd
* Client certificate/kubeconfig for the controller manager to talk to the API server
* Client certificate/kubeconfig for the scheduler to talk to the API server.
* Client and server certificates for the [front-proxy][proxy] 
-->
* 客户端证书，供 kubelet 访问 API 服务器时的身份验证使用
* API 服务器端点的服务器证书
* 客户端证书，供集群管理员访问 API 服务器时的身份验证之用
* API 服务器与 kubelet 通信所需的客户端证书
* API 服务器与 etcd 通信所需的客户端证书
* 客户端证书/kubeconfig，供控制器管理器与 API 服务器通信
* 客户端证书/kubeconfig，供调度器与 API 服务器通信。
* [front-proxy][proxy] 的客户端和服务器证书

{{< note >}}
<!-- 
`front-proxy` certificates are required only if you run kube-proxy to support [an extension API server](/docs/tasks/access-kubernetes-api/setup-extension-api-server/). 
-->
仅在您使用 kube-proxy 来支持 [一个扩展 API 服务器](/zh/docs/tasks/access-kubernetes-api/setup-extension-api-server/) 时才需要 `front-proxy` 证书。
{{< /note >}}

<!-- 
etcd also implements mutual TLS to authenticate clients and peers. 
-->
etcd 还实现了双向 TLS 来验证客户端和对等端。

<!-- 
## Where certificates are stored 
-->
## 证书在何处存储

<!-- 
If you install Kubernetes with kubeadm, certificates are stored in `/etc/kubernetes/pki`. All paths in this documentation are relative to that directory. 
-->
如果使用 kubeadm 安装 Kubernetes，证书将存储在 `/etc/kubernetes/pki` 目录中。 本文档中的所有路径，都是与该目录的相对路径。

<!-- 
## Configure certificates manually 
-->
## 手动配置证书

<!-- 
If you don't want kubeadm to generate the required certificates, you can create them in either of the following ways. 
-->
如果您不希望 kubeadm 生成所需的证书，可以使用以下任一方法创建它们。

<!-- 
### Single root CA 
-->
单个 root CA

<!-- 
You can create a single root CA, controlled by an administrator. This root CA can then create multiple intermediate CAs, and delegate all further creation to Kubernetes itself.  
-->
您可以创建一个由管理员控制的单个 root CA。然后，此 root CA 可以创建多个中间 CA，并委托 Kubernetes 本身完成后续创建操作。

<!-- 
Required CAs:

| path                   | Default CN                | description                      |
|------------------------|---------------------------|----------------------------------|
| ca.crt,key             | kubernetes-ca             | Kubernetes general CA            |
| etcd/ca.crt,key        | etcd-ca                   | For all etcd-related functions   |
| front-proxy-ca.crt,key | kubernetes-front-proxy-ca | For the [front-end proxy][proxy] | 
-->
所需 CA：

| 路径                   | 默认 CN                    | 描述                             |
|------------------------|---------------------------|----------------------------------|
| ca.crt,key             | kubernetes-ca             | Kubernetes 通用 CA               |
| etcd/ca.crt,key        | etcd-ca                   | 所有 etcd 相关操作                |
| front-proxy-ca.crt,key | kubernetes-front-proxy-ca | 供 [front-end proxy][proxy] 使用  | 

<!-- 
### All certificates 
-->
### 所有证书

<!-- 
If you don't wish to copy these private keys to your API servers, you can generate all certificates yourself.  
-->
如果您不希望将这些私钥复制到 API 服务器，您可以自己生成所有证书。

<!-- 
Required certificates:

| Default CN                    | Parent CA                 | O (in Subject) | kind                                   | hosts (SAN)                                 |
|-------------------------------|---------------------------|----------------|----------------------------------------|---------------------------------------------|
| kube-etcd                     | etcd-ca                   |                | server, client [<sup>1</sup>][etcdbug] | `localhost`, `127.0.0.1`                        |
| kube-etcd-peer                | etcd-ca                   |                | server, client                                   | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-healthcheck-client  | etcd-ca                   |                | client                                 |                                             |
| kube-apiserver-etcd-client    | etcd-ca                   | system:masters | client                                 |                                             |
| kube-apiserver                | kubernetes-ca             |                | server                                 | `<hostname>`, `<Host_IP>`, `<advertise_IP>`, `[1]` |
| kube-apiserver-kubelet-client | kubernetes-ca             | system:masters | client                                 |                                             |
| front-proxy-client            | kubernetes-front-proxy-ca |                | client                                 |                                             | 
-->
所需证书：

| 默认 CN                       | 父 CA                      | O (in Subject) | 种类                                   | 主机 (SAN)                                          |
|-------------------------------|---------------------------|----------------|----------------------------------------|-----------------------------------------------------|
| kube-etcd                     | etcd-ca                   |                | server, client [<sup>1</sup>][etcdbug] | `localhost`, `127.0.0.1`                            |
| kube-etcd-peer                | etcd-ca                   |                | server, client                         | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-healthcheck-client  | etcd-ca                   |                | client                                 |                                                     |
| kube-apiserver-etcd-client    | etcd-ca                   | system:masters | client                                 |                                                     |
| kube-apiserver                | kubernetes-ca             |                | server                                 | `<hostname>`, `<Host_IP>`, `<advertise_IP>`, `[1]`  |
| kube-apiserver-kubelet-client | kubernetes-ca             | system:masters | client                                 |                                                     |
| front-proxy-client            | kubernetes-front-proxy-ca |                | client                                 |                                                     |

[1]: `kubernetes`, `kubernetes.default`, `kubernetes.default.svc`, `kubernetes.default.svc.cluster`, `kubernetes.default.svc.cluster.local`

<!-- 
where `kind` maps to one or more of the [x509 key usage][usage] types: 
-->
`kind` 映射到一个或多个 [x509 key usage][usage] 类型上

<!-- 
| kind   | Key usage                                                                       |
|--------|---------------------------------------------------------------------------------|
| server | digital signature, key encipherment, server auth                                |
| client | digital signature, key encipherment, client auth                                | 
-->
| 种类   | 密钥用途                                                                         |
|--------|---------------------------------------------------------------------------------|
| server | 数字签名，密钥加密，服务器鉴权                                                     |
| client | 数字签名，密钥加密，客户端鉴权                                                     | 

<!-- 
### Certificate paths 
-->
### 证书路径

<!-- 
Certificates should be placed in a recommended path (as used by [kubeadm][kubeadm]). Paths should be specified using the given argument regardless of location.

| Default CN                   | recommend key path           | recommended cert path       | command        | key argument                 | cert argument                             |
|------------------------------|------------------------------|-----------------------------|----------------|------------------------------|-------------------------------------------|
| etcd-ca                      |                              | etcd/ca.crt                 | kube-apiserver |                              | --etcd-cafile                             |
| etcd-client                  | apiserver-etcd-client.crt    | apiserver-etcd-client.crt   | kube-apiserver | --etcd-certfile              | --etcd-keyfile                            |
| kubernetes-ca                |                              | ca.crt                      | kube-apiserver | --client-ca-file             |                                           |
| kube-apiserver               | apiserver.crt                | apiserver.key               | kube-apiserver | --tls-cert-file              | --tls-private-key                         |
| apiserver-kubelet-client     | apiserver-kubelet-client.crt |                             | kube-apiserver | --kubelet-client-certificate |                                           |
| front-proxy-client           | front-proxy-client.key       | front-proxy-client.crt      | kube-apiserver | --proxy-client-cert-file     | --proxy-client-key-file                   |
|                              |                              |                             |                |                              |                                           |
| etcd-ca                      |                              | etcd/ca.crt                 | etcd           |                              | --trusted-ca-file, --peer-trusted-ca-file |
| kube-etcd                    |                              | etcd/server.crt             | etcd           |                              | --cert-file                               |
| kube-etcd-peer               | etcd/peer.key                | etcd/peer.crt               | etcd           | --peer-key-file              | --peer-cert-file                          |
| etcd-ca                      |                              | etcd/ca.crt                 | etcdctl[2]     |                              | --cacert                                  |
| kube-etcd-healthcheck-client | etcd/healthcheck-client.key  | etcd/healthcheck-client.crt | etcdctl[2]     | --key                        | --cert                                    | 
-->
证书应放置在推荐路径 (类似 [kubeadm][kubeadm] 中指定的)。无论位置如何，都应使用给定的参数指定路径。

| 默认 CN                      | 建议密钥路径                  | 建议 cert 路径               | 命令           | 密钥参数                      | cert 参数                                 |
|------------------------------|------------------------------|-----------------------------|----------------|------------------------------|-------------------------------------------|
| etcd-ca                      |                              | etcd/ca.crt                 | kube-apiserver |                              | --etcd-cafile                             |
| etcd-client                  | apiserver-etcd-client.crt    | apiserver-etcd-client.crt   | kube-apiserver | --etcd-certfile              | --etcd-keyfile                            |
| kubernetes-ca                |                              | ca.crt                      | kube-apiserver | --client-ca-file             |                                           |
| kube-apiserver               | apiserver.crt                | apiserver.key               | kube-apiserver | --tls-cert-file              | --tls-private-key                         |
| apiserver-kubelet-client     | apiserver-kubelet-client.crt |                             | kube-apiserver | --kubelet-client-certificate |                                           |
| front-proxy-client           | front-proxy-client.key       | front-proxy-client.crt      | kube-apiserver | --proxy-client-cert-file     | --proxy-client-key-file                   |
|                              |                              |                             |                |                              |                                           |
| etcd-ca                      |                              | etcd/ca.crt                 | etcd           |                              | --trusted-ca-file, --peer-trusted-ca-file |
| kube-etcd                    |                              | etcd/server.crt             | etcd           |                              | --cert-file                               |
| kube-etcd-peer               | etcd/peer.key                | etcd/peer.crt               | etcd           | --peer-key-file              | --peer-cert-file                          |
| etcd-ca                      |                              | etcd/ca.crt                 | etcdctl[2]     |                              | --cacert                                  |
| kube-etcd-healthcheck-client | etcd/healthcheck-client.key  | etcd/healthcheck-client.crt | etcdctl[2]     | --key                        | --cert                                    | 

<!-- 
[2]: For a liveness probe, if self-hosted 
-->
[2]: 对应自托管时的活跃度检测场景

<!-- 
## Configure certificates for user accounts 
-->
## 为用户帐户配置证书

<!-- 
You must manually configure these administrator account and service accounts:  
-->
您必须手动配置这些管理员帐户和服务帐户：

<!-- 
| filename                | credential name            | Default CN                     | O (in Subject) |
|-------------------------|----------------------------|--------------------------------|----------------|
| admin.conf              | default-admin              | kubernetes-admin               | system:masters |
| kubelet.conf            | default-auth               | system:node:`<nodename>`        | system:nodes   |
| controller-manager.conf | default-controller-manager | system:kube-controller-manager |                |
| scheduler.conf          | default-manager            | system:kube-scheduler          |                | 
-->
| 文件名                   | 凭据名                     | 默认                           | O (in Subject) |
|-------------------------|----------------------------|--------------------------------|----------------|
| admin.conf              | default-admin              | kubernetes-admin               | system:masters |
| kubelet.conf            | default-auth               | system:node:`<nodename>`       | system:nodes   |
| controller-manager.conf | default-controller-manager | system:kube-controller-manager |                |
| scheduler.conf          | default-manager            | system:kube-scheduler          |                |

<!-- 
1. For each config, generate an x509 cert/key pair with the given CN and O. 

1. Run `kubectl` as follows for each config: 
-->
1. 对于每个配置，使用给定的 CN 和 O 生成 x509 证书/密钥对。

1. 对于每个配置按如下所示执行 `kubectl`：

```shell
KUBECONFIG=<filename> kubectl config set-cluster default-cluster --server=https://<host ip>:6443 --certificate-authority <path-to-kubernetes-ca> --embed-certs
KUBECONFIG=<filename> kubectl config set-credentials <credential-name> --client-key <path-to-key>.pem --client-certificate <path-to-cert>.pem --embed-certs
KUBECONFIG=<filename> kubectl config set-context default-system --cluster default-cluster --user <credential-name>
KUBECONFIG=<filename> kubectl config use-context default-system
```

<!-- 
These files are used as follows: 
-->
这些文件用途如下：

<!-- 
| filename                | command                 | comment                                                               |
|-------------------------|-------------------------|-----------------------------------------------------------------------|
| admin.conf              | kubectl                 | Configures administrator user for the cluster                         |
| kubelet.conf            | kubelet                 | One required for each node in the cluster.                            |
| controller-manager.conf | kube-controller-manager | Must be added to manifest in `manifests/kube-controller-manager.yaml` |
| scheduler.conf          | kube-scheduler          | Must be added to manifest in `manifests/kube-scheduler.yaml`          |
 -->
| 文件名                  | 命令                     | 描述                                                                  |
|-------------------------|-------------------------|-----------------------------------------------------------------------|
| admin.conf              | kubectl                 | 配置集群的管理员用户                                                    |
| kubelet.conf            | kubelet                 | 集群中的每个节点都需要一个。                                            |
| controller-manager.conf | kube-controller-manager | 必须添加到清单 `manifests/kube-controller-manager.yaml` 中             |
| scheduler.conf          | kube-scheduler          | 必须添加到清单 `manifests/kube-scheduler.yaml` 中                      |

<!-- 
[usage]: https://godoc.org/k8s.io/api/certificates/v1beta1#KeyUsage 
-->
[usage]: https://godoc.org/k8s.io/api/certificates/v1beta1#KeyUsage
[kubeadm]: /zh/docs/reference/setup-tools/kubeadm/kubeadm/
[proxy]: /docs/tasks/access-kubernetes-api/configure-aggregation-layer/

{{% /capture %}}
