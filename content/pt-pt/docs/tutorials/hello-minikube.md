---
title: Olá Minikube
content_type: tutorial
weight: 5
menu:
  main:
    title: "Começar a usar"
    weight: 10
    post: >
      <p>Pronto para sujar as mãos? Construa um cluster Kubernetes simples que executa uma aplicação de amostra.</p>
card:
  name: tutoriais
  weight: 10
---

<!-- overview -->

Este tutorial mostra como executar uma aplicação de amostra no Kubernetes usando o minikube.
O tutorial fornece uma imagem de contentor que utiliza o NGINX para ecoar de volta todos os pedidos recebidos.

## {{% heading "objectives" %}}

* Implementar uma aplicação de amostra no minikube.
* Executar a aplicação.
* Ver logs da aplicação.

## {{% heading "prerequisites" %}}


Este tutorial pressupõe que já configurou o `minikube`.
Veja o __Passo 1__ em [minikube start](https://minikube.sigs.k8s.io/docs/start/) para instruções de instalação.
{{< note >}}
Execute apenas as instruções no __Passo 1, Instalação__. O restante é abordado nesta página.  
{{< /note >}}

Também precisa de instalar o `kubectl`.
Veja [Instalar ferramentas](/docs/tasks/tools/#kubectl) para instruções de instalação.


<!-- lessoncontent -->

## Criar um cluster minikube

```shell
minikube start
```

## Abrir o Dashboard

Abra o dashboard do Kubernetes. Pode fazer isso de duas formas diferentes:

{{< tabs name="dashboard" >}}
{{% tab name="Lançar um navegador" %}}
Abra um **novo** terminal e execute:
```shell
# Abra um novo terminal e deixe isto a executar.
minikube dashboard
```

Agora, volte ao terminal onde executou `minikube start`.

{{< note >}}
O comando `dashboard` ativa o add-on do dashboard e abre o proxy no navegador web padrão.
Pode criar recursos Kubernetes no dashboard, como Deployment e Service.

Para descobrir como evitar invocar diretamente o navegador a partir do terminal e obter um URL para o dashboard web, veja o separador "URL copy and paste".

Por padrão, o dashboard só é acessível de dentro da rede virtual interna do Kubernetes.
O comando `dashboard` cria um proxy temporário para tornar o dashboard acessível de fora da rede virtual do Kubernetes.

Para parar o proxy, execute `Ctrl+C` para sair do processo.
Após o comando terminar, o dashboard continua a correr no cluster Kubernetes.
Pode executar novamente o comando `dashboard` para criar outro proxy para aceder ao dashboard.
{{< /note >}}

{{% /tab %}}
{{% tab name="URL copy and paste" %}}

Se não quiser que o minikube abra um navegador web por si, execute o subcomando `dashboard` com a flag
`--url`. O `minikube` gera um URL que pode abrir no navegador que preferir.

Abra um **novo** terminal e execute:
```shell
# Abra um novo terminal e deixe isto a executar.
minikube dashboard --url
```

Agora, pode usar este URL e voltar ao terminal onde executou `minikube start`.

{{% /tab %}}
{{< /tabs >}}

## Criar um Deployment

Um [*Pod*](/docs/concepts/workloads/pods/) do Kubernetes é um grupo de um ou mais Contentores,
ligados para fins de administração e rede. O Pod neste
tutorial tem apenas um Contentor. Um [*Deployment*](/docs/concepts/workloads/controllers/deployment/) do Kubernetes verifica a saúde do seu
Pod e reinicia o Contentor do Pod se este terminar. Deployments são a
forma recomendada de gerir a criação e escalamento de Pods.

1. Use o comando `kubectl create` para criar um Deployment que gere um Pod. O
   Pod executa um Contentor baseado na imagem Docker fornecida.

    ```shell
    # Execute uma imagem de contentor de teste que inclui um servidor web
    kubectl create deployment hello-node --image=registry.k8s.io/e2e-test-images/agnhost:2.39 -- /agnhost netexec --http-port=8080
    ```

1. Veja o Deployment:

    ```shell
    kubectl get deployments
    ```

    A saída é semelhante a:

    ```
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1/1     1            1           1m
    ```

1. Veja a Pod:

    ```shell
    kubectl get pods
    ```

    A saída é semelhante a:

    ```
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

1. Veja os eventos do cluster:

    ```shell
    kubectl get events
    ```

1. Veja a configuração do `kubectl`:

    ```shell
    kubectl config view
    ```

1. Veja os logs da aplicação para um contentor num pod.
   
   ```shell
   kubectl logs hello-node-5f76cf6ccf-br9b5
   ```

   A saída é semelhante a:

   ```
   I0911 09:19:26.677397       1 log.go:195] Started HTTP server on port 8080
   I0911 09:19:26.677586       1 log.go:195] Started UDP server on port  8081
   ```


{{< note >}}
Para mais informações sobre comandos `kubectl`, veja a [visão geral do kubectl](/docs/reference/kubectl/).
{{< /note >}}

## Criar um Service

Por padrão, a Pod só é acessível pelo seu endereço IP interno dentro do
cluster Kubernetes. Para tornar o Contentor `hello-node` acessível de fora da
rede virtual do Kubernetes, tem de expor a Pod como um
[*Service*](/docs/concepts/services-networking/service/) do Kubernetes.

1. Exponha a Pod à internet pública usando o comando `kubectl expose`:

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```

    A flag `--type=LoadBalancer` indica que quer expor o seu Service
    fora do cluster.
    
    O código da aplicação dentro da imagem de teste só ouve na porta TCP 8080. Se usasse
    `kubectl expose` para expor uma porta diferente, os clientes não poderiam conectar-se a essa outra porta.

