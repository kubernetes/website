---
title: Управління TLS сертифікатами в кластері
content_type: task
---

<!-- overview -->

Kubernetes надає API `certificates.k8s.io`, який дозволяє вам отримувати TLS сертифікати, підписані Центром Сертифікації (CA), який ви контролюєте. Ці CA та сертифікати можуть використовуватися вашими робочими навантаженнями для встановлення довіри.

API `certificates.k8s.io` використовує протокол, подібний до [чернетки ACME](https://github.com/ietf-wg-acme/acme/).

{{< note >}}
Сертифікати, створені за допомогою API `certificates.k8s.io`, підписуються
[спеціальним CA](#configuring-your-cluster-to-provide-signing). Можливо налаштувати ваш кластер так, щоб використовувати кореневий кластерний CA для цієї мети, але не слід на це покладатися. Не припускайте, що ці сертифікати будуть перевірятися кореневим кластерним CA.
{{< /note >}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

Вам потрібен інструмент `cfssl`. Ви можете завантажити `cfssl` з
[https://github.com/cloudflare/cfssl/releases](https://github.com/cloudflare/cfssl/releases).

Деякі кроки на цій сторінці використовують інструмент `jq`. Якщо у вас його немає, ви можете встановити його через джерела програмного забезпечення вашої операційної системи або завантажити з [https://jqlang.github.io/jq/](https://jqlang.github.io/jq/).

<!-- steps -->

## Довіра до TLS в кластері {#trusting-tls-in-a-cluster}

Довіра до [власного CA](#configuring-your-cluster-to-provide-signing) з боку застосунків, що працюють як Podʼи, зазвичай вимагає додаткової конфігурації. Вам потрібно додати пакет сертифікатів CA до списку сертифікатів CA, яким довіряє TLS клієнт або сервер. Наприклад, ви можете зробити це за допомогою налаштування TLS в Golang, проаналізувавши ланцюжок сертифікатів і додавши проаналізовані сертифікати до поля `RootCAs` в структурі [`tls.Config`](https://pkg.go.dev/crypto/tls#Config).

{{< note >}}
Навіть якщо власний сертифікат CA може бути включений у файлову систему (в ConfigMap `kube-root-ca.crt`), не слід використовувати цей центр сертифікації для будь-якої мети, окрім перевірки внутрішніх точок доступу Kubernetes. Прикладом внутрішньої точки доступу Kubernetes є
Service з іменем `kubernetes` в просторі імен default. Якщо ви хочете використовувати власний центр сертифікації для ваших робочих навантажень, слід створити цей CA окремо та розповсюдити його сертифікат CA за допомогою [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap), до якого ваші Podʼи мають доступ для читання.
{{< /note >}}

## Запит сертифіката {#requesting-a-certificate}

Наступний розділ демонструє, як створити TLS сертифікат для Kubernetes сервісу, до якого звертаються через DNS.

{{< note >}}
Цей підручник використовує CFSSL: інструментарій PKI та TLS від Cloudflare [натисніть тут](https://blog.cloudflare.com/introducing-cfssl/), щоб дізнатися більше.
{{< /note >}}

## Створення запиту на підписання сертифіката {#creating-a-certificate-signing-request}

Згенеруйте приватний ключ і запит на підписання сертифіката (або CSR), виконавши наступну команду:

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

Де `192.0.2.24` — це кластерний IP Serviceʼу, `my-svc.my-namespace.svc.cluster.local` — це DNS-імʼя Serviceʼу, `10.0.34.2` —це IP Podʼа, а `my-pod.my-namespace.pod.cluster.local` — це DNS-імʼя Podʼа. Ви повинні побачити вивід подібний до:

```none
2022/02/01 11:45:32 [INFO] generate received request
2022/02/01 11:45:32 [INFO] received CSR
2022/02/01 11:45:32 [INFO] generating key: ecdsa-256
2022/02/01 11:45:32 [INFO] encoded CSR
```

Ця команда генерує два файли; `server.csr`, що містить PEM закодований [PKCS#10](https://tools.ietf.org/html/rfc2986) запит на сертифікат, і `server-key.pem`, що містить PEM закодований ключ до сертифіката, який ще потрібно створити.

## Створення обʼєкта CertificateSigningRequest для надсилання до Kubernetes API {#creating-a-certificatesigningrequest-object-to-send-to-the-kubernetes-api}

Згенеруйте маніфест CSR (у форматі YAML) і надішліть його на сервер API. Ви можете зробити це, виконавши наступну команду:

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

Зверніть увагу, що файл `server.csr`, створений на кроці 1, кодується base64 та зберігається в полі `.spec.request`. Ви також запитуєте сертифікат з використанням ключів "digital signature", "key encipherment" і "server auth", підписаний підписувачем `example.com/serving`. Повинен бути запитаний конкретний `signerName`. Перегляньте документацію для [підтримуваних імен підписувачів](/docs/reference/access-authn-authz/certificate-signing-requests/#signers) для отримання додаткової інформації.

CSR тепер має бути видимий з API у стані Pending. Ви можете побачити це, виконавши:

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

Схвалення [запиту на підписання сертифіката](/docs/reference/access-authn-authz/certificate-signing-requests/) виконується або автоматичною процедурою схвалення, або одноразово адміністратором кластера. Якщо у вас є дозвіл на схвалення запиту на сертифікат, ви можете зробити це вручну за допомогою `kubectl`; наприклад:

```shell
kubectl certificate approve my-svc.my-namespace
```

```none
certificatesigningrequest.certificates.k8s.io/my-svc.my-namespace approved
```

Ви тепер повинні побачити наступне:

```shell
kubectl get csr
```

```none
NAME                  AGE   SIGNERNAME            REQUEST

OR              REQUESTEDDURATION   CONDITION
my-svc.my-namespace   10m   example.com/serving   yourname@example.com   <none>              Approved
```

Це означає, що запит на сертифікат був схвалений і чекає на
підписання запрошеним підписувачем.

## Підписання CertificateSigningRequest {#sign-the-certificate-signing-request}

Далі ви зіграєте роль підписувача сертифікатів, видасте сертифікат і завантажите його в API.

Підписувач зазвичай спостерігає за API CertificateSigningRequest для обʼєктів з його `signerName`, перевіряє, що вони були схвалені, підписує сертифікати для цих запитів, і оновлює статус обʼєкта API з виданим сертифікатом.

### Створення Центру Сертифікації {#creating-a-certificate-authority}

Вам потрібен центр сертифікації, щоб забезпечити цифровий підпис нового сертифікату.

Спочатку створіть підписний сертифікат, виконавши наступне:

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

Ви повинні побачити вивід подібний до:

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

Використовуйте конфігурацію для підпису `server-signing-config.json` та файл ключа центру сертифікації та сертифікат для підпису запиту на сертифікат:

```shell
kubectl get csr my-svc.my-namespace -o jsonpath='{.spec.request}' | \
  base64 --decode | \
  cfssl sign -ca ca.pem -ca-key ca-key.pem -config server-signing-config.json - | \
  cfssljson -bare ca-signed-server
```

Ви повинні побачити вивід подібний до:

```none
2022/02/01 11:52:26 [INFO] signed certificate with serial number 576048928624926584381415936700914530534472870337
```

Це створює файл підписаного серверного сертифіката, `ca-signed-server.pem`.

### Завантаження підписаного сертифіката {#upload-the-signed-certificate}

Нарешті, вкажіть підписаний сертифікат у статусі обʼєкта API:

```shell
kubectl get csr my-svc.my-namespace -o json | \
  jq '.status.certificate = "'$(base64 ca-signed-server.pem | tr -d '\n')'"' | \
  kubectl replace --raw /apis/certificates.k8s.io/v1/certificatesigningrequests/my-svc.my-namespace/status -f -
```

{{< note >}}
Це використовує інструмент [`jq`](https://jqlang.github.io/jq/) для заповнення вмісту, закодованого base64, в поле `.status.certificate`. Якщо у вас немає `jq`, ви також можете зберегти вивід JSON у файл, вручну заповнити це поле і завантажити отриманий файл.
{{< /note >}}

Після схвалення CSR і завантаження підписаного сертифіката, виконайте:

```shell
kubectl get csr
```

Вивід буде подібним до:

```none
NAME                  AGE   SIGNERNAME            REQUESTOR              REQUESTEDDURATION   CONDITION
my-svc.my-namespace   20m   example.com/serving   yourname@example.com   <none>              Approved,Issued
```

## Завантаження сертифіката та його використання {#download-the-certificate-and-use-it}

Тепер, як запитувач, ви можете завантажити виданий сертифікат і зберегти його у файл `server.crt`, виконавши наступне:

```shell
kubectl get csr my-svc.my-namespace -o jsonpath='{.status.certificate}' \
    | base64 --decode > server.crt
```

Тепер ви можете заповнити `server.crt` і `server-key.pem` у {{< glossary_tooltip text="Секрет" term_id="secret" >}}, який ви можете пізніше монтувати в Pod (наприклад, для використання з вебсервером,
який обслуговує HTTPS).

```shell
kubectl create secret tls server --cert server.crt --key server-key.pem
```

```none
secret/server created
```

Нарешті, ви можете заповнити `ca.pem` у {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} і використовувати його як кореневий довірчий сертифікат для перевірки серверного сертифіката:

```shell
kubectl create configmap example-serving-ca --from-file ca.crt=ca.pem
```

```none
configmap/example-serving-ca created
```

## Схвалення CertificateSigningRequests {#approving-certificate-signing-requests}

Адміністратор Kubernetes (з відповідними дозволами) може вручну схвалювати
(або відхиляти) CertificateSigningRequests за допомогою команд `kubectl certificate approve` та `kubectl certificate deny`. Однак, якщо ви плануєте активно використовувати цей API, варто розглянути можливість написання автоматизованого контролера сертифікатів.

{{< caution >}}
Можливість схвалювати CSR вирішує, хто кому довіряє у вашому середовищі. Це повноваження не слід надавати широко або легковажно.

Слід переконатися, що ви впевнено розумієте як вимоги щодо перевірки, так і наслідки видачі конкретного сертифіката перед тим, як надати дозвіл на `approve`.
{{< /caution >}}

Чи це буде машина або людина, яка використовує kubectl, роль _схвалювача_ полягає у перевірці, що CSR відповідає двом вимогам:

1. Субʼєкт CSR контролює приватний ключ, який використовується для підписання CSR. Це зменшує ризик того, що є третя сторона, яка видає себе за авторизованого субʼєкта. У вищезазначеному прикладі цей крок передбачає перевірку того, що Pod контролює приватний ключ, який використовується для створення CSR.
2. Субʼєкт CSR має право діяти в запитуваному контексті. Це зменшує ризик появи небажаного субʼєкта, який приєднується до кластера. У вищезазначеному прикладі цей крок передбачає перевірку того, що Pod має дозвіл на участь у запитуваному сервісі.

Якщо і тільки якщо ці дві вимоги виконані, схвалювач повинен схвалити CSR інакше він повинен відхилити CSR.

Для отримання додаткової інформації про схвалення сертифікатів та контроль доступу, прочитайте сторінку довідника [Запити на підписання сертифікатів](/docs/reference/access-authn-authz/certificate-signing-requests/).

## Налаштування вашого кластера для виконання накладання підписів {#configuring-your-cluster-to-provide-signing}

Ця сторінка припускає, що підписувач налаштований для обслуговування API сертифікатів. Менеджер контролерів Kubernetes надає стандартну реалізацію підписувача. Щоб увімкнути його, передайте параметри `--cluster-signing-cert-file` та  `--cluster-signing-key-file` до менеджера контролерів з шляхами до пари ключів вашого центру сертифікації.
