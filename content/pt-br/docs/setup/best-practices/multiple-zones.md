---
  title: Executando em múltiplas zonas
  weight: 20
  content_type: concept
---

<!-- overview -->

Esta página descreve a execução de Kubernetes através de múltiplas zonas.

<!-- body -->

## Contexto

Kubernetes é concebido para que um único aglomerado de Kubernetes possa funcionar através de múltiplas zonas de falha, tipicamente onde estas zonas se encaixam dentro de agrupamentos lógico chamada _região_. Os principais fornecedores de nuvens definem uma região como um conjunto de zonas de falha (também chamadas _zonas de disponibilidade_) que proporcionam um conjunto consistente de características: dentro de uma região, cada zona oferece o mesmo APIs e serviços.

As arquiteturas típicas de nuvens têm como objetivo minimizar a hipótese de uma falha em uma zona também prejudica os serviços noutra zona.

## Comportamento do plano de controle

Os [componentes do plano de controle](/docs/concepts/overview/components/#control-plane-components) suportam a execução como um pool de recursos intercambiáveis, replicados por
componente.

Ao implantar um plano de controle de cluster, coloque réplicas de componentes do plano de controle em várias zonas de falha. Se a disponibilidade for uma preocupação importante, selecione pelo menos três zonas de falha e replique cada componente individualmente do plano de controle (servidor de API, agendador, etcd, gerenciador do controlador de cluster) em pelo menos três zonas de falha. Se você estiver executando um gerenciador de controlador de nuvem, deverá também replicar isso em todas as zonas de falha que você selecionou.

{{< nota >}}
O Kubernetes não fornece resiliência entre zonas para o servidor de API em endpoints. Você pode usar várias técnicas para melhorar a disponibilidade para o servidor de API do cluster como DNS round-robin, registros SRV ou
uma solução de balanceamento de carga de terceiros com verificação de integridade.
{{< /nota >}}

## Comportamento do nó

Kubernetes espalha automaticamente os Pods para
recursos de carga de trabalho (tais como {{< glossary_tooltip text="Deployment" term_id="deployment" >}} ou {{{{< glossário_tooltip text="StatefulSet" termo_id="statefulset" >}}) através de diferentes nós em um cluster. Esta propagação ajuda
reduzir o impacto das falhas.

Quando os nós são iniciados, o kubelet em cada nó adiciona automaticamente {{< glossary_tooltip text="labels" term_id="label" >}} para o objeto Node que representa esse kubelet específico na API do Kubernetes. Esses rótulos podem incluir [informação sobre zonas](/docs/reference/labels-annotations-taints/#topologykubernetesiozone).

Se seu cluster abrange múltiplas zonas ou regiões, você pode usar rótulos de nó em conjunção com [Restrições de propagação de topologia de pod](/docs/concepts/workloads/pods/pod-topology-spread-constraints/) para controlar como os pods são distribuídos em seu cluster entre os domínios de falha: regiões, zonas e até nós específicos.
Essas dicas permitem que o {{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}} colocar Pods para melhor disponibilidade esperada, reduzindo o risco de uma falha afeta toda a sua carga de trabalho.

Por exemplo, você pode definir uma restrição para garantir que as 3 réplicas de um StatefulSet estão sendo executadas em zonas diferentes para cada um, sempre que possível. Você pode definir isso declarativamente sem definir explicitamente quais zonas de disponibilidade estão em uso para cada carga de trabalho.

### Distribuição de nós por zonas

O núcleo do Kubernetes não cria nós para você; você precisa fazer isso você mesmo, ou utilizar uma ferramenta como o [Cluster API](https://cluster-api.sigs.k8s.io/) para
gerir os nós para você.

Utilizando ferramentas como o Cluster API, é possível definir conjuntos de máquinas para executar como nós de trabalho para seu cluster em vários domínios de falha e regras para recuperar automaticamente o cluster em caso de interrupção do serviço de toda a zona.

## Atribuição manual de zonas para Pods

Você pode aplicar [restrições de selecção de nó](/docs/concepções/concepções/cheduling-eviction/assign-pod-node-node/#nodeselector) aos pods que você cria, bem como aos modelos de pod em recursos de carga de trabalho como Deployment, StatefulSet ou Job.

## Acesso de armazenamento para zonas

Quando são criados volumes persistentes, `PersistentVolumeLabel`, o [controlador de admissão](/docs/reference/access-authn-authz/admission-controllers/) adiciona automaticamente etiquetas de zona a quaisquer Volumes Persistentes que estejam ligados a um
zona. O {{{{< glossário_tooltip text="scheduler" term_id="kube-scheduler" >}} garante então, através do seu atributo `NoVolumeZoneConflict`, que os pods que reivindicam um determinados volumes persistentes sejam colocados apenas na mesma zona que esse volume.

Resultados de tradução
Você pode especificar um {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}} para o PersistentVolumeClaims que especifica os domínios de falha (zonas) que o armazenamento nessa classe pode ser utilizado. Para saber como configurar um StorageClass que reconhece domínios ou zonas de falha,
consulte [topologias permitidas](/docs/concepts/storage/storage-classes/#allowed-topologies).

## Rede

Por si só, o Kubernetes não inclui rede com reconhecimento de zona. Você pode usar um [plug-in de rede](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) para configurar a rede de cluster e essa solução de rede pode ter elementos. Por exemplo, se seu provedor de nuvem oferece suporte a Serviços com `type=LoadBalancer`, o balanceador de carga só pode enviar tráfego para Pods em execução no mesma zona que o elemento do balanceador de carga processando uma determinada conexão. Verifique a documentação do seu provedor de nuvem para obter detalhes.

Para implantações personalizadas ou locais, aplicam-se considerações semelhantes comportamentos. {{< glossary_tooltip text="Service" term_id="service" >}} e {{< glossary_tooltip text="Ingress" term_id="ingress" >}}, incluindo manipulação de diferentes zonas de falha, varia dependendo exatamente de como seu cluster está configurado.

## Recuperação de falhas

Ao configurar seu cluster, talvez seja necessário considerar se e como sua configuração pode restaurar o serviço se todas as zonas de falha em uma região estiver off-line ao mesmo tempo. Por exemplo, você confia em haver pelo menos um nó capaz de executar Pods em uma zona? Certifique-se de que qualquer trabalho de reparo crítico do cluster não dependa em haver pelo menos um nó íntegro em seu cluster. Por exemplo: se todos os nós não são saudáveis, talvez seja necessário executar um trabalho de reparo com um {{< glossary_tooltip text="toleration" term_id="toleration" >}} para que o reparo pode completar o suficiente para colocar pelo menos um nó em serviço.

O Kubernetes não vem com uma resposta para esse desafio; porém, é algo a considerar.

## {{% heading "whatsnext" %}}

Para saber como o agendador coloca os pods em um cluster, respeitando as restrições configuradas,
visite [Agendamento e exclusão](/docs/concepts/scheduling-eviction/).
