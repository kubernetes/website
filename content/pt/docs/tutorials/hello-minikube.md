---
title: Olá, Minikube!
content_type: tutorial
weight: 5
menu:
  main:
    title: "Iniciar"
    weight: 10
    post: >
      <p>Pronto para meter a mão na massa? Vamos criar um cluster Kubernetes simples e executar uma aplicacão exemplo.</p>
card:
  name: tutorials
  weight: 10
---

<!-- overview -->

Este tutorial mostra como executar uma aplicação exemplo no Kubernetes utilizando o [Minikube](https://minikube.sigs.k8s.io) e o [Katacoda](https://www.katacoda.com). O Katacoda disponibiliza um ambiente Kubernetes gratuito e acessível via navegador. 

{{< note >}}
Você também consegue seguir os passos desse tutorial instalando o Minikube localmente. Para instruções de instalação, acesse: [iniciando com minikube](https://minikube.sigs.k8s.io/docs/start/).
{{< /note >}}

## Objetivos

* Instalar uma aplicação exemplo no minikube.
* Executar a aplicação.
* Visualizar os logs da aplicação.

## Antes de você iniciar

Este tutorial disponibiliza uma imagem de contêiner que utiliza o NGINX para retornar todas as requisições.

<!-- lessoncontent -->

## Criando um cluster do Minikube

1. Clique no botão abaixo **para iniciar o terminal do Katacoda**.

    {{< kat-button >}}

{{< note >}}
Se você instalou o Minikube localmente, execute: `minikube start`.
{{< /note >}}

2. Abra o painel do Kubernetes em um navegador: 

    ```shell
    minikube dashboard
    ```

3. Apenas no ambiente do Katacoda: Na parte superior do terminal, clique em **Preview Port 30000**.

## Criando um Deployment

Um [*Pod*](/docs/concepts/workloads/pods/) Kubernetes consiste em um ou mais contêineres agrupados para fins de administração e gerenciamento de rede. O Pod desse tutorial possui apenas um contêiner. Um [*Deployment*](/docs/concepts/workloads/controllers/deployment/) Kubernetes verifica a saúde do seu Pod e reinicia o contêiner do Pod caso o mesmo seja finalizado. Deployments são a maneira recomendada de gerenciar a criação e escalonamento dos Pods.

1. Usando o comando `kubectl create` para criar um Deployment que gerencia um Pod. O Pod executa um contêiner baseado na imagem docker disponibilizada.

    ```shell
    kubectl create deployment hello-node --image=k8s.gcr.io/echoserver:1.4
    ```

2. Visualizando o Deployment:

    ```shell
    kubectl get deployments
    ```

    A saída será semelhante a:

    ```
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1/1     1            1           1m
    ```

3. Visualizando o Pod:

    ```shell
    kubectl get pods
    ```

    A saída será semelhante a:

    ```
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

4. Visualizando os eventos do cluster:

    ```shell
    kubectl get events
    ```

5. Visualizando a configuração do `kubectl`:

    ```shell
    kubectl config view
    ```

{{< note >}}
Para mais informações sobre o comando `kubectl`, veja o [kubectl overview](/docs/reference/kubectl/overview/).
{{< /note >}}

## Criando um serviço

Por padrão, um Pod só é acessível utilizando o seu endereço IP interno no cluster Kubernetes. Para dispobiblilizar o contêiner `hello-node` fora da rede virtual do Kubernetes, você deve expor o Pod como um [*serviço*](/docs/concepts/services-networking/service/) Kubernetes.

1. Expondo o Pod usando o comando `kubectl expose`:

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```

    O parâmetro `--type=LoadBalancer` indica que você deseja expor o seu serviço fora do cluster Kubernetes.
    
    A aplicação dentro da imagem `k8s.gcr.io/echoserver` "escuta" apenas na porta TCP 8080. Se você usou
     `kubectl expose` para expor uma porta diferente, os clientes não conseguirão se conectar a essa outra porta.

2. Visualizando o serviço que você acabou de criar:

    ```shell
    kubectl get services
    ```

    A saída será semelhante a:

    ```
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
    kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
    ```

    Em provedores de Cloud que fornecem serviços de balanceamento de carga para o Kubernetes, um IP externo seria provisionado para acessar o serviço. No Minikube, o tipo `LoadBalancer` torna o serviço acessível por meio do comando `minikube service`.

3. Executar o comando a seguir:

    ```shell
    minikube service hello-node
    ```

4. (**Apenas no ambiente do Katacoda**) Clicar no sinal de mais e então clicar em **Select port to view on Host 1**.

5. (**Apenas no ambiente do Katacoda**) Observe o número da porta com 5 dígitos exibido ao lado de `8080` na saída do serviço. Este número de porta é gerado aleatoriamente e pode ser diferente para você. Digite seu número na caixa de texto do número da porta e clique em **Display Port**. Usando o exemplo anterior, você digitaria `30369`.

Isso abre uma janela do navegador, acessa o seu aplicativo e mostra o retorno da requisição.

## Habilitando Complementos (addons)

O Minikube inclui um conjunto integrado de {{< glossary_tooltip text="complementos" term_id="addons" >}} que podem ser habilitados, desabilitados e executados no ambiente Kubernetes local.

1. Listando os complementos suportados atualmente:

    ```shell
    minikube addons list
    ```

    A saída será semelhante a:

    ```
    addon-manager: enabled
    dashboard: enabled
    default-storageclass: enabled
    efk: disabled
    freshpod: disabled
    gvisor: disabled
    helm-tiller: disabled
    ingress: disabled
    ingress-dns: disabled
    logviewer: disabled
    metrics-server: disabled
    nvidia-driver-installer: disabled
    nvidia-gpu-device-plugin: disabled
    registry: disabled
    registry-creds: disabled
    storage-provisioner: enabled
    storage-provisioner-gluster: disabled
    ```

2. Habilitando um complemento, por exemplo, `metrics-server`:

    ```shell
    minikube addons enable metrics-server
    ```

    A saída será semelhante a:

    ```
    metrics-server was successfully enabled
    ```

3. Visualizando os Pods e os Serviços que você acabou de criar:

    ```shell
    kubectl get pod,svc -n kube-system
    ```

    A saída será semelhante a:

    ```
    NAME                                        READY     STATUS    RESTARTS   AGE
    pod/coredns-5644d7b6d9-mh9ll                1/1       Running   0          34m
    pod/coredns-5644d7b6d9-pqd2t                1/1       Running   0          34m
    pod/metrics-server-67fb648c5                1/1       Running   0          26s
    pod/etcd-minikube                           1/1       Running   0          34m
    pod/influxdb-grafana-b29w8                  2/2       Running   0          26s
    pod/kube-addon-manager-minikube             1/1       Running   0          34m
    pod/kube-apiserver-minikube                 1/1       Running   0          34m
    pod/kube-controller-manager-minikube        1/1       Running   0          34m
    pod/kube-proxy-rnlps                        1/1       Running   0          34m
    pod/kube-scheduler-minikube                 1/1       Running   0          34m
    pod/storage-provisioner                     1/1       Running   0          34m

    NAME                           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
    service/metrics-server         ClusterIP   10.96.241.45    <none>        80/TCP              26s
    service/kube-dns               ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP       34m
    service/monitoring-grafana     NodePort    10.99.24.54     <none>        80:30002/TCP        26s
    service/monitoring-influxdb    ClusterIP   10.111.169.94   <none>        8083/TCP,8086/TCP   26s
    ```

4. Desabilitando o complemento `metrics-server`:

    ```shell
    minikube addons disable metrics-server
    ```

    A saída será semelhante a:

    ```
    metrics-server was successfully disabled
    ```

## Removendo os recursos do Minikube

Agora você pode remover todos os recursos criados no seu cluster:

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```
(**Opcional**) Pare a máquina virtual (VM) do Minikube:

```shell
minikube stop
```
(**Opcional**) Remova a VM do Minikube:

```shell
minikube delete
```

## Próximos passos

* Aprender mais sobre [Deployment objects](/docs/concepts/workloads/controllers/deployment/).
* Aprender mais sobre [Deploying applications](/docs/tasks/run-application/run-stateless-application-deployment/).
* Aprender mais sobre [Service objects](/docs/concepts/services-networking/service/).

