---
title: Використання Weave Net для NetworkPolicy
content_type: task
weight: 60
---

<!-- overview -->

Ця сторінка показує, як використовувати Weave Net для NetworkPolicy.

## {{% heading "prerequisites" %}}

Вам потрібен Kubernetes кластер. Слідуйте [початковому керівництву kubeadm](/docs/reference/setup-tools/kubeadm/), щоб його налаштувати.

<!-- steps -->

## Встановлення надбудови Weave Net {#installing-weave-net-addon}

Слідуйте керівництву [Інтеграція Kubernetes через надбудову](https://github.com/weaveworks/weave/blob/master/site/kubernetes/kube-addon.md#-installation).

Надбудова Weave Net для Kubernetes містить [Контролер мережевих політик](https://github.com/weaveworks/weave/blob/master/site/kubernetes/kube-addon.md#network-policy), який автоматично відстежує всі анотації мережевих політик у Kubernetes у всіх просторах імен і налаштовує правила `iptables` для дозволу або блокування трафіку відповідно до цих політик.

## Тестування встановлення {#testing-the-installation}

Перевірте, що Weave працює коректно.

Введіть наступну команду:

```shell
kubectl get pods -n kube-system -o wide
```

Вивід буде схожим на це:

```none
NAME                                    READY     STATUS    RESTARTS   AGE       IP              NODE
weave-net-1t1qg                         2/2       Running   0          9d        192.168.2.10    worknode3
weave-net-231d7                         2/2       Running   1          7d        10.2.0.17       worknodegpu
weave-net-7nmwt                         2/2       Running   3          9d        192.168.2.131   masternode
weave-net-pmw8w                         2/2       Running   0          9d        192.168.2.216   worknode2
```

На кожному вузлі є Pod Weave, і всі Podʼи `Running` та `2/2 READY`. (`2/2` означає, що кожен Pod має `weave` і `weave-npc`.)

## {{% heading "whatsnext" %}}

Після встановлення надбудови Weave Net ви можете перейти до [Оголошення мережевої політики](/docs/tasks/administer-cluster/declare-network-policy/), щоб спробувати Kubernetes NetworkPolicy. Якщо у вас є запитання, звертайтеся до нас [#weave-community у Slack або Weave User Group](https://github.com/weaveworks/weave#getting-help).
