---
title: Aide-mémoire kubectl
description: Cheatsheet kubectl aide-mémoire
content_template: templates/concept
card:
  name: reference
  weight: 30
---

{{% capture overview %}}

Voir aussi : [Aperçu Kubectl](/docs/reference/kubectl/overview/) et [Guide JsonPath](/docs/reference/kubectl/jsonpath).

Cette page donne un aperçu de la commande `kubectl`.

{{% /capture %}}

{{% capture body %}}

# Aide-mémoire kubectl

## Auto-complétion avec Kubectl

### BASH

```bash
source <(kubectl completion bash) # active l'auto-complétion pour bash dans le shell courant, le paquet bash-completion devant être installé au préalable
echo "source <(kubectl completion bash)" >> ~/.bashrc # ajoute l'auto-complétion de manière permanente à votre shell bash
```

Vous pouvez de plus déclarer un alias pour `kubectl` qui fonctionne aussi avec l'auto-complétion :  

```bash
alias k=kubectl
complete -F __start_kubectl k
```

### ZSH

```bash
source <(kubectl completion zsh)  # active l'auto-complétion pour zsh dans le shell courant
echo "if [ $commands[kubectl] ]; then source <(kubectl completion zsh); fi" >> ~/.zshrc # ajoute l'auto-complétion de manière permanente à votre shell zsh
```

## Contexte et configuration de Kubectl

Indique avec quel cluster Kubernetes `kubectl` communique et modifie les informations de configuration. Voir la documentation [Authentification multi-clusters avec kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) pour des informations détaillées sur le fichier de configuration.

```bash
kubectl config view # Affiche les paramètres fusionnés de kubeconfig

# Utilise plusieurs fichiers kubeconfig en même temps et affiche la configuration fusionnée
KUBECONFIG=~/.kube/config:~/.kube/kubconfig2 kubectl config view

# Affiche le mot de passe pour l'utilisateur e2e
kubectl config view -o jsonpath='{.users[?(@.name == "e2e")].user.password}'

kubectl config current-context              # Affiche le contexte courant (current-context)
kubectl config use-context my-cluster-name  # Définit my-cluster-name comme contexte courant

# Ajoute un nouveau cluster à votre kubeconf, prenant en charge l'authentification de base (basic auth)
kubectl config set-credentials kubeuser/foo.kubernetes.com --username=kubeuser --password=kubepassword

# Définit et utilise un contexte qui utilise un nom d'utilisateur et un namespace spécifiques
kubectl config set-context gce --user=cluster-admin --namespace=foo \
  && kubectl config use-context gce
```

## Création d'objets

Les manifests Kubernetes peuvent être définis en json ou yaml. Les extensions de fichier `.yaml`,
`.yml`, et `.json` peuvent être utilisés.

```bash
kubectl create -f ./my-manifest.yaml           # crée une ou plusieurs ressources
kubectl create -f ./my1.yaml -f ./my2.yaml     # crée depuis plusieurs fichiers
kubectl create -f ./dir                        # crée une ou plusieurs ressources depuis tous les manifests dans dir
kubectl create -f https://git.io/vPieo         # crée une ou plusieurs ressources depuis une url
kubectl create deployment nginx --image=nginx  # démarre une instance unique de nginx
kubectl explain pods,svc                       # affiche la documentation pour les manifests pod et svc

# Crée plusieurs objets YAML depuis l'entrée standard (stdin)
cat <<EOF | kubectl create -f -
apiVersion: v1
kind: Pod
metadata:
  name: busybox-sleep
spec:
  containers:
  - name: busybox
    image: busybox
    args:
    - sleep
    - "1000000"
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox-sleep-less
spec:
  containers:
  - name: busybox
    image: busybox
    args:
    - sleep
    - "1000"
EOF

# Crée un Secret contenant plusieurs clés
cat <<EOF | kubectl create -f -
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  password: $(echo -n "s33msi4" | base64 -w0)
  username: $(echo -n "jane" | base64 -w0)
EOF

```

## Visualisation et Recherche de ressources

