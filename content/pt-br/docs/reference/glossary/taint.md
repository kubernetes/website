---
title: Taint
id: taint
date: 2019-01-11
full_link: /pt-br/docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  Um objeto principal consistindo de três propriedades principais: chave, valor, e efeito. `Taints` previnem a alocação de Pods em nós ou grupos de nós.

aka:
tags:
- core-object
- fundamental
---
 Um objeto principal consistindo de três propriedades principais: chave, valor, e efeito. *Taints* previnem a alocação de {{< glossary_tooltip text="Pods" term_id="pod" >}} em {{< glossary_tooltip text="Nós" term_id="node" >}} ou grupos de nós.

<!--more-->

*Taints* e {{< glossary_tooltip text="Tolerâncias" term_id="toleration" >}} trabalham juntas para assegurar que Pods não sejam alocados em nós inapropriados. Uma ou mais *taints* são aplicadas para um {{< glossary_tooltip text="Nó" term_id="node" >}}. Um nó deve somente alocar um Pod com tolerâncias coincidentes com a *taint* configurada.
