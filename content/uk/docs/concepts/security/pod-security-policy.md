---
title: Політики безпеки Podʼів
content_type: concept
weight: 30
---

<!-- overview -->

{{% alert title="Вилучена можливість" color="warning" %}}
PodSecurityPolicy було визнано [застарілим](/blog/2021/04/08/kubernetes-1-21-release-announcement/#podsecuritypolicy-deprecation) у Kubernetes v1.21 і вилучено з Kubernetes у v1.25.
{{% /alert %}}

Замість PodSecurityPolicy ви можете застосовувати схожі обмеження до Podʼів за допомогою одного або обох варіантів:

- [Pod Security Admission](/docs/concepts/security/pod-security-admission/)
- сторонній втулок допуску, який ви розгортаєте та налаштовуєте самостійно

Посібник із міграції дивіться в розділі [Міграція з PodSecurityPolicy на вбудований контролер допуску PodSecurity](/docs/tasks/configure-pod-container/migrate-from-psp/). Докладніше про вилучення цього API дивіться в дописі [PodSecurityPolicy Deprecation: Past, Present, and Future](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/).

Якщо ви не використовуєте Kubernetes v{{< skew currentVersion >}}, перевірте документацію для вашої версії Kubernetes.
