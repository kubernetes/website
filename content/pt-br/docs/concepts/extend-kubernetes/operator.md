---
title: Padrão Operador
content_type: concept
weight: 30
---

<!-- overview -->

Operadores são extensões de software para o Kubernetes que fazem uso de [*recursos personalizados*](/docs/concepts/extend-kubernetes/api-extension/custom-resources/) para gerir aplicações e os seus componentes. Operadores seguem os princípios do Kubernetes, notavelmente o [ciclo de controle](/pt-br/docs/concepts/architecture/controller/).




<!-- body -->

## Motivação

O *padrão operador* tem como objetivo capturar o principal objetivo de um operador humano que está gerenciando um serviço ou conjunto de serviços. Operadores humanos que cuidam de aplicativos e serviços específicos possuem um conhecimento profundo de como o sistema deve se comportar, como implantá-lo e como reagir se houver problemas.

As pessoas que executam cargas de trabalho no Kubernetes muitas vezes gostam de usar automação para cuidar de tarefas repetitivas. O padrão do operador captura como você pode escrever código para automatizar uma tarefa além do que o próprio Kubernetes fornece.

## Operadores no Kubernetes

O Kubernetes é projetado para automação. Por padrão, você tem bastante automação integrada ao núcleo do Kubernetes. Você pode usar o Kubernetes para automatizar a implantação e execução de cargas de trabalho, e pode automatizar como o Kubernetes faz isso.

O conceito de {{< glossary_tooltip text="padrão operador" term_id="operator-pattern" >}} do Kubernetes permite a extensão do comportamento sem modificar o código do próprio Kubernetes, vinculando {{< glossary_tooltip text="controladores" term_id="controller" >}} a um ou mais recursos personalizados.
Os operadores são clientes da API do Kubernetes que atuam como controladores para um [*recurso personalizado*](/docs/concepts/api-extension/custom-resources/).

## Exemplo de um operador

Algumas das coisas que você pode automatizar usando um operador incluem:

* implantação sob demanda de uma aplicação
* fazer e restaurar backups do estado dessa aplicação
* lidar com atualizações do código da aplicação junto com mudanças relacionadas, como esquemas de banco de dados ou configurações adicionais
* publicar um Service para que aplicações que não suportam as APIs do Kubernetes possam descobrí-los
* simular falhas em todo ou parte do seu cluster para testar resiliência
* escolher um líder para uma aplicação distribuída sem um processo de eleição interna de membros

Como seria um operador com mais detalhes? Aqui está um exemplo:

1. Um recurso personalizado (*custom resource*) chamado SampleDB, que você pode configurar dentro do *cluster*.
2. Um Deployment que garante que um Pod esteja em execução contendo a parte do controlador do operador.
3. Uma imagem de contêiner do código do operador.
4. Código do controlador que consulta a camada de gerenciamento para descobrir quais recursos SampleDB estão configurados.
5. O núcleo do Operador é o código que informa ao servidor da API como fazer com que a realidade corresponda aos recursos configurados.
   * Se você adicionar um novo SampleDB, o operador configura PersistentVolumeClaims para fornecer armazenamento durável da base de dados, um StatefulSet para executar o SampleDB e um Job para lidar com a configuração inicial.
   * Se você excluir um SampleDB, o operador cria um instantâneo e em seguida, garante que o StatefulSet e os Volumes também sejam removidos.
6. O operador também gerencia backups regulares da base de dados. Para cada recurso SampleDB, o operador determina quando criar um Pod que pode se conectar ao banco de dados e fazer backups. Esses Pods dependeriam de um ConfigMap e/ou um Secret que tenha detalhes da conexão e credenciais do banco de dados.
7. Considerando que o Operador tem como objetivo fornecer automação robusta para o recurso que gerencia, haveria código de suporte adicional. Para este exemplo, o código verifica se o banco de dados está a executando uma versão antiga e, se estiver, cria objetos Job que fazem a atualização para você.

## Implantando operadores

A maneira mais comum de implantar um operador é adicionar a definição personalizada de recurso (*Custom Resource Definition*) e o Controlador associado ao seu cluster.
O Controlador normalmente é executado fora da {{< glossary_tooltip text="camada de gerenciamento" term_id="control-plane" >}}, assim como você executaria qualquer aplicação que rode em contêineres.
Por exemplo, você pode executar o controlador no seu cluster como um *Deployment*.

## Usando um operador

Depois de implantar um operador, você o usaria adicionando, modificando ou excluindo o tipo de recurso que o operador usa. Seguindo o exemplo acima,
você configuraria um Deployment para o próprio operador, e depois:

```shell
kubectl get SampleDB                   # encontrar banco de dados configurados

kubectl edit SampleDB/example-database # alterar manualmente algumas configurações
```

&hellip;e é isso! O Operador cuidará de aplicar as alterações, bem como manter o serviço existente em bom estado.

## Escrevendo o seu próprio operador

Se não houver um operador no ecossistema que implemente o comportamento desejado, você pode programar o seu próprio.

Você também pode implementar um operador (ou seja, um Controlador) usando qualquer linguagem/agente de execução que possa atuar como um [cliente para a API do Kubernetes](/docs/reference/using-api/client-libraries/).

A seguir estão algumas bibliotecas e ferramentas que você pode usar para escrever seu próprio operador nativo de nuvem.

{{% thirdparty-content %}}

* [Charmed Operator Framework](https://juju.is/)
* [Java Operator SDK](https://github.com/operator-framework/java-operator-sdk)
* [Kopf](https://github.com/nolar/kopf) (Kubernetes Operator Pythonic Framework)
* [kube-rs](https://kube.rs/) (Rust)
* [kubebuilder](https://book.kubebuilder.io/)
* [KubeOps](https://buehler.github.io/dotnet-operator-sdk/) (.NET operator SDK)
* [Mast](https://docs.ansi.services/mast/user_guide/operator/)
* [Metacontroller](https://metacontroller.github.io/metacontroller/intro.html) em conjunto com webhooks que você mesmo implementa
* [Operator Framework](https://operatorframework.io)
* [shell-operator](https://github.com/flant/shell-operator)

## {{% heading "whatsnext" %}} 


* Leia o [whitepaper sobre operadores](https://github.com/cncf/tag-app-delivery/blob/163962c4b1cd70d085107fc579e3e04c2e14d59c/operator-wg/whitepaper/Operator-WhitePaper_v1-0.md) da {{< glossary_tooltip text="CNCF" term_id="cncf" >}}
* Saiba mais sobre [Custom Resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
* Encontre operadores prontos em [OperatorHub.io](https://operatorhub.io/) para atender ao seu caso de uso
* [Publique](https://operatorhub.io/) seu operador para outras pessoas usarem
* Leia o [artigo original do CoreOS](https://web.archive.org/web/20170129131616/https://coreos.com/blog/introducing-operators.html)
  que introduziu o padrão de operador (esta é uma versão arquivada do artigo original)
* Leia um [artigo](https://cloud.google.com/blog/products/containers-kubernetes/best-practices-for-building-kubernetes-operators-and-stateful-apps)
  do Google Cloud sobre as melhores práticas para construir operadores

