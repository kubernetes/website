---
title: StatefulSet
id: statefulset
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/statefulset/
short_description: >
  Gerencia deployment e escalonamento de um conjunto de Pods, com armazenamento durável e identificadores persistentes para cada Pod.

aka: 
tags:
- fundamental
- core-object
- workload
- storage
---
 Gerencia o deployment e escalonamento de um conjunto de {{< glossary_tooltip text="Pods" term_id="pod" >}}, *e fornece garantias sobre a ordem e unicidade* desses Pods.

<!--more-->

Como o {{< glossary_tooltip term_id="deployment" >}}, um StatefulSet gerencia Pods que são baseados em uma especificação de container idêntica. Diferente do Deployment, um StatefulSet mantém uma identidade fixa para cada um de seus Pods. Esses pods são criados da mesma especificação, mas não são intercambiáveis: cada um tem uma identificação persistente que se mantém em qualquer reagendamento.

Se você quiser usar volumes de armazenamento para fornecer persistência para sua carga de trabalho, você pode usar um StatefulSet como parte da sua solução. Embora os Pods individuais em um StatefulSet sejam suscetíveis a falhas, os identificadores de pods persistentes facilitam a correspondência de volumes existentes com os novos pods que substituem qualquer um que tenha falhado.
