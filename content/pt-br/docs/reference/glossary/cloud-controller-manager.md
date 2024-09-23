---
title: Gerenciador de Controladores Integrados com a Nuvem
id: cloud-controller-manager
date: 2018-04-12
full_link: /docs/concepts/architecture/cloud-controller/
short_description: >
  Componente da camada de gerenciamento que integra Kubernetes com provedores de nuvem de
  terceiros.
aka:
tags:
- core-object
- architecture
- operation
---
O cloud-controller-manager é um componente da {{< glossary_tooltip text="camada de gerenciamento" term_id="control-plane" >}}
do Kubernetes que incorpora a lógica de controle específica de um provedor de nuvem. O
gerenciador de controladores integrados com a nuvem permite que você vincule seu _cluster_
na API do seu provedor de nuvem, e separa os componentes que interagem com essa plataforma
de nuvem dos componentes que interagem apenas com o seu cluster.

<!--more-->

Ao desassociar a lógica de interoperabilidade entre o Kubernetes e a infraestrutura da
nuvem subjacente, o componente cloud-controller-manager permite que os provedores de nuvem
desenvolvam e disponibilizem recursos em um ritmo diferente em comparação com o projeto
principal do Kubernetes.

