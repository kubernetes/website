---
title: kubeadmによる証明書管理
content_type: task
weight: 10
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.15" state="stable" >}}

[kubeadm](/docs/reference/setup-tools/kubeadm/)で生成されたクライアント証明書は1年で失効します。
このページでは、kubeadmで証明書の更新を管理する方法について説明します。

## {{% heading "prerequisites" %}}

[KubernetesにおけるPKI証明書と要件](/docs/setup/best-practices/certificates/)を熟知している必要があります。

<!-- steps -->

## カスタム証明書の使用 {#custom-certificates}

デフォルトでは、kubeadmはクラスターの実行に必要なすべての証明書を生成します。
独自の証明書を提供することで、この動作をオーバーライドできます。

そのためには、`--cert-dir`フラグまたはkubeadmの`ClusterConfiguration`の`certificatesDir`フィールドで指定された任意のディレクトリに配置する必要があります。
デフォルトは`/etc/kubernetes/pki`です。

`kubeadm init` を実行する前に与えられた証明書と秘密鍵のペアが存在する場合、kubeadmはそれらを上書きしません。
つまり、例えば既存のCAを`/etc/kubernetes/pki/ca.crt`と`/etc/kubernetes/pki/ca.key`にコピーすれば、kubeadmは残りの証明書に署名する際、このCAを使用できます。

## 外部CAモード {#external-ca-mode}

また、`ca.crt`ファイルのみを提供し、`ca.key`ファイルを提供しないことも可能です(これはルートCAファイルのみに有効で、他の証明書ペアには有効ではありません)。
他の証明書とkubeconfigファイルがすべて揃っている場合、kubeadmはこの状態を認識し、外部CAモードを有効にします。
kubeadmはディスク上のCAキーがなくても処理を進めます。

代わりに、Controller-managerをスタンドアロンで、`--controllers=csrsigner`と実行し、CA証明書と鍵を指し示します。

[PKI certificates and requirements](/docs/setup/best-practices/certificates/)には、外部CAを使用するためのクラスターのセットアップに関するガイダンスが含まれています。

## 証明書の有効期限の確認

`check-expiration`サブコマンドを使うと、証明書の有効期限を確認することができます。

```
kubeadm certs check-expiration
```

このような出力になります:

