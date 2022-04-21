---
title: "Kubeadm"
weight: 10
no_list: true
content_type: conceito
card:
  name: reference
  weight: 40
---

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px">O Kubeadm é uma ferramenta criada para fornecer o `kubeadm init` e o `kubeadm join` como "caminhos rápidos" de melhores práticas para criar clusters Kubernetes.

O kubeadm executa as ações necessárias para colocar um cluster minimamente viável em funcionamento. Por propósito, ele se preocupa apenas com bootstrapping, não com provisionamento de máquinas. Da mesma forma, a instalação de vários complementos, como o Kubernetes Dashboard, soluções de monitoramento e complementos específicos da nuvem, não está no escopo.

Em vez disso, esperamos que ferramentas de nível superior e mais personalizadas sejam construídas sobre o kubeadm e, idealmente, o uso do kubeadm como base de todas as implantações facilitará a criação de clusters em conformidade.

## Como instalar

Para instalar o kubeadm, consulte o [guia de instalação](/pt-br/docs/setup/production-environment/tools/kubeadm/install-kubeadm).

## {{% heading "O que vem a seguir?" %}}

* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init) para inicializar um nó do plano de controle do Kubernetes 
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join) para inicializar um nó `worker` do Kubernetes e associá-lo ao cluster
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade) para atualizar um cluster Kubernetes para uma versão mais recente
* [kubeadm config](/docs/reference/setup-tools/kubeadm/kubeadm-config) se você inicializou seu cluster usando o kubeadm v1.7.x ou inferior, para configurar seu cluster para atualização do kubeadm `kubeadm upgrade`
* [kubeadm token](/docs/reference/setup-tools/kubeadm/kubeadm-token) para gerenciar os tokens para `kubeadm join`
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset) para reverter quaisquer alterações feitas neste host pelo `kubeadm init` ou `kubeadm join`
* [kubeadm certs](/docs/reference/setup-tools/kubeadm/kubeadm-certs) para gerenciar os certificados Kubernetes
* [kubeadm kubeconfig](/docs/reference/setup-tools/kubeadm/kubeadm-kubeconfig) para gerenciar arquivos kubeconfig
* [kubeadm version](/docs/reference/setup-tools/kubeadm/kubeadm-version) para exibir a versão kubeadm
* [kubeadm alpha](/docs/reference/setup-tools/kubeadm/kubeadm-alpha) para visualizar um conjunto de recursos disponibilizados para coletar feedback da comunidade
