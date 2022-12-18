---
reviewers:
- bprashanth
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton
title: Debug Init Containers
content_type: task
weight: 40
---

<!-- overview -->

Esta página mostra como investigar problemas relacionados à execução de
inicialização de Contêineres. As linhas de comando de exemplo abaixo 
referem-se ao pod como `<pod-name>` e a inicialização de contêineres como `<init-container-1>` e
`<init-container-2>`.

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* Você deve estar familiarizado com os fundamentos da
  [inicialização de Contêineres](/docs/concepts/workloads/pods/init-containers/).
* Você deve ter [Configurado uma Inicialização de Contêiner](/docs/tasks/configure-pod-container/configure-pod-initialization/#creating-a-pod-that-has-an-init-container/).

<!-- steps -->

## Verificando o status das inicializações de contêineres

Exiba o status do seu pod:

```shell
kubectl get pod <pod-name>
```

Por exemplo, um status de `Init:1/2` indica que uma das duas inicializações de contêineres
concluíram com sucesso:

```
NAME         READY     STATUS     RESTARTS   AGE
<pod-name>   0/1       Init:1/2   0          7s
```

Consulte [Entendendo sobre o status do pod](#understanding-pod-status) para obter mais exemplos de
valores de status e seus significados.

## Obtendo detalhes sobre a Inicialização de Contêineres

Veja informações mais detalhadas sobre a execução da Inicialização de Contêineres:

```shell
kubectl describe pod <pod-name>
```

Por exemplo, um pod com duas inicializações de contêineres pode mostrar o seguinte:

```
Init Containers:
  <init-container-1>:
    Container ID:    ...
    ...
    State:           Terminated
      Reason:        Completed
      Exit Code:     0
      Started:       ...
      Finished:      ...
    Ready:           True
    Restart Count:   0
    ...
  <init-container-2>:
    Container ID:    ...
    ...
    State:           Waiting
      Reason:        CrashLoopBackOff
    Last State:      Terminated
      Reason:        Error
      Exit Code:     1
      Started:       ...
      Finished:      ...
    Ready:           False
    Restart Count:   3
    ...
```

Você também pode acessar programaticamente os status das inicializações de contêineres,
lendo o campo `status.initContainerStatuses` nas especificações do pod:

```shell
kubectl get pod nginx --template '{{.status.initContainerStatuses}}'
```

Este comando retornará as mesmas informações acima em JSON bruto.

## Acessando logs de inicialização de contêineres

Passe o nome da inicialização de contêineres junto com o nome do Pod
para acessar seus logs.

```shell
kubectl logs <pod-name> -c <init-container-2>
```

Inicializações de contêineres que executam uma impressão de comandos de script de shell
à medida que são executados. Por exemplo, você pode fazer isso no Bash executando `set -x` no início do script.

<!-- discussion -->

## Entendendo sobre o status do pod

Um status do Pod começando com `Init:` resume o status da execução da inicialização de contêineres. 
A tabela abaixo descreve alguns valores de status de exemplo que você pode ver durante a depuração de Init Containers.

Status | Significado
------ | -------
`Init:N/M` | O pod tem inicializações de contêineres `M` e `N` que foram concluídas até agora.
`Init:Error` | Uma inicialização de contêiner falhou ao executar.
`Init:CrashLoopBackOff` | Uma inicialização de contêiner falhou repetidamente.
`Pending` | O pod ainda não começou a executar a inicialização de contêineres.
`PodInitializing` ou `Running` | O pod já concluiu a execução das inicializações de contêineres.