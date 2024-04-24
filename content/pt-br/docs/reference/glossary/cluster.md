---
title: Cluster
id: cluster
date: 2020-08-03
full_link: 
short_description: >
  Um conjunto de servidores de processamento, também chamados de nós, que
  executam aplicações containerizadas. Todo cluster possui ao menos um servidor
  de processamento (worker node).

aka: 
tags:
- fundamental
- operation
---
Um conjunto de servidores de processamento, chamados
{{< glossary_tooltip text="nós" term_id="node" >}}, que executam aplicações
containerizadas. Todo cluster possui ao menos um servidor de processamento
(_worker node_).

<!--more-->
O(s) servidor(es) de processamento hospeda(m) os
{{< glossary_tooltip text="Pods" term_id="pod" >}}, que são componentes de uma
aplicação. A {{< glossary_tooltip text="camada de gerenciamento" term_id="control-plane" >}}
gerencia os nós de processamento e os Pods no cluster. Em ambientes de produção,
a camada de gerenciamento geralmente executa em múltiplos computadores e um
cluster geralmente executa múltiplos nós, fornecendo tolerância a falhas e alta
disponibilidade.
