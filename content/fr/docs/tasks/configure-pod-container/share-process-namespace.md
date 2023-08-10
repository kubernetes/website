---
title: Partager l'espace de nommage des processus entre les conteneurs d'un Pod
min-kubernetes-server-version: v1.10
content_type: task
weight: 160
---

<!-- overview -->

{{< feature-state state="stable" for_k8s_version="v1.17" >}}

Cette page montre comment configurer le partage de l'espace de noms d'un processus pour un pod. Lorsque le partage de l'espace de noms des processus est activé, les processus d'un conteneur sont visibles pour tous les autres conteneurs de ce pod.

Vous pouvez utiliser cette fonctionnalité pour configurer les conteneurs coopérants, comme un conteneur de sidecar de gestionnaire de journaux, ou pour dépanner les images de conteneurs qui n'incluent pas d'utilitaires de débogage comme un shell.

## {{% heading prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Configurer un Pod

Le partage de l'espace de nommage du processus est activé en utilisant le champ `shareProcessNamespace` de `v1.PodSpec`. Par exemple:

{{% codenew file="pods/share-process-namespace.yaml" %}}

1. Créez le pod `nginx` sur votre cluster :

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/share-process-namespace.yaml
    ```

1. Attachez-le au conteneur `shell` et lancez `ps` :

    ```shell
    kubectl attach -it nginx -c shell
    ```

    Si vous ne verrez pas d'invite de commande, appuyez sur la touche Entrée.

    ```
    / # ps ax
    PID   USER     TIME  COMMAND
        1 root      0:00 /pause
        8 root      0:00 nginx: master process nginx -g daemon off;
       14 101       0:00 nginx: worker process
       15 root      0:00 sh
       21 root      0:00 ps ax
    ```

Vous pouvez signaler les processus dans d'autres conteneurs. Par exemple, envoyez `SIGHUP` à
nginx pour relancer le processus de worker. Cela nécessite la fonctionnalité `SYS_PTRACE`.

```
/ # kill -HUP 8
/ # ps ax
PID   USER     TIME  COMMAND
    1 root      0:00 /pause
    8 root      0:00 nginx: master process nginx -g daemon off;
   15 root      0:00 sh
   22 101       0:00 nginx: worker process
   23 root      0:00 ps ax
```

Il est même possible d'accéder aux autres conteneurs en utilisant le lien `/proc/$pid/root`.

```
/ # head /proc/8/root/etc/nginx/nginx.conf

user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
```

## Comprendre le processus de partage de l'espace de nommage

Les pods partagent de nombreuses ressources, il est donc logique qu'elles partagent également un espace de noms des processus. Pour certaines images de conteneur, on peut envisager de les isoler les uns des autres. Il est donc important de comprendre ces différences :

1. **Le processus de conteneur n'a plus de PID 1.** Certaines images de conteneurs refusent de démarrer sans PID 1 (par exemple, les conteneurs utilisant `systemd`) ou exécuter des commandes comme `kill -HUP 1` pour signaler le processus du conteneur. Dans les pods avec un espace de noms partagé du processus, `kill -HUP 1` signalera la sandbox du pod.  (`/pause` dans l'exemple ci-dessus.)

1. **Les processus sont visibles par les autres conteneurs du pod.**  Cela inclut tout les informations visibles dans `/proc`, comme les mots de passe passés en argument ou les variables d'environnement. Celles-ci ne sont protégées que par des permissions Unix régulières.

1. **Les systèmes de fichiers des conteneurs sont visibles par les autres conteneurs du pod à travers le lien `/proc/$pid/root`.** Cela rend le débogage plus facile, mais cela signifie aussi que les secrets du système de fichiers ne sont protégés que par les permissions du système de fichiers.

