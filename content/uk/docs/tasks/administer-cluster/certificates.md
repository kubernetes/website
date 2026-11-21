---
title: "Генерація сертифікатів вручну"
content_type: task
weight: 30
---

<!-- overview -->

Під час використання автентифікації за допомогою клієнтських сертифікатів ви можете генерувати сертифікати вручну за допомогою [`easyrsa`](https://github.com/OpenVPN/easy-rsa), [`openssl`](https://github.com/openssl/openssl) або [`cfssl`](https://github.com/cloudflare/cfssl).

<!-- body -->

### easyrsa

**easyrsa** може вручну генерувати сертифікати для вашого кластера.

1. Завантажте, розпакуйте та ініціалізуйте виправлену версію `easyrsa3`.

   ```shell
   curl -LO https://dl.k8s.io/easy-rsa/easy-rsa.tar.gz
   tar xzf easy-rsa.tar.gz
   cd easy-rsa-master/easyrsa3
   ./easyrsa init-pki
   ```

1. Згенеруйте новий центр сертифікації (CA). `--batch` встановлює автоматичний режим; `--req-cn` вказує загальну назву (CN, Common Name) для нового кореневого сертифіката CA.

   ```shell
   ./easyrsa --batch "--req-cn=${MASTER_IP}@`date +%s`" build-ca nopass
   ```

1. Згенеруйте сертифікат та ключ сервера.

   Аргумент `--subject-alt-name` встановлює можливі IP-адреси та імена DNS, за якими буде доступний API-сервер. `MASTER_CLUSTER_IP` зазвичай є першою IP-адресою з CIDR для Service, який вказано як аргумент `--service-cluster-ip-range` і для API-сервера, і для компонента менеджера контролерів. Аргумент `--days` використовується для встановлення кількості днів, після яких спливає термін дії сертифіката. У прикладі нижче також припускається, що ви використовуєте `cluster.local` як стандартне доменне імʼя DNS.

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

1. Скопіюйте `pki/ca.crt`, `pki/issued/server.crt` та `pki/private/server.key` у вашу теку.

1. Заповніть і додайте такі параметри до параметрів запуску API-сервера:

   ```shell
   --client-ca-file=/yourdirectory/ca.crt
   --tls-cert-file=/yourdirectory/server.crt
   --tls-private-key-file=/yourdirectory/server.key
   ```

### openssl

**openssl** може вручну генерувати сертифікати для вашого кластера.

1. Згенеруйте 2048-бітний ca.key:

   ```shell
   openssl genrsa -out ca.key 2048
   ```

1. На основі ca.key згенеруйте ca.crt (використовуйте `-days`, щоб встановити термін дії сертифіката):

   ```shell
   openssl req -x509 -new -noenc -key ca.key -subj "/CN=${MASTER_IP}" -days 10000 -out ca.crt
   ```

1. Згенеруйте 2048-бітний server.key:

   ```shell
   openssl genrsa -out server.key 2048
   ```

1. Створіть файл конфігурації для генерування запиту на підписання сертифіката (CSR).

   Перед збереженням у файл (наприклад, `csr.conf`) обовʼязково замініть значення в кутових дужках (наприклад, `<MASTER_IP>`) на реальні значення. Зверніть увагу, що значення `MASTER_CLUSTER_IP` — це cluster IP сервісу для API-сервера, як описано в попередньому підрозділі. У прикладі нижче також припускається, що ви використовуєте `cluster.local` як стандартне доменне імʼя DNS.

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

1. Згенеруйте запит на підписання сертифіката на основі файлу конфігурації:

   ```shell
   openssl req -new -key server.key -out server.csr -config csr.conf
   ```

1. Згенеруйте сертифікат сервера, використовуючи ca.key, ca.crt та server.csr:

   ```shell
   openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key \
       -CAcreateserial -out server.crt -days 10000 \
       -extensions v3_ext -extfile csr.conf -sha256
   ```

1. Перегляньте запит на підписання сертифіката:

   ```shell
   openssl req  -noout -text -in ./server.csr
   ```

1. Перегляньте сертифікат:

   ```shell
   openssl x509 -noout -text -in ./server.crt
   ```

1. Заповніть і додайте такі параметри до параметрів запуску API-сервера:

   ```shell
   --client-ca-file=/yourdirectory/ca.crt
   --tls-cert-file=/yourdirectory/server.crt
   --tls-private-key-file=/yourdirectory/server.key
   ```

### cfssl

**cfssl** — ще один інструмент для генерації сертифікатів.

1. Завантажте, розпакуйте та підготуйте інструменти командного рядка, як показано нижче.

   Зверніть увагу, що вам може знадобитися адаптувати приклади команд відповідно до апаратної архітектури та версії cfssl, яку ви використовуєте.

   ```shell
   curl -L https://github.com/cloudflare/cfssl/releases/download/v1.5.0/cfssl_1.5.0_linux_amd64 -o cfssl
   chmod +x cfssl
   curl -L https://github.com/cloudflare/cfssl/releases/download/v1.5.0/cfssljson_1.5.0_linux_amd64 -o cfssljson
   chmod +x cfssljson
   curl -L https://github.com/cloudflare/cfssl/releases/download/v1.5.0/cfssl-certinfo_1.5.0_linux_amd64 -o cfssl-certinfo
   chmod +x cfssl-certinfo
   ```

1. Створіть теку для зберігання артефактів та ініціалізуйте cfssl:

   ```shell
   mkdir cert
   cd cert
   ../cfssl print-defaults config > config.json
   ../cfssl print-defaults csr > csr.json
   ```

1. Створіть файл конфігурації JSON для генерації файлу CA, наприклад, `ca-config.json`:

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

1. Створіть файл конфігурації JSON для запиту на підписання сертифіката (CSR) CA, наприклад, `ca-csr.json`. Обовʼязково замініть значення в кутових дужках на реальні значення, які ви хочете використовувати.

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

1. Згенеруйте ключ CA (`ca-key.pem`) та сертифікат (`ca.pem`):

   ```shell
   ../cfssl gencert -initca ca-csr.json | ../cfssljson -bare ca
   ```

1. Створіть файл конфігурації JSON для генерації ключів та сертифікатів для API-сервера, наприклад, `server-csr.json`. Обовʼязково замініть значення в кутових дужках на реальні значення, які ви хочете використовувати. `<MASTER_CLUSTER_IP>` — це cluster IP сервісу для API-сервера, як описано в попередньому підрозділі. У прикладі нижче також припускається, що ви використовуєте `cluster.local` як стандартне доменне імʼя DNS.

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

1. Згенеруйте ключ та сертифікат для API-сервера, які стандартно зберігаються у файлах `server-key.pem` та `server.pem` відповідно:

   ```shell
   ../cfssl gencert -ca=ca.pem -ca-key=ca-key.pem \
        --config=ca-config.json -profile=kubernetes \
        server-csr.json | ../cfssljson -bare server
   ```

## Розповсюдження самопідписного сертифіката CA {#distributing-self-signed-ca-certificate}

Клієнтський вузол може відмовитися визнавати самопідписний сертифікат CA дійсним. Для непромислового розгортання або для розгортання, яке працює за корпоративним брандмауером, ви можете розповсюдити самопідписний сертифікат CA на всіх клієнтів та оновити локальний список дійсних сертифікатів.

На кожному клієнті виконайте такі дії:

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

## API сертифікатів {#certificates-api}

Ви можете використовувати API `certificates.k8s.io` для надання сертифікатів x509 для автентифікації, як описано на сторінці [Керування TLS у кластері](/docs/tasks/tls/managing-tls-in-a-cluster).
