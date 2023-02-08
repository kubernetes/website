---
title :Contêineres do Windows no Kubernetes
content_type: concept
weight: 65
---

<!-- overview -->

Os aplicativos do Windows constituem uma grande parte dos serviços e aplicativos executados em muitas organizações. [Windows containers](https://aka.ms/windowscontainers)
fornecem uma maneira de encapsular processos e dependências de pacotes, facilitando o uso de práticas de DevOps e seguindo padrões nativos de nuvem para aplicativos do Windows.

As organizações com investimentos em aplicativos baseados em Windows e aplicativos baseados em Linux não precisam procurar orquestradores separados para gerenciar suas cargas de trabalho, levando a um aumento eficiências operacionais em suas implantações, independentemente do sistema operacional.

<!-- body -->

## Windows nodes em Kubernetes

Para habilitar a orquestração de contêineres do Windows no Kubernetes, inclua nós do Windows em seu cluster Linux existente. Agendamento de contêineres do Windows em {{< glossary_tooltip text="Pods" term_id="pod" >}} em O Kubernetes é semelhante ao agendamento de contêineres baseados em Linux.

Para executar contêineres do Windows, seu cluster Kubernetes deve incluir vários sistemas operacionais. Embora você só possa executar o {{< glossary_tooltip text="control plane" term_id="control-plane" >}} no Linux,
você pode implementar nós do trabalhador executando Windows ou Linux.

Janelas {{< glossary_tooltip text="nodes" term_id="node" >}} são
[supported](#windows-os-version-support) desde que o sistema operacional seja o Windows Server 2019.

Este documento usa o termo *contêineres do Windows* para significar contêineres do Windows com isolamento de processo. O Kubernetes não oferece suporte à execução de contêineres do Windows com
[Hyper-V isolation](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container).

## Compatibilidade e limitações {# limitations}

Alguns recursos de nó estão disponíveis apenas se você usar um específico
[container runtime](#container-runtime); outros não estão disponíveis em nós do Windows, incluindo:

* HugePages: não suportado para contêineres do Windows
* Privileged containers: não há suporte para contêineres do Windows.
  [HostProcess Containers](/docs/tasks/configure-pod-container/create-hostprocess-pod/) oferecem funcionalidade semelhante.
* TerminationGracePeriod: requires containerD

Nem todos os recursos de namespaces compartilhados são suportados. Veja [API compatibility](#api)
para mais detalhes.

Veja [Compatibilidade da versão do sistema operacional Windows](#windows-os-version-support) para obter detalhes sobre as versões do Windows nas quais o Kubernetes é testado.

Do ponto de vista da API e do kubectl, os contêineres do Windows se comportam da mesma maneira que os contêineres baseados em Linux. No entanto, existem algumas diferenças notáveis na funcionalidade principal que são descritas nesta seção.

### Comparação com Linux {#compatibility-linux-similarities}

Os principais elementos do Kubernetes funcionam da mesma maneira no Windows e no Linux. Esta seção
refere-se a várias cargas de trabalho importantes abstrações e como elas são mapeadas para o Windows.

* [Pods](/docs/concepts/workloads/pods/)

  Um pod é o bloco de construção básico do Kubernetes, a menor e mais simples unidade no modelo de objeto do Kubernetes que você cria ou implanta. Você não pode implantar contêineres Windows e Linux no mesmo pod. Todos os contêineres em um pod são programados em um único nó, onde cada nó representa uma plataforma e arquitetura específicas. Os seguintes recursos, propriedades e eventos do pod são compatíveis com os contêineres do Windows:

  * Um ou vários contêineres por pod com isolamento de processo e compartilhamento de volume
   * Campos de `status` do pod
   * Prontidão, vivacidade e testes de inicialização
   * ganchos de ciclo de vida do contêiner postStart e preStop
   * ConfigMap, Secrets: como variáveis de ambiente ou volumes
   * volumes `emptyDir`
   * Montagens de host de pipe nomeado
   * Limites de recursos
   * Campo SO:

   O campo `.spec.os.name` deve ser definido como `windows` para indicar que o Pod atual usa contêineres do Windows.

    {{< note >}}
    A partir de 1.25, o portão de recurso `IdentifyPodOS` está no estágio GA e os padrões são ativados.
    {{< /note >}}

    Se você definir o campo `.spec.os.name` como `windows`, não deverá definir os seguintes campos no `.spec` desse Pod:

    * `spec.hostPID`
    * `spec.hostIPC`
    * `spec.securityContext.seLinuxOptions`
    * `spec.securityContext.seccompProfile`
    * `spec.securityContext.fsGroup`
    * `spec.securityContext.fsGroupChangePolicy`
    * `spec.securityContext.sysctls`
    * `spec.shareProcessNamespace`
    * `spec.securityContext.runAsUser`
    * `spec.securityContext.runAsGroup`
    * `spec.securityContext.supplementalGroups`
    * `spec.containers[*].securityContext.seLinuxOptions`
    * `spec.containers[*].securityContext.seccompProfile`
    * `spec.containers[*].securityContext.capabilities`
    * `spec.containers[*].securityContext.readOnlyRootFilesystem`
    * `spec.containers[*].securityContext.privileged`
    * `spec.containers[*].securityContext.allowPrivilegeEscalation`
    * `spec.containers[*].securityContext.procMount`
    * `spec.containers[*].securityContext.runAsUser`
    * `spec.containers[*].securityContext.runAsGroup`

    Na lista acima, curingas (`*`) indicam todos os elementos em uma lista. Por exemplo, `spec.containers[*].securityContext` refere-se ao objeto SecurityContext para todos os contêineres. Se algum desses campos for especificado, o pod não será admitido pelo servidor da API.

* [Workload resources](/docs/concepts/workloads/controllers/) Incluindo:
  * ReplicaSet
  * Deployment
  * StatefulSet
  * DaemonSet
  * Job
  * CronJob
  * ReplicationController
* {{< glossary_tooltip text="Services" term_id="service" >}}
  Veja [Balanceamento de carga e serviços](/docs/concepts/services-networking/windows-networking/#load-balancing-and-services) para mais detalhes.

Pods, rworkload resources, e Services são elementos críticos para gerenciar cargas de trabalho do Windows no Kubernetes. No entanto, por si só, eles não são suficientes para permitir o gerenciamento adequado do ciclo de vida das cargas de trabalho do Windows em uma nuvem dinâmica nativa meio Ambiente.

* `kubectl exec`
* Métricas de pods e contêineres
* {{< glossary_tooltip text="Horizontal pod autoscaling" term_id="horizontal-pod-autoscaler" >}}
* {{< glossary_tooltip text="Cotas de recursos" term_id="resource-quota" >}}
* Preempção do agendador

### Opções de linha de comando para o kubelet {#kubelet-compatibility}

Algumas opções de linha de comando kubelet se comportam de maneira diferente no Windows, conforme descrito abaixo:

* O `--windows-priorityclass` permite definir a prioridade de agendamento do processo kubelet
  (veja [CPU resource management](/docs/concepts/configuration/windows-resource-management/#resource-management-cpu))
* O `--kube-reserved`, `--system-reserved` , e `--eviction-hard` flags update
  [NodeAllocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
* Despejo usando `--enforce-node-allocable` não é implementado
* Despejo usando `--eviction-hard` and `--eviction-soft` não são implementados
* Ao executar em um nó do Windows, o kubelet não possui restrições de memória ou CPU `--kube-reserved` e `--system-reserved` apenas subtrair de `NodeAllocatable`
  e não garantem recursos fornecidos para cargas de trabalho.
  veja [Resource Management for Windows nodes](/docs/concepts/configuration/windows-resource-management/#resource-reservation)
  Para maiores informações.
* A condição do `MemoryPressure` não foi implementada
* O kubelet não executa ações de despejo OOM

### Compatibilidade API {#api}

Existem diferenças sutis na forma como as APIs do Kubernetes funcionam para Windows devido ao sistema operacional e ao tempo de execução do contêiner. Algumas propriedades de carga de trabalho foram projetadas para Linux e não são executadas no Windows.

Em um alto nível, esses conceitos de sistema operacional são diferentes:

* Identidade - Linux usa userID (UID) e groupID (GID) que
  são representados como tipos inteiros. Nomes de usuários e grupos
  não são canônicos - eles são apenas um alias em `/etc/groups`
  ou `/etc/passwd` de volta para UID+GID. O Windows usa um [identificador de segurança] binário maior (https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/security-identifiers) (SID) que é armazenado no Windows Security Banco de dados do Access Manager (SAM). Esse banco de dados não é compartilhado entre o host e os contêineres ou entre os contêineres.
* Permissões de arquivo - o Windows usa uma lista de controle de acesso baseada em (SIDs), enquanto os sistemas POSIX, como o Linux, usam uma máscara de bits baseada em permissões de objeto e UID+GID, além de listas de controle de acesso _opcional_.
* Caminhos de arquivo - a convenção no Windows é usar `\` em vez de `/`. As bibliotecas Go IO normalmente aceitam ambos e apenas fazem funcionar, mas quando você está definindo um caminho ou linha de comando que é interpretado dentro de um contêiner, `\` pode ser necessário.
* Sinais - os aplicativos interativos do Windows lidam com o encerramento de maneira diferente e podem implementar um ou mais destes:
  * Um thread de interface do usuário lida com mensagens bem definidas, incluindo `WM_CLOSE`.
  * Os aplicativos de console lidam com Ctrl-C ou Ctrl-break usando um manipulador de controle.
  * Os serviços registram uma função Service Control Handler que pode aceitar códigos de controle `SERVICE_CONTROL_STOP`.

Os códigos de saída do contêiner seguem a mesma convenção em que 0 é sucesso e diferente de zero é falha. Os códigos de erro específicos podem diferir entre Windows e Linux. No entanto, os códigos de saída passados dos componentes do Kubernetes (kubelet, kube-proxy) permanecem inalterados.

#### Compatibilidade de campo para especificações de contêine {#compatibility-v1-pod-spec-containers}

A lista a seguir documenta as diferenças entre como as especificações do contêiner de pod funcionam entre o Windows e o Linux:

* Páginas enormes não são implementadas no tempo de execução do contêiner do Windows e não estão disponíveis. Eles exigem [afirmação de privilégio de usuário](https://docs.microsoft.com/en-us/windows/desktop/Memory/large-page-support) que não é configurável para contêineres.
* `requests.cpu` e `requests.memory` - as solicitações são subtraídas dos recursos disponíveis do nó, para que possam ser usadas para evitar o superprovisionamento de um nó. No entanto, eles não podem ser usados ​​para garantir recursos em um nó superprovisionado. Eles devem ser aplicados a todos os contêineres como uma prática recomendada se o operador quiser evitar totalmente o superprovisionamento.
* `securityContext.allowPrivilegeEscalation` -
não é possível no Windows; nenhum dos recursos está conectado
* `securityContext.capabilities` -
   Os recursos POSIX não são implementados no Windows
* `securityContext.privileged` -
   O Windows não oferece suporte a contêineres privilegiados, use [HostProcess Containers](/docs/tasks/configure-pod-container/create-hostprocess-pod/) em vez disso
* `securityContext.procMount` -
   O Windows não possui um sistema de arquivos `/proc`
* `securityContext.readOnlyRootFilesystem` -
   não é possível no Windows; o acesso de gravação é necessário para que os processos de registro e sistema sejam executados dentro do contêiner
* `securityContext.runAsGroup` -
   não é possível no Windows, pois não há suporte para GID
* `securityContext.runAsNonRoot` -
   esta configuração impedirá que os contêineres sejam executados como `ContainerAdministrator`, que é o equivalente mais próximo de um usuário root no Windows.
* `securityContext.runAsUser` -
   use [`runAsUserName`](/docs/tasks/configure-pod-container/configure-runasusername) em vez disso
* `securityContext.seLinuxOptions` -
   não é possível no Windows, pois o SELinux é específico do Linux
* `terminationMessagePath` -
   isso tem algumas limitações, pois o Windows não oferece suporte ao mapeamento de arquivos únicos. O valor padrão é `/dev/termination-log`, que funciona porque não existe no Windows por padrão.

#### Compatibilidade de campo para especificações de pod {#compatibility-v1-pod}

A lista a seguir documenta as diferenças entre como as especificações do pod funcionam entre o Windows e o Linux:

* `hostIPC` e `hostpid` - compartilhamento de namespace de host não é possível no Windows
* `hostNetwork` - Não há suporte do sistema operacional Windows para compartilhar a rede do host
* `dnsPolicy` - a configuração do pod `dnsPolicy` como `ClusterFirstWithHostNet` não é suportada no Windows porque a rede do host não é fornecida. Os pods sempre são executados com uma rede de contêineres.
* `podSecurityContext` (veja abaixo)
* `shareProcessNamespace` - este é um recurso beta e depende de namespaces do Linux que não são implementados no Windows. O Windows não pode compartilhar namespaces de processos ou o sistema de arquivos raiz do contêiner. Somente a rede pode ser compartilhada.
* `terminationGracePeriodSeconds` - isso não está totalmente implementado no Docker no Windows, consulte o [problema do GitHub](https://github.com/moby/moby/issues/25982).
  O comportamento hoje é que o processo ENTRYPOINT é enviado CTRL_SHUTDOWN_EVENT, então o Windows espera 5 segundos por padrão e finalmente desliga todos os processos usando o comportamento normal de desligamento do Windows. O padrão de 5 segundos está, na verdade, no registro do Windows [dentro do contêiner](https://github.com/moby/moby/issues/25982#issuecomment-426441183), portanto, pode ser substituído quando o contêiner é criado.
* `volumeDevices` - este é um recurso beta e não está implementado no Windows. O Windows não pode anexar dispositivos de blocos brutos a pods.
* `volumes`
  * Se você definir um volume `emptyDir`, não poderá definir sua fonte de volume para `memory`.
* Você não pode ativar `mountPropagation` para montagens de volume, pois isso não é suportado no Windows.

#### Compatibilidade de campo para contexto de segurança do pod{#compatibility-v1-pod-spec-containers-securitycontext}

Nenhum dos campos do pod [`securityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context) funcionam no Windows.

## Detector de problemas do Node

O detector de problemas de nó (consulte
[Monitor Node Health](/docs/tasks/debug/debug-cluster/monitor-node-health/)) tem suporte preliminar para Windows. Para obter mais informações, visite a [página GitHub] do projeto (https://github.com/kubernetes/node-problem-detector#windows).

## Pausar contêiner

Em um Kubernetes Pod, uma infraestrutura ou contêiner de “pausa” é criado primeiro para hospedar o contêiner. No Linux, os cgroups e namespaces que compõem um pod precisam de um processo para manter sua existência contínua; o processo de pausa fornece isto. Contêineres que pertencem ao mesmo pod, incluindo infraestrutura e contêineres de trabalho, compartilham um endpoint de rede comum (mesmo endereço IPv4 e/ou IPv6, mesmos espaços de porta de rede). O Kubernetes usa contêineres de pausa para permitir que os contêineres de trabalho travem ou reiniciem sem perder nenhuma configuração de rede.

O Kubernetes mantém uma imagem multiarquitetura que inclui suporte para Windows. Para Kubernetes v{{< skew currentVersion >}}, a imagem de pausa recomendada é `registry.k8s.io/pause:3.6`. 
O [código-fonte](https://github.com/kubernetes/kubernetes/tree/master/build/pause) está disponível no GitHub.

A Microsoft mantém uma imagem multi-arquitetura diferente, com suporte para Linux e Windows amd64, que você pode encontrar como `mcr.microsoft.com/oss/kubernetes/pause:3.6`.
Esta imagem é construída a partir da mesma fonte que a imagem mantida pelo Kubernetes, mas todos os binários do Windows são [authenticode assinados](https://docs.microsoft.com/en-us/windows-hardware/drivers/install/authenticode) por Microsoft. O projeto Kubernetes recomenda usar a imagem mantida pela Microsoft se você estiver implantando em um ambiente de produção ou semelhante a produção que exija binários assinados.

## Tempo de execução de contêiner{#container-runtime}

Você precisa instalar o
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
em cada nó no cluster para que os pods possam ser executados lá.

Os seguintes tempos de execução de contêiner funcionam com o Windows:

{{% thirdparty-content %}}

### ContainerD

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

Você pode usar {{< glossary_tooltip term_id="containerd" text="ContainerD" >}} 1.4.0+ como o tempo de execução do contêiner para nós do Kubernetes que executam o Windows.

Aprender como [instalar o ContainerD em um nó do Windows](/docs/setup/production-environment/container-runtimes/#install-containerd).

{{< note >}}
Há uma [limitação conhecida](/docs/tasks/configure-pod-container/configure-gmsa/#gmsa-limitations)
ao usar GMSA com containerd para acessar compartilhamentos de rede do Windows, o que requer um correção do kernel.
{{< /note >}}

### Tempo de execução do contêiner Mirantis {#mcr}

[Mirantis Container Runtime](https://docs.mirantis.com/mcr/20.10/overview.html) (MCR)
está disponível como um tempo de execução de contêiner para todos os Windows Server 2019 e versões posteriores.

Consulte [Instalar MCR em servidores Windows](https://docs.mirantis.com/mcr/20.10/install mcr-windows.html) para obter mais informações.

## Compatibilidade da versão do sistema operacional Windows {#windows-os-version-support}

Nos nós do Windows, regras rígidas de compatibilidade se aplicam onde a versão do sistema operacional do host deve corresponder à versão do sistema operacional da imagem base do contêiner. Somente contêineres do Windows com um sistema operacional de contêiner do Windows Server 2019 são totalmente suportados.

Para Kubernetes v{{< skew currentVersion >}}, compatibilidade do sistema operacional para node do Windows (e pods)
é o seguinte:

Versão LTSC do Windows Server
: Servidor Windows 2019
: WindowsServer 2022

Versão SAC do Windows Server
: Windows Server versão 20H2

A [política de distorção de versão](/docs/setup/release/version-skew-policy/) do Kubernetes também se aplica.

## Obtendo ajuda e solução de problemas {#troubleshooting}

Sua principal fonte de ajuda para solucionar problemas do cluster Kubernetes deve começar
com a [Solução de problemas](/docs/tasks/debug/) página.

Alguma ajuda adicional para solução de problemas específica do Windows está incluída nesta secção. Os logs são um elemento importante da solução de problemas problemas no Kubernetes. Certifique-se de incluí-los sempre que procurar assistência para solução de problemas de outros colaboradores. Segue o instruções no SIG Windows [guia de contribuição sobre coleta de logs](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#gathering-logs).

### Relatando problemas e solicitações de recursos

Se você tem o que parece ser um bug, ou você gostaria de fazer uma solicitação de recurso, siga o [guia de contribuição do SIG Windows](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#reporting-issues-and-feature-requests) para criar um novo problema.
Você deve primeiro pesquisar a lista de problemas, caso tenha sido relatado anteriormente e comente com sua experiência sobre o problema e adicione Histórico. O canal SIG Windows no Kubernetes Slack também é um ótimo caminho para obter algum suporte inicial e idéias de solução de problemas antes de criar um ticket.

## Ferramentas de implantação

A ferramenta kubeadm ajuda você a implantar um cluster Kubernetes, fornecendo o controle
plano para gerenciar o cluster e nós para executar suas cargas de trabalho.
[Adicionando nós do Windows](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/)
explica como implantar nós do Windows em seu cluster usando kubeadm.

O projeto Kubernetes [API de cluster](https://cluster-api.sigs.k8s.io/) também fornece meios para automatizar a implantação de nós do Windows.

## Canais de distribuição do Windows

Para obter uma explicação detalhada dos canais de distribuição do Windows, consulte o 
[Documentação da Microsoft](https://docs.microsoft.com/en-us/windows-server/get-started-19/servicing-channels-19).

Informações sobre os diferentes canais de atendimento do Windows Server
incluindo seus modelos de suporte podem ser encontrados em [Canais de serviço do Windows Server](https://docs.microsoft.com/en-us/windows-server/get-started/servicing-channels-comparison).
