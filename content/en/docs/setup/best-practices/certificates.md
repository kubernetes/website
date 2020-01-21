---
title: PKI certificates and requirements
reviewers:
- sig-cluster-lifecycle
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

KubernetesはTLS認証のためにPKI証明書を必要とします。
[kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm/)を使ってKubernetesでクラスタを構築しているのであれば、必要な証明は自動で生成されます。
必要であれば自分自身で証明書を作ることも可能です(例えば、証明書をよりセキュアに扱いたいためにAPIサーバの中に証明書を保持したくない場合など)
このページではクラスタが必要とする証明書について説明します。

{{% /capture %}}

{{% capture body %}}

## クラスタではどのように証明書が使われているのか

Kubernetesでは以下の操作にPKIを必要とします

* クライアント証明
  * kubeletを用いたAPIサーバの認証
  * クラスタ管理者のAPIサーバの認証
  * APIサーバのkubeletsとの通信
  * APIサーバのetcdとの通信
  * [front-proxy][proxy]
* サーバ証明
  * APIサーバのエンドポイント操作
  * [front-proxy][proxy]
* クライアント証明とkubeconfig
  * コントローラマネージャのAPIサーバとの通信
  * スケジューラのAPIサーバとの通信

{{< note >}}
 [an extension api server](/docs/tasks/access-kubernetes-api/setup-extension-api-server/)を使うためにkube-proxyを動かしている場合のみfront-proxyが必要になります。
{{< /note >}}

etcdはクライアントとピアの認証のために相互TLSも実装しています

## 証明書の保存場所

Kubernetesクラスタをkubeadmで構築しているのであれば証明書は/etc/kubernetes/pkiに保存されています。
このページのパスは全て上記の位置からの相対パスで示してあります。

## 手動で証明書を設定する

もし手動で証明書を作成したいのであれば以下のいずれかの手順を踏むことで作成することも出来ます。

### 単一ルート認証局

管理者による単一ルート認証局を作成することも可能です。
単一ルート認証局は複数の中間認証局作り、以降のKubernetesの作成を委任することも出来ます。

必要な認証局

| path                   | Default CN                | description                      |
|------------------------|---------------------------|----------------------------------|
| ca.crt,key             | kubernetes-ca             | Kubernetes general CA            |
| etcd/ca.crt,key        | etcd-ca                   | For all etcd-related functions   |
| front-proxy-ca.crt,key | kubernetes-front-proxy-ca | For the [front-end proxy][proxy] |

On top of the above CAs, it is also necessary to get a public/private key pair for service account management, `sa.key` and `sa.pub`.

### 全ての証明書

もし秘密鍵をAPIサーバにコピーしたくなければ、あなた自身で証明書を作成することも出来ます。

必要な証明書

| Default CN                    | Parent CA                 | O (in Subject) | kind                                   | hosts (SAN)                                 |
|-------------------------------|---------------------------|----------------|----------------------------------------|---------------------------------------------|
| kube-etcd                     | etcd-ca                   |                | server, client                         | `localhost`, `127.0.0.1`                        |
| kube-etcd-peer                | etcd-ca                   |                | server, client                         | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-healthcheck-client  | etcd-ca                   |                | client                                 |                                             |
| kube-apiserver-etcd-client    | etcd-ca                   | system:masters | client                                 |                                             |
| kube-apiserver                | kubernetes-ca             |                | server                                 | `<hostname>`, `<Host_IP>`, `<advertise_IP>`, `[1]` |
| kube-apiserver-kubelet-client | kubernetes-ca             | system:masters | client                                 |                                             |
| front-proxy-client            | kubernetes-front-proxy-ca |                | client                                 |                                             |

[1]: any other IP or DNS name you contact your cluster on (as used by [kubeadm][kubeadm] the load balancer stable IP and/or DNS name, `kubernetes`, `kubernetes.default`, `kubernetes.default.svc`,
`kubernetes.default.svc.cluster`, `kubernetes.default.svc.cluster.local`)

where `kind` maps to one or more of the [x509 key usage][usage] types:

| kind   | Key usage                                                                       |
|--------|---------------------------------------------------------------------------------|
| server | digital signature, key encipherment, server auth                                |
| client | digital signature, key encipherment, client auth                                |

{{< note >}}
Hosts/SAN listed above are the recommended ones for getting a working cluster; if required by a specific setup, it is possible to add additional SANs on all the server certificates.
{{< /note >}}

{{< note >}}
For kubeadm users only:

* The scenario where you are copying to your cluster CA certificates without private keys is referred as external CA in the kubeadm documentation.
* If you are comparing the above list with a kubeadm geneerated PKI, please be aware that `kube-etcd`, `kube-etcd-peer` and `kube-etcd-healthcheck-client` certificates
  are not generated in case of external etcd.

{{< /note >}}

### 証明書のパス

Certificates should be placed in a recommended path (as used by [kubeadm][kubeadm]). Paths should be specified using the given argument regardless of location.

