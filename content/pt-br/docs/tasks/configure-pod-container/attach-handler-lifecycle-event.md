---
title: Anexando Manipuladores aos Eventos de Ciclo de Vida do Contêiner
content_type: task
weight: 140
reviewers:
---

<!-- overview -->

Esta página mostra como anexar manipuladores aos eventos de ciclo de vida do contêiner. 
O Kubernetes suporta os eventos `postStart` e `preStop`. O Kubernetes envia o evento 
`postStart` imediatamente após um contêiner ser iniciado, 
e envia o evento `preStop` imediatamente antes do contêiner ser terminado. 
Um contêiner deve especificar um manipulador por evento.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


<!-- steps -->

## Definindo manipuladores para `postStart` e `preStop`

Neste exercício, você cria um Pod que tem um contêiner. 
O contêiner tem um manipulador para os eventos `postStart` e `preStop`.

Aqui está o arquivo de configuração para o Pod:

{{< codenew file="pods/lifecycle-events.yaml" >}}

No arquivo de configuração, você pode ver que o comando `postStart` escreve um arquivo 
`message` no diretório `/usr/share` do contêiner. 
O comando `preStop` encerra o nginx graciosamente. 
Isto é útil se o contêiner é terminado devido a uma falha. 

Crie o Pod:

```shell
    kubectl apply -f https://k8s.io/examples/pods/lifecycle-events.yaml
```

Verifique que o contêiner no Pod está executando:

```shell
    kubectl get pod lifecycle-demo
```

Inicie um shell no contêiner que está executando no seu Pod:

```shell
    kubectl exec -it lifecycle-demo -- /bin/bash
```

No seu shell, verifique que o manipulador `postStart` criou o arquivo `message`:

```shell
    root@lifecycle-demo:/# cat /usr/share/message
```

A saída mostra o texto escrito pelo manipulador `postStart`: 

```shell
    Hello from the postStart handler
```

<!-- discussion -->

## Discussão

O Kubernetes envia o evento `postStart` emediatamente após o Contêiner ser criado. 
Não há garantia, entretanto, que o manipulador `postStart` será chamado antes 
da execução do `entrypoint` do contêiner. O manipulador `postStart` executa 
assincronamente em relação ao código do contêiner, mas o gerenciador de contêiner do Kubernetes 
bloqueia até que o manipulador `postStart` esteja completo. O status do Contêiner 
não é trocado para `RUNNING` até que o manipulador `postStart` seja finalizado.

O Kubernetes envia o evento `preStop` imediatamente antes do contêiner ser terminado. 
O gerenciador do Kubernetes bloqueia até que o manipulador `preStop` esteja completo, 
a não ser que o período de graça do Pod expire. Para mais detalhes, 
veja [Ciclo de vida do Pod](/docs/concepts/workloads/pods/pod-lifecycle/).

{{< note >}}
O Kubernetes somente envia o evento `preStop` quando o Pod está *terminado*.
Isto significa que o _hook_ `preStop` não é invocado quando o Pod está *completo*. 
Esta limitação é rastreada na [issue #55087](https://github.com/kubernetes/kubernetes/issues/55807).
{{< /note >}}




## {{% heading "whatsnext" %}}


* Aprenda mais sobre [Hooks de ciclo de vida do contêiner](/docs/concepts/containers/container-lifecycle-hooks/).
* Aprenda mais sobre o [ciclo de vida do Pod](/pt-br/docs/concepts/workloads/pods/pod-lifecycle/).


### Referência

* [Ciclo de vida](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#lifecycle-v1-core)
* [Contêiner](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* Veja `terminationGracePeriodSeconds` na referência da API de [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)