```
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

このコマンドは、`/etc/kubernetes/pki`フォルダ内のクライアント証明書と、kubeadmが使用するKUBECONFIGファイル(`admin.conf`,`controller-manager.conf`,`scheduler.conf`)に埋め込まれたクライアント証明書の有効期限/残余時間を表示します。

また、証明書が外部管理されている場合、kubeadmはユーザーに通知します。この場合、ユーザーは証明書の更新を手動または他のツールを使用して管理する必要があります。

{{< warning >}}
`kubeadm`は外部CAによって署名された証明書を管理することができません。
{{< /warning >}}

{{< note >}}
kubeadmは`/var/lib/kubelet/pki`以下にあるローテート可能な証明書でkubeletの[証明書の自動更新](/docs/task/tls/certificate-rotation/)を構成するので`kubelet.conf`は上記のリストに含まれません。

期限切れのkubeletクライアント証明書を修復するには、[Kubelet クライアント証明書のローテーションに失敗しました](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#kubelet-client-cert)を参照ください。
{{< /note >}}

{{< warning >}}
kubeadm version 1.17より前の`kubeadm init`で作成したノードでは、`kubelet.conf`の内容を手動で変更しなければならないという[bug](https://github.com/kubernetes/kubeadm/issues/1753)が存在します。

`kubeadm init`が終了したら、`client-certificate-data`と`client-key-data`を置き換えて、ローテーションされたkubeletクライアント証明書を指すように`kubelet.conf`を更新してください。

```yaml
client-certificate: /var/lib/kubelet/pki/kubelet-client-current.pem
client-key: /var/lib/kubelet/pki/kubelet-client-current.pem
```
{{< /warning >}}

## 証明書の自動更新

kubeadmはコントロールプレーンの[アップグレード](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)時にすべての証明書を更新します。

この機能は、最もシンプルなユースケースに対応するために設計されています。
証明書の更新に特別な要件がなく、Kubernetesのバージョンアップを定期的に行う場合(各アップグレードの間隔が1年未満)、kubeadmがクラスターを最新かつ適度に安全に保つための処理を行います。

{{< note >}}
安全性を維持するために、クラスターを頻繁にアップグレードすることがベストプラクティスです。
{{< /note >}}

証明書の更新に関してより複雑な要求がある場合は、`--certificate-renewal=false`を`kubeadm upgrade apply`や`kubeadm upgrade node`に渡して、デフォルトの動作から外れるようにすることができます。

{{< warning >}}
kubeadmバージョン1.17より前のバージョンでは、`kubeadm upgrade node`コマンドの`--certificate-renewal`のデフォルト値が`false`になっているという[bug(https://github.com/kubernetes/kubeadm/issues/1818)]問題があります。
この場合、明示的に`--certificate-renewal=true`を設定する必要があります。
{{< /warning >}}

## 手動による証明書更新

`kubeadm certs renew` コマンドを使えば、いつでも証明書を手動で更新することができます。

このコマンドは`/etc/kubernetes/pki`に格納されているCA(またはfront-proxy-CA)の証明書と鍵を使って更新を行います。

コマンド実行後、コントロールプレーンのPodを再起動する必要があります。
これは、現在すべてのコンポーネントと証明書について動的な証明書のリロードがサポートされていないため、必要な作業です。
[スタティックPod](/docs/tasks/configure-pod-container/static-pod/)はローカルkubeletによって管理され、API Serverによって管理されないため、kubectlで削除および再起動することはできません。

スタティックPodを再起動するには、一時的に`/etc/kubernetes/manifests/`からマニフェストファイルを削除して20秒間待ちます([KubeletConfiguration struct](/docs/reference/config-api/kubelet-config.v1beta1/)の`fileCheckFrequency`値を参照してください)。
マニフェストディレクトリにPodが無くなると、kubeletはPodを終了します。
その後ファイルを戻して、さらに`fileCheckFrequency`期間後に、kubeletはPodを再作成し、コンポーネントの証明書更新を完了することができます。

{{< warning >}}
HAクラスターを実行している場合、このコマンドはすべての制御プレーンノードで実行する必要があります。
{{< /warning >}}

{{< note >}}
`certs renew`は、属性(Common Name、Organization、SANなど)の信頼できるソースとして、kubeadm-config ConfigMapではなく、既存の証明書を使用します。両者を同期させておくことが強く推奨されます。
{{< /note >}}

`kubeadm certs renew` は以下のオプションを提供します:

Kubernetesの証明書は通常1年後に有効期限を迎えます。

- `--csr-only`を使用すると、証明書署名要求を生成して外部CAとの証明書を更新することができます(実際にはその場で証明書を更新しません)。詳しくは次の段落を参照してください。

- また、すべての証明書を更新するのではなく、1つの証明書を更新することも可能です。

## Kubernetes certificates APIによる証明書の更新

ここでは、Kubernetes certificates APIを使用して手動で証明書更新を実行する方法について詳しく説明します。

{{< caution >}}
これらは、組織の証明書インフラをkubeadmで構築されたクラスターに統合する必要があるユーザー向けの上級者向けのトピックです。
kubeadmのデフォルトの設定で満足できる場合は、代わりにkubeadmに証明書を管理させる必要があります。
{{< /caution >}}

### 署名者の設定

Kubernetesの認証局は、そのままでは機能しません。
[cert-manager](https://cert-manager.io/docs/configuration/ca/)などの外部署名者を設定するか、組み込みの署名者を使用することができます。

ビルトインサイナーは[`kube-controller-manager`](/docs/reference/command-line-tools-reference/kube-controller-manager/)に含まれるものです。

ビルトインサイナーを有効にするには、`--cluster-signing-cert-file`と`--cluster-signing-key-file`フラグを渡す必要があります。

新しいクラスターを作成する場合は、kubeadm[設定ファイル](https://pkg.go.dev/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta3)を使用します。

```yaml
apiVersion: kubeadm.k8s.io/v1beta3
kind: ClusterConfiguration
controllerManager:
  extraArgs:
    cluster-signing-cert-file: /etc/kubernetes/pki/ca.crt
    cluster-signing-key-file: /etc/kubernetes/pki/ca.key
