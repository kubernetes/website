---
title: Finalizador
id: finalizer
full_link: /pt-br/docs/concepts/overview/working-with-objects/finalizers/
short_description: >
  Uma chave qualificada por namespace que instrui o Kubernetes a aguardar até que condições específicas sejam satisfeitas antes de excluir completamente um objeto marcado para exclusão.
aka:
tags:
- fundamental
- operation
---
Finalizadores são chaves qualificadas por namespace que instruem o Kubernetes a aguardar até que condições específicas sejam satisfeitas antes de excluir completamente os {{<glossary_tooltip text="recursos" term_id="api-resource">}} marcados para exclusão. Os finalizadores notificam os {{<glossary_tooltip text="controladores" term_id="controller">}} para que limpem os recursos que pertenciam ao objeto excluído.

<!--more-->

Quando você solicita ao Kubernetes a exclusão de um objeto que tem finalizadores especificados, a API do Kubernetes marca o objeto para exclusão preenchendo o campo `.metadata.deletionTimestamp` e retorna um código de status `202` (HTTP "Accepted"). O objeto de destino permanece em um estado de encerramento enquanto a camada de gerenciamento, ou outros componentes, executa as ações definidas pelos finalizadores. Após a conclusão dessas ações, o controlador remove os finalizadores correspondentes do objeto de destino. Quando o campo `metadata.finalizers` fica vazio, o Kubernetes considera a exclusão concluída e exclui o objeto.

Você pode usar finalizadores para controlar a {{<glossary_tooltip text="coleta de lixo" term_id="garbage-collection">}} de recursos. Por exemplo, você pode definir um finalizador para limpar {{<glossary_tooltip text="recursos da API" term_id="api-resource">}} ou infraestrutura relacionados antes que o controlador exclua o objeto que está sendo finalizado.
