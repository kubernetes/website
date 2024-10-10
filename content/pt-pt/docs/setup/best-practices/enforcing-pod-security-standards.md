---
title: Aplicar Normas de Segurança de Pods
weight: 40
---

<!-- overview -->

Esta página fornece uma visão geral das melhores práticas no que diz respeito à aplicação de
[Normas de Segurança de Pods](/docs/concepts/security/pod-security-standards).

<!-- body -->

## Utilizando o Controlador de Admissão de Segurança de Pod integrado

{{< feature-state for_k8s_version="v1.25" state="estável" >}}

O [Controlador de Admissão de Segurança de Pod](/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
pretende substituir as Políticas de Segurança de Pod depreciadas.

### Configurar todos os namespaces do cluster

Namespaces que não têm qualquer configuração devem ser considerados lacunas significativas no seu modelo de segurança do cluster. Recomendamos que dedique tempo a analisar os tipos de cargas de trabalho que ocorrem em cada
namespace e, referenciando as Normas de Segurança de Pod, decida sobre um nível apropriado para
cada um deles. Namespaces não etiquetados devem apenas indicar que ainda não foram avaliados.

No cenário em que todas as cargas de trabalho em todos os namespaces têm os mesmos requisitos de segurança,
fornecemos um [exemplo](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/#applying-to-all-namespaces)
que ilustra como as etiquetas de Segurança de Pod podem ser aplicadas em massa.

### Abraçar o princípio do menor privilégio

Num mundo ideal, cada pod em cada namespace cumpriria os requisitos da política `restricted`. No entanto, isso não é possível nem prático, já que algumas cargas de trabalho exigirão privilégios elevados por razões legítimas.

- Namespaces que permitem cargas de trabalho `privileged` devem estabelecer e fazer cumprir controles de acesso apropriados.
- Para cargas de trabalho que são executadas nesses namespaces permissivos, mantenha documentação sobre os seus requisitos de segurança únicos. Se possível, considere como esses requisitos poderiam ser mais restringidos.

### Adotar uma estratégia multi-modo

Os modos `audit` e `warn` do controlador de admissão de Normas de Segurança de Pod facilitam a
recolha de informações de segurança importantes sobre os seus pods sem interromper as cargas de trabalho existentes.

É uma boa prática ativar estes modos para todos os namespaces, definindo-os para o nível _desejado_
e versão que eventualmente gostaria de `enforce`. Os avisos e anotações de auditoria gerados nesta fase podem guiá-lo para esse estado. Se espera que os autores das cargas de trabalho façam alterações para se enquadrarem no nível desejado, ative o modo `warn`. Se espera usar logs de auditoria para monitorizar/impulsionar
alterações para se enquadrarem no nível desejado, ative o modo `audit`.

Quando tiver o modo `enforce` definido para o valor desejado, estes modos ainda podem ser úteis de
algumas maneiras diferentes:

- Definindo `warn` para o mesmo nível que `enforce`, os clientes receberão avisos ao tentarem
  criar Pods (ou recursos que têm modelos de Pod) que não passam na validação. Isso ajudará
  a atualizar esses recursos para se tornarem conformes.
- Em Namespaces que fixam `enforce` a uma versão específica não mais recente, definir os modos `audit` e `warn`
  para o mesmo nível que `enforce`, mas para a versão `latest`, dá visibilidade a configurações
  que eram permitidas por versões anteriores mas não são permitidas de acordo com as melhores práticas atuais.

## Alternativas de terceiros

{{% thirdparty-content %}}

Outras alternativas para aplicar perfis de segurança estão a ser desenvolvidas no ecossistema Kubernetes:

- [Kubewarden](https://github.com/kubewarden).
- [Kyverno](https://kyverno.io/policies/).
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper).

A decisão de optar por uma solução _integrada_ (por exemplo, controlador de admissão de Segurança de Pod) versus uma
ferramenta de terceiros depende inteiramente da sua situação específica. Ao avaliar qualquer solução,
a confiança na sua cadeia de fornecimento é crucial. Em última análise, usar _qualquer_ das abordagens mencionadas
será melhor do que não fazer nada.
