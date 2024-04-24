---
title: Tolerância
id: toleration
date: 2019-01-11
full_link: /pt-br/docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  Um objeto principal consistindo de três propriedades principais: chave, valor, e efeito. Tolerâncias habilitam a alocação de Pods em nós ou grupos de nós que tenham uma taint coincidente.

aka:
tags:
- core-object
- fundamental
---
 Um objeto principal consistindo de três propriedades principais: chave, valor, e efeito. Tolerâncias habilitam a alocação de Pods em nós ou grupos de nós que tenham *{{< glossary_tooltip text="taints" term_id="taint" >}}* coincidente.

<!--more-->

Tolerâncias e *{{< glossary_tooltip text="taints" term_id="taint" >}}* trabalham juntas para assegurar que Pods não sejam alocados em nós inapropriados. Uma ou mais tolerâncias são aplicadas para um {{< glossary_tooltip text="Pod" term_id="pod" >}}. Uma tolerância indica que o {{< glossary_tooltip text="Pod" term_id="pod" >}} está permitido (mas não requerido) a ser alocado em nós ou grupos de nós com *{{< glossary_tooltip text="taints" term_id="taint" >}}* coincidentes.
