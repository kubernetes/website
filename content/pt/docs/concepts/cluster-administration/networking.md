---
title: Conectividade do Cluster
content_type: concept
weight: 50
---

<!-- overview -->
Conectividade é uma parte central do Kubernetes, mas pode ser desafiador 
entender exatamente como é o seu funcionamento esperado. Existem 4 problemas
distintos em conectividade que devem ser tratados:

1. Comunicações contêiner-para-contêiner altamente acopladas: Isso é resolvido
   por {{< glossary_tooltip text="Pods" term_id="pod" >}} e comunicações através do `localhost`.
2. Comunicações pod-para-pod: Esse é o foco primário desse documento.
3. Comunicações pod-para-serviço (_service_): Isso é tratado em [Services](/docs/concepts/services-networking/service/).
4. Comunicações Externas-para-serviços: Isso é tratado em [services](/docs/concepts/services-networking/service/).

<!-- body -->

Kubernetes é basicamente o compartilhamento de máquinas entre aplicações. Tradicionalmente,
compartilhar máquinas requer a garantia de que duas aplicações não tentem utilizar
as mesmas portas. Coordenar a alocação de portas entre múltiplos desenvolvedores é 
muito dificil de fazer em escala e expõe os usuários a problemas em nível do cluster e 
fora de seu controle.

A alocação dinâmica de portas traz uma série de complicações para o sistema - toda
aplicação deve obter suas portas através de flags de configuração, os servidores de API 
devem saber como inserir números dinämicos de portas nos blocos de configuração, serviços
precisam saber como buscar um ao outro, etc. Ao invés de lidar com isso, o Kubernetes 
faz de uma maneira diferente.

## O modelo de conectividade e rede do Kubernetes

Todo `Pod` obtém seu próprio endereço IP. Isso significa que vocë não precisa 
criar links explícitos entre os `Pods` e vocë quase nunca terá que lidar com o
mapeamento de portas de contêineres para portas do host. Isso cria um modelo simples, 
retro-compatível onde os `Pods` podem ser tratados muito mais como VMs ou hosts 
físicos da perspectiva de alocação de portas, nomes, descobrimento de serviços 
(_service discovery_), balanceamento de carga, configuração de aplicações e migrações.

O Kubernetes impõe os seguintes requisitos fundamentais para qualquer implementação de 
rede (exceto qualquer política de segmentação intencional):
   * pods em um nó podem se comunicar com todos os pods em todos os nós sem usar _NAT_.
   * agentes em um nó (por exemplo o kubelet ou um serviço local) podem se comunicar com 
     todos os Pods naquele nó.

Nota: Para as plataformas que suportam `Pods` executando na rede do host (como o Linux):

   * pods alocados na rede do host de um nó podem se comunicar com todos os pods
     em todos os nós sem _NAT_.

Esse modelo não só é menos complexo, mas é principalmente compatível com o 
desejo do Kubernetes de permitir a portabilidade com baixo esforço de aplicações 
de VMs para contêineres. Se a sua aplicação executava anteriormente em uma VM, sua VM
possuía um IP e podia se comunicar com outras VMs no seu projeto. Esse é o mesmo 
modelo básico.

Os endereços de IP no Kubernetes existem no escopo do `Pod` - contêineres em um `Pod`
compartilham o mesmo _network namespace_ - incluíndo seu endereço de IP e MAC.
Isso significa que contêineres que compõem um `Pod` podem se comunicar entre eles 
através do endereço `localhost` e respectivas portas. Isso também significa que
contêineres em um mesmo `Pod` devem coordenar a alocação e uso de portas, o que não 
difere do modelo de processos rodando dentro de uma mesma VM. Isso é chamado de 
modelo "IP-por-pod".

Como isso é implementado é um detalhe do agente de execução de contêiner em uso.

É possível solicitar uma porta no nó que será encaminhada para seu `Pod` (chamado 
de _portas do host_), mas isso é uma operação muito específica. Como esse encaminhamento
é implementado é um detalhe do agente de execução do contêiner. O `Pod` mesmo 
desconhece a existência ou não de portas do host.

## Como implementar o modelo de conectividade do Kubernetes

Existe um número de formas de implementar esse modelo de conectividade. Esse 
documento não é um estudo exaustivo desses vários métodos, mas pode servir como 
uma introdução de várias tecnologias e serve como um ponto de início.

A conectividade no Kubernetes é fornecida através de plugins de 
{{< glossary_tooltip text="CNIs" term_id="cni" >}}

As seguintes opções estão organizadas alfabeticamente e não implicam preferência por
qualquer solução.

{{% thirdparty-content %}}

### Antrea

