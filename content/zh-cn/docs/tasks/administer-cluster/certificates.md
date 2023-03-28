---
title: 手动生成证书
content_type: task
weight: 30
---
<!-- 
title: Generate Certificates Manually
content_type: task
weight: 30
-->

<!-- overview -->

<!-- 
When using client certificate authentication, you can generate certificates
manually through [`easyrsa`](https://github.com/OpenVPN/easy-rsa), [`openssl`](https://github.com/openssl/openssl) or [`cfssl`](https://github.com/cloudflare/cfssl).
-->
在使用客户端证书认证的场景下，你可以通过 [`easyrsa`](https://github.com/OpenVPN/easy-rsa)、
[`openssl`](https://github.com/openssl/openssl) 或 [`cfssl`](https://github.com/cloudflare/cfssl)
等工具以手工方式生成证书。

<!-- body -->

### easyrsa

<!-- 
**easyrsa** can manually generate certificates for your cluster.
-->
**easyrsa** 支持以手工方式为你的集群生成证书。

<!-- 
1. Download, unpack, and initialize the patched version of `easyrsa3`.
-->
1. 下载、解压、初始化打过补丁的 `easyrsa3`。

   ```shell
   curl -LO https://dl.k8s.io/easy-rsa/easy-rsa.tar.gz
   tar xzf easy-rsa.tar.gz
   cd easy-rsa-master/easyrsa3
   ./easyrsa init-pki
   ```

<!-- 
1. Generate a new certificate authority (CA). `--batch` sets automatic mode;
   `--req-cn` specifies the Common Name (CN) for the CA's new root certificate.
-->
2. 生成新的证书颁发机构（CA）。参数 `--batch` 用于设置自动模式；
   参数 `--req-cn` 用于设置新的根证书的通用名称（CN）。

   ```shell
   ./easyrsa --batch "--req-cn=${MASTER_IP}@`date +%s`" build-ca nopass
   ```

<!-- 
1. Generate server certificate and key.

   The argument `--subject-alt-name` sets the possible IPs and DNS names the API server will
   be accessed with. The `MASTER_CLUSTER_IP` is usually the first IP from the service CIDR
   that is specified as the `--service-cluster-ip-range` argument for both the API server and
   the controller manager component. The argument `--days` is used to set the number of days
   after which the certificate expires.
   The sample below also assumes that you are using `cluster.local` as the default
   DNS domain name.
-->
3. 生成服务器证书和秘钥。

   参数 `--subject-alt-name` 设置 API 服务器的 IP 和 DNS 名称。
   `MASTER_CLUSTER_IP` 用于 API 服务器和控制器管理器，通常取 CIDR 的第一个 IP，
   由 `--service-cluster-ip-range` 的参数提供。
   参数 `--days` 用于设置证书的过期时间。
   下面的示例假定你的默认 DNS 域名为 `cluster.local`。

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

<!-- 
1. Copy `pki/ca.crt`, `pki/issued/server.crt`, and `pki/private/server.key` to your directory.
-->
4. 拷贝文件 `pki/ca.crt`、`pki/issued/server.crt` 和 `pki/private/server.key` 到你的目录中。

<!--
1. Fill in and add the following parameters into the API server start parameters:
-->
5. 在 API 服务器的启动参数中添加以下参数：

   ```shell
   --client-ca-file=/yourdirectory/ca.crt
   --tls-cert-file=/yourdirectory/server.crt
   --tls-private-key-file=/yourdirectory/server.key
   ```

### openssl

<!-- 
**openssl** can manually generate certificates for your cluster.
-->
**openssl** 支持以手工方式为你的集群生成证书。

<!-- 
1. Generate a ca.key with 2048bit:
-->
1. 生成一个 2048 位的 ca.key 文件

   ```shell
   openssl genrsa -out ca.key 2048
   ```

<!-- 
1. According to the ca.key generate a ca.crt (use `-days` to set the certificate effective time):
-->
2. 在 ca.key 文件的基础上，生成 ca.crt 文件（用参数 `-days` 设置证书有效期）

   ```shell
   openssl req -x509 -new -nodes -key ca.key -subj "/CN=${MASTER_IP}" -days 10000 -out ca.crt
   ```

<!-- 
1. Generate a server.key with 2048bit:
-->
3. 生成一个 2048 位的 server.key 文件：

   ```shell
   openssl genrsa -out server.key 2048
   ```

<!-- 
1. Create a config file for generating a Certificate Signing Request (CSR).

   Be sure to substitute the values marked with angle brackets (e.g. `<MASTER_IP>`)
   with real values before saving this to a file (e.g. `csr.conf`).
   Note that the value for `MASTER_CLUSTER_IP` is the service cluster IP for the
   API server as described in previous subsection.
   The sample below also assumes that you are using `cluster.local` as the default
   DNS domain name.
-->
4. 创建一个用于生成证书签名请求（CSR）的配置文件。
   保存文件（例如：`csr.conf`）前，记得用真实值替换掉尖括号中的值（例如：`<MASTER_IP>`）。
   注意：`MASTER_CLUSTER_IP` 就像前一小节所述，它的值是 API 服务器的服务集群 IP。
   下面的例子假定你的默认 DNS 域名为 `cluster.local`。

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

<!-- 
1. Generate the certificate signing request based on the config file:
-->
5. 基于上面的配置文件生成证书签名请求：

   ```shell
   openssl req -new -key server.key -out server.csr -config csr.conf
   ```

<!-- 
1. Generate the server certificate using the ca.key, ca.crt and server.csr:
-->
6. 基于 ca.key、ca.crt 和 server.csr 等三个文件生成服务端证书：

   ```shell
   openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key \
       -CAcreateserial -out server.crt -days 10000 \
       -extensions v3_ext -extfile csr.conf -sha256
   ```

<!--
1. View the certificate signing request:
-->
7. 查看证书签名请求：

   ```shell
   openssl req  -noout -text -in ./server.csr
   ```

<!-- 
1. View the certificate:
-->
8. 查看证书：

   ```shell
   openssl x509  -noout -text -in ./server.crt
   ```

<!-- 
Finally, add the same parameters into the API server start parameters.
-->
最后，为 API 服务器添加相同的启动参数。

### cfssl

<!-- 
**cfssl** is another tool for certificate generation.
-->
**cfssl** 是另一个用于生成证书的工具。

<!-- 
1. Download, unpack and prepare the command line tools as shown below.

   Note that you may need to adapt the sample commands based on the hardware
   architecture and cfssl version you are using.
-->
1. 下载、解压并准备如下所示的命令行工具。

   注意：你可能需要根据所用的硬件体系架构和 cfssl 版本调整示例命令。

   ```shell
   curl -L https://github.com/cloudflare/cfssl/releases/download/v1.5.0/cfssl_1.5.0_linux_amd64 -o cfssl
   chmod +x cfssl
   curl -L https://github.com/cloudflare/cfssl/releases/download/v1.5.0/cfssljson_1.5.0_linux_amd64 -o cfssljson
   chmod +x cfssljson
   curl -L https://github.com/cloudflare/cfssl/releases/download/v1.5.0/cfssl-certinfo_1.5.0_linux_amd64 -o cfssl-certinfo
   chmod +x cfssl-certinfo
   ```

<!-- 
1. Create a directory to hold the artifacts and initialize cfssl:
-->
2. 创建一个目录，用它保存所生成的构件和初始化 cfssl：

   ```shell
   mkdir cert
   cd cert
   ../cfssl print-defaults config > config.json
   ../cfssl print-defaults csr > csr.json
   ```

<!-- 
1. Create a JSON config file for generating the CA file, for example, `ca-config.json`:
-->
3. 创建一个 JSON 配置文件来生成 CA 文件，例如：`ca-config.json`：

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

<!-- 
1. Create a JSON config file for CA certificate signing request (CSR), for example,
   `ca-csr.json`. Be sure to replace the values marked with angle brackets with
   real values you want to use.
-->
4. 创建一个 JSON 配置文件，用于 CA 证书签名请求（CSR），例如：`ca-csr.json`。
   确认用你需要的值替换掉尖括号中的值。

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

<!-- 
1. Generate CA key (`ca-key.pem`) and certificate (`ca.pem`):
-->
5. 生成 CA 秘钥文件（`ca-key.pem`）和证书文件（`ca.pem`）：

   ```shell
   ../cfssl gencert -initca ca-csr.json | ../cfssljson -bare ca
   ```

<!-- 
1. Create a JSON config file for generating keys and certificates for the API
   server, for example, `server-csr.json`. Be sure to replace the values in angle brackets with
   real values you want to use. The `<MASTER_CLUSTER_IP>` is the service cluster
   IP for the API server as described in previous subsection.
   The sample below also assumes that you are using `cluster.local` as the default
   DNS domain name.
-->
6. 创建一个 JSON 配置文件，用来为 API 服务器生成秘钥和证书，例如：`server-csr.json`。
   确认用你需要的值替换掉尖括号中的值。`MASTER_CLUSTER_IP` 是为 API 服务器 指定的服务集群 IP，就像前面小节描述的那样。
   以下示例假定你的默认 DNS 域名为`cluster.local`。

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

<!-- 
1. Generate the key and certificate for the API server, which are by default
   saved into file `server-key.pem` and `server.pem` respectively:
-->
7. 为 API 服务器生成秘钥和证书，默认会分别存储为`server-key.pem` 和 `server.pem` 两个文件。

   ```shell
   ../cfssl gencert -ca=ca.pem -ca-key=ca-key.pem \
        --config=ca-config.json -profile=kubernetes \
        server-csr.json | ../cfssljson -bare server
   ```

<!-- 
## Distributing Self-Signed CA Certificate
-->
## 分发自签名的 CA 证书   {#distributing-self-signed-ca-certificate}

<!-- 
A client node may refuse to recognize a self-signed CA certificate as valid.
For a non-production deployment, or for a deployment that runs behind a company
firewall, you can distribute a self-signed CA certificate to all clients and
refresh the local list for valid certificates.

On each client, perform the following operations:
-->
客户端节点可能不认可自签名 CA 证书的有效性。
对于非生产环境，或者运行在公司防火墙后的环境，你可以分发自签名的 CA 证书到所有客户节点，并刷新本地列表以使证书生效。

在每一个客户节点，执行以下操作：

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

<!-- 
## Certificates API
-->
## 证书 API   {#certificates-api}

<!-- 
You can use the `certificates.k8s.io` API to provision
x509 certificates to use for authentication as documented
in the [Managing TLS in a cluster](/docs/tasks/tls/managing-tls-in-a-cluster)
task page.
-->
你可以通过 `certificates.k8s.io` API 提供 x509 证书，用来做身份验证，
如[管理集群中的 TLS 认证](/zh-cn/docs/tasks/tls/managing-tls-in-a-cluster)文档所述。

