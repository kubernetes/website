---
title: Gerenciador de controle de nuvem
id: cloud-controller-manager
date: 2018-04-12
full_link: /docs/concepts/architecture/cloud-controller/
short_description: >
  Componente da camada de gerenciamento que integra Kubernetes com provedores de nuvem de terceiros.
aka:
tags:
- core-object
- architecture
- operation
---

 Um componente da {{< glossary_tooltip text="camada de gerenciamento" term_id="control-plane" >}} do Kubernetes
 que incorpora a lógica de controle específica da nuvem. O gerenciador de controle de nuvem permite que você vincule seu
 _cluster_ na API do seu provedor de nuvem, e separar os componentes que interagem com essa plataforma de nuvem a partir de componentes que apenas interagem com seu cluster.

<!--more-->

Desassociando a lógica de interoperabilidade entre o Kubernetes e a infraestrutura de nuvem subjacente, o componente gerenciador de controle de nuvem permite que os provedores de nuvem desenvolvam e disponibilizem recursos em um ritmo diferente em comparação com o projeto principal do Kubernetes.
