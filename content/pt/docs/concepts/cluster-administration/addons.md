---
title: Instalando Addons
content_template: templates/concept
---

{{% capture overview %}}


Addons estendem a funcionalidade do Kubernetes.

Esta página lista alguns dos add-ons e links com suas respectivas instruções de instalação.

Os Add-ons de cada sessão são classificados em ordem alfabética - a ordem não implica qualquer status preferencial.

{{% /capture %}}


{{% capture body %}}

## Rede e Política de Rede


* [ACI](https://www.github.com/noironetworks/aci-containers) fornece rede integrada de contêineres e segurança de rede com a Cisco ACI.
* [Calico](https://docs.projectcalico.org/latest/getting-started/kubernetes/) é um provedor de políticas de rede e rede L3 seguro.
* [Canal](https://github.com/tigera/canal/tree/master/k8s-install) une Flannel e Calico, fornecendo rede e política de rede.
* [Cilium](https://github.com/cilium/cilium) é um plug-in de políticas de rede e rede L3 que pode impor políticas de HTTP / API / L7 de forma transparente. Tanto o modo de roteamento quanto o de sobreposição / encapsulamento são suportados.
* [CNI-Genie](https://github.com/Huawei-PaaS/CNI-Genie) permite que o Kubernetes se conecte facilmente a uma variedade de plugins CNI, como Calico, Canal, Flannel, Romana ou Weave.
* [Contiv](http://contiv.github.io) fornece um rede configurável (L3 nativa usando BGP, sobreposição usando vxlan, L2 clássico e Cisco-SDN / ACI) para vários casos de uso e uma estrutura rica de políticas de rede. O projeto Contiv é totalmente [open source](http://github.com/contiv). O script de [instalação](http://github.com/contiv/install) fornece opções de instalação com ou sem kubeadm.
* [Contrail](http://www.juniper.net/us/en/products-services/sdn/contrail/contrail-networking/), baseado no [Tungsten Fabric](https://tungsten.io), é um projeto open source, multi-cloud com uma rede virtualizada e com uma plataforma de gerenciamento de políticas de rede. O Contrail e o Tungsten Fabric estão integrados a sistemas de orquestração, como Kubernetes, OpenShift, OpenStack e Mesos, e fornecem modos de isolamento para máquinas virtuais, containers / pods e cargas em servidores físicos.
* [Flannel](https://github.com/coreos/flannel/blob/master/Documentation/kubernetes.md) é um provedor de rede de sobreposição que pode ser usado com o Kubernetes.
* [Knitter](https://github.com/ZTE/Knitter/) é uma solução de rede que suporta múltiplas redes no Kubernetes.
* [Multus](https://github.com/Intel-Corp/multus-cni) é um plugin Multi para suporte a várias redes no Kubernetes para suportar todos os plugins CNI (por exemplo, Calico, Cilium, Contiv, Flannel), além das cargas de trabalho baseadas em SRIOV, DPDK, OVS-DPDK e VPP no Kubernetes.
* [NSX-T](https://docs.vmware.com/en/VMware-NSX-T/2.0/nsxt_20_ncp_kubernetes.pdf) O Plugin de contêiner (NCP) fornece integração entre o VMware NSX-T e orquestradores de contêineres como o Kubernetes, além da integração entre o NSX-T e as plataformas CaaS / PaaS baseadas em contêiner, como Pivotal Container Service (PKS) e OpenShift.
* [Nuage](https://github.com/nuagenetworks/nuage-kubernetes/blob/v5.1.1-1/docs/kubernetes-1-installation.rst) é uma plataforma SDN que fornece uma rede baseada em políticas entre os Pods Kubernetes e os ambientes não-Kubernetes, com visibilidade e monitoramento de segurança.
* [Romana](http://romana.io) é uma solução de rede Camada 3 para redes de pods que também suporta [NetworkPolicy API](/docs/concepts/services-networking/network-policies/). Detalhes da instalação do add-on Kubeadm disponíveis [aqui](https://github.com/romana/romana/tree/master/containerize).
* [Weave Net](https://www.weave.works/docs/net/latest/kube-addon/) fornece rede e política de rede, continuará trabalhando em ambos os lados de uma partição de rede e não requer um banco de dados externo.

## Descoberta de Serviço

* [CoreDNS](https://coredns.io) é um servidor DNS flexível e extensível que pode ser [instalado](https://github.com/coredns/deployment/tree/master/kubernetes) como DNS dentro do cluster para ser utilizado por pods.

## Visualização &amp; Controle

* [Dashboard](https://github.com/kubernetes/dashboard#kubernetes-dashboard) é uma interface web para gestão do Kubernetes.
* [Weave Scope](https://www.weave.works/documentation/scope-latest-installing/#k8s) é uma ferramenta gráfica para visualizar  contêineres, pods, serviços etc. Use-o em conjunto com o [Weave Cloud account](https://cloud.weave.works/) ou hospede você mesmo a interface do usuário.

## A infraestrutura

* [KubeVirt](https://kubevirt.io/user-guide/docs/latest/administration/intro.html#cluster-side-add-on-deployment) é um add-on para executar máquinas virtuais no Kubernetes. É geralmente executado em clusters em maquina fisica.


## Add-ons Legado

Existem vários outros complementos documentados no diretório não mais ultilizados [cluster/addons](https://git.k8s.io/kubernetes/cluster/addons).

Projetos bem mantidos deveriam ser linkados aqui. PRs são bem vindas!

{{% /capture %}}
