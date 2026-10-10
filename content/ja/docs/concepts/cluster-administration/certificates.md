---
title: 証明書
content_type: concept
weight: 20
---


<!-- overview -->

クライアント証明書認証を使用する場合、`easyrsa`や`openssl`、`cfssl`を用いて、手動で証明書を生成できます。


<!-- body -->

### easyrsa

**easyrsa**を用いると、クラスターの証明書を手動で生成できます。

1.  パッチを当てたバージョンのeasyrsa3をダウンロードして解凍し、初期化します。

        curl -LO https://dl.k8s.io/easy-rsa/easy-rsa.tar.gz
        tar xzf easy-rsa.tar.gz
        cd easy-rsa-master/easyrsa3
        ./easyrsa init-pki
1.  新しい認証局(CA)を生成します。`--batch`は自動モードを設定し、`--req-cn`はCAの新しいルート証明書の共通名(CN)を指定します。

        ./easyrsa --batch "--req-cn=${MASTER_IP}@`date +%s`" build-ca nopass
1.  サーバー証明書と鍵を生成します。
    引数`--subject-alt-name`は、APIサーバーへのアクセスに使用できるIPおよびDNS名を設定します。
    `MASTER_CLUSTER_IP`は通常、APIサーバーとコントローラーマネージャーコンポーネントの両方で引数`--service-cluster-ip-range`として指定されるサービスCIDRの最初のIPです。
    引数`--days`は、証明書の有効期限が切れるまでの日数を設定するために使われます。
    以下の例は、デフォルトのDNSドメイン名として`cluster.local`を使用していることを前提とします。

        ./easyrsa --subject-alt-name="IP:${MASTER_IP},"\
        "IP:${MASTER_CLUSTER_IP},"\
        "DNS:kubernetes,"\
        "DNS:kubernetes.default,"\
        "DNS:kubernetes.default.svc,"\
        "DNS:kubernetes.default.svc.cluster,"\
        "DNS:kubernetes.default.svc.cluster.local" \
        --days=10000 \
        build-server-full server nopass
1.  `pki/ca.crt`、`pki/issued/server.crt`、`pki/private/server.key`をディレクトリーにコピーします。
1.  以下のパラメーターを、APIサーバーの開始パラメーターとして追加します。

        --client-ca-file=/yourdirectory/ca.crt
        --tls-cert-file=/yourdirectory/server.crt
        --tls-private-key-file=/yourdirectory/server.key

### openssl

**openssl**はクラスターの証明書を手動で生成できます。

1.  2048ビットのca.keyを生成します。

        openssl genrsa -out ca.key 2048
1.  ca.keyに応じて、ca.crtを生成します。証明書の有効期間を設定するには、-daysを使用します。

        openssl req -x509 -new -nodes -key ca.key -subj "/CN=${MASTER_IP}" -days 10000 -out ca.crt
1.  2048ビットのserver.keyを生成します。

        openssl genrsa -out server.key 2048
1.  証明書署名要求(CSR)を生成するための設定ファイルを生成します。
    ファイル(例: `csr.conf`)に保存する前に、かぎ括弧で囲まれた値(例: `<MASTER_IP>`)を必ず実際の値に置き換えてください。
    `MASTER_CLUSTER_IP`の値は、前節で説明したAPIサーバーのサービスクラスターIPであることに注意してください。
    以下の例は、デフォルトのDNSドメイン名として`cluster.local`を使用していることを前提とします。

        [ req ]
        default_bits = 2048
        prompt = no
        default_md = sha256
        req_extensions = req_ext
        distinguished_name = dn

        [ dn ]
        C = <country>
        ST = <state>
        L = <city>
        O = <organization>
        OU = <organization unit>
        CN = <MASTER_IP>

        [ req_ext ]
        subjectAltName = @alt_names

        [ alt_names ]
        DNS.1 = kubernetes
        DNS.2 = kubernetes.default
        DNS.3 = kubernetes.default.svc
        DNS.4 = kubernetes.default.svc.cluster
        DNS.5 = kubernetes.default.svc.cluster.local
        IP.1 = <MASTER_IP>
        IP.2 = <MASTER_CLUSTER_IP>

        [ v3_ext ]
        authorityKeyIdentifier=keyid,issuer:always
        basicConstraints=CA:FALSE
        keyUsage=keyEncipherment,dataEncipherment
        extendedKeyUsage=serverAuth,clientAuth
        subjectAltName=@alt_names
1.  設定ファイルに基づいて、証明書署名要求を生成します。

        openssl req -new -key server.key -out server.csr -config csr.conf
1.  ca.key、ca.crt、server.csrを使用してサーバー証明書を生成します。

        openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key \
        -CAcreateserial -out server.crt -days 10000 \
        -extensions v3_ext -extfile csr.conf -sha256
