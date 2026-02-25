---
title: Сертифікати PKI та вимоги
content_type: concept
weight: 50
---

<!-- overview -->

Kubernetes вимагає наявності сертифікатів PKI для автентифікації за допомогою TLS. Якщо ви встановлюєте Kubernetes за допомогою [kubeadm](/docs/reference/setup-tools/kubeadm/), сертифікати, необхідні для вашого кластера, генеруються автоматично. Ви також можете створити свої власні сертифікати, наприклад, щоб зберігати ваші приватні ключі більш безпечно, не зберігаючи їх на сервері API. Ця сторінка пояснює, які сертифікати необхідні для вашого кластера.

<!-- body -->

## Як кластер використовує сертифікати {#how-certificates-are-used-by-your-cluster}

Kubernetes вимагає PKI для виконання таких операцій:

### Сертифікати сервера {#server-certificates}

* Сертифікат сервера для точки доступу API сервера
* Сертифікат сервера для сервера etcd
* [Сертифікати сервера](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#client-and-serving-certificates) для кожного kubelet (кожен {{< glossary_tooltip text="вузол" term_id="node" >}} запускає kubelet)
* Опціональний сертифікат сервера для [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)

### Сертифікати клієнта {#client-certificates}

* Сертифікати клієнта для кожного kubelet, які використовуються для автентифікації в API сервері як клієнта Kubernetes API
* Сертифікат клієнта для кожного API сервера, який використовується для автентифікації в etcd
* Сертифікат клієнта для менеджера контролерів для безпечного звʼязку з API сервером
* Сертифікат клієнта для планувальника для безпечного звʼязку з API сервером
* Сертифікати клієнтів для кожного вузла, які використовуються kube-proxy для автентифікації в API сервері
* Опціональні сертифікати клієнтів для адміністраторів кластера для автентифікації в API сервері
* Опціональний сертифікат клієнта для [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)

### Серверні та клієнтські сертифікати Kubelet {#kubelet-s-server-and-client-certificates}

Для встановлення безпечного зʼєднання та автентифікації у kubelet, API сервер вимагає сертифікат клієнта та пару ключів.

У цій ситуації є два підходи до використання сертифікатів:

* Спільні сертифікати: kube-apiserver може використовувати ту ж саму пару сертифікатів та ключів, яку використовує для автентифікації своїх клієнтів. Це означає, що наявні сертифікати, такі як `apiserver.crt` та `apiserver.key`, можуть використовуватися для звʼязку з серверами kubelet.

* Окремі сертифікати: Альтернативно, kube-apiserver може згенерувати новий сертифікат клієнта та пару ключів для автентифікації звʼязку з серверами kubelet. У цьому випадку створюється окремий сертифікат з назвою `kubelet-client.crt` та відповідний приватний ключ, `kubelet-client.key`.

{{< note >}}
Сертифікати `front-proxy` потрібні лише в разі використання kube-proxy для підтримки [розширеного API-сервера](/docs/tasks/extend-kubernetes/setup-extension-api-server/).
{{< /note >}}

etcd також реалізує взаємну автентифікацію TLS для автентифікації клієнтів.

## Де зберігаються сертифікати {#where-certificates-are-stored}

Якщо ви встановлюєте Kubernetes за допомогою kubeadm, більшість сертифікатів зберігається в `/etc/kubernetes/pki`. Усі шляхи в цьому документі стосуються цієї теки, за винятком сертифікатів облікових записів користувачів, які kubeadm розміщує в `/etc/kubernetes`.

## Налаштування сертифікатів вручну {#configuring-certificates-manually}

Якщо ви не хочете, щоб kubeadm генерував необхідні сертифікати, ви можете створити їх за допомогою одного кореневого ЦС або подавши всі сертифікати. Детальні відомості щодо створення власного центра сертифікації дивіться в статті [Сертифікати](/docs/tasks/administer-cluster/certificates/). Додаткові відомості знаходяться в розділі [Управління сертифікатами з kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/).

### Один кореневий ЦС {#single-root-ca}

Ви можете створити один кореневий ЦС, яким керує адміністратор. Цей кореневий ЦС може створювати кілька проміжних ЦС та делегувати весь подальший процес створення Kubernetes.

Необхідні ЦС:

| Шлях                   | Типовий CN                  | Опис                          |
|------------------------|-----------------------------|-------------------------------|
| ca.crt,key             | kubernetes-ca             | Загальний ЦС Kubernetes       |
| etcd/ca.crt,key        | etcd-ca                   | Для всіх функцій, повʼязаних з etcd  |
| front-proxy-ca.crt,key | kubernetes-front-proxy-ca | Для [проксі-сервера](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) |

На додачу до цих ЦС також необхідно отримати пару ключ/сертифікат для управління службовими обліковими записами, `sa.key` та `sa.pub`. Наведений нижче приклад ілюструє файли ключа та сертифіката ЦС, показані в попередній таблиці:

```none
/etc/kubernetes/pki/ca.crt
/etc/kubernetes/pki/ca.key
/etc/kubernetes/pki/etcd/ca.crt
/etc/kubernetes/pki/etcd/ca.key
/etc/kubernetes/pki/front-proxy-ca.crt
/etc/kubernetes/pki/front-proxy-ca.key
```

### Усі сертифікати {#all-certificates}

Якщо ви не хочете копіювати приватні ключі ЦС до свого кластера, ви можете створити всі сертифікати самостійно.

Необхідні сертифікати:

| Типовий CN                             | Батьківський ЦС            | O (в обʼєкті) | вид              | hosts (SAN)                                          |
|----------------------------------------|---------------------------|---------------|------------------|------------------------------------------------------|
| kube-etcd                              | etcd-ca                   |               | server, client   | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1`  |
| kube-etcd-peer                         | etcd-ca                   |               | server, client   | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1`  |
| kube-etcd-healthcheck-client           | etcd-ca                   |               | client           |                                                      |
| kube-apiserver-etcd-client             | etcd-ca                   |               | client           |                                                      |
| kube-apiserver                         | kubernetes-ca             |               | server           | `<hostname>`, `<Host_IP>`, `<advertise_IP>`, `[^1]`   |
| kube-apiserver-kubelet-client          | kubernetes-ca             | system:masters | client           |                                                      |
| front-proxy-client                     | kubernetes-front-proxy-ca |               | client           |                                                      |

{{< note >}}
Замість використання групи суперкористувача `system:masters` для `kube-apiserver-kubelet-client`, може бути використана менш привілейована група. kubeadm використовує групу `kubeadm:cluster-admins` для цієї мети.
{{< /note >}}

[^1]: будь-яка інша IP-адреса чи DNS-імʼя, за яким ви звертаєтеся до свого кластера (що використовується [kubeadm](/docs/reference/setup-tools/kubeadm/) для стабільної IP-адреси або DNS-імені балансування навантаження, `kubernetes`, `kubernetes.default`, `kubernetes.default.svc`, `kubernetes.default.svc.cluster`, `kubernetes.default.svc.cluster.local`)

де `kind` посилається на один або кілька ключів x509, які також документовані в `.spec.usages` типу [CertificateSigningRequest](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1#CertificateSigningRequest):

| kind   | Використання ключа                                                               |
|--------|-----------------------------------------------------------------------------------|
| server | цифровий підпис, шифрування ключа, автентифікація сервера                          |
| client | цифровий підпис, шифрування ключа, автентифікація клієнта                         |

{{< note >}}
Hosts/SAN, наведені вище, є рекомендованими для отримання робочого кластера; якщо вимагається для конкретного налаштування, можливе додавання додаткових SAN до всіх сертифікатів сервера.
{{< /note >}}

{{< note >}}
Лише для користувачів kubeadm:

* Сценарій, коли ви копіюєте сертифікати ЦС до свого кластера без приватних ключів, називається зовнішнім ЦС у документації kubeadm.
* Якщо ви порівнюєте цей список зі згенерованим kubeadm PKI, слід мати на увазі, що сертифікати `kube-etcd`, `kube-etcd-peer` та `kube-etcd-healthcheck-client` не генеруються в разі зовнішнього etcd.
{{< /note >}}

### Шляхи до сертифікатів {#certificate-paths}

Сертифікати повинні бути розміщені в рекомендованому шляху (який використовує [kubeadm](/docs/reference/setup-tools/kubeadm/)). Шляхи повинні бути вказані за вказаним аргументом незалежно від місця розташування.

| Типовий CN | рекомендований шлях до ключа | рекомендований шлях до сертифіката | команда | аргумент ключа | аргумент сертифіката |
|------------|------------------------------|------------------------------------|---------|----------------|----------------------|
| etcd-ca | etcd/ca.key | etcd/ca.crt | kube-apiserver | | --etcd-cafile |
| kube-apiserver-etcd-client | apiserver-etcd-client.key | apiserver-etcd-client.crt | kube-apiserver | --etcd-keyfile | --etcd-certfile |
| kubernetes-ca | ca.key | ca.crt | kube-apiserver | | --client-ca-file |
| kubernetes-ca | ca.key | ca.crt | kube-controller-manager | --cluster-signing-key-file | --client-ca-file, --root-ca-file, --cluster-signing-cert-file |
| kube-apiserver | apiserver.key | apiserver.crt | kube-apiserver | --tls-private-key-file | --tls-cert-file |
| kube-apiserver-kubelet-client | apiserver-kubelet-client.key | apiserver-kubelet-client.crt | kube-apiserver | --kubelet-client-key | --kubelet-client-certificate |
| front-proxy-ca | front-proxy-ca.key | front-proxy-ca.crt | kube-apiserver | | --requestheader-client-ca-file |
| front-proxy-ca | front-proxy-ca.key | front-proxy-ca.crt | kube-controller-manager | | --requestheader-client-ca-file |
| front-proxy-client | front-proxy-client.key | front-proxy-client.crt | kube-apiserver | --proxy-client-key-file | --proxy-client-cert-file |
| etcd-ca | etcd/ca.key | etcd/ca.crt | etcd | | --trusted-ca-file, --peer-trusted-ca-file |
| kube-etcd | etcd/server.key | etcd/server.crt | etcd | --key-file | --cert-file |
| kube-etcd-peer | etcd/peer.key | etcd/peer.crt | etcd | --peer-key-file | --peer-cert-file |
| etcd-ca | | etcd/ca.crt | etcdctl | | --cacert |
| kube-etcd-healthcheck-client | etcd/healthcheck-client.key | etcd/healthcheck-client.crt | etcdctl | --key | --cert |

Ті ж самі вимоги стосуються пари ключів службових облікових записів:

| Шлях приватного ключа  | Шлях публічного ключа  | команда                 | аргумент                             |
|------------------------|------------------------|-------------------------|--------------------------------------|
|  sa.key                |                        | kube-controller-manager | --service-account-private-key-file   |
|                        |  sa.pub                | kube-apiserver          | --service-account-key-file           |

Наведений нижче приклад ілюструє повні шляхи до файлів, перерахованих в попередній таблиці:

```none
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

## Налаштування сертифікатів для облікових записів користувачів {#configuring-certificates-for-user-accounts}

Ви повинні вручну налаштувати ці облікові записи адміністратора та службові облікові записи:

| Імʼя файлу               | Імʼя облікового запису      | Типовий CN              | O (в обʼєкті)         |
|-------------------------|-----------------------------|-----------------------------------|------------------------|
| admin.conf              | default-admin              | kubernetes-admin                  | `<admin-group>`        |
| super-admin.conf        | default-super-admin        | kubernetes-super-admin            | system:masters         |
| kubelet.conf            | default-auth               | system:node:`<nodeName>` (див. примітку) | system:nodes           |
| controller-manager.conf | default-controller-manager | system:kube-controller-manager    |                        |
| scheduler.conf          | default-scheduler          | system:kube-scheduler             |                        |

{{< note >}}
Значення `<nodeName>` для `kubelet.conf` **має** точно відповідати значенню імені вузла, наданому [kubeadm](/docs/reference/setup-tools/kubeadm/), оскільки він реєструється з apiserver. Докладніше див. [Авторизація вузлів](/docs/reference/access-authn-authz/node/).
{{< /note >}}

{{< note >}}
В вищенаведеному прикладі `<admin-group>` є специфічним для реалізації. Деякі інструменти підписують сертифікат у типовий конфігурації `admin.conf`, щоб він став частиною групи `system:masters`. `system:masters` — це привілейована група, яка може обходити рівень авторизації Kubernetes, такий як RBAC. Також деякі інструменти не генерують окремий `super-admin.conf` із сертифікатом, повʼязаним із цією групою суперкористувачів.

kubeadm генерує два окремих сертифікати адміністратора у файлах kubeconfig. Один у файлі `admin.conf` і має `Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`. `kubeadm:cluster-admins` — це власна група, повʼязана з роллю кластера `cluster-admin`. Цей файл генерується на всіх машинах панелі управління під контролем kubeadm.

Інший у файлі `super-admin.conf` із `Subject: O = system:masters, CN = kubernetes-super-admin`. Цей файл генерується лише на вузлі, де було викликано `kubeadm init`.
{{< /note >}}

1. Для кожної конфігурації створіть пару ключ/сертифікат x509 із зазначеними Common Name (CN) та Organization (O).

2. Виконайте команду `kubectl` для кожної конфігурації наступним чином:

```bash
KUBECONFIG=<filename> kubectl config set-cluster default-cluster --server=https://<host ip>:6443 --certificate-authority <path-to-kubernetes-ca> --embed-certs
KUBECONFIG=<filename> kubectl config set-credentials <credential-name> --client-key <path-to-key>.pem --client-certificate <path-to-cert>.pem --embed-certs
KUBECONFIG=<filename> kubectl config set-context default-system --cluster default-cluster --user <credential-name>
KUBECONFIG=<filename> kubectl config use-context default-system
```

Ці файли використовуються наступним чином:

| Імʼя файлу             | Команда                 | Коментар                               |
|------------------------|-------------------------|----------------------------------------|
| admin.conf              | kubectl                 | Налаштовує користувача-адміністратора для кластера         |
| super-admin.conf        | kubectl                 | Налаштовує користувача-суперадміністратора для кластера   |
| kubelet.conf            | kubelet                 | Один обовʼязковий для кожного вузла в кластері              |
| controller-manager.conf | kube-controller-manager | Має бути доданий до `manifests/kube-controller-manager.yaml` |
| scheduler.conf          | kube-scheduler          | Має бути доданий до `manifests/kube-scheduler.yaml`        |

Наведені нижче файли ілюструють повні шляхи до файлів, перерахованих у попередній таблиці:

```bash
/etc/kubernetes/admin.conf
/etc/kubernetes/super-admin.conf
/etc/kubernetes/kubelet.conf
/etc/kubernetes/controller-manager.conf
/etc/kubernetes/scheduler.conf
```
