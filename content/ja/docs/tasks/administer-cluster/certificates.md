---
title: 証明書を手動で生成する
content_type: task
weight: 30
---


<!-- overview -->

クライアント証明書認証を使用する場合、[`easyrsa`](https://github.com/OpenVPN/easy-rsa)、[`openssl`](https://github.com/openssl/openssl)または[`cfssl`](https://github.com/cloudflare/cfssl)を使って手動で証明書を生成することができます。

<!-- body -->

### easyrsa

**easyrsa**はクラスターの証明書を手動で生成することができます。

1. パッチが適用されたバージョンの`easyrsa3`をダウンロードして解凍し、初期化します。

   ```shell
   curl -LO https://dl.k8s.io/easy-rsa/easy-rsa.tar.gz
   tar xzf easy-rsa.tar.gz
   cd easy-rsa-master/easyrsa3
   ./easyrsa init-pki
   ```

1. 新しい認証局(CA)を生成します。
   `--batch`で自動モードに設定します。`--req-cn`はCAの新しいルート証明書のコモンネーム(CN)を指定します。

   ```shell
   ./easyrsa --batch "--req-cn=${MASTER_IP}@`date +%s`" build-ca nopass
   ```

1. サーバー証明書と鍵を生成します。

   引数`--subject-alt-name`は、APIサーバーがアクセス可能なIPとDNS名を設定します。
   `MASTER_CLUSTER_IP`は通常、APIサーバーとコントローラーマネージャーコンポーネントの両方で`--service-cluster-ip-range`引数に指定したサービスCIDRの最初のIPとなります。
   引数`--days`は、証明書の有効期限が切れるまでの日数を設定するために使用します。
   また、以下のサンプルでは、デフォルトのDNSドメイン名として`cluster.local`を使用することを想定しています。

   ```shell
   ./easyrsa --subject-alt-name="IP:${MASTER_IP},"\
   "IP:${MASTER_CLUSTER_IP},"\
   "DNS:kubernetes,"\
   "DNS:kubernetes.default,"\
   "DNS:kubernetes.default.svc,"\
   "DNS:kubernetes.default.svc.cluster,"\
   "DNS:kubernetes.default.svc.cluster.local" \
   --days=10000 \
   build-server-full server nopass
   ```

1. `pki/ca.crt`、`pki/issued/server.crt`、`pki/private/server.key`を自分のディレクトリにコピーします。
1. APIサーバーのスタートパラメーターに以下のパラメーターを記入し、追加します。

   ```shell
   --client-ca-file=/yourdirectory/ca.crt
   --tls-cert-file=/yourdirectory/server.crt
   --tls-private-key-file=/yourdirectory/server.key
   ```

### openssl

**openssl**は、クラスター用の証明書を手動で生成することができます。

1. 2048bitのca.keyを生成します:

   ```shell
   openssl genrsa -out ca.key 2048
   ```

1. ca.keyに従ってca.crtを生成します(`-days`で証明書の有効期限を設定します):

   ```shell
   openssl req -x509 -new -nodes -key ca.key -subj "/CN=${MASTER_IP}" -days 10000 -out ca.crt
   ```

1. 2048bitでserver.keyを生成します:

   ```shell
   openssl genrsa -out server.key 2048
   ```

1. 証明書署名要求(CSR)を生成するための設定ファイルを作成します。

   山括弧で囲まれた値(例:`<MASTER_IP>`)は必ず実際の値に置き換えてから、ファイル(例:`csr.conf`)に保存してください。`MASTER_CLUSTER_IP`の値は、前のサブセクションで説明したように、APIサーバーのサービスクラスターのIPであることに注意してください。また、以下のサンプルでは、デフォルトのDNSドメイン名として`cluster.local`を使用することを想定しています。

   ```ini
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
   ```

1. 設定ファイルに基づき、証明書署名要求を生成します:

   ```shell
   openssl req -new -key server.key -out server.csr -config csr.conf
   ```

1. ca.key、ca.crt、server.csrを使用して、サーバー証明書を生成します:

   ```shell
   openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key \
       -CAcreateserial -out server.crt -days 10000 \
       -extensions v3_ext -extfile csr.conf -sha256
   ```

1. 証明書署名要求を表示します:

   ```shell
   openssl req  -noout -text -in ./server.csr
   ```
   
1. 証明書を表示します:

   ```shell
   openssl x509  -noout -text -in ./server.crt
   ```

最後に、同じパラメーターをAPIサーバーのスタートパラメーターに追加します。

### cfssl

**cfssl**も証明書を生成するためのツールです。

1. 以下のように、コマンドラインツールをダウンロードし、解凍して準備してください。

   なお、サンプルのコマンドは、お使いのハードウェア・アーキテクチャやCFSSLのバージョンに合わせる必要があるかもしれません。

   ```shell
   curl -L https://github.com/cloudflare/cfssl/releases/download/v1.5.0/cfssl_1.5.0_linux_amd64 -o cfssl
   chmod +x cfssl
   curl -L https://github.com/cloudflare/cfssl/releases/download/v1.5.0/cfssljson_1.5.0_linux_amd64 -o cfssljson
   chmod +x cfssljson
   curl -L https://github.com/cloudflare/cfssl/releases/download/v1.5.0/cfssl-certinfo_1.5.0_linux_amd64 -o cfssl-certinfo
   chmod +x cfssl-certinfo
   ```

1. 成果物を格納するディレクトリを作成し、cfsslを初期化します:

   ```shell
   mkdir cert
   cd cert
   ../cfssl print-defaults config > config.json
   ../cfssl print-defaults csr > csr.json
   ```

1. CAファイルを生成するためのJSON設定ファイル、例えば`ca-config.json`を作成します:

   ```json
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
   ```

1. CA証明書署名要求(CSR)用のJSON設定ファイル(例:`ca-csr.json`)を作成します。
   山括弧で囲まれた値は、必ず使用したい実際の値に置き換えてください。

   ```json
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
   ```

1. CAキー(`ca-key.pem`)と証明書(`ca.pem`)を生成します:

   ```shell
   ../cfssl gencert -initca ca-csr.json | ../cfssljson -bare ca
   ```

1. APIサーバーの鍵と証明書を生成するためのJSON設定ファイル、例えば`server-csr.json`を作成します。
   山括弧内の値は、必ず使用したい実際の値に置き換えてください。
   `MASTER_CLUSTER_IP`は、前のサブセクションで説明したように、APIサーバーのサービスクラスターのIPです。
   また、以下のサンプルでは、デフォルトのDNSドメイン名として`cluster.local`を使用することを想定しています。

   ```json
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
   ```

1. APIサーバーの鍵と証明書を生成します。
   デフォルトでは、それぞれ`server-key.pem`と`server.pem`というファイルに保存されます:

   ```shell
   ../cfssl gencert -ca=ca.pem -ca-key=ca-key.pem \
        --config=ca-config.json -profile=kubernetes \
        server-csr.json | ../cfssljson -bare server
   ```

## 自己署名入りCA証明書を配布する

クライアントノードが自己署名入りCA証明書を有効なものとして認識できない場合があります。

非プロダクション環境、または会社のファイアウォールの内側での開発環境であれば、自己署名入りCA証明書をすべてのクライアントに配布し、有効な証明書のローカルリストを更新することができます。

各クライアントで、次の操作を実行します:

```shell
sudo cp ca.crt /usr/local/share/ca-certificates/kubernetes.crt
sudo update-ca-certificates
```

```none
Updating certificates in /etc/ssl/certs...
1 added, 0 removed; done.
Running hooks in /etc/ca-certificates/update.d....
done.
```

## 証明書API

認証に使用するx509証明書のプロビジョニングには`certificates.k8s.io`APIを使用することができます。[クラスターでのTLSの管理](/docs/tasks/tls/managing-tls-in-a-cluster)に記述されています。
