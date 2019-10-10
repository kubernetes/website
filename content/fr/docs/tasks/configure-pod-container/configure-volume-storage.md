---
title: Configurer un pod en utilisant un volume pour le stockage
content_template: templates/task
weight: 50
---

{{% capture overview %}}

Cette page montre comment configurer un Pod pour utiliser un Volume pour le stockage.

Le système de fichiers d'un conteneur ne vit que tant que le conteneur vit. Ainsi, quand un conteneur se termine et redémarre, les modifications apportées au système de fichiers sont perdues.  Pour un stockage plus consistant et indépendant du conteneur, vous pouvez utiliser un
[Volume](/fr/docs/concepts/storage/volumes/).
C'est particulièrement important pour les applications Stateful, telles que les key-value stores (comme par exemple Redis) et les bases de données. 

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

## Configurer un volume pour un Pod

Dans cet exercice, vous créez un pod qui contient un seul conteneur. Ce Pod a un Volume de type
[emptyDir](/fr/docs/concepts/storage/volumes/#emptydir) qui dure toute la vie du Pod, même si le conteneur se termine et redémarre. 
Voici le fichier de configuration du Pod :

{{< codenew file="pods/storage/redis.yaml" >}}

1. Créez le Pod :

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/storage/redis.yaml
    ```

1. Vérifiez que le conteneur du pod est en cours d'exécution, puis surveillez les modifications apportées au pod :

    ```shell
    kubectl get pod redis --watch
    ```
    
    La sortie ressemble à ceci :

    ```shell
    NAME      READY     STATUS    RESTARTS   AGE
    redis     1/1       Running   0          13s
    ```

1. Dans un autre terminal, accédez à la console shell du conteneur en cours d'exécution :

    ```shell
    kubectl exec -it redis -- /bin/bash
    ```

1. Dans votre shell, allez dans `/data/redis`, puis créez un fichier :

    ```shell
    root@redis:/data# cd /data/redis/
    root@redis:/data/redis# echo Hello > test-file
    ```

1. Dans votre shell, listez les processus en cours d'exécution :

    ```shell
    root@redis:/data/redis# apt-get update
    root@redis:/data/redis# apt-get install procps
    root@redis:/data/redis# ps aux
    ```

    La sortie ressemble à ceci :

    ```shell
    USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
    redis        1  0.1  0.1  33308  3828 ?        Ssl  00:46   0:00 redis-server *:6379
    root        12  0.0  0.0  20228  3020 ?        Ss   00:47   0:00 /bin/bash
    root        15  0.0  0.0  17500  2072 ?        R+   00:48   0:00 ps aux
    ```

1. Dans votre shell, arrêtez le processus Redis :

    ```shell
    root@redis:/data/redis# kill <pid>
    ```

    où `<pid>` est l'ID de processus Redis (PID).

1. Dans votre terminal initial, surveillez les changements apportés au Pod de Redis. Éventuellement,
vous verrez quelque chose comme ça :

    ```shell
    NAME      READY     STATUS     RESTARTS   AGE
    redis     1/1       Running    0          13s
    redis     0/1       Completed  0         6m
    redis     1/1       Running    1         6m
    ```

A ce stade, le conteneur est terminé et redémarré. C'est dû au fait que le Pod de Redis a une
[restartPolicy](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
fixé à `Always`.

1. Accédez à la console shell du conteneur redémarré :

    ```shell
    kubectl exec -it redis -- /bin/bash
    ```

1. Dans votre shell, allez dans `/data/redis`, et vérifiez que `test-file` est toujours là.
    ```shell
    root@redis:/data/redis# cd /data/redis/
    root@redis:/data/redis# ls
    test-file
    ```

1. Supprimez le pod que vous avez créé pour cet exercice :

    ```shell
    kubectl delete pod redis
    ```

{{% /capture %}}

{{% capture whatsnext %}}

* Voir [Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core).

* Voir [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core).

* En plus du stockage sur disque local fourni par `emptyDir`, Kubernetes supporte de nombreuses solutions de stockage connectées au réseau, y compris PD sur GCE et EBS sur EC2, qui sont préférés pour les données critiques et qui s'occuperont des autres détails tels que le montage et le démontage sur les nœuds. Voir [Volumes](/fr/docs/concepts/storage/volumes/) pour plus de détails.

{{% /capture %}}


