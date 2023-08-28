---
title: kube-scheduler
id: kube-scheduler
date: 2018-04-12
full_link: /docs/reference/generated/kube-scheduler/
short_description: >
  Componente da camada de gerenciamento que observa os Pods recém-criados e que
  ainda não foram atribuídos a um nó, e seleciona um nó para executá-los.
aka:
tags:
- architecture
---
Componente da camada de gerenciamento que observa os
{{< glossary_tooltip term_id="pod" text="Pods" >}} recém-criados e que ainda não
foram atribuídos a um {{< glossary_tooltip term_id="node" text="nó">}}, e
seleciona um nó para executá-los.

<!--more-->

Os fatores levados em consideração para as decisões de alocação incluem:
requisitos de recursos individuais e coletivos, restrições de hardware/software/política,
especificações de afinidade e antiafinidade, localidade de dados, interferência
entre cargas de trabalho, e prazos.