```bash
# Commandes Get avec un affichage basique
kubectl get services                          # Liste tous les services d'un namespace
kubectl get pods --all-namespaces             # Liste tous les pods de tous les namespaces
kubectl get pods -o wide                      # Liste tous les pods du namespace, avec plus de détails
kubectl get deployment my-dep                 # Liste un déploiement particulier
kubectl get pods --include-uninitialized      # Liste tous les pods dans un namespace, incluant ceux non initialisés

# Commandes Describe avec un affichage verbeux
kubectl describe nodes my-node
kubectl describe pods my-pod

kubectl get services --sort-by=.metadata.name # Liste les services classés par nom

# Liste les pods classés par nombre de redémarrages
kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'

# Affiche la version des labels de tous les pods ayant un label app=cassandra
kubectl get pods --selector=app=cassandra -o \
  jsonpath='{.items[*].metadata.labels.version}'

# Affiche tous les noeuds, en utilisant un sélecteur pour exclure ceux ayant un label 'node-role.kubernetes.io/master'
kubectl get node --selector='!node-role.kubernetes.io/master'

# Affiche tous les pods en cours d'exécution (Running) dans le namespace
kubectl get pods --field-selector=status.phase=Running

# Affiche les IPs externes (ExternalIPs) de tous les noeuds
kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="ExternalIP")].address}'

# Liste les noms des pods appartenant à un ReplicationController particulier
# "jq" est une commande utile pour des transformations non prises en charge par jsonpath, il est disponible ici : https://stedolan.github.io/jq/
sel=${$(kubectl get rc my-rc --output=json | jq -j '.spec.selector | to_entries | .[] | "\(.key)=\(.value),"')%?}
echo $(kubectl get pods --selector=$sel --output=jsonpath={.items..metadata.name})

# Affiche les labels pour tous les pods (ou tout autre objet Kubernetes prenant en charge les labels)
# Utilise aussi "jq"
for item in $( kubectl get pod --output=name); do printf "Labels for %s\n" "$item" | grep --color -E '[^/]+$' && kubectl get "$item" --output=json | jq -r -S '.metadata.labels | to_entries | .[] | " \(.key)=\(.value)"' 2>/dev/null; printf "\n"; done

# Vérifie quels noeuds sont prêts
JSONPATH='{range .items[*]}{@.metadata.name}:{range @.status.conditions[*]}{@.type}={@.status};{end}{end}' \
 && kubectl get nodes -o jsonpath="$JSONPATH" | grep "Ready=True"

# Liste tous les Secrets actuellement utilisés par un pod
kubectl get pods -o json | jq '.items[].spec.containers[].env[]?.valueFrom.secretKeyRef.name' | grep -v null | sort | uniq

# Liste les événements (Events) classés par timestamp
kubectl get events --sort-by=.metadata.creationTimestamp
```

## Mise à jour de ressources

Depuis la version 1.11, `rolling-update` a été déprécié (voir [CHANGELOG-1.11.md](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.11.md)), utilisez plutôt `rollout`.

```bash
kubectl set image deployment/frontend www=image:v2               # Rolling update du conteneur "www" du déploiement "frontend", par mise à jour de son image
kubectl rollout undo deployment/frontend                         # Rollback du déploiement précédent
kubectl rollout status -w deployment/frontend                    # Écoute (Watch) le status du rolling update du déploiement "frontend" jusqu'à ce qu'il se termine

# déprécié depuis la version 1.11
kubectl rolling-update frontend-v1 -f frontend-v2.json           # (déprécié) Rolling update des pods de frontend-v1
kubectl rolling-update frontend-v1 frontend-v2 --image=image:v2  # (déprécié) Modifie le nom de la ressource et met à jour l'image
kubectl rolling-update frontend --image=image:v2                 # (déprécié) Met à jour l'image du pod du déploiement frontend
kubectl rolling-update frontend-v1 frontend-v2 --rollback        # (déprécié) Annule (rollback) le rollout en cours

cat pod.json | kubectl replace -f -                              # Remplace un pod, en utilisant un JSON passé en entrée standard

# Remplace de manière forcée (Force replace), supprime puis re-crée la ressource. Provoque une interruption de service.
kubectl replace --force -f ./pod.json

# Crée un service pour un nginx repliqué, qui rend le service sur le port 80 et se connecte aux conteneurs sur le port 8000
kubectl expose rc nginx --port=80 --target-port=8000

# Modifie la version (tag) de l'image du conteneur unique du pod à v4
kubectl get pod mypod -o yaml | sed 's/\(image: myimage\):.*$/\1:v4/' | kubectl replace -f -

kubectl label pods my-pod new-label=awesome                      # Ajoute un Label
kubectl annotate pods my-pod icon-url=http://goo.gl/XXBTWq       # Ajoute une annotation
kubectl autoscale deployment foo --min=2 --max=10                # Mise à l'échelle automatique (Auto scale) d'un déploiement "foo"
```

## Mise à jour partielle de ressources

