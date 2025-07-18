---
title: Executar uma Aplicação Com Estado e de Instância Única
content_type: tutorial
weight: 20
---

<!-- overview -->

Esta página mostra como executar um aplicativo com estado e de instância única no Kubernetes utilizando um PersistentVolume e um Deployment.
O aplicativo utilizado é o MySQL.

## {{% heading "objectives" %}}

- Crie um PersistentVolume referenciando um disco no seu ambiente.
- Crie um Deployment do MySQL.
- Exponha o MySQL para outros pods no cluster em um nome DNS conhecido.

## {{% heading "prerequisites" %}}

- {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

- {{< include "default-storage-class-prereqs.md" >}}

<!-- lessoncontent -->

## Fazer o deploy do MySQL

Você pode executar um aplicativo com estado criando um Deployment do Kubernetes e conectando-o a um PersistentVolume existente usando um PersistentVolumeClaim. Por exemplo, este arquivo YAML descreve um Deployment que executa o MySQL e faz referência ao PersistentVolumeClaim. O arquivo define um volume mount para /var/lib/mysql e, em seguida, cria um PersistentVolumeClaim que procura por um volume de 20G. Essa requisição é atendida por qualquer volume existente que atenda aos requisitos ou por um provisionador dinâmico.

Note: A senha é definida no arquivo de configuração yaml, e isso não é seguro. Veja
[Secrets do Kubernetes](/docs/concepts/configuration/secret/) para uma solução segura.

{{% code_sample file="application/mysql/mysql-deployment.yaml" %}}
{{% code_sample file="application/mysql/mysql-pv.yaml" %}}

1. Faça o deploy do PV e do PVC do arquivo YAML:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mysql/mysql-pv.yaml
   ```

1. Faça o deploy do conteúdo do arquivo YAML:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mysql/mysql-deployment.yaml
   ```

1. Exiba informações sobre o Deployment:

   ```shell
   kubectl describe deployment mysql
   ```

   A saída é semelhante a esta:

   ```
   Name:                 mysql
   Namespace:            default
   CreationTimestamp:    Tue, 01 Nov 2016 11:18:45 -0700
   Labels:               app=mysql
   Annotations:          deployment.kubernetes.io/revision=1
   Selector:             app=mysql
   Replicas:             1 desired | 1 updated | 1 total | 0 available | 1 unavailable
   StrategyType:         Recreate
   MinReadySeconds:      0
   Pod Template:
     Labels:       app=mysql
     Containers:
       mysql:
       Image:      mysql:9
       Port:       3306/TCP
       Environment:
         MYSQL_ROOT_PASSWORD:      password
       Mounts:
         /var/lib/mysql from mysql-persistent-storage (rw)
     Volumes:
       mysql-persistent-storage:
       Type:       PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)
       ClaimName:  mysql-pv-claim
       ReadOnly:   false
   Conditions:
     Type          Status  Reason
     ----          ------  ------
     Available     False   MinimumReplicasUnavailable
     Progressing   True    ReplicaSetUpdated
   OldReplicaSets:       <none>
   NewReplicaSet:        mysql-63082529 (1/1 replicas created)
   Events:
     FirstSeen    LastSeen    Count    From                SubobjectPath    Type        Reason            Message
     ---------    --------    -----    ----                -------------    --------    ------            -------
     33s          33s         1        {deployment-controller }             Normal      ScalingReplicaSet Scaled up replica set mysql-63082529 to 1
   ```

1. Liste os pods criados pelo Deployment:

   ```shell
   kubectl get pods -l app=mysql
   ```

   A saída é semelhante a esta:

   ```
   NAME                   READY     STATUS    RESTARTS   AGE
   mysql-63082529-2z3ki   1/1       Running   0          3m
   ```

1. Inspecione o PersistentVolumeClaim:

   ```shell
   kubectl describe pvc mysql-pv-claim
   ```

   A saída é semelhante a esta:

   ```
   Name:         mysql-pv-claim
   Namespace:    default
   StorageClass:
   Status:       Bound
   Volume:       mysql-pv-volume
   Labels:       <none>
   Annotations:    pv.kubernetes.io/bind-completed=yes
                   pv.kubernetes.io/bound-by-controller=yes
   Capacity:     20Gi
   Access Modes: RWO
   Events:       <none>
   ```

## Acessando a instância do MySQL

O arquivo YAML anterior cria um Service que permite que outros Pods no cluster acessem o banco de dados. A opção `clusterIP: None` faz com que o nome DNS do Service resolva diretamente para o endereço IP do Pod. Isso é ideal quando você tem apenas um Pod por trás do Service e não pretende aumentar o número de Pods.

Execute um cliente MySQL para se conectar ao servidor:

```shell
kubectl run -it --rm --image=mysql:9 --restart=Never mysql-client -- mysql -h mysql -ppassword
```

Este comando cria um novo Pod no cluster executando um cliente MySQL e o conecta ao servidor por meio do Service. Se a conexão for bem-sucedida, você saberá que seu banco de dados MySQL com estado está em funcionamento.

```
Waiting for pod default/mysql-client-274442439-zyp6i to be running, status is Pending, pod ready: false
If you don't see a command prompt, try pressing enter.

mysql>
```

## Atualizando

A imagem ou qualquer outra parte do Deployment pode ser atualizada normalmente
com o comando `kubectl apply`. Aqui estão algumas precauções específicas para aplicativos com estado:

- Não faça o escalonamento do aplicativo. Esta configuração é apenas para aplicativos de instância única.
  O PersistentVolume subjacente só pode ser montado em um Pod. Para aplicativos com estado em cluster, consulte a
  [documentação do StatefulSet](/docs/concepts/workloads/controllers/statefulset/).
- Use `strategy:` `type: Recreate` no arquivo YAML de configuração do Deployment.
  Isso instrui o Kubernetes a _não_ usar atualizações graduais. Atualizações graduais não funcionarão, pois não é possível ter mais de um Pod em execução ao mesmo tempo. A estratégia `Recreate` irá parar o primeiro Pod antes de criar um novo com a configuração atualizada.

## Excluindo um deployment

Exclua os objetos implantados pelo nome:

```shell
kubectl delete deployment,svc mysql
kubectl delete pvc mysql-pv-claim
kubectl delete pv mysql-pv-volume
```

Se você provisionou manualmente um PersistentVolume, também precisará excluí-lo manualmente, assim como liberar o recurso subjacente.
Se você usou um provisionador dinâmico, ele exclui automaticamente o PersistentVolume ao detectar que você excluiu o PersistentVolumeClaim.
Alguns provisionadores dinâmicos (como os de EBS e PD) também liberam o recurso subjacente ao excluir o PersistentVolume.

## {{% heading "whatsnext" %}}

- Saiba mais sobre [objetos Deployment](/docs/concepts/workloads/controllers/deployment/).

- Saiba mais sobre [implantação de aplicativos](/docs/tasks/run-application/run-stateless-application-deployment/)

- [Documentação do kubectl run](/docs/reference/generated/kubectl/kubectl-commands/#run)

- [Volumes](/docs/concepts/storage/volumes/) e [Persistent Volumes](/docs/concepts/storage/persistent-volumes/)
