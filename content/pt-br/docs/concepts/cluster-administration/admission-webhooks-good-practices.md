---
title: Boas Práticas para Webhooks de Admissão
description: >
  Recomendações para projetar e implantar webhooks de admissão no Kubernetes.
content_type: concept
weight: 60
---

<!-- overview -->

Esta página fornece boas práticas e considerações ao projetar
_webhooks de admissão_ no Kubernetes. Estas informações são destinadas a
operadores de cluster que executam servidores de webhooks de admissão ou aplicações de terceiros
que modificam ou validam suas requisições de API.

Antes de ler esta página, certifique-se de estar familiarizado com os seguintes
conceitos:

* [Controladores de admissão](/docs/reference/access-authn-authz/admission-controllers/)
* [Webhooks de admissão](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)

<!-- body -->

## Importância de um bom design de webhook {#why-good-webhook-design-matters}

O controle de admissão ocorre quando qualquer requisição de criação, atualização ou exclusão
é enviada para a API do Kubernetes. Os controladores de admissão interceptam requisições que
correspondem a critérios específicos que você define. Essas requisições são então enviadas para
webhooks de admissão de mutação ou webhooks de admissão de validação. Esses webhooks são
frequentemente escritos para garantir que campos específicos nas especificações de objetos existam ou
tenham valores permitidos específicos.

Webhooks são um mecanismo poderoso para estender a API do Kubernetes. Webhooks mal projetados
frequentemente resultam em interrupções de cargas de trabalho devido ao quanto de controle
os webhooks têm sobre os objetos no cluster. Assim como outros mecanismos de extensão
da API, webhooks são desafiadores de testar em escala quanto à compatibilidade com
todas as suas cargas de trabalho, outros webhooks, complementos e plugins.

Adicionalmente, a cada lançamento, o Kubernetes adiciona ou modifica a API com novas
funcionalidades, promoções de funcionalidades para o status beta ou estável, e descontinuidades. Mesmo
APIs estáveis do Kubernetes são propensas a mudanças. Por exemplo, a API `Pod` mudou
na v1.29 para adicionar a funcionalidade de
[Contêineres sidecar](/docs/concepts/workloads/pods/sidecar-containers/).
Embora seja raro um objeto Kubernetes entrar em um estado inconsistente por causa de uma nova
API do Kubernetes, webhooks que funcionavam conforme esperado com versões anteriores de uma API
podem não conseguir reconciliar mudanças mais recentes nessa API. Isso pode resultar
em comportamento inesperado após você atualizar seus clusters para versões mais recentes.

Esta página descreve cenários comuns de falha de webhooks e como evitá-los projetando e implementando
seus webhooks de forma cautelosa e ponderada.

## Identifique se você usa webhooks de admissão {#identify-admission-webhooks}

Mesmo que você não execute seus próprios webhooks de admissão, algumas aplicações de terceiros
que você executa em seus clusters podem usar webhooks de admissão de mutação ou de validação.

Para verificar se o seu cluster possui algum webhook de admissão de mutação, execute o
seguinte comando:

```shell
kubectl get mutatingwebhookconfigurations
```
A saída lista quaisquer controladores de admissão de mutação no cluster.

Para verificar se o seu cluster possui algum webhook de admissão de validação, execute o
seguinte comando:

```shell
kubectl get validatingwebhookconfigurations
```
A saída lista quaisquer controladores de admissão de validação no cluster.

## Escolha um mecanismo de controle de admissão {#choose-admission-mechanism}

O Kubernetes inclui múltiplas opções de controle de admissão e aplicação de políticas.
Saber quando usar uma opção específica pode ajudá-lo a melhorar a latência e
o desempenho, reduzir a sobrecarga de gerenciamento e evitar problemas durante atualizações
de versão. A tabela a seguir descreve os mecanismos que permitem modificar ou
validar recursos durante a admissão:

