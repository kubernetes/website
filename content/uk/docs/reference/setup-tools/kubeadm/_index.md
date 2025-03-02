---
title: "Kubeadm"
weight: 10
no_list: true
content_type: concept
card:
  title: Команди kubeadm
  name: setup
  weight: 80
---

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px">Kubeadm — це інструмент, створений для надання команд `kubeadm init` та `kubeadm join` як "швидкі" практичні шляхи для створення кластерів Kubernetes.

kubeadm виконує необхідні дії для запуску мінімально життєздатного кластера. За своєю концепцією, він займається лише процесом розгортання, а не наданням машин. Також встановлення різноманітних додаткових компонентів, таких як інформаційна панель Kubernetes, засоби моніторингу та специфічні для хмарних середовищ надбудови, не є його завданням.

Замість цього ми очікуємо, що на вищому рівні будуть створені більш високорівневі та більш налаштовані інструменти на основі kubeadm, і ідеально використання kubeadm як основи для всіх розгортань спростить створення сумісних кластерів.

## Як встановити {#how-to-install}

Для встановлення kubeadm, див. [посібник з встановлення](/uk/docs/setup/production-environment/tools/kubeadm/install-kubeadm).

## {{% heading "whatsnext" %}}

* [kubeadm init](/uk/docs/reference/setup-tools/kubeadm/kubeadm-init) — для створення вузла панелі управління Kubernetes
* [kubeadm join](/uk/docs/reference/setup-tools/kubeadm/kubeadm-join) — для додавання робочого вузла Kubernetes до кластера
* [kubeadm upgrade](/uk/docs/reference/setup-tools/kubeadm/kubeadm-upgrade) — для оновлення кластера Kubernetes до нової версії
* [kubeadm config](/uk/docs/reference/setup-tools/kubeadm/kubeadm-config) — якщо ви ініціалізували свій кластер за допомогою kubeadm версії 1.7.x або нижче, для налаштування кластера для `kubeadm upgrade`
* [kubeadm token](/uk/docs/reference/setup-tools/kubeadm/kubeadm-token) — для управління токенами для `kubeadm join`
* [kubeadm reset](/uk/docs/reference/setup-tools/kubeadm/kubeadm-reset) — для скасування будь-яких змін, внесених цим хостом за допомогою `kubeadm init` або `kubeadm join`
* [kubeadm certs](/uk/docs/reference/setup-tools/kubeadm/kubeadm-certs) — для управління сертифікатами Kubernetes
* [kubeadm kubeconfig](/uk/docs/reference/setup-tools/kubeadm/kubeadm-kubeconfig) — для управління файлами kubeconfig
* [kubeadm version](/uk/docs/reference/setup-tools/kubeadm/kubeadm-version) — для виводу версії kubeadm
* [kubeadm alpha](/uk/docs/reference/setup-tools/kubeadm/kubeadm-alpha) — для попереднього перегляду набору функцій, що стануть доступними для збору відгуків від спільноти
