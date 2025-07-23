---
title: Contêineres Windows no Kubernetes
content_type: concept
weight: 65
---

<!-- visão geral -->

Aplicativos Windows constituem uma grande parte dos serviços e aplicações que rodam em muitas organizações. [Contêineres Windows](https://aka.ms/windowscontainers) fornecem uma maneira de encapsular processos e empacotar dependências, facilitando o uso de práticas DevOps e seguindo padrões nativos da nuvem para aplicativos Windows.

Organizações com investimentos em aplicativos baseados em Windows e Linux não precisam procurar orquestradores separados para gerenciar suas cargas de trabalho, levando a eficiências operacionais aumentadas em suas implantações, independentemente do sistema operacional.

<!-- body -->

## Nós Windows no Kubernetes

Para habilitar a orquestração de contêineres Windows no Kubernetes, inclua nós Windows em seu cluster Linux existente. A alocação de contêineres Windows em {{< glossary_tooltip text="Pods" term_id="pod" >}} no Kubernetes é similar à alocação de contêineres baseados em Linux.

Para executar contêineres Windows, seu cluster Kubernetes deve incluir múltiplos sistemas operacionais. Embora você possa executar a {{< glossary_tooltip text="camada de gerenciamento" term_id="control-plane" >}} apenas no Linux, você pode implantar nós de trabalho executando Windows ou Linux.

{{< glossary_tooltip text="Nós" term_id="node" >}} Windows são [suportados](#windows-os-version-support) desde que o sistema operacional seja Windows Server 2019 ou Windows Server 2022.

Este documento usa o termo *contêineres Windows* para se referir a contêineres Windows com isolamento de processo. O Kubernetes não suporta a execução de contêineres Windows com [isolamento Hyper-V](https://docs.microsoft.com/pt-br/virtualization/windowscontainers/manage-containers/hyperv-container).

## Compatibilidade e limitações {#limitations}

Alguns recursos do nó estão disponíveis apenas se você usar um [agente de execução de contêiner](#container-runtime) específico; outros não estão disponíveis em nós Windows, incluindo:

* HugePages: não suportado para contêineres Windows
* Contêineres privilegiados: não suportados para contêineres Windows. [Contêineres HostProcess](/docs/tasks/configure-pod-container/create-hostprocess-pod/) oferecem funcionalidade semelhante.
* TerminationGracePeriod: requer containerD

Nem todos os recursos de namespaces compartilhados são suportados. Veja [Compatibilidade da API](#api) para mais detalhes.

Veja [Compatibilidade de versão do sistema operacional Windows](#windows-os-version-support) para detalhes sobre as versões do Windows nas quais o Kubernetes é testado.

Do ponto de vista da API e do kubectl, contêineres Windows se comportam de maneira muito semelhante aos contêineres baseados em Linux. No entanto, há algumas diferenças notáveis em funcionalidades-chave que são destacadas nesta seção.

### Comparação com Linux {#compatibility-linux-similarities}

Elementos-chave do Kubernetes funcionam da mesma forma no Windows como no Linux. Esta seção refere-se a várias abstrações de carga de trabalho e como elas se mapeiam para o Windows.

* [Pods](/docs/concepts/workloads/pods/)

  Um Pod é o bloco de construção básico do Kubernetes — a menor e mais simples unidade no modelo de objeto do Kubernetes que você cria ou implanta. Você não pode implantar contêineres Windows e Linux no mesmo Pod. Todos os contêineres em um Pod são agendados em um único Nó, onde cada Nó representa uma plataforma e arquitetura específicas. As seguintes capacidades, propriedades e eventos do Pod são suportados com contêineres Windows:

  * Único ou múltiplos contêineres por Pod com isolamento de processo e compartilhamento de volume
  * Campos de `status` do Pod
  * Verificações de readiness (prontidão), liveness (operacionalidade) e startup (inicialização)
  * Hooks de ciclo de vida do Contêiner `postStart` e `preStop`
  * ConfigMap, Secrets: como variáveis de ambiente ou volumes
  * Volumes `emptyDir`
  * Montagens de pipe nomeado do host
  * Limites de recursos
  * Campo Sistema Operacional:

    O campo `.spec.os.name` deve ser definido como `windows` para indicar que o Pod atual usa contêineres Windows.

    Se você definir o campo `.spec.os.name` como `windows`, não deve definir os seguintes campos no `.spec` desse Pod:

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

    Na lista acima, curingas (`*`) indicam todos os elementos em uma lista. Por exemplo, `spec.containers[*].securityContext` refere*se ao objeto SecurityContext para todos os contêineres. Se qualquer um desses campos for especificado, o Pod não será admitido pelo servidor API.

* [Recursos de carga de trabalho](/pt-br/docs/concepts/workloads/controllers/) incluindo:
  * ReplicaSet
  * Deployment
  * StatefulSet
  * DaemonSet
  * Job
  * CronJob
  * ReplicationController
* {{< glossary_tooltip text="Services" term_id="service" >}}

  Veja [Balanceamento de carga e Services](/docs/concepts/services-networking/windows-networking/#load-balancing-and-services) para mais detalhes.

Pods, recursos de carga de trabalho e Services são elementos críticos para gerenciar cargas de trabalho Windows no Kubernetes. No entanto, por si só, eles não são suficientes para habilitar o gerenciamento adequado do ciclo de vida de cargas de trabalho Windows em um ambiente nativo da nuvem dinâmico.

* `kubectl exec`
* Métricas de Pod e Contêiner
* {{< glossary_tooltip text="Escalonamento horizontal de pods" term_id="horizontal-pod-autoscaler" >}}
* {{< glossary_tooltip text="Quotas de recursos" term_id="resource-quota" >}}
* Preempção do scheduler

### Opções de linha de comando para o kubelet {#kubelet-compatibility}

Algumas opções de linha de comando do kubelet se comportam de maneira diferente no Windows, conforme descrito abaixo:

* A opção `--windows-priorityclass` permite definir a prioridade de agendamento do processo kubelet (veja [Gerenciamento de recursos de CPU](/pt-br/docs/concepts/configuration/windows-resource-management/))
* As flags `--kube-reserved`, `--system-reserved` e `--eviction-hard` atualizam [NodeAllocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
* A opção de despejo usando `--enforce-node-allocable` não está implementada
* Ao executar em um nó Windows, o kubelet não tem restrições de memória ou CPU. `--kube-reserved` e `--system-reserved` apenas subtraem de `NodeAllocatable` e não garantem recursos fornecidos para cargas de trabalho. Veja [Gerenciamento de recursos para nós Windows](/pt-br/docs/concepts/configuration/windows-resource-management/) para mais informações.
* A condição `PIDPressure` não está implementada
* O kubelet não executa ações de despejo de OOM

### Compatibilidade da API {#api}

Existem diferenças sutis na forma como as APIs do Kubernetes funcionam para o Windows devido ao SO e ao agente de execução de contêiner. Algumas propriedades de carga de trabalho foram projetadas para Linux e falham ao rodar no Windows.

Em um nível alto, esses conceitos de SO são diferentes:

* Identidade: Linux usa userID (UID) e groupID (GID) que são representados como tipos inteiros. Nomes de usuário e grupo não são canônicos - eles são apenas um alias em `/etc/groups` ou `/etc/passwd` de volta para UID+GID. O Windows usa um [identificador de segurança](https://docs.microsoft.com/pt-br/windows/security/identity-protection/access-control/security-identifiers) (SID) binário maior que é armazenado no banco de dados Windows Security Access Manager (SAM). Este banco de dados não é compartilhado entre o host e os contêineres, ou entre os contêineres.
* Permissões de arquivo: o Windows usa uma lista de controle de acesso baseada em SIDs, enquanto sistemas POSIX como Linux usam uma máscara de bits baseada em permissões de objeto e UID+GID, além de listas de controle de acesso _opcionais_.
* Caminhos de arquivo: a convenção no Windows é usar `\` em vez de `/`. As bibliotecas Go IO normalmente aceitam ambos e simplesmente funcionam, mas quando você está definindo um caminho ou linha de comando que é interpretada dentro de um Contêiner, pode ser necessário usar `\`.
* Sinais: Aplicativos interativos do Windows lidam com a terminação de maneira diferente e podem implementar um ou mais destes:
  * Uma thread de interface do usuário manipula mensagens bem definidas, incluindo `WM_CLOSE`.
  * Aplicativos de console lidam com Ctrl-C ou Ctrl-break usando um Manipulador de Controle.
  * Serviços registram uma função Manipuladora de Controle de Serviço que pode aceitar códigos de controle `SERVICE_CONTROL_STOP`.

Códigos de saída de Contêiner seguem a mesma convenção onde 0 é sucesso e diferente de zero é falha. Os códigos de erro específicos podem diferir entre Windows e Linux. No entanto, códigos de saída passados dos componentes do Kubernetes (kubelet, kube-proxy) são inalterados.

#### Compatibilidade de campos para especificações de Contêiner {#compatibility-v1-pod-spec-containers}

A lista a seguir documenta as diferenças entre como as especificações de Contêiner do Pod funcionam entre Windows e Linux:

* Huge pages não são implementadas no agente de execução de contêiner do Windows e não estão disponíveis. Elas requerem [afirmação de um privilégio de usuário](https://docs.microsoft.com/pt-br/windows/desktop/Memory/large-page-support) que não é configurável para contêineres.
* `requests.cpu` e `requests.memory` - as solicitações são subtraídas dos recursos disponíveis do nó, para que possam ser usadas para evitar o superprovisionamento de um nó. No entanto, elas não podem ser usadas para garantir recursos em um nó superprovisionado. Elas devem ser aplicadas a todos os contêineres como uma boa prática se o operador quiser evitar o superprovisionamento completamente.
* `securityContext.allowPrivilegeEscalation` - não é possível no Windows; nenhuma das capacidades está conectada
* `securityContext.capabilities` - capacidades POSIX não são implementadas no Windows
* `securityContext.privileged` - o Windows não suporta contêineres privilegiados, use [contêineres HostProcess](/docs/tasks/configure-pod-container/create-hostprocess-pod/) em vez disso
* `securityContext.procMount` - o Windows não possui um sistema de arquivos `/proc`
* `securityContext.readOnlyRootFilesystem` - não é possível no Windows; acesso de gravação é necessário para que o registro e processos do sistema rodem dentro do Contêiner
* `securityContext.runAsGroup` - não é possível no Windows, pois não há suporte para GID
* `securityContext.runAsNonRoot` - esta configuração impedirá que contêineres sejam executados como `ContainerAdministrator`, que é o equivalente mais próximo a um usuário root no Windows.
* `securityContext.runAsUser` - use [`runAsUserName`](/pt-br/docs/tasks/configure-pod-container/configure-runasusername/) em vez disso
* `securityContext.seLinuxOptions` - não é possível no Windows, pois o SELinux é específico do Linux
* `terminationMessagePath` - isso tem algumas limitações, pois o Windows não suporta mapeamento de arquivos únicos. O valor padrão é `/dev/termination-log`, que funciona porque não existe no Windows por padrão.

#### Compatibilidade de campos para especificações de Pod {#compatibility-v1-pod}

A lista a seguir documenta as diferenças entre como as especificações de Pod funcionam entre Windows e Linux:

* `hostIPC` e `hostPID` - compartilhamento de namespace do host não é possível no Windows
* `hostNetwork` - [veja abaixo](#compatibility-v1-pod-spec-containers-hostnetwork)
* `dnsPolicy` - definir o `dnsPolicy` do Pod como `ClusterFirstWithHostNet` não é suportado no Windows porque a rede do host não é fornecida. Pods sempre rodam com uma rede de Contêiner.
* `podSecurityContext` [veja abaixo](#compatibility-v1-pod-spec-containers-securitycontext)
* `shareProcessNamespace` - este é um recurso beta e depende de namespaces Linux que não estão implementados no Windows. O Windows não pode compartilhar namespaces de processos ou o sistema de arquivos raiz do Contêiner. Apenas a rede pode ser compartilhada.
* `terminationGracePeriodSeconds` - isso não está totalmente implementado no Docker no Windows, veja o [issue no GitHub](https://github.com/moby/moby/issues/25982). O comportamento atual é que o processo ENTRYPOINT recebe CTRL_SHUTDOWN_EVENT, então o Windows espera 5 segundos por padrão e finalmente encerra todos os processos usando o comportamento normal de desligamento do Windows. O padrão de 5 segundos está na verdade no registro do Windows [dentro do Contêiner](https://github.com/moby/moby/issues/25982#issuecomment-426441183), então pode ser substituído quando o Contêiner é construído.
* `volumeDevices` - este é um recurso beta e não está implementado no Windows. O Windows não pode anexar dispositivos de bloco bruto a pods.
* `volumes`
  * Se você definir um volume `emptyDir`, não pode definir sua fonte de volume para `memory`.
* Você não pode habilitar `mountPropagation` para montagens de volume, pois isso não é suportado no Windows.

#### Compatibilidade de campos para hostNetwork {#compatibility-v1-pod-spec-containers-hostnetwork}

{{< feature-state for_k8s_version="v1.26" state="alpha" >}}

O kubelet agora pode solicitar que pods em execução em nós Windows usem o namespace de rede do host em vez de criar um novo namespace de rede de pod. Para habilitar essa funcionalidade, passe `--feature-gates=WindowsHostNetwork=true` para o kubelet.

{{< note >}}
Esta funcionalidade requer um agente de execução de contêiner que suporte essa funcionalidade.
{{< /note >}}

#### Compatibilidade de campos para o contexto de segurança do Pod {#compatibility-v1-pod-spec-containers-securitycontext}

Apenas `securityContext.runAsNonRoot` e `securityContext.windowsOptions` dos campos [`securityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context) do Pod funcionam no Windows.

## Detector de problemas do nó

O detector de problemas do nó (veja [Monitorando a integridade do nó](/docs/tasks/debug/debug-cluster/monitor-node-health/)) tem suporte preliminar para Windows. Para mais informações, visite a [página do GitHub](https://github.com/kubernetes/node-problem-detector#windows) do projeto.

## Contêiner de pausa

Em um Pod Kubernetes, um Contêiner de infraestrutura ou "pausa" é criado primeiro para hospedar o Contêiner. No Linux, os cgroups e namespaces que compõem um pod precisam de um processo para manter sua existência contínua; o processo de pausa fornece isso. Contêineres que pertencem ao mesmo pod, incluindo infraestrutura e contêineres de trabalho, compartilham um endpoint de rede comum (mesmo endereço IPv4 e/ou IPv6, mesmos espaços de porta de rede). O Kubernetes usa contêineres de pausa para permitir que contêineres de trabalho falhem ou reiniciem sem perder qualquer configuração de rede.
O detector de problemas do nó (veja [Monitorando a integridade do nó](/docs/tasks/debug/debug-cluster/monitor-node-health/)) tem suporte preliminar para Windows. Para mais informações, visite a [página do GitHub](https://github.com/kubernetes/node-problem-detector#windows) do projeto.
O Kubernetes mantém uma imagem multi-arquitetura que inclui suporte para Windows. Para o Kubernetes v{{< skew currentPatchVersion >}} a imagem de pausa recomendada é `registry.k8s.io/pause:3.6`. O [código fonte](https://github.com/kubernetes/kubernetes/tree/master/build/pause) está disponível no GitHub.

A Microsoft mantém uma imagem multi-arquitetura diferente, com suporte para Windows amd64 e Linux, que você pode encontrar como `mcr.microsoft.com/oss/kubernetes/pause:3.6`. Esta imagem é construída a partir do mesmo código fonte que a imagem mantida pelo Kubernetes, mas todos os binários do Windows são [assinados pelo Authenticode](https://docs.microsoft.com/pt-br/windows-hardware/drivers/install/authenticode) pela Microsoft. O projeto Kubernetes recomenda usar a imagem mantida pela Microsoft se você estiver implantando em um ambiente de produção ou similar que exija binários assinados.

## Agente de Execução de Contêiner {#container-runtime}

Você precisa instalar um {{< glossary_tooltip text="agente de execução de contêiner" term_id="container-runtime" >}} em cada nó do cluster para que os Pods possam ser executados lá.

Os seguintes runtimes de Contêiner funcionam com Windows:

{{% thirdparty-content %}}

### ContainerD

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

Você pode usar {{< glossary_tooltip term_id="containerd" text="ContainerD" >}} 1.4.0+ como o agente de execução de contêiner para nós Kubernetes que executam Windows.

Aprenda como [instalar o ContainerD em um nó Windows](/docs/setup/production-environment/container-runtimes/#containerd).

{{< note >}}
Há uma [limitação conhecida](pt-br/docs/tasks/configure-pod-container/configure-gmsa/) ao usar GMSA com containerd para acessar compartilhamentos de rede do Windows, o que requer um patch no kernel.
{{< /note >}}

### Mirantis Contêiner Runtime {#mcr}

[Mirantis Container Runtime](https://docs.mirantis.com/mcr/25.0/overview.html) (MCR) está disponível como um agente de execução de contêiner para todas as versões do Windows Server 2019 e posteriores.

Veja [Instalar MCR em servidores Windows](https://docs.mirantis.com/mcr/20.10/install/mcr-windows.html) para mais informações.

## Compatibilidade de versão do sistema operacional Windows{#windows-os-version-support}

Em nós Windows, aplicam-se regras estritas de compatibilidade onde a versão do SO do host deve corresponder à versão da imagem base do Contêiner. Apenas contêineres Windows com um sistema operacional de Contêiner do Windows Server 2019 são totalmente suportados.

Para o Kubernetes v{{< skew currentVersion >}}, a compatibilidade do sistema operacional para nós Windows (e Pods) é a seguinte:

**Windows Server LTSC release**

: Windows Server 2019
: Windows Server 2022

Windows Server SAC release

: Windows Server versão 20H2

A [política de desvio de versão](/docs/setup/release/version-skew-policy/) do Kubernetes também se aplica.

## Recomendações e considerações de hardware {#windows-hardware-recommendations}

{{% thirdparty-content %}}

{{< note >}}
As especificações de hardware a seguir devem ser consideradas como valores padrão sensatos. Elas não se destinam a representar requisitos mínimos ou recomendações específicas para ambientes de produção. Dependendo dos requisitos para sua carga de trabalho, esses valores podem precisar ser ajustados.
{{< /note >}}

- Processador de 64 bits com 4 núcleos de CPU ou mais, capaz de suportar virtualização
- 8GB ou mais de RAM
- 50GB ou mais de espaço livre em disco

Consulte [Requisitos de hardware para o Windows Server na documentação da Microsoft](https://learn.microsoft.com/pt-br/windows-server/get-started/hardware-requirements) para obter as informações mais atualizadas sobre requisitos mínimos de hardware. Para orientação sobre como decidir sobre recursos para nós de trabalho em produção, consulte [Nós de trabalho em produção na documentação do Kubernetes](/docs/setup/production-environment/#production-worker-nodes).

Para otimizar os recursos do sistema, se uma interface gráfica de usuário não for necessária, pode ser preferível usar uma instalação do Windows Server que exclua a opção de instalação [Windows Desktop Experience](https://learn.microsoft.com/pt-br/windows-server/get-started/install-options-server-core-desktop-experience), já que esta configuração normalmente libera mais recursos do sistema.

Ao avaliar o espaço em disco para nós de trabalho Windows, observe que as imagens de Contêiner do Windows são tipicamente maiores que as imagens de Contêiner do Linux, com tamanhos de imagem de Contêiner variando de [300MB a mais de 10GB](https://techcommunity.microsoft.com/t5/containers/nano-server-x-server-core-x-server-which-base-image-is-the-right/ba-p/2835785) para uma única imagem. Além disso, observe que a unidade `C:` em contêineres Windows representa um tamanho virtual livre de 20GB por padrão, que não é o espaço consumido real, mas sim o tamanho do disco para o qual um único Contêiner pode crescer ao ocupar quando usa armazenamento local no host. Veja [Contêineres no Windows - Documentação de Armazenamento de Contêiner](https://learn.microsoft.com/pt-br/virtualization/windowscontainers/manage-containers/container-storage#storage-limits) para mais detalhes.

## Obtendo ajuda e solucionando problemas {#troubleshooting}

Sua principal fonte de ajuda para solucionar problemas em seu cluster Kubernetes deve começar com a página de [Solução de Problemas](/docs/tasks/debug/).

Alguma ajuda adicional, específica para Windows, está incluída nesta seção. Logs são um elemento importante na solução de problemas no Kubernetes. Certifique-se de incluí-los sempre que buscar assistência de outros colaboradores. Siga as instruções no [guia de contribuição do SIG Windows sobre coleta de logs](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#gathering-logs).

### Relatando problemas e solicitações de funcionalidades

Se você tiver algo que pareça um bug ou gostaria de fazer uma solicitação de recurso, siga o [guia de contribuição do SIG Windows](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#reporting-issues-and-feature-requests) para criar uma nova issue. Você deve primeiro pesquisar na lista de issues existentes caso tenha sido relatado anteriormente e comentar com sua experiência na issue e adicionar logs adicionais. O canal SIG Windows no Slack do Kubernetes também é uma ótima maneira de obter suporte inicial e ideias de solução de problemas antes de criar um ticket.

### Validando a operabilidade do cluster Windows

O projeto Kubernetes fornece uma especificação de _Windows Operational Readiness_, acompanhada por um conjunto de testes estruturados. Este conjunto é dividido em dois conjuntos de testes, principal (_core_) e estendido (_extended_), cada um contendo categorias destinadas a testar áreas específicas. Pode ser usado para validar todas as funcionalidades de um sistema Windows e híbrido (misturado com nós Linux) com cobertura total.

Para configurar o projeto em um cluster recém-criado, consulte as instruções no [guia do projeto](https://github.com/kubernetes-sigs/windows-operational-readiness/blob/main/README.md).

## Ferramentas de implantação

A ferramenta kubeadm ajuda você a implantar um cluster Kubernetes, fornecendo a camada de gerenciamento para gerenciá-lo, e nós para executar suas cargas de trabalho.

O projeto [cluster API](https://cluster-api.sigs.k8s.io/) do Kubernetes também fornece meios para automatizar a implantação de nós Windows.

## Canais de distribuição do Windows

Para uma explicação detalhada dos canais de distribuição do Windows, consulte a [documentação da Microsoft](https://docs.microsoft.com/pt-br/windows-server/get-started-19/servicing-channels-19).

Informações sobre os diferentes canais de serviço do Windows Server, incluindo seus modelos de suporte, podem ser encontradas em [Canais de serviço do Windows Server](https://docs.microsoft.com/pt-br/windows-server/get-started/servicing-channels-comparison).