```

### 証明書署名要求の作成 (CSR)

Kubernetes APIでのCSR作成については、[Create CertificateSigningRequest](/docs/reference/access-authn-authz/certificate-signing-requests/#create-certificatesigningrequest)を参照ください。

## 外部CAによる証明書の更新

ここでは、外部認証局を利用して手動で証明書更新を行う方法について詳しく説明します。

外部CAとの連携を強化するために、kubeadmは証明書署名要求(CSR)を生成することもできます。
CSRとは、クライアント用の署名付き証明書をCAに要求することを表します。
kubeadmの用語では、通常ディスク上のCAによって署名される証明書をCSRとして生成することができます。しかし、CAはCSRとして生成することはできません。

### 証明書署名要求の作成 (CSR)

`kubeadm certs renew --csr-only`で証明書署名要求を作成することができます。

CSRとそれに付随する秘密鍵の両方が出力されます。
ディレクトリを`--csr-dir`で渡すと、指定した場所にCSRを出力することができます。
`csr-dir`を指定しない場合は、デフォルトの証明書ディレクトリ(`/etc/kubernetes/pki`)が使用されます。

証明書は`kubeadm certs renew --csr-only`で更新することができます。
`kubeadm init`と同様に、`--csr-dir`フラグで出力先ディレクトリを指定することができます。

CSRには、証明書の名前、ドメイン、IPが含まれますが、用途は指定されません。
証明書を発行する際に、[正しい証明書の使用法](/docs/setup/best-practices/certificates/#all-certificates)を指定するのはCAの責任です。

* `openssl`では、[`openssl ca`コマンド](https://superuser.com/questions/738612/openssl-ca-keyusage-extension)を使って行います。

* `cfssl`では、[configファイルのusages](https://github.com/cloudflare/cfssl/blob/master/doc/cmd/cfssl.txt#L170)で指定します。

お好みの方法で証明書に署名した後、証明書と秘密鍵をPKIディレクトリ(デフォルトでは`/etc/kubernetes/pki`)にコピーする必要があります。

## 認証局(CA)のローテーション {#certificate-authority-rotation}

Kubeadmは、CA証明書のローテーションや交換を最初からサポートしているわけではありません。

CAの手動ローテーションや交換についての詳細は、[manual rotation of CA certificates](/docs/tasks/tls/manual-rotation-of-ca-certificates/)を参照してください。

## 署名付きkubeletサービング証明書の有効化 {#kubelet-serving-certs}

デフォルトでは、kubeadmによって展開されるkubeletサービング証明書は自己署名されています。
これは、[metrics-server](https://github.com/kubernetes-sigs/metrics-server)のような外部サービスからキューブレットへの接続がTLSで保護されないことを意味します。
新しいkubeadmクラスター内のkubeletが適切に署名されたサービング証明書を取得するように設定するには、`kubeadm init`に以下の最小限の設定を渡す必要があります。

```yaml
apiVersion: kubeadm.k8s.io/v1beta3
kind: ClusterConfiguration
---
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
serverTLSBootstrap: true
```

すでにクラスターを作成している場合は、以下の手順で適応させる必要があります。

 - `kube-system`ネームスペースにある`kubelet-config-{{< skew currentVersion >}}` ConfigMapを見つけて編集します。

そのConfigMapの`kubelet`キーの値として[KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)ドキュメントを指定します。KubeletConfigurationドキュメントを編集し、`serverTLSBootstrap: true`を設定します。

- 各ノードで、`/var/lib/kubelet/config.yaml`に`serverTLSBootstrap: true`フィールドを追加し、`systemctl restart kubelet`でkubeletを再起動します。

`serverTLSBootstrap: true`フィールドは、kubeletサービングのブートストラップを有効にします。
証明書を`certificates.k8s.io`APIにリクエストすることで、証明書を発行することができます。

既知の制限事項として、これらの証明書のCSR(Certificate Signing Requests)はkube-controller-managerのデフォルトサイナーによって自動的に承認されないことがあります。
[`kubernetes.io/kubelet-serving`](/docs/reference/access-authn-authz/certificate-signing-requests/#kubernetes-signers) を参照してください。

これには、ユーザーまたはサードパーティーのコントローラーからのアクションが必要です。

これらのCSRは、以下を使用して表示できます:

```shell
kubectl get csr
NAME        AGE     SIGNERNAME                        REQUESTOR                      CONDITION
csr-9wvgt   112s    kubernetes.io/kubelet-serving     system:node:worker-1           Pending
csr-lz97v   1m58s   kubernetes.io/kubelet-serving     system:node:control-plane-1    Pending
```

承認するためには、次のようにします:
```shell
kubectl certificate approve <CSR-name>
```

デフォルトでは、これらのサービング証明書は1年後に失効します。

Kubeadmは`KubeletConfiguration`フィールド`rotateCertificates`を`true`に設定します。これは有効期限が切れる間際に、サービング証明書のための新しいCSRセットを作成し、ローテーションを完了するために承認する必要があることを意味します。

詳しくは[Certificate Rotation](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/#certificate-rotation)をご覧ください。

これらのCSRを自動的に承認するためのソリューションをお探しの場合は、以下をお勧めします。
クラウドプロバイダーに連絡し、ノードの識別をアウトオブバンドのメカニズムで行うCSRの署名者がいるかどうか尋ねてください。

{{% thirdparty-content %}}

サードパーティーのカスタムコントローラーを使用することができます。
- [kubelet-csr-approver](https://github.com/postfinance/kubelet-csr-approver)

このようなコントローラーは、CSRのCommonNameを検証するだけでなく、要求されたIPやドメイン名も検証しなければ、安全なメカニズムとは言えません。これにより、kubeletクライアント証明書にアクセスできる悪意のあるアクターが、任意のIPやドメイン名に対してサービング証明書を要求するCSRを作成することを防ぐことができます。
