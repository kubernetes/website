---
title: Anexando Manipuladores aos Eventos de Ciclo de Vida do Contêiner
content_type: task
weight: 140
reviewers:
---

<!-- overview -->

Esta página mostra como anexar manipuladores aos eventos de ciclo de vida do Contêiner. 
O Kubernetes suporta os eventos `postStart` e `preStop`. O Kubernetes envia o evento 
`postStart` imediatamente após um Contêiner ser iniciado, 
e envia o evento `preStop` imediatamente antes do Contêiner ser terminado. 
Um Contêiner deve especificar um manipulador por evento.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


<!-- steps -->

## Definindo manipuladores para `postStart` e `preStop`

Neste exercício, você cria um Pod que tem um Contêiner. 
O Contêiner tem um manipulador para os eventos `postStart` e `preStop`.

Aqui está o arquivo de configuração para o Pod:

{{< codenew file="pods/lifecycle-events.yaml" >}}

No arquivo de configuração, você pode ver que o comando `postStart` escreve um arquivo 
`message` no diretório `/usr/share` do Contêiner. 
O comando `preStop` desliga o nginx graciosamente. 
Isto é útil se o Contêiner é terminado devido a uma falha. 

Crie o Pod:

    kubectl apply -f https://k8s.io/examples/pods/lifecycle-events.yaml

Verifique se o Contêiner no Pod está executando:

    kubectl get pod lifecycle-demo

Obtendo um shell no Contêiner executando em seu Pod:

    kubectl exec -it lifecycle-demo -- /bin/bash

No seu shell, verifique que o manipulador `postStart` criou o arquivo `message`:

    root@lifecycle-demo:/# cat /usr/share/message

A saída mostra o texto escrito pelo manipulador `postStart`: 

    Hello from the postStart handler

<!-- discussion -->

## Discussão

O Kubernetes envia o evento `postStart` emediatamente após o Contêiner ser criado. 
Não há garantia, entretanto, que o manipulador `postStart` é chamado antes 
de ser chamado o `entrypoint` do Contêiner. o Manipulador `postStart` executa 
assincronamente em relação ao código do Contêiner, mas o gerenciador do Kubernetes 
bloqueia até que o manipulador `postStart` esteja completo. O status do Contêiner 
não é trocado para `RUNNING` até que o manipulador `postStart` esteja completo.

O Kubernetes envia o evento `preStop` imediatamente antes do Contêiner ser terminado. 
O gerenciador do Kubernetes bloqueia até que o manipulador `preStop` esteja completo, 
a não ser que o período de graça do Pod expire. Para mais detalhes, 
veja [Ciclo de vida do Pod](/docs/concepts/workloads/pods/pod-lifecycle/).

{{< note >}}
O Kubernetes somente envia o evento `preStop` quando o Pod está *terminado*.
Isto significa que o `hook preStop` não é invocado quando o Pod está *completo*. 
Esta limitação é rastreada na [issue #55087](https://github.com/kubernetes/kubernetes/issues/55807).
{{< /note >}}




## {{% heading "whatsnext" %}}


* Aprenda mais sobre [Hooks de ciclo de vida do Container](/docs/concepts/containers/container-lifecycle-hooks/).
* Aprenda mais sobre o [ciclo de vida do Pod](/docs/concepts/workloads/pods/pod-lifecycle/).


### Referência

* [Ciclo de vida](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#lifecycle-v1-core)
* [Contêiner](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* Veja `terminationGracePeriodSeconds` em [Especificações de Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)




