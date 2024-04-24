---
title: Visão Geral da Administração de Cluster
content_type: concept
weight: 10
---

<!-- overview -->
A visão geral da administração de cluster é para qualquer um criando ou administrando um cluster Kubernetes. Assume-se que você tenha alguma familiaridade com os [conceitos](/docs/concepts/) centrais do Kubernetes.


<!-- body -->
## Planejando um cluster

Veja os guias em [Setup](/docs/setup/) para exemplos de como planejar, iniciar e configurar clusters Kubernetes. As soluções listadas neste artigo são chamadas *distros*.

Antes de escolher um guia, aqui estão algumas considerações.

- Você quer experimentar o Kubernetes no seu computador, ou você quer construir um cluster de alta  disponibilidade e multi-nós? Escolha as distros mais adequadas às suas necessidades.
- **Se você esta projetando para alta-disponibilidade**, saiba mais sobre configuração [clusters em múltiplas zonas](/docs/concepts/cluster-administration/federation/).
- Você usará **um cluster Kubernetes hospedado**, como [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/), ou **hospedará seu próprio cluster**?
- Seu cluster será **on-premises**, ou **in the cloud (IaaS)**? Kubernetes não suporta diretamente clusters híbridos. Em vez disso, você pode configurar vários clusters.
- **Se você estiver configurando um Kubernetes on-premisess**, considere qual [modelo de rede](/docs/concepts/cluster-administration/networking/) melhor se adequa.
- Você estará executando o Kubernetes em hardware **"bare metal"** ou em **máquinas virtuais (VMs)**?

- Você **quer apenas rodar um cluster**, ou você espera fazer **desenvolvimento ativo do código de projeto do Kubernetes**?  Se for a segunda opção, escolha uma distro mais ativa. Algumas distros fornecem apenas binários, mas oferecem uma maior variedade de opções.

- Familiarize-se com os [componentes](/docs/admin/cluster-components/) necessários para rodar um cluster.

Nota: Nem todas as distros são ativamente mantidas. Escolha as distros que foram testadas com uma versão recente do Kubernetes.

## Gerenciando um cluster

* [Gerenciando um cluster](/docs/tasks/administer-cluster/cluster-management/) descreve vários tópicos relacionados ao ciclo de vida de um cluster: criando um novo cluster,  atualizando o nó mestre e os nós de trabalho do cluster, executando manutenção de nó (por exemplo, atualizações de kernel) e atualizando a versão da API do Kubernetes de um cluster em execução.

* Aprender como [gerenciar um nó](/docs/concepts/nodes/node/).

* Aprender como configurar e gerenciar o [recurso de quota](/docs/concepts/policy/resource-quotas/) para um cluster compartilhado.

## Protegendo um cluster

* [Certificados](/docs/concepts/cluster-administration/certificates/) descreve as etapas para gerar certificados usando diferentes ferramentas.

* [Ambiente de Container Kubernetes](/docs/concepts/containers/container-environment-variables/) descreve o ambiente para contêineres gerenciados pelo Kubelet em um nó do Kubernetes.

* [Controlando Acesso a API Kubernetes API](/docs/reference/access-authn-authz/controlling-access/) descreve como configurar
a permissão para usuários e contas de serviço.

* [Autenticando](/docs/reference/access-authn-authz/authentication/) explica a autenticação no Kubernetes, incluindo as várias opções de autenticação.

* [Autorização](/docs/reference/access-authn-authz/authorization/) é separada da autenticação e controla como as chamadas HTTP são tratadas.

* [Usando Controladores de Admissão](/docs/reference/access-authn-authz/admission-controllers/) explica plug-ins que interceptam solicitações ao servidor da API do Kubernetes após autenticação e autorização.

* [Usando Sysctls em um Cluster Kubernetes](/docs/concepts/cluster-administration/sysctl-cluster/) descreve a um administrador como usar a ferramenta de linha de comando `sysctl` para definir os parâmetros do kernel.


* [Auditando](/docs/tasks/debug-application-cluster/audit/) 
descreve como interagir com os logs de auditoria do Kubernetes.

### Protegendo o kubelet
  * [Comunicação Master-Node ](/docs/concepts/architecture/master-node-communication/)
  * [TLS bootstrapping](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/)
  * [Autenticação/Autorização Kubelet](/docs/admin/kubelet-authentication-authorization/)

## Serviços Opcionais do Cluster

* [Integração DNS](/docs/concepts/services-networking/dns-pod-service/) descreve como resolver um nome DNS diretamente para um serviço do Kubernetes.

* [Logando e monitorando a atividade de cluster](/docs/concepts/cluster-administration/logging/) explica como o log funciona no Kubernetes e como implementá-lo.




