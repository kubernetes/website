---
title: Статті про видалення dockershim та використання сумісних з CRI середовищ виконання
content_type: reference
weight: 20
---

<!-- overview -->

Це список статей й інших сторінок, що стосуються видалення _dockershim_ у Kubernetes та використання сумісних з CRI контейнерних середовищ виконання у звʼязку з цим видаленням.

<!-- body -->

## Проєкт Kubernetes {#kubernetes-project}

* Блог Kubernetes: [Часті запитання щодо видалення Dockershim](/blog/2020/12/02/dockershim-faq/) (оригінал опубліковано 2020/12/02)

* Блог Kubernetes: [Оновлено: Часті запитання щодо видалення Dockershim](/blog/2022/02/17/dockershim-faq/) (оновлення опубліковано 2022/02/17)

* Блог Kubernetes: [Kubernetes переходить від Dockershim: Зобовʼязання та наступні кроки](/blog/2022/01/07/kubernetes-is-moving-on-from-dockershim/) (опубліковано 2022/01/07)

* Блог Kubernetes: [Видалення dockershim наближається. Чи готові ви?](/blog/2021/11/12/are-you-ready-for-dockershim-removal/) (опубліковано 2021/11/12)

* Документація Kubernetes: [Міграція з dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/)

* Документація Kubernetes: [Середовища виконання контейнерів](/docs/setup/production-environment/container-runtimes/)

* Пропозиція щодо покращення Kubernetes: [KEP-2221: Видалення dockershim з kubelet](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2221-remove-dockershim/README.md)

* Проблема пропозиції щодо покращення Kubernetes: [Видалення dockershim з kubelet](https://github.com/kubernetes/enhancements/issues/2221) (_k/enhancements#2221_)

Можна надати відгуки через тікет GitHub [**Відгуки та проблеми видалення Dockershim**](https://github.com/kubernetes/kubernetes/issues/106917) (_k/kubernetes/#106917_).

## Зовнішні джерела {#third-party}

<!-- sort these alphabetically -->

* Документація Amazon Web Services EKS: [Amazon EKS закінчує підтримку Dockershim](https://docs.aws.amazon.com/eks/latest/userguide/dockershim-deprecation.html)

* Відео конференції CNCF: [Навчальні заняття з Kubernetes від Google — Міграція з Dockershim на Containerd](https://www.youtube.com/watch?v=uDOu6rK4yOk) (Ana Caylin, на KubeCon Europe 2019)

* Блог Docker.com: [Що потрібно знати розробникам про Docker, Docker Engine і Kubernetes v1.20](https://www.docker.com/blog/what-developers-need-to-know-about-docker-docker-engine-and-kubernetes-v1-20/) (опубліковано 2020/12/04)

* Канал "_Google Open Source_" на YouTube: [Вивчення Kubernetes з Google — Міграція з Dockershim на Containerd](https://youtu.be/fl7_4hjT52g)

* Блог Microsoft Apps on Azure: [Завершення підтримки dockershim і AKS](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/dockershim-deprecation-and-aks/ba-p/3055902) (опубліковано 2022/01/21)

* Блог Mirantis: [Майбутнє Dockershim — cri-dockerd](https://www.mirantis.com/blog/the-future-of-dockershim-is-cri-dockerd/) (опубліковано 2021/04/21)

* Mirantis: [Mirantis/cri-dockerd](https://mirantis.github.io/cri-dockerd/) Офіційна документація

* Tripwire: [Як майбутнє видалення Dockershim впливає на ваш Kubernetes](https://www.tripwire.com/state-of-security/security-data-protection/cloud/how-dockershim-forthcoming-deprecation-affects-your-kubernetes/) (опубліковано 2021/07/01)
