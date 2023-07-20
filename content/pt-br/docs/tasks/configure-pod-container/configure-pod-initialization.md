---
title: Configurando a Inicialização do Pod
content_type: task
weight: 130
reviewers:
---

<!-- overview -->
Esta página mostra como usar um contêiner de inicialização para um Pod, que será executado antes de um 
aplicativo ser iniciado.


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Crie um Pod que tem um Contêiner de Inicialização

Neste exercício, você cria um Pod que possui um contêiner de aplicação e um
contêiner de inicialização. O contêiner de incialização é executado até a sua conclusão, antes do contêiner de aplicação ser iniciado.

Aqui está o arquivo de configuração do Pod:

{{< codenew file="pods/init-containers.yaml" >}}

No arquivo de configuração, você pode ver que o Pod tem um volume 
que o contêiner de inicialização e o contêiner da aplicação compartilham.

O contêiner de inicialização monta o volume compartilhado em `/work-dir`, e o contêiner 
da aplicação monta o volume compartilhado em `/usr/share/nginx/html`. 
O contêiner de inicialização executa o seguinte comando e depois termina:

    wget -O /work-dir/index.html http://info.cern.ch

Observe que o contêiner de inicialização grava o arquivo `index.html` no diretório raiz
do servidor nginx.

Crie o Pod:

    kubectl apply -f https://k8s.io/examples/pods/init-containers.yaml

Verifique que o contêiner nginx está executando:

```shell
kubectl get pod init-demo
```

A saída mostra que o contêiner nginx está em execução:

    NAME        READY     STATUS    RESTARTS   AGE
    init-demo   1/1       Running   0          1m

 Abra um shell dentro do contêiner nginx, executando o comando abaixo, no Pod init-demo:

```shell
kubectl exec -it init-demo -- /bin/bash
```

Em seu shell, envie uma requisição GET para o servidor nginx:

    root@nginx:~# apt-get update
    root@nginx:~# apt-get install curl
    root@nginx:~# curl localhost

A saída mostra que o nginx está servindo a página da web que foi escrita pelo contêiner de incialização:

```html
<html><head></head><body><header>
<title>http://info.cern.ch</title>
</header>

<h1>http://info.cern.ch - home of the first website</h1>
  ...
  <li><a href="http://info.cern.ch/hypertext/WWW/TheProject.html">Browse the first website</a></li>
  ...
```



## {{% heading "whatsnext" %}}


* Aprenda mais sobre [Comunicação entre Contêineres executando no mesmo Pod](/pt-br/docs/tasks/access-application-cluster/communicate-containers-same-pod-shared-volume/).
* Aprenda mais sobre [Contêineres de Inicialização](/docs/concepts/workloads/pods/init-containers/).
* Aprenda mais sobre [Volumes](/pt-br/docs/concepts/storage/volumes/).
* Aprenda mais sobre [Depurar Contêineres de Inicialização](/pt-br/docs/tasks/debug/debug-application/debug-init-containers/)

