---
title: "Kubeadm"
weight: 10
no_list: true
content_type: concept
card:
  name: reference
  weight: 40
---

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px">O Kubeadm é uma ferramenta criada para fornecer o `kubeadm init` e o `kubeadm join` como "caminhos rápidos" de melhores práticas para criar clusters Kubernetes.

O kubeadm executa as ações necessárias para colocar um cluster minimamente viável em funcionamento, e foi projetado para se preocupar apenas com a inicialização e não com o provisionamento de máquinas. Da mesma forma, a instalação de vários complementos úteis, como o Kubernetes Dashboard, soluções de monitoramento e complementos específicos da nuvem, não está no escopo.

Em vez disso, esperamos que ferramentas de alto nível e mais personalizadas sejam construídas em cima do kubeadm e, idealmente, usando o kubeadm como base de todas as implantações torná mais fácil a criação de clusters em conformidade.

## Como instalar

Para instalar o kubeadm, consulte o [guia de instalação](/pt-br/docs/setup/production-environment/tools/kubeadm/install-kubeadm).

## {{% heading "whatsnext" %}}

* [kubeadm init](/pt-br/docs/reference/setup-tools/kubeadm/kubeadm-init) para inicializar um nó da camada de gerenciamento do Kubernetes 
* [kubeadm join](/pt-br/docs/reference/setup-tools/kubeadm/kubeadm-join) para inicializar um nó `worker` do Kubernetes e associá-lo ao cluster
* [kubeadm upgrade](/pt-br/docs/reference/setup-tools/kubeadm/kubeadm-upgrade) para atualizar um cluster Kubernetes para uma versão mais recente
* [kubeadm config](/pt-br/docs/reference/setup-tools/kubeadm/kubeadm-config) se você inicializou seu cluster usando o kubeadm v1.7.x ou inferior, para configurar seu cluster pelo `kubeadm upgrade`
* [kubeadm token](/pt-br/docs/reference/setup-tools/kubeadm/kubeadm-token) para gerenciar os tokens pelo `kubeadm join`
* [kubeadm reset](/pt-br/docs/reference/setup-tools/kubeadm/kubeadm-reset) para reverter quaisquer alterações feitas, neste host, pelo `kubeadm init` ou `kubeadm join`
* [kubeadm certs](/pt-br/docs/reference/setup-tools/kubeadm/kubeadm-certs) para gerenciar os certificados do Kubernetes
* [kubeadm kubeconfig](/pt-br/docs/reference/setup-tools/kubeadm/kubeadm-kubeconfig) para gerenciar arquivos kubeconfig
* [kubeadm version](/pt-br/docs/reference/setup-tools/kubeadm/kubeadm-version) para exibir a versão do kubeadm
* [kubeadm alpha](/pt-br/docs/reference/setup-tools/kubeadm/kubeadm-alpha) para visualizar um conjunto de recursos disponibilizados para coletar feedback da comunidade
