---
title: Finalizadores
content_type: concept
weight: 80
---

<!-- overview -->

{{<glossary_definition term_id="finalizer" length="long">}}

Você pode usar finalizadores para controlar a {{<glossary_tooltip text="coleta de lixo" term_id="garbage-collection">}} de {{< glossary_tooltip text="objetos" term_id="object" >}}, notificando os {{<glossary_tooltip text="controladores" term_id="controller">}} para que executem tarefas específicas de limpeza antes de excluir o recurso de destino.

Os finalizadores geralmente não especificam o código a ser executado. Em vez disso, costumam ser listas de chaves em um recurso específico, semelhantes às anotações. O Kubernetes especifica alguns finalizadores automaticamente, mas você também pode especificar seus próprios finalizadores.

## Como os finalizadores funcionam {#how-finalizers-work}

Ao criar um recurso usando um arquivo de manifesto, você pode especificar finalizadores no campo `metadata.finalizers`. Quando você tenta excluir o recurso, o servidor de API que processa a solicitação de exclusão identifica os valores no campo `finalizers` e executa as seguintes ações:

* Modifica o objeto para adicionar um campo `metadata.deletionTimestamp` com o horário em que você iniciou a exclusão.
* Impede que o objeto seja removido até que todos os itens sejam removidos do campo `metadata.finalizers`.
* Retorna um código de status `202` (HTTP "Accepted").

O controlador que gerencia esse finalizador detecta a atualização do objeto que define o campo `metadata.deletionTimestamp`, indicando que a exclusão do objeto foi solicitada. O controlador então tenta satisfazer os requisitos dos finalizadores especificados para esse recurso. Sempre que uma condição de um finalizador é satisfeita, o controlador remove a chave correspondente do campo `finalizers` do recurso. Quando o campo `finalizers` fica vazio, um objeto com o campo `deletionTimestamp` definido é excluído automaticamente. Você também pode usar finalizadores para impedir a exclusão de recursos não gerenciados.

Um exemplo comum de finalizador é `kubernetes.io/pv-protection`, que impede a exclusão acidental de objetos `PersistentVolume`. Quando um objeto `PersistentVolume` está em uso por um Pod, o Kubernetes adiciona o finalizador `pv-protection`. Se você tentar excluir o `PersistentVolume`, ele entra no estado `Terminating`, mas o controlador não consegue excluí-lo porque o finalizador existe. Quando o Pod deixa de usar o `PersistentVolume`, o Kubernetes remove o finalizador `pv-protection`, e o controlador exclui o volume.

{{<note>}}
* Quando você exclui um objeto usando `DELETE`, o Kubernetes adiciona o registro de data e hora da exclusão desse objeto e imediatamente começa a restringir alterações no campo `.metadata.finalizers` do objeto, que agora está com a exclusão pendente. Você pode remover finalizadores existentes (excluindo uma entrada da lista `finalizers`), mas não pode adicionar um novo finalizador. Você também não pode modificar o campo `deletionTimestamp` de um objeto depois que ele é definido.

* Após a solicitação de exclusão, você não pode restaurar esse objeto. A única opção é excluí-lo e criar um novo objeto semelhante.
{{</note>}}

{{<note>}}
Os nomes de finalizadores personalizados **devem** ser qualificados com um domínio público, como `example.com/finalizer-name`. O Kubernetes exige esse formato; o servidor de API rejeita operações de escrita em objetos quando a alteração usa nomes não qualificados para qualquer finalizador personalizado.
{{</note>}}

## Referências de proprietário, labels e finalizadores {#owners-labels-finalizers}

Assim como as {{<glossary_tooltip text="labels" term_id="label">}}, as [referências de proprietário](/docs/concepts/overview/working-with-objects/owners-dependents/) descrevem os relacionamentos entre objetos no Kubernetes, mas são usadas para uma finalidade diferente. Quando um {{<glossary_tooltip text="controlador" term_id="controller">}} gerencia objetos como Pods, ele usa labels para acompanhar alterações em grupos de objetos relacionados. Por exemplo, quando um {{<glossary_tooltip text="Job" term_id="job">}} cria um ou mais Pods, o controlador de Job aplica labels a esses Pods e acompanha alterações em quaisquer Pods no cluster com a mesma label.

O controlador de Job também adiciona *referências de proprietário* a esses Pods, apontando para o Job que os criou. Se você excluir o Job enquanto esses Pods estiverem em execução, o Kubernetes usa as referências de proprietário (e não as labels) para determinar quais Pods no cluster precisam de limpeza.

O Kubernetes também processa finalizadores quando identifica referências de proprietário em um recurso marcado para exclusão.

Em algumas situações, os finalizadores podem bloquear a exclusão de objetos dependentes, o que pode fazer com que o objeto proprietário marcado para exclusão permaneça por mais tempo do que o esperado sem ser completamente excluído. Nessas situações, você deve verificar os finalizadores e as referências de proprietário no objeto proprietário e nos objetos dependentes para identificar a causa do problema.

{{<note>}}
Nos casos em que objetos ficam presos em um estado de exclusão, evite remover finalizadores manualmente para permitir que a exclusão continue. Os finalizadores geralmente são adicionados aos recursos por um motivo, portanto, removê-los à força pode causar problemas no seu cluster. Isso só deve ser feito quando a finalidade do finalizador for compreendida e cumprida de outra maneira (por exemplo, limpando manualmente algum objeto dependente).
{{</note>}}

## {{% heading "whatsnext" %}}

* Leia [Usando finalizadores para controlar a exclusão](/blog/2021/05/14/using-finalizers-to-control-deletion/) no blog do Kubernetes.