```bash
kubectl patch node k8s-node-1 -p '{"spec":{"unschedulable":true}}' # Met à jour partiellement un noeud

# Met à jour l'image d'un conteneur ; spec.containers[*].name est requis car c'est une clé du merge
kubectl patch pod valid-pod -p '{"spec":{"containers":[{"name":"kubernetes-serve-hostname","image":"new image"}]}}'

# Met à jour l'image d'un conteneur en utilisant un patch json avec tableaux indexés
kubectl patch pod valid-pod --type='json' -p='[{"op": "replace", "path": "/spec/containers/0/image", "value":"new image"}]'

# Désactive la livenessProbe d'un déploiement en utilisant un patch json avec tableaux indexés
kubectl patch deployment valid-deployment  --type json   -p='[{"op": "remove", "path": "/spec/template/spec/containers/0/livenessProbe"}]'

# Ajoute un nouvel élément à un tableau indexé 
kubectl patch sa default --type='json' -p='[{"op": "add", "path": "/secrets/1", "value": {"name": "whatever" } }]'
```

## Édition de ressources
Ceci édite n'importe quelle ressource de l'API dans un éditeur.

```bash
kubectl edit svc/docker-registry                      # Édite le service nommé docker-registry
KUBE_EDITOR="nano" kubectl edit svc/docker-registry   # Utilise un autre éditeur
```

## Mise à l'échelle de ressources

```bash
kubectl scale --replicas=3 rs/foo                                 # Scale un replicaset nommé 'foo' à 3
kubectl scale --replicas=3 -f foo.yaml                            # Scale une ressource spécifiée dans foo.yaml" à 3
kubectl scale --current-replicas=2 --replicas=3 deployment/mysql  # Si la taille du déploiement nommé mysql est actuellement 2, scale mysql à 3
kubectl scale --replicas=5 rc/foo rc/bar rc/baz                   # Scale plusieurs contrôleurs de réplication
```

## Suppression de ressources

```bash
kubectl delete -f ./pod.json                                              # Supprime un pod en utilisant le type et le nom spécifiés dans pod.json
kubectl delete pod,service baz foo                                        # Supprime les pods et services ayant les mêmes noms "baz" et "foo"
kubectl delete pods,services -l name=myLabel                              # Supprime les pods et services ayant le label name=myLabel
kubectl delete pods,services -l name=myLabel --include-uninitialized      # Supprime les pods et services, dont ceux non initialisés, ayant le label name=myLabel
kubectl -n my-ns delete po,svc --all                                      # Supprime tous les pods et services, dont ceux non initialisés, dans le namespace my-ns
```

## Interaction avec des Pods en cours d'exécution

```bash
kubectl logs my-pod                                 # Affiche les logs du pod (stdout)
kubectl logs my-pod --previous                      # Affiche les logs du pod (stdout) pour une instance précédente du conteneur
kubectl logs my-pod -c my-container                 # Affiche les logs d'un conteneur particulier du pod (stdout, cas d'un pod multi-conteneurs)
kubectl logs my-pod -c my-container --previous      # Affiche les logs d'un conteneur particulier du pod (stdout, cas d'un pod multi-conteneurs) pour une instance précédente du conteneur
kubectl logs -f my-pod                              # Fait défiler (stream) les logs du pod (stdout)
kubectl logs -f my-pod -c my-container              # Fait défiler (stream) les logs d'un conteneur particulier du pod (stdout, cas d'un pod multi-conteneurs)
kubectl run -i --tty busybox --image=busybox -- sh  # Exécute un pod comme un shell interactif
kubectl attach my-pod -i                            # Attache à un conteneur en cours d'exécution
kubectl port-forward my-pod 5000:6000               # Écoute le port 5000 de la machine locale et forwarde vers le port 6000 de my-pod
kubectl exec my-pod -- ls /                         # Exécute une commande dans un pod existant (cas d'un seul conteneur)
kubectl exec my-pod -c my-container -- ls /         # Exécute une commande dans un pod existant (cas multi-conteneurs)
kubectl top pod POD_NAME --containers               # Affiche les métriques pour un pod donné et ses conteneurs
```

## Interaction avec des Noeuds et Clusters

```bash
kubectl cordon mon-noeud                                              # Marque mon-noeud comme non assignable (unschedulable)
kubectl drain mon-noeud                                               # Draine mon-noeud en préparation d'une mise en maintenance
kubectl uncordon mon-noeud                                            # Marque mon-noeud comme assignable
kubectl top node mon-noeud                                            # Affiche les métriques pour un noeud donné
kubectl cluster-info                                                  # Affiche les adresses du master et des services
kubectl cluster-info dump                                             # Affiche l'état courant du cluster sur stdout
kubectl cluster-info dump --output-directory=/path/to/cluster-state   # Affiche l'état courant du cluster sur /path/to/cluster-state

# Si une teinte avec cette clé et cet effet existe déjà, sa valeur est remplacée comme spécifié.
kubectl taint nodes foo dedicated=special-user:NoSchedule
```

