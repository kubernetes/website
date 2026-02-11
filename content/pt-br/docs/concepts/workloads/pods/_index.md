---
title: Pods
api_metadata:
- apiVersion: "v1"
  kind: "Pod"
content_type: concept
weight: 10
no_list: true
---

<!-- overview -->

_Pods_ são as menores unidades computacionais implantáveis que você pode criar e gerenciar no Kubernetes.

<!-- Analogia sobre Pods removida (baixa aderência em PT-BR): https://github.com/kubernetes/website/pull/53545 -->

Um _Pod_ é um grupo de um ou mais {{< glossary_tooltip text="contêineres" term_id="container" >}},
com recursos de armazenamento e rede compartilhados e uma especificação de como executar os contêineres. O conteúdo de um Pod é sempre colocalizado e
coalocado, e executado em um contexto compartilhado. Um Pod modela um
"host lógico" específico da aplicação: ele contém um ou mais contêineres de aplicação
que são relativamente fortemente acoplados.
Em contextos fora da nuvem, aplicações executadas na mesma máquina física ou virtual são análogas a aplicações em nuvem executadas no mesmo host lógico.

Além dos contêineres de aplicação, um Pod pode conter
{{< glossary_tooltip text="contêineres de inicialização" term_id="init-container" >}} que são executados
durante a inicialização do Pod. Você também pode injetar
{{< glossary_tooltip text="contêineres efêmeros" term_id="ephemeral-container" >}}
para depurar um Pod em execução.

<!-- body -->

## O que é um Pod?

{{< note >}}
Você precisa instalar um [agente de execução de contêiner](/docs/setup/production-environment/container-runtimes/)
em cada nó do cluster para que os Pods possam ser executados lá.
{{< /note >}}

O contexto compartilhado de um Pod é um conjunto de namespaces do Linux, cgroups e
potencialmente outras facetas de isolamento - as mesmas coisas que isolam um {{< glossary_tooltip text="contêiner" term_id="container" >}}. Dentro do contexto de um Pod, as aplicações individuais podem ter
sub-isolamentos adicionais aplicados.

Um Pod é semelhante a um conjunto de contêineres com namespaces compartilhados e volumes de sistema de arquivos compartilhados.

Pods em um cluster Kubernetes são usados de duas maneiras principais:

* **Pods que executam um único contêiner**. O modelo "um-contêiner-por-Pod" é o
  caso de uso mais comum do Kubernetes; neste caso, você pode pensar em um Pod como um
  invólucro em torno de um único contêiner; o Kubernetes gerencia Pods ao invés de gerenciar
  os contêineres diretamente.
