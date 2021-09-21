---
title: kube-proxy
id: kube-proxy
date: 2018-04-12
full_link: /docs/reference/command-line-tools-reference/kube-proxy/
short_description: >
  `kube-proxy` é um _proxy_ de rede executado em cada nó do _cluster_.

aka:
tags:
- fundamental
- networking
---
 kube-proxy é um _proxy_ de rede executado em cada {{< glossary_tooltip text="nó" term_id="node" >}} no seu _cluster_,
implementando parte do conceito de {{< glossary_tooltip  text="serviço" term_id="service">}} do Kubernetes.

<!--more-->

[kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/)
mantém regras de rede nos nós. Estas regras de rede permitem a comunicação de rede com seus _pods_ a partir de sessões de rede dentro ou fora de seu _cluster_.

kube-proxy usa a camada de filtragem de pacotes do sistema operacional se houver uma e estiver disponível. Caso contrário, o kube-proxy encaminha o tráfego ele mesmo.
