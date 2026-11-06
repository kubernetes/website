---
title: Видача сертифіката для клієнта API Kubernetes за допомогою CertificateSigningRequest
api_metadata:
- apiVersion: "certificates.k8s.io/v1"
  kind: "CertificateSigningRequest"
  override_link_text: "CSR v1"
weight: 80

# Docs maintenance note
#
# If there is a future page /docs/tasks/tls/certificate-issue-client-manually/ then this page
# should link there, and the new page should link back to this one.
---

<!-- overview -->

Kubernetes дозволяє використовувати інфраструктуру відкритих ключів (PKI) для автентифікації в кластері як клієнт.

Щоб звичайний користувач міг автентифікуватися й викликати API, потрібно виконати кілька кроків. Спочатку цей користувач повинен мати сертифікат [X.509](https://www.itu.int/rec/T-REC-X.509), виданий органом, якому довіряє ваш кластер Kubernetes. Потім клієнт повинен предʼявити цей сертифікат API Kubernetes.

У цьому процесі ви використовуєте [CertificateSigningRequest](/docs/reference/access-authn-authz/certificate-signing-requests/); ви або інший субʼєкт маєте схвалити запит.

Ви створите приватний ключ, потім отримаєте виданий сертифікат і, нарешті, налаштуєте цей приватний ключ для клієнта.

## {{% heading "prerequisites" %}} {#before-you-begin}

* {{< include "task-tutorial-prereqs.md" >}}

* Вам знадобляться утиліти `kubectl`, `openssl` та `base64`.

Ця сторінка передбачає, що ви використовуєте {{< glossary_tooltip term_id="rbac" text="контроль доступу на основі ролей" >}} (RBAC) Kubernetes. Якщо у вас є альтернативні або додаткові механізми безпеки для авторизації, їх також потрібно врахувати.

<!-- steps -->

## Створіть приватний ключ {#create-private-key}

На цьому кроці ви створюєте приватний ключ. Цей приватний ключ потрібно тримати в таємниці; будь-хто, хто ним володіє, може видавати себе за цього користувача.

```shell
# Створіть приватний ключ
openssl genrsa -out myuser.key 3072
```

## Створіть запит на підписання сертифіката X.509 {#create-x.509-certificatessigningrequest}

{{< note >}}
Це не те саме, що API CertificateSigningRequest з подібною назвою; файл, який ви тут генеруєте, передається в CertificateSigningRequest.
{{< /note >}}

Важливо встановити атрибути CN та O для CSR. CN — це імʼя користувача, а O — група, до якої належатиме цей користувач. Стандартні групи описано на сторінці [RBAC](/docs/reference/access-authn-authz/rbac/).

```shell
# Змініть загальне імʼя "myuser" на фактичне імʼя користувача, яке ви хочете використовувати
openssl req -new -key myuser.key -out myuser.csr -subj "/CN=myuser"
```

## Створіть CertificateSigningRequest Kubernetes {#create-k8s-certificatessigningrequest}

Закодуйте документ CSR за допомогою цієї команди:

```shell
cat myuser.csr | base64 | tr -d "\n"
```

Створіть [CertificateSigningRequest](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1/) і надішліть його до кластера Kubernetes за допомогою kubectl. Нижче наведено фрагмент команд оболонки, за допомогою якого можна згенерувати CertificateSigningRequest.

```shell
cat <<EOF | kubectl apply -f -
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
metadata:
  name: myuser # example
spec:
  # Це закодований CSR. Змініть його на вміст myuser.csr у кодуванні base64
  request: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0KTUlJQ1ZqQ0NBVDRDQVFBd0VURVBNQTBHQTFVRUF3d0dZVzVuWld4aE1JSUJJakFOQmdrcWhraUc5dzBCQVFFRgpBQU9DQVE4QU1JSUJDZ0tDQVFFQTByczhJTHRHdTYxakx2dHhWTTJSVlRWMDNHWlJTWWw0dWluVWo4RElaWjBOCnR2MUZtRVFSd3VoaUZsOFEzcWl0Qm0wMUFSMkNJVXBGd2ZzSjZ4MXF3ckJzVkhZbGlBNVhwRVpZM3ExcGswSDQKM3Z3aGJlK1o2MVNrVHF5SVBYUUwrTWM5T1Nsbm0xb0R2N0NtSkZNMUlMRVI3QTVGZnZKOEdFRjJ6dHBoaUlFMwpub1dtdHNZb3JuT2wzc2lHQ2ZGZzR4Zmd4eW8ybmlneFNVekl1bXNnVm9PM2ttT0x1RVF6cXpkakJ3TFJXbWlECklmMXBMWnoyalVnald4UkhCM1gyWnVVV1d1T09PZnpXM01LaE8ybHEvZi9DdS8wYk83c0x0MCt3U2ZMSU91TFcKcW90blZtRmxMMytqTy82WDNDKzBERHk5aUtwbXJjVDBnWGZLemE1dHJRSURBUUFCb0FBd0RRWUpLb1pJaHZjTgpBUUVMQlFBRGdnRUJBR05WdmVIOGR4ZzNvK21VeVRkbmFjVmQ1N24zSkExdnZEU1JWREkyQTZ1eXN3ZFp1L1BVCkkwZXpZWFV0RVNnSk1IRmQycVVNMjNuNVJsSXJ3R0xuUXFISUh5VStWWHhsdnZsRnpNOVpEWllSTmU3QlJvYXgKQVlEdUI5STZXT3FYbkFvczFqRmxNUG5NbFpqdU5kSGxpT1BjTU1oNndLaTZzZFhpVStHYTJ2RUVLY01jSVUyRgpvU2djUWdMYTk0aEpacGk3ZnNMdm1OQUxoT045UHdNMGM1dVJVejV4T0dGMUtCbWRSeEgvbUNOS2JKYjFRQm1HCkkwYitEUEdaTktXTU0xMzhIQXdoV0tkNjVoVHdYOWl4V3ZHMkh4TG1WQzg0L1BHT0tWQW9FNkpsYWFHdTlQVmkKdjlOSjVaZlZrcXdCd0hKbzZXdk9xVlA3SVFjZmg3d0drWm89Ci0tLS0tRU5EIENFUlRJRklDQVRFIFJFUVVFU1QtLS0tLQo=
  signerName: kubernetes.io/kube-apiserver-client
  expirationSeconds: 86400  # one day
  usages:
  - client auth
EOF
```

Також можна створити файл маніфесту YAML і застосувати його за допомогою `kubectl`:

{{% code_sample language="yaml" file="tls/myuser.yaml" %}}

Застосуйте маніфест:

```bash
kubectl apply -f myuser.yaml --server-side
```

Зверніть увагу на кілька моментів:

* `usages` має бути `client auth`.
* `expirationSeconds` можна зробити довшим (наприклад, `864000` для десяти днів) або коротшим (наприклад, `3600` для однієї години). Не можна запитати тривалість менше ніж 10 хвилин.
* `request` — це закодоване в base64 значення вмісту файлу CSR.

## Схваліть CertificateSigningRequest {#approve-certificate-signing-request}

Використайте kubectl, щоб знайти створений вами CSR, і схваліть його вручну.

Отримайте список CSR:

```shell
kubectl get csr
```

Схваліть CSR:

```shell
kubectl certificate approve myuser
```

## Отримайте сертифікат {#get-the-certificate}

Отримайте сертифікат із CSR, щоб перевірити, чи він виглядає правильно.

```shell
kubectl get csr/myuser -o yaml
```

Значення сертифіката міститься у форматі Base64 у `.status.certificate`.

Експортуйте виданий сертифікат з CertificateSigningRequest.

```shell
kubectl get csr myuser -o jsonpath='{.status.certificate}'| base64 -d > myuser.crt
```

## Налаштуйте сертифікат у kubeconfig {#configure-the-certificate-into-kubeconfig}

Наступний крок — додати цього користувача до файлу kubeconfig.

Спочатку потрібно додати нові облікові дані:

```shell
kubectl config set-credentials myuser --client-key=myuser.key --client-certificate=myuser.crt --embed-certs=true

```

Потім потрібно додати контекст:

```shell
kubectl config set-context myuser --cluster=kubernetes --user=myuser
```

Перевірте:

```shell
kubectl --context myuser auth whoami
```

Ви маєте побачити вивід, який підтверджує, що ви — «myuser».

## Створіть Role та RoleBinding {#create-role-and-rolebinding}

{{< note >}}
Якщо ви не використовуєте RBAC Kubernetes, пропустіть цей крок і внесіть відповідні зміни для механізму авторизації, який фактично використовує ваш кластер.
{{< /note >}}

Після створення сертифіката настав час визначити Role і RoleBinding, щоб цей користувач мав доступ до ресурсів кластера Kubernetes.

Це приклад команди для створення Role для цього нового користувача:

```shell
kubectl create role developer --verb=create --verb=get --verb=list --verb=update --verb=delete --resource=pods
```

Еквівалентний YAML:
{{% code_sample language="yaml" file="tls/role.yaml" %}}

Це приклад команди для створення RoleBinding для цього нового користувача:

```shell
kubectl create rolebinding developer-binding-myuser --role=developer --user=myuser
```

Еквівалентний YAML:

{{% code_sample language="yaml" file="tls/rolebinding.yaml" %}}

## {{% heading "whatsnext" %}} {#what-s-next}

* Прочитайте [Керування сертифікатами TLS у кластері](/docs/tasks/tls/managing-tls-in-a-cluster/)
* Докладніше про сам X.509 дивіться в [RFC 5280](https://tools.ietf.org/html/rfc5280#section-3.1), розділ 3.1
* Інформацію про синтаксис запитів на підписання сертифікатів PKCS#10 наведено в [RFC 2986](https://tools.ietf.org/html/rfc2986)
* Прочитайте про [ClusterTrustBundles](/docs/reference/access-authn-authz/certificate-signing-requests/#cluster-trust-bundles)
