---
title: Obtenez un shell dans un conteneur en cours d'exécution
content_type: task
---

<!-- overview -->

Cette page montre comment utiliser `kubectl exec` pour obtenir un shell dans un conteneur en cours d'exécution.



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Obtenir un shell dans un conteneur

Dans cet exercice, vous allez créer un pod contenant un conteneur.
Le conteneur exécute une image nginx.
Voici le fichier de configuration du Pod:

{{% codenew file="application/shell-demo.yaml" %}}

Créez le Pod:

```shell
kubectl apply -f https://k8s.io/examples/application/shell-demo.yaml
```

Vérifiez que le conteneur est en cours d'exécution:

```shell
kubectl get pod shell-demo
```

Obtenez un shell pour le conteneur en cours d'exécution:

```shell
kubectl exec -it shell-demo -- /bin/bash
```

{{< note >}}

Le double tiret "-" est utilisé pour séparer les arguments que vous souhaitez passer à la commande des arguments kubectl.

{{< /note >}}

Dans votre shell, listez le répertoire racine:

```shell
root@shell-demo:/# ls /
```

Dans votre shell, testez d'autres commandes.
Voici quelques exemples:

```shell
root@shell-demo:/# ls /
root@shell-demo:/# cat /proc/mounts
root@shell-demo:/# cat /proc/1/maps
root@shell-demo:/# apt-get update
root@shell-demo:/# apt-get install -y tcpdump
root@shell-demo:/# tcpdump
root@shell-demo:/# apt-get install -y lsof
root@shell-demo:/# lsof
root@shell-demo:/# apt-get install -y procps
root@shell-demo:/# ps aux
root@shell-demo:/# ps aux | grep nginx
```

## Écriture de la page racine de nginx

Regardez à nouveau le fichier de configuration de votre Pod.
Le pod a un volume `emptyDir` et le conteneur monte le volume dans `/usr/share/nginx/html`.

Dans votre shell, créez un fichier `index.html` dans le répertoire `/usr/share/nginx/html`:

```shell
root@shell-demo:/# echo Hello shell demo > /usr/share/nginx/html/index.html
```

Dans votre shell, envoyez une requête GET au serveur nginx:

```shell
root@shell-demo:/# apt-get update
root@shell-demo:/# apt-get install curl
root@shell-demo:/# curl localhost
```

La sortie affiche le texte que vous avez écrit dans le fichier `index.html`:

```shell
Hello shell demo
```

Lorsque vous avez terminé avec votre shell, entrez `exit`.

## Exécution de commandes individuelles dans un conteneur

Dans une fenêtre de commande ordinaire, pas votre shell, répertoriez les variables d'environnement dans le conteneur en cours d'exécution:

```shell
kubectl exec shell-demo -- env
```

Essayez d'exécuter d'autres commandes.
Voici quelques exemples:

```shell
kubectl exec shell-demo ps aux
kubectl exec shell-demo ls /
kubectl exec shell-demo cat /proc/1/mounts
```



<!-- discussion -->

## Ouverture d'un shell lorsqu'un pod possède plusieurs conteneurs

Si un pod a plusieurs conteneurs, utilisez `--container` ou `-c` pour spécifier un conteneur dans la commande `kubectl exec`.
Par exemple, supposons que vous ayez un pod nommé my-pod et que le pod ait deux conteneurs nommés main-app et helper-app.
La commande suivante ouvrirait un shell sur le conteneur de l'application principale.

```shell
kubectl exec -it my-pod --container main-app -- /bin/bash
```



## {{% heading "whatsnext" %}}


* [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec)


