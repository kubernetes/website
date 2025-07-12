---
title: Політики безпеки для Podʼів
content_type: concept
weight: 30
---

<!-- overview -->

{{% alert title="Видалена функція" color="warning" %}}
PodSecurityPolicy було визнано [застарілим](/blog/2021/04/08/kubernetes-1-21-release-announcement/#podsecuritypolicy-deprecation) у Kubernetes v1.21, і видалено з Kubernetes у v1.25.
{{% /alert %}}

Замість використання PodSecurityPolicy, ви можете застосовувати схожі обмеження до Podʼів, використовуючи один чи обидва варіанти:

- [Pod Security Admission](/docs/concepts/security/pod-security-admission/)
- втулок допуску від стороннього розробника, який ви розгортаєте та налаштовуєте самостійно

Для практичного керівництва з міграції дивіться [Міграція з PodSecurityPolicy до вбудованого контролера Pod Security Admission](/docs/tasks/configure-pod-container/migrate-from-psp/). Для отримання додаткової інформації про вилучення цього API,
дивіться [Застарівання PodSecurityPolicy: минуле, сьогодення та майбутнє](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/).

Якщо ви не використовуєте Kubernetes v{{< skew currentVersion >}}, перевірте документацію для вашої версії Kubernetes.
