---
title: Créer des Pods statiques
weight: 170
content_template: templates/task
---

{{% capture overview %}}


Les *pods statiques* sont gérés directement par le démon de kubelet sur un noeud spécifique,
sans les observer par l'{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
Contrairement aux pods qui sont gérés par le control plane (par exemple, un {{< glossary_tooltip text="Deployment" term_id="deployment" >}}), le kubelet surveille chaque pod statique (et le redémarre s'il plante).

Les pods statiques sont toujours liés à un {{< glossary_tooltip term_id="kubelet" >}} sur un noeud spécifique.

Le kubelet crée automatiquement un {{< glossary_tooltip text="Pod mirror" term_id="mirror-pod" >}} sur le API Server de Kubernetes pour chaque Pod statique.
Cela signifie que les pods fonctionnant sur un noeud sont visibles sur le API Server, mais ne peuvent pas être contrôlées à partir de là.

{{< note >}}
Si vous utilisez un clustered Kubernetes et des pods statiques pour faire tourner un pod sur chaque noeud, vous devriez probablement utiliser un {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}} à la place.
{{< /note >}}

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Cette page suppose que vous utilisez {{< glossary_tooltip term_id="docker" >}} pour faire tourner les pods, et que vos nœuds utilisent le système d'exploitation Fedora.
Les instructions pour d'autres distributions ou installations de Kubernetes peuvent varier.

{{% /capture %}}


{{% capture steps %}}

## Créer un pod statique {#static-pod-creation}

