---
title: PKI証明書とその要件
content_type: concept
weight: 50
---

<!-- overview -->

Kubernetesでは、TLS認証のためにPKI証明書が必要です。
[kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm/)でKubernetesをインストールする場合、必要な証明書は自動で生成されます。
自身で証明書を作成することも可能です。例えば、秘密鍵をAPIサーバーに保持しないことで、管理をよりセキュアにする場合が挙げられます。
本ページでは、クラスターに必要な証明書について説明します。

<!-- body -->

## クラスターではどのように証明書が使われているのか

Kubernetesは下記の用途でPKIを必要とします:

* kubeletがAPIサーバーの認証をするためのクライアント証明書
* APIサーバーがkubeletと通信するためのkubeletの[サーバー証明書](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#client-and-serving-certificates)
* APIサーバーのエンドポイント用サーバー証明書
* クラスターの管理者がAPIサーバーの認証を行うためのクライアント証明書
* APIサーバーがkubeletと通信するためのクライアント証明書
* APIサーバーがetcdと通信するためのクライアント証明書
* controller managerがAPIサーバーと通信するためのクライアント証明書およびkubeconfig
* スケジューラーがAPIサーバーと通信するためのクライアント証明書およびkubeconfig
* [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)用のクライアント証明書およびサーバー証明書

{{< note >}}
`front-proxy`証明書は、[Kubernetes APIの拡張](/docs/tasks/extend-kubernetes/setup-extension-api-server/)をサポートするためにkube-proxyを実行する場合のみ必要です。
{{< /note >}}

さらに、etcdはクライアントおよびピア間の認証に相互TLS通信を実装しています。

## 証明書の保存場所

kubeadmを使用してKubernetesをインストールする場合、ほとんどの証明書は`/etc/kubernetes/pki`に保存されます。このドキュメントの全てのパスは、そのディレクトリの相対パスを表します。
ただしユーザーアカウントの証明書に関しては、kubeadmは`/etc/kubernetes`に配置します。

## 手動で証明書を設定する

もしkubeadmに必要な証明書の生成を望まない場合、それらを単一ルート認証局を使って作成するか、全ての証明書を提供することで作成できます。
自身の認証局を作成する詳細については、[証明書を手動で生成する](/ja/docs/tasks/administer-cluster/certificates/)を参照してください。
証明書の管理についての詳細は、[kubeadmによる証明書管理](/ja/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)を参照してください。

### 単一ルート認証局

管理者によりコントロールされた、単一ルート認証局の作成が可能です。このルート認証局は複数の中間認証局を作る事が可能で、作成はKubernetes自身に委ねます。

必要な認証局:

| パス                    | デフォルトCN                | 説明                             |
|------------------------|---------------------------|----------------------------------|
| ca.crt,key             | kubernetes-ca             | Kubernetes全体の認証局　　　        |
| etcd/ca.crt,key        | etcd-ca                   | etcd用　　　　　　　　　　　　　　   |
| front-proxy-ca.crt,key | kubernetes-front-proxy-ca | [front-end proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)用　　　 |

上記の認証局に加えて、サービスアカウント管理用に公開鍵/秘密鍵のペア(`sa.key`と`sa.pub`)を取得する事が必要です。
次の例は、前の表で示されたCAのキーと証明書を示しています:

```
/etc/kubernetes/pki/ca.crt
/etc/kubernetes/pki/ca.key
/etc/kubernetes/pki/etcd/ca.crt
/etc/kubernetes/pki/etcd/ca.key
/etc/kubernetes/pki/front-proxy-ca.crt
/etc/kubernetes/pki/front-proxy-ca.key
```

### 全ての証明書

CAの秘密鍵をクラスターにコピーしたくない場合、自身で全ての証明書を作成できます。

必要な証明書:

| デフォルトCN                    | 親認証局                   | 組織 　　　　　　| 種類                                   | ホスト名 (SAN)                                          |
|-------------------------------|---------------------------|----------------|----------------------------------------|-----------------------------------------------------|
| kube-etcd                     | etcd-ca                   |                | server, client                         | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-peer                | etcd-ca                   |                | server, client                         | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-healthcheck-client  | etcd-ca                   |                | client                                 |                                                     |
| kube-apiserver-etcd-client    | etcd-ca                   |                | client                                 |                                                     |
| kube-apiserver                | kubernetes-ca             |                | server                                 | `<hostname>`, `<Host_IP>`, `<advertise_IP>`, `[1]`  |
| kube-apiserver-kubelet-client | kubernetes-ca             | system:masters | client                                 |                                                     |
| front-proxy-client            | kubernetes-front-proxy-ca |                | client                                 |                                                     |

{{< note >}}
`kube-apiserver-kubelet-client`にスーパーユーザーグループ`system:masters`を使用する代わりに、より権限の低いグループを使用することができます。
そのために、kubeadmは`kubeadm:cluster-admins`グループを使用します。
{{< /note >}}

[1]: クラスターに接続するIPおよびDNS名( [kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm/)を使用する場合と同様、ロードバランサーのIPおよびDNS名、`kubernetes`、`kubernetes.default`、`kubernetes.default.svc`、`kubernetes.default.svc.cluster`、`kubernetes.default.svc.cluster.local`)

ここで`種類`は、一つまたは複数のx509の鍵用途にマッピングされており、これは[CertificateSigningRequest](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1#CertificateSigningRequest)の`.spec.usages`にも記載されています:

| 種類   | 鍵の用途  　　　                                                                     |
|--------|---------------------------------------------------------------------------------|
| server | digital signature, key encipherment, server auth                                |
| client | digital signature, key encipherment, client auth                                |

{{< note >}}
上記に挙げられたホスト名(SAN)は、クラスターを動作させるために推奨されるものです。
特別なセットアップが求められる場合、全てのサーバー証明書にSANを追加する事ができます。
{{< /note >}}

{{< note >}}
kubeadm利用者のみ:

* 秘密鍵なしでCA証明書をクラスターにコピーするシナリオは、kubeadmドキュメントの外部認証局の項目で言及されています。
* kubeadmでPKIを生成すると、`kube-etcd`、`kube-etcd-peer`および `kube-etcd-healthcheck-client`証明書は外部etcdを利用するケースでは生成されない事に留意してください。

{{< /note >}}

### 証明書のパス {#certificate-paths}

証明書は推奨パスに配置するべきです([kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm/)を使用する場合と同様)。
パスは場所に関係なく与えられた引数で特定されます。

| デフォルトCN                   | 鍵の推奨パス        　　　　　　 | 証明書の推奨パス    　　　　　   | コマンド        | 鍵を指定する引数               | 証明書を指定する引数                          |
|------------------------------|------------------------------|-----------------------------|----------------|------------------------------|-------------------------------------------|
| etcd-ca                      |     etcd/ca.key                         | etcd/ca.crt                 | kube-apiserver |                              | --etcd-cafile                             |
| kube-apiserver-etcd-client                  | apiserver-etcd-client.key    | apiserver-etcd-client.crt   | kube-apiserver | --etcd-keyfile               | --etcd-certfile                           |
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

サービスアカウント用の鍵ペアについても同様です。

| 秘密鍵のパス 　　　　            |　公開鍵のパス 　　　           | コマンド                 | 引数                             |
|------------------------------|-----------------------------|-------------------------|--------------------------------------|
|  sa.key                      |                             | kube-controller-manager | service-account-private              |
|                              | sa.pub                      | kube-apiserver          | service-account-key                  |

次の例は、自分自身で全てのキーと証明書を生成している場合に提供する必要があるファイルパスを[前の表](#certificate-paths)から示しています:

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

## ユーザーアカウント用に証明書を設定する

管理者アカウントおよびサービスアカウントは手動で設定しなければなりません。

| ファイル名                | クレデンシャル名            | デフォルトCN                          | O (in Subject)         |
|-------------------------|----------------------------|-------------------------------------|------------------------|
| admin.conf              | default-admin              | kubernetes-admin                    | `<admin-group>`        |
| super-admin.conf        | default-super-admin        | kubernetes-super-admin              | system:masters         |
| kubelet.conf            | default-auth               | system:node:`<nodeName>` (備考を参照) | system:nodes           |
| controller-manager.conf | default-controller-manager | system:kube-controller-manager      |                        |
| scheduler.conf          | default-scheduler          | system:kube-scheduler               |                        |

{{< note >}}
`kubelet.conf`における`<nodeName>`の値は**必ず**APIサーバーに登録されたkubeletのノード名と一致しなければなりません。詳細は、[Node Authorization](/docs/reference/access-authn-authz/node/)を参照してください。
{{< /note >}}

{{< note >}}
上記の例での`<admin-group>`は実装に依存します。
一部のツールはデフォルトの`admin.conf`内の証明書に`system:masters`グループの一部として署名します。
`system:masters`は緊急用のスーパーユーザーグループであり、RBACのようなKubernetesの認証レイヤーをバイパスすることができます。
また、一部のツールはこのスーパーユーザーグループに紐づけられた証明書を含む`super-admin.conf`を生成しません。

kubeadmはkubeconfigファイル内に2つの別々の管理者証明書を生成します。
一つは`admin.conf`内にあり、`Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`となっています。
`kubeadm:cluster-admins`は`cluster-admin` ClusterRoleに紐づけられたカスタムグループです。
このファイルは、kubeadmが管理する全てのコントロールプレーンマシン上で生成されます。

もう一つは`super-admin.conf`内にあり、`Subject: O = system:masters, CN = kubernetes-super-admin`となっています。
このファイルは`kubeadm init`が呼び出されたノード上でのみ生成されます。
{{< /note >}}

1. 各コンフィグ毎に、CN名と組織を指定してx509証明書と鍵ペアを生成してください。

2. 以下のように、各コンフィグで`kubectl`を実行してください。

```shell
KUBECONFIG=<filename> kubectl config set-cluster default-cluster --server=https://<host ip>:6443 --certificate-authority <path-to-kubernetes-ca> --embed-certs
KUBECONFIG=<filename> kubectl config set-credentials <credential-name> --client-key <path-to-key>.pem --client-certificate <path-to-cert>.pem --embed-certs
KUBECONFIG=<filename> kubectl config set-context default-system --cluster default-cluster --user <credential-name>
KUBECONFIG=<filename> kubectl config use-context default-system
```

これらのファイルは以下のように利用されます:

| ファイル名                | コマンド                 | コメント                                                               |
|-------------------------|-------------------------|-----------------------------------------------------------------------|
| admin.conf              | kubectl                 | クラスターの管理者設定用                                     |
| kubelet.conf            | kubelet                 | クラスターの各ノードに1つ必要です。                            |
| controller-manager.conf | kube-controller-manager | `manifests/kube-controller-manager.yaml`のマニフェストファイルに追記する必要があります。 |
| scheduler.conf          | kube-scheduler          | `manifests/kube-scheduler.yaml`のマニフェストファイルに追記する必要があります。          |

以下のファイルは、前の表に挙げたファイルへの絶対パスを示しています:

```
/etc/kubernetes/admin.conf
/etc/kubernetes/super-admin.conf
/etc/kubernetes/kubelet.conf
/etc/kubernetes/controller-manager.conf
/etc/kubernetes/scheduler.conf
```
