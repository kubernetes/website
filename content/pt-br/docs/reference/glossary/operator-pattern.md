---
title: Padrão Operador
id: operator-pattern
date: 2021-09-17
full_link: /pt-br/docs/concepts/extend-kubernetes/operator/
short_description: >
  Um controlador especializado que gerencia um recurso personalizado.

aka:
tags:
- architecture
---
 O [padrão Operador](/docs/concepts/extend-kubernetes/operator/) é um design de
sistema que vincula um {{< glossary_tooltip text="controlador" term_id="controller" >}}
a um ou mais recursos personalizados.

<!--more-->

Você pode estender a funcionalidade do Kubernetes adicionando controladores ao seu cluster,
além dos controladores que são distribuídos como parte do Kubernetes.

Se uma aplicação em execução age como um controlador e tem acesso à API para desempenhar 
tarefas em um recurso personalizado que está definido na camada de gerenciamento, este é
um exemplo do padrão Operador.
