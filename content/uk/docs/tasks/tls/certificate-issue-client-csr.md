---
title: Випуск сертифіката для клієнта Kubernetes API за допомогою CertificateSigningRequest
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

Kubernetes дозволяє використовувати інфраструктуру відкритих ключів (PKI) для автентифікації у кластері в якості клієнта.

Для того, щоб звичайний користувач міг автентифікуватися і викликати API, потрібно виконати кілька кроків. По-перше, цей користувач повинен мати сертифікат [X.509](https://www.itu.int/rec/T-REC-X.509), виданий органом, якому довіряє ваш кластер Kubernetes. Потім клієнт повинен предʼявити цей сертифікат API Kubernetes.

Ви використовуєте запит [CertificateSigningRequest](/docs/reference/access-authn-authz/certificate-signing-requests/) як частину цього процесу, і ви або інша довірена особа маєте схвалити запит.

Ви створите приватний ключ, а потім отримаєте виданий сертифікат і, нарешті, налаштуєте цей приватний ключ для клієнта.

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}}

* Вам знадобляться утиліти `kubectl`, `openssl` та `base64`.

Ця сторінка передбачає, що ви використовуєте Kubernetes {{< glossary_tooltip term_id="rbac" text="контроль доступу на основі ролей" >}} (RBAC). Якщо ви використовуєте альтернативні або додаткові механізми безпеки для авторизації, вам також потрібно врахувати їх.

<!-- steps -->

## Створення приватного ключа {#create-private-key}

На цьому кроці ви створюєте приватний ключ. Ви повинні тримати його в таємниці; будь-хто, хто його має, може видавати себе за користувача.

```shell
# Створіть приватний ключ
openssl genrsa -out myuser.key 3072
```

## Створіть запит на підписання сертифіката X.509 {#create-x.509-certificatessigningrequest}

{{< note >}}
Це не те саме, що API CertificateSigningRequest з подібною назвою; файл, який ви генеруєте тут, входить до CertificateSigningRequest.
{{< /note >}}

Важливо встановити атрибути CN та O для CSR. CN — це імʼя користувача, а O — група, до якої цей користувач буде належати. Ви можете ознайомитися з [RBAC](/docs/reference/access-authn-authz/rbac/) для отримання інформації про стандартні групи.

```shell
# Змініть загальне ім’я "myuser" на фактичне ім’я користувача, яке ви хочете використовувати
openssl req -new -key myuser.key -out myuser.csr -subj "/CN=myuser"
```

## Створіть CertificateSigningRequest Kubernetes {#create-k8s-certificatessigningrequest}

Закодуйте документ CSR, використовуючи цю команду:

```shell
cat myuser.csr | base64 | tr -d "\n"
```

Створіть [CertificateSigningRequest](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1/) та надішліть його до кластера Kubernetes через kubectl. Нижче наведено уривок коду оболонки, який ви можете використати для генерації CertificateSigningRequest.

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

Деякі моменти, на які слід звернути увагу:

* `usages` має бути `client auth` (від імені клієнта)
* `expirationSeconds` можна зробити довшим (наприклад, `864000` для десяти днів) або коротшим (наприклад, `3600` для однієї години). Ви не можете подати запит тривалістю менше ніж 10 хвилин.
* `request` — це закодоване в base64 значення вмісту файлу CSR.

## Схваліть CertificateSigningRequest {#approve-certificate-signing-request}

Використовуйте kubectl, щоб знайти CSR, який ви створили, і вручну схвалити його.

Отримайте список CSR:

```shell
kubectl get csr
```

Схваліть CSR:

```shell
kubectl certificate approve myuser
```

## Отримайте сертифікат {#get-the-certificate}

Отримайте сертифікат із CSR, щоб перевірити, чи виглядає він правильно.

```shell
kubectl get csr/myuser -o yaml
```

Значення сертифікату знаходиться в Base64-кодованому форматі в розділі `.status.certificate`.

Експортуйте виданий сертифікат з CertificateSigningRequest.

```shell
kubectl get csr myuser -o jsonpath='{.status.certificate}'| base64 -d > myuser.crt
```

## Налаштуйте сертифікат у kubeconfig {#configure-the-certificate-into-kubeconfig}

Наступним кроком буде додавання цього користувача до файлу kubeconfig.

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

Ви повинні побачити вивід, який підтверджує, що ви є «myuser».

## Створіть Role та RoleBinding {#create-role-and-rolebinding}

{{< note >}}
Якщо ви не використовуєте Kubernetes RBAC, пропустіть цей крок і внесіть відповідні зміни до механізму авторизації який використовується у вашому кластері.
{{< /note >}}

Після створення сертифіката настав час визначити Role і RoleBinding для цього користувача для доступу до ресурсів кластера Kubernetes.

Це приклад команди для створення Role для цього нового користувача:

```shell
kubectl create role developer --verb=create --verb=get --verb=list --verb=update --verb=delete --resource=pods
```

Це приклад команди для створення RoleBinding для цього нового користувача:

```shell
kubectl create rolebinding developer-binding-myuser --role=developer --user=myuser
```

## {{% heading "whatsnext" %}}

* Прочитайте [Керування сертифікатами TLS у кластері](/docs/tasks/tls/managing-tls-in-a-cluster/)
* Для отримання детальної інформації про сам X.509 зверніться до [RFC 5280](https://tools.ietf.org/html/rfc5280#section-3.1), розділ 3.1
* Інформацію про синтаксис запитів на підписання сертифікатів PKCS#10 наведено в [RFC 2986](https://tools.ietf.org/html/rfc2986)
* Прочитайте про [ClusterTrustBundles](/docs/reference/access-authn-authz/certificate-signing-requests/#cluster-trust-bundles)
