---
title: "Генерація сертифікатів вручну"
content_type: task
weight: 30
---

<!-- overview -->

При використанні автентифікації сертифіката клієнта ви можете генерувати сертифікати вручну за допомогою [`easyrsa`](https://github.com/OpenVPN/easy-rsa), [`openssl`](https://github.com/openssl/openssl) або [`cfssl`](https://github.com/cloudflare/cfssl).

<!-- body -->

### easyrsa

З **easyrsa** ви можете вручну генерувати сертифікати для вашого кластера.

1. Завантажте, розпакуйте та ініціалізуйте патчену версію `easyrsa3`.

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

   Аргумент `--subject-alt-name` встановлює можливі IP-адреси та імена DNS, за якими буде доступний сервер API. `MASTER_CLUSTER_IP` зазвичай є першою IP-адресою з діапазону служб CIDR, який вказаний як аргумент `--service-cluster-ip-range` для сервера API та компонента керування контролером. Аргумент `--days` використовується для встановлення кількості днів чинності сертифіката. У прикладі нижче також припускається, що ви використовуєте `cluster.local` як типове імʼя домену DNS.

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

1. Заповніть та додайте наступні параметри до параметрів запуску сервера API:

   ```shell
   --client-ca-file=/yourdirectory/ca.crt
   --tls-cert-file=/yourdirectory/server.crt
   --tls-private-key-file=/yourdirectory/server.key
   ```

### openssl

Ви також можете вручну генерувати сертифікати за допомогою **openssl**.

1. Згенеруйте 2048-бітний ca.key :

   ```shell
   openssl genrsa -out ca.key 2048
   ```

2. Згенеруйте ca.crt для ca.key (використовуйте `-days` для встановлення кількості днів чинності сертифіката):

   ```shell
   openssl req -x509 -new -nodes -key ca.key -subj "/CN=${MASTER_IP}" -days 10000 -out ca.crt
   ```

3. Згенеруйте 2048-бітний server.key:

   ```shell
   openssl genrsa -out server.key 2048
   ```

4. Створіть конфігураційний файл для генерування Certificate Signing Request (CSR).

   Переконайтеся, що ви встановили власні значення для параметрів в кутових дужках, наприклад `<MASTER_IP>`, замінивши їх на власні значення перед збереженням файлу, наприклад з назвою `csr.conf`. Зауважте, що значення `<MASTER_CLUSTER_IP>` є IP-адресою API-сервера, як про це йдеться в попередньому розділі. Приклад конфігураційного файлу нижче використовує `cluster.local` як типове імʼя домену DNS.

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

5. Згенеруйте Certificate Signing Request (CSR) на основі конфігураційного файлу:

   ```shell
   openssl req -new -key server.key -out server.csr -config csr.conf
   ```

6. Згенеруйте сертифікат сервера, використовуючи ca.key, ca.crt та server.csr:

   ```shell
   openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key \
       -CAcreateserial -out server.crt -days 10000 \
       -extensions v3_ext -extfile csr.conf -sha256
   ```

7. Перегляньте запит на підписання сертифіката:

   ```shell
   openssl req  -noout -text -in ./server.csr
   ```

8. Перегляньте сертифікат:

   ```shell
   openssl x509 -noout -text -in ./server.crt
   ```

Нарешті, додайте ті ж самі параметри до параметрів запуску сервера API.

### cfssl

Ви також можете вручну генерувати сертифікати за допомогою **cfssl**.

1. Завантажте, розпакуйте та підготуйте інструменти як показано нижче

   ```shell
   curl -L https://github.com/cloudflare/cfssl/releases/download/v1.5.0/cfssl_1.5.0_linux_amd64 -o cfssl
   chmod +x cfssl
   curl -L https://github.com/cloudflare/cfssl/releases/download/v1.5.0/cfssljson_1.5.0_linux_amd64 -o cfssljson
   chmod +x cfssljson
   curl -L https://github.com/cloudflare/cfssl/releases/download/v1.5.0/cfssl-certinfo_1.5.0_linux_amd64 -o cfssl-certinfo
   chmod +x cfssl-certinfo
   ```

2. Створіть теку для зберігання артифактів та ініціалізації cfssl:

   ```shell
   mkdir cert
   cd cert
   ../cfssl print-defaults config > config.json
   ../cfssl print-defaults csr > csr.json
   ```

3. Створіть конфігураційний файл JSON для генерації файлу CA, наприклад, `ca-config.json`:

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

4. Створіть конфігураційний файл JSON для генерації Certificate Signing Request (CSR), наприклад, `ca-csr.json`. Переконайтеся, що ви встановили власні значення для параметрів в кутових дужках.

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

5. Згенеруйте сертифікат CA (`ca.pem`) та ключ CA (`ca-key.pem`):

   ```shell
   ../cfssl gencert -initca ca-csr.json | ../cfssljson -bare ca
   ```

6. Створіть конфігураційний файл JSON для генерації ключів та сертифікатів для сервера API, наприклад, `server-csr.json`. Переконайтеся, що ви встановили власні значення для параметрів в кутових дужках. `<MASTER_CLUSTER_IP>` є IP-адресою кластера, як про це йдеться в попередньому розділі. В прикладі нижче також припускається, що ви використовуєте `cluster.local` як типове імʼя домену DNS.

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

7. Згенеруйте ключ та сертифікат для сервера API, які типово зберігаються у файлах `server-key.pem` та `server.pem`, відповідно:

   ```shell
   ../cfssl gencert -ca=ca.pem -ca-key=ca-key.pem \
        --config=ca-config.json -profile=kubernetes \
        server-csr.json | ../cfssljson -bare server
   ```

## Розповсюдження самопідписних сертифікатів CA {#distribute-self-signed-ca-certificates}

Клієнтський вузол може не визнавати самопідписні сертифікати CA. Для оточення, що не є операційним, або для операційного оточення, що працює за корпоративним фаєрволом, ви можете розповсюджувати самопідписні сертифікати CA на всіх клієнтів та оновлювати перелік довірених сертифікатів.

На кожному клієнті виконайте наступні кроки:

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

Ви можете використовувати `certificates.k8s.io` API для надання сертифікатів x509 для використання для автентифікації, як про це йдеться на сторінці [Керування TLS в кластері](/docs/tasks/tls/managing-tls-in-a-cluster/).
