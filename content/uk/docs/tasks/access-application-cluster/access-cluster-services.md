---
title: Доступ до сервісів, що працюють у кластерах
content_type: task
weight: 140
---

<!-- overview -->
На цій сторінці показано, як підʼєднатися до сервісів, що працюють у кластері Kubernetes.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Доступ до сервісів, що працюють у кластері {#accessing-services-running-on-the-cluster}

У Kubernetes [вузли](/docs/concepts/architecture/nodes/), [Podʼи](/docs/concepts/workloads/pods/) і [сервіси](/docs/concepts/services-networking/service/) мають власні IP-адреси. У багатьох випадках IP-адреси вузлів, Podʼів і деяких сервісів у кластері не маршрутизуються, тому вони недосяжні з машини поза кластером, наприклад із вашого настільного компʼютера.

### Способи підʼєднання {#ways-to-connect}

Є кілька варіантів підʼєднання до вузлів, Podʼів і сервісів ззовні кластера:

- Доступ до сервісів через публічні IP-адреси.
  - Використайте Service типу `NodePort` або `LoadBalancer`, щоб зробити сервіс доступним ззовні кластера. Дивіться документацію про [Services](/docs/concepts/services-networking/service/) і [kubectl expose](/docs/reference/generated/kubectl/kubectl-commands/#expose).
  - Залежно від середовища кластера сервіс може стати доступним лише у вашій корпоративній мережі або в інтернеті. Подумайте, чи є сервіс, до якого відкривається доступ, безпечним. Чи виконує він власну автентифікацію?
  - Розміщуйте Podʼи за сервісами. Щоб отримати доступ до одного конкретного Podʼа з набору реплік, наприклад для налагодження, додайте до Podʼа унікальну мітку й створіть новий Service, який вибирає цю мітку.
  - У більшості випадків розробнику застосунків не потрібно звертатися до вузлів безпосередньо за їхніми nodeIP.
- Доступ до сервісів, вузлів або Podʼів за допомогою дієслова Proxy.
  - Виконує автентифікацію й авторизацію на API-сервері перед доступом до віддаленого сервісу. Використовуйте це, якщо сервіси недостатньо безпечні для відкриття в інтернет, для доступу до портів на IP-адресі вузла або для налагодження.
  - Проксі можуть викликати проблеми для деяких вебзастосунків.
  - Працює лише для HTTP/HTTPS.
  - Описано [тут](#manually-constructing-apiserver-proxy-urls).
- Доступ з вузла або Podʼа в кластері.
  - Запустіть Pod, а потім підʼєднайтеся до оболонки в ньому за допомогою [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec). З цієї оболонки підʼєднуйтеся до інших вузлів, Podʼів і сервісів.
  - Деякі кластери дозволяють підʼєднатися до вузла кластера через ssh. Звідти ви зможете отримати доступ до сервісів кластера. Це нестандартний спосіб, який працює на одних кластерах і не працює на інших. Браузери та інші інструменти можуть бути не встановлені. DNS кластера може не працювати.

### Виявлення вбудованих сервісів {#discovering-builtin-services}

Зазвичай у кластері є кілька сервісів, запущених у kube-system. Отримайте їх список командою `kubectl cluster-info`:

```shell
kubectl cluster-info
```

Вивід подібний до такого:

```
Kubernetes master is running at https://192.0.2.1
elasticsearch-logging is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy
kibana-logging is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/kibana-logging/proxy
coredns is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/kube-dns/proxy
grafana is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/monitoring-grafana/proxy
heapster is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/monitoring-heapster/proxy
```

Тут показано URL проксі-дієслова для доступу до кожного сервісу. Наприклад, у цьому кластері ввімкнено логування на рівні кластера (за допомогою Elasticsearch), до якого можна звернутися за адресою `https://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/` за наявності відповідних облікових даних або через kubectl proxy, наприклад за адресою `http://localhost:8080/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/`.

{{< note >}}
Про те, як передавати облікові дані або використовувати kubectl proxy, дивіться [Доступ до кластерів за допомогою API Kubernetes](/docs/tasks/administer-cluster/access-cluster-api/#accessing-the-kubernetes-api).
{{< /note >}}

#### Ручне створення URL проксі API-сервера {#manually-constructing-apiserver-proxy-urls}

Як згадано вище, URL проксі сервісу можна отримати командою `kubectl cluster-info`. Щоб створити URL проксі, які містять точки доступу сервісу, суфікси й параметри, додайте їх до URL проксі сервісу: `http://`*`kubernetes_master_address`*`/api/v1/namespaces/`*`namespace_name`*`/services/`*`[https:]service_name[:port_name]`*`/proxy`

Якщо ви не задали назву порту, *port_name* в URL вказувати не потрібно. Також можна використовувати номер порту замість *port_name* як для іменованих, так і для неіменованих портів.

Стандартно API-сервер проксіює запити до вашого сервісу через HTTP. Щоб використовувати HTTPS, додайте до назви сервісу префікс `https:`: `http://<kubernetes_master_address>/api/v1/namespaces/<namespace_name>/services/<service_name>/proxy`

Підтримувані формати сегмента `<service_name>` в URL:

- `<service_name>` — проксіює до стандартного або неіменованого порту через http
- `<service_name>:<port_name>` — проксіює до вказаної назви порту або номера порту через http
- `https:<service_name>:` — проксіює до стандартного або неіменованого порту через https (зверніть увагу на двокрапку в кінці)
- `https:<service_name>:<port_name>` — проксіює до вказаної назви порту або номера порту через https

##### Приклади {#examples}

- Щоб отримати доступ до точки доступу `_search?q=user:kimchy` сервісу Elasticsearch, використайте:

  ```
  http://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/_search?q=user:kimchy
  ```

- Щоб отримати інформацію про справність кластера Elasticsearch `_cluster/health?pretty=true`, використайте:

  ```
  https://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/_cluster/health?pretty=true
  ```

  Інформація про справність подібна до такої:

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

- Щоб отримати інформацію про справність сервісу Elasticsearch через *https* `_cluster/health?pretty=true`, використайте:

  ```
  https://192.0.2.1/api/v1/namespaces/kube-system/services/https:elasticsearch-logging:/proxy/_cluster/health?pretty=true
  ```

#### Використання браузерів для доступу до сервісів, що працюють у кластері {#using-web-browsers-to-access-services-running-on-the-cluster}

Ви можете ввести URL проксі API-сервера в адресний рядок браузера. Однак:

- Браузери зазвичай не можуть передавати токени, тому може знадобитися базова автентифікація (пароль). API-сервер можна налаштувати на прийняття базової автентифікації, але ваш кластер може бути не налаштований на це.
- Деякі вебзастосунки можуть не працювати, особливо ті, що мають клієнтський javascript, який створює URL, не враховуючи префікс шляху проксі.
