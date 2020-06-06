---
title: Certificates
content_template: templates/concept
weight: 20
---


{{% capture overview %}}

Ao usar um client para autenticação de certificado, você pode gerar certificados
manualmente através `easyrsa`, `openssl` ou `cfssl`.

{{% /capture %}}


{{% capture body %}}

### easyrsa

**easyrsa** pode gerar manualmente certificados para o seu cluster.

1.  Baixe, descompacte e inicialize a versão corrigida do easyrsa3.

        curl -LO https://storage.googleapis.com/kubernetes-release/easy-rsa/easy-rsa.tar.gz
        tar xzf easy-rsa.tar.gz
        cd easy-rsa-master/easyrsa3
        ./easyrsa init-pki
1.  Gerar o CA. (`--batch` set automatic mode. `--req-cn` default CN to use.)

        ./easyrsa --batch "--req-cn=${MASTER_IP}@`date +%s`" build-ca nopass
1.  Gere o certificado e a chave do servidor.
    O argumento `--subject-alt-name` define os possíveis IPs e nomes (DNS) que o servidor de API usará para ser acessado. O `MASTER_CLUSTER_IP` é geralmente o primeiro IP do serviço CIDR que é especificado como argumento em `--service-cluster-ip-range` para o servidor de API e o componente gerenciador do controlador. O argumento `--days` é usado para definir o número de dias após o qual o certificado expira.
    O exemplo abaixo também assume que você está usando `cluster.local` como DNS de domínio padrão

        ./easyrsa --subject-alt-name="IP:${MASTER_IP},"\
        "IP:${MASTER_CLUSTER_IP},"\
        "DNS:kubernetes,"\
        "DNS:kubernetes.default,"\
        "DNS:kubernetes.default.svc,"\
        "DNS:kubernetes.default.svc.cluster,"\
        "DNS:kubernetes.default.svc.cluster.local" \
        --days=10000 \
        build-server-full server nopass
1.  Copie `pki/ca.crt`, `pki/issued/server.crt`, e `pki/private/server.key` para o seu diretório.
1.  Preencha e adicione os seguintes parâmetros aos parâmetros de inicialização do servidor de API:

        --client-ca-file=/yourdirectory/ca.crt
        --tls-cert-file=/yourdirectory/server.crt
        --tls-private-key-file=/yourdirectory/server.key

### openssl

**openssl** pode gerar manualmente certificados para o seu cluster.

1.  Gere um ca.key com 2048bit:

        openssl genrsa -out ca.key 2048
1. De acordo com o ca.key, gere um ca.crt (use -days para definir o tempo efetivo do certificado):

        openssl req -x509 -new -nodes -key ca.key -subj "/CN=${MASTER_IP}" -days 10000 -out ca.crt
1.  Gere um server.key com 2048bit:

        openssl genrsa -out server.key 2048
1.  Crie um arquivo de configuração para gerar uma solicitação de assinatura de certificado (CSR - Certificate Signing Request). Certifique-se de substituir os valores marcados com colchetes angulares (por exemplo, `<MASTER_IP>`) com valores reais antes de salvá-lo em um arquivo (por exemplo, `csr.conf`). Note que o valor para o `MASTER_CLUSTER_IP` é o IP do cluster de serviços para o Servidor de API, conforme descrito na subseção anterior. O exemplo abaixo também assume que você está usando `cluster.local` como DNS de domínio padrão

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
1.  Gere a solicitação de assinatura de certificado com base no arquivo de configuração:

        openssl req -new -key server.key -out server.csr -config csr.conf
1.  Gere o certificado do servidor usando o ca.key, ca.crt e server.csr:

        openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key \
        -CAcreateserial -out server.crt -days 10000 \
        -extensions v3_ext -extfile csr.conf
1.  Veja o certificado:

        openssl x509  -noout -text -in ./server.crt

Por fim, adicione os mesmos parâmetros nos parâmetros iniciais do Servidor de API.

### cfssl

**cfssl** é outra ferramenta para geração de certificados.

1.  Baixe, descompacte e prepare as ferramentas de linha de comando, conforme mostrado abaixo. Observe que você pode precisar adaptar os comandos de exemplo abaixo com base na arquitetura do hardware e versão cfssl que você está usando.

        curl -L https://pkg.cfssl.org/R1.2/cfssl_linux-amd64 -o cfssl
        chmod +x cfssl
        curl -L https://pkg.cfssl.org/R1.2/cfssljson_linux-amd64 -o cfssljson
        chmod +x cfssljson
        curl -L https://pkg.cfssl.org/R1.2/cfssl-certinfo_linux-amd64 -o cfssl-certinfo
        chmod +x cfssl-certinfo
1.  Crie um diretório para conter os artefatos e inicializar o cfssl:

        mkdir cert
        cd cert
        ../cfssl print-defaults config > config.json
        ../cfssl print-defaults csr > csr.json
1.  Crie um arquivo de configuração JSON para gerar o arquivo CA, por exemplo, `ca-config.json`:

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
1.  Crie um arquivo de configuração JSON para o CA  - solicitação de assinatura de certificado (CSR - Certificate Signing Request), por exemplo, `ca-csr.json`. Certifique-se de substituir os valores marcados com colchetes angulares por valores reais que você deseja usar.

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
1.  Gere a chave CA (`ca-key.pem`) e o certificado (` ca.pem`):

        ../cfssl gencert -initca ca-csr.json | ../cfssljson -bare ca
1.  Crie um arquivo de configuração JSON para gerar chaves e certificados para o Servidor de API, por exemplo, `server-csr.json`. Certifique-se de substituir os valores entre colchetes angulares por valores reais que você deseja usar. O `MASTER_CLUSTER_IP` é o IP do serviço do cluster para o servidor da API, conforme descrito na subseção anterior. O exemplo abaixo também assume que você está usando `cluster.local` como DNS de domínio padrão

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
1.  Gere a chave e o certificado para o Servidor de API, que são, por padrão, salvos nos arquivos `server-key.pem` e` server.pem` respectivamente:

        ../cfssl gencert -ca=ca.pem -ca-key=ca-key.pem \
        --config=ca-config.json -profile=kubernetes \
        server-csr.json | ../cfssljson -bare server


## Distribuindo Certificado CA auto assinado

Um nó cliente pode se recusar a reconhecer o certificado CA self-signed como válido.
Para uma implementação de não produção ou para uma instalação que roda atrás de um firewall, você pode distribuir certificados auto-assinados para todos os clientes e atualizar a lista de certificados válidos.

Em cada cliente, execute as seguintes operações:

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

## API de certificados

Você pode usar a API `certificates.k8s.io` para provisionar
certificados x509 a serem usados ​​para autenticação conforme documentado
[aqui](/docs/tasks/tls/managing-tls-in-a-cluster).

{{% /capture %}}
