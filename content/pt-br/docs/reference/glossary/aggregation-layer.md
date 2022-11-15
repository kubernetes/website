---
title: Camada de Agregação
id: aggregation-layer
date: 2018-10-08
full_link: /pt-br/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/
short_description: >
  A camada de agregação permite que você instale APIs adicionais no estilo Kubernetes em seu cluster.

aka: 
tags:
- architecture
- extension
- operation
---
 A camada de agregação permite que você instale APIs adicionais no estilo Kubernetes em seu cluster.

<!--more-->

Depois de configurar o {{< glossary_tooltip text="Servidor da API do Kubernetes" term_id="kube-apiserver" >}} para [suportar APIs adicionais](/docs/tasks/extend-kubernetes/configure-aggregation-layer/), você pode adicionar objetos `APIService` para obter a URL da API adicional.
