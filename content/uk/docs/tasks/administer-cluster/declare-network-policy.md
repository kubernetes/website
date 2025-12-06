---
title: Оголошення мережевої політики
min-kubernetes-server-version: v1.8
content_type: task
weight: 180
---

<!-- overview -->

Цей документ допоможе вам розпочати використання API мережевої політики Kubernetes [NetworkPolicy API](/docs/concepts/services-networking/network-policies/), щоб оголосити політики мережі, які керують тим, як Podʼи спілкуються один з одним.

{{% thirdparty-content %}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Переконайтеся, що ви налаштували постачальника мережі з підтримкою політики мережі. Існує кілька постачальників мережі, які підтримують NetworkPolicy, включаючи:

* [Antrea](/docs/tasks/administer-cluster/network-policy-provider/antrea-network-policy/)
* [Calico](/docs/tasks/administer-cluster/network-policy-provider/calico-network-policy/)
* [Cilium](/docs/tasks/administer-cluster/network-policy-provider/cilium-network-policy/)
* [Kube-router](/docs/tasks/administer-cluster/network-policy-provider/kube-router-network-policy/)
* [Romana](/docs/tasks/administer-cluster/network-policy-provider/romana-network-policy/)
* [Weave Net](/docs/tasks/administer-cluster/network-policy-provider/weave-network-policy/)

<!-- steps -->

## Створення `nginx` deployment та надання доступу через Service {#create-an-nginx-deployment-and-expose-it-via-a-service}

Щоб переглянути, як працює політика мережі Kubernetes, почніть зі створення Deployment `nginx`.

```console
kubectl create deployment nginx --image=nginx
```

```none
deployment.apps/nginx created
```

Експонуйте Deployment через Service під назвою `nginx`.

```console
kubectl expose deployment nginx --port=80
```

```none
service/nginx exposed
```

Вищезазначені команди створюють Deployment з Podʼом nginx і експонують Deployment через Service під назвою `nginx`. Pod nginx та Deployment знаходяться в просторі імен `default`.

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

## Перевірте роботу Service, звернувшись до неї з іншого Podʼа {#test-the-service-by-accessing-it-from-another-pod}

Ви повинні мати можливість звернутися до нового Service `nginx` з інших Podʼів. Щоб отримати доступ до Service `nginx` з іншого Podʼа в просторі імен `default`, запустіть контейнер busybox:

```console
kubectl run busybox --rm -ti --image=busybox -- /bin/sh
```

У вашій оболонці запустіть наступну команду:

```shell
wget --spider --timeout=1 nginx
```

```none
Connecting to nginx (10.100.0.16:80)
remote file exists
```

## Обмеження доступу до Service `nginx` {#limit-access-to-the-nginx-service}

Щоб обмежити доступ до Service `nginx` так, щоб запити до неї могли робити лише Podʼи з міткою `access: true`, створіть обʼєкт NetworkPolicy наступним чином:

{{% code_sample file="service/networking/nginx-policy.yaml" %}}

Назва обʼєкта NetworkPolicy повинна бути дійсним [піддоменом DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

{{< note >}}
NetworkPolicy включає `podSelector`, який вибирає групу Podʼів, до яких застосовується політика. Ви можете побачити, що ця політика вибирає Podʼи з міткою `app=nginx`. Мітка автоматично додавалася до Podʼа в Deployment `nginx`. Порожній `podSelector` вибирає всі Podʼи в просторі імен.
{{< /note >}}

## Назначте політику для Service {#apply-the-policy-to-the-service}

Використовуйте kubectl для створення NetworkPolicy з файлу `nginx-policy.yaml` вище:

```console
kubectl apply -f https://k8s.io/examples/service/networking/nginx-policy.yaml
```

```none
networkpolicy.networking.k8s.io/access-nginx created
```

## Перевірте доступ до Service, коли мітка доступу не визначена {#test-access-to-the-service-when-the-access-label-is-not-defined}

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

## Визначте мітку доступу і перевірте знову {#define-access-label-and-test-again}

Ви можете створити Pod із відповідними мітками, щоб переконатися, що запит дозволено:

```console
kubectl run busybox --rm -ti --labels="access=true" --image=busybox -- /bin/sh
```

У вашій оболонці запустіть команду:

```shell
wget --spider --timeout=1 nginx
```

```none
Connecting to nginx (10.100.0.16:80)
remote file exists
```
