---
title: Sidecar Containers
content_type: concept
weight: 50
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.29" state="beta" >}}

Os sidecar containers são contêineres secundários que rodam junto (lado a lado) com o contêiner da aplicação principal dentro do mesmo {{< glossary_tooltip text="Pod" term_id="pod" >}}.
Esses contêineres são usados ​​para aprimorar ou estender a funcionalidade do _contêiner da aplicação_ primária fornecendo serviços adicionais ou funcionalidades como logging, monitoramento, segurança ou sincronização de dados sem alterar diretamente o código da aplicação primário.

Tipicamente, você tem apenas um container de aplicação em um Pod. Por exemplo, se você tiver uma aplicação web que requer um servidor web local, o servidor web local é um sidecar e a própria aplicação web é o app container (contêiner de aplicação).

<!-- body -->

## Sidecar containers no Kubernetes {#pod-sidecar-containers}

O Kubernetes implementa sidecar containers como um caso especial de
[init containers](/docs/concepts/workloads/pods/init-containers/); sidecar containers permanecem em execução após a inicialização do Pod. Este documento usa o termo  _regular init containers_ para se referir claramente aos contêineres que são executados apenas durante a inicialização do Pod.

Desde que seu cluster tenha o recurso `SidecarContainers`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) habilitado
(o recurso está ativo por padrão desde o Kubernetes v1.29), você pode especificar uma `restartPolicy`
para contêiners listados no campo `initContainers` de um Pod.
Esses _sidecar_ contêiners reiniciáveis são independentes de outros init containers 
e dos contêineres principais da aplicação dentro do mesmo pod. Eles podem ser iniciados, interrompidos ou reiniciados sem afetar o contêiner principal da aplicação e outros init containers.

Você também pode executar um Pod com vários contêineres que não estão marcados como init ou sidecar containers. Isso é apropriado se os contêineres dentro do Pod forem necessários para que o Pod funcione no geral, mas você não precisa controlar quais contêineres iniciam ou param primeiro.
Você também pode fazer isso se precisar dar suporte a versões mais antigas do Kubernetes que não suportam um campo `restartPolicy` em nível contêiner.

### Aplicação de exemplo {#sidecar-example} 

Aqui está um exemplo de uma implantação com dois contêineres, um dos quais é um 
sidecar:

{{% code_sample language="yaml" file="application/deployment-sidecar.yaml" %}}

## Sidecar containers e ciclo de vida do Pod 

Se um init container  for criado com seu `restartPolicy` definido como `Always`, ele
iniciará e permanecerá em execução durante toda a vida útil do Pod. Isso pode ser útil para executar serviços de suporte separados dos contêineres principais da aplicação.

Se um `readinessProbe` for especificado para este init container, seu resultado será usado para determinar o estado `ready` do Pod.

Como esses contêineres são definidos como init containers, eles se beneficiam da mesma
ordem e garantias sequenciais que os regular init containers, permitindo que você misture sidecar contêineres com regular init containers para fluxos complexos de inicialização de Pod.

Comparados aos regular init containers, os sidecars definidos em `initContainers` continuam sendo executados após terem sido iniciados. Isso é importante quando há mais
de uma entrada dentro de `.spec.initContainers` para um Pod. Depois que um sidecar-style init container está em execução (o kubelet
definiu o status `started` para esse init container como true), o kubelet então inicia o próximo init container da lista ordenada em `.spec.initContainers`.
Esse status se torna verdadeiro porque há um processo em execução no
contêiner e nenhuma sonda de inicialização definida, ou como resultado do sucesso de seu `startupProbe`.

### Jobs com sidecar containers

Se você definir um Job que usa sidecar usando Kubernetes-style init containers,
o sidecar container em cada Pod não impede que o Job seja concluído após o
contêiner principal ser terminado.

Aqui está um exemplo de um Job com dois contêineres, um dos quais é um sidecar:

