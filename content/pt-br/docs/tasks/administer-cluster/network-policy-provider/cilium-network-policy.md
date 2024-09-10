---
title: Utilize o Cilium para NetworkPolicy
content_type: task
weight: 30
---

<!-- overview -->
Essa página mostra como utilizar o Cilium para NetworkPolicy.

Para saber mais sobre o Cilium, leia o artigo [Introdução ao Cilium (em inglês)](https://docs.cilium.io/en/stable/overview/intro).


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->
## Fazendo o Deploy do Cilium no Minikube para Testes Básicos

Para familiarizar-se com o Cilium você poderá seguir o guia [Guia de Primeiros Passos do Cilium no Kubernetes (em inglês)](https://docs.cilium.io/en/stable/gettingstarted/k8s-install-default/) e realizar uma instalação básica do Cilium através de um DaemonSet no minikube.

Inicie o minikube, a versão mínima exigida é >= v1.5.2, com os seguintes argumentos:

```shell
minikube version
```
```
minikube version: v1.5.2
```

```shell
minikube start --network-plugin=cni
```

Para o minikube, você poderá instalar o Cilium utilizando a ferramenta de linha de comando (CLI). Para isso, primeiro faça o download da última versão do CLI com o seguinte comando:

```shell
curl -LO https://github.com/cilium/cilium-cli/releases/latest/download/cilium-linux-amd64.tar.gz
```

Em seguida extraia o arquivo baixado para o diretório `/usr/local/bin` com os comandos:

```shell
sudo tar xzvfC cilium-linux-amd64.tar.gz /usr/local/bin
rm cilium-linux-amd64.tar.gz
```

Após executar os passos acima, você poderá instalar o Cilium utilizando o comando abaixo: 

```shell
cilium install
```

O Cilium irá detectar as configurações do cluster automaticamente, criará e instalará os componentes apropriados para que a instalação seja bem sucedida.
Os componentes são:

- Certificate Authority (CA) no Secret `cilium-ca` e os certificados para o Hubble (camada de observabilidade do Cilium).
- Service accounts.
- Cluster roles.
- ConfigMap.
- Um agente DaemonSet e um Operator Deployment.

Após a instalação, você poderá visualizar o status geral do Deployment do Cilium com o comando `cilium status`.
Confira a saída esperada da opção `status` [aqui](https://docs.cilium.io/en/stable/gettingstarted/k8s-install-default/#validate-the-installation). 

O restante do guia de primeiros passos utiliza como base uma aplicação de exemplo para explicar como aplicar políticas de segurança tanto para L3/L4 (como endereço de IP + porta), quanto para L7 (como HTTP).

## Fazendo o deploy do Cilium para uso em produção

Para instruções detalhadas de como fazer o deploy do Cilium em produção, acesse: [Guia de Instalação do Cilium no Kubernetes (em inglês)](https://docs.cilium.io/en/stable/network/kubernetes/concepts/).

Essa documentação inclui detalhes sobre os requisitos, instruções e exemplos de DaemonSet para produção.



<!-- discussion -->
##  Entendendo os componentes do Cilium

Ao realizar o deploy do Cilium no cluster, Pods são adicionados ao namespace `kube-system`. Para ver essa lista de Pods execute:

```shell
kubectl get pods --namespace=kube-system -l k8s-app=cilium
```

Você verá uma lista de Pods similar a essa:

```console
NAME           READY   STATUS    RESTARTS   AGE
cilium-kkdhz   1/1     Running   0          3m23s
...
```

Um Pod `cilium` roda em cada um dos nós do seu cluster e garante as políticas de rede no tráfego de/para Pods naquele nó usando o Linux BPF.



## {{% heading "whatsnext" %}}

Uma vez que seu cluster estiver rodando, você pode seguir o artigo [Declarar uma Network Policy (em inglês)](/docs/tasks/administer-cluster/declare-network-policy/) para testar as políticas de NetworkPolicy do Kubernetes com o Cilium.
Divirta-se! Se tiver dúvidas, nos contate usando o [Canal Slack do Cilium](https://cilium.herokuapp.com/).


