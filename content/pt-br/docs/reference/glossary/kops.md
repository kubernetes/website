---
title: KOps (Kubernetes Operations)
id: kops
date: 2018-04-12
full_link: /pt-br/docs/getting-started-guides/kops/
short_description: >
  kOps não só te ajudará a criar, destruir, atualizar e manter clusters Kubernetes em nível de produção e altamente disponíveis, mas também provisionará a infraestrutura de nuvem necessária.

aka: 
tags:
- tool
- operation
---
  `kOps` não só te ajudará a criar, destruir, atualizar e manter clusters Kubernetes em nível de produção e altamente disponíveis, mas também provisionará a infraestrutura de nuvem necessária.

<!--more--> 

{{< note >}}
Atualmente, a AWS (Amazon Web Services) é oficialmente suportada, com o DigitalOcean, GCE e OpenStack em suporte beta e Azure em alfa.
{{< /note >}}

`kOps` é um sistema de provisionamento automatizado:
  * Instalação totalmente automatizada
  * Identificação de cluster baseada em DNS
  * Auto correção: tudo é executado em grupos de Auto-Scaling
  * Suporte a vários sistemas operacionais (Amazon Linux, Debian, Flatcar, RHEL, Rocky e Ubuntu)
  * Suporte à alta disponibilidade (_High-Availability_, HA)
  * Capacidade de provisionar diretamente ou gerar manifestos Terraform
