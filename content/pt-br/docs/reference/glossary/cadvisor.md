---
title: cAdvisor
id: cadvisor
date: 2021-12-09
full_link: https://github.com/google/cadvisor/
short_description: >
  É uma ferramenta que fornece a compreensão do uso de recursos e características de desempenho para contêineres
aka:
tags:
- tool
---
O cAdvisor (Container Advisor) fornece aos usuários de contêineres uma compreensão do uso de recursos e das características de desempenho de sua execução
{{< glossary_tooltip text="contêineres" term_id="container" >}}.

<!--more-->

É um daemon em execução que coleta, agrega, processa e exporta informações sobre contêineres em execução. Especificamente, para cada contêiner, ele mantém parâmetros dos recursos isolados, o histórico de recursos e os histogramas do histórico de uso dos recursos e estatísticas de rede. Esses dados são exportados por contêiner e em toda a máquina.
