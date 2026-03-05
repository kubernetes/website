---
title: クラスタ内のTLS証明書を管理する
content_type: task
---

Kubernetesは`certificates.k8s.io` APIを提供しており、これにより管理下にある認証局（CA）によって署名されたTLS証明書をプロビジョニングできます。これらのCAおよび証明書は、ワークロードが信頼関係を確立するために使用できます。

`certificates.k8s.io` API は、[ACME
draft](https://github.com/ietf-wg-acme/acme/) に類似したプロトコルを使用します。

{{< note >}}
`certificates.k8s.io` APIを使用して作成された証明書は、[dedicated CA](#configuring-your-cluster-to-provide-signing)によって署名されます。この目的でクラスタールートCAを使用するようクラスターを設定することは可能ですが、
これらの証明書がクラスタールートCAに対して検証されることを前提としないでください。
{{< /note >}}



## {{% heading "前提条件" %}}

{{< include "task-tutorial-prereqs.md" >}}

まずは、`cfssl`というツールは必要です。あなたは`cfssl`を[https://github.com/cloudflare/cfssl/releases](https://github.com/cloudflare/cfssl/releases)からダウンロードできます。

このページの一部の手順では`jq`ツールを使用します。`jq`をお持ちでない場合は、お使いのOSのパッケージリポジトリからインストールするか、[https://jqlang.github.io/jq/](https://jqlang.github.io/jq/)からダウンロードしてください。
<!-- steps -->

## ククラスター内でのTLS信頼の構成

Podとして実行されているアプリケーションから[custom CA](#configuring-your-cluster-to-provide-signing)を信頼するには、通常、追加のアプリケーション設定が必要です。TLSクライアントまたはサーバーが信頼するCA証明書リストに、
CA証明書バンドルを追加する必要があります。
例えばGoのTLS設定では、証明書チェーンを解析し、
その証明書を[`tls.Config`](https://pkg.go.dev/crypto/tls#Config)構造体の
`RootCAs`フィールドに追加します。

{{< note >}}
カスタムCA証明書がファイルシステムに含まれている場合でも（`kube-root-ca.crt`の中に）、その認証局は内部のKubernetesエンドポイントの検証以外の目的で使用すべきではありません。Kubernetesの内部エンドポイントの一例として、
デフォルトNamespace内の`kubernetes`というServiceがあります。

ワークロード用にカスタム認証局を使用する場合は、
そのCAを別途生成してください。
また、Podが読み取り可能な
[ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap)
を使用してCA証明書を配布してください。
{{< /note >}}

## 証明書の要求

次のセクションでは、DNS経由でアクセスされるKubernetesサービス用のTLS証明書を作成する方法を示します。

{{< note >}}
このチュートリアルではCFSSLを使用します：CloudflareのPKIおよびTLSツールキットの詳細は[こちらをクリック](https://blog.cloudflare.com/introducing-cfssl/)してください。
{{< /note >}}

## 証明書署名要求の作成

秘密鍵と証明書署名要求（CSR）を生成するには、以下を実行します：

```shell
cat <<EOF | cfssl genkey - | cfssljson -bare server
{
  "hosts": [
    "my-svc.my-namespace.svc.cluster.local",
    "my-pod.my-namespace.pod.cluster.local",
    "192.0.2.24",
    "10.0.34.2"
  ],
  "CN": "my-pod.my-namespace.pod.cluster.local",
  "key": {
    "algo": "ecdsa",
    "size": 256
  }
}
EOF
```

`192.0.2.24` はサービスのクラスターIP、
`my-svc.my-namespace.svc.cluster.local` はサービスのDNS名、
`10.0.34.2` はPodのIP、`my-pod.my-namespace.pod.cluster.local` はPodのDNS名です。次のような出力が表示されます：

```
2022/02/01 11:45:32 [INFO] generate received request
2022/02/01 11:45:32 [INFO] received CSR
2022/02/01 11:45:32 [INFO] generating key: ecdsa-256
2022/02/01 11:45:32 [INFO] encoded CSR
```

このコマンドは2つのファイルを生成します。PEMエンコードされた[PKCS#10](https://tools.ietf.org/html/rfc2986)認証要求を含む`server.csr`と、
まだ作成されていない証明書へのPEMエンコードされた鍵を含む`server-key.pem`です。

## Kubernetes APIに送信する CertificateSigningRequestオブジェクトの作成

CSRマニフェスト（YAML形式）を生成し、APIサーバーに送信します。以下のコマンドを実行することで実現できます：

```shell
cat <<EOF | kubectl apply -f -
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
metadata:
  name: my-svc.my-namespace
spec:
  request: $(cat server.csr | base64 | tr -d '\n')
  signerName: example.com/serving
  usages:
  - digital signature
  - key encipherment
  - server auth
EOF
```
ステップ1で作成した`server.csr`ファイルはBase64エンコードされ、`.spec.request`フィールドに格納されていることに注意してください。また、「digital signature」、「key encipherment」、「server auth」のキー用途を持つ証明書を要求しており、これは例として `example.com/serving` signer によって署名されます。

詳細については、[サポートされている署名者名](/docs/reference/access-authn-authz/certificate-signing-requests/#signers) のドキュメントを参照してください。

CSRは現在、APIから「保留中」状態として確認できます。以下のコマンドを実行すると確認できます：

```shell
kubectl describe csr my-svc.my-namespace
```

```none
Name:                   my-svc.my-namespace
Labels:                 <none>
Annotations:            <none>
CreationTimestamp:      Tue, 01 Feb 2022 11:49:15 -0500
Requesting User:        yourname@example.com
Signer:                 example.com/serving
Status:                 Pending
Subject:
        Common Name:    my-pod.my-namespace.pod.cluster.local
        Serial Number:
Subject Alternative Names:
        DNS Names:      my-pod.my-namespace.pod.cluster.local
                        my-svc.my-namespace.svc.cluster.local
        IP Addresses:   192.0.2.24
                        10.0.34.2
Events: <none>
```
## 証明書署名要求の承認を取得する {#get-the-certificate-signing-request-approved}

[証明書署名要求](/docs/reference/access-authn-authz/certificate-signing-requests/)の承認は、自動承認プロセスによって行われるか、クラスタ管理者による個別承認で行われます。証明書要求の承認権限がある場合、`kubectl`を使用して手動で承認できます。例：

```shell
kubectl certificate approve my-svc.my-namespace
```

```none
certificatesigningrequest.certificates.k8s.io/my-svc.my-namespace approved
```

次の内容が表示されます：

```shell
kubectl get csr
```

```none
NAME                  AGE   SIGNERNAME            REQUESTOR              REQUESTEDDURATION   CONDITION
my-svc.my-namespace   10m   example.com/serving   yourname@example.com   <none>              Approved
```

これは、証明書要求が承認され、要求された署名者が署名するのを待機していることを意味します。

## 証明書署名要求に署名する {#sign-the-certificate-signing-request}

次に、証明書署名者の役割を担い、証明書を発行し、APIにアップロードします。

署名者は通常、CertificateSigningRequest APIで自身の `signerName` を持つオブジェクトを監視し、
それらが承認されていることを確認し、それらのリクエストに対して証明書に署名し、
発行された証明書でAPIオブジェクトのステータスを更新します。

## 認証局を作成する

新しい証明書にデジタル署名を提供するための認証機関が必要です。

まず、以下のコマンドを実行して署名用証明書を作成します：

```shell
cat <<EOF | cfssl gencert -initca - | cfssljson -bare ca
{
  "CN": "My Example Signer",
  "key": {
    "algo": "rsa",
    "size": 2048
  }
}
EOF
```

次のような出力が表示されます：

```none
2022/02/01 11:50:39 [INFO] generating a new CA key and certificate from CSR
2022/02/01 11:50:39 [INFO] generate received request
2022/02/01 11:50:39 [INFO] received CSR
2022/02/01 11:50:39 [INFO] generating key: rsa-2048
2022/02/01 11:50:39 [INFO] encoded CSR
2022/02/01 11:50:39 [INFO] signed certificate with serial number 263983151013686720899716354349605500797834580472
```

これにより、認証局キーファイル（`ca-key.pem`）と証明書（`ca.pem`）が生成されます。

## 証明書を発行する

{{% code_sample file="tls/server-signing-config.json" %}}

`server-signing-config.json`署名設定と認証局キーファイルおよび証明書を使用して、証明書要求に署名します:

```shell
kubectl get csr my-svc.my-namespace -o jsonpath='{.spec.request}' | \
  base64 --decode | \
  cfssl sign -ca ca.pem -ca-key ca-key.pem -config server-signing-config.json - | \
  cfssljson -bare ca-signed-server
```

出力は以下のようなものになります：

```
2022/02/01 11:52:26 [INFO] signed certificate with serial number 576048928624926584381415936700914530534472870337
```

これにより署名付きサーバー証明書ファイル `ca-signed-server.pem` が生成されます。

### 署名済み証明書をアップロードする

最後に、署名済み証明書をAPIオブジェクトのステータスに設定します：

```shell
kubectl get csr my-svc.my-namespace -o json | \
  jq '.status.certificate = "'$(base64 ca-signed-server.pem | tr -d '\n')'"' | \
  kubectl replace --raw /apis/certificates.k8s.io/v1/certificatesigningrequests/my-svc.my-namespace/status -f -
```

{{< note >}}
これはコマンドラインツール[`jq`](https://jqlang.github.io/jq/)を使用して、`.status.certificate`フィールドにBase64エンコードされたコンテンツを格納します。
`jq`がない場合は、JSON出力をファイルに保存し、このフィールドを手動で入力して、結果のファイルをアップロードすることもできます。
{{< /note >}}

CSRが承認され、署名済み証明書がアップロードされたら、以下を実行してください：

```shell
kubectl get csr
```
出力は以下のようなものになります：
```none
NAME                  AGE   SIGNERNAME            REQUESTOR              REQUESTEDDURATION   CONDITION
my-svc.my-namespace   20m   example.com/serving   yourname@example.com   <none>              Approved,Issued
```

## 証明書をダウンロードして使用する

リクエスト元ユーザーとして、発行された証明書をダウンロードし、
以下のコマンドを実行して `server.crt` ファイルに保存できます:

```shell
kubectl get csr my-svc.my-namespace -o jsonpath='{.status.certificate}' \
    | base64 --decode > server.crt
```

これで、後でPodにマウントできる{{< glossary_tooltip text="シークレット" term_id="secret" >}}に`server.crt`と`server-key.pem`を格納できます（例：HTTPSを提供するWebサーバーで使用する場合）。

```shell
kubectl create secret tls server --cert server.crt --key server-key.pem
```

```none
secret/server created
```

最後に、`ca.pem`を{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}に配置し、
サービス証明書を検証するための信頼ルートとして使用できます:

```shell
kubectl create configmap example-serving-ca --from-file ca.crt=ca.pem
```

```none
configmap/example-serving-ca created
```

## CertificateSigningRequestの承認 {#approving-certificate-signing-requests}

Kubernetes管理者（適切な権限を持つ）は、`kubectl certificate approve` および `kubectl certificate deny` コマンドを使用して、CertificateSigningRequestsを手動で承認（または拒否）できます。ただし、このAPIを頻繁に利用する予定の場合は、自動化された証明書コントローラーの作成を検討することをお勧めします。

{{< caution >}}
CSRの承認権限は、環境内で誰を信頼するかを決定します。CSRの承認権限は、広くまたは安易に付与すべきではありません。

`approve` 権限を付与する前に、承認者に求められる検証要件と、特定の証明書を発行することによる影響の両方を十分に理解していることを確認する必要があります。
{{< /caution >}}

上記のようにkubectlを使用する人間であっても、マシンであっても、_approver_ の役割は、そのCSRが次の2つの要件を満たしていることを確認することです。：

1. CSRのサブジェクトは、CSRの署名に使用される秘密鍵を管理しています。これは、第三者が認可されたサブジェクトになりすます脅威に対処するものです。上記の例では、このステップは、PodがCSRの生成に使用された秘密鍵を管理していることを検証することになります。
2. CSRのサブジェクトは、要求されたコンテキストで動作することを認可されています。これは、望ましくないサブジェクトがクラスターに参加する脅威に対処するものです。上記の例では、このステップは、Podが要求されたサービスに参加することを許可されているかを検証することになります。

これら2つの要件が満たされている場合に限り、承認者は CSRを承認するべきであり、そうでない場合はCSRを拒否するべきです。

証明書承認とアクセス制御の詳細については、
[証明書署名要求](/docs/reference/access-authn-authz/certificate-signing-requests/)
の参照ページをご覧ください。

## クラスターで署名を提供するための設定

このページでは、証明書APIを提供するためのsignerが設定されていることを前提としています。
Kubernetes controller managerには、signerのデフォルト実装が用意されています。
これを有効にするには、Certificate Authorityのキーペアへのパスを指定して、
`--cluster-signing-cert-file` および `--cluster-signing-key-file`
パラメータをcontroller managerに渡します。
