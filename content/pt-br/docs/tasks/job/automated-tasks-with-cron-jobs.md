---
title: Executando tarefas automatizadas com CronJob
min-kubernetes-server-version: v1.21
content_type: task
weight: 10
---

<!-- overview -->

Esta página mostra como executar tarefas automatizadas usando o objeto {{< glossary_tooltip text="CronJob" term_id="cronjob" >}} no kubernetes.

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Criando um CronJob {#creating-a-cron-job}

Cron jobs requerem um arquivo de configuração.
Aqui está um manifesto para CronJob que executa uma tarefa de demonstração simples a cada minuto:

{{% code_sample file="application/job/cronjob.yaml" %}}

Execute o exemplo de CronJob usando o seguinte comando:

```shell
kubectl create -f https://k8s.io/examples/application/job/cronjob.yaml
```
A saída é semelhante a esta:

```
cronjob.batch/hello created
```

Após criar o cron job, obtenha o status usando este comando:

```shell
kubectl get cronjob hello
```

A saída é semelhante a esta:

```
NAME    SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
hello   */1 * * * *   False     0        <none>          10s
```

Como você pode ver pelos resultados do comando, o cron job ainda não agendou ou executou uma tarefa ainda.
{{< glossary_tooltip text="Observe" term_id="watch" >}} que a tarefa será criada em cerca de um minuto:

```shell
kubectl get jobs --watch
```
A saída é semelhante a esta:

```
NAME               COMPLETIONS   DURATION   AGE
hello-4111706356   0/1                      0s
hello-4111706356   0/1           0s         0s
hello-4111706356   1/1           5s         5s
```

Agora você viu uma tarefa em execução agendada pelo cron job "hello".
Você pode parar de observá-lo e visualizar o cron job novamente para ver que ele agendou a tarefa:

```shell
kubectl get cronjob hello
```

A saída é semelhante a esta:

```
NAME    SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
hello   */1 * * * *   False     0        50s             75s
```

Você deve ver que o cron job `hello` agendou uma tarefa com sucesso no tempo especificado em
`LAST SCHEDULE`. Existem atualmente 0 tarefas ativas, o que significa que a tarefa foi concluída ou falhou.

Agora, encontre os pods da última tarefa agendada criada e veja a saída padrão de um dos pods.

{{< note >}}
O nome da tarefa é diferente do nome do pod.
{{< /note >}}

```shell
# Replace "hello-4111706356" with the job name in your system
pods=$(kubectl get pods --selector=job-name=hello-4111706356 --output=jsonpath={.items[*].metadata.name})
```
Veja os logs do pod:

```shell
kubectl logs $pods
```
A saída é semelhante a esta:

```
Fri Feb 22 11:02:09 UTC 2019
Hello from the Kubernetes cluster
```

## Deletando um CronJob {#deleting-a-cron-job}

Quando você não precisar mais de um cron job, exclua-o com `kubectl delete cronjob <cronjob name>`:

```shell
kubectl delete cronjob hello
```

Excluindo o cron job remove todas as tarefas e pods que ele criou e impede a criação de novas tarefas.
Você pode ler mais sobre como remover tarefas em [garbage collection](/docs/concepts/architecture/garbage-collection/).
