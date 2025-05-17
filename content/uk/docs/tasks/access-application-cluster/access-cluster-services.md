---
title: Доступ до Service, що працюють в кластерах
content_type: task
weight: 140
---

<!-- overview -->
Ця сторінка показує, як підʼєднатись до Serviceʼів, що працюють у кластері Kubernetes.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Доступ до Serviceʼів, що працюють у кластері {#accessing-services-running-on-the-cluster}

У Kubernetes [Вузли](/docs/concepts/architecture/nodes/),
[Podʼи](/docs/concepts/workloads/pods/) та [Serviceʼи](/docs/concepts/services-networking/service/) мають власні IP-адреси. У багатьох випадках IP-адреси вузлів, Podʼів та деякі IP-адреси Service у кластері не можуть бути маршрутизовані, тому вони не будуть досяжними з машини за межами кластера, такої як ваш настільний компʼютер.

### Способи приєднання {#ways-to-connect}

Ви маєте кілька варіантів приєднання до вузлів, Podʼів та Serviceʼів ззовні кластера:

- Доступ до Servicʼів через публічні IP-адреси.
  - Використовуйте Service з типом `NodePort` або `LoadBalancer`, щоб зробити Service доступним ззовні кластера. Дивіться документацію [Service](/docs/concepts/services-networking/service/) та [kubectl expose](/docs/reference/generated/kubectl/kubectl-commands/#expose).
  - Залежно від середовища вашого кластера, це може тільки відкрити Service для вашої корпоративної мережі, або ж зробити його доступним в інтернеті. Подумайте, чи є Service безпечним для відкриття. Чи має він власну автентифікацію?
  - Розміщуйте Podʼи за Serviceʼами. Щоб отримати доступ до одного конкретного Pod з набору реплік, наприклад, для налагодження, додайте унікальну мітку до Podʼа і створіть новий Service, який обирає цю мітку.
  - У більшості випадків розробнику застосунків не потрібно безпосередньо звертатися до вузлів за їх IP-адресами.
- Доступ до Serviceʼів, вузлів або Podʼів за допомогою проксі-дієслова (Proxy Verb).
  - Виконує автентифікацію та авторизацію на api-сервері перед доступом до віддаленого Service. Використовуйте це, якщо Service недостатньо безпечні для відкриття в інтернеті, або для доступу до портів на IP-адресі вузла, або для налагодження.
  - Проксі можуть викликати проблеми для деяких вебзастосунків.
  - Працює тільки для HTTP/HTTPS.
  - Описано [тут](#manually-constructing-apiserver-proxy-urls).
- Доступ з вузла або Podʼа в кластері.
  - Запустіть Pod та отримайте доступ до shell у ньому за допомогою [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec). Підʼєднуйтесь до інших вузлів, Podʼів та Serviceʼів з цього shell.
  - Деякі кластери можуть дозволити вам підʼєднатись по SSH до вузла в кластері. Звідти ви можете отримати доступ до Serviceʼів кластера. Це нестандартний метод і працюватиме на одних кластерах, але на інших — ні. Оглядачі та інші інструменти можуть бути встановлені або не встановлені. DNS кластера може не працювати.

### Виявлення вбудованих Service {#discovering-builtin-services}

Зазвичай у кластері є кілька Serviceʼів, які запускаються у просторі імен kube-system. Отримайте їх список
за допомогою команди `kubectl cluster-info`:

```shell
kubectl cluster-info
```

Вихідні дані подібні до цього:

```none
Kubernetes master is running at https://192.0.2.1
elasticsearch-logging is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy
kibana-logging is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/kibana-logging/proxy
kube-dns is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/kube-dns/proxy
grafana is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/monitoring-grafana/proxy
heapster is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/monitoring-heapster/proxy
```

Це показує URL з проксі-дієсловом для доступу до кожного Service. Наприклад, у цьому кластері ввімкнено кластерне логування (з використанням Elasticsearch), до якого можна звернутися за адресою `https://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/` за умови наявності відповідних облікових даних або через проксі kubectl за адресою: `http://localhost:8080/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/`.

{{< note >}}
Дивіться [Доступ до кластерів за допомогою Kubernetes API](/docs/tasks/administer-cluster/access-cluster-api/#accessing-the-kubernetes-api) щоб дізнатися, як передати облікові дані або використовувати проксі kubectl.
{{< /note >}}

#### Ручне створення URL-адрес проксі api-сервера {#manually-constructing-apiserver-proxy-urls}

Як згадувалося вище, ви використовуєте команду `kubectl cluster-info`, щоб отримати URL проксі для Service. Щоб створити URL-адреси проксі, що включають точки доступу Service, суфікси та параметри, додайте до URL проксі Serviceʼу:
`http://`*`kubernetes_master_address`*`/api/v1/namespaces/`*`namespace_name`*`/services/`*`[https:]service_name[:port_name]`*`/proxy`

Якщо ви не задали імʼя для вашого порту, вам не потрібно вказувати *port_name* в URL. Ви також можете використовувати номер порту замість *port_name* для іменованих та неіменованих портів.

Стандартно апі-сервер проксює до вашого Serviceʼу за допомогою HTTP. Щоб використовувати HTTPS, додайте префікс до імені Serviceʼу `https:`: `http://<kubernetes_master_address>/api/v1/namespaces/<namespace_name>/services/<service_name>/proxy`.

Підтримувані формати для сегмента `<service_name>` URL-адреси:

- `<service_name>` — проксює до стандартного порту або до неіменованого порту за допомогою http
- `<service_name>:<port_name>` — проксює до вказаного імені порту або номера порту за допомогою http
- `https:<service_name>:` — проксює до стандартного порту або до неіменованого порту за допомогою https (зверніть увагу на кінцеву двокрапку)
- `https:<service_name>:<port_name>` — проксює до вказаного імені порту або номера порту за допомогою https

##### Приклади {#examples}

- Для доступу до точки доступу сервісу Elasticsearch `_search?q=user:kimchy`, використовуйте:

  ```none
  http://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/_search?q=user:kimchy
  ```

- Для доступу до інформації про стан кластера Elasticsearch `_cluster/health?pretty=true`, використовуйте:

  ```none
  https://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/_cluster/health?pretty=true
  ```

  Інформація про стан подібна до цієї:

  ```json
  {
    "cluster_name" : "kubernetes_logging",
    "status" : "yellow",
    "timed_out" : false,
    "number_of_nodes" : 1,
    "number_of_data_nodes" : 1,
    "active_primary_shards" : 5,
    "active_shards" : 5,
    "relocating_shards" : 0,
    "initializing_shards" : 0,
    "unassigned_shards" : 5
  }
  ```

- Для доступу до *https* інформації про стан кластера Elasticsearch `_cluster/health?pretty=true`, використовуйте:

  ```none
  https://192.0.2.1/api/v1/namespaces/kube-system/services/https:elasticsearch-logging:/proxy/_cluster/health?pretty=true
  ```

#### Використання вебоглядачів для доступу до Serviceʼів, що працюють у кластері {#using-web-browsers-to-access-services-running-on-the-cluster}

Ви можете вставити URL-адресу проксі api-сервера у адресний рядок оглядача. Однак:

- Вебоглядачі зазвичай не можуть передавати токени, тому вам може доведеться використовувати базову автентифікацію (пароль). Api-сервер можна налаштувати для роботи з базовою автентифікацією, але ваш кластер може бути не налаштований для цього.
- Деякі вебзастосунки можуть не працювати, особливо ті, що використовують клієнтський javascript для створення URL-адрес, не знаючи про префікс шляху проксі.
