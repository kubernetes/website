---
title: Use o redirecionamento de porta para acessar aplicativos em um cluster.
content_type: task
weight: 40
min-kubernetes-server-version: v1.10
---

<!-- overview -->

Esta página mostra como usar o `kubectl port-forward` para se conectar a um servidor MongoDB em execução em um cluster Kubernetes. Esse tipo de conexão pode ser útil para depuração de bancos de dados.

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
* Instale o [MongoDB Shell](https://www.mongodb.com/try/download/shell).

<!-- steps -->

## Criando a implantação e o serviço do MongoDB

1. Crie uma Implantação que execute o MongoDB:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mongodb/mongo-deployment.yaml
   ```

   A saída de um comando bem-sucedido verifica que a implantação foi criada:

   ```
   deployment.apps/mongo criado
   ```

   Visualize o status do pod para verificar se ele está pronto:

   ```shell
   kubectl get pods
   ```

   A saída exibe o pod criado:

   ```
   NAME                     READY   STATUS    RESTARTS   AGE
   mongo-75f59d57f4-4nd6q   1/1     Em execução   0          2m4s
   ```

   Visualize o status da implantação:

   ```shell
   kubectl get deployment
   ```

   A saída exibe que a implantação foi criada:

   ```
   NAME    READY   UP-TO-DATE   AVAILABLE   AGE
   mongo   1/1     1            1           2m21s
   ```

   A implantação gerencia automaticamente um conjunto de réplicas.
   Visualize o status do conjunto de réplicas usando:

   ```shell
   kubectl get replicaset
   ```

   Visualize o status do conjunto de réplicas usando:

   ```
   NAME               DESIRED   CURRENT   READY   AGE
   mongo-75f59d57f4   1         1         1       3m12s
   ```

2. Crie um serviço para expor o MongoDB na rede:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mongodb/mongo-service.yaml
   ```

   A saída de um comando bem-sucedido verifica que o serviço foi criado:

   ```
   service/mongo criado
   ```

   Verifique o serviço criado::

   ```shell
   kubectl get service mongo
   ```

   A saída exibe o serviço criado:

   ```
   NAME    TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)     AGE
   mongo   ClusterIP   10.96.41.183   <none>        27017/TCP   11s
   ```

3. Verifique se o servidor MongoDB está sendo executado no Pod e ouvindo a porta 27017:

   ```shell
   # Altere mongo-75f59d57f4-4nd6q para o nome do Pod
   kubectl get pod mongo-75f59d57f4-4nd6q --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
   ```

   A saída exibe a porta para o MongoDB nesse Pod:

   ```
   27017
   ```

   27017 é a porta TCP alocada ao MongoDB na internet.

## Encaminhe uma porta local para uma porta no Pod

1. `kubectl port-forward` permite usar o nome do recurso, como o nome do pod, para selecionar um pod correspondente para encaminhar a porta.


   ```shell
   # Altere mongo-75f59d57f4-4nd6q para o nome do Pod
   kubectl port-forward mongo-75f59d57f4-4nd6q 28015:27017
   ```

   que é o mesmo que

   ```shell
   kubectl port-forward pods/mongo-75f59d57f4-4nd6q 28015:27017
   ```

   ou

   ```shell
   kubectl port-forward deployment/mongo 28015:27017
   ```

   ou

   ```shell
   kubectl port-forward replicaset/mongo-75f59d57f4 28015:27017
   ```

   ou

   ```shell
   kubectl port-forward service/mongo 28015:27017
   ```

   Qualquer um dos comandos acima funciona. A saída é semelhante a esta:

   ```
   Encaminhamento de 127.0.0.1:28015 -> 27017
   Encaminhamento de [::1]:28015 -> 27017
   ```

   {{< note >}}
   `kubectl port-forward` não retorna. Para continuar com os exercícios, você precisará abrir outro terminal.
   {{< /note >}}

2. Inicie a interface de linha de comando do MongoDB:

   ```shell
   mongosh --port 28015
   ```

3. No prompt de comando do MongoDB, digite o comando `ping`:

   ```
   db.runCommand( { ping: 1 } )
   ```

   Uma solicitação de ping bem-sucedida retorna:

   ```
   { ok: 1 }
   ```

### Opcionalmente, deixe kubectl escolher a porta local {#let-kubectl-choose-local-port}

Se você não precisa de uma porta local específica, pode permitir que o `kubectl` escolha e reserve a porta local e, assim, evitar ter que gerenciar conflitos de porta local, com a sintaxe ligeiramente mais simples:

```shell
kubectl port-forward deployment/mongo :27017
```

A ferramenta `kubectl` encontra um número de porta local que não está em uso (evitando números de porta baixos, porque esses podem ser usados por outras aplicações). A saída é semelhante a:

```
Encaminhamento de 127.0.0.1:63753 -> 27017
Encaminhamento de [::1]:63753 -> 27017
```

<!-- discussion -->

## Discussão

As conexões feitas à porta local 28015 são encaminhadas para a porta 27017 do Pod que está executando o servidor MongoDB. Com esta conexão em vigor, você pode usar seu local de trabalho para depurar o banco de dados que está sendo executado no Pod.

{{< note >}}
`kubectl port-forward` é implementado apenas para portas TCP.
O suporte ao protocolo UDP é rastreado em
[issue 47862](https://github.com/kubernetes/kubernetes/issues/47862).
{{< /note >}}

## {{% heading "whatsnext" %}}

Saiba mais sobre [kubectl port-forward](/docs/reference/generated/kubectl/kubectl-commands/#port-forward).
