---
title: Kops
id: kops
date: 2018-04-12
full_link: /pt-br/docs/getting-started-guides/kops/
short_description: >
  Uma ferramenta CLI que ajuda a criar, destruir, atualizar e manter clusters Kubernetes em nível de produção e altamente disponíveis.

aka: 
tags:
- tool
- operation
---
  Uma ferramenta CLI que ajuda a criar, destruir, atualizar e manter clusters Kubernetes em nível de produção e altamente disponíveis.

<!--more--> 

{{< note >}}
O kops tem suporte de disponibilidade geral apenas para AWS. O suporte para o uso do kops com GCE e VMware vSphere está em fase alfa.
{{< /note >}}

`kops` fornece seu cluster com&#58;

  * Instalação totalmente automatizada
  * Identificação de cluster baseada em DNS
  * Auto correção&#58; tudo é executado em grupos de Auto-Scaling
  * Suporte limitado ao sistema operacional (preferência Debian, suportado Ubuntu 16.04, suporte inicial para CentOS & RHEL)
  * Suporte de alta disponibilidade (_High-Availability_, HA)
  * A capacidade de provisionar diretamente ou gerar manifestos Terraform

Você também pode construir seu próprio cluster usando {{< glossary_tooltip term_id="kubeadm" >}} como um bloco de construção. `kops` se baseia no trabalho kubeadm.
