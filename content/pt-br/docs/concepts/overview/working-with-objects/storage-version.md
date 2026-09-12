---
title: Versões de armazenamento
content_type: concept
weight: 110
---

<!-- overview -->
O servidor de API do Kubernetes armazena objetos, contando com um armazenamento
de apoio (backing store) compatível com etcd (frequentemente, o armazenamento de apoio é o
próprio etcd). Cada objeto é serializado
usando uma versão específica daquele tipo de API; por exemplo, a representação
v1 de um ConfigMap. O Kubernetes usa o termo _versão de armazenamento_ (storage version) para descrever como um
objeto é armazenado em seu cluster.

A API do Kubernetes também depende da conversão automática; por exemplo, se você tem
um HorizontalPodAutoscaler, então você pode interagir com esse
HorizontalPodAutoscaler usando qualquer combinação das versões v1 e v2 da
API HorizontalPodAutoscaler. O Kubernetes é responsável por converter cada chamada de API
para que os clientes não vejam qual versão está realmente serializada.

Para administradores de cluster, a versão de armazenamento de um objeto é um conceito importante
de se entender, pois é ela que vincula a representação da API do objeto à
codificação real no backend de armazenamento. Isso pode ser importante quando as
codificações binárias subjacentes do objeto importam, como na criptografia
em repouso (encryption at rest), ou na descontinuação (deprecação) da API.

A mesma API pode ter várias versões de armazenamento que o servidor de API pode então
converter para um schema de objeto. Um único objeto que faz parte desse recurso deve
ter apenas uma versão de armazenamento a qualquer momento. Isso significa que o servidor de API
está ciente das codificações binárias dos objetos e é capaz de converter entre todas
as versões armazenadas e a representação da API do objeto dinamicamente.

A versão de um objeto é completamente separada da versão de armazenamento. Por
exemplo, um objeto de API `v1alpha1` e `v1beta1` para o mesmo Resource será
codificado da mesma forma no armazenamento, desde que a versão de armazenamento não tenha sido atualizada
entre os dois objetos.

<!-- body -->

## Mapeamento da versão de armazenamento para o recurso

Cada recurso terá 1 versão de armazenamento ativa em qualquer momento, o que significa
que qualquer gravação em um objeto armazenará o objeto nessa versão de armazenamento. A
versão de armazenamento pode ser atualizada, no entanto, fazendo com que os objetos possam ser armazenados
em versões diferentes. Um objeto será armazenado em apenas uma versão de armazenamento
a qualquer momento.

As leituras do servidor de API converterão os dados armazenados na representação da API
do objeto. Isso faz com que versões de armazenamento antigas possam permanecer indefinidamente,
contanto que nenhuma atualização ocorra no objeto. As gravações, por outro lado,
converterão o objeto armazenado para a nova representação após a atualização.

## Versões de armazenamento para recursos personalizados {#CustomResourceDefinition-storage-version}

