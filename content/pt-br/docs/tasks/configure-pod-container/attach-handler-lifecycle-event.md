---
title: Anexar Manipuladores a Eventos do Ciclo de Vida do Contêiner
weight: 180
---

<!-- overview -->

Esta página mostra como anexar manipuladores a eventos do ciclo de vida de um
contêiner. O Kubernetes oferece suporte aos eventos postStart e preStop. O
Kubernetes envia o evento postStart imediatamente após um contêiner ser iniciado,
e envia o evento preStop imediatamente antes de o contêiner ser encerrado. Um
contêiner pode especificar um manipulador por evento.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}




<!-- steps -->

## Defina os manipuladores postStart e preStop {#define-poststart-and-prestop-handlers}

Neste exercício, você cria um Pod que tem um contêiner. O contêiner tem
manipuladores para os eventos postStart e preStop.

Aqui está o arquivo de configuração do Pod:

{{% code_sample file="pods/lifecycle-events.yaml" %}}

No arquivo de configuração, você pode ver que o comando de postStart grava um
arquivo `message` no diretório `/usr/share` do contêiner. O comando de preStop
encerra o nginx de forma graciosa. Isso é útil se o contêiner estiver sendo
encerrado por causa de uma falha.

Crie o Pod:

    kubectl apply -f https://k8s.io/examples/pods/lifecycle-events.yaml

Verifique se o contêiner do Pod está em execução:

    kubectl get pod lifecycle-demo

Abra um shell no contêiner em execução no seu Pod:

    kubectl exec -it lifecycle-demo -- /bin/bash

No seu shell, verifique se o manipulador `postStart` criou o arquivo `message`:

    root@lifecycle-demo:/# cat /usr/share/message

A saída mostra o texto gravado pelo manipulador postStart:

    Hello from the postStart handler





<!-- discussion -->

## Discussão {#discussion}

O Kubernetes envia o evento postStart imediatamente após o contêiner ser criado.
No entanto, não há garantia de que o manipulador postStart seja chamado antes
do ponto de entrada (_entrypoint_) do contêiner. O manipulador postStart é
executado de forma assíncrona em relação ao código do contêiner, mas o
gerenciamento do contêiner pelo Kubernetes fica bloqueado até que o manipulador
postStart termine. O status do contêiner só passa a ser RUNNING depois que o
manipulador postStart termina.

O Kubernetes envia o evento preStop imediatamente antes de o contêiner ser
encerrado. O gerenciamento do contêiner pelo Kubernetes fica bloqueado até que o
manipulador preStop termine, a menos que o período de tolerância (_grace period_)
do Pod expire. Para mais detalhes, veja
[Ciclo de Vida do Pod](/docs/concepts/workloads/pods/pod-lifecycle/).

{{< note >}}
O Kubernetes só envia o evento preStop quando um Pod ou um contêiner do Pod é
*encerrado*. Isso significa que o hook preStop não é invocado quando o Pod é
*concluído*. Sobre essa limitação, veja os detalhes em
[Hooks do contêiner](/docs/concepts/containers/container-lifecycle-hooks/#container-hooks).
{{< /note >}}




## {{% heading "whatsnext" %}}


* Saiba mais sobre [hooks de ciclo de vida do contêiner](/docs/concepts/containers/container-lifecycle-hooks/).
* Saiba mais sobre o [ciclo de vida de um Pod](/docs/concepts/workloads/pods/pod-lifecycle/).


### Referência {#reference}

* [Lifecycle](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#lifecycle-v1-core)
* [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* Veja `terminationGracePeriodSeconds` em [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)




