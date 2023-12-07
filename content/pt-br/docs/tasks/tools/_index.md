---
title: "Instale as ferramentas"
description: Configure as ferramentas do Kubernetes no seu computador.
weight: 10
no_list: true
---

## kubectl

<!-- overview -->
A ferramenta de linha de comando do Kubernetes, [kubectl](/docs/reference/kubectl/kubectl/), permite que você execute comandos nos clusters Kubernetes. 
Você pode usar o kubectl para instalar aplicações, inspecionar e gerenciar recursos de cluster e visualizar os logs. 
Para obter mais informações, incluindo uma lista completa de operações kubectl, consulte a [documentação de referência `kubectl`](/docs/reference/kubectl/).

Kubectl é instalável em uma variedade de plataformas tais como Linux, macOS e Windows. 
Encontre seu sistema operacional preferido abaixo.

- [Instale o kubectl no Linux](/pt-br/docs/tasks/tools/install-kubectl-linux)
- [Instale o kubectl no macOS](/docs/tasks/tools/install-kubectl-macos)
- [Instale o kubectl no Windows](/docs/tasks/tools/install-kubectl-windows)

## kind

O [`kind`](https://kind.sigs.k8s.io/) permite que você execute o Kubernetes no seu computador local. 
Esta ferramenta requer que você tenha o [Docker](https://docs.docker.com/get-docker/) instalado e configurado.

A página de [Início Rápido](https://kind.sigs.k8s.io/docs/user/quick-start/) mostra o que você precisa fazer para começar a trabalhar com o `kind`.

<a class="btn btn-primary" href="https://kind.sigs.k8s.io/docs/user/quick-start/" role="button" aria-label="Acesse o guia de início rápido do kind">Acesse o guia de início rápido do kind</a>

## minikube

Assim como o `kind`, o [`minikube`](https://minikube.sigs.k8s.io/) é uma ferramenta que permite executar o Kubernetes localmente. 
O `minikube` executa um cluster Kubernetes local com tudo-em-um ou com vários nós no seu computador pessoal (incluindo PCs Windows, macOS e Linux) para que você possa experimentar o Kubernetes ou para o trabalho de desenvolvimento diário.

Você pode seguir o [guia de início oficial](https://minikube.sigs.k8s.io/docs/start/) se o seu foco é instalar a ferramenta.

<a class="btn btn-primary" href="https://minikube.sigs.k8s.io/docs/start/" role="button" aria-label="Acesse o guia de início">Acesse o guia de início</a>

Depois de instalar o `minikube`, você pode usá-lo para executar uma [aplicação exemplo](/pt-br/docs/tutorials/hello-minikube/).

## kubeadm

Você pode usar a ferramenta {{< glossary_tooltip term_id="kubeadm" text="kubeadm" >}} para criar e gerenciar clusters Kubernetes. 
Ela executa as ações necessárias para obter um cluster mínimo viável e seguro em funcionamento de maneira amigável ao usuário.

[Instalando a ferramenta kubeadm](/pt-br/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) mostra como instalar o kubeadm. 
Uma vez instalado, você pode usá-lo para [criar um cluster](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).

<a class="btn btn-primary" href="/pt-br/docs/setup/production-environment/tools/kubeadm/install-kubeadm/" role="button" aria-label="Acesse o guia instalando a ferramenta kubeadm">Acesse o guia instalando a ferramenta kubeadm</a>