O projeto [Antrea](https://github.com/vmware-tanzu/antrea) é uma solução de 
conectividade para Kubernetes que pretende ser nativa. Ela utiliza o Open vSwitch 
na camada de conectividade de dados. O Open vSwitch é um switch virtual de alta 
performance e programável que suporta Linux e Windows. O Open vSwitch permite 
ao Antrea implementar políticas de rede do Kubernetes (_NetworkPolicies_) de 
uma forma muito performática e eficiente.

Graças à característica programável do Open vSwitch, o Antrea consegue implementar 
uma série de funcionalidades de rede e segurança.

### AWS VPC CNI para Kubernetes

O [AWS VPC CNI](https://github.com/aws/amazon-vpc-cni-k8s) oferece conectividade 
com o AWS Virtual Private Cloud (VPC) para clusters Kubernetes. Esse plugin oferece
alta performance e disponibilidade e baixa latência. Adicionalmente, usuários podem 
aplicar as melhores práticas de conectividade e segurança existentes no AWS VPC
para a construção de clusters Kubernetes. Isso inclui possibilidade de usar o 
_VPC flow logs_, políticas de roteamento da VPC e grupos de segurança para isolamento
de tráfego.

O uso desse plugin permite aos Pods no Kubernetes ter o mesmo endereço de IP dentro do 
pod como se eles estivessem dentro da rede do VPC. O CNI (Container Network Interface) 
aloca um _Elastic Networking Interface_ (ENI) para cada nó do Kubernetes e usa uma 
faixa de endereços IP secundário de cada ENI para os Pods no nó. O CNI inclui 
controles para pré alocação dos ENIs e endereços IP para um início mais rápido dos 
pods e permite clusters com até 2,000 nós.

Adicionalmente, esse CNI pode ser utilizado junto com o [Calico](https://docs.aws.amazon.com/eks/latest/userguide/calico.html)
para a criação de políticas de rede (_NetworkPolicies_). O projeto AWS VPC CNI
tem código fonte aberto com a [documentação no Github](https://github.com/aws/amazon-vpc-cni-k8s).

### Azure CNI para o Kubernetes
[Azure CNI](https://docs.microsoft.com/en-us/azure/virtual-network/container-networking-overview) é um
plugin de [código fonte aberto](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md) 
que integra os Pods do Kubernetes com uma rede virtual da Azure (também conhecida como VNet) 
provendo performance de rede similar à de máquinas virtuais no ambiente. Os Pods 
podem se comunicar com outras VNets e com ambientes _on-premises_ com o uso de 
funcionalidades da Azure, e também podem ter clientes com origem dessas redes. 
Os Pods podem acessar serviços da Azure, como armazenamento e SQL, que são 
protegidos por _Service Endpoints_ e _Private Link_. Você pode utilizar as políticas 
de segurança e roteamento para filtrar o tráfico do Pod. O plugin associa IPs da VNet 
para os Pods utilizando um pool de IPs secundário pré-configurado na interface de rede
do nó Kubernetes.

O Azure CNI está disponível nativamente no [Azure Kubernetes Service (AKS)](https://docs.microsoft.com/en-us/azure/aks/configure-azure-cni).

### Calico

[Calico](https://docs.projectcalico.org/) é uma solução de conectividade e 
segurança para contêineres, máquinas virtuais e serviços nativos em hosts. O 
Calico suporta múltiplas camadas de conectividade/dados, como por exemplo: 
uma camada Linux eBPF nativa, uma camada de conectividade baseada em conceitos 
padrão do Linux e uma camada baseada no HNS do Windows. O calico provê uma 
camada completa de conectividade e rede, mas também pode ser usado em conjunto com
[CNIs de provedores de nuvem](https://docs.projectcalico.org/networking/determine-best-networking#calico-compatible-cni-plugins-and-cloud-provider-integrations) 
para permitir a criação de políticas de rede.

### Cilium

[Cilium](https://github.com/cilium/cilium) é um software de código fonte aberto 
para prover conectividade e segurança entre contêineres de aplicação. O Cilium 
pode lidar com tráfego na camada de aplicação (ex. HTTP) e pode forçar políticas 
de rede nas camadas L3-L7 usando um modelo de segurança baseado em identidade e 
desacoplado do endereçamento de redes, podendo inclusive ser utilizado com outros
plugins CNI.

### Flannel

[Flannel](https://github.com/coreos/flannel#flannel) é uma camada muito simples 
de conectividade que satisfaz os requisitos do Kubernetes. Muitas pessoas 
reportaram sucesso em utilizar o Flannel com o Kubernetes.

### Google Compute Engine (GCE)

Para os scripts de configuração do Google Compute Engine, [roteamento
avançado](https://cloud.google.com/vpc/docs/routes) é usado para associar
para cada VM uma sub-rede (o padrão é `/24` - 254 IPs). Qualquer tráfico direcionado
para aquela sub-rede será roteado diretamente para a VM pela rede do GCE. Isso é 
adicional ao IP principal associado à VM, que é mascarado para o acesso à Internet.
Uma _brige_ Linux (chamada `cbr0`) é configurada para existir naquela sub-rede, e é
configurada no docker através da opção `--bridge`.

O Docker é iniciado com:


```shell
DOCKER_OPTS="--bridge=cbr0 --iptables=false --ip-masq=false"
```

Essa _bridge_ é criada pelo Kubelet (controlada pela opção `--network-plugin=kubenet`)
de acordo com a informação `.spec.podCIDR` do Nó.

O Docker irá agora alocar IPs do bloco `cbr-cidr`. Contêineres podem alcançar
outros contêineres e nós através da interface `cbr0`. Esses IPs são todos roteáveis
dentro da rede do projeto do GCE.

O GCE mesmo não sabe nada sobre esses IPs, então não irá mascará-los quando tentarem 
se comunicar com a internet. Para permitir isso uma regra de IPTables é utilizada para
mascarar o tráfego para IPs fora da rede do projeto do GCE (no exemplo abaixo, 10.0.0.0/8):

```shell
iptables -t nat -A POSTROUTING ! -d 10.0.0.0/8 -o eth0 -j MASQUERADE
```

Por fim, o encaminhamento de IP deve ser habilitado no Kernel de forma a processar
os pacotes vindos dos contêineres:

```shell
sysctl net.ipv4.ip_forward=1
```

O resultado disso tudo é que `Pods` agora podem alcançar outros `Pods` e podem também
se comunicar com a Internet.

### Kube-router

[Kube-router](https://github.com/cloudnativelabs/kube-router) é uma solução construída 
que visa prover alta performance e simplicidade operacional. Kube-router provê um 
proxy de serviços baseado no [LVS/IPVS](https://www.linuxvirtualserver.org/software/ipvs.html),
uma solução de comunicação pod-para-pod baseada em encaminhamento de pacotes Linux e sem camadas
adicionais, e funcionalidade de políticas de redes baseadas no IPTables/IPSet.

### Redes L2 e bridges Linux

Se você tem uma rede L2 "burra", como um switch em um ambiente "bare-metal",
você deve conseguir fazer algo similar ao ambiente GCE explicado acima.
Note que essas instruções foram testadas casualmente - parece funcionar, mas
não foi propriamente testado. Se você conseguir usar essa técnica e aperfeiçoar
o processo, por favor nos avise!!

Siga a parte _"With Linux Bridge devices"_ desse
[tutorial super bacana](https://blog.oddbit.com/2014/08/11/four-ways-to-connect-a-docker/) do
Lars Kellogg-Stedman.

### Multus (Plugin multi redes) {#multus}

[Multus](https://github.com/Intel-Corp/multus-cni) é um plugin Multi CNI para
suportar a funcionalidade multi redes do Kubernetes usando objetos baseados em {{< glossary_tooltip text="CRDs" term_id="CustomResourceDefinition" >}}. 

Multus suporta todos os  [plugins referência](https://github.com/containernetworking/plugins) (ex. [Flannel](https://github.com/containernetworking/plugins/tree/master/plugins/meta/flannel), 
[DHCP](https://github.com/containernetworking/plugins/tree/master/plugins/ipam/dhcp), 
[Macvlan](https://github.com/containernetworking/plugins/tree/master/plugins/main/macvlan)) 
que implementam a especificação de CNI e plugins de terceiros
(ex. [Calico](https://github.com/projectcalico/cni-plugin), [Weave](https://github.com/weaveworks/weave), 
[Cilium](https://github.com/cilium/cilium), [Contiv](https://github.com/contiv/netplugin)). 
Adicionalmente, Multus suporta cargas de trabalho no Kubernetes que necessitem de funcionalidades como 
[SRIOV](https://github.com/hustcat/sriov-cni), [DPDK](https://github.com/Intel-Corp/sriov-cni), 
[OVS-DPDK & VPP](https://github.com/intel/vhost-user-net-plugin). 

### OVN (Open Virtual Networking)

OVN é uma solução de virtualização de redes de código aberto desenvolvido pela 
comunidade Open vSwitch. Permite a criação de switches lógicos, roteadores lógicos, 
listas de acesso, balanceadores de carga e mais, para construir diferences topologias
de redes virtuais. Esse projeto possui um plugin específico para o Kubernetes e a 
documentação em [ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes).

## {{% heading "whatsnext" %}}

Design inicial do modelo de conectividade do Kubernetes e alguns planos futuros 
estão descritos com maiores detalhes no 
[documento de design de redes](https://git.k8s.io/community/contributors/design-proposals/network/networking.md).