{{% code_sample language="yaml" file="application/job/job-sidecar.yaml" %}}

## Diferenças dos contêineres de aplicações

Os sidecar containers são executados junto com os _contêineres de aplicações_ no mesmo pod. Entretanto, eles não executam a lógica primária da aplicação; em vez disso, eles fornecem funcionalidade de suporte para a aplicação principal.

Os sidecar containers têm seus próprios ciclos de vida independentes. Eles podem ser iniciados, interrompidos e reiniciados independentemente dos contêineres da aplicação. Isso significa que você pode atualizar, dimensionar ou manter contêineres secundários sem afetar a aplicação principal.

Os sidecar containers compartilham os mesmos namespaces de rede e armazenamento com o contêiner primário. Esta co-localização permite-lhes interagir diretamente e partilhar recursos.

## Diferença de init containers

Os sidecar containers trabalham lado a lado com o contêiner principal, ampliando sua funcionalidade e fornecendo serviços adicionais.

Os sidecar containers são executados simultaneamente com o app container principal. Eles ficam ativos durante todo o ciclo de vida do Pod e podem ser iniciados e parados independentemente do contêiner principal. Ao contrário dos [init containers](/docs/concepts/workloads/pods/init-containers/),
sidecar containers oferecem suporte a [probes](/docs/concepts/workloads/pods/pod-lifecycle/#types-of-probe) para controlar seu ciclo de vida.

Os sidecar containers podem interagir diretamente com os app containers principais porque, assim como os init containers, eles sempre compartilham a mesma rede e podem opcionalmente, também compartilhar volumes (sistemas de arquivos).

Os init containers param antes da inicialização dos contêineres principais, portanto, os init containers não podem trocar mensagens com o container da aplicação em um Pod. Qualquer passagem de dados é unidirecional (por exemplo, um init container pode colocar informações dentro de um volume `emptyDir`).

## Compartilhamento de recursos dentro de contêineres

{{< comment >}}
This section is also present in the [init containers](/docs/concepts/workloads/pods/init-containers/) page.
If you're editing this section, change both places.
{{< /comment >}}

Dada a ordem de execução dos init containers, sidecar e app containers, as seguintes regras para uso de recursos se aplicam:

* A maior de qualquer requisição  de um recurso em particular ou limite definido em todos os init containers é a *request/limit inicialização efetiva*. Se algum recurso não tiver limite de recursos especificado, este será considerado o limite mais alto.
* O *request/limit efetivo* do Pod para um recurso é a soma de
[pod overhead](/docs/concepts/scheduling-eviction/pod-overhead/) e o mais alto de:
  * a soma de todos os que não são init containers(app containers e sidecar containers) request/limit para um recurso
  * a requisição/limite de inicialização efetivo para um recurso
* O agendamento é feito com base em requisições/limites efetivos, o que significa que os init containers podem reservar recursos para inicialização que não são usados ​​durante a vida útil do Pod.
* O nível de QoS (qualidade de serviço) do nível de QoS efetivo do Pod é o nível de QoS para todos, init, sidecar e app containers.

As cotas e os limites são aplicados com base na requisição e no limite efetivo do Pod.

### Sidecar containers e Linux cgroups {#cgroups}

No Linux, as alocações de recursos para grupos de controle de nível de Pod (cgroups) são baseadas na requisição e no limite efetivo do Pod, o mesmo que o scheduler.



## {{% heading "whatsnext" %}}

* Leia uma postagem do blog em [native sidecar containers](/blog/2023/08/25/native-sidecar-containers/).
* Leia a respeito [creating a Pod that has an init container](/docs/tasks/configure-pod-container/configure-pod-initialization/#create-a-pod-that-has-an-init-container).
* Aprenda sobre o [types of probes](/docs/concepts/workloads/pods/pod-lifecycle/#types-of-probe): liveness, readiness, startup probe.
* Aprendar sobre [pod overhead](/docs/concepts/scheduling-eviction/pod-overhead/).
