---
title: ServiceAccount
id: service-account
date: 2018-04-12
full_link: /docs/tasks/configure-pod-container/configure-service-account/
short_description: >
  Fornece uma identidade para os processos que são executados em um Pod.

aka:
tags:
- fundamental
- core-object
---
 Fornece uma identidade para processos que são executados em um {{< glossary_tooltip text="Pod" term_id="pod" >}}.

<!--more-->

Quando processos dentro dos Pods acessam o cluster, eles são autenticados pelo servidor de API como uma conta de serviço específica, por exemplo, `default`. Quando você cria um Pod, se você não especificar uma conta de serviço, ele é automaticamente atribuído à conta de serviço padrão no mesmo {{< glossary_tooltip text="Namespace" term_id="namespace" >}}.