<!-- Esta tabela é HTML porque usa listas não ordenadas para facilitar a leitura. -->
<table>
  <caption>Controle de admissão de mutação e validação no Kubernetes</caption>
  <thead>
    <tr>
      <th>Mecanismo</th>
      <th>Descrição</th>
      <th>Casos de uso</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="/docs/reference/access-authn-authz/extensible-admission-controllers/">Webhook de admissão de mutação</a></td>
      <td>Intercepta requisições de API antes da admissão e as modifica conforme necessário usando
        lógica personalizada.</td>
      <td><ul>
        <li>Realizar modificações críticas que devem ocorrer antes da admissão
          do recurso.</li>
        <li>Realizar modificações complexas que requerem lógica avançada, como chamar
          APIs externas.</li>
      </ul></td>
    </tr>
    <tr>
      <td><a href="/docs/reference/access-authn-authz/mutating-admission-policy/">Política de admissão de mutação</a></td>
      <td>Intercepta requisições de API antes da admissão e as modifica conforme necessário usando
        expressões da Common Expression Language (CEL).</td>
      <td><ul>
        <li>Realizar modificações críticas que devem ocorrer antes da admissão
          do recurso.</li>
        <li>Realizar modificações simples, como ajustar rótulos ou contagens
        de réplicas.</li>
      </ul></td>
    </tr>
    <tr>
      <td><a href="/docs/reference/access-authn-authz/extensible-admission-controllers/">Webhook de admissão de validação</a></td>
      <td>Intercepta requisições de API antes da admissão e as valida contra declarações
        complexas de política.</td>
      <td><ul>
        <li>Validar configurações críticas antes da admissão do recurso.</li>
        <li>Aplicar lógica de política complexa antes da admissão.</li>
      </ul></td>
    </tr>
    <tr>
      <td><a href="/docs/reference/access-authn-authz/validating-admission-policy/">Política de admissão de validação</a></td>
      <td>Intercepta requisições de API antes da admissão e as valida contra expressões
        CEL.</td>
      <td><ul>
        <li>Validar configurações críticas antes da admissão do recurso.</li>
        <li>Aplicar lógica de política usando expressões CEL.</li>
      </ul></td>
    </tr>
  </tbody>
</table>

Em geral, use o controle de admissão por _webhook_ quando você quiser uma forma extensível de
declarar ou configurar a lógica. Use o controle de admissão embutido baseado em CEL quando
você quiser declarar uma lógica mais simples sem a sobrecarga de executar um servidor
de webhook. O projeto Kubernetes recomenda que você use o controle de admissão baseado em
CEL sempre que possível.

### Use validação e valores padrão embutidos para CustomResourceDefinitions {#no-crd-validation-defaulting}

Se você usa
{{< glossary_tooltip text="CustomResourceDefinitions" term_id="customresourcedefinition" >}},
não use webhooks de admissão para validar valores em especificações de CustomResource
ou para definir valores padrão para campos. O Kubernetes permite que você defina regras de validação
e valores padrão para campos ao criar CustomResourceDefinitions.

Para saber mais, consulte os seguintes recursos:

