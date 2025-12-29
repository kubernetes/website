---
title: Contêiner de inicialização
id: init-container
date: 2018-04-12
full_link: /docs/concepts/workloads/pods/init-containers/
short_description: >
  Um ou mais contêineres de inicialização que devem ser executados até a conclusão antes que qualquer contêiner de aplicação seja executado.
aka: 
tags:
- fundamental
---
 Um ou mais {{< glossary_tooltip text="contêineres" term_id="container" >}} de inicialização que devem ser executados até a conclusão antes que qualquer contêiner de aplicação seja executado.

<!--more--> 

Contêineres de inicialização (init) são como contêineres de aplicação regulares, com uma diferença: contêineres de inicialização devem ser executados até a conclusão antes que qualquer contêiner de aplicação possa iniciar. Contêineres de inicialização são executados em série: cada contêiner de inicialização deve ser executado até a conclusão antes que o próximo contêiner de inicialização comece.

Diferentemente dos {{< glossary_tooltip text="contêineres sidecar" term_id="sidecar-container" >}}, contêineres de inicialização não permanecem em execução após a inicialização do Pod.

Para mais informações, leia [contêineres de inicialização](/docs/concepts/workloads/pods/init-containers/).
