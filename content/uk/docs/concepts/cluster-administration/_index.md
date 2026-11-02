---
title: Адміністрування кластера
weight: 100
content_type: concept
description: >
  Деталі низького рівня, що стосуються створення та адміністрування кластера Kubernetes.
no_list: true
card:
  name: setup
  weight: 60
  anchors:
  - anchor: "#securing-a-cluster"
    title: Захист кластера
---

<!-- overview -->

Огляд адміністрування кластера призначений для всіх, хто створює кластер Kubernetes або адмініструє його. Він передбачає певне знайомство з основними [концепціями](/docs/concepts/) Kubernetes.

<!-- body -->

## Планування кластера {#planning-a-cluster}

Приклади планування, встановлення та налаштування кластерів Kubernetes дивіться в посібниках у розділі [Встановлення](/docs/setup/). Рішення, перелічені в цій статті, називаються *дистрибутивами* (distros).

{{< note >}}
Не всі дистрибутиви активно підтримуються. Вибирайте дистрибутиви, протестовані з нещодавньою версією Kubernetes.
{{< /note >}}

Перед вибором посібника врахуйте таке:

* Ви хочете спробувати Kubernetes на своєму компʼютері чи побудувати високодоступний кластер із кількома вузлами? Вибирайте дистрибутиви, які найкраще відповідають вашим потребам.
* Ви використовуватимете **кластер Kubernetes на хостингу**, такий як [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/), чи **розміщуватимете власний кластер**?
* Ваш кластер буде **on-premises** чи **у хмарі (IaaS)**? Kubernetes не підтримує гібридні кластери безпосередньо. Натомість ви можете налаштувати кілька кластерів.
* **Якщо ви налаштовуєте Kubernetes on-premises**, визначте, яка [мережева модель](/docs/concepts/cluster-administration/networking/) підходить найкраще.
* Ви запускатимете Kubernetes на **фізичному обладнанні (bare metal)** чи на **віртуальних машинах (VM)**?
* Ви **хочете просто запустити кластер** чи плануєте **активно розробляти код проєкту Kubernetes**? В останньому випадку виберіть дистрибутив, що активно розвивається. Деякі дистрибутиви використовують лише бінарні випуски, але пропонують ширший вибір.
* Ознайомтеся з [компонентами](/docs/concepts/overview/components/), необхідними для запуску кластера.

## Керування кластером {#managing-a-cluster}

* Дізнайтеся, як [керувати вузлами](/docs/concepts/architecture/nodes/).
  * Прочитайте про [автомасштабування вузлів](/docs/concepts/cluster-administration/node-autoscaling/).

* Дізнайтеся, як налаштувати [квоту ресурсів](/docs/concepts/policy/resource-quotas/) для спільних кластерів і керувати нею.

## Захист кластера {#securing-a-cluster}

* [Генерація сертифікатів](/docs/tasks/administer-cluster/certificates/) описує кроки генерації сертифікатів за допомогою різних наборів інструментів.

* [Середовище контейнера Kubernetes](/docs/concepts/containers/container-environment/) описує середовище для контейнерів, керованих kubelet, на вузлі Kubernetes.

* [Керування доступом до API Kubernetes](/docs/concepts/security/controlling-access/) описує, як Kubernetes реалізує керування доступом до API.

* [Автентифікація](/docs/reference/access-authn-authz/authentication/) пояснює автентифікацію в Kubernetes, зокрема різні варіанти автентифікації.

* [Авторизація](/docs/reference/access-authn-authz/authorization/) відокремлена від автентифікації й контролює обробку HTTP-викликів.

* [Використання контролерів допуску](/docs/reference/access-authn-authz/admission-controllers/) пояснює втулки, які перехоплюють запити до API-сервера Kubernetes після автентифікації та авторизації.

* [Рекомендації щодо вебхуків допуску](/docs/concepts/cluster-administration/admission-webhooks-good-practices/) містить рекомендації та міркування щодо проєктування змінювальних і валідаційних вебхуків допуску.

* [Використання sysctl у кластері Kubernetes](/docs/tasks/administer-cluster/sysctl-cluster/) описує адміністратору, як використовувати інструмент командного рядка `sysctl` для встановлення параметрів ядра.

* [Аудит](/docs/tasks/debug/debug-cluster/audit/) описує, як працювати з логами аудиту Kubernetes.

### Захист kubelet {#securing-the-kubelet}

* [Звʼязок між вузлами та панеллю управління](/docs/concepts/architecture/control-plane-node-communication/)
* [TLS bootstrapping](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
* [Автентифікація/авторизація kubelet](/docs/reference/access-authn-authz/kubelet-authn-authz/)

## Необовʼязкові сервіси кластера {#optional-cluster-services}

* [Інтеграція DNS](/docs/concepts/services-networking/dns-pod-service/) описує, як розвʼязувати DNS-імʼя безпосередньо в сервіс Kubernetes.

* [Логування та моніторинг активності кластера](/docs/concepts/cluster-administration/logging/) пояснює, як працює логування в Kubernetes та як його реалізувати.