[Recursos
personalizados](/docs/concepts/extend-kubernetes/api-extension/custom-resources/#storage) são
definidos dinamicamente e, como tal, diferem dos tipos integrados do Kubernetes
em relação à sua versão de armazenamento. Objetos integrados geralmente têm sua codificação de armazenamento
definida separadamente de seus tipos de API, onde o objeto armazenado atua como um
hub e a versão específica do recurso não importa, além de ser um
campo no schema do objeto.

No entanto, para recursos personalizados, uma determinada versão do recurso deve ser definida como
a versão de armazenamento. O schema definido por essa versão específica do recurso
personalizado será usado como a codificação do recurso na camada de armazenamento. Consulte o
[conjunto de recursos
avançados de CRD](/docs/concepts/extend-kubernetes/api-extension/custom-resources/#advanced-features-and-flexibility)
para obter informações mais detalhadas sobre a configuração e o versionamento da API.

Por exemplo, veja esta CustomResourceDefinition para _crontabs_:

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: crontabs.example.com
spec:
  group: example.com
  # lista de versões suportadas por esta CustomResourceDefinition
  versions:
  - name: v1beta1
    # Cada versão pode ser habilitada/desabilitada pela flag served.
    served: true
    # Uma e apenas uma versão deve ser marcada como a versão de armazenamento.
    storage: true
    schema:
      openAPIV3Schema:
        type: object
        properties:
          host:
            type: string
          port:
            type: string
  - name: v1
    served: true
    storage: false
    schema:
      openAPIV3Schema:
        type: object
        properties:
          host:
            type: string
          port:
            type: string
          time:
            type: string
  conversion:
    strategy: None
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
    shortNames:
    - ct
```

A definição de API `v1beta1` é usada como a versão de armazenamento, o que significa que qualquer
atualização ou criação de `crontabs` será armazenada com o schema de objeto da
API `v1beta1`. Neste caso, isso realmente significaria que o objeto de API `v1`
nunca conseguiria armazenar o campo `time`, pois ele não faz parte da
definição de armazenamento. Este schema é usado na camada de armazenamento como a
codificação binária do próprio objeto. Tentar definir duas versões como a versão
armazenada ao mesmo tempo é considerado inválido, pois isso significaria que dois
esquemas de dados seriam considerados formas válidas de armazenar os objetos ao mesmo tempo.

Após a modificação da versão usada para armazenamento, essa versão da
API será usada para armazenar quaisquer CRs novos ou atualizados. Assistir (watch) ou obter o objeto
fará com que o objeto esteja em uso, mas apenas converterá o objeto da versão
de armazenamento antiga, sem afetar o objeto. Apenas a atualização ou a criação terão
um efeito e usarão a versão de armazenamento recém-definida.

## Como as versões de armazenamento se relacionam com a criptografia em repouso

Existem ferramentas para [criptografar o armazenamento
em repouso](/docs/tasks/administer-cluster/kms-provider/) de um cluster, especialmente
para os secrets do cluster. Isso adiciona uma camada adicional de proteção contra o
roubo (exfiltração) de dados, já que os dados realmente armazenados no cluster são criptografados. Isso
significa que o servidor de API está realmente descriptografando os dados ao recuperá-los
do armazenamento. O APIServer deve ter a chave dessa
versão de armazenamento para decodificar o objeto corretamente.

A versão de armazenamento, neste caso, é mais do que apenas a codificação binária do
objeto. Contanto que o que está armazenado possa, de alguma forma, ser convertido no objeto da API,
pode ser usado como uma versão de armazenamento.

## Migrando para uma versão de armazenamento diferente

Múltiplas versões de armazenamento para um único recurso podem causar problemas para administradores
de cluster. Um administrador de cluster não pode remover versões antigas de uma API
para CRDs que podem não ser suportadas até ter certeza de que todos os objetos não estão mais
usando a versão de armazenamento associada a elas. Com um grande número de
objetos e uma visão opaca de quais são novos e quais ainda estão
suportados por versões de armazenamento antigas, fica difícil saber quando uma versão pode
ser removida com segurança. Se uma versão for removida prematuramente, isso pode significar ficar
impossibilitado de ler o objeto por completo.

Outra questão importante é o uso de chaves de criptografia, conforme definido na seção
acima. Como um recurso deve estar ativamente em uso para atualizar a versão de armazenamento,
quando uma rotação de chaves é feita, tanto a chave de criptografia antiga quanto a nova chave de
criptografia devem permanecer em uso até que o administrador tenha certeza de que todos os objetos foram
gravados pelo menos uma vez. Isso representa riscos de segurança e problemas de usabilidade,
já que uma chave não pode ser totalmente removida do uso até então.

Consulte a [migração de versão de
armazenamento](/pt-br/docs/tasks/manage-kubernetes-objects/storage-version-migration/) para
exemplos de como executar uma migração para garantir que todos os objetos estejam usando uma
versão de armazenamento mais recente, sem intervenção manual.