2. Veja o Service que criou:

    ```shell
    kubectl get services
    ```

    A saída é semelhante a:

    ```
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
    kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
    ```

    Em fornecedores de nuvem que suportam balanceadores de carga,
    um endereço IP externo seria provisionado para aceder ao Service. No minikube,
    o tipo `LoadBalancer` torna o Service acessível através do comando `minikube service`.

3. Execute o seguinte comando:

    ```shell
    minikube service hello-node
    ```

    Isto abre uma janela do navegador que serve a sua aplicação e mostra a resposta da aplicação.

## Ativar addons

A ferramenta minikube inclui um conjunto de {{< glossary_tooltip text="addons" term_id="addons" >}} integrados que podem ser ativados, desativados e abertos no ambiente Kubernetes local.

1. Liste os addons atualmente suportados:

    ```shell
    minikube addons list
    ```

    A saída é semelhante a:

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

1. Ative um addon, por exemplo, `metrics-server`:

    ```shell
    minikube addons enable metrics-server
    ```

    A saída é semelhante a:

    ```
    O addon 'metrics-server' foi ativado
    ```

1. Veja a Pod e o Service que criou ao instalar esse addon:

    ```shell
    kubectl get pod,svc -n kube-system
    ```

    A saída é semelhante a:

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

1. Verifique a saída do `metrics-server`:

    ```shell
    kubectl top pods
    ```

    A saída é semelhante a:

    ```
    NAME                         CPU(cores)   MEMORY(bytes)   
    hello-node-ccf4b9788-4jn97   1m           6Mi             
    ```

    Se vir a seguinte mensagem, espere e tente novamente:

    ```
    error: Metrics API not available
    ```

1. Desative o `metrics-server`:

    ```shell
    minikube addons disable metrics-server
    ```

    A saída é semelhante a:

    ```
    O metrics-server foi desativado com sucesso
    ```

## Limpeza

Agora pode limpar os recursos que criou no seu cluster:

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

Pare o cluster Minikube

```shell
minikube stop
```

Opcionalmente, apague a VM Minikube:

```shell
# Opcional
minikube delete
```

Se quiser usar o minikube novamente para aprender mais sobre o Kubernetes, não precisa de o apagar.

## Conclusão

Esta página cobriu os aspetos básicos para colocar um cluster minikube em funcionamento. Está agora pronto para implementar aplicações.

## {{% heading "whatsnext" %}}


* Tutorial para _[implementar a sua primeira aplicação no Kubernetes com o kubectl](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)_.
* Saiba mais sobre [objetos Deployment](/docs/concepts/workloads/controllers/deployment/).
* Saiba mais sobre [Implementar aplicações](/docs/tasks/run-application/run-stateless-application-deployment/).
* Saiba mais sobre [objetos Service](/docs/concepts/services-networking/service/).
