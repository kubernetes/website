---
title: Contêineres
weight: 40
description: Tecnologia para empacotar aplicações com suas dependências em tempo de execução
content_type: concept
no_list: true
---

<!-- overview -->

Cada contêiner executado é repetível; a padronização de ter
dependências incluídas significa que você obtém o mesmo comportamento onde quer que você execute.

Os contêineres separam os aplicativos da infraestrutura de _host_ subjacente.
Isso torna a implantação mais fácil em diferentes ambientes de nuvem ou sistema operacional.


<!-- body -->

## Imagem de contêiner
Uma [imagem de contêiner](/docs/concepts/containers/images/) é um pacote de software pronto para executar, contendo tudo que é preciso para executar uma aplicação:
o código e o agente de execução necessário, aplicação, bibliotecas do sistema e valores padrões para qualquer configuração essencial.

Por _design_, um contêiner é imutável: você não pode mudar o código de um contêiner que já está executando. Se você tem uma aplicação conteinerizada e quer fazer mudanças, você precisa construir uma nova imagem que inclui a mudança, e recriar o contêiner para iniciar a partir da imagem atualizada.

## Agente de execução de contêiner

{{< glossary_definition term_id="container-runtime" length="all" >}}

## {{% heading "whatsnext" %}}

* [Imagens de contêineres](/docs/concepts/containers/images/)
* [Pods](/docs/concepts/workloads/pods/)

