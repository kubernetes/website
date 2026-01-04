---
title: PKI 證書和要求
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
Kubernetes 需要 PKI 證書才能進行基於 TLS 的身份驗證。如果你是使用
[kubeadm](/zh-cn/docs/reference/setup-tools/kubeadm/) 安裝的 Kubernetes，
則會自動生成叢集所需的證書。
你也可以自己生成證書 --- 例如，不將私鑰儲存在 API 伺服器上，
可以讓私鑰更加安全。此頁面說明了叢集必需的證書。

<!-- body -->

<!--
## How certificates are used by your cluster

Kubernetes requires PKI for the following operations:
-->
## 叢集是如何使用證書的    {#how-certificates-are-used-by-your-cluster}

Kubernetes 需要 PKI 才能執行以下操作：

<!--
### Server certificates

* Server certificate for the API server endpoint
* Server certificate for the etcd server
* [Server certificates](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#client-and-serving-certificates)
  for each kubelet (every {{< glossary_tooltip text="node" term_id="node" >}} runs a kubelet)
* Optional server certificate for the [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)
-->
### 伺服器證書   {#server-certificates}

* API 伺服器端點的證書
* etcd 伺服器的伺服器證書
* 每個 kubelet 的伺服器證書（每個{{< glossary_tooltip text="節點" term_id="node" >}}運行一個 kubelet）
* 可選的[前端代理](/zh-cn/docs/tasks/extend-kubernetes/configure-aggregation-layer/)的伺服器證書

<!--
### Client certificates
-->
### 客戶端證書   {#client-certificates}

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
* 針對每個 kubelet 的客戶端證書，用於 API 伺服器作爲 Kubernetes API 的客戶端進行身份驗證
* 每個 API 伺服器的客戶端證書，用於向 etcd 進行身份驗證
* 控制器管理器與 API 伺服器進行安全通信的客戶端證書
* 調度程式與 API 伺服器進行安全通信的客戶端證書
* 客戶端證書（每個節點一個），用於 kube-proxy 向 API 伺服器進行身份驗證
* 叢集管理員向 API 伺服器進行身份驗證的可選客戶端證書
* [前端代理](/zh-cn/docs/tasks/extend-kubernetes/configure-aggregation-layer/)的可選客戶端證書

<!--
### Kubelet's server and client certificates

To establish a secure connection and authenticate itself to the kubelet, the API Server
requires a client certificate and key pair.
-->
### kubelet 的伺服器和客戶端證書   {#kubelets-server-and-client-certificates}

爲了建立安全連接並向 kubelet 進行身份驗證，API 伺服器需要客戶端證書和密鑰對。

<!--
In this scenario, there are two approaches for certificate usage:

* Shared Certificates: The kube-apiserver can utilize the same certificate and key pair it uses
  to authenticate its clients. This means that the existing certificates, such as `apiserver.crt`
  and `apiserver.key`, can be used for communicating with the kubelet servers.

* Separate Certificates: Alternatively, the kube-apiserver can generate a new client certificate
  and key pair to authenticate its communication with the kubelet servers. In this case,
  a distinct certificate named `kubelet-client.crt` and its corresponding private key,
  `kubelet-client.key` are created.
-->
在此場景中，證書的使用有兩種方法：

* 共享證書：kube-apiserver 可以使用與驗證其客戶端相同的證書和密鑰對。
  這意味着現有證書（例如 `apiserver.crt` 和 `apiserver.key`）可用於與 kubelet 伺服器進行通信。

* 單獨的證書：或者，kube-apiserver 可以生成新的客戶端證書和密鑰對，以驗證其與 kubelet 伺服器的通信。
  在這種情況下，將創建一個名爲 `kubelet-client.crt` 的不同證書及其對應的私鑰 `kubelet-client.key`。

{{< note >}}
<!--
`front-proxy` certificates are required only if you run kube-proxy to support
[an extension API server](/docs/tasks/extend-kubernetes/setup-extension-api-server/).
-->
只有當你運行 kube-proxy
並要支持[擴展 API 伺服器](/zh-cn/docs/tasks/extend-kubernetes/setup-extension-api-server/)時，
才需要 `front-proxy` 證書。
{{< /note >}}

<!--
etcd also implements mutual TLS to authenticate clients and peers.
-->
etcd 還實現了雙向 TLS 來對客戶端和對其他對等節點進行身份驗證。

<!--
## Where certificates are stored

If you install Kubernetes with kubeadm, most certificates are stored in `/etc/kubernetes/pki`.
All paths in this documentation are relative to that directory, with the exception of user account
certificates which kubeadm places in `/etc/kubernetes`.
-->
## 證書儲存位置    {#where-certificates-are-stored}

假如你通過 kubeadm 安裝 Kubernetes，大多數證書會被儲存在 `/etc/kubernetes/pki` 中。
本文檔中的所有路徑都是相對於該目錄的，但使用者賬號證書除外，kubeadm 將其放在 `/etc/kubernetes` 中。

<!--
## Configure certificates manually

If you don't want kubeadm to generate the required certificates, you can create them using a
single root CA or by providing all certificates. See [Certificates](/docs/tasks/administer-cluster/certificates/)
for details on creating your own certificate authority. See
[Certificate Management with kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)
for more on managing certificates.
-->
## 手動設定證書    {#configure-certificates-manually}

如果你不想通過 kubeadm 生成所需證書，你可以使用一個單根 CA 來創建這些證書，或者直接提供所有證書。
參見[證書](/zh-cn/docs/tasks/administer-cluster/certificates/)以進一步瞭解如何創建自己的證書授權機構。
更多關於管理證書的資訊，請參閱[使用 kubeadm 進行證書管理](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)。

<!--
### Single root CA

You can create a single root CA, controlled by an administrator. This root CA can then create
multiple intermediate CAs, and delegate all further creation to Kubernetes itself.
-->
### 單根 CA    {#single-root-ca}

你可以創建由管理員控制的單根 CA。這個根 CA 可以創建多箇中間 CA，
並將所有進一步的創建委託給 Kubernetes 本身。

<!--
Required CAs:

| Path                   | Default CN                | Description                      |
|------------------------|---------------------------|----------------------------------|
| ca.crt,key             | kubernetes-ca             | Kubernetes general CA            |
| etcd/ca.crt,key        | etcd-ca                   | For all etcd-related functions   |
| front-proxy-ca.crt,key | kubernetes-front-proxy-ca | For the [front-end proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) |

On top of the above CAs, it is also necessary to get a public/private key pair for service account
management, `sa.key` and `sa.pub`.
The following example illustrates the CA key and certificate files shown in the previous table:
-->
需要這些 CA：

| 路徑                    | 預設 CN                    | 描述                             |
|------------------------|---------------------------|----------------------------------|
| ca.crt、key             | kubernetes-ca             | Kubernetes 通用 CA                |
| etcd/ca.crt、key        | etcd-ca                   | 與 etcd 相關的所有功能              |
| front-proxy-ca.crt、key | kubernetes-front-proxy-ca | 用於[前端代理](/zh-cn/docs/tasks/extend-kubernetes/configure-aggregation-layer/) |

上面的 CA 之外，還需要獲取用於服務賬號管理的密鑰對，也就是 `sa.key` 和 `sa.pub`。
下面的例子說明了上表中所示的 CA 密鑰和證書檔案。

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

如果你不想將 CA 的私鑰拷貝至你的叢集中，你也可以自己生成全部的證書。

需要這些證書：

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
| 預設 CN                       | 父級 CA                    |O（位於 Subject 中）| kind             | 主機（SAN）                                           |
|-------------------------------|---------------------------|-------------------|------------------|-----------------------------------------------------|
| kube-etcd                     | etcd-ca                   |                   | server、client   | `<hostname>`、`<Host_IP>`、`localhost`、`127.0.0.1` |
| kube-etcd-peer                | etcd-ca                   |                   | server、client   | `<hostname>`、`<Host_IP>`、`localhost`、`127.0.0.1` |
| kube-etcd-healthcheck-client  | etcd-ca                   |                   | client           |                                                     |
| kube-apiserver-etcd-client    | etcd-ca                   |                   | client           |                                                     |
| kube-apiserver                | kubernetes-ca             |                   | server           | `<hostname>`、`<Host_IP>`、`<advertise_IP>`[^1]  |
| kube-apiserver-kubelet-client | kubernetes-ca             | system:masters    | client           |                                                     |
| front-proxy-client            | kubernetes-front-proxy-ca |                   | client           |                                                     |

{{< note >}}
<!--
Instead of using the super-user group `system:masters` for `kube-apiserver-kubelet-client`
a less privileged group can be used. kubeadm uses the `kubeadm:cluster-admins` group for
that purpose.
-->
不使用超級使用者組 `system:masters` 來控制 `kube-apiserver-kubelet-client`，
可以使用一個權限較低的組。kubeadm 使用 `kubeadm:cluster-admins` 組來達到這個目的。
{{< /note >}}

<!--
[^1]: any other IP or DNS name you contact your cluster on (as used by [kubeadm](/docs/reference/setup-tools/kubeadm/)
the load balancer stable IP and/or DNS name, `kubernetes`, `kubernetes.default`, `kubernetes.default.svc`,
`kubernetes.default.svc.cluster`, `kubernetes.default.svc.cluster.local`)

where `kind` maps to one or more of the x509 key usage, which is also documented in the
`.spec.usages` of a [CertificateSigningRequest](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1#CertificateSigningRequest)
type:
-->
[^1]: 用來連接到叢集的不同 IP 或 DNS 名稱
（就像 [kubeadm](/zh-cn/docs/reference/setup-tools/kubeadm/) 爲負載均衡所使用的固定
IP 或 DNS 名稱：`kubernetes`、`kubernetes.default`、`kubernetes.default.svc`、
`kubernetes.default.svc.cluster`、`kubernetes.default.svc.cluster.local`）。

其中 `kind` 對應一種或多種類型的 x509 密鑰用途，也可記錄在
[CertificateSigningRequest](/zh-cn/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1#CertificateSigningRequest)
類型的 `.spec.usages` 中：

<!--
| kind   | Key usage                                                                       |
|--------|---------------------------------------------------------------------------------|
| server | digital signature, key encipherment, server auth                                |
| client | digital signature, key encipherment, client auth                                |
-->
| kind   | 密鑰用途                                                                         |
|--------|---------------------------------------------------------------------------------|
| server | 數字簽名、密鑰加密、服務端認證                                                     |
| client | 數字簽名、密鑰加密、客戶端認證                                                     |

{{< note >}}
<!--
Hosts/SAN listed above are the recommended ones for getting a working cluster; if required by a
specific setup, it is possible to add additional SANs on all the server certificates.
-->
上面列出的 Host/SAN 是獲取工作叢集的推薦設定方式；
如果需要特殊安裝，則可以在所有伺服器證書上添加其他 SAN。
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
對於 kubeadm 使用者：

* 不使用私鑰並將證書複製到叢集 CA 的方案，在 kubeadm 文檔中將這種方案稱爲外部 CA。
* 如果將上表與 kubeadm 生成的 PKI 進行比較，你會注意到，如果使用外部 etcd，則不會生成
  `kube-etcd`、`kube-etcd-peer` 和 `kube-etcd-healthcheck-client` 證書。

{{< /note >}}

<!--
### Certificate paths

Certificates should be placed in a recommended path (as used by [kubeadm](/docs/reference/setup-tools/kubeadm/)).
Paths should be specified using the given argument regardless of location.
-->
### 證書路徑    {#certificate-paths}

證書應放置在建議的路徑中（以便 [kubeadm](/zh-cn/docs/reference/setup-tools/kubeadm/)
使用）。無論使用什麼位置，都應使用給定的參數指定路徑。

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
| 預設 CN | 建議的密鑰路徑 | 建議的證書路徑 | 命令 | 密鑰參數 | 證書參數 |
|---------|-------------|--------------|-----|--------|---------|
| etcd-ca | etcd/ca.key | etcd/ca.crt | kube-apiserver | | --etcd-cafile |
| kube-apiserver-etcd-client | apiserver-etcd-client.key | apiserver-etcd-client.crt | kube-apiserver | --etcd-keyfile | --etcd-certfile |
| kubernetes-ca | ca.key | ca.crt | kube-apiserver | | --client-ca-file |
| kubernetes-ca | ca.key | ca.crt | kube-controller-manager | --cluster-signing-key-file | --client-ca-file, --root-ca-file, --cluster-signing-cert-file |
| kube-apiserver | apiserver.key | apiserver.crt | kube-apiserver | --tls-private-key-file | --tls-cert-file |
| kube-apiserver-kubelet-client | apiserver-kubelet-client.key | apiserver-kubelet-client.crt| kube-apiserver | --kubelet-client-key | --kubelet-client-certificate |
| front-proxy-ca | front-proxy-ca.key | front-proxy-ca.crt | kube-apiserver | | --requestheader-client-ca-file |
| front-proxy-ca | front-proxy-ca.key | front-proxy-ca.crt | kube-controller-manager | | --requestheader-client-ca-file |
| front-proxy-client | front-proxy-client.key | front-proxy-client.crt | kube-apiserver | --proxy-client-key-file | --proxy-client-cert-file |
| etcd-ca | etcd/ca.key | etcd/ca.crt | etcd | | --trusted-ca-file, --peer-trusted-ca-file |
| kube-etcd | etcd/server.key | etcd/server.crt | etcd | --key-file | --cert-file |
| kube-etcd-peer | etcd/peer.key | etcd/peer.crt | etcd | --peer-key-file | --peer-cert-file |
| etcd-ca | | etcd/ca.crt | etcdctl | | --cacert |
| kube-etcd-healthcheck-client | etcd/healthcheck-client.key | etcd/healthcheck-client.crt | etcdctl | --key | --cert |

<!--
Same considerations apply for the service account key pair:
-->
注意事項同樣適用於服務賬號密鑰對：

<!--
| private key path  | public key path  | command                 | argument                             |
|-------------------|------------------|-------------------------|--------------------------------------|
|  sa.key           |                  | kube-controller-manager | --service-account-private-key-file   |
|                   | sa.pub           | kube-apiserver          | --service-account-key-file           |
-->
| 私鑰路徑           | 公鑰路徑         | 命令                     | 參數                                 |
|-------------------|------------------|-------------------------|--------------------------------------|
|  sa.key           |                  | kube-controller-manager | --service-account-private-key-file   |
|                   | sa.pub           | kube-apiserver          | --service-account-key-file           |

<!--
The following example illustrates the file paths [from the previous tables](#certificate-paths)
you need to provide if you are generating all of your own keys and certificates:
-->
下面的例子展示了自行生成所有密鑰和證書時所需要提供的檔案路徑。
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
## 爲使用者賬號設定證書    {#configure-certificates-for-user-accounts}

你必須手動設定以下管理員賬號和服務賬號：

<!--
| Filename                | Credential name            | Default CN                          | O (in Subject)         |
|-------------------------|----------------------------|-------------------------------------|------------------------|
| admin.conf              | default-admin              | kubernetes-admin                    | `<admin-group>`        |
| super-admin.conf        | default-super-admin        | kubernetes-super-admin              | system:masters         |
| kubelet.conf            | default-auth               | system:node:`<nodeName>` (see note) | system:nodes           |
| controller-manager.conf | default-controller-manager | system:kube-controller-manager      |                        |
| scheduler.conf          | default-scheduler          | system:kube-scheduler               |                        |
-->
| 檔案名                   | 憑據名稱                   | 預設 CN                             | O (位於 Subject 中)     |
|-------------------------|----------------------------|-------------------------------------|------------------------|
| admin.conf              | default-admin              | kubernetes-admin                    | `<admin-group>`        |
| super-admin.conf        | default-super-admin        | kubernetes-super-admin              | system:masters         |
| kubelet.conf            | default-auth               | system:node:`<nodeName>`（參閱註釋） | system:nodes           |
| controller-manager.conf | default-controller-manager | system:kube-controller-manager      |                        |
| scheduler.conf          | default-scheduler          | system:kube-scheduler               |                        |

{{< note >}}
<!--
The value of `<nodeName>` for `kubelet.conf` **must** match precisely the value of the node name
provided by the kubelet as it registers with the apiserver. For further details, read the
[Node Authorization](/docs/reference/access-authn-authz/node/).
-->
`kubelet.conf` 中 `<nodeName>` 的值**必須**與 kubelet 向 apiserver 註冊時提供的節點名稱的值完全匹配。
有關更多詳細資訊，請閱讀[節點授權](/zh-cn/docs/reference/access-authn-authz/node/)。
{{< /note >}}

{{< note >}}
<!--
In the above example `<admin-group>` is implementation specific. Some tools sign the
certificate in the default `admin.conf` to be part of the `system:masters` group.
`system:masters` is a break-glass, super user group can bypass the authorization
layer of Kubernetes, such as RBAC. Also some tools do not generate a separate
`super-admin.conf` with a certificate bound to this super user group.
-->
在上面的例子中，`<admin-group>` 是實現特定的。
一些工具在預設的 `admin.conf` 中籤署證書，以成爲 `system:masters` 組的一部分。
`system:masters` 是一個緊急情況下的超級使用者組，可以繞過 Kubernetes 的授權層，如 RBAC。
另外，某些工具不會生成單獨的 `super-admin.conf` 將證書綁定到這個超級使用者組。

<!--
kubeadm generates two separate administrator certificates in kubeconfig files.
One is in `admin.conf` and has `Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`.
`kubeadm:cluster-admins` is a custom group bound to the `cluster-admin` ClusterRole.
This file is generated on all kubeadm managed control plane machines.
-->
kubeadm 在 kubeconfig 檔案中生成兩個單獨的管理員證書。
一個是在 `admin.conf` 中，帶有 `Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`。
`kubeadm:cluster-admins` 是綁定到 `cluster-admin` ClusterRole 的自定義組。
這個檔案在所有由 kubeadm 管理的控制平面機器上生成。

<!--
Another is in `super-admin.conf` that has `Subject: O = system:masters, CN = kubernetes-super-admin`.
This file is generated only on the node where `kubeadm init` was called.
-->
另一個是在 `super-admin.conf` 中，具有 `Subject: O = system:masters, CN = kubernetes-super-admin`。
這個檔案只在調用了 `kubeadm init` 的節點上生成。
{{< /note >}}

<!--
1. For each configuration, generate an x509 certificate/key pair with the
   given Common Name (CN) and Organization (O).

1. Run `kubectl` as follows for each configuration:
-->
1. 對於每個設定，請都使用給定的通用名稱（CN）和組織（O）生成 x509 證書/密鑰對。

1. 爲每個設定運行下面的 `kubectl` 命令：

   <!--
   ```
   KUBECONFIG=<filename> kubectl config set-cluster default-cluster --server=https://<host ip>:6443 --certificate-authority <path-to-kubernetes-ca> --embed-certs
   KUBECONFIG=<filename> kubectl config set-credentials <credential-name> --client-key <path-to-key>.pem --client-certificate <path-to-cert>.pem --embed-certs
   KUBECONFIG=<filename> kubectl config set-context default-system --cluster default-cluster --user <credential-name>
   KUBECONFIG=<filename> kubectl config use-context default-system
   ```
   -->
   ```bash
   KUBECONFIG=<文件名> kubectl config set-cluster default-cluster --server=https://<主機ip>:6443 --certificate-authority <kubernetes-ca路徑> --embed-certs
   KUBECONFIG=<文件名> kubectl config set-credentials <憑據名稱> --client-key <密鑰路徑>.pem --client-certificate <證書路徑>.pem --embed-certs
   KUBECONFIG=<文件名> kubectl config set-context default-system --cluster default-cluster --user <憑據名稱>
   KUBECONFIG=<文件名> kubectl config use-context default-system
   ```

<!--
These files are used as follows:

| Filename                | Command                 | Comment                                                               |
|-------------------------|-------------------------|-----------------------------------------------------------------------|
| admin.conf              | kubectl                 | Configures administrator user for the cluster                         |
| super-admin.conf        | kubectl                 | Configures super administrator user for the cluster                   |
| kubelet.conf            | kubelet                 | One required for each node in the cluster.                            |
| controller-manager.conf | kube-controller-manager | Must be added to manifest in `manifests/kube-controller-manager.yaml` |
| scheduler.conf          | kube-scheduler          | Must be added to manifest in `manifests/kube-scheduler.yaml`          |
-->
這些檔案用途如下：

| 檔案名                   | 命令                     | 說明                                                                 |
|-------------------------|-------------------------|-----------------------------------------------------------------------|
| admin.conf              | kubectl                 | 設定叢集的管理員                                                        |
| super-admin.conf        | kubectl                 | 爲叢集設定超級管理員使用者                                                 |
| kubelet.conf            | kubelet                 | 叢集中的每個節點都需要一份                                               |
| controller-manager.conf | kube-controller-manager | 必須添加到 `manifests/kube-controller-manager.yaml` 清單中              |
| scheduler.conf          | kube-scheduler          | 必須添加到 `manifests/kube-scheduler.yaml` 清單中                       |

<!--
The following files illustrate full paths to the files listed in the previous table:
-->
下面是前表中所列檔案的完整路徑。

```console
/etc/kubernetes/admin.conf
/etc/kubernetes/super-admin.conf
/etc/kubernetes/kubelet.conf
/etc/kubernetes/controller-manager.conf
/etc/kubernetes/scheduler.conf
```
