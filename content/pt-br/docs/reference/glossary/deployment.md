---
title: Deployment
id: deployment
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/deployment/
short_description: >
  Gerencia uma aplicação replicada no seu cluster.

aka: 
tags:
- fundamental
- core-object
- workload
---
 Um objeto da API que gerencia uma aplicação replicada, geralmente executando Pods sem estado armazenado.

<!--more--> 

Cada réplica é representada por um {{< glossary_tooltip term_id="pod" >}}, e os Pods são distribuídos entre os {{< glossary_tooltip text="nós" term_id="node" >}} de um cluster. 
Para cargas de trabalho que exigem o estado armazenado, considere usar um {{< glossary_tooltip term_id="StatefulSet" >}}.
