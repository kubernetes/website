---
title: Configurando o Ingress no Minikube com o NGINX Ingress Controller Config
content_type: task
weight: 110
min-kubernetes-server-version: 1.19
---

<!-- overview -->

O [Ingress](/pt-br/docs/concepts/services-networking/ingress/) é um objeto da API que define regras
que permitem acesso externo a serviços em um cluster. Um
[Ingress controller](/docs/concepts/services-networking/ingress-controllers/)
cumpre as regras estabelecidas no Ingress.

Essa página mostra como configurar um Ingress simples que redireciona as requisições para o Service "web" ou "web2" dependendo do URI HTTP.

## {{% heading "prerequisites" %}}

Esse tutorial assume que você está usando `minikube` para rodar um cluster Kubernetes local.
Visite [Install tools](/pt-br/docs/tasks/tools/#minikube) para aprender como instalar o `minikube`.

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
Se você estiver usando uma versão mais antiga do Kubernetes, veja a documentação para essa versão.

### Criando um cluster minikube
Se você ainda não configurou um cluster local, rode `minikube start` para criar um cluster.

<!-- steps -->

## Ativando o Ingress controller

1. Para ativar o NGINX Ingress controller, rode os seguintes comandos:

   ```shell
   minikube addons enable ingress
   ```

1. Verifique que o NGINX Ingress controller está rodando

   ```shell
   kubectl get pods -n ingress-nginx
   ```

   {{< note >}}
   Os pods podem levar até um minuto para estarem rodando corretamente.
   {{< /note >}}

   O resultado deve ser similar a:

   ```none
   NAME                                        READY   STATUS      RESTARTS    AGE
   ingress-nginx-admission-create-g9g49        0/1     Completed   0          11m
   ingress-nginx-admission-patch-rqp78         0/1     Completed   1          11m
   ingress-nginx-controller-59b45fb494-26npt   1/1     Running     0          11m
   ```

## Instale uma aplicação hello world

1. Crie um Deployment usando o seguinte comando:

   ```shell
   kubectl create deployment web --image=gcr.io/google-samples/hello-app:1.0
   ```

   O resultado deve ser:

   ```none
   deployment.apps/web created
   ```

1. Exponha o Deployment:

   ```shell
   kubectl expose deployment web --type=NodePort --port=8080
   ```

   O resultado deve ser:

   ```none
   service/web exposed
   ```

1. Verifique que o Service está criado e disponível em uma porta do nó:

   ```shell
   kubectl get service web
   ```

   O resultado deve ser similar:

   ```none
   NAME      TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
   web       NodePort   10.104.133.249   <none>        8080:31637/TCP   12m
   ```

1. Visite o Service via NodePort:

   ```shell
   minikube service web --url
   ```

   O resultado é similar a:

   ```none
   http://172.17.0.15:31637
   ```

   ```shell
   curl http://172.17.0.15:31637 
   ```

   O resultado é similar a:

   ```none
   Hello, world!
   Version: 1.0.0
   Hostname: web-55b8c6998d-8k564
   ```

   Você agora pode acessar a aplicação de exemplo através do endereço IP do Minikube e NodePort.
   No próximo passo, você irá acessar a aplicação usando o recurso Ingress.

## Criando um Ingress
O manifesto a seguir define um Ingress que envia tráfego para seu Serviço via
`hello-world.info`.

1. crie `example-ingress.yaml` usando o arquivo:

   {{% code_sample file="service/networking/example-ingress.yaml" %}}

1. Crie o objeto Ingress rodando o seguinte comando:

   ```shell
   kubectl apply -f https://k8s.io/examples/service/networking/example-ingress.yaml
   ```

   O resultado deve ser:

   ```none
   ingress.networking.k8s.io/example-ingress created
   ```

1. Verifique se o endereço IP está configurado:

   ```shell
   kubectl get ingress
   ```

   {{< note >}}
   Isso pode demorar alguns minutos.
   {{< /note >}}

   Você deve ver um endereçco IPv4 na coluna `ADDRESS`; por exemplo:

   ```none
   NAME              CLASS    HOSTS              ADDRESS        PORTS   AGE
   example-ingress   <none>   hello-world.info   172.17.0.15    80      38s
   ```


1. Verifique se o Ingress controller está direcionando o tráfego:

   ```shell
   curl --resolve "hello-world.info:80:$( minikube ip )" -i http://hello-world.info
   ```

   Você deve ver:

   ```none
   Hello, world!
   Version: 1.0.0
   Hostname: web-55b8c6998d-8k564
   ```

   Você também pode visitar `hello-world.info` no seu navegador.

   * **Opcionalmente**
     Procure o endereço IP externo reportado pelo minikube:
     ```shell
     minikube ip
     ```

     Adicione uma linha semelhante à seguinte no final do arquivo `/etc/hosts` no seu computador (você vai precisar de acesso de administrador):

     ```none
     172.17.0.15 hello-world.info
     ```

     {{< note >}}
     Altere o endereço IP para corresponder ao resultado de `minikube ip`.
     {{< /note >}}

     Depois que você fizer essa mudança, seu navegador enviará solicitações da URL `hello-world.info` para o Minikube

## Criando um segundo Deployment

1. Crie outro Deployment usando o seguinte comando:

   ```shell
   kubectl create deployment web2 --image=gcr.io/google-samples/hello-app:2.0
   ```

   O resultado deve ser:

   ```none
   deployment.apps/web2 created
   ```

1. Expondo o segundo Deployment:

   ```shell
   kubectl expose deployment web2 --port=8080 --type=NodePort
   ```

   O resultado deve ser:

   ```none
   service/web2 exposed
   ```

## Edite o Ingress existente {#edit-ingress}

1. Edite o manifesto `example-ingress.yaml` existente, e adicione as seguintes linhas no final:
    ```yaml
    - path: /v2
      pathType: Prefix
      backend:
        service:
          name: web2
          port:
            number: 8080
    ```

1. Aplique as mudanças:

   ```shell
   kubectl apply -f example-ingress.yaml
   ```

   Você deve ver:

   ```none
   ingress.networking/example-ingress configured
   ```

## Testando o seu Ingress

1. Acesse a primeira versão da sua aplicação Hello World.

   ```shell
   curl --resolve "hello-world.info:80:$( minikube ip )" -i http://hello-world.info
   ```

   O resultado deve ser similar a:

   ```none
   Hello, world!
   Version: 1.0.0
   Hostname: web-55b8c6998d-8k564
   ```

1. Acesse a segunda versão da sua aplicação Hello World.

   ```shell
   curl --resolve "hello-world.info:80:$( minikube ip )" -i http://hello-world.info/v2
   ```

   O resultado deve ser similar a:

   ```none
   Hello, world!
   Version: 2.0.0
   Hostname: web2-75cd47646f-t8cjk
   ```

   {{< note >}}
   Se você fez o passo opcional para atualizar o arquivo `/etc/hosts`, você também pode visitar `hello-world.info` e `hello-world.info/v2` do seu navegador.
   {{< /note >}}

## {{% heading "whatsnext" %}}

* Leia mais sobre [Ingress](/pt-br/docs/concepts/services-networking/ingress/)
* Leia mais sobre [Ingress Controllers](/docs/concepts/services-networking/ingress-controllers/)
* Leia mais sobre [Services](/docs/concepts/services-networking/service/)

