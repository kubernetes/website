---
title: Olá, Minikube!
content_type: tutorial
weight: 5
card:
  name: tutorials
  weight: 10
---

<!-- overview -->

Este tutorial demonstra como executar uma aplicação exemplo no Kubernetes utilizando
o minikube.
O tutorial fornece uma imagem de contêiner que utiliza o NGINX para repetir todas
as requisições.

## {{% heading "objectives" %}}

* Instalar uma aplicação exemplo no minikube.
* Executar a aplicação.
* Visualizar os logs da aplicação.

## {{% heading "prerequisites" %}}

Este tutorial assume que você já tem uma instância do `minikube` configurada.
Veja [minikube start](https://minikube.sigs.k8s.io/docs/start/) para instruções
de como instalar.

Você também irá precisar instalar o `kubectl`.
Veja [instalando ferramentas](/pt-br/docs/tasks/tools/#kubectl) para instruções de como
instalar.

<!-- lessoncontent -->

## Criando um cluster do minikube

```shell
minikube start
```

## Abra o painel (_dashboard_)

Abra o painel (_dashboard_) do Kubernetes. Você pode fazer isso de duas formas
distintas:

{{< tabs name="dashboard" >}}
{{% tab name="Abra um navegador" %}}
Abra um **novo** terminal e rode o comando:
```shell
# Inicie um novo terminal e deixe este comando rodando.
minikube dashboard
```

Agora, retorne para o terminal onde você executou o comando `minikube start`.

{{< note >}}
O comando `dashboard` habilita o complemento do painel e abre o proxy no navegador
padrão. Você pode criar recursos do Kubernetes no painel, como Deployment e
Service.

Se você estiver executando num ambiente com o usuário _root_, veja
[Abrir o Painel com URL](#open-dashboard-with-url).

Por padrão, o painel só é acessível pela rede virtual interna do Kubernetes. O
comando `dashboard` cria um proxy temporário para tornar o painel acessível por
fora da rede virtual do Kubernetes.

Para parar o proxy, utilize o comando `Ctrl+C` para encerrar o processo.
Após o término do comando, o painel permanece executando no cluster do Kubernetes.
Você pode executar o comando `dashboard` novamente para criar outro proxy para
acessar o painel.
{{< /note >}}

{{% /tab %}}
{{% tab name="Copie e cole a URL" %}}

Se você não deseja que o minikube abra um navegador para você, rode o comando
`dashboard` com a opção de linha de comando `--url`. O minikube irá imprimir
uma URL que você poderá abrir no navegador de sua preferência.

Abra um **novo** terminal e rode o comando:
```shell
# Inicie um novo terminal e deixe este comando rodando.
minikube dashboard --url
```

Agora, retorne para o terminal onde você executou o comando `minikube start`.

{{% /tab %}}
{{< /tabs >}}

## Criando um Deployment

Um [*Pod*](/docs/concepts/workloads/pods/) do Kubernetes consiste em um ou mais
contêineres agrupados para fins de administração e gerenciamento de rede. O Pod
deste tutorial possui apenas um contêiner. Um
[*Deployment*](/docs/concepts/workloads/controllers/deployment/) do Kubernetes
verifica a integridade do seu Pod e reinicia o contêiner do Pod caso este seja
finalizado. Deployments são a maneira recomendada de gerenciar a criação e
escalonamento dos Pods.

1. Usando o comando `kubectl create` para criar um Deployment que gerencia um Pod.
   O Pod executa um contêiner baseado na imagem do Docker disponibilizada.

    ```shell
    kubectl create deployment hello-node --image=registry.k8s.io/echoserver:1.4
    ```

1. Visualize o Deployment:

    ```shell
    kubectl get deployments
    ```

    A saída será semelhante a:

    ```
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1/1     1            1           1m
    ```

1. Visualize o Pod:

    ```shell
    kubectl get pods
    ```

    A saída será semelhante a:

    ```
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

1. Visualize os eventos do cluster:

    ```shell
    kubectl get events
    ```

1. Visualize a configuração do `kubectl`:

    ```shell
    kubectl config view
    ```

{{< note >}}
Para mais informações sobre o comando `kubectl`, consulte
[visão geral do kubectl](/docs/reference/kubectl/).
{{< /note >}}

## Criando um Serviço

Por padrão, um Pod só é acessível utilizando o seu endereço IP interno no cluster
Kubernetes. Para dispobiblilizar o contêiner `hello-node` fora da rede virtual do
Kubernetes, você deve expor o Pod como um
[*Service*](/docs/concepts/services-networking/service/) do Kubernetes.

1. Exponha o Pod usando o comando `kubectl expose`:

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```

    O parâmetro `--type=LoadBalancer` indica que você deseja expor o seu serviço
    fora do cluster Kubernetes.
    
    A aplicação dentro da imagem de teste escuta apenas na porta TCP 8080. Se
    você usou `kubectl expose` para expor uma porta diferente, os clientes não
    conseguirão se conectar a essa outra porta.

1. Visualize o serviço que você acabou de criar:

    ```shell
    kubectl get services
    ```

    A saída será semelhante a:

    ```
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
    kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
    ```

    Em provedores de nuvem que fornecem serviços de balanceamento de carga para
    o Kubernetes, um IP externo seria provisionado para acessar o serviço. No
    minikube, o tipo `LoadBalancer` torna o serviço acessível por meio do comando
    `minikube service`.

1. Execute o comando a seguir:

    ```shell
    minikube service hello-node
    ```

    Este comando abre uma janela do navegador que serve o seu aplicativo e exibe
    o retorno da requisição ao aplicativo.

## Habilitando Complementos (addons)

A ferramenta minikube inclui um conjunto integrado de {{< glossary_tooltip text="complementos" term_id="addons" >}}
que podem ser habilitados, desabilitados e executados no ambiente Kubernetes local.

1. Liste os complementos suportados atualmente:

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

2. Habilite um complemento, por exemplo, `metrics-server`:

    ```shell
    minikube addons enable metrics-server
    ```

    A saída será semelhante a:

    ```
    The 'metrics-server' addon is enabled
    ```

3. Visualize o Pod e o Service que você acabou de criar:

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

4. Desabilite o complemento `metrics-server`:

    ```shell
    minikube addons disable metrics-server
    ```

    A saída será semelhante a:

    ```
    metrics-server was successfully disabled
    ```

## Limpeza

Agora você pode remover todos os recursos criados no seu cluster:

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

Encerre o cluster do minikube:

```shell
minikube stop
```

(Opcional) Apague a máquina virtual (VM) do minikube:

```shell
# Opcional
minikube delete
```

Se você desejar utilizar o minikube novamente para aprender mais sobre o Kubernetes,
você não precisa apagar a VM.

## {{% heading "whatsnext" %}}

* Aprenda mais sobre [objetos Deployment](/docs/concepts/workloads/controllers/deployment/).
* Aprenda mais sobre [implantar aplicações](/docs/tasks/run-application/run-stateless-application-deployment/).
* Aprenda mais sobre [objetos Service](/docs/concepts/services-networking/service/).
