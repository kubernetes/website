---
title: cAdvisor
id: cadvisor
date: 2021-12-09
full_link: https://github.com/google/cadvisor/
short_description: >
  Ferramenta que fornece o entendimento do uso de recursos e características de desempenho para contêineres
aka:
tags:
- tool
---
O cAdvisor (Contêiner Advisor) fornece aos usuários de contêineres uma compreensão do uso dos recursos e das características de desempenho de seus {{< glossary_tooltip text="contêineres" term_id="container" >}} em execução.

<!--more-->

É um daemon em execução que coleta, agrega, processa e exporta informações sobre contêineres em execução. 
Especificamente, para cada contêiner, ele mantém parâmetros de isolamento de recursos, uso histórico de recursos, histogramas de uso histórico completo de recursos e estatísticas de rede. 
Esses dados são exportados por contêiner e em toda a máquina.
