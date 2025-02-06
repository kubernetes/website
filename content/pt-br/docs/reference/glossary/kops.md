---
title: KOps (Kubernetes Operations)
id: kops
date: 2018-04-12
full_link: /pt-br/docs/setup/production-environment/tools/kops/
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
Os provedores AWS (Amazon Web Services) e GCP (Google Cloud Platform) são oficialmente suportados atualmente, com DigitalOcean, Hetzner e OpenStack em suporte beta e Azure em alfa.
{{< /note >}}

`kOps` é um sistema de provisionamento automatizado:
  * Instalação totalmente automatizada
  * Identificação de cluster baseada em DNS
  * Auto correção: tudo é executado em grupos de Auto-Scaling
  * Suporte a vários sistemas operacionais (Amazon Linux, Debian, Flatcar, RHEL, Rocky e Ubuntu)
  * Suporte à alta disponibilidade (_High-Availability_, HA)
  * Capacidade de provisionar diretamente ou gerar manifestos Terraform
