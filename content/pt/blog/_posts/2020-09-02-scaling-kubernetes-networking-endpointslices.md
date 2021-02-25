---
layout: blog
title: 'Escalando a rede do Kubernetes com EndpointSlices'
date: 2020-09-02
slug: scaling-kubernetes-networking-with-endpointslices
---

**Autor:** Rob Scott (Google)

EndpointSlices é um novo tipo de API que provê uma alternativa escalável e extensível à API de Endpoints. EndpointSlices mantém o rastreio dos endereços IP, portas, informações de topologia e prontidão de Pods que compõem um serviço.

No Kubernetes 1.19 essa funcionalidade está habilitada por padrão, com o kube-proxy lendo os  [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/) ao invés de Endpoints. Apesar de isso ser uma mudança praticamente transparente, resulta numa melhoria notável de escalabilidade em grandes clusters. Também permite a adição de novas funcionalidades em releases futuras do Kubernetes, como o [Roteamento baseado em topologia.](/docs/concepts/services-networking/service-topology/).

## Limitações de escalabilidade da API de Endpoints
Na API de Endpoints, existia apenas um recurso de Endpoint por serviço (Service). Isso significa que
era necessário ser possível armazenar endereços IPs e portas para cada Pod que compunha o serviço correspondente. Isso resultava em recursos imensos de API. Para piorar, o kube-proxy rodava em cada um dos nós e observava qualquer alteração nos recursos de Endpoint. Mesmo que fosse uma simples mudança em um Endpoint, todo o objeto precisava ser enviado para cada uma das instâncias do kube-proxy.

Outra limitação da API de Endpoints era que ela limitava o número de objetos que podiam ser associados a um _Service_. O tamanho padrão de um objeto armazenado no etcd é 1.5MB. Em alguns casos, isso poderia limitar um Endpoint a 5,000 IPs de Pod. Isso não chega a ser um problema para a maioria dos usuários, mas torna-se um problema significativo para serviços que se aproximem desse tamanho.

Para demonstrar o quão significante se torna esse problema em grande escala, vamos usar de um simples exemplo: Imagine um _Service_ que possua 5,000 Pods, e que possa causar o Endpoint a ter 1.5Mb . Se apenas um Endpoint nessa lista sofra uma alteração, todo o objeto de Endpoint precisará ser redistribuído para cada um dos nós do cluster. Em um cluster com 3.000 nós, essa atualização causará o envio de 4.5Gb de dados (1.5Mb de Endpoints * 3,000 nós) para todo o cluster. Isso é quase que o suficiente para encher um DVD, e acontecerá para cada mudança de Endpoint. Agora imagine uma atualização gradual em um _Deployment_ que resulte nos 5,000 Pods serem substituídos - isso é mais que 22Tb (ou 5,000 DVDs) de dados transferidos.

## Dividindo os endpoints com a API de EndpointSlice
A API de EndpointSlice foi desenhada para resolver esse problema com um modelo similar de _sharding_. Ao invés de rastrar todos os IPs dos Pods para um _Service_, com um único recurso de Endpoint, nós dividimos eles em múltiplos EndpointSlices menores.

Usemos por exemplo um serviço com 15 pods. Nós teríamos um único recurso de Endpoints referente a todos eles. Se o EndpointSlices for configurado para armazenar 5 _endpoints_ cada, nós teríamos 3 EndpointSlices diferentes:
![EndpointSlices](/images/blog/2020-09-02-scaling-kubernetes-networking-endpointslices/endpoint-slices.png)

Por padrão, o EndpointSlices armazena um máximo de 100 _endpoints_ cada, podendo isso ser configurado com a flag `--max-endpoints-per-slice` no kube-controller-manager.

## EndpointSlices provê uma melhoria de escalabilidade em 10x
Essa API melhora dramaticamente a escalabilidade da rede. Agora quando um Pod é adicionado ou removido, apenas 1 pequeno EndpointSlice necessita ser atualizado. Essa diferença começa a ser notada quando centenas ou milhares de Pods compõem um único _Service_.

Mais significativo, agora que todos os IPs de Pods para um _Service_ não precisam ser armazenados em um único recurso, nós não precisamos nos preocupar com o limite de tamanho para objetos armazendos no etcd. EndpointSlices já foram utilizados para escalar um serviço além de 100,000 endpoints de rede.

Tudo isso é possível com uma melhoria significativa de performance feita no kube-proxy. Quando o EndpointSlices é usado em grande escala, muito menos data será transferida para as atualizações de endpoints e o kube-proxy torna-se mais rápido para atualizar regras do iptables ou do ipvs. Além disso, os _Services_ podem escalar agora para pelo menos 10x mais além dos limites anteriores.

## EndpointSlices permitem novas funcionalidades
Introduzido como uma funcionalidade alpha no Kubernetes v1.16, os EndpointSlices foram construídos para permitir algumas novas funcionalidades arrebatadoras em futuras versões do Kubernetes. Isso inclui serviços dual-stack, roteamento baseado em topologia e subconjuntos de _endpoints_.

Serviços Dual-stack são uma nova funcionalidade que foi desenvolvida juntamente com o EndpointSlices. Eles irão utilizar simultâneamente endereços IPv4 e IPv6 para serviços, e dependem do campo addressType do Endpointslices para conter esses novos tipos de endereço por família de IP.

O roteamento baseado por topologia irá atualizar o kube-proxy para dar preferência no roteamento de requisições para a mesma região ou zona, utilizando-se de campos de topologia armazenados em cada endpoint dentro de um EndpointSlice. Como uma melhoria futura disso, estamos explorando o potencial de subconjuntos de endpoint. Isso irá permitir o kube-proxy apenas observar um subconjunto de EndpointSlices. Por exemplo, isso pode ser compinado com o roteamento baseado em topologia e assim, o kube-proxy precisará observar apenas EndpointSlices contendo _endpoints_ na mesma zona. Isso irá permitir uma outra melhoria significativa de escalabilidade.

## O que isso significa para a API de Endpoints?
Apesar da API de EndpointSlice prover uma alternativa nova e escalável à API de Endpoints, a API de Endpoints continuará a ser considerada uma funcionalidade estável. A mudança mais significativa para a API de Endpoints envolve começar a truncar Endpoints que podem causar problemas de escalabilidade.

A API de Endpoints não será removida, mas muitas novas funcionalidades irão depender da nova API EndpointSlice. Para obter vantágem da funcionalidade e escalabilidade que os EndpointSlices provém, aplicações que hoje consomem a API de Endpoints devem considerar suportar EndpointSlices no futuro.
