---
cn-approvers:
- lichuqiang
title: 证书
---

* TOC
{:toc}

## 创建证书

当使用客户端证书进行认证时，用户可以使用现有部署脚本，或者通过 `easyrsa`、`openssl` 或
`cfssl` 手动生成证书。

### 使用现有部署脚本

**现有部署脚本** 位于
`cluster/saltbase/salt/generate-cert/make-ca-cert.sh`。

执行该脚本时需传入两个参数。 第一个参数为 API 服务器的 IP 地址，第二个参数为对象的候补名称列表，
形如 `IP:<ip地址> 或 DNS:<dns名称>`。

脚本生成三个文件： `ca.crt`、`server.crt` 和 `server.key`。

最后，将以下参数加入到  API 服务器的启动参数中：

```
--client-ca-file=/srv/kubernetes/ca.crt
--tls-cert-file=/srv/kubernetes/server.crt
--tls-private-key-file=/srv/kubernetes/server.key
```

### easyrsa

使用 **easyrsa** 能够手动地为集群生成证书。

1.  下载、解压并初始化 easyrsa3 的补丁版本。

        curl -L -O https://storage.googleapis.com/kubernetes-release/easy-rsa/easy-rsa.tar.gz
        tar xzf easy-rsa.tar.gz
        cd easy-rsa-master/easyrsa3
        ./easyrsa init-pki
1.  生成 CA（通过 `--batch` 参数设置自动模式。 通过 `--req-cn` 设置默认使用的 CN）

        ./easyrsa --batch "--req-cn=${MASTER_IP}@`date +%s`" build-ca nopass
1.  生成服务器证书和密钥。
    参数 `--subject-alt-name` 设置了访问 API 服务器时可能使用的 IP 和 DNS 名称。 `MASTER_CLUSTER_IP`
    通常为 `--service-cluster-ip-range` 参数中指定的服务 CIDR 的 首个 IP 地址，`--service-cluster-ip-range`同时用于
    API 服务器和控制器管理器组件。  `--days` 参数用于设置证书的有效期限。
    下面的示例还假设用户使用 `cluster.local` 作为默认的 DNS 域名。

        ./easyrsa --subject-alt-name="IP:${MASTER_IP}"\
        "IP:${MASTER_CLUSTER_IP},"\
        "DNS:kubernetes,"\
        "DNS:kubernetes.default,"\
        "DNS:kubernetes.default.svc,"\
        "DNS:kubernetes.default.svc.cluster,"\
        "DNS:kubernetes.default.svc.cluster.local" \
        --days=10000 \
        build-server-full server nopass
1.  拷贝 `pki/ca.crt`、 `pki/issued/server.crt` 和 `pki/private/server.key` 至您的目录。
1.  填充并在 API 服务器的启动参数中添加以下参数：

        --client-ca-file=/yourdirectory/ca.crt
        --tls-cert-file=/yourdirectory/server.crt
        --tls-private-key-file=/yourdirectory/server.key

### openssl

使用 **openssl** 能够手动地为集群生成证书。

1.  生成密钥位数为 2048 的 ca.key：

        openssl genrsa -out ca.key 2048
1.  依据 ca.key 生成 ca.crt （使用 -days 参数来设置证书有效时间）：

        openssl req -x509 -new -nodes -key ca.key -subj "/CN=${MASTER_IP}" -days 10000 -out ca.crt
1.  生成密钥位数为 2048 的 server.key：

        openssl genrsa -out server.key 2048
1.  创建用于生成证书签名请求（CSR）的配置文件。
    确保在将其保存至文件（如`csr.conf`）之前将尖括号标记的值（如`<MASTER_IP>`）
    替换为你想使用的真实值。 注意：`MASTER_CLUSTER_IP` 是前面小节中描述的 API 服务器的服务集群 IP
    (service cluster IP)。 下面的示例也假设用户使用 `cluster.local` 作为默认的 DNS 域名。

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
1.  基于配置文件生成证书签名请求：

        openssl req -new -key server.key -out server.csr -config csr.conf
1.  使用 ca.key、ca.crt 和 server.csr 生成服务器证书：

        openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key \
        -CAcreateserial -out server.crt -days 10000 \
        -extensions v3_ext -extfile csr.conf
1.  查看证书：

        openssl x509  -noout -text -in ./server.crt

最后，添加同样的参数到  API 服务器的启动参数中。

### cfssl

**cfssl** 是另一种用来生成证书的工具。

1.  按如下所示的方式下载、解压并准备命令行工具。
    注意：你可能需要基于硬件架构和你所使用的 cfssl 版本对示例命令进行修改。

        curl -LO https://pkg.cfssl.org/R1.2/cfssl_linux-amd64 -o cfssl
        chmod +x cfssl
        curl -LO https://pkg.cfssl.org/R1.2/cfssljson_linux-amd64 -o cfssljson
        chmod +x cfssljson
        curl -LO https://pkg.cfssl.org/R1.2/cfssl-certinfo_linux-amd64 -o cfssl-certinfo
        chmod +x cfssl-certinfo
1.  创建目录来存放物料，并初始化 cfssl：

        mkdir cert
        cd cert
        ../cfssl print-defaults config > config.json
        ../cfssl print-defaults csr > csr.json
1.  创建用来生成 CA 文件的 JSON 配置文件，例如 `ca-config.json`：

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
                  "client auth",
                ],
                "expiry": "8760h"
              }
            }
          }
        }
1.  创建用来生成 CA 证书签名请求（CSR）的 JSON 配置文件，例如 `ca-csr.json`。
    确保将尖括号标记的值替换为你想使用的真实值。

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
            "OU": "<organization unit>",
          }]
        }
1.  生成 CA 密钥（`ca-key.pem`）和证书（`ca.pem`）：

        ../cfssl gencert -initca ca-csr.json | ../cfssljson -bare ca
1.  按如下所示的方式创建用来为 API 服务器生成密钥和证书的 JSON 配置文件。
    确保将尖括号标记的值替换为你想使用的真实值。 `MASTER_CLUSTER_IP` 是前面小节中描述的
    API 服务器的服务集群 IP。 下面的示例也假设用户使用 `cluster.local` 作为默认的 DNS 域名。

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
1.  为 API 服务器生成密钥和证书，生成的秘钥和证书分别默认保存在文件 `server-key.pem`
    和 `server.pem` 中：

        ../cfssl gencert -ca=ca.pem -ca-key=ca-key.pem \
        --config=ca-config.json -profile=kubernetes \
        server-csr.json | ../cfssljson -bare server


## 分发自签名 CA 证书

客户端节点可能拒绝承认自签名 CA 证书有效。
对于非生产环境的部署，或运行在企业防火墙后的部署，用户可以向所有客户端分发自签名 CA 证书，
并刷新本地的有效证书列表。

在每个客户端上执行以下操作：

```bash
$ sudo cp ca.crt /usr/local/share/ca-certificates/kubernetes.crt
$ sudo update-ca-certificates
Updating certificates in /etc/ssl/certs...
1 added, 0 removed; done.
Running hooks in /etc/ca-certificates/update.d....
done.
```

## 证书 API

您可以按照[这里](/docs/tasks/tls/managing-tls-in-a-cluster)记录的方式，
使用 `certificates.k8s.io` API 来准备 x509 证书，用于认证。
