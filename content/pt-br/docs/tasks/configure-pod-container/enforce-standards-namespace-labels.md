---
title: Aplicando Padrões de Segurança de Pod com `Labels` em Namespace
content_type: task
min-kubernetes-server-version: v1.22
---

Os namespaces podem ser rotulados para aplicar os [Padrões de segurança de pod](/docs/concepts/security/pod-security-standards). As três políticas
[privilegiado](/docs/concepts/security/pod-security-standards/#privileged), 
[linha de base](/docs/concepts/security/pod-security-standards/#baseline)
e [restrito](/docs/concepts/security/pod-security-standards/#restricted) 
cobrem amplamente o espectro de segurança e são implementados pela 
[segurança de Pod](/docs/concepts/security/pod-security-admission/) 
{{< glossary_tooltip text="controlador de admissão" term_id="admission-controller" >}}.

## {{% heading "prerequisites" %}}

{{% version-check %}}

- Garantir que a `PodSecurity` do [portal de funcionalidades](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-alpha-or-beta-features) 
esteja habilitada.

## Exigindo o padrão de segurança `baseline` de pod com rótulos em namespace

Este manifesto define um Namespace `my-baseline-namespace` que:

- _Bloqueia_ quaisquer Pods que não satisfazem os requisitos da política `baseline`.
- Gera um aviso para o usuário e adiciona uma anotação de auditoria, a qualquer 
pod criado que não satisfaça os requisitos da política `restricted`.
- Fixa as versões das políticas `baseline` e `restricted` à v{{< skew currentVersion >}}.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: my-baseline-namespace
  labels:
    pod-security.kubernetes.io/enforce: baseline
    pod-security.kubernetes.io/enforce-version: v{{< skew currentVersion >}}

    # Estamos definindo-os para o nosso nível _desejado_  `enforce`.
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/audit-version: v{{< skew currentVersion >}}
    pod-security.kubernetes.io/warn: restricted
    pod-security.kubernetes.io/warn-version: v{{< skew currentVersion >}}
```

## Adicionar Rótulos aos Namespaces Existentes com `kubectl label`

{{< note >}}
Quando um rótulo de política `enforce` (ou version) é adicionada ou modificada, 
O plugin de admissão testará cada Pod no namespace contra a nova política. 
Violações são devolvidas ao usuário como avisos.
{{< /note >}}

É útil aplicar a flag `--dry-run` ao avaliar inicialmente as alterações 
do perfil de segurança para namespaces. As verificações padrão de segurança 
do pod ainda serão executadas em modo _dry run_, dando-lhe informações sobre 
como a nova política trataria os pods existentes, sem realmente atualizar a política.

```shell
kubectl label --dry-run=server --overwrite ns --all \
    pod-security.kubernetes.io/enforce=baseline
```

### Aplicando a todos os namespaces

Se você está apenas começando com os padrões de segurança de pod, um primeiro passo 
adequado seria configurar todos namespaces com anotações de auditoria para um 
nível mais rigoroso, como `baseline`:

```shell
kubectl label --overwrite ns --all \
  pod-security.kubernetes.io/audit=baseline \
  pod-security.kubernetes.io/warn=baseline
```

Observe que isso não está aplicando as definições de nível, para que os namespaces 
que não foram explicitamente avaliados possam ser distinguidos. Você pode listar 
os namespaces sem um nível aplicado, explicitamente definido, usando este comando:

```shell
kubectl get namespaces --selector='!pod-security.kubernetes.io/enforce'
```

### Aplicando a um único namespace

Você pode atualizar um namespace específico também. Este comando adiciona a política 
`enforce=restricted` ao `my-existing-namespace`, fixando a política que restringe 
à versão v{{< skew currentVersion >}}.

```shell
kubectl label --overwrite ns my-existing-namespace \
  pod-security.kubernetes.io/enforce=restricted \
  pod-security.kubernetes.io/enforce-version=v{{< skew currentVersion >}}
```
