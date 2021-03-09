---
title: API server
id: kube-apiserver
date: 2018-04-12
full_link: /docs/concepts/overview/components/#kube-apiserver
short_description: >
  O componente da camada de gerenciamento que serve a API do Kubernetes.

aka:
- kube-apiserver
tags:
- architecture
- fundamental
---
 O servidor de API é um componente da {{< glossary_tooltip text="Camada de gerenciamento" term_id="control-plane" >}} do Kubernetes que expõe a API do Kubernetes.
O servidor de API é o _front end_ para a camada de gerenciamento do Kubernetes.

<!--more-->

A principal implementação de um servidor de API do Kubernetes é [kube-apiserver](/docs/reference/generated/kube-apiserver/).
O kube-apiserver foi projetado para ser escalonado horizontalmente &mdash; ou seja, ele pode ser escalado com a implantação de mais instâncias.
Você pode executar várias instâncias do kube-apiserver e balancear (balanceamento de carga, etc) o tráfego entre essas instâncias.
