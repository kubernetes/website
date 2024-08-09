---
title: Адміністрування кластеру
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
    title: Забезпечення роботи кластера
---

<!-- overview -->

Огляд адміністрування кластера призначений для всіх, хто створює або адмініструє кластер Kubernetes. Він передбачає певний рівень знайомства з основними [концепціями](/docs/concepts/).

<!-- body -->

## Планування кластера {#planning-a-cluster}

Ознайомтеся з посібниками в розділі [Встановлення](/docs/setup/) для прикладів планування, налаштування та конфігурації кластерів Kubernetes. Рішення, перераховані в цій статті, називаються *distros*.

{{< note  >}}
Не всі distros активно підтримуються. Вибирайте distros, які були протестовані з останньою версією Kubernetes.
{{< /note >}}

Перед вибором посібника врахуйте наступні моменти:

* Чи хочете ви спробувати Kubernetes на своєму компʼютері, чи хочете побудувати кластер високої доступності з кількома вузлами? Вибирайте distros, які найкраще підходять для ваших потреб.
* Чи будете ви використовувати **кластер Kubernetes, розміщений на хостингу**, такому як [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/), чи **створюватимете свій власний кластер**?
* Чи буде ваш кластер **на місці**, чи **в хмарі (IaaS)**? Kubernetes напряму не підтримує гібридні кластери. Замість цього ви можете налаштувати кілька кластерів.
* **Якщо ви налаштовуєте Kubernetes на місці**, розгляньте, яка [модель мережі](/docs/concepts/cluster-administration/networking/) підходить найкраще.
* Чи будете ви запускати Kubernetes на **"bare metal" обладнанні** чи на **віртуальних машинах (VMs)**?
* Ви **хочете мати робочий кластер**, чи плануєте **активний розвиток коду проєкту Kubernetes**? Якщо останнє, вибирайте distros, які активно розвиваються. Деякі distros використовують лише бінарні релізи, але пропонують більшу різноманітність вибору.
* Ознайомтеся з [компонентами](/docs/concepts/overview/components/), необхідними для запуску кластера.

## Адміністрування кластера {#managing-a-cluster}

* Дізнайтеся, як [керувати вузлами](/docs/concepts/architecture/nodes/).

* Дізнайтеся, як налаштовувати та керувати [квотою ресурсів](/docs/concepts/policy/resource-quotas/) для спільних кластерів.

## Захист кластера {#securing-a-cluster}

* [Генерація сертифікатів](/docs/tasks/administer-cluster/certificates/) описує кроки генерації сертифікатів використовуючи різні інструменти.

* [Оточення контейнерів Kubernetes](/docs/concepts/container-environment/) описує оточення для контейнерів, які керуються за допомогою kubelet на вузлах кластера.

* [Керування доступом до API Kubernetes](/docs/concepts/security/controlling-access/) описує, як Kubernetes реал керування доступом до API.

* [Автентифікація](/docs/reference/access-authn-authz/authentication/) пояснює принципи автентифікації в Kubernetes, включаючи різні методи автентифікації та налаштування.

* [Авторизація](/docs/reference/access-authn-authz/authorization/) відрізняється від автентифікації, контролює як обробляються HTTP-запити.

* [Використання admission-контролерів](/docs/reference/access-authn-authz/admission-controllers/) описує втулки, які перехоплюють запити до API Kubernetes після автентифікації та авторизації.

* [Використання Sysctls в кластері Kubernetes](/docs/tasks/administer-cluster/sysctl-cluster/) описує, як використовувати інструмент командного рядка `sysctl` для налаштування параметрів ядра.

* [Аудит](/docs/tasks/debug-cluster/audit/) описує, як взаємодіяти з аудитом подій в Kubernetes.

### Захист kubelеt {#securing-kubelet}

* [Комунікація Control Plane—Node](/docs/concepts/architecture/control-plane-node-communication/)
* [Розгортання TLS](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
* [Автентифікація/авторизація kubelet](/docs/reference/access-authn-authz/kubelet-authn-authz/)

## Додаткові служби кластера {#optional-cluster-services}

* [Інтеграція DNS](/docs/concepts/services-networking/dns-pod-service/) описує, як надавати DNS-імена безпосередньо службам Kubernetes.

* [Логування та моніторинг активності кластера](/docs/concepts/cluster-administration/logging/) пояснює, як працює логування в Kubernetes та як його реалізувати.