* **Pods que executam múltiplos contêineres que precisam trabalhar juntos**. Um Pod pode
  encapsular uma aplicação composta por
  [múltiplos contêineres colocalizados](#how-pods-manage-multiple-containers) que são
  fortemente acoplados e precisam compartilhar recursos. Esses contêineres colocalizados
  formam uma única unidade coesa.

  Agrupar múltiplos contêineres colocalizados e cogerenciados em um único Pod é um
  caso de uso relativamente avançado. Você deve usar esse padrão apenas em instâncias
  específicas nas quais seus contêineres são fortemente acoplados.

  Você não precisa executar múltiplos contêineres para fornecer replicação (para resiliência
  ou capacidade); se você precisa de múltiplas réplicas, consulte
  [Gerenciamento de carga de trabalho](/docs/concepts/workloads/controllers/).

## Usando Pods

O seguinte é um exemplo de um Pod que consiste em um contêiner executando a imagem `nginx:1.14.2`.

{{% code_sample file="pods/simple-pod.yaml" %}}

Para criar o Pod mostrado acima, execute o seguinte comando:
```shell
kubectl apply -f https://k8s.io/examples/pods/simple-pod.yaml
```

Pods geralmente não são criados diretamente e são criados usando recursos de carga de trabalho.
Consulte [Trabalhando com Pods](#working-with-pods) para mais informações sobre como os Pods são usados
com recursos de carga de trabalho.

### Recursos de carga de trabalho para gerenciar pods

Normalmente você não precisa criar Pods diretamente, nem mesmo Pods únicos. Em vez disso, crie-os usando recursos de carga de trabalho como {{< glossary_tooltip text="Deployment"
term_id="deployment" >}} ou {{< glossary_tooltip text="Job" term_id="job" >}}.
Se seus Pods precisam rastrear estado, considere o
recurso {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}.


Cada Pod é destinado a executar uma única instância de uma determinada aplicação. Se você deseja
escalar sua aplicação horizontalmente (para fornecer mais recursos gerais executando
mais instâncias), você deve usar múltiplos Pods, um para cada instância. No
Kubernetes, isso é tipicamente referido como _replicação_.
Pods replicados são geralmente criados e gerenciados como um grupo por um recurso de carga de trabalho
e seu {{< glossary_tooltip text="controlador" term_id="controller" >}}.

Consulte [Pods e controladores](#pods-and-controllers) para mais informações sobre como
o Kubernetes usa recursos de carga de trabalho, e seus controladores, para implementar escalonamento
de aplicação e autorrecuperação.

Pods nativamente fornecem dois tipos de recursos compartilhados para seus contêineres constituintes:
[rede](#pod-networking) e [armazenamento](#pod-storage).


## Trabalhando com Pods

Você raramente criará Pods individuais diretamente no Kubernetes—nem mesmo Pods únicos. Isso
ocorre porque os Pods são projetados como entidades relativamente efêmeras e descartáveis. Quando
um Pod é criado (diretamente por você, ou indiretamente por um
{{< glossary_tooltip text="controlador" term_id="controller" >}}), o novo Pod é
alocado para ser executado em um {{< glossary_tooltip term_id="node" >}} no seu cluster.
O Pod permanece naquele nó até que o Pod termine a execução, o objeto Pod seja excluído,
o Pod seja *removido* por falta de recursos, ou o nó falhe.

{{< note >}}
Reiniciar um contêiner em um Pod não deve ser confundido com reiniciar um Pod. Um Pod
não é um processo, mas um ambiente para executar contêiner(es). Um Pod persiste até
que seja excluído.
{{< /note >}}

O nome de um Pod deve ser um valor de
[subdomínio DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)
válido, mas isso pode produzir resultados inesperados para o hostname do Pod. Para melhor compatibilidade,
o nome deve seguir as regras mais restritivas para um
[rótulo DNS](/docs/concepts/overview/working-with-objects/names#dns-label-names).

### SO do Pod

{{< feature-state state="stable" for_k8s_version="v1.25" >}}

Você deve definir o campo `.spec.os.name` como `windows` ou `linux` para indicar o sistema operacional no
qual você deseja que o pod seja executado. Esses dois são os únicos sistemas operacionais suportados até o momento pelo
Kubernetes. No futuro, esta lista pode ser expandida.

No Kubernetes v{{< skew currentVersion >}}, o valor de `.spec.os.name` não afeta
como o {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}
escolhe um nó para o Pod ser executado. Em qualquer cluster onde há mais de um sistema operacional para
executar nós, você deve definir o
rótulo [kubernetes.io/os](/docs/reference/labels-annotations-taints/#kubernetes-io-os)
corretamente em cada nó, e definir pods com um `nodeSelector` baseado no rótulo do
sistema operacional. O kube-scheduler aloca seu pod para um nó com base em outros critérios e pode ou não
ter sucesso em escolher uma alocação de nó adequada onde o sistema operacional do nó seja adequado para os contêineres naquele Pod.
Os [padrões de segurança de Pod](/docs/concepts/security/pod-security-standards/) também usam este
campo para evitar impor políticas que não sejam relevantes para o sistema operacional.

### Pods e controladores

Você pode usar recursos de carga de trabalho para criar e gerenciar múltiplos Pods para você. Um controlador
para o recurso lida com replicação e implantação e recuperação automática em caso de
falha do Pod. Por exemplo, se um nó falha, um controlador percebe que os Pods naquele
nó pararam de funcionar e cria um Pod substituto. O alocador coloca o
Pod substituto em um nó íntegro.

Aqui estão alguns exemplos de recursos de carga de trabalho que gerenciam um ou mais Pods:

* {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
* {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}
* {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}

### Modelos de Pod

Controladores para recursos de {{< glossary_tooltip text="carga de trabalho" term_id="workload" >}} criam Pods
a partir de um _modelo de Pod_ e gerenciam esses Pods em seu nome.

PodTemplates são especificações para criar Pods, e estão incluídos em recursos de carga de trabalho como
[Deployments](/docs/concepts/workloads/controllers/deployment/),
[Jobs](/docs/concepts/workloads/controllers/job/), e
[DaemonSets](/docs/concepts/workloads/controllers/daemonset/).

Cada controlador para um recurso de carga de trabalho usa o `PodTemplate` dentro do objeto
de carga de trabalho para criar Pods reais. O `PodTemplate` é parte do estado desejado de qualquer
recurso de carga de trabalho que você usou para executar sua aplicação.

Quando você cria um Pod, você pode incluir
[variáveis de ambiente](/docs/tasks/inject-data-application/define-environment-variable-container/)
no modelo de Pod para os contêineres que são executados no Pod.

O exemplo abaixo é um manifesto para um Job simples com um `template` que inicia um
contêiner. O contêiner naquele Pod imprime uma mensagem e então pausa.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: hello
spec:
  template:
    # Este é o modelo de Pod
    spec:
      containers:
      - name: hello
        image: busybox:1.28
        command: ['sh', '-c', 'echo "Hello, Kubernetes!" && sleep 3600']
      restartPolicy: OnFailure
    # O modelo de Pod termina aqui
```

Modificar o modelo de Pod ou alternar para um novo modelo de Pod não tem efeito direto
nos Pods que já existem. Se você alterar o modelo de Pod para um recurso
de carga de trabalho, esse recurso precisa criar Pods substitutos que usem o modelo atualizado.

Por exemplo, o controlador StatefulSet garante que os Pods em execução correspondam ao
modelo de Pod atual para cada objeto StatefulSet. Se você editar o StatefulSet para alterar seu modelo
de Pod, o StatefulSet começa a criar novos Pods baseados no modelo atualizado.
Eventualmente, todos os Pods antigos são substituídos por novos Pods, e a atualização é concluída.

Cada recurso de carga de trabalho implementa suas próprias regras para lidar com alterações no modelo de Pod.
Se você quiser ler mais sobre StatefulSet especificamente, leia
[Estratégia de atualização](/docs/tutorials/stateful-application/basic-stateful-set/#updating-statefulsets) no tutorial Básico de StatefulSet.

Nos nós, o {{< glossary_tooltip term_id="kubelet" text="kubelet" >}} não
observa ou gerencia diretamente nenhum dos detalhes relacionados a modelos de Pod e atualizações; esses
detalhes são abstraídos. Essa abstração e separação de responsabilidades simplifica
a semântica do sistema, e torna viável estender o comportamento do cluster sem
alterar código existente.

## Atualização e substituição de Pod

Como mencionado na seção anterior, quando o modelo de Pod para um recurso
de carga de trabalho é alterado, o controlador cria novos Pods baseados no modelo
atualizado em vez de atualizar ou corrigir os Pods existentes.

O Kubernetes não impede que você gerencie Pods diretamente. É possível
atualizar alguns campos de um Pod em execução, diretamente na configuração aplicada.
No entanto, operações de atualização de Pod como
[`patch`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#patch-pod-v1-core) e
[`replace`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#replace-pod-v1-core),
têm algumas limitações:

- A maioria dos metadados sobre um Pod é imutável. Por exemplo, você não pode
  alterar os campos `namespace`, `name`, `uid`, ou `creationTimestamp`.

- Se o `metadata.deletionTimestamp` estiver definido, nenhuma nova entrada pode ser adicionada à
  lista `metadata.finalizers`.
- Atualizações de Pod não podem alterar campos além de `spec.containers[*].image`,
  `spec.initContainers[*].image`, `spec.activeDeadlineSeconds`, `spec.terminationGracePeriodSeconds`,
  `spec.tolerations` ou `spec.schedulingGates`. Para `spec.tolerations`, você só pode adicionar novas entradas.
- Ao atualizar o campo `spec.activeDeadlineSeconds`, dois tipos de atualizações
  são permitidos:

  1. definir o campo não atribuído para um número positivo; 
  1. atualizar o campo de um número positivo para um número menor, não negativo.

### Subrecursos de Pod

As regras de atualização acima se aplicam a atualizações regulares de Pod, mas outros campos de Pod podem ser atualizados através de _subrecursos_.

- **Resize:** O subrecurso `resize` permite que recursos de contêiner (`spec.containers[*].resources`) sejam atualizados.
  Consulte [Redimensionar Recursos de Contêiner](/docs/tasks/configure-pod-container/resize-container-resources/) para mais detalhes.
- **Contêineres Efêmeros:** O subrecurso `ephemeralContainers` permite que
  {{< glossary_tooltip text="contêineres efêmeros" term_id="ephemeral-container" >}}
  sejam adicionados a um Pod.
  Consulte [Contêineres Efêmeros](/docs/concepts/workloads/pods/ephemeral-containers/) para mais detalhes.
- **Status:** O subrecurso `status` permite que o status do Pod seja atualizado.
  Isso é tipicamente usado apenas pelo Kubelet e outros controladores do sistema.
- **Binding:** O subrecurso `binding` permite definir o `spec.nodeName` do Pod via uma requisição `Binding`.
  Isso é tipicamente usado apenas pelo {{< glossary_tooltip text="escalonador" term_id="kube-scheduler" >}}.

### Geração de Pod

- O campo `metadata.generation` é único. Ele será automaticamente definido pelo
  sistema de forma que novos pods tenham um `metadata.generation` de 1, e cada atualização em
  campos mutáveis na especificação do pod incrementará o `metadata.generation` em 1.

{{< feature-state feature_gate_name="PodObservedGenerationTracking" >}}

- `observedGeneration` é um campo que é capturado na seção `status` do objeto
  Pod. Se o feature gate `PodObservedGenerationTracking` estiver definido, o Kubelet definirá `status.observedGeneration`
  para rastrear o estado do Pod ao status atual do Pod. O `status.observedGeneration` do Pod refletirá a
  `metadata.generation` do Pod no ponto em que o status do Pod está sendo reportado.

{{< note >}}
O campo `status.observedGeneration` é gerenciado pelo kubelet e controladores externos **não** devem modificar este campo.
{{< /note >}}

Diferentes campos de status podem estar associados à `metadata.generation` do ciclo de sincronização atual, ou com a
`metadata.generation` do ciclo de sincronização anterior. A distinção chave é se uma mudança na `spec` é refletida
diretamente no `status` ou é um resultado indireto de um processo em execução.

#### Atualizações Diretas de Status

Para campos de status onde a especificação alocada é diretamente refletida, o `observedGeneration` será
associado à `metadata.generation` atual (Geração N).

Este comportamento se aplica a:

- **Status de Redimensionamento**: O status de uma operação de redimensionamento de recurso.
- **Recursos Alocados**: Os recursos alocados ao Pod após um redimensionamento.
- **Contêineres Efêmeros**: Quando um novo contêiner efêmero é adicionado, e ele está no estado `Waiting`.

#### Atualizações Indiretas de Status

Para campos de status que são um resultado indireto da execução da especificação, o `observedGeneration` será associado
à `metadata.generation` do ciclo de sincronização anterior (Geração N-1).

Este comportamento se aplica a:

- **Imagem do Contêiner**: O `ContainerStatus.ImageID` reflete a imagem da geração anterior até que a nova imagem
  seja baixada e o contêiner seja atualizado.
- **Recursos atuais**: Durante um redimensionamento em andamento, os recursos atuais em uso ainda pertencem à requisição
  da geração anterior.
- **Estado do contêiner**: Durante um redimensionamento em andamento, com política de reinicialização necessária reflete a requisição
  da geração anterior.
- **activeDeadlineSeconds** & **terminationGracePeriodSeconds** & **deletionTimestamp**: Os efeitos desses campos no
  status do Pod são resultado da especificação observada anteriormente.

## Compartilhamento de recursos e comunicação

Pods permitem o compartilhamento de dados e comunicação entre seus contêineres
constituintes.

### Armazenamento em Pods {#pod-storage}

Um Pod pode especificar um conjunto de
{{< glossary_tooltip text="volumes" term_id="volume" >}} de armazenamento compartilhados. Todos os contêineres
no Pod podem acessar os volumes compartilhados, permitindo que esses contêineres
compartilhem dados. Volumes também permitem que dados persistentes em um Pod sobrevivam
caso um dos contêineres precise ser reiniciado. Consulte
[Armazenamento](/docs/concepts/storage/) para mais informações sobre como
o Kubernetes implementa armazenamento compartilhado e o torna disponível para Pods.

### Rede do Pod

Cada Pod recebe um endereço IP único para cada família de endereços. Cada
contêiner em um Pod compartilha o namespace de rede, incluindo o endereço IP e
portas de rede. Dentro de um Pod (e **somente** então), os contêineres que pertencem ao Pod
podem se comunicar uns com os outros usando `localhost`. Quando contêineres em um Pod se comunicam
com entidades *fora do Pod*,
eles devem coordenar como usam os recursos de rede compartilhados (como portas).
Dentro de um Pod, contêineres compartilham um endereço IP e espaço de portas, e
podem encontrar uns aos outros via `localhost`. Os contêineres em um Pod também podem se comunicar
uns com os outros usando comunicações interprocessos padrão como semáforos SystemV
ou memória compartilhada POSIX. Contêineres em Pods diferentes têm endereços IP
distintos e não podem se comunicar por IPC em nível de sistema operacional sem configuração especial.
Contêineres que desejam interagir com um contêiner executando em um Pod diferente podem
usar rede IP para se comunicar.

Contêineres dentro do Pod veem o nome do host do sistema como sendo o mesmo que o
`name` configurado para o Pod. Mais informações sobre isso na seção de [rede](/docs/concepts/cluster-administration/networking/).

## Configurações de segurança de Pod {#pod-security}

Para definir restrições de segurança em Pods e contêineres, você usa o
campo `securityContext` na especificação do Pod. Este campo oferece
controle granular sobre o que um Pod ou contêineres individuais podem fazer. Por exemplo:

* Remover capacidades (capabilities) específicas do Linux para evitar o impacto de uma CVE.
* Forçar todos os processos no Pod a serem executados como usuário não-root ou como um
  usuário específico ou ID de grupo.
* Definir um perfil seccomp específico.
* Definir opções de segurança do Windows, como se os contêineres são executados como HostProcess.

{{< caution >}}
Você também pode usar o securityContext do Pod para habilitar
[_modo privilegiado_](/docs/concepts/security/linux-kernel-security-constraints/#privileged-containers)
em contêineres Linux. O modo privilegiado sobrescreve muitas das outras configurações
de segurança no securityContext. Evite usar essa configuração a menos que você não possa conceder
as permissões equivalentes usando outros campos no securityContext.
No Kubernetes 1.26 e posterior, você pode executar contêineres Windows em um
modo privilegiado semelhante definindo o sinalizador `windowsOptions.hostProcess` no
contexto de segurança da especificação do Pod. Para detalhes e instruções, consulte
[Criar um Pod Windows HostProcess](/docs/tasks/configure-pod-container/create-hostprocess-pod/).
{{< /caution >}}

* Para aprender sobre restrições de segurança em nível de kernel que você pode usar,
  consulte [Restrições de segurança do kernel Linux para Pods e Contêineres](/docs/concepts/security/linux-kernel-security-constraints).
* Para saber mais sobre o contexto de segurança do Pod, consulte
  [Configurar um Contexto de Segurança para um Pod ou Contêiner](/docs/tasks/configure-pod-container/security-context/).

## Pods Estáticos

_Pods Estáticos_ são gerenciados diretamente pelo daemon kubelet em um nó específico,
sem que o {{< glossary_tooltip text="servidor de API" term_id="kube-apiserver" >}}
os observe.
Enquanto a maioria dos Pods são gerenciados pela camada de gerenciamento (por exemplo, um
{{< glossary_tooltip text="Deployment" term_id="deployment" >}}), para Pods
estáticos, o kubelet supervisiona diretamente cada Pod estático (e o reinicia se falhar).

Pods estáticos estão sempre vinculados a um {{< glossary_tooltip term_id="kubelet" >}} em um nó específico.
O uso principal para Pods estáticos é executar uma camada de gerenciamento auto-hospedada: em outras palavras,
usar o kubelet para supervisionar os [componentes da camada de gerenciamento](/docs/concepts/architecture/#control-plane-components) individuais.

O kubelet tenta automaticamente criar um {{< glossary_tooltip text="Pod espelho" term_id="mirror-pod" >}}
no servidor de API do Kubernetes para cada Pod estático.
Isso significa que os Pods em execução em um nó são visíveis no servidor de API,
mas não podem ser controlados de lá. Consulte o guia [Criar Pods estáticos](/docs/tasks/configure-pod-container/static-pod)
para mais informações.

{{< note >}}
A `spec` de um Pod estático não pode referenciar outros objetos de API
(por exemplo, {{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}},
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}},
{{< glossary_tooltip text="Secret" term_id="secret" >}}, etc).
{{< /note >}}

## Pods com múltiplos contêineres {#how-pods-manage-multiple-containers}

Pods são projetados para suportar múltiplos processos cooperantes (como contêineres) que formam
uma unidade coesa de serviço. Os contêineres em um Pod são automaticamente colocalizados e
coalocados na mesma máquina física ou virtual no cluster. Os contêineres
podem compartilhar recursos e dependências, comunicar-se uns com os outros, e coordenar
quando e como são encerrados.

<!--intentionally repeats some text from earlier in the page, with more detail -->
Pods em um cluster Kubernetes são usados de duas maneiras principais:

* **Pods que executam um único contêiner**. O modelo "um-contêiner-por-Pod" é o
  caso de uso mais comum do Kubernetes; neste caso, você pode pensar em um Pod como um
  invólucro em torno de um único contêiner; o Kubernetes gerencia Pods ao invés de gerenciar
  os contêineres diretamente.
* **Pods que executam múltiplos contêineres que precisam trabalhar juntos**. Um Pod pode
  encapsular uma aplicação composta por
  múltiplos contêineres colocalizados que são
  fortemente acoplados e precisam compartilhar recursos. Esses contêineres colocalizados
  formam uma única unidade coesa de serviço—por exemplo, um contêiner servindo dados
  armazenados em um volume compartilhado para o público, enquanto um
  {{< glossary_tooltip text="contêiner sidecar" term_id="sidecar-container" >}} separado
  atualiza ou renova esses arquivos.
  O Pod envolve esses contêineres, recursos de armazenamento e uma identidade de rede
  efêmera juntos como uma única unidade.

Por exemplo, você pode ter um contêiner que
atua como um servidor web para arquivos em um volume compartilhado, e um
[contêiner sidecar](/docs/concepts/workloads/pods/sidecar-containers/) separado
que atualiza esses arquivos de uma fonte remota, como no diagrama a seguir:

{{< figure src="/images/docs/pod.svg" alt="Diagrama de criação de Pod" class="diagram-medium" >}}

Alguns Pods têm {{< glossary_tooltip text="contêineres de inicialização" term_id="init-container" >}}
assim como {{< glossary_tooltip text="contêineres de aplicação" term_id="app-container" >}}.
Por padrão, contêineres de inicialização são executados e concluídos antes que os contêineres de aplicação sejam iniciados.

Você também pode ter [contêineres sidecar](/docs/concepts/workloads/pods/sidecar-containers/)
que fornecem serviços auxiliares ao Pod de aplicação principal (por exemplo: uma malha de serviços).

{{< feature-state feature_gate_name="SidecarContainers" >}}

Habilitado por padrão, o [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `SidecarContainers`
permite que você especifique `restartPolicy: Always` para contêineres de inicialização.
Definir a política de reinicialização `Always` garante que os contêineres onde você a define sejam
tratados como _sidecars_ que são mantidos em execução durante todo o tempo de vida do Pod.
Contêineres que você define explicitamente como contêineres sidecar
iniciam antes do Pod de aplicação principal e permanecem em execução até que o Pod seja
encerrado.


## Verificações de contêiner

Uma _verificação_ é um diagnóstico realizado periodicamente pelo kubelet em um contêiner.
Para realizar um diagnóstico, o kubelet pode invocar diferentes ações:

- `ExecAction` (realizada com a ajuda do agente de execução de contêiner)
- `TCPSocketAction` (verificada diretamente pelo kubelet)
- `HTTPGetAction` (verificada diretamente pelo kubelet)

Você pode ler mais sobre [verificações](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes) 
na documentação de Ciclo de Vida do Pod.

## {{% heading "whatsnext" %}}

* Aprenda sobre o [ciclo de vida de um Pod](/docs/concepts/workloads/pods/pod-lifecycle/).
* Aprenda sobre [RuntimeClass](/docs/concepts/containers/runtime-class/) e como você pode usá-lo para
  configurar diferentes Pods com diferentes configurações de agente de execução de contêiner.
* Leia sobre [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/)
  e como você pode usá-lo para gerenciar a disponibilidade da aplicação durante interrupções.
* Pod é um recurso de nível superior na API REST do Kubernetes.
  A definição do objeto {{< api-reference page="workload-resources/pod-v1" >}}
  descreve o objeto em detalhes.
* [The Distributed System Toolkit: Patterns for Composite Containers](/blog/2015/06/the-distributed-system-toolkit-patterns/) explica layouts comuns para Pods com mais de um contêiner.
* Leia sobre [restrições de distribuição de topologia de Pod](/docs/concepts/scheduling-eviction/topology-spread-constraints/).

Para entender o contexto de por que o Kubernetes envolve uma API de Pod comum em outros recursos
(como {{< glossary_tooltip text="StatefulSets" term_id="statefulset" >}} ou
{{< glossary_tooltip text="Deployments" term_id="deployment" >}}),
você pode ler sobre trabalhos anteriores, incluindo:

* [Aurora](https://aurora.apache.org/documentation/latest/reference/configuration/#job-schema)
* [Borg](https://research.google/pubs/large-scale-cluster-management-at-google-with-borg/)
* [Marathon](https://github.com/d2iq-archive/marathon)
* [Omega](https://research.google/pubs/pub41684/)
* [Tupperware](https://engineering.fb.com/data-center-engineering/tupperware/).
