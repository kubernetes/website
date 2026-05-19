---
title: Executar uma Aplicação Sem Estado com um Deployment
min-kubernetes-server-version: v1.9
content_type: tutorial
weight: 10
---

<!-- overview -->

Esta página mostra como executar uma aplicação usando um objeto Deployment do Kubernetes.

## {{% heading "objectives" %}}

- Criar uma instalação do nginx com um Deployment.
- Usar o kubectl para listar informações sobre o Deployment.
- Atualizar o Deployment.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- lessoncontent -->

## Criando e explorando uma instalação do nginx com um Deployment

Você pode executar uma aplicação criando um objeto Deployment do Kubernetes, e pode descrever um Deployment em um arquivo YAML. Por exemplo, este arquivo YAML descreve um Deployment que executa a imagem do contêiner nginx:1.14.2:

{{% code_sample file="application/deployment.yaml" %}}

1. Crie um Deployment com base no arquivo YAML:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/deployment.yaml
   ```

1. Exiba informações sobre o Deployment:

   ```shell
   kubectl describe deployment nginx-deployment
   ```

   A saída é semelhante a esta:

   ```
   Name:     nginx-deployment
   Namespace:    default
   CreationTimestamp:  Tue, 30 Aug 2016 18:11:37 -0700
   Labels:     app=nginx
   Annotations:    deployment.kubernetes.io/revision=1
   Selector:   app=nginx
   Replicas:   2 desired | 2 updated | 2 total | 2 available | 0 unavailable
   StrategyType:   RollingUpdate
   MinReadySeconds:  0
   RollingUpdateStrategy:  1 max unavailable, 1 max surge
   Pod Template:
     Labels:       app=nginx
     Containers:
       nginx:
       Image:              nginx:1.14.2
       Port:               80/TCP
       Environment:        <none>
       Mounts:             <none>
     Volumes:              <none>
   Conditions:
     Type          Status  Reason
     ----          ------  ------
     Available     True    MinimumReplicasAvailable
     Progressing   True    NewReplicaSetAvailable
   OldReplicaSets:   <none>
   NewReplicaSet:    nginx-deployment-1771418926 (2/2 replicas created)
   No events.
   ```

1. Liste os Pods criados pelo Deployment:

   ```shell
   kubectl get pods -l app=nginx
   ```

   A saída é semelhante a esta:

   ```
   NAME                                READY     STATUS    RESTARTS   AGE
   nginx-deployment-1771418926-7o5ns   1/1       Running   0          16h
   nginx-deployment-1771418926-r18az   1/1       Running   0          16h
   ```

1. Exiba informações sobre um Pod:

   ```shell
   kubectl describe pod <pod-name>
   ```

   onde `<pod-name>` é o nome de um dos seus Pods.

## Atualizando o Deployment

Você pode atualizar o Deployment aplicando um novo arquivo YAML. Este arquivo YAML especifica que o Deployment deve ser atualizado para usar o nginx:1.16.1.

{{% code_sample file="application/deployment-update.yaml" %}}

1. Aplique o novo arquivo YAML:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/deployment-update.yaml
   ```

1. Observe o Deployment criar Pods com novos nomes e excluir os Pods antigos:

   ```shell
   kubectl get pods -l app=nginx
   ```

## Escalonando a aplicação aumentando a contagem de réplicas

Você pode aumentar o número de Pods no seu Deployment aplicando um novo arquivo YAML. Este arquivo YAML define `replicas` como 4, o que especifica que o Deployment deve ter quatro Pods:

{{% code_sample file="application/deployment-scale.yaml" %}}

1. Aplique o novo arquivo YAML:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/deployment-scale.yaml
   ```

1. Verifique que o Deployment possui quatro Pods:

   ```shell
   kubectl get pods -l app=nginx
   ```

   A saída é semelhante a esta:

   ```
   NAME                               READY     STATUS    RESTARTS   AGE
   nginx-deployment-148880595-4zdqq   1/1       Running   0          25s
   nginx-deployment-148880595-6zgi1   1/1       Running   0          25s
   nginx-deployment-148880595-fxcez   1/1       Running   0          2m
   nginx-deployment-148880595-rwovn   1/1       Running   0          2m
   ```

## Excluindo um Deployment

Exclua o Deployment pelo nome:

```shell
kubectl delete deployment nginx-deployment
```

## Controladores de Replicação -- a Forma Antiga

A forma preferida de criar uma aplicação replicada é usar um Deployment, que por sua vez utiliza um ReplicaSet. Antes do Deployment e do ReplicaSet serem adicionados ao Kubernetes, aplicações replicadas eram configuradas usando um [Controlador de Replicação (ReplicationController)](/docs/concepts/workloads/controllers/replicationcontroller/).

## {{% heading "whatsnext" %}}

- Saiba mais sobre [objeto Deployment](/docs/concepts/workloads/controllers/deployment/).
