---
title: Configurar a Inicialização de um Pod
content_type: task
weight: 170
---

<!-- overview -->

Esta página mostra como usar um contêiner de inicialização (_init container_)
para inicializar um Pod antes que um contêiner de aplicação seja executado.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Crie um Pod que tenha um contêiner de inicialização {#create-a-pod-that-has-an-init-container}

Neste exercício, você cria um Pod que tem um contêiner de aplicação e um
contêiner de inicialização. O contêiner de inicialização é executado até
terminar antes que o contêiner de aplicação seja iniciado.

Aqui está o arquivo de configuração do Pod:

{{% code_sample file="pods/init-containers.yaml" %}}

No arquivo de configuração, você pode ver que o Pod tem um Volume que o
contêiner de inicialização e o contêiner de aplicação compartilham.

O contêiner de inicialização monta o Volume compartilhado em `/work-dir`, e o
contêiner de aplicação monta o Volume compartilhado em `/usr/share/nginx/html`.
O contêiner de inicialização executa o comando a seguir e depois termina:

```shell
wget -O /work-dir/index.html http://info.cern.ch
```

Observe que o contêiner de inicialização grava o arquivo `index.html` no
diretório raiz do servidor nginx.

Crie o Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/init-containers.yaml
```

Verifique se o contêiner nginx está em execução:

```shell
kubectl get pod init-demo
```

A saída mostra que o contêiner nginx está em execução:

```
NAME        READY     STATUS    RESTARTS   AGE
init-demo   1/1       Running   0          1m
```

Abra um shell no contêiner nginx em execução no Pod init-demo:

```shell
kubectl exec -it init-demo -- /bin/bash
```

No seu shell, envie uma requisição GET para o servidor nginx:

```
root@nginx:~# apt-get update
root@nginx:~# apt-get install curl
root@nginx:~# curl localhost
```

A saída mostra que o nginx está servindo a página web gravada pelo contêiner de
inicialização:

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

* Saiba mais sobre
  [comunicação entre contêineres em execução no mesmo Pod](/docs/tasks/access-application-cluster/communicate-containers-same-pod-shared-volume/).
* Saiba mais sobre [contêineres de inicialização](/docs/concepts/workloads/pods/init-containers/).
* Saiba mais sobre [Volumes](/docs/concepts/storage/volumes/).
* Saiba mais sobre [depuração de contêineres de inicialização](/docs/tasks/debug/debug-application/debug-init-containers/)
