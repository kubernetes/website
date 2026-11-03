---
title: Дослідження поведінки завершення роботи для Podʼів та їх точок доступу
content_type: tutorial
weight: 60
---

<!-- overview -->

Коли ви підʼєднали свій застосунок до Service, дотримуючись кроків, схожих на ті, що описані в [Підключення застосунків за допомогою Service](/docs/tutorials/services/connect-applications-service/), у вас є реплікований застосунок, який постійно працює і доступний у мережі. Цей посібник допоможе вам розглянути процес завершення роботи Podʼів і дослідити способи реалізації коректного завершення зʼєднань (connection draining).

<!-- body -->

## Процес завершення роботи для Podʼів та їх точок доступу {#termination-process-for-pods-and-their-endpoints}

Часто виникають випадки, коли потрібно завершити роботу Podʼа — чи то для оновлення, чи то для зменшення масштабу. Для поліпшення доступності застосунку може бути важливо реалізувати належне завершення активних зʼєднань (draining).

У цьому посібнику пояснюється процес завершення роботи Podʼа у звʼязку з відповідним станом і видаленням точки доступу на прикладі простого вебсервера nginx.

<!-- body -->

## Приклад процесу з завершенням роботи точки доступу {#example-flow-with-endpoint-termination}

Нижче наведено приклад процесу, описаного в документі [Завершення роботи Podʼів](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination).

Припустімо, у вас є Deployment з однією реплікою `nginx` (просто для демонстрації) та Service:

{{% code_sample file="service/pod-with-graceful-termination.yaml" %}}

{{% code_sample file="service/explore-graceful-termination-nginx.yaml" %}}

Тепер створіть Pod Deployment і Service за допомогою наведених вище файлів:

```shell
kubectl apply -f pod-with-graceful-termination.yaml
kubectl apply -f explore-graceful-termination-nginx.yaml
```

Коли Pod і Service запрацюють, ви можете отримати назви всіх повʼязаних EndpointSlice:

```shell
kubectl get endpointslice
```

Вивід подібний до цього:

```none
NAME                  ADDRESSTYPE   PORTS   ENDPOINTS                 AGE
nginx-service-6tjbr   IPv4          80      10.12.1.199,10.12.1.201   22m
```

Ви можете переглянути його статус і переконатися, що зареєстровано одну точку доступу:

```shell
kubectl get endpointslices -o json -l kubernetes.io/service-name=nginx-service
```

Вивід подібний до цього:

```none
{
    "addressType": "IPv4",
    "apiVersion": "discovery.k8s.io/v1",
    "endpoints": [
        {
            "addresses": [
                "10.12.1.201"
            ],
            "conditions": {
                "ready": true,
                "serving": true,
                "terminating": false
```

Тепер завершімо роботу Podʼа й перевіримо, що Pod завершується з дотриманням налаштованого пільгового періоду завершення роботи:

```shell
kubectl delete pod nginx-deployment-7768647bf9-b4b9s
```

Усі Podʼи:

```shell
kubectl get pods
```

Вивід подібний до цього:

```none
NAME                                READY   STATUS        RESTARTS      AGE
nginx-deployment-7768647bf9-b4b9s   1/1     Terminating   0             4m1s
nginx-deployment-7768647bf9-rkxlw   1/1     Running       0             8s
```

Ви бачите, що новий Pod заплановано.

Поки для нового Podʼа створюється нова точка доступу, стара точка доступу все ще існує у стані завершення роботи:

```shell
kubectl get endpointslice -o json nginx-service-6tjbr
```

Вивід подібний до цього:

```none
{
    "addressType": "IPv4",
    "apiVersion": "discovery.k8s.io/v1",
    "endpoints": [
        {
            "addresses": [
                "10.12.1.201"
            ],
            "conditions": {
                "ready": false,
                "serving": true,
                "terminating": true
            },
            "nodeName": "gke-main-default-pool-dca1511c-d17b",
            "targetRef": {
                "kind": "Pod",
                "name": "nginx-deployment-7768647bf9-b4b9s",
                "namespace": "default",
                "uid": "66fa831c-7eb2-407f-bd2c-f96dfe841478"
            },
            "zone": "us-central1-c"
        },
        {
            "addresses": [
                "10.12.1.202"
            ],
            "conditions": {
                "ready": true,
                "serving": true,
                "terminating": false
            },
            "nodeName": "gke-main-default-pool-dca1511c-d17b",
            "targetRef": {
                "kind": "Pod",
                "name": "nginx-deployment-7768647bf9-rkxlw",
                "namespace": "default",
                "uid": "722b1cbe-dcd7-4ed4-8928-4a4d0e2bbe35"
            },
            "zone": "us-central1-c"
```

Це дозволяє застосункам повідомляти свій стан під час завершення роботи, а клієнтам (таким як балансувальники навантаження) — реалізувати завершення зʼєднань (connection draining). Ці клієнти можуть виявляти точки доступу, що завершують роботу, і застосовувати до них спеціальну логіку.

У Kubernetes точки доступу, які завершують роботу, завжди мають статус `ready`, встановлений у `false`. Це потрібно для зворотної сумісності, щоб наявні балансувальники навантаження не використовували їх для звичайного трафіку. Якщо потрібно завершувати обробку трафіку (draining) на Podʼі, що завершує роботу, фактичну готовність можна перевірити за умовою `serving`.

Коли Pod видаляється, стару точку доступу також буде видалено.

## {{% heading "whatsnext" %}} {#what-s-next}

* Дізнайтеся, як [Підключати застосунки за допомогою Service](/docs/tutorials/services/connect-applications-service/)
* Дізнайтеся більше про [Використання Service для доступу до застосунку у кластері](/docs/tasks/access-application-cluster/service-access-application-cluster/)
* Дізнайтеся більше про [Зʼєднання фронтенду з бекендом за допомогою Service](/docs/tasks/access-application-cluster/connecting-frontend-backend/)
* Дізнайтеся більше про [Створення зовнішнього балансувальника навантаження](/docs/tasks/access-application-cluster/create-external-load-balancer/)
