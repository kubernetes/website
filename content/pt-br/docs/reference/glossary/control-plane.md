---
title: Camada de gerenciamento
id: control-plane
date: 2020-04-19
full_link:
short_description: >
  A camada de gerenciamento de contêiner que expõe a API e as interfaces para definir, implantar e gerenciar o ciclo de vida dos contêineres.

aka:
tags:
- fundamental
---
 A camada de gerenciamento de contêiner que expõe a API e as interfaces para definir, implantar e gerenciar o ciclo de vida dos contêineres.

<!--more-->

Esta camada é composta por muitos componentes diferentes, tais como (mas não limitados a):

 * {{< glossary_tooltip text="etcd" term_id="etcd" >}}
 * {{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}}
 * {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}
 * {{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}}
 * {{< glossary_tooltip text="cloud-controller-manager" term_id="cloud-controller-manager" >}}

Estes componentes podem ser executados como serviços tradicionais do sistema operacional (_daemons_) ou como contêineres. Os servidores que executam estes componentes eram historicamente chamados {{< glossary_tooltip text="masters" term_id="master" >}}.
