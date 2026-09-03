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

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px">Kubeadm — це інструмент, створений для надання команд `kubeadm init` та `kubeadm join` як найкращих "швидких практичних способів" для створення кластерів Kubernetes.

kubeadm виконує необхідні дії для запуску мінімального життєздатного кластера. За своєю концепцією, він займається лише процесом розгортання кластера, створення екземплярів машин не є його функцією. Встановлення різноманітних додаткових компонентів, таких як Kubernetes Dashboard, засобів моніторингу та специфічних для хмарних середовищ надбудов, також не входить в перелік його завдань.

Натомість ми очікуємо, що на базі kubeadm будуть створені більш досконалі та індивідуалізовані інструменти, і, в ідеалі, використання kubeadm як основи для всіх розгортань спростить створення сумісних кластерів.

## Як встановити {#how-to-install}

Для встановлення kubeadm, дивіться «[Посібник з встановлення](/docs/setup/production-environment/tools/kubeadm/install-kubeadm)».

## {{% heading "whatsnext" %}}

* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init) — для запуску вузла панелі управління Kubernetes
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join) — для запуску робочого вузла Kubernetes та додавання його до кластера
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade) — для оновлення кластера Kubernetes до нової версії
* [kubeadm config](/docs/reference/setup-tools/kubeadm/kubeadm-config) — якщо ви ініціалізували свій кластер за допомогою kubeadm версії 1.7.x або старішої, для налаштування кластера для `kubeadm upgrade`
* [kubeadm token](/docs/reference/setup-tools/kubeadm/kubeadm-token) — для управління токенами для `kubeadm join`
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset) — для скасування будь-яких змін, внесених на поточному хості за допомогою `kubeadm init` або `kubeadm join`
* [kubeadm certs](/docs/reference/setup-tools/kubeadm/kubeadm-certs) — для управління сертифікатами Kubernetes
* [kubeadm kubeconfig](/docs/reference/setup-tools/kubeadm/kubeadm-kubeconfig) — для управління файлами kubeconfig
* [kubeadm version](/docs/reference/setup-tools/kubeadm/kubeadm-version) — для виводу версії kubeadm
* [kubeadm alpha](/docs/reference/setup-tools/kubeadm/kubeadm-alpha) — для попереднього перегляду набору функцій, які доступні для збору відгуків від спільноти
