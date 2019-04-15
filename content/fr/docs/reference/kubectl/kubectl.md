---
title: kubectl
description: Référence kubectl
notitle: true
---
## kubectl

kubectl contrôle le manager d'un cluster Kubernetes

### Synopsis


kubectl contrôle le manager d'un cluster Kubernetes.

Vous trouverez plus d'informations ici : https://kubernetes.io/fr/docs/reference/kubectl/overview/

```
kubectl [flags]
```

### Options

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--alsologtostderr</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">log sur l'erreur standard en plus d'un fichier</td>
    </tr>

    <tr>
      <td colspan="2">--as chaîne</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Nom d'utilisateur à utiliser pour l'opération</td>
    </tr>

    <tr>
      <td colspan="2">--as-group tableauDeChaînes</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Groupe à utiliser pour l'opération, ce flag peut être répété pour spécifier plusieurs groupes</td>
    </tr>

    <tr>
      <td colspan="2">--azure-container-registry-config chaîne</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Chemin du fichier contenant les informations de configuration du registre de conteneurs Azure</td>
    </tr>

    <tr>
      <td colspan="2">--cache-dir chaîne&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Défaut: "/Users/tim/.kube/http-cache"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Répertoire de cache HTTP par défaut</td>
    </tr>

    <tr>
      <td colspan="2">--certificate-authority chaîne</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Chemin vers un fichier cert pour l'autorité de certification</td>
    </tr>

    <tr>
      <td colspan="2">--client-certificate chaîne</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Chemin vers un fichier de certificat client pour TLS</td>
    </tr>

    <tr>
      <td colspan="2">--client-key chaîne</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Chemin vers un fichier de clé client pour TLS</td>
    </tr>

    <tr>
      <td colspan="2">--cloud-provider-gce-lb-src-cidrs cidrs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Défaut: 130.211.0.0/22,209.85.152.0/22,209.85.204.0/22,35.191.0.0/16</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">CIDRs ouverts dans le firewall GCE pour le proxy de trafic LB & health checks</td>
    </tr>

    <tr>
      <td colspan="2">--cluster chaîne</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Le nom du cluster kubeconfig à utiliser</td>
    </tr>

    <tr>
      <td colspan="2">--context chaîne</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Le nom du contexte kubeconfig à utiliser</td>
    </tr>

    <tr>
      <td colspan="2">--default-not-ready-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Défaut: 300</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Indique les tolerationSeconds de la tolérance pour notReady:NoExecute qui sont ajoutées par défaut à tous les pods qui n'ont pas défini une telle tolérance</td>
    </tr>

    <tr>
      <td colspan="2">--default-unreachable-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Défaut: 300</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Indique les tolerationSeconds de la tolérance pour unreachable:NoExecute qui sont ajoutées par défaut à tous les pods qui n'ont pas défini une telle tolérance</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">aide pour kubectl</td>
    </tr>

    <tr>
      <td colspan="2">--insecure-skip-tls-verify</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Si vrai, la validité du certificat du serveur ne sera pas vérifiée. Ceci rend vos connexions HTTPS non sécurisées</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig chaîne</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Chemin du fichier kubeconfig à utiliser pour les requêtes du CLI</td>
    </tr>

    <tr>
      <td colspan="2">--log-backtrace-at traceLocation&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Défaut: :0</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">lorsque les logs arrivent à la ligne fichier:N, émet une stack trace</td>
    </tr>

    <tr>
      <td colspan="2">--log-dir chaîne</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Si non vide, écrit les fichiers de log dans ce répertoire</td>
    </tr>

    <tr>
      <td colspan="2">--log-file chaîne</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Si non vide, utilise ce fichier de log</td>
    </tr>

    <tr>
      <td colspan="2">--log-flush-frequency durée&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Défaut: 5s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Nombre de secondes maximum entre flushs des logs</td>
    </tr>

    <tr>
      <td colspan="2">--logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Défaut: true</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">log sur l'erreur standard plutôt que dans un fichier</td>
    </tr>

    <tr>
      <td colspan="2">--match-server-version</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">La version du serveur doit correspondre à la version du client</td>
    </tr>

    <tr>
      <td colspan="2">-n, --namespace chaîne</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Si présent, la portée de namespace pour la requête du CLI</td>
    </tr>

    <tr>
      <td colspan="2">--profile chaîne&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Défaut: "none"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Nom du profil à capturer. Parmi (none|cpu|heap|goroutine|threadcreate|block|mutex)</td>
    </tr>

    <tr>
      <td colspan="2">--profile-output chaîne&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Défaut: "profile.pprof"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Nom du fichier dans lequel écrire le profil</td>
    </tr>

    <tr>
      <td colspan="2">--request-timeout chaîne&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Défaut: "0"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">La durée à attendre avant d'abandonner une requête au serveur. Les valeurs non égales à zéro doivent contenir une unité de temps correspondante (ex 1s, 2m, 3h). Une valeur à zéro indique de ne pas abandonner les requêtes</td>
    </tr>

    <tr>
      <td colspan="2">-s, --server chaîne</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">L'adresse et le port de l'API server Kubernetes</td>
    </tr>

    <tr>
      <td colspan="2">--skip-headers</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Si vrai, n'affiche pas les entêtes dans les messages de log</td>
    </tr>

    <tr>
      <td colspan="2">--stderrthreshold sévérité&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Défaut: 2</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">logs à cette sévérité et au dessus de ce seuil vont dans stderr</td>
    </tr>

    <tr>
      <td colspan="2">--token chaîne</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Bearer token pour l'authentification auprès de l'API server</td>
    </tr>

    <tr>
      <td colspan="2">--user chaîne</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Le nom de l'utilisateur kubeconfig à utiliser</td>
    </tr>

    <tr>
      <td colspan="2">-v, --v Niveau</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Niveau de logs</td>
    </tr>

    <tr>
      <td colspan="2">--version version[=true]</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Affiche les informations de version et quitte</td>
    </tr>

    <tr>
      <td colspan="2">--vmodule moduleSpec</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Liste de settings pattern=N séparés par des virgules pour le logging filtré par fichiers</td>
    </tr>

  </tbody>
