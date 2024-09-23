---
title: "Verifique a instalação do kubectl"
description: "Como verificar a instalação do kubectl."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

Para que o kubectl encontre e acesse um cluster Kubernetes, ele precisa de um
[arquivo kubeconfig](/pt-br/docs/concepts/configuration/organize-cluster-access-kubeconfig/),
que é criado automaticamente quando você cria um cluster usando
[kube-up.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/kube-up.sh) ou 
instala com sucesso um cluster Minikube.
Por padrão, a configuração kubectl está localizada em `~/.kube/config`.

Verifique se o kubectl está configurado corretamente obtendo o estado do cluster:

```shell
kubectl cluster-info
```

Se você receber uma URL de resposta, o kubectl está configurado corretamente para acessar 
seu cluster.

Se você receber uma mensagem semelhante à seguinte, o kubectl não está configurado 
corretamente ou não consegue se conectar a um cluster Kubernetes.

```
The connection to the server <server-name:port> was refused - did you specify the right host or port?
```

Por exemplo, se você pretende executar um cluster Kubernetes no seu laptop (localmente),
vai precisar de uma ferramenta como o [Minikube](https://minikube.sigs.k8s.io/docs/start/)
seja instalada primeiro, para em seguida executar novamente os comandos indicados acima.

Se o comando `kubectl cluster-info` retornar a URL de resposta, mas você não conseguir 
acessar seu cluster, para verificar se ele está configurado corretamente, use:

```shell
kubectl cluster-info dump
```

### Solução de problemas para a mensagem de erro 'No Auth Provider Found' {#no-auth-provider-found}

No Kubernetes 1.26, o kubectl removeu a autenticação incorporada para as serviços de Kubernetes
gerenciados ofertados por provedores de nuvem a seguir. Estes provedores lançaram plugins
para o kubectl para fornecer a autenticação específica da nuvem. Para instruções, dirija-se à documentação do provedor:

* Azure AKS: [plugin kubelogin](https://azure.github.io/kubelogin/) (em inglês)
* Google Kubernetes Engine (GKE): [gke-cloud-auth-plugin](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl?hl=pt-br#install_plugin)

(É possível que existam outras razões para ver a mesma mensagem de erro, não relacionadas 
com esta mudança.)
