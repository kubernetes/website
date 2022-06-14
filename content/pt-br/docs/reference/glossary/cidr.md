---
title: CIDR
id: cidr
date: 2019-11-12
full_link: 
short_description: >
  CIDR é uma notação para descrever blocos de endereços IP e é muito usada em várias configurações de rede.

aka:
tags:
- networking
---
CIDR (em inglês - Classless Inter-Domain Routing) é uma notação para descrever blocos de endereços IP e é muito usada em várias configurações de rede.

<!--more-->

No contexto do Kubernetes, cada {{< glossary_tooltip text="Nó" term_id="node" >}} recebe um intervalo de endereços IP através do endereço inicial e uma máscara de sub-rede usando CIDR. Isso permite que os Nodes atribuam a cada {{< glossary_tooltip text="Pod" term_id="pod" >}} um endereço IP exclusivo. Embora originalmente seja um conceito para IPv4, o CIDR também foi expandido para incluir IPv6.