</table>



### VOIR AUSSI
* [kubectl annotate](/docs/reference/generated/kubectl/kubectl-commands#annotate)	 - Met à jour les annotations d'une ressource
* [kubectl api-resources](/docs/reference/generated/kubectl/kubectl-commands#api-resources)	 - Affiche les ressources de l'API prises en charge sur le serveur
* [kubectl api-versions](/docs/reference/generated/kubectl/kubectl-commands#api-versions)	 - Affiche les versions de l'API prises en charge sur le serveur, sous la forme "groupe/version"
* [kubectl apply](/docs/reference/generated/kubectl/kubectl-commands#apply)	 - Applique une configuration à une ressource depuis un fichier ou stdin
* [kubectl attach](/docs/reference/generated/kubectl/kubectl-commands#attach)	 - Attache à un conteneur en cours d'exécution
* [kubectl auth](/docs/reference/generated/kubectl/kubectl-commands#auth)	 - Inspecte les autorisations
* [kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands#autoscale)	 - Auto-scale un Deployment, ReplicaSet, ou ReplicationController
* [kubectl certificate](/docs/reference/generated/kubectl/kubectl-commands#certificate)	 - Modifie des ressources certificat
* [kubectl cluster-info](/docs/reference/generated/kubectl/kubectl-commands#cluster-info)	 - Affiche les informations du cluster
* [kubectl completion](/docs/reference/generated/kubectl/kubectl-commands#completion)	 - Génère le code de complétion pour le shell spécifié (bash ou zsh)
* [kubectl config](/docs/reference/generated/kubectl/kubectl-commands#config)	 - Modifie les fichiers kubeconfig
* [kubectl convert](/docs/reference/generated/kubectl/kubectl-commands#convert)	 - Convertit des fichiers de config entre différentes versions d'API
* [kubectl cordon](/docs/reference/generated/kubectl/kubectl-commands#cordon)	 - Marque un nœud comme non assignable (unschedulable)
* [kubectl cp](/docs/reference/generated/kubectl/kubectl-commands#cp)	 - Copie des fichiers et répertoires depuis et vers des conteneurs
* [kubectl create](/docs/reference/generated/kubectl/kubectl-commands#create)	 - Crée une ressource depuis un fichier ou stdin
* [kubectl delete](/docs/reference/generated/kubectl/kubectl-commands#delete)	 - Supprime des ressources par fichiers ou stdin, par ressource et nom, ou par ressource et sélecteur de label
* [kubectl describe](/docs/reference/generated/kubectl/kubectl-commands#describe)	 - Affiche les informations d'une ressource spécifique ou d'un groupe de ressources
* [kubectl diff](/docs/reference/generated/kubectl/kubectl-commands#diff)	 - Différence entre la version live et la version désirée
* [kubectl drain](/docs/reference/generated/kubectl/kubectl-commands#drain)	 - Draine un nœud en préparation d'une mise en maintenance
* [kubectl edit](/docs/reference/generated/kubectl/kubectl-commands#edit)	 - Édite une ressource du serveur
* [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands#exec)	 - Exécute une commande dans un conteneur
* [kubectl explain](/docs/reference/generated/kubectl/kubectl-commands#explain)	 - Documentation sur les ressources
* [kubectl expose](/docs/reference/generated/kubectl/kubectl-commands#expose)	 - Prend un replication controller, service, deployment ou pod et l'expose comme un nouveau Service Kubernetes
* [kubectl get](/docs/reference/generated/kubectl/kubectl-commands#get)	 - Affiche une ou plusieurs ressources
* [kubectl label](/docs/reference/generated/kubectl/kubectl-commands#label)	 - Met à jour les labels d'une ressource
* [kubectl logs](/docs/reference/generated/kubectl/kubectl-commands#logs)	 - Affiche les logs d'un conteneur dans un pod
* [kubectl options](/docs/reference/generated/kubectl/kubectl-commands#options)	 - Affiche la liste des flags hérités par toutes les commandes
* [kubectl patch](/docs/reference/generated/kubectl/kubectl-commands#patch)	 - Met à jour un ou plusieurs champs d'une ressource par merge patch stratégique
* [kubectl plugin](/docs/reference/generated/kubectl/kubectl-commands#plugin)	 - Fournit des utilitaires pour interagir avec des plugins
* [kubectl port-forward](/docs/reference/generated/kubectl/kubectl-commands#port-forward)	 - Redirige un ou plusieurs ports vers un pod
* [kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands#proxy)	 - Exécute un proxy vers l'API server Kubernetes
* [kubectl replace](/docs/reference/generated/kubectl/kubectl-commands#replace)	 - Remplace une ressource par fichier ou stdin
* [kubectl rollout](/docs/reference/generated/kubectl/kubectl-commands#rollout)	 - Gère le rollout d'une ressource
* [kubectl run](/docs/reference/generated/kubectl/kubectl-commands#run)	 - Exécute une image donnée dans le cluster
* [kubectl scale](/docs/reference/generated/kubectl/kubectl-commands#scale)	 - Définit une nouvelle taille pour un Deployment, ReplicaSet, Replication Controller, ou Job
* [kubectl set](/docs/reference/generated/kubectl/kubectl-commands#set)	 - Définit des fonctionnalités spécifiques sur des objets
* [kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint)	 - Met à jour les marques (taints) sur un ou plusieurs nœuds
* [kubectl top](/docs/reference/generated/kubectl/kubectl-commands#top)	 - Affiche l'utilisation de ressources matérielles (CPU/Memory/Storage)
* [kubectl uncordon](/docs/reference/generated/kubectl/kubectl-commands#uncordon)	 - Marque un nœud comme assignable (schedulable)
* [kubectl version](/docs/reference/generated/kubectl/kubectl-commands#version)	 - Affiche les informations de version du client et du serveur
* [kubectl wait](/docs/reference/generated/kubectl/kubectl-commands#wait)	 - Expérimental : Attend une condition particulière sur une ou plusieurs ressources
