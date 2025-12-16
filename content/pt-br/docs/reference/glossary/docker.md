---
title: Docker
id: docker
date: 2018-04-12
full_link: https://docs.docker.com/engine/
short_description: >
  Docker é uma tecnologia de software que fornece virtualização a nível do sistema operacional, também conhecida como contêineres.

aka:
tags:
- fundamental
---
Docker (especificamente, Docker Engine) é um software que provê virtualização a nível do sistema operacional, também conhecida como {{< glossary_tooltip text="contêineres" term_id="container" >}}.

<!--more-->

Docker utiliza as funcionalidades de isolamento de recursos do kernel Linux como cgroups e kernel namespaces, e a capacidade de unir o sistema de arquivos como OverlayFS e outros para permitir a execução independente de contêineres dentro de uma única instância Linux, evitando o custo de inicialização e manutenção de máquinas virtuais (VMs).
