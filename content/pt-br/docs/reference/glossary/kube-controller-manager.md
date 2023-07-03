---
title: kube-controller-manager
id: kube-controller-manager
date: 2018-04-12
full_link: /docs/reference/command-line-tools-reference/kube-controller-manager/
short_description: >
  Componente da camada de gerenciamento que executa os processos de controle.

aka:
tags:
- architecture
- fundamental
---
Componente da camada de gerenciamento que executa os processos de
{{< glossary_tooltip text="controlador" term_id="controller" >}}.

<!--more-->

Logicamente, cada {{< glossary_tooltip text="controlador" term_id="controller" >}}
está em um processo separado, mas para reduzir a complexidade, eles todos são
compilados num único binário e executam em um processo único.
