---
title: kubeadmによる証明書管理
content_type: task
weight: 80
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.15" state="stable" >}}

[kubeadm](/docs/reference/setup-tools/kubeadm/)で生成されたクライアント証明書は1年で失効します。
このページでは、kubeadmで証明書の更新を管理する方法について説明します。
また、kubeadmによる証明書管理に関連するタスクも説明します。

Kubernetesプロジェクトでは、最新のパッチリリースに速やかにアップグレードし、サポートされているKubernetesのマイナーリリースを実行していることを推奨しています。
この推奨事項に従うことで、セキュリティを維持できます。

## {{% heading "prerequisites" %}}

[KubernetesにおけるPKI証明書と要件](/docs/setup/best-practices/certificates/)を熟知している必要があります。

kubeadmコマンドに対して、[kubeadmの設定](/docs/reference/config-api/kubeadm-config.v1beta4/)ファイルを渡す方法について熟知している必要があります。

本ページでは`openssl`コマンド(手動で証明書に署名する場合に使用)の使用方法について説明しますが、他のツールで代用することもできます。

ここで紹介する手順の一部では、管理者アクセスに`sudo`を使用していますが、同等のツールを使用しても構いません。

<!-- steps -->

## カスタム証明書の使用 {#custom-certificates}

デフォルトでは、kubeadmはクラスターの実行に必要なすべての証明書を生成します。
独自の証明書を提供することで、この動作をオーバーライドできます。

そのためには、`--cert-dir`フラグまたはkubeadmの`ClusterConfiguration`の`certificatesDir`フィールドで指定された任意のディレクトリに配置する必要があります。
デフォルトは`/etc/kubernetes/pki`です。

`kubeadm init`を実行する前に既存の証明書と秘密鍵のペアが存在する場合、kubeadmはそれらを上書きしません。
つまり、例えば既存のCAを`/etc/kubernetes/pki/ca.crt`と`/etc/kubernetes/pki/ca.key`にコピーすれば、kubeadmは残りの証明書に署名する際、このCAを使用できます。

## 暗号化アルゴリズムの選択 {#choosing-encryption-algorithm}

kubeadmでは、公開鍵や秘密鍵を作成する際に暗号化アルゴリズムを選択できます。
設定するには、kubeadmの設定ファイルにて`encryptionAlgorithm`フィールドを使用します。

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
encryptionAlgorithm: <ALGORITHM>
```

`<ALGORITHM>`は、`RSA-2048`(デフォルト)、`RSA-3072`、`RSA-4096`、`ECDSA-P256`が選択できます。

## 証明書の有効期間の選択 {#choosing-cert-validity-period}

kubeadmでは、CAおよびリーフ証明書の有効期間を選択可能です。
設定するには、kubeadmの設定ファイルにて、`certificateValidityPeriod`、`caCertificateValidityPeriod`フィールドを使用します。

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
certificateValidityPeriod: 8760h # デフォルト: 365日 × 24時間 = 1年
caCertificateValidityPeriod: 87600h # デフォルト: 365日 × 24時間 * 10 = 10年
```

