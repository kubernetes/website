---
title: PKI 證書和要求
content_type: concept
weight: 40
---
<!--
title: PKI certificates and requirements
reviewers:
- sig-cluster-lifecycle
content_type: concept
weight: 40
-->

<!-- overview -->

<!--
Kubernetes requires PKI certificates for authentication over TLS.
If you install Kubernetes with [kubeadm](/docs/reference/setup-tools/kubeadm/), the certificates that your cluster requires are automatically generated.
You can also generate your own certificates -- for example, to keep your private keys more secure by not storing them on the API server.
This page explains the certificates that your cluster requires.
-->
Kubernetes 需要 PKI 證書才能進行基於 TLS 的身份驗證。如果你是使用
[kubeadm](/zh-cn/docs/reference/setup-tools/kubeadm/) 安裝的 Kubernetes，
則會自動生成叢集所需的證書。你還可以生成自己的證書。
例如，不將私鑰儲存在 API 伺服器上，可以讓私鑰更加安全。此頁面說明了叢集必需的證書。

<!-- body -->

<!--
## How certificates are used by your cluster

Kubernetes requires PKI for the following operations:
-->
## 叢集是如何使用證書的    {#how-certificates-are-used-by-your-cluster}

Kubernetes 需要 PKI 才能執行以下操作：

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
* Kubelet 的客戶端證書，用於 API 伺服器身份驗證
* Kubelet [服務端證書](/zh-cn/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#client-and-serving-certificates)，
  用於 API 伺服器與 Kubelet 的會話
* API 伺服器端點的證書
* 叢集管理員的客戶端證書，用於 API 伺服器身份認證
* API 伺服器的客戶端證書，用於和 Kubelet 的會話
* API 伺服器的客戶端證書，用於和 etcd 的會話
* 控制器管理器的客戶端證書/kubeconfig，用於和 API 伺服器的會話
* 排程器的客戶端證書/kubeconfig，用於和 API 伺服器的會話
* [前端代理](/zh-cn/docs/tasks/extend-kubernetes/configure-aggregation-layer/) 的客戶端及服務端證書

<!--
`front-proxy` certificates are required only if you run kube-proxy to support [an extension API server](/docs/tasks/extend-kubernetes/setup-extension-api-server/).
-->
{{< note >}}
只有當你執行 kube-proxy 並要支援
[擴充套件 API 伺服器](/zh-cn/docs/tasks/extend-kubernetes/setup-extension-api-server/)
時，才需要 `front-proxy` 證書
{{< /note >}}

<!--
etcd also implements mutual TLS to authenticate clients and peers.
-->
etcd 還實現了雙向 TLS 來對客戶端和對其他對等節點進行身份驗證。

<!--
## Where certificates are stored

If you install Kubernetes with kubeadm, most certificates are stored in `/etc/kubernetes/pki`. All paths in this documentation are relative to that directory, with the exception of user account certificates which kubeadm places in `/etc/kubernetes`.
-->
## 證書存放的位置    {#where-certificates-are-stored}

假如透過 kubeadm 安裝 Kubernetes，大多數證書都儲存在 `/etc/kubernetes/pki`。
本文件中的所有路徑都是相對於該目錄的，但使用者賬戶證書除外，kubeadm 將其放在 `/etc/kubernetes` 中。

<!--
## Configure certificates manually

If you don't want kubeadm to generate the required certificates, you can create them using a single root CA or by providing all certificates. See [Certificates](/docs/tasks/administer-cluster/certificates/) for details on creating your own certificate authority.
See [Certificate Management with kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/) for more on managing certificates.
-->
## 手動配置證書    {#configure-certificates-manually}

如果你不想透過 kubeadm 生成這些必需的證書，你可以使用一個單一的根 CA
來建立這些證書或者直接提供所有證書。
參見[證書](/zh-cn/docs/tasks/administer-cluster/certificates/)以進一步瞭解建立自己的證書機構。
關於管理證書的更多資訊，請參見[使用 kubeadm 進行證書管理](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)。

<!--
### Single root CA

You can create a single root CA, controlled by an administrator. This root CA can then create multiple intermediate CAs, and delegate all further creation to Kubernetes itself.
-->
### 單根 CA    {#single-root-ca}

你可以建立一個單根 CA，由管理員控制器它。該根 CA 可以建立多箇中間 CA，並將所有進一步的建立委託給 Kubernetes。

<!--
Required CAs:

| path                   | Default CN                | description                      |
|------------------------|---------------------------|----------------------------------|
| ca.crt,key             | kubernetes-ca             | Kubernetes general CA            |
| etcd/ca.crt,key        | etcd-ca                   | For all etcd-related functions   |
| front-proxy-ca.crt,key | kubernetes-front-proxy-ca | For the [front-end proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) |

On top of the above CAs, it is also necessary to get a public/private key pair for service account management, `sa.key` and `sa.pub`.
-->
需要這些 CA：

| 路徑                    | 預設 CN                    | 描述                             |
|------------------------|---------------------------|----------------------------------|
| ca.crt,key             | kubernetes-ca             | Kubernetes 通用 CA                |
| etcd/ca.crt,key        | etcd-ca                   | 與 etcd 相關的所有功能              |
| front-proxy-ca.crt,key | kubernetes-front-proxy-ca | 用於 [前端代理](/zh-cn/docs/tasks/extend-kubernetes/configure-aggregation-layer/) |

上面的 CA 之外，還需要獲取用於服務賬戶管理的金鑰對，也就是 `sa.key` 和 `sa.pub`。

<!--
The following example illustrates the CA key and certificate files shown in the previous table:
-->
下面的例子說明了上表中所示的 CA 金鑰和證書檔案。

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
### 所有的證書    {#all-certificates}

如果你不想將 CA 的私鑰複製至你的叢集中，你也可以自己生成全部的證書。

需要這些證書：

<!--
| Default CN                    | Parent CA                 | O (in Subject) | kind                                   | hosts (SAN)                                 |
|-------------------------------|---------------------------|----------------|----------------------------------------|---------------------------------------------|
| kube-etcd                     | etcd-ca                   |                | server, client                         | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-peer                | etcd-ca                   |                | server, client                         | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-healthcheck-client  | etcd-ca                   |                | client                                 |                                             |
| kube-apiserver-etcd-client    | etcd-ca                   | system:masters | client                                 |                                             |
| kube-apiserver                | kubernetes-ca             |                | server                                 | `<hostname>`, `<Host_IP>`, `<advertise_IP>`, `[1]` |
| kube-apiserver-kubelet-client | kubernetes-ca             | system:masters | client                                 |                                             |
| front-proxy-client            | kubernetes-front-proxy-ca |                | client                                 |                                             |
-->
| 預設 CN                       | 父級 CA                   | O (位於 Subject 中) | 型別                              | 主機 (SAN)                                  |
|-------------------------------|---------------------------|----------------|----------------------------------------|---------------------------------------------|
| kube-etcd                     | etcd-ca                   |                | server, client                         | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-peer                | etcd-ca                   |                | server, client                         | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-healthcheck-client  | etcd-ca                   |                | client                                 |                                             |
| kube-apiserver-etcd-client    | etcd-ca                   | system:masters | client                                 |                                             |
| kube-apiserver                | kubernetes-ca             |                | server                                 | `<hostname>`, `<Host_IP>`, `<advertise_IP>`, `[1]` |
| kube-apiserver-kubelet-client | kubernetes-ca             | system:masters | client                                 |                                             |
| front-proxy-client            | kubernetes-front-proxy-ca |                | client                                 |                                             |

<!--
[1]: any other IP or DNS name you contact your cluster on (as used by [kubeadm](/docs/reference/setup-tools/kubeadm/)
the load balancer stable IP and/or DNS name, `kubernetes`, `kubernetes.default`, `kubernetes.default.svc`,
`kubernetes.default.svc.cluster`, `kubernetes.default.svc.cluster.local`)

where `kind` maps to one or more of the [x509 key usage](https://pkg.go.dev/k8s.io/api/certificates/v1beta1#KeyUsage) types:
-->
[1]: 用來連線到叢集的不同 IP 或 DNS 名
（就像 [kubeadm](/zh-cn/docs/reference/setup-tools/kubeadm/) 為負載均衡所使用的固定
IP 或 DNS 名，`kubernetes`、`kubernetes.default`、`kubernetes.default.svc`、
`kubernetes.default.svc.cluster`、`kubernetes.default.svc.cluster.local`）。

其中，`kind` 對應一種或多種型別的 [x509 金鑰用途](https://pkg.go.dev/k8s.io/api/certificates/v1beta1#KeyUsage)：

<!--
| kind   | Key usage                                                                       |
|--------|---------------------------------------------------------------------------------|
| server | digital signature, key encipherment, server auth                                |
| client | digital signature, key encipherment, client auth                                |
-->
| kind   | 金鑰用途                                                                         |
|--------|---------------------------------------------------------------------------------|
| server | 數字簽名、金鑰加密、服務端認證                                                       |
| client | 數字簽名、金鑰加密、客戶端認證                                                       |

{{< note >}}
<!--
Hosts/SAN listed above are the recommended ones for getting a working cluster; if required by a specific setup, it is possible to add additional SANs on all the server certificates.
-->
上面列出的 Hosts/SAN 是推薦的配置方式；如果需要特殊安裝，則可以在所有伺服器證書上新增其他 SAN。
{{< /note >}}

{{< note >}}
<!--
For kubeadm users only:

* The scenario where you are copying to your cluster CA certificates without private keys is referred as external CA in the kubeadm documentation.
* If you are comparing the above list with a kubeadm generated PKI, please be aware that `kube-etcd`, `kube-etcd-peer` and `kube-etcd-healthcheck-client` certificates
  are not generated in case of external etcd.
-->
對於 kubeadm 使用者：

* 不使用私鑰，將證書複製到叢集 CA 的方案，在 kubeadm 文件中將這種方案稱為外部 CA。
* 如果將以上列表與 kubeadm 生成的 PKI 進行比較，你會注意到，如果使用外部 etcd，則不會生成 `kube-etcd`、`kube-etcd-peer` 和 `kube-etcd-healthcheck-client` 證書。

{{< /note >}}

<!--
### Certificate paths

Certificates should be placed in a recommended path (as used by [kubeadm](/docs/reference/setup-tools/kubeadm/)).
Paths should be specified using the given argument regardless of location.
-->
### 證書路徑    {#certificate-paths}

證書應放置在建議的路徑中（以便 [kubeadm](/zh-cn/docs/reference/setup-tools/kubeadm/)
使用）。無論使用什麼位置，都應使用給定的引數指定路徑。

<!--
| Default CN                   | recommended key path         | recommended cert path       | command        | key argument                 | cert argument                             |
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
-->
| 預設 CN                   | 建議的金鑰路徑         | 建議的證書路徑       | 命令        | 金鑰引數               | 證書引數                             |
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
注意事項同樣適用於服務帳戶金鑰對：

<!--
| private key path             | public key path             | command                 | argument                             |
|------------------------------|-----------------------------|-------------------------|--------------------------------------|
|  sa.key                      |                             | kube-controller-manager | --service-account-private-key-file   |
|                              | sa.pub                      | kube-apiserver          | --service-account-key-file           |
-->
| 私鑰路徑            | 公鑰路徑            | 命令                 | 引數                             |
|------------------------------|-----------------------------|-------------------------|--------------------------------------|
|  sa.key                      |                             | kube-controller-manager | --service-account-private-key-file              |
|                              | sa.pub                      | kube-apiserver          | --service-account-key-file                  |

<!--
The following example illustrates the file paths [from the previous tables](/docs/setup/best-practices/certificates/#certificate-paths) you need to provide if you are generating all of your own keys and certificates:
-->
下面的例子展示了自行生成所有金鑰和證書時所需要提供的檔案路徑。
這些路徑基於[前面的表格](/zh-cn/docs/setup/best-practices/certificates/#certificate-paths)。

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
## 為使用者帳戶配置證書    {#configure-certificates-for-user-accounts}

你必須手動配置以下管理員帳戶和服務帳戶：

<!--
| filename                | credential name            | Default CN                     | O (in Subject) |
|-------------------------|----------------------------|--------------------------------|----------------|
| admin.conf              | default-admin              | kubernetes-admin               | system:masters |
| kubelet.conf            | default-auth               | system:node:`<nodeName>` (see note) | system:nodes   |
| controller-manager.conf | default-controller-manager | system:kube-controller-manager |                |
| scheduler.conf          | default-scheduler          | system:kube-scheduler          |                |
-->
| 檔名                  | 憑據名稱                   | 預設 CN                        | O (位於 Subject 中) |
|-------------------------|----------------------------|--------------------------------|---------------------|
| admin.conf              | default-admin              | kubernetes-admin               | system:masters      |
| kubelet.conf            | default-auth               | system:node:`<nodeName>` （參閱註釋） | system:nodes |
| controller-manager.conf | default-controller-manager | system:kube-controller-manager |                     |
| scheduler.conf          | default-scheduler          | system:kube-scheduler          |                     |

<!--
The value of `<nodeName>` for `kubelet.conf` **must** match precisely the value of the node name provided by the kubelet as it registers with the apiserver. For further details, read the [Node Authorization](/docs/reference/access-authn-authz/node/).
-->
{{< note >}}
`kubelet.conf` 中 `<nodeName>` 的值 **必須** 與 kubelet 向 apiserver 註冊時提供的節點名稱的值完全匹配。
有關更多詳細資訊，請閱讀[節點授權](/zh-cn/docs/reference/access-authn-authz/node/)。
{{< /note >}}

<!--
1. For each config, generate an x509 cert/key pair with the given CN and O.

1. Run `kubectl` as follows for each config:
-->
1. 對於每個配置，請都使用給定的 CN 和 O 生成 x509 證書/金鑰偶對。

1. 為每個配置執行下面的 `kubectl` 命令：

```shell
KUBECONFIG=<filename> kubectl config set-cluster default-cluster --server=https://<host ip>:6443 --certificate-authority <path-to-kubernetes-ca> --embed-certs
KUBECONFIG=<filename> kubectl config set-credentials <credential-name> --client-key <path-to-key>.pem --client-certificate <path-to-cert>.pem --embed-certs
KUBECONFIG=<filename> kubectl config set-context default-system --cluster default-cluster --user <credential-name>
KUBECONFIG=<filename> kubectl config use-context default-system
```

<!--
These files are used as follows:

| filename                | command                 | comment                                                               |
|-------------------------|-------------------------|-----------------------------------------------------------------------|
| admin.conf              | kubectl                 | Configures administrator user for the cluster                                      |
| kubelet.conf            | kubelet                 | One required for each node in the cluster.                            |
| controller-manager.conf | kube-controller-manager | Must be added to manifest in `manifests/kube-controller-manager.yaml` |
| scheduler.conf          | kube-scheduler          | Must be added to manifest in `manifests/kube-scheduler.yaml`          |
-->
這些檔案用途如下：

| 檔名                   | 命令                     | 說明                                                                  |
|-------------------------|-------------------------|-----------------------------------------------------------------------|
| admin.conf              | kubectl                 | 配置叢集的管理員                                                         |
| kubelet.conf            | kubelet                 | 叢集中的每個節點都需要一份                                                 |
| controller-manager.conf | kube-controller-manager | 必需新增到 `manifests/kube-controller-manager.yaml` 清單中               |
| scheduler.conf          | kube-scheduler          | 必需新增到 `manifests/kube-scheduler.yaml` 清單中                        |

<!--
The following files illustrate full paths to the files listed in the previous table:
-->
下面是前表中所列檔案的完整路徑。

```console
/etc/kubernetes/admin.conf
/etc/kubernetes/kubelet.conf
/etc/kubernetes/controller-manager.conf
/etc/kubernetes/scheduler.conf
```
