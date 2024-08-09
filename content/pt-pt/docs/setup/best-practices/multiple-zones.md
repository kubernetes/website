---
title: Executar em várias zonas
weight: 20
content_type: conceito
---

<!-- overview -->

Esta página descreve a execução do Kubernetes em várias zonas.

<!-- body -->

## Contexto

O Kubernetes é projetado para que um único cluster do Kubernetes possa ser executado
em várias zonas de falha, tipicamente onde estas zonas se encaixam dentro
de um agrupamento lógico chamado _região_. Os principais fornecedores de nuvem definem uma região
como um conjunto de zonas de falha (também chamadas _zonas de disponibilidade_) que fornecem
um conjunto consistente de funcionalidades: dentro de uma região, cada zona oferece os mesmos
APIs e serviços.

As arquiteturas típicas de nuvem visam minimizar a probabilidade de que uma falha numa
zona também prejudique serviços noutra zona.

## Comportamento do plano de controlo

Todos os [componentes do plano de controlo](/docs/concepts/overview/components/#control-plane-components)
suportam ser executados como um conjunto de recursos intercambiáveis, replicados por
componente.

Quando implementa um plano de controlo do cluster, coloque réplicas dos
componentes do plano de controlo em várias zonas de falha. Se a disponibilidade é
uma preocupação importante, selecione pelo menos três zonas de falha e replique
cada componente individual do plano de controlo (servidor API, agendador, etcd,
gestor do controlador do cluster) em pelo menos três zonas de falha.
Se está a executar um gestor de controlador de nuvem, então deve
também replicar isto através de todas as zonas de falha que selecionou.

{{< note >}}
O Kubernetes não fornece resiliência entre zonas para os endpoints do servidor API.
Pode usar várias técnicas para melhorar a disponibilidade para
o servidor API do cluster, incluindo DNS round-robin, registos SRV, ou
uma solução de balanceamento de carga de terceiros com verificação de saúde.
{{< /note >}}

## Comportamento do nó

O Kubernetes espalha automaticamente os Pods para
recursos de carga de trabalho (como {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
ou {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}})
por diferentes nós num cluster. Este espalhamento ajuda
a reduzir o impacto de falhas.

Quando os nós iniciam, o kubelet em cada nó adiciona automaticamente
{{< glossary_tooltip text="etiquetas" term_id="label" >}} ao objeto Node
que representa esse kubelet específico na API do Kubernetes.
Estas etiquetas podem incluir
[informação de zona](/docs/reference/labels-annotations-taints/#topologykubernetesiozone).

Se o seu cluster abrange várias zonas ou regiões, pode usar etiquetas de nó
em conjunto com
[restrições de espalhamento de topologia de Pod](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
para controlar como os Pods são espalhados pelo seu cluster entre domínios de falha:
regiões, zonas e até nós específicos.
Estas dicas permitem ao
{{< glossary_tooltip text="agendador" term_id="kube-scheduler" >}} colocar
Pods para uma melhor disponibilidade esperada, reduzindo o risco de que uma falha correlacionada
afete toda a sua carga de trabalho.

Por exemplo, pode definir uma restrição para garantir que as
3 réplicas de um StatefulSet estão todas a correr em zonas diferentes entre si,
sempre que isso for viável. Pode definir isto declarativamente
sem definir explicitamente quais zonas de disponibilidade estão em uso para
cada carga de trabalho.

### Distribuir nós por zonas

O núcleo do Kubernetes não cria nós para si; precisa de fazer isso por si mesmo,
ou usar uma ferramenta como a [Cluster API](https://cluster-api.sigs.k8s.io/) para
gerir nós em seu nome.

Usando ferramentas como a Cluster API, pode definir conjuntos de máquinas para funcionar como
nós trabalhadores para o seu cluster em vários domínios de falha, e regras para
curar automaticamente o cluster em caso de interrupção do serviço em toda a zona.

## Atribuição manual de zona para Pods

Pode aplicar [restrições de seletor de nó](/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
a Pods que cria, bem como a modelos de Pod em recursos de carga de trabalho
como Deployment, StatefulSet ou Job.

## Acesso a armazenamento por zonas

Quando os volumes persistentes são criados, o Kubernetes adiciona automaticamente etiquetas de zona
a quaisquer PersistentVolumes que estão ligados a uma zona específica.
O {{< glossary_tooltip text="agendador" term_id="kube-scheduler" >}} garante, então,
através do seu predicado `NoVolumeZoneConflict`, que os pods que reivindicam um determinado PersistentVolume
são apenas colocados na mesma zona que esse volume.

Por favor, note que o método de adicionar etiquetas de zona pode depender do seu
fornecedor de nuvem e do provisionador de armazenamento que está a usar. Consulte sempre a documentação específica
para o seu ambiente para garantir a configuração correta.

Pode especificar uma {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}}
para PersistentVolumeClaims que especifica os domínios de falha (zonas) que o
armazenamento dessa classe pode usar.
Para aprender sobre a configuração de uma StorageClass ciente de domínios de falha ou zonas,
veja [Topologias permitidas](/docs/concepts/storage/storage-classes/#allowed-topologies).

## Rede

Por si só, o Kubernetes não inclui rede ciente de zonas. Pode usar um
[plugin de rede](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
para configurar a rede do cluster, e essa solução de rede pode ter elementos específicos de zona. Por exemplo, se o seu fornecedor de nuvem suporta Serviços com
`type=LoadBalancer`, o balanceador de carga pode apenas enviar tráfego para Pods que estão a correr na mesma zona que o elemento do balanceador de carga que processa uma determinada conexão.
Consulte a documentação do seu fornecedor de nuvem para detalhes.

Para implementações personalizadas ou locais, considerações semelhantes aplicam-se.
{{< glossary_tooltip text="Serviço" term_id="service" >}} e
{{< glossary_tooltip text="Ingress" term_id="ingress" >}} comportamento, incluindo tratamento
de diferentes zonas de falha, varia dependendo de exatamente como o seu cluster está configurado.

## Recuperação de falhas

Quando configura o seu cluster, também pode precisar de considerar se e como
a sua configuração pode restaurar o serviço se todas as zonas de falha numa região
ficarem offline ao mesmo tempo. Por exemplo, depende de haver pelo menos
um nó capaz de executar Pods numa zona?  
Certifique-se de que qualquer trabalho de reparação crítico para o cluster não depende
de haver pelo menos um nó saudável no seu cluster. Por exemplo: se todos os nós
estão não saudáveis, talvez precise de executar um trabalho de reparação com uma
{{< glossary_tooltip text="tolerância" term_id="toleration" >}} especial para que o reparo
possa completar o suficiente para trazer pelo menos um nó em serviço.

O Kubernetes não vem com uma resposta para este desafio; no entanto, é
algo a considerar.

## {{% heading "whatsnext" %}}

Para aprender como o agendador coloca Pods num cluster, honrando as restrições configuradas,
visite [Agendamento e Evicção](/docs/concepts/scheduling-eviction/).
