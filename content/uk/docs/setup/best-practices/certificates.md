---
title: Сертифікати PKI та вимоги
content_type: concept
weight: 50
---

<!-- overview -->

Kubernetes потребує сертифікатів PKI для автентифікації через TLS. Якщо ви встановлюєте Kubernetes за допомогою [kubeadm](/docs/reference/setup-tools/kubeadm/), сертифікати, потрібні вашому кластеру, генеруються автоматично. Ви також можете згенерувати власні сертифікати, наприклад, щоб надійніше захистити приватні ключі, не зберігаючи їх на API-сервері. На цій сторінці пояснено, які сертифікати потрібні вашому кластеру.

<!-- body -->

## Як кластер використовує сертифікати {#how-certificates-are-used-by-your-cluster}

Kubernetes вимагає PKI для виконання таких операцій:

### Сертифікати сервера {#server-certificates}

* Сертифікат сервера для точки доступу API-сервера
* Сертифікат сервера для сервера etcd
* [Сертифікати сервера](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#client-and-serving-certificates) для кожного kubelet (кожен {{< glossary_tooltip text="вузол" term_id="node" >}} запускає kubelet)
* Необовʼязковий сертифікат сервера для [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)

### Сертифікати клієнта {#client-certificates}

* Сертифікати клієнта для кожного kubelet, які використовуються для автентифікації в API-сервері як клієнта Kubernetes API
* Сертифікат клієнта для кожного API-сервера, який використовується для автентифікації в etcd
* Сертифікат клієнта для менеджера контролерів для безпечного звʼязку з API-сервером
* Сертифікат клієнта для планувальника для безпечного звʼязку з API-сервером
* Сертифікати клієнта, по одному для кожного вузла, для автентифікації kube-proxy в API-сервері
* Необовʼязкові сертифікати клієнта для адміністраторів кластера для автентифікації в API-сервері
* Необовʼязковий сертифікат клієнта для [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)

### Серверні та клієнтські сертифікати kubelet {#kubelet-s-server-and-client-certificates}

Щоб встановити безпечне зʼєднання й автентифікуватися в kubelet, API-серверу потрібна пара із сертифіката клієнта та ключа.

У цій ситуації є два підходи до використання сертифікатів:

* Спільні сертифікати: kube-apiserver може використовувати ту саму пару сертифіката й ключа, яку він використовує для автентифікації своїх клієнтів. Це означає, що наявні сертифікати, як-от `apiserver.crt` та `apiserver.key`, можна використовувати для звʼязку із серверами kubelet.

* Окремі сертифікати: інакше kube-apiserver може згенерувати нову пару сертифіката клієнта й ключа для автентифікації звʼязку із серверами kubelet. У цьому випадку створюються окремий сертифікат `kubelet-client.crt` і відповідний приватний ключ `kubelet-client.key`.

{{< note >}}
Сертифікати `front-proxy` потрібні лише тоді, коли ви використовуєте шар агрегації API-сервера для підтримки [API-сервера розширення](/docs/tasks/extend-kubernetes/setup-extension-api-server/).
{{< /note >}}

etcd також реалізує взаємний TLS (mutual TLS) для автентифікації клієнтів і рівноправних вузлів (peers).

## Де зберігаються сертифікати {#where-certificates-are-stored}

Якщо ви встановлюєте Kubernetes за допомогою kubeadm, більшість сертифікатів зберігається в `/etc/kubernetes/pki`. Усі шляхи в цій документації вказано відносно цієї теки, за винятком сертифікатів облікових записів користувачів, які kubeadm розміщує в `/etc/kubernetes`.

## Налаштування сертифікатів вручну {#configure-certificates-manually}

Якщо ви не хочете, щоб kubeadm генерував потрібні сертифікати, ви можете створити їх, використовуючи один кореневий центр сертифікації (CA) або надавши всі сертифікати. Докладніше про створення власного центру сертифікації див. [Сертифікати](/docs/tasks/administer-cluster/certificates/). Докладніше про керування сертифікатами див. [Управління сертифікатами з kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/).

### Один кореневий CA {#single-root-ca}

Ви можете створити один кореневий CA, яким керує адміністратор. Потім цей кореневий CA може створити кілька проміжних CA і делегувати все подальше створення самому Kubernetes.

Потрібні CA:

| Шлях                   | Стандартний CN              | Опис                          |
|------------------------|-----------------------------|-------------------------------|
| ca.crt,key             | kubernetes-ca             | Загальний CA Kubernetes       |
| etcd/ca.crt,key        | etcd-ca                   | Для всіх функцій, повʼязаних з etcd  |
| front-proxy-ca.crt,key | kubernetes-front-proxy-ca | Для [front-end proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) |

На додачу до наведених вище CA також потрібно отримати пару відкритого та закритого ключів для керування службовими обліковими записами, `sa.key` та `sa.pub`. Наведений нижче приклад ілюструє файли ключів і сертифікатів CA, показані в попередній таблиці:

```
/etc/kubernetes/pki/ca.crt
/etc/kubernetes/pki/ca.key
/etc/kubernetes/pki/etcd/ca.crt
/etc/kubernetes/pki/etcd/ca.key
/etc/kubernetes/pki/front-proxy-ca.crt
/etc/kubernetes/pki/front-proxy-ca.key
```

### Усі сертифікати {#all-certificates}

Якщо ви не хочете копіювати приватні ключі CA до свого кластера, ви можете згенерувати всі сертифікати самостійно.

Потрібні сертифікати:

| Стандартний CN                         | Батьківський CA            | O (у Subject) | kind             | hosts (SAN)                                          |
|----------------------------------------|---------------------------|---------------|------------------|------------------------------------------------------|
| kube-etcd                              | etcd-ca                   |               | server, client   | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1`  |
| kube-etcd-peer                         | etcd-ca                   |               | server, client   | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1`  |
| kube-etcd-healthcheck-client           | etcd-ca                   |               | client           |                                                      |
| kube-apiserver-etcd-client             | etcd-ca                   |               | client           |                                                      |
| kube-apiserver                         | kubernetes-ca             |               | server           | `<hostname>`, `<Host_IP>`, `<advertise_IP>`[^1]   |
| kube-apiserver-kubelet-client          | kubernetes-ca             | system:masters | client           |                                                      |
| front-proxy-client                     | kubernetes-front-proxy-ca |               | client           |                                                      |

{{< note >}}
Замість групи суперкористувачів `system:masters` для `kube-apiserver-kubelet-client` можна використовувати менш привілейовану групу. kubeadm використовує для цього групу `kubeadm:cluster-admins`.
{{< /note >}}

[^1]: будь-яка інша IP-адреса чи DNS-імʼя, за якими ви звертаєтеся до свого кластера (як у [kubeadm](/docs/reference/setup-tools/kubeadm/): стабільна IP-адреса та/або DNS-імʼя балансувальника навантаження, `kubernetes`, `kubernetes.default`, `kubernetes.default.svc`, `kubernetes.default.svc.cluster`, `kubernetes.default.svc.cluster.local`)

де `kind` відповідає одному або кільком варіантам використання ключа x509 (key usage), які також задокументовано в `.spec.usages` типу [CertificateSigningRequest](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1#CertificateSigningRequest):

| kind   | Використання ключа                                                               |
|--------|-----------------------------------------------------------------------------------|
| server | цифровий підпис, шифрування ключа, автентифікація сервера                          |
| client | цифровий підпис, шифрування ключа, автентифікація клієнта                         |

{{< note >}}
Hosts/SAN, наведені вище, рекомендовані для отримання робочого кластера; якщо цього вимагає конкретне налаштування, до всіх сертифікатів сервера можна додати додаткові SAN.
{{< /note >}}

{{< note >}}
Лише для користувачів kubeadm:

* Сценарій, коли ви копіюєте до свого кластера сертифікати CA без приватних ключів, у документації kubeadm називається зовнішнім CA.
* Якщо ви порівнюєте наведений вище список зі згенерованою kubeadm PKI, майте на увазі, що сертифікати `kube-etcd`, `kube-etcd-peer` та `kube-etcd-healthcheck-client` не генеруються у разі зовнішнього etcd.
{{< /note >}}

### Шляхи до сертифікатів {#certificate-paths}

Сертифікати слід розміщувати за рекомендованим шляхом (який використовує [kubeadm](/docs/reference/setup-tools/kubeadm/)). Шляхи слід вказувати за допомогою наведеного аргументу незалежно від розташування.

| Стандартний CN | рекомендований шлях до ключа | рекомендований шлях до сертифіката | команда | аргумент ключа | аргумент сертифіката |
|------------|------------------------------|------------------------------------|---------|----------------|----------------------|
| etcd-ca | etcd/ca.key | etcd/ca.crt | kube-apiserver | | --etcd-cafile |
| kube-apiserver-etcd-client | apiserver-etcd-client.key | apiserver-etcd-client.crt | kube-apiserver | --etcd-keyfile | --etcd-certfile |
| kubernetes-ca | ca.key | ca.crt | kube-apiserver | | --client-ca-file |
| kubernetes-ca | ca.key | ca.crt | kube-controller-manager | --cluster-signing-key-file | --client-ca-file,--root-ca-file,--cluster-signing-cert-file |
| kube-apiserver | apiserver.key | apiserver.crt | kube-apiserver | --tls-private-key-file | --tls-cert-file |
| kube-apiserver-kubelet-client | apiserver-kubelet-client.key | apiserver-kubelet-client.crt | kube-apiserver | --kubelet-client-key | --kubelet-client-certificate |
| front-proxy-ca | front-proxy-ca.key | front-proxy-ca.crt | kube-apiserver | | --requestheader-client-ca-file |
| front-proxy-ca | front-proxy-ca.key | front-proxy-ca.crt | kube-controller-manager | | --requestheader-client-ca-file |
| front-proxy-client | front-proxy-client.key | front-proxy-client.crt | kube-apiserver | --proxy-client-key-file | --proxy-client-cert-file |
| etcd-ca | etcd/ca.key | etcd/ca.crt | etcd | | --trusted-ca-file,--peer-trusted-ca-file |
| kube-etcd | etcd/server.key | etcd/server.crt | etcd | --key-file | --cert-file |
| kube-etcd-peer | etcd/peer.key | etcd/peer.crt | etcd | --peer-key-file | --peer-cert-file |
| etcd-ca | | etcd/ca.crt | etcdctl | | --cacert |
| kube-etcd-healthcheck-client | etcd/healthcheck-client.key | etcd/healthcheck-client.crt | etcdctl | --key | --cert |

Те саме стосується пари ключів службових облікових записів:

| Шлях приватного ключа  | Шлях публічного ключа  | команда                 | аргумент                             |
|------------------------|------------------------|-------------------------|--------------------------------------|
|  sa.key                |                        | kube-controller-manager | --service-account-private-key-file   |
|                        |  sa.pub                | kube-apiserver          | --service-account-key-file           |

Наведений нижче приклад ілюструє шляхи до файлів [з попередніх таблиць](#certificate-paths), які потрібно надати, якщо ви генеруєте всі власні ключі та сертифікати:

```
/etc/kubernetes/pki/etcd/ca.key
/etc/kubernetes/pki/etcd/ca.crt
/etc/kubernetes/pki/apiserver-etcd-client.key
/etc/kubernetes/pki/apiserver-etcd-client.crt
/etc/kubernetes/pki/ca.key
/etc/kubernetes/pki/ca.crt
/etc/kubernetes/pki/apiserver.key
/etc/kubernetes/pki/apiserver.crt
/etc/kubernetes/pki/apiserver-kubelet-client.key
/etc/kubernetes/pki/apiserver-kubelet-client.crt
/etc/kubernetes/pki/front-proxy-ca.key
/etc/kubernetes/pki/front-proxy-ca.crt
/etc/kubernetes/pki/front-proxy-client.key
/etc/kubernetes/pki/front-proxy-client.crt
/etc/kubernetes/pki/etcd/server.key
/etc/kubernetes/pki/etcd/server.crt
/etc/kubernetes/pki/etcd/peer.key
/etc/kubernetes/pki/etcd/peer.crt
/etc/kubernetes/pki/etcd/healthcheck-client.key
/etc/kubernetes/pki/etcd/healthcheck-client.crt
/etc/kubernetes/pki/sa.key
/etc/kubernetes/pki/sa.pub
```

## Налаштування сертифікатів для облікових записів користувачів {#configure-certificates-for-user-accounts}

Ви маєте вручну налаштувати ці облікові записи адміністраторів і службові облікові записи:

| Імʼя файлу               | Імʼя облікових даних        | Стандартний CN          | O (у Subject)         |
|-------------------------|-----------------------------|-----------------------------------|------------------------|
| admin.conf              | default-admin              | kubernetes-admin                  | `<admin-group>`        |
| super-admin.conf        | default-super-admin        | kubernetes-super-admin            | system:masters         |
| kubelet.conf            | default-auth               | system:node:`<nodeName>` (див. примітку) | system:nodes           |
| controller-manager.conf | default-controller-manager | system:kube-controller-manager    |                        |
| scheduler.conf          | default-scheduler          | system:kube-scheduler             |                        |

{{< note >}}
Значення `<nodeName>` для `kubelet.conf` **має** точно збігатися з іменем вузла, яке надає kubelet під час реєстрації в apiserver. Докладніше див. [Авторизація вузлів](/docs/reference/access-authn-authz/node/).
{{< /note >}}

{{< note >}}
У наведеному вище прикладі `<admin-group>` залежить від реалізації. Деякі інструменти підписують сертифікат у стандартному `admin.conf` так, щоб він входив до групи `system:masters`. `system:masters` — це аварійна (break-glass) група суперкористувачів, яка може обходити рівень авторизації Kubernetes, як-от RBAC. Також деякі інструменти не генерують окремий `super-admin.conf` із сертифікатом, привʼязаним до цієї групи суперкористувачів.

kubeadm генерує два окремі сертифікати адміністратора у файлах kubeconfig. Один — у файлі `admin.conf` і має `Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`. `kubeadm:cluster-admins` — це власна група, привʼязана до ClusterRole `cluster-admin`. Цей файл генерується на всіх машинах панелі управління, якими керує kubeadm.

Інший — у файлі `super-admin.conf`, що має `Subject: O = system:masters, CN = kubernetes-super-admin`. Цей файл генерується лише на вузлі, де було викликано `kubeadm init`.
{{< /note >}}

1. Для кожної конфігурації згенеруйте пару сертифіката й ключа x509 із зазначеними Common Name (CN) та Organization (O).

1. Виконайте `kubectl` для кожної конфігурації так:

   ```
   KUBECONFIG=<filename> kubectl config set-cluster default-cluster --server=https://<host ip>:6443 --certificate-authority <path-to-kubernetes-ca> --embed-certs
   KUBECONFIG=<filename> kubectl config set-credentials <credential-name> --client-key <path-to-key>.pem --client-certificate <path-to-cert>.pem --embed-certs
   KUBECONFIG=<filename> kubectl config set-context default-system --cluster default-cluster --user <credential-name>
   KUBECONFIG=<filename> kubectl config use-context default-system
   ```

Ці файли використовуються так:

| Імʼя файлу             | Команда                 | Коментар                               |
|------------------------|-------------------------|----------------------------------------|
| admin.conf              | kubectl                 | Налаштовує користувача-адміністратора для кластера         |
| super-admin.conf        | kubectl                 | Налаштовує користувача-суперадміністратора для кластера   |
| kubelet.conf            | kubelet                 | Потрібен для кожного вузла в кластері               |
| controller-manager.conf | kube-controller-manager | Має бути доданий до маніфесту в `manifests/kube-controller-manager.yaml` |
| scheduler.conf          | kube-scheduler          | Має бути доданий до маніфесту в `manifests/kube-scheduler.yaml`        |

Наведені нижче файли ілюструють повні шляхи до файлів, перерахованих у попередній таблиці:

```
/etc/kubernetes/admin.conf
/etc/kubernetes/super-admin.conf
/etc/kubernetes/kubelet.conf
/etc/kubernetes/controller-manager.conf
/etc/kubernetes/scheduler.conf
```
