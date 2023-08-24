---
title: Entendendo os objetos do Kubernetes
content_type: concept
weight: 10
card:
 name: concepts
 weight: 40
---
<!-- overview -->
Esta página explica como os objetos do Kubernetes são representados na API do Kubernetes e como você pode expressá-los no formato `.yaml`.

<!-- body -->
## Entendendo os objetos do Kubernetes  {#kubernetes-objects}

*Os objetos do Kubernetes* são entidades persistentes no Kubernetes. Kubernetes utiliza estas entidades para representar o estado do cluster. Especificamente, eles podem descrever:

* Quais aplicativos estão sendo executados (e em quais nós).
* Os recursos disponíveis para esses aplicativos
* As políticas acerca de como esses aplicativos se comportam, como políticas de reinicialização e tolerâncias a falhas.

Um objeto do Kubernetes é um “registro de intenção”-uma vez criado o objeto, o sistema do Kubernetes trabalha constantemente para garantir que este objeto existe. Ao criar um objeto, você está efetivamente falando para o sistema do Kubernetes como você quer que a carga do seu cluster seja. Este é o *estado desejado* do seu cluster.

Para trabalhar com objetos do Kubernetes seja para criar, modificar ou deletar eles, você precisará usar a [API do Kubernetes](/docs/concepts/overview/kubernetes-api/). Quando você usa a interface de linha de comando do  `kubectl`, por exemplo, o CLI faz as chamadas necessárias na API do Kubernetes para você. Você também pode usar a API do Kubernetes diretamente no seu próprio programa usando uma das [Bibliotecas](/docs/reference/using-api/client-libraries/). 

### Especificação e status do objeto

Quase todos os objetos do Kubernetes incluem dois campos de objetos aninhados que governam a configuração do objeto: a *`especificação`* do objeto e o *`status`* do objeto. Para objetos que têm especificação, você tem que definir isso quando você cria o objeto, fornecendo uma descrição das características que você quer que o recurso tenha: o seu _estado desejado_.

O `status` descreve o _estado atual_ do objeto, fornecido e atualizado pelo Kubernetes e seus componentes. A {{< glossary_tooltip text="camada de gerenciamento" term_id="control-plane" >}} do Kubernetes gerência continuamente e ativamente o real estado para corresponder ao estado desejado que você forneceu.

Por exemplo, no Kubernetes, o {{< glossary_tooltip text="Deployment" term_id="deployment" >}} é um objeto que pode representar uma aplicação executando no seu cluster. Quando você cria o Deployment, você pode alterar a `especificação`para definir que você quer três réplicas da aplicação em execução simultânea. O Kubernetes lê as especificações do Deployment e inicia três instâncias do seu aplicativo desejado, atualizando o status  para corresponder às suas especificações. Se uma dessas instâncias falhar (um status mudar), o Kubernetes responde as diferenças entre as especificações e o status fazendo uma correção-neste caso, iniciando uma instância de substituição.

Para mais informações sobre especificações do objeto, status e metadados, veja [Kubernetes API Conventions](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md).
 
### Descrevendo um objeto Kubernetes

Quando se cria um objeto do Kubernetes, deve-se fornecer a especificação do objeto que descreve seu estado desejado, bem como algumas informações básicas sobre o objeto (como um nome, por exemplo). Quando utiliza a API Kubernetes para criar o objeto (diretamente ou via `kubectl`), essa solicitação de API deve incluir essa informação como JSON no corpo da solicitação. **Na maioria das vezes, você fornece as informações ao comando `kubectl` em um arquivo .yaml**. O comando`kubectl` converte a informação para JSON ao fazer a requisição para a API.

Aqui está um exemplo de arquivo `.yaml` que mostra os campos necessários e as especificações de objeto para uma implatação Kubernetes:

{{% codenew file="application/deployment.yaml" %}}

Uma maneira de criar um Deployment usando um arquivo `.yaml` como o representado acima é usar o comando [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply
) na interface de linha de comando `kubectl`, passando o arquivo `.yaml` como argumento. Aqui está um exemplo:

```shell
kubectl apply -f https://k8s.io/examples/application/deployment.yaml
```

A saída será similar a esta:

```
deployment.apps/nginx-deployment created
```

### Campos obrigatórios

No arquivo `.yaml` para o objeto Kubernetes que pretende criar, você precisará definir valores para os seguintes campos:

* `apiVersion` - Qual a versão de API do objeto que será usado no Kubernetes para criar esse objeto.
* `kind` - Qual tipo de objeto pretende criar.
* `metadata` - Dados que ajudam a identificar de forma única o objeto, incluindo uma string `nome`, `UID` e um `namespace`.
* `spec` - Que estado deseja para o objeto.

O formato preciso do objeto `spec` é diferente para cada objeto Kubernetes, e contém campos aninhados específicos para aquele objeto. A documentação de [referência da API do Kubernetes](/docs/reference/kubernetes-api/) pode ajudar a encontrar o formato de especificação para todos os objetos que você pode criar usando Kubernetes. 

Por exemplo, veja o campo de [`spec` field](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec) para a referência Pod API.
Para cada Pod, o campo `.spec` especifica o pod e seu estado desejado (como o nome da imagem do contêiner para cada recipiente dentro daquela cápsula).
Outro exemplo de especificação de um objeto é o 
[campo `spec` ](/docs/reference/kubernetes-api/workload-resources/stateful-set-v1/#StatefulSetSpec).
Para o StatefulSet, o campo `.spec` especifica o StatefulSet e seu estado desejado.
Dentro do `.spec` de um StatefulSet está um [template](/docs/concepts/workloads/pods/#pod-templates)
para objetos de Pod. Esse modelo descreve os Pods que o controlador StatefulSet criará para 
satisfazer a especificação do StatefulSet. Diferentes tipos de objetos também podem ter diferentes 
`.status`; novamente, as páginas de referência API detalham a estrutura daquele campo `.status`,
e seu conteúdo para cada tipo diferente de objeto.

## {{% heading "whatsnext" %}} 

Aprenda sobre os mais importantes objetos básicos Kubernetes, como o [Pod](/docs/concepts/workloads/pods).
Aprenda sobre as [controladoras](/docs/concepts/architecture/controller/) do Kubernetes.
[Usando a API Kubernetes](/docs/reference/using-api) explica mais alguns conceitos da API.