* [Regras de validação](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules)
* [Definição de valores padrão](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#defaulting)

## Desempenho e latência {#performance-latency}

Esta seção descreve recomendações para melhorar o desempenho e reduzir
a latência. Em resumo, são as seguintes:

* Consolide webhooks e limite o número de chamadas para a API por webhook.
* Use logs de auditoria para verificar webhooks que repetidamente fazem a mesma ação.
* Use balanceamento de carga para a disponibilidade dos webhooks.
* Defina um valor de tempo limite pequeno para cada webhook.
* Considere as necessidades de disponibilidade do cluster ao projetar o webhook.

### Projete webhooks de admissão para baixa latência {#design-admission-webhooks-low-latency}

Webhooks de admissão de mutação são chamados em sequência. Dependendo da configuração
do webhook de mutação, alguns webhooks podem ser chamados várias vezes. Cada chamada de webhook
de mutação adiciona latência ao processo de admissão. Isso é diferente dos webhooks
de validação, que são chamados em paralelo.

Ao projetar seus webhooks de mutação, considere seus requisitos de latência e
tolerância. Quanto mais webhooks de mutação houver em seu cluster, maior será a
chance de aumento de latência.

Considere o seguinte para reduzir a latência:

* Consolide webhooks que realizam uma mutação semelhante em objetos diferentes.
* Reduza o número de chamadas para a API feitas na lógica do servidor do webhook de mutação.
* Limite as condições de correspondência de cada webhook de mutação para reduzir quantos
  webhooks são acionados por uma requisição de API específica.
* Consolide pequenos webhooks em um único servidor e configuração para ajudar com
  a ordenação e a organização.

### Evite loops causados por controladores concorrentes {#prevent-loops-competing-controllers}

Considere quaisquer outros componentes que executam em seu cluster que possam entrar em conflito com
as mutações que seu webhook faz. Por exemplo, se seu webhook adiciona um rótulo
que um controlador diferente remove, seu webhook será chamado novamente. Isso leva
a um loop.

Para detectar esses loops, tente o seguinte:

1.  Atualize a política de auditoria do seu cluster para registrar eventos de auditoria. Use os seguintes
    parâmetros:
    
      * `level`: `RequestResponse`
      * `verbs`: `["patch"]`
      * `omitStages`: `RequestReceived`

    Configure a regra de auditoria para criar eventos para os recursos específicos que seu
    webhook modifica.

1.  Verifique seus eventos de auditoria em busca de webhooks sendo acionados várias vezes com o
    mesmo patch sendo aplicado ao mesmo objeto, ou de um objeto que tenha
    um campo atualizado e revertido várias vezes.

### Defina um valor de tempo limite pequeno {#small-timeout}

Webhooks de admissão devem ser avaliados o mais rápido possível (geralmente em
milissegundos), já que adicionam latência às requisições da API. Use um tempo limite pequeno para
webhooks.

Para detalhes, consulte
[Tempos limite](/docs/reference/access-authn-authz/extensible-admission-controllers/#timeouts).

### Use um balanceador de carga para garantir a disponibilidade dos webhooks {#load-balancer-webhook}

Webhooks de admissão devem utilizar alguma forma de balanceamento de carga para fornecer benefícios
de alta disponibilidade e desempenho. Se um webhook estiver sendo executado dentro do
cluster, você pode executar múltiplos backends de webhook atrás de um Service do tipo
`ClusterIP`.

### Use um modelo de implantação de alta disponibilidade {#ha-deployment}

Considere os requisitos de disponibilidade do seu cluster ao projetar seu webhook.
Por exemplo, durante o tempo de inatividade de nós ou interrupções zonais, o Kubernetes marca os Pods como
`NotReady` para permitir que balanceadores de carga redirecionem o tráfego para zonas e
nós disponíveis. Essas atualizações nos Pods podem acionar seus webhooks de mutação. Dependendo
do número de Pods afetados, o servidor do webhook de mutação corre o risco de exceder o
tempo limite ou causar atrasos no processamento dos Pods. Como resultado, o tráfego não será
redirecionado tão rapidamente quanto você precisa.

Considere situações como o exemplo anterior ao escrever seus webhooks.
Exclua operações que sejam resultado de respostas do Kubernetes a incidentes inevitáveis.

## Filtragem de requisições {#request-filtering}

Esta seção fornece recomendações para filtrar quais requisições acionam
webhooks específicos. Em resumo, são as seguintes:

* Limite o escopo do webhook para evitar componentes do sistema e requisições somente leitura.
* Limite os webhooks a namespaces específicos.
* Use condições de correspondência para realizar uma filtragem granular de requisições.
* Faça a correspondência com todas as versões de um objeto.

### Limite o escopo de cada webhook {#webhook-limit-scope}

Webhooks de admissão são chamados somente quando uma requisição de API corresponde à
configuração do webhook correspondente. Limite o escopo de cada webhook para reduzir chamadas
desnecessárias ao servidor de webhook. Considere as seguintes limitações de escopo:

* Evite fazer correspondência com objetos no namespace `kube-system`. Se você executa seus próprios
  Pods no namespace `kube-system`, use um
  [`objectSelector`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-objectselector)
  para evitar modificar uma carga de trabalho crítica.
* Não modifique leases de nós, que existem como objetos Lease no namespace de sistema
  `kube-node-lease`. Modificar leases de nós pode resultar em
  atualizações de nós com falha. Aplique controles de validação a objetos Lease neste
  namespace somente se você tiver certeza de que os controles não colocarão seu cluster em
  risco.
* Não modifique objetos TokenReview ou SubjectAccessReview. Estas são sempre
  requisições somente leitura. Modificar esses objetos pode quebrar seu cluster.
* Limite cada webhook a um namespace específico usando um
  [`namespaceSelector`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-namespaceselector).

### Filtre requisições específicas usando condições de correspondência {#filter-match-conditions}

Os controladores de admissão suportam múltiplos campos que você pode usar para fazer correspondência com requisições
que atendem a critérios específicos. Por exemplo, você pode usar um `namespaceSelector` para
filtrar requisições direcionadas a um namespace específico.

Para uma filtragem mais granular de requisições, use o campo `matchConditions` na configuração
do seu webhook. Esse campo permite que você escreva múltiplas expressões CEL que
devem ser avaliadas como `true` para que uma requisição acione seu webhook de admissão. Usar
`matchConditions` pode reduzir significativamente o número de chamadas ao servidor
do seu webhook.

Para detalhes, consulte
[Correspondência de requisições: `matchConditions`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchconditions).

### Faça a correspondência com todas as versões de uma API {#match-all-versions}

Por padrão, webhooks de admissão são executados em quaisquer versões da API que afetem um recurso
especificado. O campo `matchPolicy` na configuração do webhook controla esse
comportamento. Especifique um valor de `Equivalent` no campo `matchPolicy` ou omita
o campo para permitir que o webhook seja executado em qualquer versão da API.

Para detalhes, consulte
[Correspondência de requisições: `matchPolicy`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchpolicy).

## Escopo da mutação e considerações sobre campos {#mutation-scope-considerations}

Esta seção fornece recomendações para o escopo das mutações e quaisquer considerações
especiais sobre campos de objetos. Em resumo, são as seguintes:

* Aplique patch somente nos campos que você precisa.
* Não sobrescreva valores de array.
* Evite efeitos colaterais em mutações sempre que possível.
* Evite que os webhooks afetem a si mesmos.
* Falhe de forma aberta e valide o estado final.
* Planeje futuras atualizações de campos em versões posteriores.
* Evite que webhooks acionem a si mesmos.
* Não altere objetos imutáveis.

### Aplique patch somente nos campos necessários {#patch-required-fields}

Servidores de webhook de admissão enviam respostas HTTP para indicar o que fazer com uma
requisição específica da API do Kubernetes. Essa resposta é um objeto AdmissionReview.
Um webhook de mutação pode adicionar campos específicos para modificar antes de permitir a admissão
usando o campo `patchType` e o campo `patch` na resposta. Certifique-se
de modificar somente os campos que requerem uma mudança.

Por exemplo, considere um webhook de mutação que está configurado para garantir que
Deployments `web-server` tenham pelo menos três réplicas. Quando uma requisição para
criar um objeto Deployment corresponde à configuração do seu webhook, o webhook
deve atualizar somente o valor no campo `spec.replicas`.

### Não sobrescreva valores de array {#dont-overwrite-arrays}

Campos em especificações de objetos Kubernetes podem incluir arrays. Alguns arrays
contêm pares chave:valor (como o campo `envVar` na especificação de um contêiner),
enquanto outros arrays não possuem chaves (como o campo `readinessGates` na especificação
de um Pod). A ordem dos valores em um campo de array pode importar em algumas
situações. Por exemplo, a ordem dos argumentos no campo `args` da
especificação de um contêiner pode afetar o contêiner.

Considere o seguinte ao modificar arrays:

* Sempre que possível, use a operação JSONPatch `add` em vez de `replace` para
  evitar a substituição acidental de um valor obrigatório.
* Trate arrays que não usam pares chave:valor como conjuntos.
* Certifique-se de que os valores no campo que você modifica não precisam estar
  em uma ordem específica.
* Não sobrescreva pares chave:valor existentes a menos que seja absolutamente necessário.
* Tenha cuidado ao modificar campos de rótulos. Uma modificação acidental pode
  fazer com que seletores de rótulos sejam quebrados, resultando em comportamento não intencional.

### Evite efeitos colaterais {#avoid-side-effects}

Certifique-se de que seus webhooks operem apenas no conteúdo do AdmissionReview
que é enviado a eles e não façam mudanças por fluxo de dados independente. Essas mudanças
adicionais, chamadas de _efeitos colaterais_, podem causar conflitos durante a admissão se não
forem reconciliadas adequadamente. O campo `.webhooks[].sideEffects` deve
ser definido como `None` se um webhook não tiver nenhum efeito colateral.

Se efeitos colaterais forem necessários durante a avaliação de admissão, eles devem ser
suprimidos ao processar um objeto AdmissionReview com `dryRun` definido como
`true`, e o campo `.webhooks[].sideEffects` deve ser definido como `NoneOnDryRun`.

Para detalhes, consulte
[Efeitos colaterais](/docs/reference/access-authn-authz/extensible-admission-controllers/#side-effects).

### Evite que o webhook afete a si mesmo {#avoid-self-mutation}

Um webhook em execução dentro do cluster pode causar deadlocks para sua própria
implantação se ele estiver configurado para interceptar recursos necessários para iniciar seus próprios
Pods.

Por exemplo, um webhook de admissão de mutação está configurado para admitir requisições de
**criação** de Pod somente se um determinado rótulo estiver definido no Pod (como `env: prod`).
O servidor do webhook é executado em um Deployment que não define o rótulo `env`.

Quando um nó que executa os Pods do servidor do webhook se torna não íntegro, o Deployment
do webhook tenta realocar os Pods para outro nó. No entanto, o servidor existente
do webhook rejeita as requisições uma vez que o rótulo `env` não está definido. Como
resultado, a migração não pode acontecer.

Exclua o namespace onde seu webhook está sendo executado com um
[`namespaceSelector`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-namespaceselector).

### Evite loops de dependência {#avoid-dependency-loops}

Loops de dependência podem ocorrer em cenários como os seguintes:

* Dois webhooks verificam os Pods um do outro. Se ambos os webhooks se tornarem indisponíveis
  ao mesmo tempo, nenhum dos webhooks poderá iniciar.
* Seu webhook intercepta componentes de complementos do cluster, como plugins de rede
  ou plugins de armazenamento, dos quais seu webhook depende. Se tanto o webhook quanto o
  complemento dependente se tornarem indisponíveis, nenhum dos componentes poderá funcionar.

Para evitar esses loops de dependência, tente o seguinte:

* Use
  [ValidatingAdmissionPolicies](/docs/reference/access-authn-authz/validating-admission-policy/)
  para evitar introduzir dependências.
* Evite que webhooks validem ou modifiquem outros webhooks. Considere
  [excluir namespaces específicos](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-namespaceselector)
  para que não acionem seu webhook.
* Evite que seus webhooks atuem em complementos dependentes usando um
  [`objectSelector`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-objectselector).

### Falhe de forma aberta e valide o estado final {#fail-open-validate-final-state}

Webhooks de admissão de mutação suportam o campo de configuração `failurePolicy`.
Esse campo indica se o servidor de API deve admitir ou rejeitar a requisição
caso o webhook falhe. Falhas de webhook podem ocorrer devido a tempos limite ou erros
na lógica do servidor.

Por padrão, webhooks de admissão definem o campo `failurePolicy` como Fail. O servidor
de API rejeita uma requisição se o webhook falhar. No entanto, rejeitar requisições por
padrão pode resultar em requisições em conformidade sendo rejeitadas durante o tempo de
inatividade do webhook.

Deixe seus webhooks de mutação "falharem de forma aberta" definindo o campo `failurePolicy` como
Ignore. Use um controlador de validação para verificar o estado das requisições para garantir
que elas estejam em conformidade com suas políticas.

Essa abordagem tem os seguintes benefícios:

* O tempo de inatividade do webhook de mutação não afeta a implantação de recursos em conformidade.
* A aplicação de políticas ocorre durante o controle de admissão de validação.
* Webhooks de mutação não interferem em outros controladores no cluster.

### Planeje atualizações futuras nos campos {#plan-future-field-updates}

Em geral, projete seus webhooks partindo do pressuposto de que as APIs do Kubernetes podem
mudar em uma versão posterior. Não escreva um servidor que considere a estabilidade de uma
API como garantida. Por exemplo, o lançamento de contêineres sidecar no Kubernetes
adicionou um campo `restartPolicy` à API do Pod.

### Evite que seu webhook acione a si mesmo {#prevent-webhook-self-trigger}

Webhooks de mutação que respondem a uma ampla gama de requisições de API podem
acionar a si mesmos de forma não intencional. Por exemplo, considere um webhook que
responde a todas as requisições no cluster. Se você configurar o webhook para criar
objetos Event para cada mutação, ele responderá às requisições de criação de seus próprios
objetos Event.

Para evitar isso, considere definir um rótulo único em quaisquer recursos que seu
webhook criar. Exclua esse rótulo das condições de correspondência do seu webhook.

### Não altere objetos imutáveis {#dont-change-immutable-objects}

Alguns objetos Kubernetes no servidor de API não podem ser alterados. Por exemplo, quando você
implanta um {{< glossary_tooltip text="Pod estático" term_id="static-pod" >}}, o
kubelet no nó cria um
{{< glossary_tooltip text="Pod espelho" term_id="mirror-pod" >}} no servidor de
API para rastrear o Pod estático. No entanto, mudanças no Pod espelho não
são propagadas para o Pod estático.

Não tente modificar esses objetos durante a admissão. Todos os Pods espelho têm a
anotação `kubernetes.io/config.mirror`. Para excluir Pods espelho enquanto reduz
o risco de segurança de ignorar uma anotação, permita que Pods estáticos sejam executados somente em
namespaces específicos.

## Ordenação e idempotência de webhooks de mutação {#ordering-idempotence}

Esta seção fornece recomendações para a ordem dos webhooks e o design de webhooks
idempotentes. Em resumo, são as seguintes:

* Não dependa de uma ordem específica de execução.
* Valide mutações antes da admissão.
* Verifique se mutações estão sendo sobrescritas por outros controladores.
* Garanta que o conjunto de webhooks de mutação seja idempotente, não apenas os
  webhooks individuais.

### Não dependa da ordem de acionamento de webhooks de mutação {#dont-rely-webhook-order}

Webhooks de admissão de mutação não são executados em uma ordem consistente. Vários fatores
podem mudar o momento em que um webhook específico é chamado. Não dependa do seu webhook
sendo executado em um ponto específico do processo de admissão. Outros webhooks ainda podem
mutar seu objeto modificado.

As recomendações a seguir podem ajudar a minimizar o risco de mudanças não intencionais:

* [Valide mutações antes da admissão](#validate-mutations)
* Use uma política de nova invocação para observar mudanças em um objeto feitas por outros plugins
  e executar novamente o webhook conforme necessário. Para detalhes, consulte
  [Política de nova invocação](/docs/reference/access-authn-authz/extensible-admission-controllers/#reinvocation-policy).

### Garanta que os webhooks de mutação em seu cluster sejam idempotentes {#ensure-mutating-webhook-idempotent}

Todo webhook de admissão de mutação deve ser _idempotente_. O webhook deve ser
capaz de ser executado em um objeto que já modificou sem fazer mudanças
adicionais além da mudança original.

Adicionalmente, todos os webhooks de mutação em seu cluster devem, como
um conjunto, ser idempotentes. Após o término da fase de mutação do controle de admissão,
cada webhook de mutação individual deve ser capaz de ser executado em um objeto sem
fazer mudanças adicionais ao objeto.

Dependendo do seu ambiente, garantir a idempotência em escala pode ser
desafiador. As seguintes recomendações podem ajudar:

* Use controladores de admissão de validação para verificar o estado final de
  cargas de trabalho críticas.
* Teste suas implantações em um cluster de homologação para ver se algum objeto é modificado
  várias vezes pelo mesmo webhook.
* Certifique-se de que o escopo de cada webhook de mutação seja específico e limitado.

Os exemplos a seguir mostram lógica de mutação idempotente:

1. Para uma requisição de **criação** de Pod, defina o campo
  `.spec.securityContext.runAsNonRoot` do Pod como true.

1. Para uma requisição de **criação** de Pod, se o campo
   `.spec.containers[].resources.limits` de um contêiner não estiver definido, defina
   limites de recursos padrão.

1. Para uma requisição de **criação** de Pod, injete um contêiner sidecar com o nome
   `foo-sidecar` caso ainda não exista um contêiner com o nome `foo-sidecar`.

Nesses casos, o webhook pode ser invocado novamente com segurança, ou admitir um objeto que
já tenha os campos definidos.

Os exemplos a seguir mostram lógica de mutação não idempotente:

1. Para uma requisição de **criação** de Pod, injete um contêiner sidecar com o nome
   `foo-sidecar` sufixado com o timestamp atual (como
   `foo-sidecar-19700101-000000`).

   Invocar o webhook novamente pode resultar no mesmo sidecar sendo injetado várias
   vezes em um Pod, cada vez com um nome de contêiner diferente. Da mesma forma, o
   webhook pode injetar contêineres duplicados se o sidecar já existir em
   um pod fornecido pelo usuário.

1. Para uma requisição de **criação**/**atualização** de Pod, rejeite se o Pod tiver o rótulo `env`
   definido; caso contrário, adicione um rótulo `env: prod` ao Pod.

   Invocar o webhook novamente resultará na falha do webhook em sua própria saída.

1. Para uma requisição de **criação** de Pod, adicione um contêiner sidecar chamado `foo-sidecar`
   sem verificar se um contêiner `foo-sidecar` existe.

   Invocar o webhook novamente resultará em contêineres duplicados no Pod, o que
   torna a requisição inválida e rejeitada pelo servidor de API.

## Teste e validação de mutação {#mutation-testing-validation}

Esta seção fornece recomendações para testar seus webhooks de mutação e
validar objetos mutados. Em resumo, são as seguintes:

* Teste webhooks em ambientes de homologação.
* Evite mutações que violem validações.
* Teste atualizações de versão menor em busca de regressões e conflitos.
* Valide objetos mutados antes da admissão.

### Teste webhooks em ambientes de homologação {#test-in-staging-environments}

Testes robustos devem ser uma parte essencial do seu ciclo de lançamento para webhooks novos
ou atualizados. Se possível, teste quaisquer mudanças em seus webhooks de cluster em um ambiente
de homologação que se assemelhe bastante aos seus clusters de produção. No mínimo,
considere usar uma ferramenta como o [minikube](https://minikube.sigs.k8s.io/docs/) ou o
[kind](https://kind.sigs.k8s.io/) para criar um pequeno cluster de teste para mudanças em
webhooks.

### Garanta que mutações não violem validações {#ensure-mutations-dont-violate-validations}

Seus webhooks de mutação não devem quebrar nenhuma das validações que se aplicam a um
objeto antes da admissão. Por exemplo, considere um webhook de mutação que define a
requisição de CPU padrão de um Pod como um valor específico. Se o limite de CPU desse Pod
estiver definido com um valor menor que a requisição mutada, o Pod falhará na admissão.

Teste cada webhook de mutação contra as validações que são executadas em seu cluster.

### Teste atualizações de versão menor para garantir comportamento consistente {#test-minor-version-upgrades}

Antes de atualizar seus clusters de produção para uma nova versão menor, teste seus
webhooks e cargas de trabalho em um ambiente de homologação. Compare os resultados para garantir
que seus webhooks continuem a funcionar conforme esperado após a atualização.

Adicionalmente, use os seguintes recursos para se manter informado sobre mudanças de API:

* [Notas de lançamento do Kubernetes](/releases/)
* [Blog do Kubernetes](/blog/)

### Valide mutações antes da admissão {#validate-mutations}

Webhooks de mutação são executados até a conclusão antes que quaisquer webhooks de validação sejam executados. Não há
uma ordem estável na qual as mutações são aplicadas aos objetos. Como resultado, suas
mutações podem ser sobrescritas por um webhook de mutação que seja executado em um momento posterior.

Adicione um controlador de admissão de validação como um ValidatingAdmissionWebhook ou uma
ValidatingAdmissionPolicy ao seu cluster para garantir que suas mutações
ainda estejam presentes. Por exemplo, considere um webhook de mutação que insere o
campo `restartPolicy: Always` em contêineres de inicialização específicos para fazê-los executar como
contêineres sidecar. Você poderia executar um webhook de validação para garantir que esses
contêineres de inicialização mantiveram a configuração `restartPolicy: Always` após todas
as mutações serem concluídas.

Para detalhes, consulte os seguintes recursos:

* [Política de admissão de validação](/docs/reference/access-authn-authz/validating-admission-policy/)
* [ValidatingAdmissionWebhooks](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook)

## Implantação de webhooks de mutação {#mutating-webhook-deployment}

Esta seção fornece recomendações para implantar seus webhooks de admissão
de mutação. Em resumo, são as seguintes:

* Implante a configuração do webhook gradualmente e monitore problemas por
  namespace.
* Limite o acesso para editar os recursos de configuração do webhook.
* Limite o acesso ao namespace que executa o servidor do webhook, caso o servidor
  esteja no cluster.

### Instale e habilite um webhook de mutação {#install-enable-mutating-webhook}

Quando estiver pronto para implantar seu webhook de mutação em um cluster, use a
seguinte ordem de operações:

1.  Instale o servidor do webhook e inicie-o.
1.  Defina o campo `failurePolicy` no manifesto da MutatingWebhookConfiguration
    como Ignore. Isso permite que você evite interrupções causadas por webhooks mal configurados.
1.  Defina o campo `namespaceSelector` no manifesto da MutatingWebhookConfiguration
    para um namespace de teste.
1.  Implante a MutatingWebhookConfiguration no seu cluster.

Monitore o webhook no namespace de teste para verificar a existência de problemas e, em seguida, implante o
webhook em outros namespaces. Se o webhook interceptar uma requisição de API que
não deveria interceptar, pause a implantação e ajuste o escopo da
configuração do webhook.

### Limite o acesso de edição a webhooks de mutação {#limit-edit-access}

Webhooks de mutação são controladores poderosos do Kubernetes. Use RBAC ou outro
mecanismo de autorização para limitar o acesso às suas configurações e servidores
de webhook. Para o RBAC, certifique-se de que o acesso a seguir esteja disponível somente para entidades
confiáveis:

* Verbos: **create**, **update**, **patch**, **delete**, **deletecollection**
* Grupo de API: `admissionregistration.k8s.io/v1`
* Tipo de API: MutatingWebhookConfigurations

Se o servidor do seu webhook de mutação for executado no cluster, limite o acesso para criar ou
modificar quaisquer recursos nesse namespace.

## Exemplos de boas implementações {#example-good-implementations}

{{% thirdparty-content %}}

Os projetos a seguir são exemplos de "boas" implementações de servidores de webhook
personalizados. Você pode usá-los como ponto de partida ao projetar seus próprios
webhooks. Não use esses exemplos como estão; use-os como ponto de partida e
projete seus webhooks para funcionarem bem em seu ambiente específico.

* [`cert-manager`](https://github.com/cert-manager/cert-manager/tree/master/internal/webhook)
* [Gatekeeper Open Policy Agent (OPA)](https://open-policy-agent.github.io/gatekeeper/website/docs/mutation)

## {{% heading "whatsnext" %}}

* [Use webhooks para autenticação e autorização](/docs/reference/access-authn-authz/webhook/)
* [Saiba mais sobre MutatingAdmissionPolicies](/docs/reference/access-authn-authz/mutating-admission-policy/)
* [Saiba mais sobre ValidatingAdmissionPolicies](/docs/reference/access-authn-authz/validating-admission-policy/)
