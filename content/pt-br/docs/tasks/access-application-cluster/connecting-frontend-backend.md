---
title: Conectando um Frontend a um Backend usando Serviços
content_type: tutorial
weight: 70
---

<!-- overview -->

Esta tarefa mostra como criar um microserviço *frontend* e um microserviço *backend*. O microserviço backend é um serviço que envia uma mensagem de saudação. O frontend expõe o backend usando o nginx e um objeto {{< glossary_tooltip term_id="service" >}} do Kubernetes.

## {{% heading "objectives" %}}

* Crie e execute um microserviço de backend de amostra chamado `hello` usando um objeto {{< glossary_tooltip term_id="deployment" >}}.
* Use um objeto de serviço (`Service`) para enviar tráfego para as várias réplicas do microserviço de backend.
* Crie e execute um microserviço de frontend chamado `nginx`, também usando um objeto `Deployment`.
* Configure o microserviço de frontend para enviar tráfego para o microserviço de backend. 
* Use um objeto `Service` do tipo `LoadBalancer` para expor o microserviço de frontend fora do cluster.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Esta tarefa utiliza [Serviços com balanceadores de carga externos](/docs/tasks/access-application-cluster/create-external-load-balancer/), que necessitam de um ambiente suportado. Se o seu ambiente não suportar isso, você pode substituir por um serviço do tipo [`NodePort`](/docs/concepts/services-networking/service/#type-nodeport).

<!-- lessoncontent -->

## Criando o backend usando um Deployment.

O backend é um microserviço simples de saudação. Aqui está o arquivo de configuração para o Deployment do backend:
{{% codenew file="service/access/backend-deployment.yaml" %}}

Crie o `Deployment` do backend:

```shell
kubectl apply -f https://k8s.io/examples/service/access/backend-deployment.yaml
```

Veja informações sobre o `Deployment` do backend:

```shell
kubectl describe deployment backend
```

A saída é semelhante a esta:

```
Name:                           backend
Namespace:                      default
CreationTimestamp:              Mon, 24 Oct 2016 14:21:02 -0700
Labels:                         app=hello
                                tier=backend
                                track=stable
Annotations:                    deployment.kubernetes.io/revision=1
Selector:                       app=hello,tier=backend,track=stable
Replicas:                       3 desired | 3 updated | 3 total | 3 available | 0 unavailable
StrategyType:                   RollingUpdate
MinReadySeconds:                0
RollingUpdateStrategy:          1 max unavailable, 1 max surge
Pod Template:
  Labels:       app=hello
                tier=backend
                track=stable
  Containers:
   hello:
    Image:              "gcr.io/google-samples/hello-go-gke:1.0"
    Port:               80/TCP
    Environment:        <none>
    Mounts:             <none>
  Volumes:              <none>
Conditions:
  Type          Status  Reason
  ----          ------  ------
  Available     True    MinimumReplicasAvailable
  Progressing   True    NewReplicaSetAvailable
OldReplicaSets:                 <none>
NewReplicaSet:                  hello-3621623197 (3/3 replicas created)
Events:
...
```

## Criando o objeto Service `hello`

A chave para enviar solicitações do frontend para o backend é o `Service` do backend. Um `Service` cria um endereço IP persistente e uma entrada de nome DNS, para que o microserviço do backend possa ser sempre acessado. Um `Service` usa {{< glossary_tooltip text="seletores" term_id="selector" >}} para encontrar os `Pods` para os quais ele roteia o tráfego.

Primeiro, explore o arquivo de configuração do `Service`:

{{% codenew file="service/access/backend-service.yaml" %}}

No arquivo de configuração, você pode ver que o `Service`, chamado de `hello`, roteia o tráfego para Pods que possuem as labels `app: hello` e `tier: backend`.

Crie o `Service` para o backend:

```shell
kubectl apply -f https://k8s.io/examples/service/access/backend-service.yaml
```

Neste ponto, você possui um `Deployment` chamado `backend` executando três réplicas do seu aplicativo `hello` e possui um `Service` que pode rotear o tráfego para eles. No entanto, esse serviço ainda não pode ser acessado ou resolvido fora do cluster.

## Criando o frontend

Agora que o seu backend está em execução, você pode criar um frontend que seja acessível fora do cluster e se conecte ao backend por meio de solicitações de proxy.

O frontend envia solicitações para os worker Pods do backend usando o nome DNS fornecido ao Serviço do backend. O nome DNS é `hello`, que é o valor do campo `name` no arquivo de configuração `examples/service/access/backend-service.yaml`.

Os Pods no Deployment do frontend executam uma imagem nginx que é configurada para fazer proxy de solicitações para o Serviço de backend `hello`. Aqui está o arquivo de configuração nginx:

{{% codenew file="service/access/frontend-nginx.conf" %}}

Similarmente ao backend, o frontend possui um `Deployment` e um `Service`. Uma diferença importante a ser notada entre os serviços de backend e frontend é que a configuração do serviço de frontend tem o parâmetro `type: LoadBalancer`, o que significa que o serviço usa um balanceador de carga fornecido pelo provedor de nuvem e será acessível de fora do cluster.

{{% codenew file="service/access/frontend-service.yaml" %}}

{{% codenew file="service/access/frontend-deployment.yaml" %}}

Crie o `Deployment` e o `Service` para o frontend:

```shell
kubectl apply -f https://k8s.io/examples/service/access/frontend-deployment.yaml
kubectl apply -f https://k8s.io/examples/service/access/frontend-service.yaml
```

A saída mostra que ambos os recursos foram criados:

```
deployment.apps/frontend created
service/frontend created
```

{{< note >}}
A configuração do nginx está incorporada à [imagem do contêiner](/examples/service/access/Dockerfile). Uma maneira melhor de fazer isso seria usar um [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/), para que seja possível alterar a configuração com mais facilidade.
{{< /note >}}

## Interagindo com o `Service` frontend

Depois de criar um `Service` do tipo `LoadBalancer`, você pode usar este comando para encontrar o IP externo:

```shell
kubectl get service frontend --watch
```

Isso exibe a configuração do `Service` frontend e fica monitorando por mudanças. Inicialmente, o IP externo é exibido como `<pending>`:

```
NAME       TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)  AGE
frontend   LoadBalancer   10.51.252.116   <pending>     80/TCP   10s
```

Assim que um IP externo é provisionado, a configuração é atualizada para incluir o novo IP na seção `EXTERNAL-IP`:

```
NAME       TYPE           CLUSTER-IP      EXTERNAL-IP        PORT(S)  AGE
frontend   LoadBalancer   10.51.252.116   XXX.XXX.XXX.XXX    80/TCP   1m
```

Esse IP agora pode ser usado para interagir com o serviço `frontend` de fora do cluster.

## Enviando tráfego por meio do frontend

Agora que o frontend e o backend estão conectados, você pode acessar o `endpoint` usando o comando `curl` no IP externo do seu serviço frontend:

```shell
curl http://${EXTERNAL_IP} # substitua isto pelo `EXTERNAL-IP` que você viu antes
```
A saída mostra a mensagem gerada pelo backend:

```json
{"message":"Hello"}
```

## {{% heading "cleanup" %}}

Para excluir os `Services`, digite este comando:

```shell
kubectl delete services frontend backend
```

Para excluir os `Deployments`, `ReplicaSets` e `Pods que estão executando as aplicações frontend e backend, digite este comando:

```shell
kubectl delete deployment frontend backend
```

## {{% heading "whatsnext" %}}

* Saiba mais sobre [`Services`](/docs/concepts/services-networking/service/)
* Saiba mais sobre [`ConfigMaps`](/docs/tasks/configure-pod-container/configure-pod-configmap/)
* Saiba mais sobre [DNS para `Services` e `Pods`](/docs/concepts/services-networking/dns-pod-service/)
