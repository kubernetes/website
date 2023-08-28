---
title: Utilisation de l'autorisation RBAC
content_type: concept
aliases: [/fr/rbac/]
weight: 70
---

<!--
reviewers:
- erictune
- deads2k
- liggitt
title: Using RBAC Authorization
content_type: concept
aliases: [/rbac/]
weight: 70
-->

<!-- overview -->
Le contrôle d'accès basé sur les rôles (RBAC) est une méthode permettant de 
réguler l'accès aux ressources informatiques ou réseau en fonction des rôles des
utilisateurs individuels au sein de votre organisation.


<!-- body -->
L'autorisation RBAC utilise le {{< glossary_tooltip text="groupe d'API" term_id="api-group" >}} 
`rbac.authorization.k8s.io` pour prendre les 
décisions d'autorisation, ce qui vous permet de configurer 
dynamiquement les politiques via l'API Kubernetes.

Pour activer RBAC, démarrez l'{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
avec l'indicateur `--authorization-mode` défini sur une liste séparée par des virgules qui inclut `RBAC` ;
par exemple :
```shell
kube-apiserver --authorization-mode=Example,RBAC --other-options --more-options
```

## Objets de l'API {#api-overview}

L'API RBAC déclare quatre types d'objets Kubernetes : _Role_, _ClusterRole_,
_RoleBinding_ et _ClusterRoleBinding_. Vous pouvez
[décrire les objets](/docs/concepts/overview/working-with-objects/kubernetes-objects/#understanding-kubernetes-objects),
ou les modifier, en utilisant des outils tels que `kubectl`, comme tout autre objet Kubernetes.

{{< caution >}}
Ces objets, de par leur conception, imposent des restrictions d'accès. Si vous apportez des modifications
à un cluster au fur et à mesure de votre apprentissage, consultez la
[prévention de l'escalade des privilèges et amorçage](#privilege-escalation-prevention-and-bootstrapping)
pour comprendre comment ces restrictions peuvent vous empêcher d'effectuer certaines modifications.
{{< /caution >}}

### Role et ClusterRole

Un _Role_ ou _ClusterRole_ RBAC contient des règles qui représentent un ensemble de permissions.
Les permissions sont purement additives (il n'y a pas de règles de "refus").

Un rôle définit toujours les autorisations dans un {{< glossary_tooltip text="namespace" term_id="namespace" >}} particulier;
lorsque vous créez un Role, vous devez spécifier le namespace auquel il appartient.

ClusterRole, en revanche, est une ressource sans namespace. Les ressources portent des noms différents (Role
et ClusterRole) parce qu'un objet Kubernetes doit toujours être soit avec un namespace ou soit sans namespace;
Il ne peut pas être les deux.

Les ClusterRoles ont plusieurs usages. Vous pouvez utiliser une ClusterRole pour :

1. définir les autorisations sur les ressources avec un namespace et obtenir l'accès à l'intérieur d'un ou plusieurs namespaces
1. définir les permissions sur les ressources avec un namespace et obtenir l'accès à travers tous les namespaces.
1. définir les permissions sur les ressources à l'échelle du cluster

Si vous souhaitez définir un rôle au sein d'un namespace, utilisez un Role; si vous souhaitez
définir un rôle à l'échelle du cluster, utilisez un ClusterRole.
#### Exemple de Role

Voici un exemple de rôle dans le namespace "default" qui peut être utilisé pour accorder un accès en lecture aux
{{< glossary_tooltip text="pods" term_id="pod" >}}:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""] # "" indicates the core API group
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
```

#### Exemple de ClusterRole

Un ClusterRole peut être utilisé pour accorder les mêmes permissions qu'un Role.
Étant donné que les ClusterRoles sont à l'échelle des clusters, vous pouvez également 
les utiliser pour accorder l'accès à:

* des ressources à l'échelle du cluster (comme {{< glossary_tooltip text="nodes" term_id="node" >}})
* des endpoints non liés aux ressources (comme `/healthz`)
* des ressources à namespaces (comme les pods), dans tous les namespaces.

  Par exemple: vous pouvez utiliser un ClusterRole pour autoriser un utilisateur particulier à exécuter
  `kubectl get pods --all-namespaces`

Voici un exemple de ClusterRole qui peut être utilisé pour accorder un accès en lecture à
{{< glossary_tooltip text="secrets" term_id="secret" >}} dans un namespace particulier,
ou dans tous les namespaces (selon la façon dont il est [lié](#rolebinding-and-clusterrolebinding)):

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  # "namespace" omitted since ClusterRoles are not namespaced
  name: secret-reader
rules:
- apiGroups: [""]
  #
  # at the HTTP level, the name of the resource for accessing Secret
  # objects is "secrets"
  resources: ["secrets"]
  verbs: ["get", "watch", "list"]
```

Le nom d'un Role ou d'un objet ClusterRole doit être un 
[nom de segment de chemin](/docs/concepts/overview/working-with-objects/names#path-segment-names) valide.

### RoleBinding et ClusterRoleBinding

Un RoleBinding accorde les permissions définies dans un rôle à un utilisateur ou à un ensemble d'utilisateurs.
Il contient une liste de *sujets* (utilisateurs, groupes, ou comptes de service), et une référence au rôle accordé.
Un RoleBinding accorde des permissions dans un namespace spécifique alors qu'un ClusterRoleBinding accorde cet accès à l'échelle du cluster.

Le nom d'un objet RoleBinding ou ClusterRoleBinding doit être un [nom de segment de chemin](/docs/concepts/overview/working-with-objects/names#path-segment-names) valide.

#### Exemples de RoleBinding {#rolebinding-example}

Voici un exemple de RoleBinding qui accorde le Role "pod-reader" à l'utilisateur "jane" 
dans le namespace "default".
Ceci permet à "jane" de lire les pods dans le namespace "default".

```yaml
apiVersion: rbac.authorization.k8s.io/v1
# This role binding allows "jane" to read pods in the "default" namespace.
# You need to already have a Role named "pod-reader" in that namespace.
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
# You can specify more than one "subject"
- kind: User
  name: jane # "name" is case sensitive
  apiGroup: rbac.authorization.k8s.io
roleRef:
  # "roleRef" specifies the binding to a Role / ClusterRole
  kind: Role #this must be Role or ClusterRole
  name: pod-reader # this must match the name of the Role or ClusterRole you wish to bind to
  apiGroup: rbac.authorization.k8s.io
```

Un RoleBinding peut également faire référence à un ClusterRole pour accorder les 
permissions définies dans ce ClusterRole aux ressources du namespace du RoleBinding.
Ce type de référence vous permet de définir un ensemble de rôles communs à l'ensemble 
de votre cluster, puis de les réutiliser dans plusieurs namespaces.

Par exemple, même si le RoleBinding suivant fait référence à un ClusterRole, "dave" (le sujet, sensible à la casse) 
ne pourra lire que les Secrets dans le namespace "development", car le namespace du 
RoleBinding (dans son metadata) est "development".

```yaml
apiVersion: rbac.authorization.k8s.io/v1
# This role binding allows "dave" to read secrets in the "development" namespace.
# You need to already have a ClusterRole named "secret-reader".
kind: RoleBinding
metadata:
  name: read-secrets
  #
  # The namespace of the RoleBinding determines where the permissions are granted.
  # This only grants permissions within the "development" namespace.
  namespace: development
subjects:
- kind: User
  name: dave # Name is case sensitive
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io
```

#### Exemple de ClusterRoleBinding

Pour accorder des permissions sur l'ensemble d'un cluster, vous pouvez utiliser un 
ClusterRoleBinding. Le ClusterRoleBinding suivant permet à tout utilisateur du groupe "manager" 
de lire secrets dans n'importe quel namespace.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
# This cluster role binding allows anyone in the "manager" group to read secrets in any namespace.
kind: ClusterRoleBinding
metadata:
  name: read-secrets-global
subjects:
- kind: Group
  name: manager # Name is case sensitive
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io
```

Après avoir créé un lien, vous ne pouvez pas modifier le Role ou le ClusterRole auquel il fait référence.
Si vous essayez de modifier le `roleRef` d'un lien, vous obtenez une erreur de validation.
Si vous souhaitez changer le `roleRef` d'un lien, vous devez supprimer l'objet binding 
et en créer un autre.

Il y a deux raisons à cette restriction :

1. Rendre `roleRef` immuable permet d'accorder à quelqu'un la permission `update` sur un objet de liaison existant,
afin qu'il puisse gérer la liste des sujets, sans pouvoir changer le rôle qui est accordé à ces sujets.
1. Un lien vers un rôle différent est un lien fondamentalement différent.
Le fait d'exiger qu'un lien soit supprimé/créé afin de modifier le `roleRef`
garantit que la liste complète des sujets dans le binding est destinée à
recevoir le nouveau rôle (par opposition à l'activation ou à la modification
accidentelle uniquement du roleRef sans vérifier que tous les sujets existants 
doivent recevoir les permissions du nouveau rôle).

L'utilitaire de ligne de commande `kubectl auth reconcile` crée ou met à jour un fichier manifeste contenant des objets RBAC,
et gère la suppression et la recréation des objets de liaison si nécessaire pour modifier le rôle auquel ils se réfèrent.
Voir [utilisation de la commande et exemples](#kubectl-auth-reconcile) pour plus d'informations.

### Référence aux ressources

Dans l'API Kubernetes, la plupart des ressources sont représentées et accessibles à l'aide d'une chaîne de caractères de leur nom d'objet,
comme `pods` pour un Pod. RBAC fait référence aux ressources en utilisant exactement 
le même nom que celui qui apparaît dans l'URL du endpoint de l'API concerné.
Certaines API Kubernetes impliquent une
_sous-ressource_, comme les logs d'un Pod. Une requête pour les logs d'un Pod ressemble à ceci :

```http
GET /api/v1/namespaces/{namespace}/pods/{name}/log
```

Dans ce cas, `pods` est la ressource à namespace pour les ressources Pods,
et `log` est une sous-ressource de `pods`. Pour représenter cela dans un rôle RBAC,
utilisez une barre oblique (`/`) pour délimiter la ressource et la sous-ressource.
Pour permettre à un sujet de lire `pods` et d'accéder également à la sous-ressource `log` pour chacun de ces Pods, vous écrivez :

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-and-pod-logs-reader
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list"]
```

Vous pouvez également faire référence à des ressources par leur nom pour certaines demandes par le biais de la liste `resourceNames`.
Lorsque cela est spécifié, les demandes peuvent être limitées à des instances individuelles d'une ressource.
Voici un exemple qui limite son sujet à seulement `get` ou `update` une
{{< glossary_tooltip term_id="ConfigMap" >}} nommée `my-configmap`:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: configmap-updater
rules:
- apiGroups: [""]
  #
  # at the HTTP level, the name of the resource for accessing ConfigMap
  # objects is "configmaps"
  resources: ["configmaps"]
  resourceNames: ["my-configmap"]
  verbs: ["update", "get"]
```

{{< note >}}
Vous ne pouvez pas restreindre les demandes `create` ou `deletecollection` par leur nom de ressource.
Pour `create`, cette limitation est due au fait que le nom du nouvel objet peut ne pas être connu au moment de l'autorisation.
Si vous limitez `list` ou `watch` par le nom de la ressource, les clients doivent inclure un sélecteur de champ `metadata.name` dans leur demande de `list` ou `watch` qui correspond au nom de la ressource spécifiée afin d'être autorisés.
Par exemple, `kubectl get configmaps --field-selector=metadata.name=my-configmap`
{{< /note >}}

Plutôt que de faire référence à des `ressources` et des `verbes` individuels, vous pouvez utiliser le symbole astérisque `*` pour faire référence à tous ces objets.
Pour les `nonResourceURLs`, vous pouvez utiliser le symbole astérisque `*` comme suffixe de correspondance glob et pour les `apiGroups` et les `resourceNames` un ensemble vide signifie que tout est autorisé. 
Voici un exemple qui autorise l'accès pour effectuer toute action actuelle et future sur toutes les ressources actuelles et futures (remarque, ceci est similaire au rôle `cluster-admin` intégré).

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: example.com-superuser  # DO NOT USE THIS ROLE, IT IS JUST AN EXAMPLE
rules:
- apiGroups: ["example.com"]
  resources: ["*"]
  verbs: ["*"]
```

{{< caution >}}
L'utilisation d'astérisques dans les entrées de ressources et de verbes peut entraîner l'octroi d'un accès trop permissif à des ressources sensibles.
Par exemple, si un nouveau type de ressource est ajouté, ou si une nouvelle sous-ressource est ajoutée, ou si un nouveau verbe personnalisé est coché, l'utilisation de l'astérisque accorde automatiquement l'accès, ce qui peut être indésirable.
Le [principe du moindre privilège](/docs/concepts/security/rbac-good-practices/#least-privilege) doit être employé, en utilisant des ressources et des verbes spécifiques pour garantir que seules les autorisations nécessaires au bon fonctionnement de la charge de travail sont appliquées.
{{< /caution >}}


### ClusterRoles agrégés

Vous pouvez _agréger_ plusieurs ClusterRoles en un seul ClusterRole combiné.
Un contrôleur, qui s'exécute dans le cadre du plan de contrôle du cluster, recherche les objets ClusterRole
avec une `aggregationRule` définie. L'`aggregationRule` définit un label
{{< glossary_tooltip text="selector" term_id="selector" >}} que le contrôleur 
utilise pour faire correspondre d'autres objets ClusterRole qui devraient être combinés dans le champ de règles de celui-ci.

{{< caution >}}
Le plan de contrôle écrase toutes les valeurs que vous spécifiez manuellement dans le champ `rules` d'un ClusterRole agrégé.
Si vous souhaitez modifier ou ajouter des règles, faites-le dans les objets `ClusterRole` 
qui sont sélectionnés par l'`aggregationRule`.
{{< /caution >}}

Voici un exemple de ClusterRole agrégé :

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: monitoring
aggregationRule:
  clusterRoleSelectors:
  - matchLabels:
      rbac.example.com/aggregate-to-monitoring: "true"
rules: [] # The control plane automatically fills in the rules
```

Si vous créez un nouvel ClusterRole qui correspond au sélecteur d'étiquette d'une ClusterRole
agrégé existant, ce changement déclenche l'ajout des nouvelles règles dans le ClusterRole agrégé.
Voici un exemple qui ajoute des règles au ClusterRole "monitoring", en créant un autre ClusterRole
étiqueté `rbac.example.com/aggregate-to-monitoring: true`.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: monitoring-endpoints
  labels:
    rbac.example.com/aggregate-to-monitoring: "true"
# When you create the "monitoring-endpoints" ClusterRole,
# the rules below will be added to the "monitoring" ClusterRole.
rules:
- apiGroups: [""]
  resources: ["services", "endpointslices", "pods"]
  verbs: ["get", "list", "watch"]
```

Les [rôles par défaut](#default-roles-and-role-bindings) destinés aux utilisateurs utilisent l'agrégation ClusterRole. Cela vous permet,
en tant qu'administrateur de cluster, d'inclure des règles pour les ressources personnalisées, telles que celles servies par
{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinitions" >}}
ou les serveurs API agrégés, afin d'étendre les rôles par défaut.

Par exemple : les ClusterRoles suivants permettent aux rôles par défaut "admin" et "edit" de gérer la ressource personnalisée
nommée CronTab, tandis que le rôle "view" ne peut effectuer que des actions de lecture sur les ressources CronTab.
Vous pouvez supposer que les objets CronTab sont nommés `"crontabs"` dans les URLs telles que vues par le serveur API.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: aggregate-cron-tabs-edit
  labels:
    # Add these permissions to the "admin" and "edit" default roles.
    rbac.authorization.k8s.io/aggregate-to-admin: "true"
    rbac.authorization.k8s.io/aggregate-to-edit: "true"
rules:
- apiGroups: ["stable.example.com"]
  resources: ["crontabs"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
---
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: aggregate-cron-tabs-view
  labels:
    # Add these permissions to the "view" default role.
    rbac.authorization.k8s.io/aggregate-to-view: "true"
rules:
- apiGroups: ["stable.example.com"]
  resources: ["crontabs"]
  verbs: ["get", "list", "watch"]
```

#### Role examples

Les exemples suivants sont des extraits d'objets Role ou ClusterRole,
montrant uniquement la section `rules`.

Autoriser la lecture des ressources `"pods"` dans l'
{{< glossary_tooltip text="API Group" term_id="api-group" >}} central :

```yaml
rules:
- apiGroups: [""]
  #
  # at the HTTP level, the name of the resource for accessing Pod
  # objects is "pods"
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
```

Autoriser la lecture/écriture des Déploiements (au niveau HTTP : objets avec `"deployments"`
dans la partie ressource de leur URL) dans les groupes API `"apps"` :

```yaml
rules:
- apiGroups: ["apps"]
  #
  # at the HTTP level, the name of the resource for accessing Deployment
  # objects is "deployments"
  resources: ["deployments"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
```

Autorise la lecture des Pods dans le groupe d'API central, ainsi que de lire ou d'écrire 
des ressources Job dans le groupe d'API `"batch"` :

```yaml
rules:
- apiGroups: [""]
  #
  # at the HTTP level, the name of the resource for accessing Pod
  # objects is "pods"
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["batch"]
  #
  # at the HTTP level, the name of the resource for accessing Job
  # objects is "jobs"
  resources: ["jobs"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
```

Autoriser la lecture d'un ConfigMap nommé "my-config" 
(doit être lié avec un RoleBinding pour limiter à un seul ConfigMap dans un seul namespace).

```yaml
rules:
- apiGroups: [""]
  #
  # at the HTTP level, the name of the resource for accessing ConfigMap
  # objects is "configmaps"
  resources: ["configmaps"]
  resourceNames: ["my-config"]
  verbs: ["get"]
```

Autoriser la lecture des ressources `"nodes"`dans le groupe central (parce 
qu'un Nœud est à l'échelle-du-cluster, il doit être dans un ClusterRole
lié à un ClusterRoleBinding pour être effectif) :

```yaml
rules:
- apiGroups: [""]
  #
  # at the HTTP level, the name of the resource for accessing Node
  # objects is "nodes"
  resources: ["nodes"]
  verbs: ["get", "list", "watch"]
```

Autorise les requêtes GET et POST vers l'endpoint non ressource `/healthz` et
tous les sous-chemins (doit être dans un ClusterRole lié à un ClusterRoleBinding
pour être effectif) :

```yaml
rules:
- nonResourceURLs: ["/healthz", "/healthz/*"] # '*' in a nonResourceURL is a suffix glob match
  verbs: ["get", "post"]
```

### Référence à des subjects

Un RoleBinding ou ClusterRoleBinding lie un rôle à des sujets.
Les sujets peuvent être des groupes, des utilisateurs ou des
{{< glossary_tooltip text="ServiceAccounts" term_id="service-account" >}}.

Kubernetes représente les noms d'utilisateurs sous forme de chaînes de caractères.
Il peut s'agir: de noms simples, tels que "alice"; de noms de style e-mail, tels que "bob@example.com";
ou des IDs d'utilisateur numériques représentés sous forme de chaîne de caractères. Il vous appartient, en tant qu'administrateur de cluster,
de configurer les [modules d'authentification](/docs/reference/access-authn-authz/authentication/)
afin que l'authentification produise des noms d'utilisateur dans le format que vous souhaitez.

{{< caution >}}
Le préfixe `system:` est réservé à l'utilisation du système Kubernetes, vous devez donc vous assurer
que vous n'avez pas d'utilisateurs ou de groupes dont le nom commence par `system:`
par accident.
En dehors de ce préfixe spécial, le système d'autorisation RBAC ne requiert aucun format pour les
noms d'utilisateurs.
{{< /caution >}}

Dans Kubernetes, les modules Authenticator fournissent des informations sur les groupes. 
Les groupes, comme les utilisateurs, sont représentés sous forme de chaînes de caractères et cette chaîne n'a aucune exigence de format,
si ce n'est que le préfixe `system:` est réservé.

Les [ServiceAccounts](/docs/tasks/configure-pod-container/configure-service-account/) ont des noms préfixés par
`system:serviceaccount:`, et appartiennent à des groupes qui ont des noms préfixés par `system:serviceaccounts:`.

{{< note >}}
- `system:serviceaccount:` (singulier) est le préfixe pour les noms d'utilisateur des comptes de service.
- `system:serviceaccounts:` (pluriel) est le préfixe pour les groupes de comptes de service.
{{< /note >}}

#### Exemples de RoleBinding {#role-binding-examples}

Les exemples suivants sont des extraits de `RoleBinding` 
qui ne montrent que la section des `subjects`.

Pour un utilisateur nommé `alice@example.com` :

```yaml
subjects:
- kind: User
  name: "alice@example.com"
  apiGroup: rbac.authorization.k8s.io
```

Pour un groupe nommé `frontend-admins`:

```yaml
subjects:
- kind: Group
  name: "frontend-admins"
  apiGroup: rbac.authorization.k8s.io
```

Pour le compte de service par défaut dans le namespace "kube-system" :

```yaml
subjects:
- kind: ServiceAccount
  name: default
  namespace: kube-system
```

Pour tous les comptes de service dans le namespace "qa" :

```yaml
subjects:
- kind: Group
  name: system:serviceaccounts:qa
  apiGroup: rbac.authorization.k8s.io
```

Pour tous les comptes de service dans n'importe quel namespace :

```yaml
subjects:
- kind: Group
  name: system:serviceaccounts
  apiGroup: rbac.authorization.k8s.io
```

Pour tous les utilisateurs authentifiés :

```yaml
subjects:
- kind: Group
  name: system:authenticated
  apiGroup: rbac.authorization.k8s.io
```

Pour tous les utilisateurs non authentifiés :

```yaml
subjects:
- kind: Group
  name: system:unauthenticated
  apiGroup: rbac.authorization.k8s.io
```

Pour tous les utilisateurs :

```yaml
subjects:
- kind: Group
  name: system:authenticated
  apiGroup: rbac.authorization.k8s.io
- kind: Group
  name: system:unauthenticated
  apiGroup: rbac.authorization.k8s.io
```

## Rôles par défaut et liaisons de rôles

Les serveurs API créent un ensemble d'objets ClusterRole et ClusterRoleBinding par défaut.
Beaucoup d'entre eux sont préfixés `system:`, ce qui indique que la ressource est directement
gérée par le plan de contrôle du cluster.
Tous les ClusterRoles et ClusterRoleBindings par défaut sont étiquetés avec `kubernetes.io/bootstrapping=rbac-defaults`.

{{< caution >}}
Faites attention lorsque vous modifiez les ClusterRoles et les ClusterRoleBindings
dont les noms ont un préfixe `system:`.
Les modifications apportées à ces ressources peuvent entraîner des clusters non fonctionnels.
{{< /caution >}}

### Auto-reconciliation

À chaque démarrage, le serveur API met à jour les rôles de cluster par défaut avec toutes les permissions manquantes,
et met à jour les liaisons de rôles de cluster par défaut avec tous les sujets manquants.
Cela permet au cluster de réparer les modifications accidentelles, et aide à maintenir les rôles et les liaisons de rôles
à jour lorsque les autorisations et les sujets changent dans les nouvelles versions de Kubernetes.

Pour ne pas participer à cette reconciliation, définissez l'annotation `rbac.authorization.kubernetes.io/autoupdate`
sur un rôle ou un rolebinding de cluster par défaut sur `false`.
Sachez que les autorisations et les sujets par défaut manquants peuvent entraîner des clusters non fonctionnels.

L'auto-réconciliation est activée par défaut si l'autorisateur RBAC est actif.


### Rôles de détection de l'API {#discovery-roles}

Les liaisons de rôles par défaut autorisent les utilisateurs authentifiés et non authentifiés à lire les informations de l'API qui sont jugées sûres pour être accessibles au public (y compris les CustomResourceDefinitions). Pour désactiver l'accès anonyme non authentifié, ajoutez `--anonymous-auth=false` à la configuration du serveur d'API.

Pour afficher la configuration de ces rôles via `kubectl`, exécutez :


```shell
kubectl get clusterroles system:discovery -o yaml
```

{{< note >}}
Si vous modifiez ce ClusterRole, vos modifications seront écrasées au redémarrage du serveur API
via l'[auto-reconciliation](#auto-reconciliation). Pour éviter cet écrasement,
ne modifiez pas manuellement le rôle ou désactivez l'auto-reconciliation.
{{< /note >}}

<table>
<caption>Rôles de détection de l'API RBAC de Kubernetes</caption>
<colgroup><col style="width: 25%;" /><col style="width: 25%;" /><col /></colgroup>
<thead>
<tr>
<th>ClusterRole par défaut</th>
<th>ClusterRoleBinding par défaut</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>system:basic-user</b></td>
<td>Groupe <b>system:authenticated</b></td>
<td>Permet à un utilisateur d'accéder en lecture seule aux informations de base le concernant. Avant la v1.14, ce rôle était également lié à <tt>system:unauthenticated</tt> par défaut.</td>
</tr>
<tr>
<td><b>system:discovery</b></td>
<td>Groupe <b>system:authenticated</b></td>
<td>Permet un accès en lecture seule aux points de terminaison de découverte d'API nécessaires pour découvrir et négocier un niveau d'API. Avant la v1.14, ce rôle était également lié à l'option <tt>system:unauthenticated</tt> par défaut.</td>
</tr>
<tr>
<td><b>system:public-info-viewer</b></td>
<td>Groupes <b>system:authenticated</b> et <b>system:unauthenticated</b></td>
<td>Permet un accès en lecture seule à des informations non sensibles sur le cluster. Introduit dans Kubernetes v1.14.</td>
</tr>
</tbody>
</table>

### Rôle des utilisateurs

Certains des ClusterRoles par défaut ne sont pas précédés du préfixe `system:`. Il s'agit de rôles destinés à l'utilisateur.
Ils incluent les rôles de super-utilisateur (`cluster-admin`), les rôles destinés à être accordés à l'échelle du cluster
à l'aide de ClusterRoleBindings, et les rôles destinés à être accordés dans
des namespaces particuliers à l'aide de RoleBindings (`admin`, `edit`, `view`).

Les ClusterRoles des utilisateurs utilisent l'[agrégation de ClusterRole](#aggregated-clusterroles) pour permettre aux administrateurs d'inclure
des règles pour les ressources personnalisées sur ces ClusterRoles. Pour ajouter des règles aux rôles `admin`, `edit`, ou `view`, créez
une ClusterRole avec un ou plusieurs des labels suivants :

```yaml
metadata:
  labels:
    rbac.authorization.k8s.io/aggregate-to-admin: "true"
    rbac.authorization.k8s.io/aggregate-to-edit: "true"
    rbac.authorization.k8s.io/aggregate-to-view: "true"
```

<table>
<colgroup><col style="width: 25%;" /><col style="width: 25%;" /><col /></colgroup>
<thead>
<tr>
<th>ClusterRole par défaut</th>
<th>ClusterRoleBinding par défaut</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>cluster-admin</b></td>
<td>Groupe <b>system:masters</b></td>
<td>Permet au super-utilisateur d'effectuer n'importe quelle action sur n'importe quelle ressource.
Lorsqu'il est utilisé dans un <b>ClusterRoleBinding</b>, il donne un contrôle total sur chaque ressource dans le cluster et dans tous les namespaces.
Lorsqu'il est utilisé dans un <b>RoleBinding</b>, il donne un contrôle total sur chaque ressource dans le namespace du role binding, y compris le namespace lui-même.</td>
</tr>
<tr>
<td><b>admin</b></td>
<td>Aucun</td>
<td>Permet l'accès administrateur, destiné à être accordé au sein d'un espace de nom en utilisant un <b>RoleBinding</b>.

S'il est utilisé dans un <b>RoleBinding</b>, il permet un accès en lecture/écriture à la plupart des ressources d'un namespace,
y compris la possibilité de créer des rôles et des liaisons de rôles dans le namespace.
Ce rôle ne permet pas l'accès en écriture au quota de ressources ou au namespace lui-même.
Ce rôle ne permet pas non plus l'accès en écriture aux EndpointSlices (ou Endpoints) dans les clusters créés
à l'aide de Kubernetes v1.22+. Plus d'informations sont disponibles dans la 
[section "Accès en écriture pour les EndpointSlices et les Endpoints"](#write-access-for-endpoints).</td>
</tr>
<tr>
<td><b>edit</b></td>
<td>Aucun</td>
<td>Permet l'accès en lecture/écriture à la plupart des objets d'un namespace.

Ce rôle ne permet pas de visualiser ou de modifier les rôles ou les liaisons de rôles.
Cependant, ce rôle permet d'accéder aux Secrets et d'exécuter des Pods comme n'importe quel ServiceAccount
du namespace, il peut donc être utilisé pour obtenir les niveaux d'accès API de n'importe quel ServiceAccount
du namespace. Ce rôle ne permet pas non plus d'accéder en écriture aux EndpointSlices (ou Endpoints) dans
les clusters créés à l'aide de Kubernetes v1.22+. Plus d'informations sont disponibles dans la
[section "Write Access for EndpointSlices and Endpoints"](#write-access-for-endpoints).</td>
</tr>
<tr>
<td><b>view</b></td>
<td>Aucun</td>
<td>Permet un accès en lecture seule pour voir la plupart des objets d'un namespace.
Il ne permet pas de visualiser les rôles ou les liens entre les rôles.
Ce rôle ne permet pas de visualiser les Secrets, car la lecture du contenu
des Secrets permet d'accéder aux informations d'identification du ServiceAccount dans le namespace,
ce qui permettrait d'accéder à l'API en tant que tout ServiceAccount dans l'espace de noms (une forme d'escalade des privilèges).

Ce rôle ne permet pas de consulter les secrets, car la lecture
du contenu des secrets permet d'accéder aux informations d'identification du ServiceAccount dans le namespace,
ce qui permettrait d'accéder à l'API en tant que n'importe quel ServiceAccount 
dans le namespace (une forme d'escalade des privilèges).</td>
</tr>
</tbody>
</table>

### Rôles des composants de base

<table>
<colgroup><col style="width: 25%;" /><col style="width: 25%;" /><col /></colgroup>
<thead>
<tr>
<th>ClusterRole par défaut</th>
<th>ClusterRoleBinding par défaut</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>system:kube-scheduler</b></td>
<td>Utilisateur <b>system:kube-scheduler</b></td>
<td>Permet l'accès aux ressources requises par le composant {{< glossary_tooltip term_id="kube-scheduler" text="scheduler" >}}.</td>
</tr>
<tr>
<td><b>system:volume-scheduler</b></td>
<td>Utilisateur <b>system:kube-scheduler</b></td>
<td>Permet l'accès aux ressources de volume requises par le composant kube-scheduler.</td>
</tr>
<tr>
<td><b>system:kube-controller-manager</b></td>
<td>utilisateur <b>system:kube-controller-manager</b></td>
<td>Permet l'accès aux ressources requises par le composant {{< glossary_tooltip term_id="kube-controller-manager" text="gestionnaire de contrôleur" >}}.
Les autorisations requises par les contrôleurs individuels sont détaillées dans les <a href="#controller-roles">rôles des contrôleurs</a>.</td>
</tr>
<tr>
<td><b>system:node</b></td>
<td>Aucun</td>
<td>Permet l'accès aux ressources requises par le kubelet, <b>y compris l'accès en lecture à tous les secrets, et l'accès en écriture à tous les objets d'état des pods</b>.

Vous devriez utiliser le  <a href="/docs/reference/access-authn-authz/node/">Node authorizer</a> et le <a href="/docs/reference/access-authn-authz/admission-controllers/#noderestriction">plugin d'admission NodeRestriction</a> au lieu du rôle <tt>system:node</tt>, et autoriser l'octroi d'un accès API aux kubelets en fonction des Pods programmés pour s'exécuter sur eux.

Le rôle <tt>system:node</tt> n'existe que pour la compatibilité avec les clusters Kubernetes mis à niveau à partir de versions antérieures à la v1.8.
</td>
</tr>
<tr>
<td><b>system:node-proxier</b></td>
<td>Utilisateur <b>system:kube-proxy</b></td>
<td>Permet l'accès aux ressources requises par le composant {{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}}.</td>
</tr>
</tbody>
</table>

### Autres rôles des composants

<table>
<colgroup><col style="width: 25%;" /><col style="width: 25%;" /><col /></colgroup>
<thead>
<tr>
<th>Default ClusterRole</th>
<th>Default ClusterRoleBinding</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>system:auth-delegator</b></td>
<td>Aucun</td>
<td>Permet de déléguer les contrôles d'authentification et d'autorisation.
Il est couramment utilisé par les serveurs API complémentaires pour l'authentification et l'autorisation unifiées.</td>
</tr>
<tr>
<td><b>system:heapster</b></td>
<td>Aucun</td>
<td>Rôle du composant <a href="https://github.com/kubernetes/heapster">Heapster</a> Heapster (déprécié).</td>
</tr>
<tr>
<td><b>system:kube-aggregator</b></td>
<td>Aucun</td>
<td>Role for the <a href="https://github.com/kubernetes/kube-aggregator">kube-aggregator</a> component.</td>
</tr>
<tr>
<td><b>system:kube-dns</b></td>
<td><b>kube-dns</b> compte de service <b>kube-dns</b> dans le namespace du <b>kube-system</b></td>
<td>Rôle du composant <a href="/docs/concepts/services-networking/dns-pod-service/">kube-dns</a> .</td>
</tr>
<tr>
<td><b>system:kubelet-api-admin</b></td>
<td>Aucun</td>
<td>Permet un accès complet à l'API kubelet.</td>
</tr>
<tr>
<td><b>system:node-bootstrapper</b></td>
<td>Aucun</td>
<td>Permet d'accéder aux ressources nécessaires pour effectuer un
<a href="/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/">kubelet TLS bootstrapping</a>.</td>
</tr>
<tr>
<td><b>system:node-problem-detector</b></td>
<td>Aucun</td>
<td>Rôle du component <a href="https://github.com/kubernetes/node-problem-detector">node-problem-detector</a> .</td>
</tr>
<tr>
<td><b>system:persistent-volume-provisioner</b></td>
<td>Aucun</td>
<td>Permet d'accéder aux ressources requises par la plupart des <a href="/docs/concepts/storage/persistent-volumes/#dynamic">fournisseurs de volumes dynamiques</a> .</td>
</tr>
<tr>
<td><b>system:monitoring</b></td>
<td>Groupe <b>system:monitoring</b></td>
<td>Autorise l'accès en lecture aux endpoints de monitoring du control-plane (c'est-à-dire les endpoints {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}} liveness and readiness (<tt>/healthz</tt>, <tt>/livez</tt>, <tt>/readyz</tt>), les endpoints de contrôle de l'état individuel (<tt>/healthz/*</tt>, <tt>/livez/*</tt>, <tt>/readyz/*</tt>), et <tt>/metrics</tt>). Il convient de noter que les endpoints des contrôles de l'état individuel et les endpoints des mesures peuvent exposer des informations sensibles. </td>
</tr>
</tbody>
</table>

### Rôles des contrôleurs intégrés {#controller-roles}

Le {{< glossary_tooltip term_id="kube-controller-manager" text="gestionnaire de contrôleurs" >}} Kubernetes exécute
les {{< glossary_tooltip term_id="controller" text="contrôleurs" >}} qui sont intégrés au plan de contrôle Kubernetes.
Lorsqu'il est invoqué `--use-service-account-credentials`, kube-controller-manager démarre chaque contrôleur
en utilisant un compte de service distinct.
Des rôles correspondants existent pour chaque contrôleur intégré, préfixés par `system:controller:`.
Si le gestionnaire de contrôleur n'est pas démarré avec `--use-service-account-credentials`, il exécute toutes les boucles de contrôle
en utilisant ses propres informations d'identification, qui doivent se voir attribuer tous les rôles pertinents.
Ces rôles sont les suivants :

* `system:controller:attachdetach-controller`
* `system:controller:certificate-controller`
* `system:controller:clusterrole-aggregation-controller`
* `system:controller:cronjob-controller`
* `system:controller:daemon-set-controller`
* `system:controller:deployment-controller`
* `system:controller:disruption-controller`
* `system:controller:endpoint-controller`
* `system:controller:expand-controller`
* `system:controller:generic-garbage-collector`
* `system:controller:horizontal-pod-autoscaler`
* `system:controller:job-controller`
* `system:controller:namespace-controller`
* `system:controller:node-controller`
* `system:controller:persistent-volume-binder`
* `system:controller:pod-garbage-collector`
* `system:controller:pv-protection-controller`
* `system:controller:pvc-protection-controller`
* `system:controller:replicaset-controller`
* `system:controller:replication-controller`
* `system:controller:resourcequota-controller`
* `system:controller:root-ca-cert-publisher`
* `system:controller:route-controller`
* `system:controller:service-account-controller`
* `system:controller:service-controller`
* `system:controller:statefulset-controller`
* `system:controller:ttl-controller`

## Prévention de l'escalade des privilèges et bootstrapping

L'API RBAC empêche les utilisateurs d'escalader les privilèges en modifiant les rôles ou les liaisons de rôles.
Cette interdiction étant appliquée au niveau de l'API, elle s'applique même lorsque l'autorisateur RBAC n'est pas utilisé.

### Restrictions à la création ou à la mise à jour des rôles

Vous ne pouvez créer/mettre à jour un rôle que si au moins l'une des choses suivantes est vraie :

1. Vous disposez déjà de toutes les autorisations contenues dans le rôle, à la même échelle que l'objet en cours de modification
(à l'échelle du cluster pour un ClusterRole, dans le même namespace ou à l'échelle du cluster pour un Role).
2. Vous avez l'autorisation explicite d'exécuter le verbe `escalader` sur la ressource `roles` ou `clusterroles` dans le groupe API `rbac.authorization.k8s.io`.

Par exemple, si l'`user-1` n'a pas la possibilité de lister les Secrets à l'échelle du cluster, il ne peut pas créer un ClusterRole
contenant cette permission. Pour permettre à un utilisateur de créer/mettre à jour des rôles :

1. Attribuez-leur un rôle qui leur permet de créer/mettre à jour des objets Role ou ClusterRole, selon leurs besoins.
2. Leur accorder la permission d'inclure des autorisations spécifiques dans les rôles qu'ils créent/mettent à jour :
   * implicitement, en leur accordant ces autorisations (s'ils tentent de créer ou de modifier un Role ou un ClusterRole avec des autorisations qui ne leur ont pas été accordées, la demande d'API sera interdite)
   * ou explicitement, en leur donnant la permission de spécifier n'importe quelle permission dans un `Role` ou un `ClusterRole`, en leur donnant la permission d'exécuter le verbe `escalader` sur les `roles` ou les ressources `clusterroles` dans le groupe API `rbac.authorization.k8s.io`.

### Restrictions à la création ou à la mise à jour de l'attribution de rôles

Vous ne pouvez créer/mettre à jour un lien de rôle que si vous disposez déjà de toutes les autorisations contenues dans le rôle référencé
(à la même portée que le lien de rôle) *ou* si vous avez été autorisé à exécuter le verbe `bind` sur le rôle référencé.
Par exemple, si l'`user-1` n'a pas la possibilité de lister les Secrets à l'échelle du cluster, il ne peut pas créer un ClusterRoleBinding
pour un rôle qui accorde cette permission. Pour permettre à un utilisateur de créer/mettre à jour des liaisons de rôle :

1. Accordez-leur un rôle qui leur permet de créer/mettre à jour des objets RoleBinding ou ClusterRoleBinding, selon leurs besoins.
2. Leur accorder les autorisations nécessaires pour lier un rôle particulier :
   implicitement, en leur donnant les permissions contenues dans le rôle.
   explicitement, en leur donnant la permission d'exécuter le verbe `bind` sur le rôle particulier (ou ClusterRole).

Par exemple, ce ClusterRole et ce RoleBinding permettraient à `user-1` d'accorder à d'autres utilisateurs les rôles `admin`, `edit` et `view` dans l'espace de noms `user-1-namespace` :

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: role-grantor
rules:
- apiGroups: ["rbac.authorization.k8s.io"]
  resources: ["rolebindings"]
  verbs: ["create"]
- apiGroups: ["rbac.authorization.k8s.io"]
  resources: ["clusterroles"]
  verbs: ["bind"]
  # omit resourceNames to allow binding any ClusterRole
  resourceNames: ["admin","edit","view"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: role-grantor-binding
  namespace: user-1-namespace
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: role-grantor
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: User
  name: user-1
```

Lors du démarrage des premiers rôles et des premières liaisons de rôles, il est nécessaire d'accorder à l'utilisateur initial des autorisations qu'il n'a pas encore.
Pour amorcer les premiers rôles et les premières liaisons de rôles :

* Utilisez un identifiant avec le groupe "system:masters", qui est lié au rôle de super-utilisateur "cluster-admin" par les liaisons par défaut.

## Utilitaires de ligne de commande

### `kubectl create role`

Crée un objet Rôle définissant les autorisations au sein d'un espace de noms unique. Exemples :

* Créer un rôle nommé "pod-reader" qui permet aux utilisateurs d'effectuer les opérations `get`, `watch` et `list` sur les pods :

    ```shell
    kubectl create role pod-reader --verb=get --verb=list --verb=watch --resource=pods
    ```

* Créer un rôle nommé "pod-reader" avec les resourceNames spécifiés:

    ```shell
    kubectl create role pod-reader --verb=get --resource=pods --resource-name=readablepod --resource-name=anotherpod
    ```

* Créer un rôle nommé "foo" avec les apiGroups spécifiés:

    ```shell
    kubectl create role foo --verb=get,list,watch --resource=replicasets.apps
    ```

* Créer un rôle nommé "foo" avec des permissions de sous-ressources:

    ```shell
    kubectl create role foo --verb=get,list,watch --resource=pods,pods/status
    ```

* Créer un rôle nommé "my-component-lease-holder" avec des permissions pour obtenir/mettre à jour une ressource avec un nom spécifique:

    ```shell
    kubectl create role my-component-lease-holder --verb=get,list,watch,update --resource=lease --resource-name=my-component
    ```

### `kubectl create clusterrole`

Crée un ClusterRole. Exemples:

* Créer un ClusterRole nommé "pod-reader" qui permet à l'utilisateur d'effectuer les opérations `get`, `watch` et `list` sur les pods :

    ```shell
    kubectl create clusterrole pod-reader --verb=get,list,watch --resource=pods
    ```

* Créer un ClusterRole nommé "pod-reader" avec les resourceNames spécifiés :

    ```shell
    kubectl create clusterrole pod-reader --verb=get --resource=pods --resource-name=readablepod --resource-name=anotherpod
    ```

* Créer un ClusterRole nommé "foo" avec les apiGroups spécifiés:

    ```shell
    kubectl create clusterrole foo --verb=get,list,watch --resource=replicasets.apps
    ```

* Créer un ClusterRole nommé "foo" avec des permissions de sous-ressources :

    ```shell
    kubectl create clusterrole foo --verb=get,list,watch --resource=pods,pods/status
    ```

* Créer un ClusterRole nommé "foo" avec un nonResourceURL spécifié:

    ```shell
    kubectl create clusterrole "foo" --verb=get --non-resource-url=/logs/*
    ```

* Créer un ClusterRole nommé "monitoring" avec une aggregationRule spécifiée:

    ```shell
    kubectl create clusterrole monitoring --aggregation-rule="rbac.example.com/aggregate-to-monitoring=true"
    ```

### `kubectl create rolebinding`

Attribue un rôle ou un ClusterRole dans un espace de noms spécifique. Exemples:

* Dans le namespace "acme", accordez les permissions du rôle de cluster "admin" à un utilisateur nommé "bob":

    ```shell
    kubectl create rolebinding bob-admin-binding --clusterrole=admin --user=bob --namespace=acme
    ```

* Dans le namespace "acme", accorder les permissions du CLusterRole "view" au compte de service du namespace "acme" nommé "myapp" :

    ```shell
    kubectl create rolebinding myapp-view-binding --clusterrole=view --serviceaccount=acme:myapp --namespace=acme
    ```

* Dans le namespace "acme", accorder les permissions du ClusterRole "view" à un compte de service de le namespace "myappnamespace" nommé "myapp" :

    ```shell
    kubectl create rolebinding myappnamespace-myapp-view-binding --clusterrole=view --serviceaccount=myappnamespace:myapp --namespace=acme
    ```

### `kubectl create clusterrolebinding`

Attribue un ClusterRole à l'ensemble du cluster (tous les espaces de noms). Exemples:

* Sur l'ensemble du cluster, accordez les permissions du ClusterRole "cluster-admin" à un utilisateur nommé "root":

    ```shell
    kubectl create clusterrolebinding root-cluster-admin-binding --clusterrole=cluster-admin --user=root
    ```

* Sur l'ensemble du cluster, accorder les permissions du ClusterRole "system:node-proxier" à un utilisateur nommé "system:kube-proxy":

    ```shell
    kubectl create clusterrolebinding kube-proxy-binding --clusterrole=system:node-proxier --user=system:kube-proxy
    ```

* Sur l'ensemble du cluster, accorder les permissions du ClusterRole "view" à un compte de service nommé "myapp" dans l'espace de noms "acme":

    ```shell
    kubectl create clusterrolebinding myapp-view-binding --clusterrole=view --serviceaccount=acme:myapp
    ```

### `kubectl auth reconcile` {#kubectl-auth-reconcile}

Crée ou met à jour les objets de l'API `rbac.authorization.k8s.io/v1` à partir d'un fichier manifeste.

Les objets manquants sont créés et le namespace contenant est créé pour les objets à namespace, si nécessaire.

Les rôles existants sont mis à jour pour inclure les autorisations dans les objets d'entrée,
et supprimer les permissions supplémentaires si `--remove-extra-permissions` est spécifiée.

Les liaisons existantes sont mises à jour pour inclure les sujets dans les objets d'entrée,
et supprimer les sujets supplémentaires si `--remove-extra-subjects` est spécifiée.

Exemples:

* Test d'application d'un fichier manifeste d'objets RBAC, avec affichage des modifications apportées:

    ```
    kubectl auth reconcile -f my-rbac-rules.yaml --dry-run=client
    ```

* Appliquer un fichier manifeste d'objets RBAC, en préservant toutes les autorisations supplémentaires (dans les rôles) et tous les sujets supplémentaires (dans les liaisons):

    ```shell
    kubectl auth reconcile -f my-rbac-rules.yaml
    ```

* Appliquer un fichier manifeste d'objets RBAC, en supprimant toutes les autorisations supplémentaires (dans les rôles) et tous les sujets supplémentaires (dans les liaisons) :

    ```shell
    kubectl auth reconcile -f my-rbac-rules.yaml --remove-extra-subjects --remove-extra-permissions
    ```

## Autorisations du ServiceAccount {#service-account-permissions}

Les règles RBAC par défaut accordent des autorisations aux composants du plan de contrôle, aux nœuds
et aux contrôleurs, mais n'accordent *aucunes permissions* aux comptes de service en dehors du namespace `kube-system`
(au-delà des autorisations de découverte accordées à tous les utilisateurs authentifiés).

Cela vous permet d'attribuer des rôles particuliers à des ServiceAccounts particuliers en fonction des besoins.
Des attributions de rôles plus fines offrent une plus grande sécurité, mais demandent plus d'efforts de gestion.
Des attributions plus larges peuvent donner un accès API inutile (et potentiellement escaladant) aux ServiceAccounts,
mais elles sont plus faciles à administrer.

Dans l'ordre, de la plus sûre à la moins sûre, les approches sont les suivantes:

1. Attribuer un rôle à un compte de service spécifique à une application (meilleure pratique)

    Cela nécessite que l'application spécifie un `serviceAccountName` dans son pod spec,
    et que le compte de service soit créé (via l'API, le manifeste de l'application, `kubectl create serviceaccount`, etc.).

    Par exemple, accorder au compte de service "my-sa" l'autorisation de lecture seule dans "my-namespace":

    ```shell
    kubectl create rolebinding my-sa-view \
      --clusterrole=view \
      --serviceaccount=my-namespace:my-sa \
      --namespace=my-namespace
    ```

2. Attribuer un rôle au compte de service "par défaut" dans un namespace

    Si une application ne spécifie pas de `serviceAccountName`, elle utilise le compte de service "par défaut".

    {{< note >}}
    Les autorisations accordées au compte de service "par défaut" sont disponibles pour tout pod
    dans le namespace qui ne spécifie pas de `serviceAccountName`.
    {{< /note >}}

    Par exemple, accorder au compte de service "default" l'autorisation de lecture seule dans "my-namespace" :

    ```shell
    kubectl create rolebinding default-view \
      --clusterrole=view \
      --serviceaccount=my-namespace:default \
      --namespace=my-namespace
    ```

    De nombreux [modules complémentaires](/docs/concepts/cluster-administration/addons/) s'exécutent sous
    le compte de service "default" dans le namespace du `kube-system`.
    Pour permettre à ces modules complémentaires de fonctionner avec un accès de super-utilisateur, accordez les permissions cluster-admin
    au compte de service "default" dans le namespace `kube-system`.

    {{< caution >}}
    Activer cela signifie que le namespace `kube-system `contient des Secrets
    qui accordent un accès de super-utilisateur à l'API de votre cluster.
    {{< /caution >}}

    ```shell
    kubectl create clusterrolebinding add-on-cluster-admin \
      --clusterrole=cluster-admin \
      --serviceaccount=kube-system:default
    ```
   
3. Attribuer un rôle à tous les comptes de service d'un namespace

    Si vous souhaitez que toutes les applications d'un namespace disposent d'un rôle, quel que soit le compte de service qu'elles utilisent,
    vous pouvez attribuer un rôle au groupe de comptes de service de cet namespace.

    Par exemple, accordez l'autorisation de lecture seule dans "my-namespace" à tous les comptes de service de cet namespace:

    ```shell
    kubectl create rolebinding serviceaccounts-view \
      --clusterrole=view \
      --group=system:serviceaccounts:my-namespace \
      --namespace=my-namespace
    ```

4. Accorder un rôle limité à tous les comptes de service à l'échelle du cluster (déconseillé)

    Si vous ne souhaitez pas gérer les autorisations par namespace, vous pouvez accorder un rôle à l'échelle du cluster à tous les comptes de service.

    Par exemple, accordez l'autorisation de lecture seule dans tous les espaces de noms à tous les comptes de service du cluster :

    ```shell
    kubectl create clusterrolebinding serviceaccounts-view \
      --clusterrole=view \
     --group=system:serviceaccounts
    ```

5. Accorder un accès de super-utilisateur à tous les comptes de service à l'échelle du cluster (fortement déconseillé).

   Si vous ne vous souciez pas du tout des autorisations de partitionnement, vous pouvez accorder un accès de super-utilisateur à tous les comptes de service.

    {{< caution >}}
    Cela permet à n'importe quelle application d'avoir un accès complet à votre cluster, et accorde
    également à n'importe quel utilisateur ayant un accès en lecture à Secrets (ou la possibilité de créer n'importe quel pod)
    un accès complet à votre cluster.
    {{< /caution >}}

    ```shell
    kubectl create clusterrolebinding serviceaccounts-cluster-admin \
      --clusterrole=cluster-admin \
      --group=system:serviceaccounts
    ```

## Accès en écriture pour les EndpointSlices et les Endpoints {#write-access-for-endpoints}

Les clusters Kubernetes créés avant Kubernetes v1.22 incluent un accès en écriture à
EndpointSlices (et Endpoints) dans les rôles agrégés "edit" et "admin".
Pour pallier à la [CVE-2021-25740](https://github.com/kubernetes/kubernetes/issues/103675),
cet accès ne fait pas partie des rôles agrégés dans les clusters que vous créez 
à l'aide de Kubernetes v1.22 ou ultérieur.

Les clusters existants qui ont été mis à niveau vers Kubernetes v1.22 ne seront pas soumis à ce changement.
L'[annonce du CVE](https://github.com/kubernetes/kubernetes/issues/103675)
comprend des recommandations pour restreindre cet accès dans les clusters existants.

Si vous souhaitez que les nouveaux clusters conservent ce niveau d'accès dans les rôles agrégés,
vous pouvez créer le ClusterRole suivant :

{{% codenew file="access/endpoints-aggregated.yaml" %}}

## Mise à niveau à partir d'ABAC

Les clusters qui exécutaient à l'origine d'anciennes versions de Kubernetes utilisaient
souvent des politiques ABAC permissives, notamment en accordant un accès API complet
à tous les comptes de service.

Les règles RBAC par défaut accordent des autorisations étendues aux composants du plan de contrôle, aux nœuds
et aux contrôleurs, mais n'accordent *aucune autorisation* aux comptes de service en dehors du namespace `kube-system`
(au-delà des autorisations de découverte accordées à tous les utilisateurs authentifiés).

Bien que beaucoup plus sûre, cette solution peut perturber les charges de travail existantes qui s'attendent à recevoir automatiquement les autorisations de l'API.
Voici deux approches pour gérer cette transition:

### Autorisateurs parallèles

Exécutez les autorisateurs RBAC et ABAC, et spécifiez un fichier de stratégie qui contient
la [stratégie ABAC existante](/docs/reference/access-authn-authz/abac/#policy-file-format):

```
--authorization-mode=...,RBAC,ABAC --authorization-policy-file=mypolicy.json
```

Pour expliquer en détail la première option de ligne de commande : si les autorisateurs précédents, tels que Node,
refusent une demande, l'autorisateur RBAC tente d'autoriser la demande d'API. Si RBAC
refuse également cette demande d'API, l'Authorizer ABAC est alors exécuté. Cela signifie que toute demande
autorisée par les stratégies RBAC ou ABAC est autorisée.

Lorsque kube-apiserver est exécuté avec un niveau de log de 5 ou plus pour le composant RBAC
(`--vmodule=rbac*=5 `ou `--v=5`), vous pouvez voir les refus RBAC dans le log du serveur API
(préfixé par `RBAC`).
Vous pouvez utiliser ces informations pour déterminer quels rôles doivent être accordés à quels utilisateurs, groupes ou comptes de service.

Une fois que vous avez [accordé des rôles aux comptes de service](#service-account-permissions) et que les charges de travail
fonctionnent sans message de refus RBAC dans les journaux du serveur, vous pouvez supprimer l'ABAC Authorizer.

### Autorisations RBAC permissives

Vous pouvez répliquer une stratégie ABAC permissive à l'aide de liaisons de rôles RBAC.

{{< caution >}}
La politique suivante permet à **TOUS** les comptes de service d'agir en tant qu'administrateurs de cluster.
Toute application s'exécutant dans un conteneur reçoit automatiquement
les informations d'identification du compte de service et peut effectuer n'importe quelle action sur l'API, y compris l'affichage des secrets et la modification des autorisations.
Cette stratégie n'est pas recommandée.

```shell
kubectl create clusterrolebinding permissive-binding \
  --clusterrole=cluster-admin \
  --user=admin \
  --user=kubelet \
  --group=system:serviceaccounts
```
{{< /caution >}}

Après la transition vers l'utilisation de RBAC, vous devez ajuster les contrôles
d'accès pour votre cluster afin de vous assurer qu'ils répondent à vos besoins en matière de sécurité de l'information.
