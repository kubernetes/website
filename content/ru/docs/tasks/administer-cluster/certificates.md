---
title: Генерация сертификатов вручную
content_type: task
weight: 20
---

<!-- overview -->

При аутентификации с помощью клиентского сертификата сертификаты можно генерировать вручную с помощью `easyrsa`, `openssl` или `cfssl`.

<!-- body -->

### easyrsa

**easyrsa** поддерживает ручную генерацию сертификатов для кластера.

1. Скачайте, распакуйте и инициализируйте пропатченную версию `easyrsa3`.

   ```shell
   curl -LO https://dl.k8s.io/easy-rsa/easy-rsa.tar.gz
   tar xzf easy-rsa.tar.gz
   cd easy-rsa-master/easyrsa3
   ./easyrsa init-pki
   ```
1. Создайте новый центр сертификации (certificate authority, CA). `--batch` задает автоматический режим;
   `--req-cn` указывает общее имя (Common Name, CN) для нового корневого сертификата CA.

   ```shell
   ./easyrsa --batch "--req-cn=${MASTER_IP}@`date +%s`" build-ca nopass
   ```

1. Сгенерируйте сертификат и ключ сервера.

   Аргумент `--subject-alt-name` задает допустимые IP-адреса и DNS-имена, с которых будет осуществляться доступ к серверу API. `MASTER_CLUSTER_IP` обычно является первым IP из CIDR сервиса, который указан в качестве аргумента `--service-cluster-ip-range` как для сервера API, так и для менеджера контроллеров. Аргумент `--days` задает количество дней, через которое истекает срок действия сертификата. В приведенном ниже примере предполагается, что `cluster.local` используется в качестве доменного имени по умолчанию.
   
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

1. Скопируйте `pki/ca.crt`, `pki/issued/server.crt` и `pki/private/server.key` в свою директорию.

1. Заполните и добавьте следующие параметры в параметры запуска сервера API:

   ```shell
   --client-ca-file=/yourdirectory/ca.crt
   --tls-cert-file=/yourdirectory/server.crt
   --tls-private-key-file=/yourdirectory/server.key
   ```

### openssl

**openssl** поддерживает ручную генерацию сертификатов для кластера.

1. Сгенерируйте 2048-разрядный ключ ca.key:

   ```shell
   openssl genrsa -out ca.key 2048
   ```

1. На основе ca.key сгенерируйте ca.crt (используйте `-days` для установки времени действия сертификата):

   ```shell
   openssl req -x509 -new -nodes -key ca.key -subj "/CN=${MASTER_IP}" -days 10000 -out ca.crt
   ```

1. Сгенерируйте 2048-битный ключ server.key:

   ```shell
   openssl genrsa -out server.key 2048
   ```

1. Создайте файл конфигурации для генерации запроса на подписание сертификата (Certificate Signing Request, CSR).

   Замените значения, помеченные угловыми скобками (например, `<MASTER_IP>`), нужными значениями перед сохранением в файл (например, `csr.conf`). Обратите внимание, что значение для `MASTER_CLUSTER_IP` – это cluster IP сервиса для сервера API, как описано в предыдущем подразделе. В приведенном ниже примере предполагается, что `cluster.local` используется в качестве доменного имени по умолчанию.

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

1. Сгенерируйте запрос на подписание сертификата, используя файл конфигурации:

   ```shell
   openssl req -new -key server.key -out server.csr -config csr.conf
   ```

1. С помощью ca.key, ca.crt и server.csr сгенерируйте сертификат сервера:

   ```shell
   openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key \
       -CAcreateserial -out server.crt -days 10000 \
       -extensions v3_ext -extfile csr.conf  -sha256
   ```

1. Используйте следующую команду, чтобы просмотреть запрос на подписание сертификата:

   ```shell
   openssl req  -noout -text -in ./server.csr
   ```

1. Используйте следующую команду, чтобы просмотреть сертификат:

   ```shell
   openssl x509  -noout -text -in ./server.crt
   ```

Наконец, добавьте эти параметры в конфигурацию запуска сервера API.

### cfssl

**cfssl** – еще один инструмент для генерации сертификатов.

1. Скачайте, распакуйте и подготовьте пакеты, как показано ниже.

   Обратите внимание, что команды необходимо адаптировать под архитектуру и используемую версию cfssl.

   ```shell
   curl -L https://github.com/cloudflare/cfssl/releases/download/v1.5.0/cfssl_1.5.0_linux_amd64 -o cfssl
   chmod +x cfssl
   curl -L https://github.com/cloudflare/cfssl/releases/download/v1.5.0/cfssljson_1.5.0_linux_amd64 -o cfssljson
   chmod +x cfssljson
   curl -L https://github.com/cloudflare/cfssl/releases/download/v1.5.0/cfssl-certinfo_1.5.0_linux_amd64 -o cfssl-certinfo
   chmod +x cfssl-certinfo
   ```

1. Создайте директорию для хранения артефактов и инициализируйте cfssl:

   ```shell
   mkdir cert
   cd cert
   ../cfssl print-defaults config > config.json
   ../cfssl print-defaults csr > csr.json
   ```

1. Создайте JSON-конфиг для генерации файла CA (например, `ca-config.json`):

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

1. Создайте JSON-конфиг для запроса на подписание сертификата (CSR) (например,
   `ca-csr.json`). Замените значения, помеченные угловыми скобками, на нужные.

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

1. Сгенерируйте ключ CA (`ca-key.pem`) и сертификат (`ca.pem`):

   ```shell
   ../cfssl gencert -initca ca-csr.json | ../cfssljson -bare ca
   ```

1. Создайте конфигурационный JSON-файл для генерации ключей и сертификатов для сервера API (например, `server-csr.json`). Замените значения, помеченные угловыми скобками, на нужные. `MASTER_CLUSTER_IP` – это cluster IP сервиса для сервера API, как описано в предыдущем подразделе. В приведенном ниже примере предполагается, что `cluster.local` используется в качестве доменного имени по умолчанию.

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

1. Сгенерируйте ключ и сертификат для сервера API (по умолчанию они сохраняются в файлах `server-key.pem` и `server.pem` соответственно):

   ```shell
   ../cfssl gencert -ca=ca.pem -ca-key=ca-key.pem \
        --config=ca-config.json -profile=kubernetes \
        server-csr.json | ../cfssljson -bare server
   ```

## Распространение самоподписанного сертификата CA

Клиентский узел может отказаться признавать самоподписанный сертификат CA действительным. В случае его использования не в production или в инсталляциях, защищенных межсетевым экраном, самоподписанный сертификат CA можно распространить среди всех клиентов и обновить локальный список действительных сертификатов.

Для этого на каждом клиенте выполните следующие операции:

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

## API для сертификатов

Для создания сертификатов x509, которые будут использоваться для аутентификации, можно воспользоваться API `certificates.k8s.io`. Для дополнительной информации см. [Управление TLS-сертификатами в кластере](/docs/tasks/tls/managing-tls-in-a-cluster).