### Types de ressources

Liste tous les types de ressources pris en charge avec leurs noms courts (shortnames), [groupe d'API (API group)](/docs/concepts/overview/kubernetes-api/#api-groups), si elles sont [cantonnées à un namespace (namespaced)](/docs/concepts/overview/working-with-objects/namespaces), et leur [Genre (Kind)](/docs/concepts/overview/working-with-objects/kubernetes-objects):

```bash
kubectl api-resources
```

Autres opérations pour explorer les ressources de l'API :

```bash
kubectl api-resources --namespaced=true      # Toutes les ressources cantonnées à un namespace
kubectl api-resources --namespaced=false     # Toutes les ressources non cantonnées à un namespace
kubectl api-resources -o name                # Toutes les ressources avec un affichage simple (uniquement le nom de la ressource)
kubectl api-resources -o wide                # Toutes les ressources avec un affichage étendu (alias "wide")
kubectl api-resources --verbs=list,get       # Toutes les ressources prenant en charge les verbes de requête "list" et "get"
kubectl api-resources --api-group=extensions # Toutes les ressources dans le groupe d'API "extensions"
```

### Formattage de l'affichage

Pour afficher les détails sur votre terminal dans un format spécifique, vous pouvez utiliser une des options `-o` ou `--output` avec les commandes `kubectl` qui les prennent en charge.

| Format d'affichage                  | Description                                                                                                           |
|-------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `-o=custom-columns=<spec>`          | Affiche un tableau en spécifiant une liste de colonnes séparées par des virgules                                      |
| `-o=custom-columns-file=<filename>` | Affiche un tableau en utilisant les colonnes spécifiées dans le fichier `<filename>`                                  |
| `-o=json`                           | Affiche un objet de l'API formaté en JSON                                                                             |
| `-o=jsonpath=<template>`            | Affiche les champs définis par une expression [jsonpath](/docs/reference/kubectl/jsonpath)                            |
| `-o=jsonpath-file=<filename>`       | Affiche les champs définis par l'expression [jsonpath](/docs/reference/kubectl/jsonpath) dans le fichier `<filename>` |
| `-o=name`                           | Affiche seulement le nom de la ressource et rien de plus                                                              |
| `-o=wide`                           | Affiche dans le format texte avec toute information supplémentaire, et pour des pods, le nom du noeud est inclus      |
| `-o=yaml`                           | Affiche un objet de l'API formaté en YAML                                                                             |
### Verbosité de l'affichage de Kubectl et débogage

La verbosité de Kubectl est contrôlée par une des options `-v` ou `--v` suivie d'un entier représentant le niveau de log. Les conventions générales de logging de Kubernetes et les niveaux de log associés sont décrits [ici](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md).

| Verbosité | Description                                                                                                                                                                                                                           |
|-----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--v=0`   | Le minimum qui doit TOUJOURS être affiché à un opérateur.                                                                                                                                                                             |
| `--v=1`   | Un niveau de log par défaut raisonnable si vous n'avez pas besoin de verbosité.                                                                                                                                                       |
| `--v=2`   | Informations utiles sur l'état stable du service et messages de logs importants qui peuvent être corrélés à des changements significatifs dans le système. C'est le niveau de log par défaut recommandé pour la plupart des systèmes. |
| `--v=3`   | Informations étendues sur les changements.                                                                                                                                                                                            |
| `--v=4`   | Verbosité de Debug.                                                                                                                                                                                                                   |
| `--v=6`   | Affiche les ressources requêtées.                                                                                                                                                                                                     |
| `--v=7`   | Affiche les entêtes des requêtes HTTP.                                                                                                                                                                                                |
| `--v=8`   | Affiche les contenus des requêtes HTTP.                                                                                                                                                                                               |
| `--v=9`   | Affiche les contenus des requêtes HTTP sans les tronquer.                                                                                                                                                                             |
{{% /capture %}}

{{% capture whatsnext %}}

* En savoir plus sur l'[Aperçu de kubectl](/docs/reference/kubectl/overview/).

* Voir les options [kubectl](/docs/reference/kubectl/kubectl/).

* Voir aussi les [Conventions d'usage de kubectl](/docs/reference/kubectl/conventions/) pour comprendre comment l'utiliser dans des scripts réutilisables.

* Voir plus d'[aides-mémoire kubectl](https://github.com/dennyzhang/cheatsheet-kubernetes-A4).

{{% /capture %}}
