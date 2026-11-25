---
title: Pod Security Admission
description: >
  Огляд контролера Pod Security Admission, який може застосовувати стандарти безпеки Podʼів.
content_type: concept
weight: 20
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

[Стандарти безпеки Podʼів](/docs/concepts/security/pod-security-standards/) Kubernetes визначають різні рівні ізоляції для Podʼів. Ці стандарти дозволяють чітко й послідовно визначити, як ви хочете обмежувати поведінку Podʼів.

Kubernetes пропонує вбудований {{< glossary_tooltip text="контролер допуску" term_id="admission-controller" >}} _Pod Security_ для застосування стандартів безпеки Podʼів. Обмеження безпеки Podʼів застосовуються на рівні {{< glossary_tooltip text="простору імен" term_id="namespace" >}} під час створення Podʼів.

### Вбудоване застосування Pod Security admission {#built-in-pod-security-admission-enforcement}

Ця сторінка є частиною документації Kubernetes v{{< skew currentVersion >}}. Якщо ви використовуєте іншу версію Kubernetes, перегляньте документацію для цієї версії.

<!-- body -->

## Рівні безпеки Podʼів {#pod-security-levels}

Pod Security admission висуває вимоги до [контексту безпеки](/docs/tasks/configure-pod-container/security-context/) Podʼа та інших повʼязаних полів відповідно до трьох рівнів, визначених [стандартами безпеки Podʼів](/docs/concepts/security/pod-security-standards): `privileged`, `baseline` та `restricted`. Докладний огляд цих вимог дивіться на сторінці [Стандарти безпеки Podʼів](/docs/concepts/security/pod-security-standards).

## Мітки Pod Security Admission для просторів імен {#pod-security-admission-labels-for-namespaces}

Після ввімкнення можливості або встановлення вебхука ви можете налаштувати простори імен, щоб визначити режим контролю допуску, який використовуватиметься для безпеки Podʼів у кожному просторі імен. Kubernetes визначає набір {{< glossary_tooltip term_id="label" text="міток" >}}, які можна встановити, щоб вибрати попередньо визначений рівень стандарту безпеки Podʼів для простору імен. Вибрана мітка визначає, яку дію виконає {{< glossary_tooltip text="панель управління" term_id="control-plane" >}}, якщо виявлено потенційне порушення:

{{< table caption="Режими Pod Security Admission" >}}
Режим | Опис
:---------|:------------
**enforce** | Порушення політики призводить до відхилення Podʼа.
**audit** | Порушення політики спричиняє додавання анотації аудиту до події, записаної в [лог аудиту](/docs/tasks/debug/debug-cluster/audit/), але в іншому Pod дозволяється.
**warn** | Порушення політики спричиняє попередження для користувача, але в іншому Pod дозволяється.
{{< /table >}}

Простір імен може налаштувати будь-який або всі режими, або навіть встановити різний рівень для різних режимів.

Для кожного режиму існують дві мітки, які визначають використовувану політику:

```yaml
# Мітка рівня режиму вказує, який рівень політики застосовується для режиму.
#
# РЕЖИМ повинен бути одним з `enforce`, `audit` або `warn`.
# РІВЕНЬ повинен бути одним з `privileged`, `baseline` або `restricted`.
pod-security.kubernetes.io/<РЕЖИМ>: <РІВЕНЬ>

# Необовʼязково: мітка версії режиму, яку можна використовувати для привʼязки політики до
# версії, що поставляється з певною мінорною версією Kubernetes (наприклад, v{{< skew currentVersion >}}).
#
# РЕЖИМ повинен бути одним з `enforce`, `audit` або `warn`.
# ВЕРСІЯ повинна бути дійсною мінорною версією Kubernetes або `latest`.
pod-security.kubernetes.io/<РЕЖИМ>-version: <ВЕРСІЯ>
```

Приклад використання дивіться в розділі [Застосування стандартів безпеки Podʼів за допомогою міток просторів імен](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels).

## Ресурси робочих навантажень і шаблони Podʼів {#workload-resources-and-pod-templates}

