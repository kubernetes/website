---
title: kube-scheduler
id: kube-scheduler
date: 2018-04-12
full_link: /docs/reference/generated/kube-scheduler/
short_description: >
  Componente da camada de gerenciamento que observa os _pods_ recém-criados sem nenhum nó atribuído, e seleciona um nó para executá-los.
aka:
tags:
- architecture
---
Componente da camada de gerenciamento que observa os _{{< glossary_tooltip term_id="pod" text="pods" >}}_ recém-criados sem nenhum {{< glossary_tooltip term_id="node" text="nó">}} atribuído, e seleciona um nó para executá-los.

<!--more-->

Os fatores levados em consideração para as decisões de agendamento incluem:
requisitos de recursos individuais e coletivos, hardware/software/política de restrições, especificações de afinidade e antiafinidade, localidade de dados, interferência entre cargas de trabalho, e prazos.
