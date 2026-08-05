---
title: Políticas de Seguridad del Pod
content_type: concept
weight: 30
---

<!-- overview -->

{{% alert title="Funcionalidad eliminada" color="warning" %}}
PodSecurityPolicy está en [obsoleto](/blog/2021/04/08/kubernetes-1-21-release-announcement/#podsecuritypolicy-deprecation)
en Kubernetes v1.21, y removida desde Kubernetes v1.25.
{{% /alert %}}

En vez de usar PodSecurityPolicy, puedes aplicar restricciones similares en Pods usando
cualquiera o los dos:

- [Admisión de seguridad de pod](/docs/concepts/security/pod-security-admission/)
- Un plugin de admisión de terceros, que implementa y configura usted mismo

Para obtener una guía de migración, consulte
[Migrar de PodSecurityPolicy al Controlador de Admisión de Seguridad de Pod Integrado](/docs/tasks/configure-pod-container/migrate-from-psp/).
Para obtener más información sobre la eliminación de esta API, consulte
[Obsoleto de PodSecurityPolicy: Pasado, Presente y Futuro](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/).

Si no está ejecutando Kubernetes v{{< skew currentVersion >}}, consulte la documentación para
su versión de Kubernetes.

