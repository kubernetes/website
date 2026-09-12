---
title: Proprietários e dependentes
content_type: concept
weight: 90
---

<!-- overview -->

No Kubernetes, alguns {{< glossary_tooltip text="objetos" term_id="object" >}} são
*proprietários* de outros objetos. Por exemplo, um
{{<glossary_tooltip text="ReplicaSet" term_id="replica-set">}} é o proprietário
de um conjunto de Pods. Esses objetos possuídos são *dependentes* de seu proprietário.

A propriedade é diferente do mecanismo de [labels e seletores](/docs/concepts/overview/working-with-objects/labels/)
que alguns recursos também usam. Por exemplo, considere um Service que
cria objetos `EndpointSlice`. O Service usa {{<glossary_tooltip text="labels" term_id="label">}} para permitir que o control plane
determine quais objetos `EndpointSlice` são usados para esse Service. Além
das labels, cada `EndpointSlice` que é gerenciado em nome de um Service tem
uma referência de proprietário. As referências de proprietário ajudam diferentes partes do Kubernetes a evitar
interferir em objetos que elas não controlam.

## Referências de proprietário nas especificações de objetos

Objetos dependentes têm um campo `metadata.ownerReferences` que referencia seu
objeto proprietário. Uma referência de proprietário válida consiste no nome do objeto e em um {{<glossary_tooltip text="UID" term_id="uid">}} 
dentro do mesmo {{<glossary_tooltip text="namespace" term_id="namespace">}} do objeto dependente. O Kubernetes define o valor deste
campo automaticamente para objetos que são dependentes de outros objetos como
ReplicaSets, DaemonSets, Deployments, Jobs e CronJobs, e ReplicationControllers.
Você também pode configurar esses relacionamentos manualmente alterando o valor
desse campo. No entanto, geralmente você não precisa fazer isso e pode permitir que o
Kubernetes gerencie os relacionamentos automaticamente.

Objetos dependentes também têm um campo `ownerReferences.blockOwnerDeletion` que
recebe um valor booleano e controla se dependentes específicos podem bloquear a coleta de lixo
de excluir seu objeto proprietário. O Kubernetes define automaticamente este
campo como `true` se um {{<glossary_tooltip text="controlador" term_id="controller">}} 
(por exemplo, o controlador Deployment) definir o valor do
campo `metadata.ownerReferences`. Você também pode definir o valor do
campo `blockOwnerDeletion` manualmente para controlar quais dependentes bloqueiam a
coleta de lixo.

Um admission controller do Kubernetes controla o acesso do usuário para alterar este campo para
recursos dependentes, com base nas permissões de exclusão do proprietário. Esse controle
impede que usuários não autorizados atrasem a exclusão do objeto proprietário.

{{< note >}}
Referências de proprietário entre namespaces não são permitidas por design.
Dependentes com namespace podem especificar proprietários com escopo de cluster ou com namespace.
Um proprietário com namespace **deve** existir no mesmo namespace que o dependente.
Se não existir, a referência de proprietário é tratada como ausente, e o dependente
estará sujeito à exclusão assim que todos os proprietários forem verificados como ausentes.

Dependentes com escopo de cluster só podem especificar proprietários com escopo de cluster.
Na v1.20+, se um dependente com escopo de cluster especificar um tipo com namespace como proprietário,
ele será tratado como tendo uma referência de proprietário não resolvível, e não poderá passar pela coleta de lixo.

Na v1.20+, se o coletor de lixo detectar uma `ownerReference` inválida entre namespaces,
ou um dependente com escopo de cluster com uma `ownerReference` referenciando um tipo com namespace, um Event de aviso
com um motivo de `OwnerRefInvalidNamespace` e um `involvedObject` do dependente inválido é reportado.
Você pode verificar esse tipo de Event executando
`kubectl get events -A --field-selector=reason=OwnerRefInvalidNamespace`.
{{< /note >}}

## Propriedade e finalizadores

Quando você pede ao Kubernetes para excluir um recurso, o servidor de API permite que o
controlador que o gerencia processe quaisquer [regras de finalizador](/docs/concepts/overview/working-with-objects/finalizers/)
para o recurso. {{<glossary_tooltip text="Finalizadores" term_id="finalizer">}}
evitam a exclusão acidental de recursos de que seu cluster ainda pode precisar para funcionar
corretamente. Por exemplo, se você tentar excluir um [PersistentVolume](/pt-br/docs/concepts/storage/persistent-volumes/) que ainda
esteja em uso por um Pod, a exclusão não acontece imediatamente porque o
`PersistentVolume` tem o finalizador `kubernetes.io/pv-protection` nele.
Em vez disso, o [volume](/pt-br/docs/concepts/storage/volumes/) permanece no status `Terminating` até que o Kubernetes limpe
o finalizador, o que só acontece depois que o `PersistentVolume` não estiver mais
vinculado a um Pod. 

O Kubernetes também adiciona finalizadores a um recurso proprietário quando você usa a
[exclusão em cascata em primeiro plano ou do tipo orphan](/pt-br/docs/concepts/architecture/garbage-collection/#cascading-deletion).
Na exclusão em primeiro plano, ele adiciona o finalizador `foreground` para que o
controlador deva excluir os recursos dependentes que também têm
`ownerReferences.blockOwnerDeletion=true` antes de excluir o proprietário. Se você
especificar uma política de exclusão orphan, o Kubernetes adiciona o finalizador `orphan` para
que o controlador ignore os recursos dependentes depois de excluir o objeto
proprietário. 

## {{% heading "whatsnext" %}}

* Saiba mais sobre os [finalizadores do Kubernetes](/docs/concepts/overview/working-with-objects/finalizers/).
* Aprenda sobre [coleta de lixo](/pt-br/docs/concepts/architecture/garbage-collection/).
* Leia a referência da API para [metadados de objeto](/docs/reference/kubernetes-api/common-definitions/object-meta/#System).
