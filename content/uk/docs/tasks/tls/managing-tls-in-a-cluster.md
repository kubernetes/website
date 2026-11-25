---
title: Керування сертифікатами TLS у кластері
content_type: task
---

<!-- overview -->

Kubernetes надає API `certificates.k8s.io`, який дозволяє отримувати сертифікати TLS, підписані центром сертифікації (CA), який ви контролюєте. Ці CA й сертифікати ваші робочі навантаження можуть використовувати для встановлення довіри.

API `certificates.k8s.io` використовує протокол, подібний до [чернетки ACME](https://github.com/ietf-wg-acme/acme/).

{{< note >}}
Сертифікати, створені за допомогою API `certificates.k8s.io`, підписуються [окремим CA](#configuring-your-cluster-to-provide-signing). Кластер можна налаштувати на використання для цього кореневого CA кластера, але ніколи не слід на це покладатися. Не вважайте, що ці сертифікати проходитимуть перевірку кореневим CA кластера.
{{< /note >}}

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

Вам потрібен інструмент `cfssl`. Ви можете завантажити `cfssl` з
[https://github.com/cloudflare/cfssl/releases](https://github.com/cloudflare/cfssl/releases).

Деякі кроки на цій сторінці використовують інструмент `jq`. Якщо у вас немає `jq`, ви можете встановити його із джерел програмного забезпечення вашої операційної системи або завантажити з [https://jqlang.github.io/jq/](https://jqlang.github.io/jq/).

<!-- steps -->

## Довіра до TLS у кластері {#trusting-tls-in-a-cluster}

Довіра до [власного CA](#configuring-your-cluster-to-provide-signing) із застосунку, що працює як Pod, зазвичай потребує додаткової конфігурації застосунку. Потрібно додати набір сертифікатів CA до списку сертифікатів CA, яким довіряє клієнт або сервер TLS. Наприклад, у конфігурації TLS у Golang для цього можна розібрати ланцюжок сертифікатів і додати розібрані сертифікати до поля `RootCAs` у структурі [`tls.Config`](https://pkg.go.dev/crypto/tls#Config).

{{< note >}}
Хоча власний сертифікат CA може бути у файловій системі (у ConfigMap `kube-root-ca.crt`), не слід використовувати цей центр сертифікації для будь-яких цілей, окрім перевірки внутрішніх точок доступу Kubernetes. Приклад внутрішньої точки доступу Kubernetes — Service з назвою `kubernetes` у просторі імен default.

Якщо ви хочете використовувати власний центр сертифікації для робочих навантажень, слід згенерувати цей CA окремо й розповсюдити його сертифікат CA за допомогою [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap), який ваші Podʼи можуть читати.
{{< /note >}}

## Запит сертифіката {#requesting-a-certificate}

У наведеному нижче розділі показано, як створити сертифікат TLS для сервісу Kubernetes, до якого звертаються через DNS.

{{< note >}}
У цьому навчальному матеріалі використовується CFSSL: набір інструментів PKI та TLS від Cloudflare. Докладніше дивіться в статті блогу Cloudflare [Introducing CFSSL - CloudFlare's PKI toolkit](https://blog.cloudflare.com/introducing-cfssl/).
{{< /note >}}

## Створення запиту на підписання сертифіката {#create-a-certificate-signing-request}

Згенеруйте приватний ключ і запит на підписання сертифіката (CSR), виконавши таку команду:

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

Де `192.0.2.24` — кластерний IP сервісу, `my-svc.my-namespace.svc.cluster.local` — DNS-імʼя сервісу, `10.0.34.2` — IP Podʼа, а `my-pod.my-namespace.pod.cluster.local` — DNS-імʼя Podʼа. Ви маєте побачити вивід, подібний до такого:

```
2022/02/01 11:45:32 [INFO] generate received request
2022/02/01 11:45:32 [INFO] received CSR
2022/02/01 11:45:32 [INFO] generating key: ecdsa-256
2022/02/01 11:45:32 [INFO] encoded CSR
```

Ця команда генерує два файли: `server.csr` із запитом на сертифікат [PKCS#10](https://tools.ietf.org/html/rfc2986) у кодуванні PEM і `server-key.pem` із ключем у кодуванні PEM до сертифіката, який ще буде створено.

## Створення обʼєкта CertificateSigningRequest для надсилання до API Kubernetes {#create-a-certificatesigningrequest-object-to-send-to-the-kubernetes-api}

Згенеруйте маніфест CSR (у форматі YAML) і надішліть його на API-сервер. Для цього виконайте таку команду:

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

Зверніть увагу, що файл `server.csr`, створений на кроці 1, закодовано в base64 і поміщено в поле `.spec.request`. Ви також запитуєте сертифікат із використаннями ключа "digital signature", "key encipherment" і "server auth", підписаний прикладом підписувача `example.com/serving`. Потрібно запитати конкретний `signerName`. Докладніше дивіться в документації про [підтримувані назви підписувачів](/docs/reference/access-authn-authz/certificate-signing-requests/#signers).

Тепер CSR має бути видимий в API у стані Pending. Його можна побачити, виконавши:

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

## Отримання схвалення CertificateSigningRequest {#get-the-certificate-signing-request-approved}

Схвалення [запиту на підписання сертифіката](/docs/reference/access-authn-authz/certificate-signing-requests/) виконується або автоматичним процесом схвалення, або разово адміністратором кластера. Якщо ви маєте право схвалювати запити на сертифікати, це можна зробити вручну за допомогою `kubectl`; наприклад:

```shell
kubectl certificate approve my-svc.my-namespace
```

```none
certificatesigningrequest.certificates.k8s.io/my-svc.my-namespace approved
```

Тепер ви маєте побачити таке:

```shell
kubectl get csr
```

```none
NAME                  AGE   SIGNERNAME            REQUESTOR              REQUESTEDDURATION   CONDITION
my-svc.my-namespace   10m   example.com/serving   yourname@example.com   <none>              Approved
```

Це означає, що запит на сертифікат схвалено і він чекає, поки запитаний підписувач його підпише.

## Підписання CertificateSigningRequest {#sign-the-certificate-signing-request}

Далі ви зіграєте роль підписувача сертифікатів, видасте сертифікат і завантажите його в API.

Підписувач зазвичай відстежує в API CertificateSigningRequest обʼєкти зі своїм `signerName`, перевіряє, що їх схвалено, підписує сертифікати для цих запитів і оновлює статус обʼєкта API, додаючи виданий сертифікат.

### Створення центру сертифікації {#create-a-certificate-authority}

Вам потрібен центр сертифікації, який надасть цифровий підпис для нового сертифіката.

Спочатку створіть сертифікат для підписування, виконавши таку команду:

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

Ви маєте побачити вивід, подібний до такого:

```none
2022/02/01 11:50:39 [INFO] generating a new CA key and certificate from CSR
2022/02/01 11:50:39 [INFO] generate received request
2022/02/01 11:50:39 [INFO] received CSR
2022/02/01 11:50:39 [INFO] generating key: rsa-2048
2022/02/01 11:50:39 [INFO] encoded CSR
2022/02/01 11:50:39 [INFO] signed certificate with serial number 263983151013686720899716354349605500797834580472
```

Це створює файл ключа центру сертифікації (`ca-key.pem`) і сертифікат (`ca.pem`).

### Видача сертифіката {#issue-a-certificate}

{{% code_sample file="tls/server-signing-config.json" %}}

Використайте конфігурацію підписування `server-signing-config.json`, а також файл ключа й сертифікат центру сертифікації, щоб підписати запит на сертифікат:

```shell
kubectl get csr my-svc.my-namespace -o jsonpath='{.spec.request}' | \
  base64 --decode | \
  cfssl sign -ca ca.pem -ca-key ca-key.pem -config server-signing-config.json - | \
  cfssljson -bare ca-signed-server
```

Ви маєте побачити вивід, подібний до такого:

```
2022/02/01 11:52:26 [INFO] signed certificate with serial number 576048928624926584381415936700914530534472870337
```

Це створює файл підписаного серверного сертифіката `ca-signed-server.pem`.

### Завантаження підписаного сертифіката {#upload-the-signed-certificate}

Нарешті, додайте підписаний сертифікат до статусу обʼєкта API:

```shell
kubectl get csr my-svc.my-namespace -o json | \
  jq '.status.certificate = "'$(base64 ca-signed-server.pem | tr -d '\n')'"' | \
  kubectl replace --raw /apis/certificates.k8s.io/v1/certificatesigningrequests/my-svc.my-namespace/status -f -
```

{{< note >}}
Тут використовується інструмент командного рядка [`jq`](https://jqlang.github.io/jq/) для заповнення поля `.status.certificate` вмістом, закодованим у base64. Якщо у вас немає `jq`, можна також зберегти вивід JSON у файл, заповнити це поле вручну й завантажити отриманий файл.
{{< /note >}}

Після схвалення CSR і завантаження підписаного сертифіката виконайте:

```shell
kubectl get csr
```

Вивід подібний до такого:

```none
NAME                  AGE   SIGNERNAME            REQUESTOR              REQUESTEDDURATION   CONDITION
my-svc.my-namespace   20m   example.com/serving   yourname@example.com   <none>              Approved,Issued
```

## Завантаження сертифіката та його використання {#download-the-certificate-and-use-it}

Тепер як користувач, що подав запит, ви можете завантажити виданий сертифікат і зберегти його у файл `server.crt`, виконавши таку команду:

```shell
kubectl get csr my-svc.my-namespace -o jsonpath='{.status.certificate}' \
    | base64 --decode > server.crt
```

Тепер ви можете додати `server.crt` і `server-key.pem` до {{< glossary_tooltip text="Secret" term_id="secret" >}}, який пізніше можна змонтувати в Pod (наприклад, для використання з вебсервером, що обслуговує HTTPS).

```shell
kubectl create secret tls server --cert server.crt --key server-key.pem
```

```none
secret/server created
```

Нарешті, ви можете зберегти `ca.pem` у {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} і використовувати його як корінь довіри для перевірки серверного сертифіката:

```shell
kubectl create configmap example-serving-ca --from-file ca.crt=ca.pem
```

```none
configmap/example-serving-ca created
```

## Схвалення CertificateSigningRequests {#approving-certificate-signing-requests}

Адміністратор Kubernetes (з відповідними дозволами) може вручну схвалювати або відхиляти CertificateSigningRequests за допомогою команд `kubectl certificate approve` і `kubectl certificate deny`. Однак якщо ви плануєте активно використовувати цей API, варто розглянути написання автоматизованого контролера сертифікатів.

{{< caution >}}
Можливість схвалювати CSR визначає, хто кому довіряє у вашому середовищі. Цю можливість не слід надавати широко або легковажно.

Перш ніж надати дозвіл `approve`, переконайтеся, що ви впевнено розумієте і вимоги до перевірки, покладені на схвалювача, **і** наслідки видачі конкретного сертифіката.
{{< /caution >}}

Незалежно від того, чи є схвалювач машиною, чи людиною, що використовує kubectl, як описано вище, роль _схвалювача_ полягає в перевірці, що CSR відповідає двом вимогам:

1. Субʼєкт CSR контролює приватний ключ, використаний для підписання CSR. Це усуває загрозу того, що третя сторона видаватиме себе за авторизованого субʼєкта. У наведеному вище прикладі цей крок полягав би в перевірці, що Pod контролює приватний ключ, використаний для генерації CSR.
2. Субʼєкт CSR має право діяти в запитаному контексті. Це усуває загрозу приєднання до кластера небажаного субʼєкта. У наведеному вище прикладі цей крок полягав би в перевірці, що Pod має право брати участь у запитаному сервісі.

Схвалювач має схвалити CSR тоді й лише тоді, коли виконано ці дві вимоги; інакше він має відхилити CSR.

Докладніше про схвалення сертифікатів і контроль доступу читайте на довідковій сторінці [Запити на підписання сертифікатів](/docs/reference/access-authn-authz/certificate-signing-requests/).

## Налаштування кластера для підписування {#configuring-your-cluster-to-provide-signing}

Ця сторінка передбачає, що підписувач налаштований обслуговувати API сертифікатів. Менеджер контролерів Kubernetes надає стандартну реалізацію підписувача. Щоб увімкнути її, передайте менеджеру контролерів параметри `--cluster-signing-cert-file` і `--cluster-signing-key-file` зі шляхами до пари ключів вашого центру сертифікації.
