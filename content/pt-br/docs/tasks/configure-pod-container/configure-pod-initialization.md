---
title: Configurando a Inicialização do Pod
content_type: task
weight: 130
reviewers:
---

<!-- overview -->
Esta página mostra como usar um contêiner de incialização para um Pod, que será executado antes de um 
aplicativo ser iniciado.


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Crie um Pod que tem um Contêiner de incialização

Neste exercício, você cria um pod que possui um aplicativo de contêiner e um
contêiner de inicialização. O contêiner de incialização é executado até a sua conclusão, antes da aplicação
do contêiner ser iniciada.

Aqui está o arquivo de configuração do pod:

{{< codenew file="pods/init-containers.yaml" >}}

No arquivo de configuração, você pode ver que o Pod tem um volume 
que o contêiner de inicialiazação e o contêiner da aplicação compartilham.

O contêiner de incialização monta o volume compartilhado em `/work-dir`, e o contêiner 
da aplicação monta o volume compartilhado em `/usr/share/nginx/html`. 
O contêiner de incialização executa o seguinte comando e depois termina:

    wget -O /work-dir/index.html http://info.cern.ch

Observe que o contêiner de inicialização grava o arquivo `index.html` no diretório raiz
do servidor nginx.

Crie o Pod:

    kubectl apply -f https://k8s.io/examples/pods/init-containers.yaml

Verifique se o container nginx está executando:

    kubectl get pod init-demo

A saída mostra que o contêiner nginx está em execução:

    NAME        READY     STATUS    RESTARTS   AGE
    init-demo   1/1       Running   0          1m

 Abra um shell dentro do contêiner nginx, executando o comando abaixo, no Pod init-demo:

    kubectl exec -it init-demo -- /bin/bash

Se o seu shell, enviar uma requesição GET para o servidor nginx:

    root@nginx:~# apt-get update
    root@nginx:~# apt-get install curl
    root@nginx:~# curl localhost

A saída mostra que o nginx está servindo a página da web que foi escrita pelo contêiner de incialização:

    <html><head></head><body><header>
    <title>http://info.cern.ch</title>
    </header>

    <h1>http://info.cern.ch - home of the first website</h1>
      ...
      <li><a href="http://info.cern.ch/hypertext/WWW/TheProject.html">Browse the first website</a></li>
      ...



## {{% heading "whatsnext" %}}


* Aprenda mais sobre [communicação entre Contêineres executando no mesmo Pod](/docs/tasks/access-application-cluster/communicate-containers-same-pod-shared-volume/).
* Aprenda mais sobre [Contêineres de incialização](/docs/concepts/workloads/pods/init-containers/).
* Aprenda mais sobre [Volumes](/docs/concepts/storage/volumes/).
* Aprenda mais sobre [Debugando Contêineres de incialização](/docs/tasks/debug/debug-application/debug-init-containers/)



