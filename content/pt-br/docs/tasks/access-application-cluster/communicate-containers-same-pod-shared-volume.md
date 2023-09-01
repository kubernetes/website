---
title: Comunicação entre contêineres no mesmo pod usando um volume compartilhado
content_type: task
weight: 110
---

<!-- overview -->

Esta página mostra como usar um Volume para realizar a comunicação entre dois contêineres rodando
no mesmo Pod. Veja também como permitir que processos se comuniquem por
[compartilhamento de namespace do processo](/docs/tasks/configure-pod-container/share-process-namespace/)
entre os contêineres.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Criando um pod que executa dois contêineres

Neste exercício, você cria um Pod que executa dois contêineres. Os dois contêineres
compartilham um volume que eles podem usar para se comunicar. Aqui está o arquivo de configuração
para o Pod:

{{% codenew file="pods/two-container-pod.yaml" %}}

No arquivo de configuração, você pode ver que o Pod tem um shared-data chamado
`shared-data`.

O primeiro contêiner listado no arquivo de configuração executa um servidor nginx. 
O caminho de montagem para o volume compartilhado é `/usr/share/nginx/html`.
O segundo contêiner é baseado na imagem debian e tem um caminho de montagem
`/pod-data`. O segundo contêiner executa o seguinte comando e é encerrado.

    echo Hello from the debian container > /pod-data/index.html

Observe que o segundo contêiner grava o arquivo `index.html` no diretório raiz do servidor nginx.

Crie o Pod e os dois contêineres:

    kubectl apply -f https://k8s.io/examples/pods/two-container-pod.yaml

Veja as informações sobre o Pod e os contêineres:

    kubectl get pod two-containers --output=yaml

Aqui está uma parte da saída:

    apiVersion: v1
    kind: Pod
    metadata:
      ...
      name: two-containers
      namespace: default
      ...
    spec:
      ...
      containerStatuses:

      - containerID: docker://c1d8abd1 ...
        image: debian
        ...
        lastState:
          terminated:
            ...
        name: debian-container
        ...

      - containerID: docker://96c1ff2c5bb ...
        image: nginx
        ...
        name: nginx-container
        ...
        state:
          running:
        ...

Você pode ver que o contêiner debian foi encerrado e o contêiner nginx ainda está em execução.

Obtenha um shell para o contêiner nginx:

    kubectl exec -it two-containers -c nginx-container -- /bin/bash

Em seu shell, verifique que o nginx está em execução:

    root@two-containers:/# apt-get update
    root@two-containers:/# apt-get install curl procps
    root@two-containers:/# ps aux

A saída é semelhante a esta:

    USER       PID  ...  STAT START   TIME COMMAND
    root         1  ...  Ss   21:12   0:00 nginx: master process nginx -g daemon off;

Lembre-se de que o contêiner debian criou o arquivo `index.html` no diretório raiz do nginx. 
Use `curl` para enviar uma solicitação GET para o servidor nginx:

```
root@two-containers:/# curl localhost
```

A saída mostra que o nginx responde com uma página da web escrita pelo contêiner debian:

```
Hello from the debian container
```

<!-- discussion -->

## Discussão

O principal motivo pelo qual os pods podem ter vários contêineres é oferecer suporte a aplicações extras que apoiam uma aplicação principal. 
Exemplos típicos de aplicativos auxiliares são extratores de dados, aplicações para envio de dados e proxies.
Aplicativos auxiliares e primários geralmente precisam se comunicar uns com os outros.
Normalmente, isso é feito por meio de um sistema de arquivos compartilhado, conforme mostrado neste exercício, 
ou por meio da interface de rede de loopback, localhost. 
Um exemplo desse padrão é um servidor web junto com um programa auxiliar que consulta um repositório Git para novas atualizações.

O volume neste exercício fornece uma maneira dos contêineres se comunicarem durante 
a vida útil do Pod. Se o Pod for excluído e recriado, todos os dados armazenados no volume compartilhado serão perdidos.

## {{% heading "whatsnext" %}}


* Saiba mais sobre [padrões para contêineres compostos](/blog/2015/06/the-distributed-system-toolkit-patterns/).

* Saiba sobre [contêineres compostos para arquitetura modular](https://www.slideshare.net/Docker/slideshare-burns).

* Veja [Configurando um Pod para usar um volume para armazenamento](/docs/tasks/configure-pod-container/configure-volume-storage/).

* Veja [Configurar um Pod para compartilhar namespace de processo entre contêineres em um Pod](/docs/tasks/configure-pod-container/share-process-namespace/)

* Veja [Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core).

* Veja [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core).