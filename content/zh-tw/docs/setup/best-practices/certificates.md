---
title: PKI 憑證與需求
content_type: concept
weight: 50
---
<!--
---
title: PKI certificates and requirements
reviewers:
- sig-cluster-lifecycle
content_type: concept
weight: 50
---
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
Kubernetes 需要 PKI 憑證來透過 TLS 進行身份驗證。
如果您使用 [kubeadm](/zh-tw/docs/reference/setup-tools/kubeadm/) 安裝 Kubernetes，
叢集所需的憑證會自動產生。您也可以自行產生憑證 —— 例如，為了提升私鑰安全性而不將它儲存在 API 伺服器上。
本頁面說明了您的叢集所需的各類憑證。

<!-- body -->

<!--
## How certificates are used by your cluster
-->
## 憑證在您的叢集中的使用方式 {#how-certificates-are-used-by-your-cluster}

<!--
Kubernetes requires PKI for the following operations:
-->
Kubernetes 在進行下列操作時，需要使用 PKI：

<!--
### Server certificates
-->
### 伺服器憑證 {#server-certificates}

<!--
* Server certificate for the API server endpoint
* Server certificate for the etcd server
* [Server certificates](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#client-and-serving-certificates)
  for each kubelet (every {{< glossary_tooltip text="node" term_id="node" >}} runs a kubelet)
* Optional server certificate for the [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)
-->
* API 伺服器端點的伺服器憑證
* etcd 伺服器的伺服器憑證
* 每個 kubelet 的[伺服器憑證](/zh-tw/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#client-and-serving-certificates)
  （每個{{< glossary_tooltip text="節點" term_id="node" >}}上都會執行 kubelet）
* [前端代理伺服器（front-proxy）](/zh-tw/docs/tasks/extend-kubernetes/configure-aggregation-layer/)伺服器端憑證（選用）

<!--
### Client certificates
-->
### 用戶端憑證 {#client-certificates}

<!--
* Client certificates for each kubelet, used to authenticate to the API server as a client of
  the Kubernetes API
* Client certificate for each API server, used to authenticate to etcd
* Client certificate for the controller manager to securely communicate with the API server
* Client certificate for the scheduler to securely communicate with the API server
* Client certificates, one for each node, for kube-proxy to authenticate to the API server
* Optional client certificates for administrators of the cluster to authenticate to the API server
* Optional client certificate for the [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)
-->
* 每個 kubelet 的用戶端憑證，用於以 Kubernetes API 用戶端的身分向 API 伺服器進行身分驗證
* 每個 API 伺服器的用戶端憑證，用於向 etcd 進行身份驗證
* 控制器管理器的用戶端憑證，用於與 API 伺服器進行安全通訊
* 排程器的用戶端憑證，用於與 API 伺服器進行安全通訊
* 每個節點各一個用戶端憑證，讓 kube-proxy 向 API 伺服器進行身份驗證
* 供叢集管理員用於向 API 伺服器進行身分驗證的用戶端憑證（選用）
* [前端代理伺服器](/zh-tw/docs/tasks/extend-kubernetes/configure-aggregation-layer/)的用戶端憑證（選用）

<!--
### Kubelet's server and client certificates
-->
### Kubelet 的伺服器與用戶端憑證 {#kubelets-server-and-client-certificates}

<!--
To establish a secure connection and authenticate itself to the kubelet, the API Server
requires a client certificate and key pair.
-->
為了建立安全連線並向 kubelet 驗證其身分，API 伺服器需要一組用戶端憑證與金鑰對。

<!--
In this scenario, there are two approaches for certificate usage:
-->
在此情境下，憑證的使用有兩種做法：

<!--
* Shared Certificates: The kube-apiserver can utilize the same certificate and key pair it uses
  to authenticate its clients. This means that the existing certificates, such as `apiserver.crt`
  and `apiserver.key`, can be used for communicating with the kubelet servers.
-->
* 共用憑證：kube-apiserver 可以使用與其驗證用戶端時相同的憑證與金鑰對。
  這意味著現有的憑證，例如 `apiserver.crt` 與 `apiserver.key` 可被用於與 kubelet 伺服器通訊。

<!--
* Separate Certificates: Alternatively, the kube-apiserver can generate a new client certificate
  and key pair to authenticate its communication with the kubelet servers. In this case,
  a distinct certificate named `kubelet-client.crt` and its corresponding private key,
  `kubelet-client.key` are created.
-->
* 獨立憑證：另一種做法是，kube-apiserver 可以產生一組新的用戶端憑證與金鑰對，
  用於驗證其與 kubelet 伺服器之間的通訊。在此情況下，
  會建立名為 `kubelet-client.crt` 的專屬憑證及其對應的私鑰 `kubelet-client.key`。

{{< note >}}
<!--
`front-proxy` certificates are required only if you run kube-proxy to support
[an extension API server](/docs/tasks/extend-kubernetes/setup-extension-api-server/).
-->
只有在您執行 kube-proxy 來支援[擴展 API 伺服器](/zh-tw/docs/tasks/extend-kubernetes/setup-extension-api-server/)的情況下，
才需要前端代理的憑證。
{{< /note >}}

<!--
etcd also implements mutual TLS to authenticate clients and peers.
-->
etcd 也實作了雙向 TLS 來驗證用戶端與對等節點。

<!--
## Where certificates are stored
-->
## 憑證的儲存位置 {#where-certificates-are-stored}

<!--
If you install Kubernetes with kubeadm, most certificates are stored in `/etc/kubernetes/pki`.
All paths in this documentation are relative to that directory, with the exception of user account
certificates which kubeadm places in `/etc/kubernetes`.
-->
如果您使用 kubeadm 安裝 Kubernetes，大部分的憑證都會儲存在 `/etc/kubernetes/pki`。
本文件中的所有路徑皆相對於此目錄，除了 kubeadm 放在 `/etc/kubernetes` 中的使用者帳號憑證之外。

<!--
## Configure certificates manually
-->
## 手動設定憑證 {#configure-certificates-manually}

<!--
If you don't want kubeadm to generate the required certificates, you can create them using a
single root CA or by providing all certificates. See [Certificates](/docs/tasks/administer-cluster/certificates/)
for details on creating your own certificate authority. See
[Certificate Management with kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)
for more on managing certificates.
-->
如果您不希望由 kubeadm 產生所需的憑證，您可以使用單一根 CA（Root CA）來建立憑證，或是提供所有憑證。
關於建立自有憑證授權機構的詳細資訊，請參閱[憑證](/zh-tw/docs/tasks/administer-cluster/certificates/)。
若要深入了解如何管理憑證，請參閱[使用 kubeadm 管理憑證](/zh-tw/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)。

<!--
### Single root CA
-->
### 單一的根 CA {#single-root-ca}

<!--
You can create a single root CA, controlled by an administrator. This root CA can then create
multiple intermediate CAs, and delegate all further creation to Kubernetes itself.

Required CAs:
-->
您可以建立一個由管理員控管的單一根 CA。此根 CA 可再建立多個中間 CA，
並將後續所有的憑證建立工作委派給 Kubernetes 本身。

所需的 CA 如下：

<!--
| Path                   | Default CN                | Description                      |
|------------------------|---------------------------|----------------------------------|
| ca.crt,key             | kubernetes-ca             | Kubernetes general CA            |
| etcd/ca.crt,key        | etcd-ca                   | For all etcd-related functions   |
| front-proxy-ca.crt,key | kubernetes-front-proxy-ca | For the [front-end proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) |
-->
| 路徑                   | 預設 CN                   | 說明                             |
|------------------------|---------------------------|----------------------------------|
| ca.crt,key             | kubernetes-ca             | Kubernetes 通用 CA               |
| etcd/ca.crt,key        | etcd-ca                   | 用於所有與 etcd 相關的功能       |
| front-proxy-ca.crt,key | kubernetes-front-proxy-ca | 用於[前端代理](/zh-tw/docs/tasks/extend-kubernetes/configure-aggregation-layer/) |

<!--
On top of the above CAs, it is also necessary to get a public/private key pair for service account
management, `sa.key` and `sa.pub`.
The following example illustrates the CA key and certificate files shown in the previous table:
-->
除了上述的 CA 之外，還需要一組用於服務帳號（Service Account）管理的公鑰/私鑰對，
即 `sa.key` 與 `sa.pub`。以下範例展示了前表中所列的 CA 私鑰及憑證檔案：

```
/etc/kubernetes/pki/ca.crt
/etc/kubernetes/pki/ca.key
/etc/kubernetes/pki/etcd/ca.crt
/etc/kubernetes/pki/etcd/ca.key
/etc/kubernetes/pki/front-proxy-ca.crt
/etc/kubernetes/pki/front-proxy-ca.key
```

<!--
### All certificates
-->
### 所有憑證 {#all-certificates}

<!--
If you don't wish to copy the CA private keys to your cluster, you can generate all certificates yourself.

Required certificates:
-->
如果您不希望將 CA 私鑰複製到您的叢集中，您可以自行產生所有憑證。

所需的憑證如下：

<!--
| Default CN                    | Parent CA                 | O (in Subject) | kind             | hosts (SAN)                                         |
|-------------------------------|---------------------------|----------------|------------------|-----------------------------------------------------|
| kube-etcd                     | etcd-ca                   |                | server, client   | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-peer                | etcd-ca                   |                | server, client   | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-healthcheck-client  | etcd-ca                   |                | client           |                                                     |
| kube-apiserver-etcd-client    | etcd-ca                   |                | client           |                                                     |
| kube-apiserver                | kubernetes-ca             |                | server           | `<hostname>`, `<Host_IP>`, `<advertise_IP>`[^1]     |
| kube-apiserver-kubelet-client | kubernetes-ca             | system:masters | client           |                                                     |
| front-proxy-client            | kubernetes-front-proxy-ca |                | client           |                                                     |
-->
| 預設 CN                       | 上級 CA                   | O（Subject 欄位）| 類型             | 主機（SAN）                                         |
|-------------------------------|---------------------------|------------------|------------------|-----------------------------------------------------|
| kube-etcd                     | etcd-ca                   |                  | server, client   | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-peer                | etcd-ca                   |                  | server, client   | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-healthcheck-client  | etcd-ca                   |                  | client           |                                                     |
| kube-apiserver-etcd-client    | etcd-ca                   |                  | client           |                                                     |
| kube-apiserver                | kubernetes-ca             |                  | server           | `<hostname>`, `<Host_IP>`, `<advertise_IP>`[^1]     |
| kube-apiserver-kubelet-client | kubernetes-ca             | system:masters   | client           |                                                     |
| front-proxy-client            | kubernetes-front-proxy-ca |                  | client           |                                                     |

{{< note >}}
<!--
Instead of using the super-user group `system:masters` for `kube-apiserver-kubelet-client`
a less privileged group can be used. kubeadm uses the `kubeadm:cluster-admins` group for
that purpose.
-->
與其為 kube-apiserver-kubelet-client 使用 `system:masters` 超級使用者群組，
也可以改用權限較低的群組。kubeadm 出於此目的使用了 `kubeadm:cluster-admins` 群組。
{{< /note >}}

<!--
[^1]: any other IP or DNS name you contact your cluster on (as used by [kubeadm](/docs/reference/setup-tools/kubeadm/)
the load balancer stable IP and/or DNS name, `kubernetes`, `kubernetes.default`, `kubernetes.default.svc`,
`kubernetes.default.svc.cluster`, `kubernetes.default.svc.cluster.local`)
-->
[^1]: 任何其他您用來連線至叢集的 IP 或 DNS 名稱（
例如 [kubeadm](/zh-tw/docs/reference/setup-tools/kubeadm/) 所使用的負載平衡器固定 IP 與/或 DNS 名稱，
以及 `kubernetes`、`kubernetes.default`、`kubernetes.default.svc`、`kubernetes.default.svc.cluster`、`kubernetes.default.svc.cluster.local`）。

<!--
where `kind` maps to one or more of the x509 key usage, which is also documented in the
`.spec.usages` of a [CertificateSigningRequest](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1#CertificateSigningRequest)
type:
-->
其中 `kind` 對應到一或多個 x509 金鑰用途（key usage），
這在 [CertificateSigningRequest](/zh-tw/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1#CertificateSigningRequest) 類型的 `.spec.usages` 欄位中也有詳細說明：

<!--
| kind   | Key usage                                                                       |
|--------|---------------------------------------------------------------------------------|
| server | digital signature, key encipherment, server auth                                |
| client | digital signature, key encipherment, client auth                                |
-->
| 類型   | 金鑰用途                                                                        |
|--------|---------------------------------------------------------------------------------|
| 伺服器 | digital signature, key encipherment, server auth                                |
| 用戶端 | digital signature, key encipherment, client auth                                |

{{< note >}}
<!--
Hosts/SAN listed above are the recommended ones for getting a working cluster; if required by a
specific setup, it is possible to add additional SANs on all the server certificates.
-->
上文列出的主機（SAN）是為了確保叢集正常運作而建議的配置；
若特定設定需要，也可以在所有伺服器憑證中加上額外的 SAN。
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
僅適用於 kubeadm 使用者：

* kubeadm 文件將只複製不含私鑰的 CA 憑證到叢集的做法稱為外部 CA。
* 如果您正在將上述清單與 kubeadm 產生的 PKI 進行比較，請注意在外部 etcd 的情況下，
  系統不會產生 `kube-etcd`、`kube-etcd-peer` 與 `kube-etcd-healthcheck-client` 憑證。

{{< /note >}}

<!--
### Certificate paths
-->
### 憑證路徑 {#certificate-paths}

<!--
Certificates should be placed in a recommended path (as used by [kubeadm](/docs/reference/setup-tools/kubeadm/)).
Paths should be specified using the given argument regardless of location.
-->
憑證應放置在建議的路徑中（就像 [kubeadm](/zh-tw/docs/reference/setup-tools/kubeadm/) 所用的）。
不論實際位置為何，都應透過參數明確指定路徑。

<!--
| DefaultCN | recommendedkeypath | recommendedcertpath | command | keyargument | certargument |
| --------- | ------------------ | ------------------- | ------- | ----------- | ------------ |
| etcd-ca | etcd/ca.key | etcd/ca.crt | kube-apiserver | | --etcd-cafile |
| kube-apiserver-etcd-client | apiserver-etcd-client.key | apiserver-etcd-client.crt | kube-apiserver | --etcd-keyfile | --etcd-certfile |
| kubernetes-ca | ca.key | ca.crt | kube-apiserver | | --client-ca-file |
| kubernetes-ca | ca.key | ca.crt | kube-controller-manager | --cluster-signing-key-file | --client-ca-file,--root-ca-file,--cluster-signing-cert-file |
| kube-apiserver | apiserver.key | apiserver.crt| kube-apiserver | --tls-private-key-file | --tls-cert-file |
| kube-apiserver-kubelet-client | apiserver-kubelet-client.key | apiserver-kubelet-client.crt | kube-apiserver | --kubelet-client-key | --kubelet-client-certificate |
| front-proxy-ca | front-proxy-ca.key | front-proxy-ca.crt | kube-apiserver | | --requestheader-client-ca-file |
| front-proxy-ca | front-proxy-ca.key | front-proxy-ca.crt | kube-controller-manager | | --requestheader-client-ca-file |
| front-proxy-client | front-proxy-client.key | front-proxy-client.crt | kube-apiserver | --proxy-client-key-file | --proxy-client-cert-file |
| etcd-ca | etcd/ca.key | etcd/ca.crt | etcd | | --trusted-ca-file,--peer-trusted-ca-file |
| kube-etcd | etcd/server.key | etcd/server.crt | etcd | --key-file | --cert-file |
| kube-etcd-peer | etcd/peer.key | etcd/peer.crt | etcd | --peer-key-file | --peer-cert-file |
| etcd-ca| | etcd/ca.crt | etcdctl | | --cacert |
| kube-etcd-healthcheck-client | etcd/healthcheck-client.key | etcd/healthcheck-client.crt | etcdctl | --key | --cert |
-->
| 預設 CN | 建議金鑰路徑 | 建議憑證路徑 | 指令 | 金鑰參數 | 憑證參數 |
| ------- | ------------ | ------------ | ---- | -------- | -------- |
| etcd-ca | etcd/ca.key | etcd/ca.crt | kube-apiserver | | --etcd-cafile |
| kube-apiserver-etcd-client | apiserver-etcd-client.key | apiserver-etcd-client.crt | kube-apiserver | --etcd-keyfile | --etcd-certfile |
| kubernetes-ca | ca.key | ca.crt | kube-apiserver | | --client-ca-file |
| kubernetes-ca | ca.key | ca.crt | kube-controller-manager | --cluster-signing-key-file | --client-ca-file,--root-ca-file,--cluster-signing-cert-file |
| kube-apiserver | apiserver.key | apiserver.crt| kube-apiserver | --tls-private-key-file | --tls-cert-file |
| kube-apiserver-kubelet-client | apiserver-kubelet-client.key | apiserver-kubelet-client.crt | kube-apiserver | --kubelet-client-key | --kubelet-client-certificate |
| front-proxy-ca | front-proxy-ca.key | front-proxy-ca.crt | kube-apiserver | | --requestheader-client-ca-file |
| front-proxy-ca | front-proxy-ca.key | front-proxy-ca.crt | kube-controller-manager | | --requestheader-client-ca-file |
| front-proxy-client | front-proxy-client.key | front-proxy-client.crt | kube-apiserver | --proxy-client-key-file | --proxy-client-cert-file |
| etcd-ca | etcd/ca.key | etcd/ca.crt | etcd | | --trusted-ca-file,--peer-trusted-ca-file |
| kube-etcd | etcd/server.key | etcd/server.crt | etcd | --key-file | --cert-file |
| kube-etcd-peer | etcd/peer.key | etcd/peer.crt | etcd | --peer-key-file | --peer-cert-file |
| etcd-ca| | etcd/ca.crt | etcdctl | | --cacert |
| kube-etcd-healthcheck-client | etcd/healthcheck-client.key | etcd/healthcheck-client.crt | etcdctl | --key | --cert |

<!--
Same considerations apply for the service account key pair:
-->
同樣的考量也適用於服務帳號的金鑰對：

<!--
| private key path  | public key path  | command                 | argument                             |
|-------------------|------------------|-------------------------|--------------------------------------|
|  sa.key           |                  | kube-controller-manager | --service-account-private-key-file   |
|                   | sa.pub           | kube-apiserver          | --service-account-key-file           |
-->
| 私鑰路徑 | 公鑰路徑 | 指令                    | 參數                                 |
|----------|----------|-------------------------|--------------------------------------|
| sa.key   |          | kube-controller-manager | --service-account-private-key-file   |
|          | sa.pub   | kube-apiserver          | --service-account-key-file           |

<!--
The following example illustrates the file paths [from the previous tables](#certificate-paths)
you need to provide if you are generating all of your own keys and certificates:
-->
以下範例說明[先前表格](#certificate-paths)中的檔案路徑，
如果您是自行產生所有的金鑰與憑證，則需要提供這些檔案：

```
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
-->
## 配置使用者帳號的憑證 {#configure-certificates-for-user-accounts}

<!--
You must manually configure these administrator accounts and service accounts:
-->
您必須手動配置這些管理員帳號與服務帳號：

<!--
| Filename                | Credential name            | Default CN                          | O (in Subject)         |
|-------------------------|----------------------------|-------------------------------------|------------------------|
| admin.conf              | default-admin              | kubernetes-admin                    | `<admin-group>`        |
| super-admin.conf        | default-super-admin        | kubernetes-super-admin              | system:masters         |
| kubelet.conf            | default-auth               | system:node:`<nodeName>` (see note) | system:nodes           |
| controller-manager.conf | default-controller-manager | system:kube-controller-manager      |                        |
| scheduler.conf          | default-scheduler          | system:kube-scheduler               |                        |
-->
| 檔案名稱                | 認證名稱                   | 預設 CN                             | O（Subject 欄位）      |
|-------------------------|----------------------------|-------------------------------------|------------------------|
| admin.conf              | default-admin              | kubernetes-admin                    | `<admin-group>`        |
| super-admin.conf        | default-super-admin        | kubernetes-super-admin              | system:masters         |
| kubelet.conf            | default-auth               | system:node:`<nodeName>` (see note) | system:nodes           |
| controller-manager.conf | default-controller-manager | system:kube-controller-manager      |                        |
| scheduler.conf          | default-scheduler          | system:kube-scheduler               |                        |

{{< note >}}
<!--
The value of `<nodeName>` for `kubelet.conf` **must** match precisely the value of the node name
provided by the kubelet as it registers with the apiserver. For further details, read the
[Node Authorization](/docs/reference/access-authn-authz/node/).
-->
`kubelet.conf` 的 `<nodeName>` 值**必須**與 kubelet 向 apiserver 註冊時提供的節點名稱完全符合。
想了解更多細節，請參閱[節點授權](/zh-tw/docs/reference/access-authn-authz/node/)。
{{< /note >}}

{{< note >}}
<!--
In the above example `<admin-group>` is implementation specific. Some tools sign the
certificate in the default `admin.conf` to be part of the `system:masters` group.
`system:masters` is a break-glass, super user group can bypass the authorization
layer of Kubernetes, such as RBAC. Also some tools do not generate a separate
`super-admin.conf` with a certificate bound to this super user group.
-->
在上述範例中，`<admin-group>` 會因實作而異。
某些工具會在預設的 `admin.conf` 中將憑證簽署為 `system:masters` 群組的一部分。
`system:masters` 是一個用於緊急情況的 break-glass 超級使用者群組，
可以繞過 Kubernetes 的授權層（例如 RBAC）。
此外，某些工具不會產生一個獨立且憑證綁定在此超級使用者群組的 `super-admin.conf`。

<!--
kubeadm generates two separate administrator certificates in kubeconfig files.
One is in `admin.conf` and has `Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`.
`kubeadm:cluster-admins` is a custom group bound to the `cluster-admin` ClusterRole.
This file is generated on all kubeadm managed control plane machines.
-->
kubeadm 在 kubeconfig 檔案中產生兩個獨立的管理員憑證。
其中一個位於 `admin.conf`，並具有 `Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`。
`kubeadm:cluster-admins` 是一個綁定至 `cluster-admin` ClusterRole 的自訂群組。
此檔案是在所有由 kubeadm 管理的控制平面主機上產生的。

<!--
Another is in `super-admin.conf` that has `Subject: O = system:masters, CN = kubernetes-super-admin`.
This file is generated only on the node where `kubeadm init` was called.
-->
另一個位於 `super-admin.conf`，具有 `Subject: O = system:masters, CN = kubernetes-super-admin`。
此檔案僅在呼叫 `kubeadm init` 的節點上產生。
{{< /note >}}

<!--
1. For each configuration, generate an x509 certificate/key pair with the
   given Common Name (CN) and Organization (O).

1. Run `kubectl` as follows for each configuration:
-->
1. 對於每項配置，產生一個具有給定通用名稱（CN）與組織（O）的 x509 憑證/金鑰對。

1. 為每項配置按照以下方式執行 `kubectl`：

   ```
   KUBECONFIG=<filename> kubectl config set-cluster default-cluster --server=https://<host ip>:6443 --certificate-authority <path-to-kubernetes-ca> --embed-certs
   KUBECONFIG=<filename> kubectl config set-credentials <credential-name> --client-key <path-to-key>.pem --client-certificate <path-to-cert>.pem --embed-certs
   KUBECONFIG=<filename> kubectl config set-context default-system --cluster default-cluster --user <credential-name>
   KUBECONFIG=<filename> kubectl config use-context default-system
   ```

<!--
These files are used as follows:
-->
這些檔案按照以下方式使用：

<!--
| Filename                | Command                 | Comment                                                               |
|-------------------------|-------------------------|-----------------------------------------------------------------------|
| admin.conf              | kubectl                 | Configures administrator user for the cluster                         |
| super-admin.conf        | kubectl                 | Configures super administrator user for the cluster                   |
| kubelet.conf            | kubelet                 | One required for each node in the cluster.                            |
| controller-manager.conf | kube-controller-manager | Must be added to manifest in `manifests/kube-controller-manager.yaml` |
| scheduler.conf          | kube-scheduler          | Must be added to manifest in `manifests/kube-scheduler.yaml`          |
-->
| 檔案名稱                | 指令                    | 說明                                                                  |
|-------------------------|-------------------------|----------------------------------------------------------------|
| admin.conf              | kubectl                 | 配置叢集的管理員使用者                                         |
| super-admin.conf        | kubectl                 | 配置叢集的超級管理員使用者                                     |
| kubelet.conf            | kubelet                 | 叢集中的每個節點都需要一個                                     |
| controller-manager.conf | kube-controller-manager | 必須新增至 `manifests/kube-controller-manager.yaml` 中的設定檔 |
| scheduler.conf          | kube-scheduler          | 必須新增至 `manifests/kube-scheduler.yaml` 中的設定檔          |

<!--
The following files illustrate full paths to the files listed in the previous table:
-->
以下列出前述表格中各檔案的完整路徑：

```
/etc/kubernetes/admin.conf
/etc/kubernetes/super-admin.conf
/etc/kubernetes/kubelet.conf
/etc/kubernetes/controller-manager.conf
/etc/kubernetes/scheduler.conf
```