| Default CN                   | recommended key path         | recommended cert path       | command        | key argument                 | cert argument                             |
|------------------------------|------------------------------|-----------------------------|----------------|------------------------------|-------------------------------------------|
| etcd-ca                      |     etcd/ca.key                         | etcd/ca.crt                 | kube-apiserver |                              | --etcd-cafile                             |
| etcd-client                  | apiserver-etcd-client.key    | apiserver-etcd-client.crt   | kube-apiserver | --etcd-keyfile               | --etcd-certfile                           |
| kubernetes-ca                |    ca.key                          | ca.crt                      | kube-apiserver |                              | --client-ca-file                          |
| kubernetes-ca                |    ca.key                          | ca.crt                      | kube-controller-manager | --cluster-signing-key-file      | --client-ca-file, --root-ca-file, --cluster-signing-cert-file  |
| kube-apiserver               | apiserver.key                | apiserver.crt               | kube-apiserver | --tls-private-key-file       | --tls-cert-file                           |
| apiserver-kubelet-client     |     apiserver-kubelet-client.key                         | apiserver-kubelet-client.crt| kube-apiserver | --kubelet-client-key | --kubelet-client-certificate              |
| front-proxy-ca               |     front-proxy-ca.key                         | front-proxy-ca.crt          | kube-apiserver |                              | --requestheader-client-ca-file            |
| front-proxy-ca               |     front-proxy-ca.key                         | front-proxy-ca.crt          | kube-controller-manager |                              | --requestheader-client-ca-file |
| front-proxy-client           | front-proxy-client.key       | front-proxy-client.crt      | kube-apiserver | --proxy-client-key-file      | --proxy-client-cert-file                  |
| etcd-ca                      |         etcd/ca.key                     | etcd/ca.crt                 | etcd           |                              | --trusted-ca-file, --peer-trusted-ca-file |
| kube-etcd                    | etcd/server.key              | etcd/server.crt             | etcd           | --key-file                   | --cert-file                               |
| kube-etcd-peer               | etcd/peer.key                | etcd/peer.crt               | etcd           | --peer-key-file              | --peer-cert-file                          |
| etcd-ca                      |                              | etcd/ca.crt                 | etcdctl    |                              | --cacert                                  |
| kube-etcd-healthcheck-client | etcd/healthcheck-client.key  | etcd/healthcheck-client.crt | etcdctl     | --key                        | --cert                                    |

Same considerations apply for the service account key pair:

| private key path             | public key path             | command                 | argument                             |
|------------------------------|-----------------------------|-------------------------|--------------------------------------|
|  sa.key                      |                             | kube-controller-manager | service-account-private              |
|                              | sa.pub                      | kube-apiserver          | service-account-key                  |

## ユーザアカウント用に証明書を設定する

You must manually configure these administrator account and service accounts:

| filename                | credential name            | Default CN                     | O (in Subject) |
|-------------------------|----------------------------|--------------------------------|----------------|
| admin.conf              | default-admin              | kubernetes-admin               | system:masters |
| kubelet.conf            | default-auth               | system:node:`<nodeName>` (see note) | system:nodes   |
| controller-manager.conf | default-controller-manager | system:kube-controller-manager |                |
| scheduler.conf          | default-manager            | system:kube-scheduler          |                |

{{< note >}}
The value of `<nodeName>` for `kubelet.conf` **must** match precisely the value of the node name provided by the kubelet as it registers with the apiserver. For further details, read the [Node Authorization](/docs/reference/access-authn-authz/node/).
{{< /note >}}

1. For each config, generate an x509 cert/key pair with the given CN and O.

1. Run `kubectl` as follows for each config:

```shell
KUBECONFIG=<filename> kubectl config set-cluster default-cluster --server=https://<host ip>:6443 --certificate-authority <path-to-kubernetes-ca> --embed-certs
KUBECONFIG=<filename> kubectl config set-credentials <credential-name> --client-key <path-to-key>.pem --client-certificate <path-to-cert>.pem --embed-certs
KUBECONFIG=<filename> kubectl config set-context default-system --cluster default-cluster --user <credential-name>
KUBECONFIG=<filename> kubectl config use-context default-system
```

These files are used as follows:

| filename                | command                 | comment                                                               |
|-------------------------|-------------------------|-----------------------------------------------------------------------|
| admin.conf              | kubectl                 | Configures administrator user for the cluster                                      |
| kubelet.conf            | kubelet                 | One required for each node in the cluster.                            |
| controller-manager.conf | kube-controller-manager | Must be added to manifest in `manifests/kube-controller-manager.yaml` |
| scheduler.conf          | kube-scheduler          | Must be added to manifest in `manifests/kube-scheduler.yaml`          |

[usage]: https://godoc.org/k8s.io/api/certificates/v1beta1#KeyUsage
[kubeadm]: /docs/reference/setup-tools/kubeadm/kubeadm/
[proxy]: /docs/tasks/access-kubernetes-api/configure-aggregation-layer/

{{% /capture %}}
