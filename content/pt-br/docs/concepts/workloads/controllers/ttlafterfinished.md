---
reviewers:
  - janetkuo
title: Automatic Clean-up for Finished Jobs
content_type: concept
weight: 70
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

TTL-after-finished {{<glossary_tooltip text="controller" term_id="controller">}} provides a
TTL (time to live) mechanism to limit the lifetime of resource objects that
have finished execution. TTL controller only handles
{{< glossary_tooltip text="Jobs" term_id="job" >}}.

<!-- body -->

## Controlador TTL-after-finished

O controlador TTL-after-finished é suportado apenas para Trabalhos. Um operador de cluster pode usar esse recurso para limpar
Trabalhos concluídos (`completos` ou com `falhas`) automaticamente, especificando o campo
`.spec.ttlSecondsAfterFinished` de um Trabalho, como neste [exemplo](/docs/concepts/workloads/controllers/job/#clean-up-finished-jobs-automatically).

O controlador TTL-after-finished assumirá que um trabalho está elegível para limpeza
TTL segundos após a finalização do trabalho, ou seja, quando o TTL expirou.

Quando o controlador TTL-after-finished limpa um trabalho, ele o excluirá em cascata, ou seja, ele excluirá
seus objetos dependentes junto com ele. Observe que quando o trabalho é excluído,
suas garantias de ciclo de vida, como finalizadores, serão honradas.

Os segundos TTL podem ser definidos a qualquer momento. Aqui estão alguns exemplos para configurar o
Campo `.spec.ttlSecondsAfterFinished` de um Trabalho:

- Especifique este campo no manifesto do trabalho, para que um trabalho possa ser limpo automaticamente algum tempo depois de terminar.
- Defina este campo de trabalhos existentes, já finalizados, para adotar esta nova funcionalidade.
- Utilize a [mutating admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks) para configurar esse campo dinamicamente no tempo de criação do Trabalho. Os administradores de cluster podem usar isso para impor uma política TTL para trabalhos concluídos.
- Utilize a [mutating admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks) para configurar este campo dinamicamente depois do trabalho ter sido concluído, e escolha diferentes valores TTL baseados em status do trabalho, rótulos, etc.

## Embargo

### Atualizando segundos do TTL

Observe que o período TTL, o campo `.spec.ttlSecondsAfterFinished` de Jobs, pode ser modificado após a criação ou conclusão do Trabalho. No entanto, uma vez que o Trabalho se torna elegível para exclusão (quando o TTL expirou), o sistema não garante que os Jobs serão mantidos, mesmo que uma atualização para estender o TTL retorne uma resposta de API bem-sucedido.

### Time Skew

Como o controlador TTL-after-finished usa identificadores de data/hora armazenados nos trabalhos do Kubernetes para determinar se o TTL expirou ou não, esse recurso é sensível a distorção de tempo no cluster, o que pode fazer com que o controlador TTL-after-finish limpe objetos de Trabalho na hora errada.

Os relógios nem sempre estão corretos, mas a diferença deve ser muito pequena. Esteja ciente desse risco ao definir um TTL diferente de zero.

## {{% heading "whatsnext" %}}

- [Limpeza de Trabalhos automática](/docs/concepts/workloads/controllers/job/#clean-up-finished-jobs-automatically)

- [Documento de Design](https://github.com/kubernetes/enhancements/blob/master/keps/sig-apps/592-ttl-after-finish/README.md)
