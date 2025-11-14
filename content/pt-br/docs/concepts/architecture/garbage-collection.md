---
title: Coleta de Lixo
content_type: concept
weight: 70
---

<!-- overview -->

{{<glossary_definition term_id="garbage-collection" length="short">}} Isso
permite a limpeza de recursos como os seguintes:

- [Pods terminados](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)
- [Jobs completados](/docs/concepts/workloads/controllers/ttlafterfinished/)
- [Objetos sem referências de proprietário](#owners-dependents)
- [Contêineres e imagens de contêiner não utilizados](#containers-images)
- [PersistentVolumes provisionados dinamicamente com uma política de recuperação de StorageClass de Delete](/docs/concepts/storage/persistent-volumes/#delete)
- [CertificateSigningRequests (CSRs) obsoletos ou expirados](/docs/reference/access-authn-authz/certificate-signing-requests/#request-signing-process)
- {{<glossary_tooltip text="Nodes" term_id="node">}} excluídos nos seguintes cenários:
  - Na nuvem quando o cluster usa um [gerenciador de controlador de nuvem](/docs/concepts/architecture/cloud-controller/)
  - On-premises quando o cluster usa um addon similar a um gerenciador de controlador
    de nuvem
- [Objetos Node Lease](/docs/concepts/architecture/nodes/#heartbeats)

## Proprietários e dependentes {#owners-dependents}

Muitos objetos no Kubernetes se vinculam uns aos outros através de [_referências de proprietário_](/docs/concepts/overview/working-with-objects/owners-dependents/).
As referências de proprietário informam à camada de gerenciamento quais objetos são dependentes de outros.
O Kubernetes usa referências de proprietário para dar à camada de gerenciamento, e outros clientes da API,
a oportunidade de limpar recursos relacionados antes de excluir um
objeto. Na maioria dos casos, o Kubernetes gerencia referências de proprietário automaticamente.

A propriedade é diferente do mecanismo de [labels e seletores](/docs/concepts/overview/working-with-objects/labels/)
que alguns recursos também usam. Por exemplo, considere um
{{<glossary_tooltip text="Service" term_id="service">}} que cria
objetos `EndpointSlice`. O Service usa _labels_ para permitir que a camada de gerenciamento
determine quais objetos `EndpointSlice` são usados para esse Service. Além
das labels, cada `EndpointSlice` que é gerenciado em nome de um Service tem
uma referência de proprietário. As referências de proprietário ajudam diferentes partes do Kubernetes a evitar
interferir com objetos que elas não controlam.

{{< note >}}
Referências de proprietário entre namespaces são proibidas por design.
Dependentes com namespace podem especificar proprietários com escopo de cluster ou com namespace.
Um proprietário com namespace **deve** existir no mesmo namespace que o dependente.
Se não existir, a referência de proprietário é tratada como ausente, e o dependente
está sujeito à exclusão uma vez que todos os proprietários são verificados como ausentes.

Dependentes com escopo de cluster só podem especificar proprietários com escopo de cluster.
Nas versões 1.20 e superiores, se um dependente com escopo de cluster especificar um tipo com namespace como proprietário,
ele é tratado como tendo uma referência de proprietário não resolvível, e não pode ser coletado como lixo.

Nas versões v1.20 e superiores, se o coletor de lixo detectar uma `ownerReference` inválida entre namespaces,
ou um dependente com escopo de cluster com uma `ownerReference` referenciando um tipo com namespace, um Event de aviso
com um motivo de `OwnerRefInvalidNamespace` e um `involvedObject` do dependente inválido é reportado.
Você pode verificar esse tipo de Event executando
`kubectl get events -A --field-selector=reason=OwnerRefInvalidNamespace`.
{{< /note >}}

## Exclusão em cascata {#cascading-deletion}

O Kubernetes verifica e exclui objetos que não têm mais referências de proprietário,
como os Pods deixados para trás quando você exclui um ReplicaSet. Quando você
exclui um objeto, pode controlar se o Kubernetes exclui os dependentes do objeto
automaticamente, em um processo chamado _exclusão em cascata_. Existem
dois tipos de exclusão em cascata, como segue:

- Exclusão em cascata em primeiro plano
- Exclusão em cascata em segundo plano

Você também pode controlar como e quando a coleta de lixo exclui recursos que têm
referências de proprietário usando {{<glossary_tooltip text="finalizadores" term_id="finalizer">}} do Kubernetes.

### Exclusão em cascata em primeiro plano {#foreground-deletion}

Na exclusão em cascata em primeiro plano, o objeto proprietário que você está excluindo primeiro entra
em um estado de _exclusão em progresso_. Neste estado, o seguinte acontece com o
objeto proprietário:

- O servidor de API do Kubernetes define o campo `metadata.deletionTimestamp` do objeto
  para o momento em que o objeto foi marcado para exclusão.
- O servidor de API do Kubernetes também define o campo `metadata.finalizers` para
  `foregroundDeletion`.
- O objeto permanece visível através da API do Kubernetes até que o processo de exclusão
  seja concluído.

Depois que o objeto proprietário entra no estado de _exclusão em progresso_, o controlador
exclui dependentes que conhece. Após excluir todos os objetos dependentes que conhece,
o controlador exclui o objeto proprietário. Neste ponto, o objeto não é mais visível na
API do Kubernetes.

Durante a exclusão em cascata em primeiro plano, os únicos dependentes que bloqueiam a exclusão do proprietário
são aqueles que têm o campo `ownerReference.blockOwnerDeletion=true`
e estão no cache do controlador de coleta de lixo. O cache do controlador de coleta de lixo
pode não conter objetos cujo tipo de recurso não pode ser listado/observado com sucesso,
ou objetos que são criados simultaneamente com a exclusão de um objeto proprietário.
Veja [Usar exclusão em cascata em primeiro plano](/docs/tasks/administer-cluster/use-cascading-deletion/#use-foreground-cascading-deletion)
para saber mais.

### Exclusão em cascata em segundo plano {#background-deletion}

Na exclusão em cascata em segundo plano, o servidor de API do Kubernetes exclui o objeto proprietário
imediatamente e o controlador de coleta de lixo (personalizado ou padrão)
limpa os objetos dependentes em segundo plano.
Se um finalizador existir, ele garante que os objetos não sejam excluídos até que todas as tarefas de limpeza necessárias sejam concluídas.
Por padrão, o Kubernetes usa exclusão em cascata em segundo plano, a menos que
você use manualmente a exclusão em primeiro plano ou escolha tornar órfãos os objetos dependentes.

Veja [Usar exclusão em cascata em segundo plano](/docs/tasks/administer-cluster/use-cascading-deletion/#use-background-cascading-deletion)
para saber mais.

### Dependentes órfãos

Quando o Kubernetes exclui um objeto proprietário, os dependentes deixados para trás são chamados
de objetos _órfãos_. Por padrão, o Kubernetes exclui objetos dependentes. Para aprender como
sobrescrever este comportamento, veja [Excluir objetos proprietários e tornar órfãos os dependentes](/docs/tasks/administer-cluster/use-cascading-deletion/#set-orphan-deletion-policy).

## Coleta de lixo de contêineres e imagens não utilizados {#containers-images}

O {{<glossary_tooltip text="kubelet" term_id="kubelet">}} executa coleta de lixo
em imagens não utilizadas a cada cinco minutos e em contêineres não utilizados a cada
minuto. Você deve evitar usar ferramentas externas de coleta de lixo, pois estas podem
quebrar o comportamento do kubelet e remover contêineres que deveriam existir.

Para configurar opções para coleta de lixo de contêineres e imagens não utilizados, ajuste o
kubelet usando um [arquivo de configuração](/docs/tasks/administer-cluster/kubelet-config-file/)
e altere os parâmetros relacionados à coleta de lixo usando o
tipo de recurso [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/).

### Ciclo de vida da imagem de contêiner

O Kubernetes gerencia o ciclo de vida de todas as imagens através do seu _gerenciador de imagens_,
que é parte do kubelet, com a cooperação do
{{< glossary_tooltip text="cadvisor" term_id="cadvisor" >}}. O kubelet
considera os seguintes limites de uso de disco ao tomar decisões de coleta de lixo:

- `HighThresholdPercent`
- `LowThresholdPercent`

O uso de disco acima do valor `HighThresholdPercent` configurado aciona a coleta de lixo,
que exclui imagens em ordem baseada na última vez que foram usadas,
começando com a mais antiga primeiro. O kubelet exclui imagens
até que o uso de disco atinja o valor `LowThresholdPercent`.

#### Coleta de lixo para imagens de contêiner não utilizadas {#image-maximum-age-gc}

{{< feature-state feature_gate_name="ImageMaximumGCAge" >}}

Como uma funcionalidade beta, você pode especificar o tempo máximo que uma imagem local pode ficar não utilizada,
independentemente do uso de disco. Esta é uma configuração do kubelet que você configura para cada node.

Para configurar a definição, você precisa definir um valor para o campo `imageMaximumGCAge`
no arquivo de configuração do kubelet.

O valor é especificado como uma {{< glossary_tooltip text="duração" term_id="duration" >}} do Kubernetes.
Veja [duração](/docs/reference/glossary/?all=true#term-duration) no glossário
para mais detalhes.

Por exemplo, você pode definir o campo de configuração para `12h45m`,
o que significa 12 horas e 45 minutos.

{{< note >}}
Esta funcionalidade não rastreia o uso de imagens através de reinicializações do kubelet. Se o kubelet
for reinicializado, a idade da imagem rastreada é redefinida, fazendo com que o kubelet espere toda a
duração `imageMaximumGCAge` antes de qualificar imagens para coleta de lixo
baseada na idade da imagem.
{{< /note>}}

### Coleta de lixo de contêineres {#container-image-garbage-collection}

O kubelet coleta lixo de contêineres não utilizados baseado nas seguintes variáveis,
que você pode definir:

- `MinAge`: a idade mínima na qual o kubelet pode coletar lixo de um
  contêiner. Desabilite definindo como `0`.
- `MaxPerPodContainer`: o número máximo de contêineres mortos que cada Pod
  pode ter. Desabilite definindo como menor que `0`.
- `MaxContainers`: o número máximo de contêineres mortos que o cluster pode ter.
  Desabilite definindo como menor que `0`.

Além dessas variáveis, o kubelet coleta lixo de containers não identificados e
excluídos, tipicamente começando com o mais antigo primeiro.

`MaxPerPodContainer` e `MaxContainers` podem potencialmente entrar em conflito um com o outro
em situações onde manter o número máximo de contêineres por Pod
(`MaxPerPodContainer`) iria além do total permitido de contêineres mortos globais
(`MaxContainers`). Nesta situação, o kubelet ajusta
`MaxPerPodContainer` para resolver o conflito. Um cenário de pior caso seria
rebaixar `MaxPerPodContainer` para `1` e despejar os containers mais antigos.
Adicionalmente, contêineres pertencentes a Pods que foram excluídos são removidos uma vez
que são mais antigos que `MinAge`.

{{<note>}}
O coletor de lixo do kubelet só remove contêineres que gerencia.
{{</note>}}

## Configurando coleta de lixo {#configuring-gc}

Você pode ajustar a coleta de lixo de recursos configurando opções específicas para
os controladores que gerenciam esses recursos. As seguintes páginas mostram como
configurar coleta de lixo:

- [Configurando exclusão em cascata de objetos Kubernetes](/docs/tasks/administer-cluster/use-cascading-deletion/)
- [Configurando limpeza de Jobs finalizados](/docs/concepts/workloads/controllers/ttlafterfinished/)

## {{% heading "whatsnext" %}}

- Saiba mais sobre [propriedade de objetos Kubernetes](/docs/concepts/overview/working-with-objects/owners-dependents/).
- Saiba mais sobre [finalizadores](/docs/concepts/overview/working-with-objects/finalizers/) do Kubernetes.
- Saiba sobre o [controlador TTL](/docs/concepts/workloads/controllers/ttlafterfinished/) que limpa Jobs finalizados.
