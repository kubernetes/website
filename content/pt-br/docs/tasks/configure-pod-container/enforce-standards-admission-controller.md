---
title: Aplicando os Padrões de Segurança do Pod Através da Configuração do Controlador de Admissão Embutido
content_type: task
---

O Kubernetes fornece um [controlador de admissão](/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
embutido para garantir os [padrões de segurança do Pod](/docs/concepts/security/pod-security-standards).
Você pode configurar esse controlador de admissão para definir padrões e
[isenções](/docs/concepts/security/pod-security-admission/#exemptions) em todo
o cluster.

## {{% heading "prerequisites" %}}

Após uma release alfa no Kubernetes v1.22, o controlador de admissão
_Pod Security Admission_ tornou-se disponível por padrão no Kubernetes v1.23,
no estado beta. Da versão 1.25 em diante o controlador de admissão _Pod Security
Admission_ está publicamente disponível.

{{% version-check %}}

Se você não estiver utilizando o Kubernetes {{< skew currentVersion >}}, você
pode verificar a documentação da versão do Kubernetes que você está utilizando.

## Configure o Controlador de Admissão

{{< note >}}
A configuração `pod-security.admission.config.k8s.io/v1` requer o Kubernetes v1.25
ou superior.
Para as versões v1.23 e v1.24, utilize [v1beta1](https://v1-24.docs.kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-admission-controller/).
Para a versão v1.22, utilize [v1alpha1](https://v1-22.docs.kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-admission-controller/).
{{< /note >}}

```yaml
apiVersion: apiserver.config.k8s.io/v1 # veja a nota de compatibilidade
kind: AdmissionConfiguration
plugins:
- name: PodSecurity
  configuration:
    apiVersion: pod-security.admission.config.k8s.io/v1beta1
    kind: PodSecurityConfiguration
    # Padrões aplicados quando o label de modo não é especificado.
    #
    # O valor para o label Level deve ser uma das opções abaixo:
    # - "privileged" (padrão)
    # - "baseline"
    # - "restricted"
    #
    # O valor para o label Version deve ser uma das opções abaixo:
    # - "latest" (padrão)
    # - versão específica no formato "v{{< skew currentVersion >}}"
    defaults:
      enforce: "privileged"
      enforce-version: "latest"
      audit: "privileged"
      audit-version: "latest"
      warn: "privileged"
      warn-version: "latest"
    exemptions:
      # Lista de usuários autenticados a eximir.
      usernames: []
      # Lista de RuntimeClasses a eximir.
      runtimeClasses: []
      # Lista de namespaces a eximir.
      namespaces: []
```

{{< note >}}
O manifesto acima precisa ser especificado através da opção de linha de comando
`--admission-control-config-file` do kube-apiserver.
{{< /note >}}
