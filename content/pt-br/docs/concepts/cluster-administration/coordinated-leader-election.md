---
title: Eleição de líder coordenada
content_type: concept
weight: 200
---

<!-- overview -->

{{< feature-state feature_gate_name="CoordinatedLeaderElection" >}}

O Kubernetes {{< skew currentVersion >}} inclui um recurso em beta (feature) que permite que os {{<
glossary_tooltip text="control plane" term_id="control-plane" >}} componentes
selecionem deterministicamente um líder por meio da _eleição de líder coordenada_ (coordinated leader election).
Isso é útil para satisfazer as restrições de divergência de versões (version skew) do Kubernetes durante as atualizações do cluster.
Atualmente, a única estratégia de seleção integrada (builtin) é a `OldestEmulationVersion`,
que prefere o líder com a menor versão de emulação, seguida pela
versão do binário, seguida pelo timestamp de criação.

## Habilitando a eleição de líder coordenada

Certifique-se de que o [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/) `CoordinatedLeaderElection` está habilitado
quando você iniciar o {{< glossary_tooltip text="API Server"
term_id="kube-apiserver" >}}: e que o grupo de API `coordination.k8s.io/v1beta1` está
habilitado.

Isso pode ser feito definindo as flags `--feature-gates="CoordinatedLeaderElection=true"` e
`--runtime-config="coordination.k8s.io/v1beta1=true"`.

## Configuração do componente

Desde que você tenha habilitado o feature gate `CoordinatedLeaderElection` _e_  
tenha o grupo de API `coordination.k8s.io/v1beta1` habilitado, os componentes compatíveis do control plane  
usam automaticamente as APIs LeaseCandidate e Lease para eleger um líder  
conforme necessário.  

Para o Kubernetes {{< skew currentVersion >}}, dois componentes do control plane  
(kube-controller-manager e kube-scheduler) usam automaticamente a eleição  
de líder coordenada quando o feature gate e o grupo de API estão habilitados.

## Seleção de líder para componentes do Kubernetes

O Kubernetes usa a [API Lease](/docs/concepts/architecture/leases/) para realizar a eleição de líder entre múltiplas instâncias do mesmo componente do control plane em um cluster de alta disponibilidade, como `kube-controller-manager` ou `kube-scheduler`.

Um [Lease](/docs/concepts/architecture/leases/) atua como um bloqueio distribuído leve (lightweight distributed lock), armazenado pelo [servidor de API do Kubernetes](/docs/reference/command-line-tools-reference/kube-apiserver/).
Todas as instâncias em execução de um componente observam (watch) ou leem periodicamente o objeto Lease relevante
para determinar qual instância está atuando atualmente como líder.

A [API Lease](/docs/reference/kubernetes-api/cluster-resources/lease-v1/) define campos
como:

`holderIdentity`
: a identidade (por exemplo: nome do pod ou string baseada no hostname) do líder atual.

`acquireTime`
: timestamp em que a liderança foi adquirida.

`renewTime`
: timestamp da renovação mais recente feita pelo líder.

`leaseDurationSeconds`
: o período de validade do lease (os candidatos devem esperar esse tempo mais um pequeno período de carência antes de tentar adquirir um lease expirado).

`leaseTransitions`
: contador de quantas vezes a liderança mudou de mãos.

Esses campos indicam qual instância detém a liderança e por quanto tempo essa liderança permanece válida.

Quando o [Lease](/docs/concepts/architecture/leases/) não existe ou expirou (tempo atual > `renewTime` + `leaseDurationSeconds`), as instâncias candidatas tentam atualizar o Lease com sua identidade. O Kubernetes depende de _controle de concorrência otimista_ por meio do `resourceVersion` do objeto: apenas uma atualização é bem-sucedida, devido à incompatibilidade de versão em tentativas concorrentes. A instância cuja atualização é aceita se torna a _líder_.

O Kubernetes usa a API [LeaseCandidate](/docs/reference/kubernetes-api/cluster-resources/lease-candidate-v1beta1/) 
para gerenciar as eleições de líder. Componentes do control plane, como `kube-controller-manager` e `kube-scheduler`, registram seu papel como candidatos criando objetos LeaseCandidate, que rastreiam todas as instâncias competindo pela liderança e carregam metadados incluindo a identidade do candidato, a versão do binário e a versão de emulação.

Durante uma eleição, os candidatos se coordenam por meio de um [Lease](/docs/concepts/architecture/leases/) compartilhado. 
O control plane do Kubernetes garante que apenas um candidato adquira com sucesso o [Lease](/docs/concepts/architecture/leases/) e assuma o papel de _líder_, enquanto todos os outros permanecem como seguidores. Se o _líder_ atual falhar em renovar o [Lease](/docs/concepts/architecture/leases/) dentro do período de timeout selecionado, os demais candidatos competem para adquirir a liderança e elegem um novo _líder_.

Uma vez eleito, o líder renova periodicamente seu Lease atualizando o campo `renewTime`

(por exemplo, realizando a renovação a cada `leaseDurationSeconds` ÷ 2, para evitar conflitos quando o [Lease](/docs/concepts/architecture/leases/) está prestes a expirar).
Enquanto as renovações ocorrerem antes que o lease expire, a instância líder atual mantém a liderança.
Se o líder travar, ficar inacessível ou parar de renovar o Lease, esse Lease expira. Outras instâncias saudáveis detectam o Lease expirado e iniciam uma nova eleição.

Este mecanismo garante que, mesmo que múltiplas réplicas de um componente possam estar em execução para estabilidade e recuperação, _apenas uma instância executa ativamente as tarefas de controle por vez_, enquanto as outras permanecem em espera, observando o Lease e prontas para assumir rapidamente, se necessário.
