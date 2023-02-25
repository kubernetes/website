---
title: ConfigMap
id: configmap
date: 2021-08-24
full_link: /pt-br/docs/concepts/configuration/configmap
short_description: >
  Um objeto da API usado para armazenar dados não-confidenciais em pares chave-valor. Pode ser consumido como variáveis de ambiente, argumentos de linha de comando, ou arquivos de configuração em um volume.

aka:
tags:
- core-object
---
Um objeto da API usado para armazenar dados não-confidenciais em pares chave-valor.
{{< glossary_tooltip text="Pods" term_id="pod" >}} podem consumir ConfigMaps como variáveis de ambiente, argumentos de linha de comando ou como arquivos de configuração em um {{< glossary_tooltip text="volume" term_id="volume" >}}.

<!--more-->

Um ConfigMap ajuda a desacoplar configurações vinculadas ao ambiente das {{< glossary_tooltip text="imagens de contêiner" term_id="image" >}}, de modo a tornar aplicações mais facilmente portáveis.