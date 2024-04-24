---
title: sysctl
id: sysctl
date: 2019-02-12
full_link: /docs/tasks/administer-cluster/sysctl-cluster/
short_description: >
  Uma interface para obter e definir parâmetros do kernel Unix.

aka:
tags:
- tool
---
 `sysctl` é uma interface semi-padronizada para ler ou alterar os atributos do kernel Unix em execução.

<!--more-->

Em sistemas do tipo Unix, `sysctl` é tanto o nome da ferramenta que os administradores usam para visualizar e modificar essas configurações, quanto a chamada do sistema que a ferramenta usa.

Os {{< glossary_tooltip text="contêineres" term_id="container" >}} em execução e os plugins de rede podem depender dos valores definidos do `sysctl`.