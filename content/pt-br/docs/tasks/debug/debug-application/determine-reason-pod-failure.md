---
title: Determine a razão para a falha do Pod
content_type: task
weight: 30
---

<!-- overview -->

Esta página mostra como escrever e ler uma mensagem de término do contêiner.

Mensagens de término fornecem uma maneira para os contêineres registrarem informações sobre eventos fatais em um local onde possam ser facilmente recuperadas e exibidas por ferramentas como painéis e softwares de monitoramento. Na maioria dos casos, as informações incluídas em uma mensagem de término também devem ser registradas nos
[logs do Kubernetes](/docs/concepts/cluster-administration/logging/).

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Escrevendo e lendo uma mensagem de término

Neste exercício, você cria um Pod que executa um único contêiner.
O manifesto para esse Pod especifica um comando que é executado quando o contêiner é iniciado:

{{% code_sample file="debug/termination.yaml" %}}

1. Crie um Pod com base no arquivo de configuração YAML:

    ```shell
    kubectl apply -f https://k8s.io/examples/debug/termination.yaml
    ```
    
    No arquivo YAML, nos campos `command` e `args`, é possível ver que o
    contêiner dorme por 10 segundos e, em seguida, escreve "Sleep expired"
    no arquivo `/dev/termination-log`. Após escrever a mensagem "Sleep expired",
    o contêiner é encerrado.

1. Exiba informações sobre o Pod:

    ```shell
    kubectl get pod termination-demo
    ```

    Repita o comando anterior até que o Pod não esteja mais em execução.

1. Exiba informações detalhadas sobre o Pod:

    ```shell
    kubectl get pod termination-demo --output=yaml
    ```

    A saída inclui a mensagem "Sleep expired":

    ```yaml
    apiVersion: v1
    kind: Pod
    ...
        lastState:
          terminated:
            containerID: ...
            exitCode: 0
            finishedAt: ...
            message: |
              Sleep expired
            ...
    ```

1. Use um template Go para filtrar a saída, de modo que inclua apenas a mensagem de término:

    ```shell
    kubectl get pod termination-demo -o go-template="{{range .status.containerStatuses}}{{.lastState.terminated.message}}{{end}}"
    ```

Se você estiver executando um Pod com vários contêineres, pode usar um template Go
para incluir o nome do contêiner.
Dessa forma, você pode descobrir qual dos contêineres está falhando:

```shell
kubectl get pod multi-container-pod -o go-template='{{range .status.containerStatuses}}{{printf "%s:\n%s\n\n" .name .lastState.terminated.message}}{{end}}'
```

## Personalizando a mensagem de término

O Kubernetes recupera mensagens de término do arquivo especificado no campo
`terminationMessagePath` de um contêiner, que tem o valor padrão de `/dev/termination-log`.
Ao personalizar esse campo, você pode instruir o Kubernetes a usar um arquivo diferente.
O Kubernetes usa o conteúdo do arquivo especificado para preencher a mensagem de status
do contêiner, tanto em casos de sucesso quanto de falha.

A mensagem de término deve ser um breve status final, como uma mensagem de falha de asserção.
O kubelet trunca mensagens que excedam 4096 bytes.

O tamanho total da mensagem entre todos os contêineres é limitado a 12KiB,
sendo dividido igualmente entre cada contêiner.
Por exemplo, se houver 12 contêineres (`initContainers` ou `containers`),
cada um terá 1024 bytes disponíveis para a mensagem de término.

O caminho padrão para a mensagem de término é `/dev/termination-log`.
Não é possível definir o caminho da mensagem de término após o lançamento de um Pod.

No exemplo a seguir, o contêiner grava mensagens de término em
`/tmp/my-log` para que o Kubernetes possa recuperá-las:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: msg-path-demo
spec:
  containers:
  - name: msg-path-demo-container
    image: debian
    terminationMessagePath: "/tmp/my-log"
```

Além disso, os usuários podem definir o campo `terminationMessagePolicy` de um contêiner
para uma personalização adicional. Esse campo tem como valor padrão "`File`",
o que significa que as mensagens de término são recuperadas apenas do arquivo
de mensagem de término.
Ao definir `terminationMessagePolicy` como "`FallbackToLogsOnError`", você instrui
o Kubernetes a usar o último trecho do log de saída do contêiner caso o arquivo
de mensagem de término esteja vazio e o contêiner tenha encerrado com erro.
A saída do log é limitada a 2048 bytes ou 80 linhas, o que for menor.

## {{% heading "whatsnext" %}}

* Veja o campo `terminationMessagePath` em [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core).
* Consulte [ImagePullBackOff](/docs/concepts/containers/images/#imagepullbackoff) em [Imagens](/docs/concepts/containers/images/).
* Saiba mais sobre [recuperação de logs](/docs/concepts/cluster-administration/logging/).
* Aprenda sobre [templates Go](https://pkg.go.dev/text/template).
* Conheça mais sobre [status do Pod](/docs/tasks/debug/debug-application/debug-init-containers/#understanding-pod-status) e [fase do Pod](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase).
* Entenda os [estados do contêiner](/docs/concepts/workloads/pods/pod-lifecycle/#container-states).
