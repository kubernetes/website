---
reviewers:
title: Usando o CoreDNS para Descoberta de Serviços
min-kubernetes-server-version: v1.9
content_type: task
weight: 380
---

<!-- overview -->
Essa página descreve o processo de atualização do CoreDNS e como instalar o CoreDNS ao invés de kube-dns.


## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


<!-- steps -->

## Sobre o CoreDNS

[CoreDNS](https://coredns.io) é um servidor DNS flexível e extensível
que pode servir como Kubernetes cluster DNS.
Como o Kubernetes, o projeto CoreDNS é hospedado pelo
{{< glossary_tooltip text="CNCF" term_id="cncf" >}}.

Você pode usar o CoreDNS ao invés de kube-dns no seu cluster substituindo por
kube-dns em uma implantação existente, ou usando ferramentas como kubeadm
que fará a instalação e a atualização do cluster pra você.

## Instalando o CoreDNS

Para instalação manual, ou substituição do kube-dns, veja a documentação no 
[site do CoreDNS](https://coredns.io/manual/installation/).

## Migrando para CoreDNS

### Atualizando um cluster existente com kubeadm

No Kubernetes versão 1.21, kubeadm removeu o suporte para  `kube-dns` como uma aplicação DNS.
Para `kubeadm` v{{< skew currentVersion >}}, o único Cluster DNS suportado é o CoreDNS.

Você pode migrar para o CoreDNS quando usar o  `kubeadm` para atualizar o cluster que está usando 
`kube-dns`. Neste caso, `kubeadm` gera a configuração do CoreDNS
("Corefile") baseado no ConfigMap `kube-dns`, preservando a configuração para 
stub domains e upstream name server.

## Atualizando CoreDNS

Você pode verificar a versão do CoreDNS que o kubeadm instala para cada versão do Kubernetes na página 
[versão do CoreDNS no Kubernetes](https://github.com/coredns/deployment/blob/master/kubernetes/CoreDNS-k8s_version.md).

CoreDNS pode ser atualizado manualmente, caso você queria atualizar somente o CoreDNS
ou usar sua própria imagem customizada.
Há uma página de [instruções e passo-a-passo](https://github.com/coredns/deployment/blob/master/kubernetes/Upgrading_CoreDNS.md)
disponível para garantir uma atualização sem problemas.
Certifique-se que a configuração existente do CoreDNS ("Corefile") é mantida quando atualizar o seu cluster.

Se você está atualizando o seu cluster usando a ferramenta `kubeadm`, o `kubeadm`
pode cuidar da retenção da configuração existente do CoreDNS automaticamente.


## Ajustando o CoreDNS

Quando a utilização dos recursos é uma preocupação, pode ser útil ajustar a configuração do CoreDNS. Para mais detalhes, confira [documentação para escalonar o CoreDNS](https://github.com/coredns/deployment/blob/master/kubernetes/Scaling_CoreDNS.md).

## {{% heading "whatsnext" %}}

Você pode configurar o [CoreDNS](https://coredns.io) para suportar mais casos de uso do que o
kube-dns suporta modificando a configuração do CoreDNS ("Corefile").
Para mais informações, veja a [documentação](https://coredns.io/plugins/kubernetes/)
do plugin `kubernetes` do CoreDNS, ou leia o artigo
[Custom DNS Entries For Kubernetes](https://coredns.io/2017/05/08/custom-dns-entries-for-kubernetes/) (em inglês) no blog do CoreDNS.