Vous pouvez configurer un pod statique avec soit un [fichier de configuration hébergé sur un système de fichiers](/fr/docs/tasks/configure-pod-container/static-pod/#configuration-files) ou un [fichier de configuration hébergé sur le web](/fr/docs/tasks/configure-pod-container/static-pod/#pods-created-via-http).

### Manifeste de Pod statique hébergé par un système de fichiers {#configuration-files}

Les manifestes sont des définitions de pod standard au format JSON ou YAML dans un répertoire spécifique.  Utilisez le champ `staticPodPath : <le répertoire>` dans le  [fichier de configuration de kubelet](/docs/tasks/administer-cluster/kubelet-config-file), qui analyse périodiquement le répertoire et crée/supprime les pods statiques lorsque des fichiers YAML/JSON y apparaissent ou disparaissent.
Notez que le kubelet ignorera les fichiers commençant par des points lors de l'analyse du répertoire spécifié.

Voici, par exemple, comment lancer un simple serveur web en tant que pod statique :

1.  Choisissez un nœud où vous voulez démarrer le pod statique. Dans cet exemple, c'est `my-node1`.

    ```shell
    ssh my-node1
    ```

2. Choisissez un répertoire, par exemple `/etc/kubelet.` et placez-y une définition de pod de serveur web,`/etc/kubelet.d/static-web.yaml` :

    ```shell
    # Exécutez cette commande sur le nœud sur lequel le kubelet fonctionne
    mkdir /etc/kubelet.d/
    cat <<EOF >/etc/kubelet.d/static-web.yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: static-web
      labels:
        role: myrole
    spec:
      containers:
        - name: web
          image: nginx
          ports:
            - name: web
              containerPort: 80
              protocol: TCP
    EOF
    ```

3. Configurez votre kubelet sur le noeud pour utiliser ce répertoire en le lançant avec l'argument `--pod-manifest-path=/etc/kubelet.d/`. Sur Fedora, éditez `/etc/kubernetes/kubelet` pour inclure cette ligne :

    ```
    KUBELET_ARGS="--cluster-dns=10.254.0.10 --cluster-domain=kube.local --pod-manifest-path=/etc/kubelet.d/"
    ```
    ou ajoutez le `staticPodPath' : <le répertoire>` dans le [fichier de configuration du kubelet](/docs/tasks/administer-cluster/kubelet-config-file).

4. Redémarrez le kubelet. Sur Fedora, vous devez exécuter :

    ```shell
    # Exécutez cette commande sur le nœud sur lequel le kubelet fonctionne
    systemctl restart kubelet
    ```

### Manifeste des pods statiques hébergés sur le web {#pods-created-via-http}

Kubelet télécharge périodiquement un fichier spécifié par l'argument `--manifest-url=<URL>`.
et l'interprète comme un fichier JSON/YAML qui contient les définitions des pods.
De manière similaire au fonctionnement des [manifestes hébergées par des systèmes de fichiers](#configuration-files),  le kubelet
récupère le manifeste selon un calendrier. Si des changements sont apportés à la liste des pods statiques, le kubelet les applique.

Pour utiliser cette approche : 

1. Créer un fichier YAML et le placer sur un serveur web pour que vous puissiez transmettre l'URL de ce fichier au kubelet.

    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: static-web
      labels:
        role: myrole
    spec:
      containers:
        - name: web
          image: nginx
          ports:
            - name: web
              containerPort: 80
              protocol: TCP
    ```

2. Configurez le kubelet sur le nœud sélectionné pour utiliser ce manifeste web en l'exécutant avec `--manifest-url=<url-du-manifeste>`. Sur Fedora, éditez `/etc/kubernetes/kubelet` pour inclure cette ligne :

    ```
    KUBELET_ARGS="--cluster-dns=10.254.0.10 --cluster-domain=kube.local --manifest-url=<url-du-manifeste>"
    ```

3. Redémarrez le kubelet. Sur Fedora, vous lancez :

    ```shell
    # Exécutez cette commande sur le nœud sur lequel le kubelet fonctionne
    systemctl restart kubelet
    ```

## Observer le comportement des pods statiques {#behavior-of-static-pods}

Lorsque le kubelet démarre, il démarre automatiquement tous les pods statiques définis. Une fois que vous avez défini un pod statique et redémarré le kubelet, le nouveau pod statique devrait déjà être en cours d'exécution.

Vous pouvez voir les conteneurs en cours d'exécution (y compris les Pods statiques) en exécutant cette commande (sur le nœud) :
```shell
# Exécutez cette commande sur le nœud sur lequel le kubelet fonctionne
docker ps
```

Le résultat obtenu ressemble à cela :

```
CONTAINER ID IMAGE         COMMAND  CREATED        STATUS         PORTS     NAMES
f6d05272b57e nginx:latest  "nginx"  8 minutes ago  Up 8 minutes             k8s_web.6f802af4_static-web-fk-node1_default_67e24ed9466ba55986d120c867395f3c_378e5f3c
```

Vous pouvez voir le pod miroir sur le API Server :

```shell
kubectl get pods
```
```
NAME                       READY     STATUS    RESTARTS   AGE
static-web-my-node1        1/1       Running   0          2m
```

{{< note >}}
Vérifiez que le kubelet a la permission de créer le pod miroir dans le API Server. Sinon, la demande de création est rejetée par le API Server. Voir
[PodSecurityPolicy](/docs/concepts/policy/pod-security-policy/).
{{< /note >}}


Les {{< glossary_tooltip term_id="label" text="Labels" >}} du pod statique se propagent dans le pod mirroir. Vous pouvez utiliser ces labels comme d'habitude via {{< glossary_tooltip term_id="selector" text="selectors" >}}, etc.

Si vous essayez d'utiliser `kubectl` pour supprimer le pod miroir du API Server,
le kubelet _ne_ _supprime_ _pas_ le pod statique :

```shell
kubectl delete pod static-web-my-node1
```
```
pod "static-web-my-node1" deleted
```
Vous pouvez voir que le pod est toujours en cours d'exécution :
```shell
kubectl get pods
```
```
NAME                       READY     STATUS    RESTARTS   AGE
static-web-my-node1        1/1       Running   0          12s
```

De retour sur votre nœud où le kubelet fonctionne, vous pouvez essayer d'arrêter le conteneur de docker manuellement.
Vous verrez qu'au bout d'un certain temps, le kubelet s'en apercevra et redémarrera le pod automatiquement :

```shell
# Exécutez cette commande sur le nœud sur lequel le kubelet fonctionne
docker stop f6d05272b57e # remplacer par l'identifiant de votre conteneur
sleep 20
docker ps
```
```
CONTAINER ID        IMAGE         COMMAND                CREATED       ...
5b920cbaf8b1        nginx:latest  "nginx -g 'daemon of   2 seconds ago ...
```

## Ajout et retrait dynamiques des pods statiques

Le kubelet en cours d'exécution analyse périodiquement le répertoire configuré (`/etc/kubelet.d` dans notre exemple) pour y détecter les modifications et ajoute/supprime les Pods à chaque fois que les pods apparaissent/disparaissent des fichiers dans ce répertoire.

```shell
# Cela suppose que vous utilisez une configuration statique de Pod hébergée par un système de fichiers
# Exécuter ces commandes sur le nœud où le kubelet fonctionne
#
mv /etc/kubelet.d/static-web.yaml /tmp
sleep 20
docker ps
# Vous voyez qu'aucun conteneur nginx tourne
mv /tmp/static-web.yaml  /etc/kubelet.d/
sleep 20
docker ps
```
```
CONTAINER ID        IMAGE         COMMAND                CREATED           ...
e7a62e3427f1        nginx:latest  "nginx -g 'daemon of   27 seconds ago
```

{{% /capture %}}
