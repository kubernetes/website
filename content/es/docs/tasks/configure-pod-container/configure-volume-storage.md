---
title: Configura un Pod para Usar un Volume como Almacenamiento
content_type: task
weight: 50
---

<!-- overview -->

En esta página se muestra cómo configurar un Pod para usar un Volume (volumen) como almacenamiento.

El sistema de ficheros de un Contenedor existe mientras el Contenedor exista. Por tanto, cuando un Contenedor es destruido o reiniciado, los cambios realizados en el sistema de ficheros se pierden. Para un almacenamiento más consistente que sea independiente del ciclo de vida del Contenedor, puedes usar un [Volume](/docs/concepts/storage/volumes/). Esta característica es especialmente importante para aplicaciones que deben mantener un estado, como motores de almacenamiento clave-valor (por ejemplo Redis) y bases de datos.



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Configura un Volume para un Pod

En este ejercicio crearás un Pod que ejecuta un único Contenedor. Este Pod tiene un Volume de tipo [emptyDir](/docs/concepts/storage/volumes/#emptydir) (directorio vacío) que existe durante todo el ciclo de vida del Pod, incluso cuando el Contenedor es destruido y reiniciado. Aquí está el fichero de configuración del Pod:

{{% codenew file="pods/storage/redis.yaml" %}}

1. Crea el Pod:

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/storage/redis.yaml
    ```

1. Verifica que el Contenedor del Pod se está ejecutando y después observa los cambios en el Pod

    ```shell
    kubectl get pod redis --watch
    ```

    La salida debería ser similar a:

    ```console
    NAME      READY     STATUS    RESTARTS   AGE
    redis     1/1       Running   0          13s
    ```

1. En otro terminal, abre una sesión interactiva dentro del Contenedor que se está ejecutando:

    ```shell
    kubectl exec -it redis -- /bin/bash
    ```

1. En el terminal, ve a `/data/redis` y crea un fichero:

    ```shell
    root@redis:/data# cd /data/redis/
    root@redis:/data/redis# echo Hello > test-file
    ```

1. En el terminal, lista los procesos en ejecución:

    ```shell
    root@redis:/data/redis# apt-get update
    root@redis:/data/redis# apt-get install procps
    root@redis:/data/redis# ps aux
    ```

    La salida debería ser similar a:

    ```console
    USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
    redis        1  0.1  0.1  33308  3828 ?        Ssl  00:46   0:00 redis-server *:6379
    root        12  0.0  0.0  20228  3020 ?        Ss   00:47   0:00 /bin/bash
    root        15  0.0  0.0  17500  2072 ?        R+   00:48   0:00 ps aux
    ```

1. En el terminal, mata el proceso de Redis:

    ```shell
    root@redis:/data/redis# kill <pid>
    ```

    donde `<pid>` es el ID de proceso (PID) de Redis.

1. En el terminal original, observa los cambios en el Pod de Redis. Eventualmente verás algo como lo siguiente:

    ```console
    NAME      READY     STATUS     RESTARTS   AGE
    redis     1/1       Running    0          13s
    redis     0/1       Completed  0         6m
    redis     1/1       Running    1         6m
    ```

En este punto, el Contenedor ha sido destruido y reiniciado. Esto es debido a que el Pod de Redis tiene una
[restartPolicy](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core) (política de reinicio)
de `Always` (siempre).

1. Abre un terminal en el Contenedor reiniciado:

    ```shell
    kubectl exec -it redis -- /bin/bash
    ```

1. En el terminal, ve a `/data/redis` y verifica que `test-file` todavía existe:

    ```shell
    root@redis:/data/redis# cd /data/redis/
    root@redis:/data/redis# ls
    test-file
    ```

1. Elimina el Pod que has creado para este ejercicio:

    ```shell
    kubectl delete pod redis
    ```



## {{% heading "whatsnext" %}}


* Revisa [Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core).

* Revisa [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core).

* Además del almacenamiento local proporcionado por `emptyDir`, Kubernetes soporta diferentes tipos de soluciones de almacenamiento por red, incluyendo los discos gestionados de los diferentes proveedores cloud, como por ejemplo los *Persistent Disks* en Google Cloud Platform o el *Elastic Block Storage* de Amazon Web Services. Este tipo de soluciones para volúmenes son las preferidas para el almacenamiento de datos críticos. Kubernetes se encarga de todos los detalles, tal como montar y desmontar los dispositivos en los nodos del clúster. Revisa [Volumes](/docs/concepts/storage/volumes/) para obtener más información.




