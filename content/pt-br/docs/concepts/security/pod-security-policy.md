---
title: Políticas de Segurança do Pod
content_type: concept
weight: 30
---

<!-- visão geral -->

{{% alert title="Funcionalidade removida" color="warning" %}}
PodSecurityPolicy foi [descontinuada](/blog/2021/04/08/kubernetes-1-21-release-announcement/#podsecuritypolicy-deprecation)
no Kubernetes v1.21, e removida do Kubernetes v1.25.
{{% /alert %}}

Em vez de usar PodSecurityPolicy, você pode aplicar restrições semelhantes em Pods usando
um ou ambos:

- [Admissão de segurança do pod](/docs/concepts/security/pod-security-admission/)
- um plug-in de admissão de terceiros, que você mesmo implanta e configura

Para obter um guia de migração, consulte [Migre de PodSecurityPolicy para o controlador de admissão PodSecurity embutido](/docs/tasks/configure-pod-container/migrate-from-psp/).
Para obter mais informações sobre a remoção desta API, veja [Descontinuação de PodSecurityPolicy: passado, presente e futuro](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/).

Se você não estiver executando o Kubernetes v{{< skew currentVersion >}}, verifique a documentação para
sua versão do Kubernetes.