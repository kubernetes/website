---
title: Оголошення мережевої політики
min-kubernetes-server-version: v1.8
content_type: task
weight: 180
---

<!-- overview -->

Цей документ допоможе вам розпочати використання [NetworkPolicy API](/docs/concepts/services-networking/network-policies/) Kubernetes для оголошення мережевих політик, які керують тим, як Podʼи взаємодіють один з одним.

{{% thirdparty-content %}}

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Переконайтеся, що ви налаштували постачальника мережі з підтримкою мережевих політик. Існує кілька постачальників мережі, які підтримують NetworkPolicy, зокрема:

* [Antrea](/docs/tasks/administer-cluster/network-policy-provider/antrea-network-policy/)
* [Calico](/docs/tasks/administer-cluster/network-policy-provider/calico-network-policy/)
* [Cilium](/docs/tasks/administer-cluster/network-policy-provider/cilium-network-policy/)
* [Kube-router](/docs/tasks/administer-cluster/network-policy-provider/kube-router-network-policy/)

<!-- steps -->

## Створення Deployment `nginx` і відкриття доступу до нього через Service {#create-an-nginx-deployment-and-expose-it-via-a-service}

Щоб побачити, як працює мережева політика Kubernetes, почніть зі створення Deployment `nginx`.

```console
kubectl create deployment nginx --image=nginx
```

```none
deployment.apps/nginx created
```

Відкрийте доступ до Deployment через Service з назвою `nginx`.

```console
kubectl expose deployment nginx --port=80
```

```none
service/nginx exposed
```

Наведені вище команди створюють Deployment з Podʼом nginx і відкривають доступ до Deployment через Service з назвою `nginx`. Pod і Deployment `nginx` розміщено в просторі імен `default`.

```console
kubectl get svc,pod
```

```none
NAME                        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE
service/kubernetes          10.100.0.1    <none>        443/TCP    46m
service/nginx               10.100.0.16   <none>        80/TCP     33s

NAME                        READY         STATUS        RESTARTS   AGE
pod/nginx-701339712-e0qfq   1/1           Running       0          35s
```

## Перевірка роботи Service зверненням з іншого Podʼа {#test-the-service-by-accessing-it-from-another-pod}

Ви повинні мати змогу звернутися до нового Service `nginx` з інших Podʼів. Щоб отримати доступ до Service `nginx` з іншого Podʼа в просторі імен `default`, запустіть контейнер busybox:

```console
kubectl run busybox --rm -ti --image=busybox -- /bin/sh
```

У вашій оболонці виконайте таку команду:

```shell
wget --spider --timeout=1 nginx
```

```none
Connecting to nginx (10.100.0.16:80)
remote file exists
```

## Обмеження доступу до Service `nginx` {#limit-access-to-the-nginx-service}

Щоб обмежити доступ до Service `nginx` так, щоб запити до нього могли робити лише Podʼи з міткою `access: true`, створіть такий обʼєкт NetworkPolicy:

{{% code_sample file="service/networking/nginx-policy.yaml" %}}

Назва обʼєкта NetworkPolicy повинна бути дійсним [імʼям піддомену DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

{{< note >}}
NetworkPolicy містить `podSelector`, який вибирає групу Podʼів, до яких застосовується політика. Ви можете побачити, що ця політика вибирає Podʼи з міткою `app=nginx`. Мітку було автоматично додано до Podʼа в Deployment `nginx`. Порожній `podSelector` вибирає всі Podʼи в просторі імен.
{{< /note >}}

## Призначення політики Service {#assign-the-policy-to-the-service}

Використайте kubectl для створення NetworkPolicy з наведеного вище файлу `nginx-policy.yaml`:

```console
kubectl apply -f https://k8s.io/examples/service/networking/nginx-policy.yaml
```

```none
networkpolicy.networking.k8s.io/access-nginx created
```

## Перевірка доступу до Service, коли мітку доступу не визначено {#test-access-to-the-service-when-access-label-is-not-defined}

Коли ви намагаєтеся отримати доступ до Service `nginx` з Podʼа без відповідних міток, запит завершується тайм-аутом:

```console
kubectl run busybox --rm -ti --image=busybox -- /bin/sh
```

У вашій оболонці виконайте команду:

```shell
wget --spider --timeout=1 nginx
```

```none
Connecting to nginx (10.100.0.16:80)
wget: download timed out
```

## Визначення мітки доступу та повторна перевірка {#define-access-label-and-test-again}

Ви можете створити Pod із відповідними мітками, щоб переконатися, що запит дозволено:

```console
kubectl run busybox --rm -ti --labels="access=true" --image=busybox -- /bin/sh
```

У вашій оболонці виконайте команду:

```shell
wget --spider --timeout=1 nginx
```

```none
Connecting to nginx (10.100.0.16:80)
remote file exists
```
