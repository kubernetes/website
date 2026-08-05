---
title: "Serviços, balanceamento de carga e conectividade"
weight: 60
description: >
  Conceitos e recursos por trás da conectividade no Kubernetes.
---

## O modelo de rede do Kubernetes

O modelo de rede do Kubernetes é construído a partir de várias partes:

* Cada [pod](/docs/concepts/workloads/pods/) em um cluster recebe seu
  próprio endereço IP exclusivo em todo o cluster.

  * Um pod possui seu próprio namespace de rede privado que é compartilhado por
    todos os contêineres dentro do pod. Processos em execução em
    contêineres diferentes no mesmo pod podem se comunicar entre
    si através do `localhost`.

* A _rede de pods_ (também chamada de rede do cluster) gerencia a comunicação
  entre pods. Ela garante que (exceto por segmentação de rede intencional):

  * Todos os pods podem se comunicar com todos os outros pods, estejam eles
    no mesmo [nó](/docs/concepts/architecture/nodes/) ou em
    nós diferentes. Os pods podem se comunicar entre si
    diretamente, sem o uso de proxies ou tradução de endereços (NAT).

    No Windows, esta regra não se aplica a pods de rede do host.

  * Agentes em um nó (como daemons do sistema ou kubelet) podem
    se comunicar com todos os pods naquele nó.

* A API de [Service](/docs/concepts/services-networking/service/)
  permite que você forneça um endereço IP ou hostname estável (de longa duração) para um serviço implementado
  por um ou mais pods de backend, onde os pods individuais que compõem
  o serviço podem mudar ao longo do tempo.

  * O Kubernetes gerencia automaticamente
    objetos [EndpointSlice](/docs/concepts/services-networking/endpoint-slices/)
    para fornecer informações sobre os pods atualmente oferecendo suporte a um Service.

  * Uma implementação de proxy de serviço monitora o conjunto de objetos Service e
    EndpointSlice, e programa a camada de dados para rotear
    o tráfego de serviço para seus backends, usando APIs do sistema operacional ou
    provedor de nuvem para interceptar ou reescrever pacotes.

* A API de [Gateway](/docs/concepts/services-networking/gateway/)
  (ou sua predecessora, [Ingress](/docs/concepts/services-networking/ingress/))
  permite que você torne Services acessíveis a clientes que estão fora do cluster.

  * Um mecanismo mais simples, mas menos configurável, para entrada
    no cluster está disponível através do
    [`type: LoadBalancer`](/docs/concepts/services-networking/service/#loadbalancer)
    da API Service, ao usar um {{< glossary_tooltip term_id="cloud-provider">}} compatível.

* [NetworkPolicy](/docs/concepts/services-networking/network-policies) é uma API
  embutida do Kubernetes que permite controlar o tráfego entre pods, ou entre pods e
  o mundo externo.

Em sistemas de contêineres mais antigos, não havia conectividade automática
entre contêineres em hosts diferentes, e por isso era frequentemente necessário
criar explicitamente links entre contêineres, ou mapear portas
de contêineres para portas do host para torná-los acessíveis por contêineres em outros
hosts. Isso não é necessário no Kubernetes; o modelo do Kubernetes é que
os pods podem ser tratados de forma muito semelhante a VMs ou hosts físicos das
perspectivas de alocação de portas, nomenclatura, descoberta de serviços, balanceamento
de carga, configuração de aplicações e migração.

Apenas algumas partes deste modelo são implementadas pelo próprio Kubernetes.
Para as outras partes, o Kubernetes define as APIs, mas a
funcionalidade correspondente é fornecida por componentes externos, alguns
dos quais são opcionais:

* A configuração do namespace de rede do pod é gerenciada por software de nível de sistema que implementa a
  [Interface de Agente de Execução de Contêiner](/docs/concepts/containers/cri/).

* A própria rede de pods é gerenciada por uma
  [implementação de rede de pods](/docs/concepts/cluster-administration/addons/#networking-and-network-policy).
  No Linux, a maioria dos agentes de execução de contêineres usa a
  {{< glossary_tooltip text="Interface de Rede de Contêineres (CNI)" term_id="cni" >}}
  para interagir com a implementação de rede de pods, então essas
  implementações são frequentemente chamadas de _plugins CNI_.

* O Kubernetes fornece uma implementação padrão de proxy de serviço,
  chamada {{< glossary_tooltip term_id="kube-proxy">}}, mas algumas
  implementações de rede de pods usam seu próprio proxy de serviço que
  é mais fortemente integrado com o restante da implementação.

* NetworkPolicy geralmente também é implementado pela implementação de rede de pods.
  (Algumas implementações de rede de pods mais simples não
  implementam NetworkPolicy, ou um administrador pode optar por
  configurar a rede de pods sem suporte a NetworkPolicy. Nestes
  casos, a API ainda estará presente, mas não terá efeito.)

* Existem muitas [implementações de Gateway API](https://gateway-api.sigs.k8s.io/implementations/),
  algumas das quais são específicas para ambientes de nuvem particulares, algumas mais
  focadas em ambientes "bare metal", e outras mais genéricas.

## {{% heading "whatsnext" %}}

O tutorial [Conectando Aplicações com Services](/docs/tutorials/services/connect-applications-service/)
permite que você aprenda sobre Services e rede do Kubernetes com um exemplo prático.

[Conectividade do Cluster](/docs/concepts/cluster-administration/networking/) explica como configurar
a rede para o seu cluster, e também fornece uma visão geral das tecnologias envolvidas.