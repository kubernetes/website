---
title: Дослідження поведінки завершення роботи для Podʼів та їх точок доступу
content_type: tutorial
weight: 60
---

<!-- overview -->

Коли ви підʼєднали свій застосунок до Service, дотримуючись кроків, схожих на ті, що описані в [Підключення застосунків за допомогою Service](/docs/tutorials/services/connect-applications-service/), у вас є постійно працюючий, реплікований застосунок, який викритий в мережі. Цей посібник допоможе вам розглянути процес завершення роботи для Podʼів та дослідити способи впровадження належного припинення зʼєднань.

<!-- body -->

## Процес завершення роботи для Podʼів та їх точок доступу {#termination-process-for-pods-and-their-endpoints}

Часто виникають випадки, коли потрібно завершити роботу Podʼа — чи то для оновлення, чи то для зменшення масштабу. Для поліпшення доступності застосунку може бути важливо реалізувати правильне завершення активних зʼєднань.

У цьому посібнику пояснюється процес завершення роботи для Podʼів у звʼязку з відповідним станом точки доступу та видаленням за допомогою простого вебсервера nginx для демонстрації концепції.

<!-- body -->

## Приклад процесу з завершенням роботи точки доступу {#example-flow-with-endpoint-termination}

Наведений нижче приклад показує описаний у документі [Завершення роботи Podʼів](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination) процес.

Допустимо, у вас є Deployment, яка складається з одної репліки `nginx` (для демонстраційних цілей) та Service:

{{% code_sample file="service/pod-with-graceful-termination.yaml" %}}

{{% code_sample file="service/explore-graceful-termination-nginx.yaml" %}}

Тепер створіть Pod Deployment та Service, використовуючи вищезазначені файли:

```shell
kubectl apply -f pod-with-graceful-termination.yaml
kubectl apply -f explore-graceful-termination-nginx.yaml
```

Після запуску Podʼа та Service ви можете отримати імʼя будь-яких повʼязаних точок доступу:

```shell
kubectl get endpointslice
```

Вивід подібний до цього:

```none
NAME                  ADDRESSTYPE   PORTS   ENDPOINTS                 AGE
nginx-service-6tjbr   IPv4          80      10.12.1.199,10.12.1.201   22m
```

Ви можете перевірити їх статус та підтвердити, що зареєстровано одну точку доступу:

```shell
kubectl get endpointslices -o json -l kubernetes.io/service-name=nginx-service
```

Вивід подібний до цього:

```json
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

Тепер завершімо роботу Podʼа та перевіримо, що Pod завершується, дотримуючись налаштувань відповідного періоду завершення роботи:

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

Ви бачите, що новий Pod був запланований.

Поки створюється нова точка доступу для нового Podʼа, стара точка доступу все ще знаходиться у стані завершення:

```shell
kubectl get endpointslice -o json nginx-service-6tjbr
```

Вивід подібний до цього:

```json
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

Це дозволяє застосункам передавати свій стан під час завершення, а клієнтам (таким як балансувальники навантаження) реалізувати функціональність завершення зʼєднань. Ці клієнти можуть виявляти завершальні точки доступу та реалізувати спеціальну логіку для них.

У Kubernetes точки доступу, які завершуються, завжди мають свій статус `ready` встановлений як `false`. Це потрібно для забезпечення зворотної сумісності, щоб наявні балансувальники навантаження не використовували їх для звичайного трафіку. Якщо потрібно припинення обробки трафіку на Podʼі, що завершує роботу, фактична готовність може бути перевірені як умова `serving`.

Після видалення Podʼа, стару точку доступу також буде видалено.

## {{% heading "whatsnext" %}}

* Дізнайтеся, як [Підключати застосунки за допомогою Service](/docs/tutorials/services/connect-applications-service/)
* Дізнайтеся більше про [Використання Service для доступу до застосунку у кластері](/docs/tasks/access-application-cluster/service-access-application-cluster/)
* Дізнайтеся більше про [Зʼєднання фронтенду з бекендом за допомогою Service](/docs/tasks/access-application-cluster/connecting-frontend-backend/)
* Дізнайтеся більше про [Створення зовнішнього балансувальника навантаження](/docs/tasks/access-application-cluster/create-external-load-balancer/)
