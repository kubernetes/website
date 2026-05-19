---
title: Depurando Contêineres de Inicialização
content_type: task
weight: 40
---

<!-- overview -->

Esta página mostra como investigar problemas relacionados à execução de contêineres de inicialização. 
As linhas de comando de exemplo abaixo referem-se ao pod como `<pod-name>` e aos contêineres de inicialização como `<init-container-1>` e
`<init-container-2>`.

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* Você deve estar familiarizado com os fundamentos de
  [contêineres de inicialização](/docs/concepts/workloads/pods/init-containers/).
* Você deve ter [configurado um contêiner de inicialização](/docs/tasks/configure-pod-container/configure-pod-initialization/#creating-a-pod-that-has-an-init-container/).

<!-- steps -->

## Verificando o status dos contêineres de inicialização

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

## Obtendo detalhes sobre os contêineres de inicialização

Veja informações mais detalhadas sobre a execução de contêineres de inicialização:

```shell
kubectl describe pod <pod-name>
```

Por exemplo, um pod com dois contêineres de inicialização pode mostrar o seguinte:

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

Você também pode acessar programaticamente os status dos contêineres de inicialização,
lendo o campo `status.initContainerStatuses` nas especificações do pod:

```shell
kubectl get pod nginx --template '{{.status.initContainerStatuses}}'
```

Este comando retornará as mesmas informações acima em JSON bruto.

## Acessando logs de contêineres de inicialização

Passe o nome do contêiner de inicialização junto com o nome do Pod
para acessar seus logs.

```shell
kubectl logs <pod-name> -c <init-container-2>
```

Contêineres de inicialização que executam comandos de script de shell imprimem
à medida que são executados. Por exemplo, você pode fazer isso no Bash executando `set -x` no início do script.

<!-- discussion -->

## Entendendo sobre o status do pod { #understanding-pod-status }

Um status do Pod começando com `Init:` resume o status da execução de contêineres de inicialização. 
A tabela abaixo descreve alguns valores de status de exemplo que você pode ver durante a depuração de contêineres de inicialização.

Status | Significado
------ | -------
`Init:N/M` | O pod tem contêineres de inicialização `M` e `N` que foram concluídas até agora.
`Init:Error` | Um contêiner de inicialização falhou ao executar.
`Init:CrashLoopBackOff` | Um contêiner de inicialização falhou repetidamente.
`Pending` | O pod ainda não começou a executar o contêiner de inicialização.
`PodInitializing` ou `Running` | O pod já concluiu a execução dos contêineres de inicialização.