フィールドの値は、[Go言語の`time.Duration`の値](https://pkg.go.dev/time#ParseDuration)で許容される形式に準拠しており、サポートされている最長単位は`h`(時間)です。

## 外部CAモード {#external-ca-mode}

また、`ca.crt`ファイルのみを提供し、`ca.key`ファイルを提供しないことも可能です(これはルートCAファイルのみに有効で、他の証明書ペアには有効ではありません)。
他の証明書とkubeconfigファイルがすべて揃っている場合、kubeadmはこの状態を認識し、「外部CA」モードを有効にします。
kubeadmはディスク上のCAキーがなくても処理を進めます。

代わりに、`--controllers=csrsigner`を使用してController-managerをスタンドアロンで実行し、CA証明書と鍵を指定します。

外部CAモードを使用する場合、コンポーネントの資格情報を作成する方法がいくつかあります。

### 手動によるコンポーネント資格情報の作成

[PKI証明書とその要件](/docs/setup/best-practices/certificates/)には、kubeadmコンポーネントに必要な全ての資格情報を手動で作成する方法が記載されています。

本ページでは`openssl`コマンド(手動で証明書を署名する場合に使用)の使用方法について説明しますが、他のツールを代用することもできます。

### kubeadmによって生成されたCSRへの署名による資格情報の作成

kubeadmは、`openssl`のようなツールと外部CAを使用して手動で署名可能な[CSRファイルの生成](#signing-csr)ができます。
これらのCSRファイルには、kubeadmによってデプロイされるコンポーネントに必要な資格情報の全ての仕様が含まれます。

### kubeadm phaseを使用したコンポーネント資格情報の自動作成

もしくは、kubeadm phaseコマンドを使用して、これらのプロセスを自動化することが可能です。

- kubeadmコントロールプレーンノードとして外部CAを用いて構築するホストに対し、アクセスします。
- 外部CAの`ca.crt`と`ca.key`ファイルを、ノードの`/etc/kubernetes/pki`へコピーします。
- `kubeadm init`で使用する、`config.yaml`という一時的な[kubeadmの設定ファイル](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file)を準備します。
このファイルには、`ClusterConfiguration.controlPlaneEndpoint`、`ClusterConfiguration.certSANs`、`InitConfiguration.APIEndpoint`など、証明書に含まれる可能性のある、クラスター全体またはホスト固有の関連情報が全て記載されていることを確認します。
- 同じホストで`kubeadm init phase kubeconfig all --config config.yaml`および`kubeadm init phase certs all --config config.yaml`コマンドを実行します。
これにより、必要な全てのkubeconfigファイルと証明書が`/etc/kubernetes/`配下および`pki`サブディレクトリ配下に作成されます。
- 作成されたファイルを調べます。`/etc/kubernetes/pki/ca.key`を削除し、`/etc/kubernetes/super-admin.conf`を削除するか、安全な場所に退避します。
- `kubeadm join`を実行するノードでは、`/etc/kubernetes/kubelet.conf`も削除します。
このファイルは`kubeadm init`が実行される最初のノードでのみ必要とされます。
- `pki/sa.*`、`pki/front-proxy-ca.*`、`pki/etc/ca.*`等のファイルは、コントロールプレーンノード間で共有されます。
`kubeadm join`を実行するノードに[手動で証明書を配布する](/docs/setup/production-environment/tools/kubeadm/high-availability/#manual-certs)か、`kubeadm init`の[`--upload-certs`](/docs/setup/production-environment/tools/kubeadm/high-availability/#stacked-control-plane-and-etcd-nodes)オプションおよび`kubeadm join`の`--certificate-key`オプションを使用することでこれらを自動配布します。

全てのノードにて資格情報を準備した後、これらのノードをクラスターに参加させるために`kubeadm init`および`kubeadm join`を実行します。
kubeadmは`/etc/kubernetes/`および`pki`サブディレクトリ配下に存在するkubeconfigと証明書を使用します。

## 証明書の有効期限と管理 {#check-certificate-expiration}

{{< note >}}
`kubeadm`は、外部CAによって署名された証明書を管理することができません。
{{< /note >}}

`check-expiration`サブコマンドを使うと、証明書の有効期限を確認することができます。

```shell
kubeadm certs check-expiration
```

このような出力になります:

```console
CERTIFICATE                EXPIRES                  RESIDUAL TIME   CERTIFICATE AUTHORITY   EXTERNALLY MANAGED
admin.conf                 Dec 30, 2020 23:36 UTC   364d                                    no
apiserver                  Dec 30, 2020 23:36 UTC   364d            ca                      no
apiserver-etcd-client      Dec 30, 2020 23:36 UTC   364d            etcd-ca                 no
apiserver-kubelet-client   Dec 30, 2020 23:36 UTC   364d            ca                      no
controller-manager.conf    Dec 30, 2020 23:36 UTC   364d                                    no
etcd-healthcheck-client    Dec 30, 2020 23:36 UTC   364d            etcd-ca                 no
etcd-peer                  Dec 30, 2020 23:36 UTC   364d            etcd-ca                 no
etcd-server                Dec 30, 2020 23:36 UTC   364d            etcd-ca                 no
front-proxy-client         Dec 30, 2020 23:36 UTC   364d            front-proxy-ca          no
scheduler.conf             Dec 30, 2020 23:36 UTC   364d                                    no

CERTIFICATE AUTHORITY   EXPIRES                  RESIDUAL TIME   EXTERNALLY MANAGED
ca                      Dec 28, 2029 23:36 UTC   9y              no
etcd-ca                 Dec 28, 2029 23:36 UTC   9y              no
front-proxy-ca          Dec 28, 2029 23:36 UTC   9y              no
```

このコマンドは、`/etc/kubernetes/pki`フォルダー内のクライアント証明書と、kubeadmが使用するkubeconfigファイル(`admin.conf`、`controller-manager.conf`、`scheduler.conf`)に埋め込まれたクライアント証明書の有効期限/残余時間を表示します。

また、証明書が外部管理されている場合、kubeadmはユーザーに通知します。この場合、ユーザーは証明書の更新を手動または他のツールを使用して管理する必要があります。

kubeadmは`/var/lib/kubelet/pki`配下にあるローテーション可能な証明書でkubeletの[証明書の自動更新](/docs/tasks/tls/certificate-rotation/)を構成するため、`kubelet.conf`は上記のリストに含まれません。
期限切れのkubeletクライアント証明書を修復するには、[kubeletクライアント証明書のローテーションに失敗する](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#kubelet-client-cert)を参照ください。

{{< note >}}
kubeadm version 1.17より前の`kubeadm init`で作成したノードでは、`kubelet.conf`の内容を手動で変更しなければならないという[バグ](https://github.com/kubernetes/kubeadm/issues/1753)が存在します。
`kubeadm init`が終了したら、`client-certificate-data`と`client-key-data`を置き換えて、ローテーションされたkubeletクライアント証明書を指すように`kubelet.conf`を更新してください。

```yaml
client-certificate: /var/lib/kubelet/pki/kubelet-client-current.pem
client-key: /var/lib/kubelet/pki/kubelet-client-current.pem
```
{{< /note >}}

## 証明書の自動更新

kubeadmはコントロールプレーンの[アップグレード](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)時にすべての証明書を更新します。

この機能は、最もシンプルなユースケースに対応するために設計されています。
証明書の更新に特別な要件がなく、Kubernetesのバージョンアップを定期的に行う場合(各アップグレードの間隔が1年未満)、kubeadmは、クラスターを最新に保ち、適切なセキュリティを確保します。

証明書の更新に関してより複雑な要求がある場合は、`--certificate-renewal=false`を`kubeadm upgrade apply`や`kubeadm upgrade node`に渡して、デフォルトの動作から外れるようにすることができます。

## 手動による証明書更新

適切なコマンドラインオプションを指定して`kubeadm certs renew`コマンドを実行すれば、いつでも証明書を手動で更新できます。
複数のコントロールプレーンによってクラスターが稼働している場合、全てのコントロールプレーンノード上でこのコマンドを実行する必要があります。

このコマンドは`/etc/kubernetes/pki`に格納されているCA(またはfront-proxy-CA)の証明書と鍵を使用して更新を行います。

`kubeadm certs renew`は、属性(Common Name、Organization、SANなど)の信頼できるソースとして、`kubeadm-config` ConfigMapではなく、既存の証明書を使用します。
それでも、Kubernetesプロジェクトでは、混乱のリスクを避けるために証明書とConfigMap内の関連した値を同期したままにしておくことを推奨しています。

コマンド実行後、コントロールプレーンのPodを再起動する必要があります。
これは、現在は動的な証明書のリロードが、すべてのコンポーネントと証明書でサポートされているわけではないため、必要な作業です。
[static Pod](/docs/tasks/configure-pod-container/static-pod/)はローカルkubeletによって管理され、APIサーバーによって管理されないため、kubectlで削除および再起動することはできません。
static Podを再起動するには、一時的に`/etc/kubernetes/manifests/`からマニフェストファイルを削除して20秒間待ちます([KubeletConfiguration構造体](/docs/reference/config-api/kubelet-config.v1beta1/)の`fileCheckFrequency`値を参照してください)。
マニフェストディレクトリにてマニフェストファイルが存在しなくなると、kubeletはPodを終了します。
その後ファイルを戻し、さらに`fileCheckFrequency`期間後に、kubeletはPodを再作成し、コンポーネントの証明書更新を完了することができます。

`kubeadm certs renew`は、特定の証明書を更新できます。
また、`all`サブコマンドを用いることで全ての証明書を更新できます。

```shell
# 複数のコントロールプレーンによってクラスターが稼働している場合、このコマンドは全てのコントロールプレーン上で実行する必要があります。
kubeadm certs renew all
```

### 管理者用の証明書のコピー(オプション) {#admin-certificate-copy}

kubeadmで構築されたクラスターでは、多くの場合、[kubeadmを使用したクラスターの作成](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)の指示に従い、`admin.conf`証明書が`$HOME/.kube/config`へコピーされます。
このようなシステムでは、`admin.conf`を更新した後に`$HOME/.kube/config`の内容を更新するため、次のコマンドを実行します。

```shell
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

## Kubernetes certificates APIによる証明書の更新

ここでは、Kubernetes certificates APIを使用して手動で証明書更新を実行する方法について詳しく説明します。

{{< caution >}}
これらは、組織の証明書インフラをkubeadmで構築されたクラスターに統合する必要があるユーザー向けの上級者向けのトピックです。
kubeadmのデフォルトの設定で満足できる場合は、代わりにkubeadmに証明書を管理させる必要があります。
{{< /caution >}}

### 署名者の設定 {#set-up-a-signer}

Kubernetesの認証局は、そのままでは機能しません。
[cert-manager](https://cert-manager.io/docs/configuration/ca/)などの外部署名者を設定するか、組み込みの署名者を使用することができます。

ビルトインサイナーは[`kube-controller-manager`](/docs/reference/command-line-tools-reference/kube-controller-manager/)に含まれるものです。

ビルトインサイナーを有効にするには、`--cluster-signing-cert-file`と`--cluster-signing-key-file`フラグを渡す必要があります。

新しいクラスターを作成する場合は、kubeadm[設定ファイル](/docs/reference/config-api/kubeadm-config.v1beta4/)を使用します。

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
controllerManager:
  extraArgs:
  - name: "cluster-signing-cert-file"
    value: "/etc/kubernetes/pki/ca.crt"
  - name: "cluster-signing-key-file"
    value: "/etc/kubernetes/pki/ca.key"
```

### 証明書署名要求(CSR)の作成

Kubernetes APIでのCSR作成については、[CertificateSigningRequestの作成](/docs/reference/access-authn-authz/certificate-signing-requests/#create-certificatesigningrequest)を参照ください。

## 外部CAによる証明書の更新

ここでは、外部認証局を利用して手動で証明書更新を行う方法について詳しく説明します。

外部CAとの連携を強化するために、kubeadmは証明書署名要求(CSR)を生成することもできます。
CSRとは、クライアント用の署名付き証明書をCAに要求することを表します。
kubeadmでは、通常ディスク上のCAによって署名される証明書をCSRとして生成することができます。しかし、CAはCSRとして生成することはできません。

### 証明書署名要求(CSR)による証明書の更新
証明書の更新は、新たなCSRを作成し外部CAで署名することで実施できます。
kubeadmによって生成されたCSRの署名についての詳細は、[kubeadmによって生成された証明書署名要求(CSR)の署名](#signing-csr)セクションを参照してください。

## 認証局(CA)のローテーション {#certificate-authority-rotation}

kubeadmは、CA証明書のローテーションや置換を標準ではサポートしていません。

CAの手動ローテーションや置換についての詳細は、[CA証明書の手動ローテーション](/docs/tasks/tls/manual-rotation-of-ca-certificates/)を参照してください。

## 署名付きkubeletサーバー証明書の有効化 {#kubelet-serving-certs}

デフォルトでは、kubeadmによって展開されるkubeletサーバー証明書は自己署名されています。
これは、[metrics-server](https://github.com/kubernetes-sigs/metrics-server)のような外部サービスからkubeletへの接続がTLSで保護されないことを意味します。

新しいkubeadmクラスター内のkubeletが適切に署名されたサーバー証明書を取得するように設定するには、`kubeadm init`に以下の最小限の設定を渡す必要があります。

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
---
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
serverTLSBootstrap: true
```

すでにクラスターを作成している場合は、以下の手順で適応させる必要があります。

- `kube-system` namespace中の`kubelet-config` ConfigMapを探して編集します。
このConfigMap内には、`kubelet`キーの値として、[KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/)に関する記述が存在します。
KubeletConfigurationの内容を編集し、`serverTLSBootstrap: true`を設定します。
- 各ノードで、`/var/lib/kubelet/config.yaml`に`serverTLSBootstrap: true`フィールドを追加し、`systemctl restart kubelet`でkubeletを再起動します。

`serverTLSBootstrap: true`フィールドは、`certificates.k8s.io` APIからkubeletのサーバー証明書をリクエストすることで、kubeletサーバー証明書のブートストラップを有効にします。

既知の制限事項の1つとして、これらのCSR(証明書署名要求)はkube-controller-managerのデフォルトの署名者によって自動的に承認されないことが挙げられます。
[`kubernetes.io/kubelet-serving`](/docs/reference/access-authn-authz/certificate-signing-requests/#kubernetes-signers)を参照してください。
これには、ユーザーまたはサードパーティのコントローラーからのアクションが必要です。

これらのCSRは、以下を使用して表示できます:

```shell
kubectl get csr
```
```console
NAME        AGE     SIGNERNAME                        REQUESTOR                      CONDITION
csr-9wvgt   112s    kubernetes.io/kubelet-serving     system:node:worker-1           Pending
csr-lz97v   1m58s   kubernetes.io/kubelet-serving     system:node:control-plane-1    Pending
```

承認するためには、次のようにします:
```shell
kubectl certificate approve <CSR-name>
```

デフォルトでは、これらのサーバー証明書は1年後に失効します。
kubeadmは`KubeletConfiguration`フィールドの`rotateCertificates`を`true`に設定します。
これは有効期限が切れる間際に、サーバー証明書のための新しいCSRセットを作成し、ローテーションを完了するために承認する必要があることを意味します。
詳しくは[証明書のローテーション](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#certificate-rotation)を参照してください。

これらのCSRを自動的に承認するためのソリューションをお探しの場合は、クラウドプロバイダーに連絡し、ノードの識別をアウトオブバンドのメカニズムで行うCSRの署名者がいるかどうか確認することをお勧めします。

{{% thirdparty-content %}}

サードパーティのカスタムコントローラーを使用することができます。
- [kubelet-csr-approver](https://github.com/postfinance/kubelet-csr-approver)

このようなコントローラーは、CSRのCommonNameを検証するだけでなく、要求されたIPやドメイン名も検証しなければ、安全なメカニズムとは言えません。
これにより、kubeletクライアント証明書にアクセスできる悪意のあるアクターが、任意のIPやドメイン名に対してサーバー証明書を要求するCSRを作成することを防止できます。

## 追加ユーザー用のkubeconfigファイルの生成 {#kubeconfig-additional-users}

クラスターの構築中、`kubeadm init`は`super-admin.conf`内の証明書に署名し、`Subject: O = system:masters, CN = kubernetes-super-admin`を設定します。
[`system:masters`](/docs/reference/access-authn-authz/rbac/#user-facing-roles)は認可のレイヤーをバイパスする(例: [RBAC](/docs/reference/access-authn-authz/rbac/))、緊急用のスーパーユーザーグループです。
`admin.conf`ファイルもkubeadmによってコントロールプレーン上に作成され、`Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`と設定された証明書が含まれています。
`kubeadm:cluster-admins`はkubeadmが属している論理的なグループです。
RBAC(kubeadmのデフォルト)をクラスターに使用している場合、`kubeadm:cluster-admins`グループは[`cluster-admin`](/docs/reference/access-authn-authz/rbac/#user-facing-roles) ClusterRoleにバインドされます。

{{< warning >}}
`super-admin.conf`および`admin.conf`ファイルを共有しないでください。
代わりに、管理者として従事するユーザーに対しても最小限のアクセス権限を作成し、緊急アクセス以外の場合にはその最小限の権限の代替手段を使用します。
{{< /warning >}}

[`kubeadm kubeconfig user`](/docs/reference/setup-tools/kubeadm/kubeadm-kubeconfig)コマンドを使用することで、追加ユーザー用のkubeconfigファイルを生成できます。
このコマンドは、コマンドラインフラグと[kubeadm configuration](/docs/reference/config-api/kubeadm-config.v1beta4/)オプションの組み合わせが可能です。
生成されたkubeconfigファイルはstdoutに書き込まれ、`kubeadm kubeconfig user ... > somefile.conf`を使用してファイルにパイプすることができます。

`--config`で使用できる設定ファイルの例:

```yaml
# example.yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
# kubeconfig内にて、対象の"cluster"として使用します。
clusterName: "kubernetes"
# kubeconfig内にて、このクラスターの"server"(IPもしくはDNS名)として使用します。
controlPlaneEndpoint: "some-dns-address:6443"
# クラスターCAの秘密鍵と証明書が、このローカルディレクトリからロードされます。
certificatesDir: "/etc/kubernetes/pki"
```
これらの設定が、目的の対象クラスターの設定と一致していることを確認します。
既存のクラスターの設定を表示するには、次のコマンドを使用します。

```shell
kubectl get cm kubeadm-config -n kube-system -o=jsonpath="{.data.ClusterConfiguration}"
```

次の例では、`appdevs`グループに属する新しいユーザー`johndoe`に対して24時間有効な資格情報を含むkubeconfigファイルが生成されます。

```shell
kubeadm kubeconfig user --config example.yaml --org appdevs --client-name johndoe --validity-period 24h
```

次の例では、1週間有効な管理者の資格情報を持つkubeconfigファイルが生成されます。

```shell
kubeadm kubeconfig user --config example.yaml --client-name admin --validity-period 168h
```
## kubeadmによって生成された証明書署名要求(CSR)の署名 {#signing-csr}

`kubeadm certs generate-csr`コマンドで、証明書署名要求を作成できます。
通常の証明書については、このコマンドの実行によって`.csr`/`.key`ファイルのペアが生成されます。
kubeconfigに埋め込まれた証明書については、このコマンドで`.csr`/`.conf`のペアが生成されます。このペアでは、鍵は`.conf`ファイルに埋め込まれています。

CSRファイルには、CAが証明書に署名するために必要な情報が全て含まれています。
kubeadmは全ての証明書とCSRに対し、[明確に定義された仕様](/docs/setup/best-practices/certificates/#all-certificates)を適用します。

証明書のデフォルトのディレクトリは`/etc/kubernetes/pki`であり、kubeconfigファイルのデフォルトのディレクトリは`/etc/kubernetes`です。
これらのデフォルトのディレクトリは、それぞれ`--cert-dir`と`--kubeconfig-dir`フラグで上書きできます。

`kubeadm certs generate-csr`にカスタムオプションを渡すには、`--config`フラグを使用します。
このフラグは、`kubeadm init`と同様に、[kubeadmの設定](/docs/reference/config-api/kubeadm-config.v1beta4/)ファイルを受け入れます。
追加のSANやカスタムIPアドレスなどの指定については、関連の全てのkubeadmコマンドに使用するために、全て同じ設定ファイルに保存し、`--config`として渡す必要があります。

{{< note >}}
このガイドでは、Kubernetesのデフォルトのディレクトリである`/etc/kubernetes`を使用しています。このディレクトリにはスーパーユーザー権限が必要です。
このガイドに従って、書き込み可能なディレクトリを使用している場合(通常は`--cert-dir`と`--kubeconfig-dir`を指定して`kubeadm`を実行します)は、`sudo`コマンドを省略できます。

次に、作成したファイルを`/etc/kubernetes`ディレクトリ内にコピーして、`kubeadm init`もしくは`kubeadm join`がこれらのファイルを検出できるようにする必要があります。
{{< /note >}}

### CAとサービスアカウントファイルの準備

`kubeadm init`を実行する最初のコントロールプレーンノードでは、以下のコマンドを実行してください。

```shell
sudo kubeadm init phase certs ca
sudo kubeadm init phase certs etcd-ca
sudo kubeadm init phase certs front-proxy-ca
sudo kubeadm init phase certs sa
```

これにより、コントロールプレーンノードでkubeadmが必要とする、全ての自己署名CAファイル(証明書と鍵)とサービスアカウント(公開鍵と秘密鍵)が`/etc/kubernetes/pki`および`/etc/kubernetes/pki/etcd`フォルダーに作成されます。

{{< note >}}
外部CAを使用する場合、同じファイルをアウトオブバンドで作成し、最初のコントロールプレーンノードの`/etc/kubernetes`へ手動でコピーする必要があります。

全ての証明書に署名した後、[外部CAモード](#external-ca-mode)セクションの記載のように、ルートCAの鍵(`ca.key`)は削除しても構いません。
{{< /note >}}

2番目以降のコントロールプレーンノード(`kubeadm join --control-plane`を実行します)では、上記のコマンドを実行する必要はありません。
[高可用性](/docs/setup/production-environment/tools/kubeadm/high-availability)クラスターの構築方法に応じて、最初のコントロールプレーンノードから同じファイルを手動でコピーするか、`kubeadm init`の自動化された`--upload-certs`機能を使用する必要があります。

### CSRの生成

`kubeadm certs generate-csr`コマンドは、kubeadmによって管理される全ての既知の証明書のCSRファイルを作成します。
コマンドの実行後、不要な`.csr`、`.conf`、または`.key`ファイルを手動で削除する必要があります。

#### kubelet.confに対する考慮事項 {#considerations-kubelet-conf}

このセクションはコントロールプレーンノードとワーカーノードの両方に適用されます。

`ca.key`ファイルをコントロールプレーンから削除している場合([外部CAモード](#external-ca-mode))、クラスターで実行中のkube-controller-managerはkubeletクライアント証明書への署名ができなくなります。
構成内にこれらの証明書へ署名するための外部の方法([外部署名者](#set-up-a-signer)など)が存在しない場合は、このガイドで説明されているように、`kubelet.conf.csr`に手動で署名できます。

なお、これにより、自動による[kubeletクライアント証明書のローテーション](/docs/tasks/tls/certificate-rotation/#enabling-client-certificate-rotation)が無効になることに注意してください。
その場合は、証明書の有効期限が近づいたら、新しい`kubelet.conf.csr`を生成し、証明書に署名して`kubelet.conf`に埋め込み、kubeletを再起動する必要があります。

`ca.key`ファイルがコントロールプレーンノード上に存在する場合、2番目以降のコントロールプレーンノードおよびワーカーノード(`kubeadm join ...`を実行する全てのノード)では、`kubelet.conf.csr`の処理をスキップできます。
これは、実行中のkube-controller-managerが新しいkubeletクライアント証明書の署名を担当するためです。

{{< note >}}
`kubelet.conf.csr`ファイルは、最初のコントロールプレーンノード(最初に`kubeadm init`を実行したホスト)で処理する必要があります。
これは、`kubeadm`がそのノードをクラスターのブートストラップ用のノードと見なすため、事前に設定された`kubelet.conf`が必要になるためです。
{{< /note >}}

#### コントロールプレーンノード

1番目(`kubeadm init`)および2番目以降(`kubeadm join --control-plane`)のコントロールプレーンノードで以下のコマンドを実行し、全てのCSRファイルを生成します。

```shell
sudo kubeadm certs generate-csr
```

外部etcdを使用する場合は、kubeadmとetcdノードに必要なCSRファイルについて理解するために、[kubeadmを使用した外部etcd](/docs/setup/production-environment/tools/kubeadm/high-availability/#external-etcd-nodes)のガイドを参照してください。
`/etc/kubernetes/pki/etcd`配下にある他の`.csr`および`.key`ファイルは削除して構いません。

[kubelet.confに対する考慮事項](#considerations-kubelet-conf)の説明に基づいて、`kubelet.conf`および`kubelet.conf.csr`ファイルを保持するか削除します。

#### ワーカーノード

[kubelet.confに対する考慮事項](#considerations-kubelet-conf)の説明に基づいて、オプションで以下のコマンドを実行し、`kubelet.conf`および`kubelet.conf.csr`ファイルを保持します。

```shell
sudo kubeadm certs generate-csr
```

あるいは、ワーカーノードの手順を完全にスキップします。

### 全ての証明書のCSRへ署名

{{< note >}}
外部CAを使用し、`openssl`用のCAのシリアル番号ファイル(`.srl`)が既に存在する場合は、これらのファイルをCSRを署名するkubeadmノードにコピーできます。
コピーする`.srl`ファイルは、`/etc/kubernetes/pki/ca.srl`、`/etc/kubernetes/pki/front-proxy-ca.srl`および`/etc/kubernetes/pki/etcd/ca.srl`です。
その後、これらのファイルをCSRファイルに署名する新たなノードに移動できます。

ノード上のCAに対して`.srl`ファイルが存在しない場合、以下のスクリプトはランダムな開始シリアル番号を持つ新規のSRLファイルを生成します。

`.srl`ファイルの詳細については、[`openssl`](https://www.openssl.org/docs/man3.0/man1/openssl-x509.html)ドキュメントの`--CAserial`フラグを参照してください。
{{< /note >}}

CSRファイルが存在する全てのノードで、この手順を繰り返してください。

`/etc/kubernetes`ディレクトリに次のスクリプトを作成し、そのディレクトリに移動してスクリプトを実行します。
このスクリプトは、`/etc/kubernetes`ツリー以下に存在する全てのCSRファイルに対する証明書ファイルを生成します。

```bash
#!/bin/bash

# 日単位で証明書の有効期間を設定
DAYS=365

# front-proxyとetcdを除いた全てのCSRファイルへ署名
find ./ -name "*.csr" | grep -v "pki/etcd" | grep -v "front-proxy" | while read -r FILE;
do
    echo "* Processing ${FILE} ..."
    FILE=${FILE%.*} # 拡張子を取り除く
    if [ -f "./pki/ca.srl" ]; then
        SERIAL_FLAG="-CAserial ./pki/ca.srl"
    else
        SERIAL_FLAG="-CAcreateserial"
    fi
    openssl x509 -req -days "${DAYS}" -CA ./pki/ca.crt -CAkey ./pki/ca.key ${SERIAL_FLAG} \
        -in "${FILE}.csr" -out "${FILE}.crt"
    sleep 2
done

# 全てのetcdのCSRへ署名
find ./pki/etcd -name "*.csr" | while read -r FILE;
do
    echo "* Processing ${FILE} ..."
    FILE=${FILE%.*} # 拡張子を取り除く
    if [ -f "./pki/etcd/ca.srl" ]; then
        SERIAL_FLAG=-CAserial ./pki/etcd/ca.srl
    else
        SERIAL_FLAG=-CAcreateserial
    fi
    openssl x509 -req -days "${DAYS}" -CA ./pki/etcd/ca.crt -CAkey ./pki/etcd/ca.key ${SERIAL_FLAG} \
        -in "${FILE}.csr" -out "${FILE}.crt"
done

# front-proxyのCSRへ署名
echo "* Processing ./pki/front-proxy-client.csr ..."
openssl x509 -req -days "${DAYS}" -CA ./pki/front-proxy-ca.crt -CAkey ./pki/front-proxy-ca.key -CAcreateserial \
    -in ./pki/front-proxy-client.csr -out ./pki/front-proxy-client.crt
```

### kubeconfigファイルへの証明書の組み込み

CSRファイルが存在する全てのノードで、この手順を繰り返してください。

`/etc/kubernetes`ディレクトリに次のスクリプトを作成し、そのディレクトリに移動してスクリプトを実行します。
このスクリプトは、前の手順でCSRファイルからkubeconfigファイル用に署名された`.crt`ファイルを取得し、これらをkubeconfigファイルに組み込みます。

```bash
#!/bin/bash

CLUSTER=kubernetes
find ./ -name "*.conf" | while read -r FILE;
do
    echo "* Processing ${FILE} ..."
    KUBECONFIG="${FILE}" kubectl config set-cluster "${CLUSTER}" --certificate-authority ./pki/ca.crt --embed-certs
    USER=$(KUBECONFIG="${FILE}" kubectl config view -o jsonpath='{.users[0].name}')
    KUBECONFIG="${FILE}" kubectl config set-credentials "${USER}" --client-certificate "${FILE}.crt" --embed-certs
done
```

### クリーンアップの実行 {#post-csr-cleanup}

CSRファイルがあるすべてのノードでこの手順を実行します。

`/etc/kubernetes`ディレクトリに次のスクリプトを作成し、そのディレクトリに移動してスクリプトを実行します。

```bash
#!/bin/bash

# CSRファイルのクリーンアップ
rm -f ./*.csr ./pki/*.csr ./pki/etcd/*.csr # 全てのCSRファイルを削除します。

# kubeconfigファイル内に既に埋め込まれているCRTファイルのクリーンアップ
rm -f ./*.crt
```

必要に応じて、`.srl`ファイルを次に使用するノードへ移動させます。

必要に応じて、外部CAを使用する場合は、[外部CAモード](#external-ca-mode)のセクションで説明されているように、`/etc/kubernetes/pki/ca.key`ファイルを削除します。

### kubeadmノードの初期化

CSRファイルに署名し、ノードとして使用する各ホストへ証明書を配置すると、`kubeadm init`コマンドと`kubeadm join`を使用してKubernetesクラスターを構築できます。
`init`と`join`の実行時、kubeadmは各ホストのローカルファイルシステムの`/etc/kubernetes`ツリーで検出した既存の証明書、暗号化キー、およびkubeconfigファイルを使用します。