Podʼи часто створюються опосередковано, через створення [обʼєкта робочого навантаження](/docs/concepts/workloads/controllers/), такого як {{< glossary_tooltip term_id="deployment" >}} або {{< glossary_tooltip term_id="job">}}. Обʼєкт робочого навантаження визначає _шаблон Podʼа_, а {{< glossary_tooltip term_id="controller" text="контролер" >}} ресурсу робочого навантаження створює Podʼи на основі цього шаблону. Щоб вчасно виявляти порушення, режими audit та warn застосовуються до ресурсів робочих навантажень. Однак режим enforce **не** застосовується до ресурсів робочих навантажень, а лише до створених обʼєктів Pod.

## Винятки {#exemptions}

Ви можете визначити _винятки_ із застосування безпеки Podʼів, щоб дозволити створення Podʼів, які інакше були б заборонені політикою відповідного простору імен. Винятки можна статично налаштувати в [конфігурації контролера допуску](/docs/tasks/configure-pod-container/enforce-standards-admission-controller/#configure-the-admission-controller).

Винятки мають бути явно перелічені. Запити, що відповідають критеріям винятків, контролер допуску _ігнорує_ (уся поведінка `enforce`, `audit` та `warn` пропускається). Виміри винятків:

- **Usernames:** запити від користувачів з автентифікованим (або імперсонованим) іменем, внесеним до винятків, ігноруються.
- **RuntimeClassNames:** Podʼи та [ресурси робочих навантажень](#workload-resources-and-pod-templates), що вказують назву класу виконання, внесену до винятків, ігноруються.
- **Namespaces:** Podʼи та [ресурси робочих навантажень](#workload-resources-and-pod-templates) у просторі імен, внесеному до винятків, ігноруються.

{{< caution >}}

Більшість Podʼів створює контролер у відповідь на [ресурс робочого навантаження](#workload-resources-and-pod-templates), тому виняток для кінцевого користувача звільнить його від застосування політики лише під час безпосереднього створення Podʼів, але не під час створення ресурсу робочого навантаження. ServiceAccount контролерів (наприклад, `system:serviceaccount:kube-system:replicaset-controller`) зазвичай не слід вносити до винятків, оскільки це неявно звільнить будь-якого користувача, який може створити відповідний ресурс робочого навантаження.

{{< /caution >}}

Оновлення таких полів Podʼа звільнені від перевірок політики, тобто якщо запит на оновлення Podʼа змінює лише ці поля, його не буде відхилено, навіть якщо Pod порушує поточний рівень політики:

- Будь-які оновлення метаданих, **крім** змін анотацій seccomp або AppArmor:
  - `seccomp.security.alpha.kubernetes.io/pod` (застаріла)
  - `container.seccomp.security.alpha.kubernetes.io/*` (застаріла)
  - `container.apparmor.security.beta.kubernetes.io/*` (застаріла)
- Дійсні оновлення `.spec.activeDeadlineSeconds`
- Дійсні оновлення `.spec.tolerations`

## Метрики {#metrics}

Ось метрики Prometheus, які надає kube-apiserver:

- `pod_security_errors_total`: Ця метрика показує кількість помилок, що перешкоджають звичайному оцінюванню. Нефатальні помилки можуть призвести до застосування останнього профілю restricted.
- `pod_security_evaluations_total`: Ця метрика показує кількість виконаних оцінювань політики, не враховуючи проігноровані запити або запити-винятки під час експорту.
- `pod_security_exemptions_total`: Ця метрика показує кількість запитів-винятків, не враховуючи проігноровані запити або запити поза областю дії.

## {{% heading "whatsnext" %}} {#whats-next}

- [Стандарти безпеки Podʼів](/docs/concepts/security/pod-security-standards)
- [Застосування стандартів безпеки Podʼів](/docs/setup/best-practices/enforcing-pod-security-standards)
- [Застосування стандартів безпеки Podʼів за допомогою вбудованого контролера допуску](/docs/tasks/configure-pod-container/enforce-standards-admission-controller)
- [Застосування стандартів безпеки Podʼів за допомогою міток просторів імен](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels)

Якщо ви використовуєте старішу версію Kubernetes і хочете оновитися до версії без PodSecurityPolicies, прочитайте [Міграція з PodSecurityPolicy на вбудований контролер допуску PodSecurity](/docs/tasks/configure-pod-container/migrate-from-psp).
