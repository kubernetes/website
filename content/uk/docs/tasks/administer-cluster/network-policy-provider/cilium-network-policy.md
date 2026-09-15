---
title: Використання Cilium для NetworkPolicy
content_type: task
weight: 30
---

<!-- overview -->

Ця сторінка показує, як використовувати Cilium для NetworkPolicy.

Щоб ознайомитися з основною інформацією про Cilium, прочитайте [Вступ до Cilium](https://docs.cilium.io/en/stable/overview/intro).

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Розгортання Cilium на Minikube для базового тестування {#deploying-cilium-on-minikube-for-basic-testing}

Щоб легко ознайомитися з Cilium, ви можете слідувати [Початковому керівництву Cilium Kubernetes](https://docs.cilium.io/en/stable/gettingstarted/k8s-install-default/) для виконання базової інсталяції Cilium як DaemonSet у Minikube.

Щоб запустити Minikube, потрібна версія v1.5.2 чи новіща, виконайте команду `minikube` з наступними аргументами:

```shell
minikube version
```

```none
minikube version: v1.5.2
```

```shell
minikube start --network-plugin=cni
```

Для Minikube ви можете встановити Cilium за допомогою його CLI інструменту. Спочатку завантажте останню версію CLI за допомогою наступної команди:

```shell
curl -LO https://github.com/cilium/cilium-cli/releases/latest/download/cilium-linux-amd64.tar.gz
```

Потім розпакуйте завантажений файл у вашу теку `/usr/local/bin` за допомогою наступної команди:

```shell
sudo tar xzvfC cilium-linux-amd64.tar.gz /usr/local/bin
rm cilium-linux-amd64.tar.gz
```

Після виконання вищевказаних команд, ви тепер можете встановити Cilium за допомогою наступної команди:

```shell
cilium install
```

Cilium автоматично визначить конфігурацію кластера та створить і встановить відповідні компоненти для успішної інсталяції. Компоненти включають:

- Центр сертифікації (CA) у Secret `cilium-ca` та сертифікати для Hubble (шар спостереження Cilium).
- Сервісні облікові записи.
- Кластерні ролі.
- ConfigMap.
- Agent DaemonSet та Operator Deployment.

Після інсталяції ви можете переглянути загальний статус розгортання Cilium за допомогою команди `cilium status`. Дивіться очікуваний вивід команди `status`
[тут](https://docs.cilium.io/en/stable/gettingstarted/k8s-install-default/#validate-the-installation).

Решта Початкового керівництва пояснює, як застосувати політики безпеки як L3/L4 (тобто IP-адреса + порт), так і L7 (наприклад, HTTP) за допомогою прикладної програми.

## Розгортання Cilium для використання в операційному середовищі {#deploying-cilium-for-production-use}

Для докладних інструкцій з розгортання Cilium для операційного використання, дивіться: [Керівництво з інсталяції Cilium Kubernetes](https://docs.cilium.io/en/stable/network/kubernetes/concepts/). Ця документація включає докладні вимоги, інструкції та приклади файлів DaemonSet для продуктивного використання.

<!-- discussion -->

## Розуміння компонентів Cilium {#understanding-cilium-components}

Розгортання кластера з Cilium додає Podʼи до простору імен `kube-system`. Щоб побачити цей список Podʼів, виконайте:

```shell
kubectl get pods --namespace=kube-system -l k8s-app=cilium
```

Ви побачите список Podʼів, подібний до цього:

```console
NAME           READY   STATUS    RESTARTS   AGE
cilium-kkdhz   1/1     Running   0          3m23s
...
```

Pod `cilium` працює на кожному вузлі вашого кластера і забезпечує виконання мережевої політики для трафіку до/від Podʼів на цьому вузлі за допомогою Linux BPF.

## {{% heading "whatsnext" %}}

Після того, як ваш кластер буде запущений, ви можете перейти до [Оголошення мережевої політики](/docs/tasks/administer-cluster/declare-network-policy/)
для випробування Kubernetes NetworkPolicy з Cilium. Якщо у вас є запитання, звʼяжіться з нами за допомогою [Каналу Cilium у Slack](https://slack.cilium.io/).
