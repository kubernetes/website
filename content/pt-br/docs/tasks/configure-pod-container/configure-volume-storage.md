---
title: Configurando um Pod Para Usar um Volume Para Armazenamento
content_type: task
weight: 50
---

<!-- overview -->

Esta página mostra como configurar um Pod para usar um Volume para armazenamento.

O sistema de arquivos de um contêiner apenas existe enquanto o contêiner existir. 
Então, quando um contêiner termina e reinicia, as alterações do sistema de arquivos 
são perdidas. 
Para um armazenamento mais consistente, independente do contêiner, você pode usar um
[Volume](/docs/concepts/storage/volumes/). Isso é especialmente importante para aplicações 
`stateful`, tal como armazenamentos chave-valor (tal como Redis) e bancos de dados. 



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Configure um volume para um Pod

Neste exercício, você cria um Pod que executa um contêiner. Este Pod tem um
Volume do tipo [emptyDir](/docs/concepts/storage/volumes/#emptydir)
que persiste durante a existência do Pod, mesmo que o contêiner termine e
reinicie. Aqui está o arquivo de configuração para o pod:

{{% codenew file="pods/storage/redis.yaml" %}}

1. Crie o Pod:

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/storage/redis.yaml
    ```

1. Verifique se o contêiner do pod está funcionando, e então procure por mudanças no Pod:

    ```shell
    kubectl get pod redis --watch
    ```
    
    A saída se parece com isso:

    ```console
    NAME      READY     STATUS    RESTARTS   AGE
    redis     1/1       Running   0          13s
    ```

1. Em outro terminal, pegue um shell para o contêiner em execução:

    ```shell
    kubectl exec -it redis -- /bin/bash
    ```

1. No seu shell, vá para `/data/redis`, e então crie um arquivo:

    ```shell
    root@redis:/data# cd /data/redis/
    root@redis:/data/redis# echo Hello > test-file
    ```

1. No seu shell, liste os processos em execução:

    ```shell
    root@redis:/data/redis# apt-get update
    root@redis:/data/redis# apt-get install procps
    root@redis:/data/redis# ps aux
    ```

    A saída é semelhante a esta:

    ```console
    USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
    redis        1  0.1  0.1  33308  3828 ?        Ssl  00:46   0:00 redis-server *:6379
    root        12  0.0  0.0  20228  3020 ?        Ss   00:47   0:00 /bin/bash
    root        15  0.0  0.0  17500  2072 ?        R+   00:48   0:00 ps aux
    ```

1. Em seu shell, encerre o processo do Redis:

    ```shell
    root@redis:/data/redis# kill <pid>
    ```

    Onde `<pid>` é o process ID (PID) do Redis.

1. No seu terminal original, preste atenção nas mudanças no Pod do Redis. 
Eventualmente, você vai ver algo assim:

    ```console
    NAME      READY     STATUS     RESTARTS   AGE
    redis     1/1       Running    0          13s
    redis     0/1       Completed  0         6m
    redis     1/1       Running    1         6m
    ```

Neste ponto, o Contêiner terminou e reiniciou. Isso porque o Pod do Redis tem uma
[`restartPolicy`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
de `Always`.

1. Abra um shell dentro do Contêiner reiniciado:

    ```shell
    kubectl exec -it redis -- /bin/bash
    ```

1. No seu shell, vá para `/data/redis`, e verifique se `test-file` ainda está lá.
    ```shell
    root@redis:/data/redis# cd /data/redis/
    root@redis:/data/redis# ls
    test-file
    ```

1. Exclua o pod que você criou para este exercício:

    ```shell
    kubectl delete pod redis
    ```



## {{% heading "whatsnext" %}}


* Veja [Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core).

* Veja [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core).

* Além do armazenamento de disco local fornecido por `emptyDir`, o Kubernetes
suporta muitas soluções de armazenamento diferentes, conectadas via rede, incluindo PD na
GCE e EBS na EC2, que são preferidos para dados críticos e vão lidar com os
detalhes, como montar e desmontar os dispositivos nos Nós. Veja
[Volumes](/docs/concepts/storage/volumes/) para mais detalhes.