1.  証明書を表示します。

        openssl x509  -noout -text -in ./server.crt

最後にAPIサーバーの起動パラメーターに、同様のパラメーターを追加します。

### cfssl

**cfssl**も証明書を生成するためのツールです。

1.  以下のように、ダウンロードして解凍し、コマンドラインツールを用意します。
    使用しているハードウェアアーキテクチャやcfsslのバージョンに応じて、サンプルコマンドの調整が必要な場合があります。

        curl -L https://github.com/cloudflare/cfssl/releases/download/v1.5.0/cfssl_1.5.0_linux_amd64 -o cfssl
        chmod +x cfssl
        curl -L https://github.com/cloudflare/cfssl/releases/download/v1.5.0/cfssljson_1.5.0_linux_amd64 -o cfssljson
        chmod +x cfssljson
        curl -L https://github.com/cloudflare/cfssl/releases/download/v1.5.0/cfssl-certinfo_1.5.0_linux_amd64 -o cfssl-certinfo
        chmod +x cfssl-certinfo
1.  アーティファクトを保持するディレクトリーを生成し、cfsslを初期化します。

        mkdir cert
        cd cert
        ../cfssl print-defaults config > config.json
        ../cfssl print-defaults csr > csr.json
1.  CAファイルを生成するためのJSON設定ファイル(例: `ca-config.json`)を生成します。

        {
          "signing": {
            "default": {
              "expiry": "8760h"
            },
            "profiles": {
              "kubernetes": {
                "usages": [
                  "signing",
                  "key encipherment",
                  "server auth",
                  "client auth"
                ],
                "expiry": "8760h"
              }
            }
          }
        }
1.  CA証明書署名要求(CSR)用のJSON設定ファイル(例: `ca-csr.json`)を生成します。
    かぎ括弧で囲まれた値は、必ず使用したい実際の値に置き換えてください。

        {
          "CN": "kubernetes",
          "key": {
            "algo": "rsa",
            "size": 2048
          },
          "names":[{
            "C": "<country>",
            "ST": "<state>",
            "L": "<city>",
            "O": "<organization>",
            "OU": "<organization unit>"
          }]
        }
1.  CA鍵(`ca-key.pem`)と証明書(`ca.pem`)を生成します。

        ../cfssl gencert -initca ca-csr.json | ../cfssljson -bare ca
1.  APIサーバーの鍵と証明書を生成するためのJSON設定ファイル(例: `server-csr.json`)を生成します。
    かぎ括弧で囲まれた値は、必ず使用したい実際の値に置き換えてください。
    `MASTER_CLUSTER_IP`の値は、前節で説明したAPIサーバーのサービスクラスターIPです。
    以下の例は、デフォルトのDNSドメイン名として`cluster.local`を使用していることを前提とします。

        {
          "CN": "kubernetes",
          "hosts": [
            "127.0.0.1",
            "<MASTER_IP>",
            "<MASTER_CLUSTER_IP>",
            "kubernetes",
            "kubernetes.default",
            "kubernetes.default.svc",
            "kubernetes.default.svc.cluster",
            "kubernetes.default.svc.cluster.local"
          ],
          "key": {
            "algo": "rsa",
            "size": 2048
          },
          "names": [{
            "C": "<country>",
            "ST": "<state>",
            "L": "<city>",
            "O": "<organization>",
            "OU": "<organization unit>"
          }]
        }
1.  APIサーバーの鍵と証明書を生成します。デフォルトでは、それぞれ`server-key.pem`と`server.pem`というファイルに保存されます。

        ../cfssl gencert -ca=ca.pem -ca-key=ca-key.pem \
        --config=ca-config.json -profile=kubernetes \
        server-csr.json | ../cfssljson -bare server


## 自己署名CA証明書の配布

クライアントノードは、自己署名CA証明書を有効だと認識しないことがあります。
プロダクション用でない場合や、会社のファイアウォールの背後で実行する場合は、自己署名CA証明書をすべてのクライアントに配布し、有効な証明書のローカルリストを更新できます。

各クライアントで、以下の操作を実行します。

```bash
sudo cp ca.crt /usr/local/share/ca-certificates/kubernetes.crt
sudo update-ca-certificates
```

```
Updating certificates in /etc/ssl/certs...
1 added, 0 removed; done.
Running hooks in /etc/ca-certificates/update.d....
done.
```

## 証明書API

`certificates.k8s.io`APIを用いることで、[こちら](/ja/docs/tasks/tls/managing-tls-in-a-cluster)のドキュメントにあるように、認証に使用するx509証明書をプロビジョニングすることができます。
