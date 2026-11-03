---
title: Сертификаты PKI и требования
content_type: concept
weight: 50
---

<!-- overview -->

Kubernetes требуются сертификаты PKI для аутентификации по TLS.
При установке Kubernetes с помощью [kubeadm](/docs/reference/setup-tools/kubeadm/)
необходимые кластеру сертификаты создаются автоматически.
Можно также сгенерировать собственные сертификаты, например чтобы повысить безопасность
закрытых ключей, не храня их на сервере API.
На этой странице описаны сертификаты, необходимые кластеру.

<!-- body -->

## Использование сертификатов в кластере {#how-certificates-are-used-by-your-cluster}

Kubernetes использует PKI для следующих операций:

### Серверные сертификаты {#server-certificates}

* Серверный сертификат конечной точки сервера API.
* Серверный сертификат сервера etcd.
* [Серверные сертификаты](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#client-and-serving-certificates)
  каждого kubelet (kubelet работает на каждом {{< glossary_tooltip text="узле" term_id="node" >}}).
* Необязательный серверный сертификат [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/).

### Клиентские сертификаты {#client-certificates}

* Клиентские сертификаты каждого kubelet для аутентификации на сервере API в качестве клиента API Kubernetes.
* Клиентский сертификат каждого сервера API для аутентификации в etcd.
* Клиентский сертификат менеджера контроллеров для безопасного взаимодействия с сервером API.
* Клиентский сертификат планировщика для безопасного взаимодействия с сервером API.
* Клиентские сертификаты kube-proxy, по одному на узел, для аутентификации на сервере API.
* Необязательные клиентские сертификаты администраторов кластера для аутентификации на сервере API.
* Необязательный клиентский сертификат [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/).

### Серверные и клиентские сертификаты kubelet {#kubelets-server-and-client-certificates}

Для установления защищённого соединения с kubelet и аутентификации серверу API
нужна пара из клиентского сертификата и ключа.

В этом случае возможны два подхода к использованию сертификатов:

* Общие сертификаты: kube-apiserver может использовать ту же пару сертификата и ключа,
  которую использует для аутентификации своих клиентов. То есть существующие сертификаты,
  такие как `apiserver.crt` и `apiserver.key`, можно использовать для взаимодействия с серверами kubelet.

* Отдельные сертификаты: kube-apiserver может сгенерировать новую пару клиентского сертификата
  и ключа для аутентификации при взаимодействии с серверами kubelet.
  В этом случае создаются отдельный сертификат `kubelet-client.crt`
  и соответствующий закрытый ключ `kubelet-client.key`.

{{< note >}}
Сертификаты `front-proxy` нужны только при использовании слоя агрегации сервера API
для поддержки [сервера расширения API](/docs/tasks/extend-kubernetes/setup-extension-api-server/).
{{< /note >}}

etcd также использует взаимную аутентификацию TLS для клиентов и участников кластера.

## Расположение сертификатов {#where-certificates-are-stored}

При установке Kubernetes через kubeadm большинство сертификатов хранится в `/etc/kubernetes/pki`.
Все пути в этом документе указаны относительно этого каталога, кроме сертификатов
учётных записей пользователей, которые kubeadm помещает в `/etc/kubernetes`.

## Настройка сертификатов вручную {#configure-certificates-manually}

Если вы не хотите, чтобы kubeadm генерировал необходимые сертификаты,
можно создать их с помощью единого корневого CA или предоставить все сертификаты.
О создании собственного центра сертификации см.
[Сертификаты](/docs/tasks/administer-cluster/certificates/).
Подробнее об управлении сертификатами см.
[Управление сертификатами с помощью kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/).

### Единый корневой CA {#single-root-ca}

Можно создать единый корневой CA под управлением администратора.
Этот CA может создать несколько промежуточных CA и делегировать дальнейшее
создание сертификатов самому Kubernetes.

Необходимые CA:

| Путь | CN по умолчанию | Описание |
|------------------------|---------------------------|----------------------------------|
| ca.crt,key             | kubernetes-ca             | Общий CA Kubernetes            |
| etcd/ca.crt,key        | etcd-ca                   | Для всех функций, связанных с etcd   |
| front-proxy-ca.crt,key | kubernetes-front-proxy-ca | Для [front-end proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) |

Кроме перечисленных CA, для управления сервисными аккаунтами нужна пара
закрытого и открытого ключей: `sa.key` и `sa.pub`.
Следующий пример показывает файлы ключей и сертификатов CA из предыдущей таблицы:

```
/etc/kubernetes/pki/ca.crt
/etc/kubernetes/pki/ca.key
/etc/kubernetes/pki/etcd/ca.crt
/etc/kubernetes/pki/etcd/ca.key
/etc/kubernetes/pki/front-proxy-ca.crt
/etc/kubernetes/pki/front-proxy-ca.key
```

### Все сертификаты {#all-certificates}

Если вы не хотите копировать закрытые ключи CA в кластер,
можно сгенерировать все сертификаты самостоятельно.

Необходимые сертификаты:

| CN по умолчанию | Родительский CA | O (в Subject) | kind | Хосты (SAN) |
|-------------------------------|---------------------------|----------------|------------------|-----------------------------------------------------|
| kube-etcd                     | etcd-ca                   |                | server, client   | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-peer                | etcd-ca                   |                | server, client   | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-healthcheck-client  | etcd-ca                   |                | client           |                                                     |
| kube-apiserver-etcd-client    | etcd-ca                   |                | client           |                                                     |
| kube-apiserver                | kubernetes-ca             |                | server           | `<hostname>`, `<Host_IP>`, `<advertise_IP>`[^1]     |
| kube-apiserver-kubelet-client | kubernetes-ca             | system:masters | client           |                                                     |
| front-proxy-client            | kubernetes-front-proxy-ca |                | client           |                                                     |

{{< note >}}
Вместо группы суперпользователей `system:masters` для `kube-apiserver-kubelet-client`
можно использовать менее привилегированную группу. kubeadm использует для этого
группу `kubeadm:cluster-admins`.
{{< /note >}}

[^1]: Любой другой IP-адрес или DNS-имя, по которому вы обращаетесь к кластеру
(как в [kubeadm](/docs/reference/setup-tools/kubeadm/): постоянный IP-адрес и/или DNS-имя
балансировщика нагрузки, `kubernetes`, `kubernetes.default`, `kubernetes.default.svc`,
`kubernetes.default.svc.cluster`, `kubernetes.default.svc.cluster.local`).

Здесь `kind` соответствует одному или нескольким назначениям ключа x509,
также описанным в `.spec.usages` типа
[CertificateSigningRequest](/docs/reference/kubernetes-api/certificates/certificate-signing-request-v1/#CertificateSigningRequest):

| kind | Назначения ключа |
|--------|---------------------------------------------------------------------------------|
| server | digital signature, key encipherment, server auth                                |
| client | digital signature, key encipherment, client auth                                |

{{< note >}}
Перечисленные выше имена хостов и SAN рекомендуются для получения работающего кластера.
Если конкретная конфигурация требует этого, можно добавить дополнительные SAN
во все серверные сертификаты.
{{< /note >}}

{{< note >}}
Только для пользователей kubeadm:

* Копирование в кластер сертификатов CA без закрытых ключей в документации kubeadm
  называется использованием внешнего CA.
* При сравнении списка выше с PKI, созданной kubeadm, учитывайте, что при внешнем etcd
  сертификаты `kube-etcd`, `kube-etcd-peer` и `kube-etcd-healthcheck-client` не генерируются.

{{< /note >}}

### Пути к сертификатам {#certificate-paths}

Сертификаты следует размещать по рекомендуемым путям, используемым
[kubeadm](/docs/reference/setup-tools/kubeadm/).
Независимо от расположения пути нужно задавать указанными аргументами.

| CN по умолчанию | Рекомендуемый путь к ключу | Рекомендуемый путь к сертификату | Команда | Аргумент ключа | Аргумент сертификата |
| --------- | ------------------ | ------------------- | ------- | ----------- | ------------ |
| etcd-ca | etcd/ca.key | etcd/ca.crt | kube-apiserver | | --etcd-cafile |
| kube-apiserver-etcd-client | apiserver-etcd-client.key | apiserver-etcd-client.crt | kube-apiserver | --etcd-keyfile | --etcd-certfile |
| kubernetes-ca | ca.key | ca.crt | kube-apiserver | | --client-ca-file |
| kubernetes-ca | ca.key | ca.crt | kube-controller-manager | --cluster-signing-key-file | --client-ca-file,--root-ca-file,--cluster-signing-cert-file |
| kube-apiserver | apiserver.key | apiserver.crt| kube-apiserver | --tls-private-key-file | --tls-cert-file |
| kube-apiserver-kubelet-client | apiserver-kubelet-client.key | apiserver-kubelet-client.crt | kube-apiserver | --kubelet-client-key | --kubelet-client-certificate |
| front-proxy-ca | front-proxy-ca.key | front-proxy-ca.crt | kube-apiserver | | --requestheader-client-ca-file |
| front-proxy-ca | front-proxy-ca.key | front-proxy-ca.crt | kube-controller-manager | | --requestheader-client-ca-file |
| front-proxy-client | front-proxy-client.key | front-proxy-client.crt | kube-apiserver | --proxy-client-key-file | --proxy-client-cert-file |
| etcd-ca | etcd/ca.key | etcd/ca.crt | etcd | | --trusted-ca-file,--peer-trusted-ca-file |
| kube-etcd | etcd/server.key | etcd/server.crt | etcd | --key-file | --cert-file |
| kube-etcd-peer | etcd/peer.key | etcd/peer.crt | etcd | --peer-key-file | --peer-cert-file |
| etcd-ca| | etcd/ca.crt | etcdctl | | --cacert |
| kube-etcd-healthcheck-client | etcd/healthcheck-client.key | etcd/healthcheck-client.crt | etcdctl | --key | --cert |

То же относится к паре ключей сервисных аккаунтов:

| Путь к закрытому ключу | Путь к открытому ключу | Команда | Аргумент |
|-------------------|------------------|-------------------------|--------------------------------------|
|  sa.key           |                  | kube-controller-manager | --service-account-private-key-file   |
|                   | sa.pub           | kube-apiserver          | --service-account-key-file           |

Следующий пример показывает пути [из предыдущих таблиц](#certificate-paths),
которые нужно предоставить при самостоятельной генерации всех ключей и сертификатов:

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

## Настройка сертификатов учётных записей пользователей {#configure-certificates-for-user-accounts}

Следующие учётные записи администраторов и сервисные аккаунты необходимо настроить вручную:

| Имя файла | Имя учётных данных | CN по умолчанию | O (в Subject) |
|-------------------------|----------------------------|-------------------------------------|------------------------|
| admin.conf              | default-admin              | kubernetes-admin                    | `<admin-group>`        |
| super-admin.conf        | default-super-admin        | kubernetes-super-admin              | system:masters         |
| kubelet.conf            | default-auth               | system:node:`<nodeName>` (см. примечание) | system:nodes           |
| controller-manager.conf | default-controller-manager | system:kube-controller-manager      |                        |
| scheduler.conf          | default-scheduler          | system:kube-scheduler               |                        |

{{< note >}}
Значение `<nodeName>` в `kubelet.conf` **должно** точно совпадать с именем узла,
которое kubelet передаёт при регистрации на apiserver.
Подробнее см. [Авторизация узлов](/docs/reference/access-authn-authz/node/).
{{< /note >}}

{{< note >}}
В примере выше `<admin-group>` зависит от реализации. Некоторые инструменты подписывают
сертификат в стандартном `admin.conf` для включения в группу `system:masters`.
`system:masters` — группа суперпользователей для аварийного доступа,
способная обходить слой авторизации Kubernetes, например RBAC.
Также некоторые инструменты не создают отдельный `super-admin.conf`
с сертификатом, привязанным к этой группе суперпользователей.

kubeadm создаёт два отдельных сертификата администратора в файлах kubeconfig.
Один находится в `admin.conf` и имеет `Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`.
`kubeadm:cluster-admins` — пользовательская группа, связанная с ClusterRole `cluster-admin`.
Этот файл создаётся на всех машинах управляющего слоя, которыми управляет kubeadm.

Другой находится в `super-admin.conf` и имеет `Subject: O = system:masters, CN = kubernetes-super-admin`.
Этот файл создаётся только на узле, на котором вызывалась команда `kubeadm init`.
{{< /note >}}

1. Для каждой конфигурации создайте пару сертификата x509 и ключа
   с указанными общим именем (Common Name, CN) и организацией (Organization, O).

1. Для каждой конфигурации выполните команды `kubectl`:

   ```
   KUBECONFIG=<filename> kubectl config set-cluster default-cluster --server=https://<host ip>:6443 --certificate-authority <path-to-kubernetes-ca> --embed-certs
   KUBECONFIG=<filename> kubectl config set-credentials <credential-name> --client-key <path-to-key>.pem --client-certificate <path-to-cert>.pem --embed-certs
   KUBECONFIG=<filename> kubectl config set-context default-system --cluster default-cluster --user <credential-name>
   KUBECONFIG=<filename> kubectl config use-context default-system
   ```

Эти файлы используются следующим образом:

| Имя файла | Команда | Примечание |
|-------------------------|-------------------------|-----------------------------------------------------------------------|
| admin.conf              | kubectl                 | Настраивает учётную запись администратора кластера                         |
| super-admin.conf        | kubectl                 | Настраивает учётную запись суперадминистратора кластера                   |
| kubelet.conf            | kubelet                 | Нужен для каждого узла кластера.                            |
| controller-manager.conf | kube-controller-manager | Должен быть добавлен в манифест `manifests/kube-controller-manager.yaml` |
| scheduler.conf          | kube-scheduler          | Должен быть добавлен в манифест `manifests/kube-scheduler.yaml`          |

Полные пути к файлам из предыдущей таблицы:

```
/etc/kubernetes/admin.conf
/etc/kubernetes/super-admin.conf
/etc/kubernetes/kubelet.conf
/etc/kubernetes/controller-manager.conf
/etc/kubernetes/scheduler.conf
```
