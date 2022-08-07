---
title: Instalando Complementos
content_type: concept
---

<!-- overview -->

{{% thirdparty-content %}}

Complementos estendem as funcionalidades do Kubernetes.

Esta página lista alguns dos complementos disponíveis e links com suas respectivas instruções de instalação.

<!-- body -->

## Rede e Política de Rede

* [ACI](https://www.github.com/noironetworks/aci-containers) fornece rede integrada de contêineres e segurança de rede com a Cisco ACI.
* [Antrea](https://antrea.io/) opera nas camadas 3 e 4 do modelo de rede OSI para fornecer serviços de rede e de segurança para o Kubernetes, aproveitando o Open vSwitch como camada de dados de rede.
* [Calico](https://docs.projectcalico.org/latest/introduction/) é um provedor de serviços de rede e de políticas de rede. Este complemento suporta um conjunto flexível de opções de rede, de modo a permitir a escolha da opção mais eficiente para um dado caso de uso, incluindo redes _overlay_ (sobrepostas) e não-_overlay_, com ou sem o uso do protocolo BGP. Calico usa o mesmo mecanismo para aplicar políticas de rede a hosts, pods, e aplicações na camada de _service mesh_ (quando Istio e Envoy estão instalados).
* [Canal](https://projectcalico.docs.tigera.io/getting-started/kubernetes/flannel/flannel) une Flannel e Calico, fornecendo rede e política de rede.
* [Cilium](https://github.com/cilium/cilium) é um plug-in de rede de camada 3 e de políticas de rede que pode aplicar políticas HTTP/API/camada 7 de forma transparente. Tanto o modo de roteamento quanto o de sobreposição/encapsulamento são suportados. Este plug-in também consegue operar no topo de outros plug-ins CNI.
* [CNI-Genie](https://github.com/cni-genie/CNI-Genie) permite que o Kubernetes se conecte facilmente a uma variedade de plug-ins CNI, como Calico, Canal, Flannel, Romana ou Weave.
* [Contiv](https://contivpp.io/) oferece serviços de rede configuráveis para diferentes casos de uso (camada 3 nativa usando BGP, _overlay_ (sobreposição) usando vxlan, camada 2 clássica e Cisco-SDN/ACI) e também um _framework_ rico de políticas de rede. O projeto Contiv é totalmente [open source](http://github.com/contiv). O [instalador](http://github.com/contiv/install) fornece opções de instalação com ou sem kubeadm.
* [Contrail](http://www.juniper.net/us/en/products-services/sdn/contrail/contrail-networking/) é uma plataforma open source baseada no [Tungsten Fabric](https://tungsten.io) que oferece virtualização de rede multi-nuvem e gerenciamento de políticas de rede. O Contrail e o Tungsten Fabric são integrados a sistemas de orquestração de contêineres, como Kubernetes, OpenShift, OpenStack e Mesos, e fornecem modos de isolamento para cargas de trabalho executando em máquinas virtuais, contêineres/pods e servidores físicos.
* [Flannel](https://github.com/flannel-io/flannel#deploying-flannel-manually) é um provedor de redes _overlay_ (sobrepostas) que pode ser usado com o Kubernetes.
* [Knitter](https://github.com/ZTE/Knitter/) é um plug-in para suporte de múltiplas interfaces de rede em Pods do Kubernetes.
* [Multus](https://github.com/k8snetworkplumbingwg/multus-cni) é um plugin para suporte a várias interfaces de rede em Pods no Kubernetes. Este plug-in pode agir como um "meta-plug-in", ou um plug-in CNI que se comunica com múltiplos outros plug-ins CNI (por exemplo, Calico, Cilium, Contiv, Flannel), além das cargas de trabalho baseadas em SRIOV, DPDK, OVS-DPDK e VPP no Kubernetes.
* [NSX-T](https://docs.vmware.com/en/VMware-NSX-T-Data-Center/index.html) Container Plug-in (NCP) fornece integração entre o VMware NSX-T e sistemas de orquestração de contêineres como o Kubernetes. Além disso, oferece também integração entre o NSX-T e as plataformas CaaS/PaaS baseadas em contêiner, como o Pivotal Container Service (PKS) e o OpenShift.
* [Nuage](https://github.com/nuagenetworks/nuage-kubernetes/blob/v5.1.1-1/docs/kubernetes-1-installation.rst) é uma plataforma de rede definida por software que fornece serviços de rede baseados em políticas entre os Pods do Kubernetes e os ambientes não-Kubernetes, com visibilidade e monitoramento de segurança.
* [OVN-Kubernetes](https://github.com/ovn-org/ovn-kubernetes/) é um provedor de rede para o Kubernetes baseado no [OVN (Open Virtual Network)](https://github.com/ovn-org/ovn/), uma implementação de redes virtuais que surgiu através do projeto Open vSwitch (OVS). O OVN-Kubernetes fornece uma implementação de rede baseada em _overlay_ (sobreposição) para o Kubernetes, incluindo uma implementação baseada em OVS para serviços de balanceamento de carga e políticas de rede.
* [OVN4NFV-K8S-Plugin](https://github.com/opnfv/ovn4nfv-k8s-plugin) é um plug-in controlador CNI baseado no OVN (Open Virtual Network) que fornece serviços de rede _cloud native_, como _Service Function Chaining_ (SFC), redes _overlay_ (sobrepostas) OVN múltiplas, criação dinâmica de subredes, criação dinâmica de redes virtuais, provedor de rede VLAN e provedor de rede direto, e é plugável a outros plug-ins multi-rede. Ideal para cargas de trabalho que utilizam computação de borda _cloud native_ em redes multi-cluster.
* [Romana](https://github.com/romana/romana) é uma solução de rede de camada 3 para redes de pods que também suporta a [API NetworkPolicy](/pt-br/docs/concepts/services-networking/network-policies/). Detalhes da instalação do complemento Kubeadm disponíveis [aqui](https://github.com/romana/romana/tree/master/containerize).
* [Weave Net](https://www.weave.works/docs/net/latest/kube-addon/) fornece rede e política de rede, funciona em ambos os lados de uma partição de rede e não requer um banco de dados externo.

## Descoberta de Serviço

* [CoreDNS](https://coredns.io) é um servidor DNS flexível e extensível que pode ser [instalado](https://github.com/coredns/deployment/tree/master/kubernetes) como o serviço de DNS dentro do cluster para ser utilizado por pods.

## Visualização &amp; Controle

* [Dashboard](https://github.com/kubernetes/dashboard#kubernetes-dashboard) é uma interface web para gestão do Kubernetes.
* [Weave Scope](https://www.weave.works/documentation/scope-latest-installing/#k8s) é uma ferramenta gráfica para visualizar contêineres, pods, serviços, entre outros objetos do cluster. Pode ser utilizado com uma [conta Weave Cloud](https://cloud.weave.works/). Como alternativa, é possível hospedar a interface do usuário por conta própria.

## Infraestrutura

* [KubeVirt](https://kubevirt.io/user-guide/#/installation/installation) é um complemento para executar máquinas virtuais no Kubernetes. É geralmente executado em clusters em máquina física.


## Complementos Legados

Existem vários outros complementos documentados no diretório [cluster/addons](https://git.k8s.io/kubernetes/cluster/addons) que não são mais utilizados.

Projetos bem mantidos devem ser listados aqui. PRs são bem-vindos!
