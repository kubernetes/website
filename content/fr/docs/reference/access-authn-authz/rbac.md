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
L'autorisation RBAC utilise le `rbac.authorization.k8s.io`
{{< glossary_tooltip text="API group" term_id="api-group" >}} pour prendre les 
décisions d'autorisation, ce qui vous permet de configurer 
dynamiquement les politiques via l'API Kubernetes.

Pour activer RBAC, démarrez le {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
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
à un cluster au fur et à mesure de votre apprentissage, consultez
[prévention de l'escalade des privilèges et amorçage](#privilege-escalation-prevention-and-bootstrapping)
pour comprendre comment ces restrictions peuvent vous empêcher d'effectuer certaines modifications.
{{< /caution >}}

### Role and ClusterRole

Un _Role_ ou _ClusterRole_ RBAC contient des règles qui représentent un ensemble de permissions.
Les permissions sont purement additives (il n'y a pas de "deny" règles).

A Role always sets permissions within a particular {{< glossary_tooltip text="namespace" term_id="namespace" >}};
when you create a Role, you have to specify the namespace it belongs in.
Un rôle définit toujours les autorisations dans un {{< glossary_tooltip text="namespace" term_id="namespace" >}} particulier;
lorsque vous créez un Role, vous devez spécifier le namespace auquel il appartient.

ClusterRole, by contrast, is a non-namespaced resource. The resources have different names (Role
and ClusterRole) because a Kubernetes object always has to be either namespaced or not namespaced;
it can't be both.
ClusterRole, en revanche, est une ressource sans namespace. Les ressources portent des noms différents (Role
et ClusterRole) parce qu'un objet Kubernetes doit toujours être soit avec un namespace ou soit sans namespace;
Il ne peut pas être les deux.

Les ClusterRoles ont plusieurs usages. Vous pouvez utiliser une ClusterRole pour :

1. définir les autorisations sur les ressources avec un namespace et obtenir l'accès à l'intérieur d'un ou plusieurs namespaces
1. définir les permissions sur les ressources avec un namespace et obtenir l'accès à travers tous les namespaces.
1. définir les permissions sur les ressources à l'échelle du cluster

Si vous souhaitez définir un rôle au sein d'un namespace, utilisez un Role; si vous souhaitez
définir un rôle à l'échelle du cluster, utilisez un ClusterRole.
#### Role example

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

#### ClusterRole example

Une ClusterRole peut être utilisée pour accorder les mêmes permissions qu'un rôle.
Étant donné que les ClusterRoles sont à l'échelle des clusters, vous pouvez également 
les utiliser pour accorder l'accès à :

* des ressources à l'échelle du cluster (comme {{< glossary_tooltip text="nodes" term_id="node" >}})
* des endpoints non liés aux ressources (comme `/healthz`)
* des ressources à namespaces (comme les pods), dans tous les namespaces.

  Par exemple : vous pouvez utiliser un ClusterRole pour autoriser un utilisateur particulier à exécuter
  `kubectl get pods --all-namespaces`

Voici un exemple de ClusterRole qui peut être utilisé pour accorder un accès en lecture à
{{< glossary_tooltip text="secrets" term_id="secret" >}} dans un namespace particulier,
ou dans tous les namespaces (selon la façon dont il est [lié](#rolebinding-and-clusterrolebinding)) :

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
_subresource_, comme les logs d'un Pod. Une requête pour les logs d'un Pod ressemble à ceci :

```http
GET /api/v1/namespaces/{namespace}/pods/{name}/log
```

Dans ce cas, `pods` est le namespaced ressource pour les ressources Pods,
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
Voici un exemple qui limite son sujet seulement à `get` ou `update` une
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
qu'un Node est à l'échelle-du-cluster, il doit être dans un ClusterRole
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
tous les subpaths (doit être dans un ClusterRole lié à un ClusterRoleBinding
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

## Default roles and role bindings

API servers create a set of default ClusterRole and ClusterRoleBinding objects.
Many of these are `system:` prefixed, which indicates that the resource is directly
managed by the cluster control plane.
All of the default ClusterRoles and ClusterRoleBindings are labeled with `kubernetes.io/bootstrapping=rbac-defaults`.

{{< caution >}}
Take care when modifying ClusterRoles and ClusterRoleBindings with names
that have a `system:` prefix.
Modifications to these resources can result in non-functional clusters.
{{< /caution >}}

### Auto-reconciliation

At each start-up, the API server updates default cluster roles with any missing permissions,
and updates default cluster role bindings with any missing subjects.
This allows the cluster to repair accidental modifications, and helps to keep roles and role bindings
up-to-date as permissions and subjects change in new Kubernetes releases.

To opt out of this reconciliation, set the `rbac.authorization.kubernetes.io/autoupdate`
annotation on a default cluster role or rolebinding to `false`.
Be aware that missing default permissions and subjects can result in non-functional clusters.

Auto-reconciliation is enabled by default if the RBAC authorizer is active.

### API discovery roles {#discovery-roles}

Default role bindings authorize unauthenticated and authenticated users to read API information that is deemed safe to be publicly accessible (including CustomResourceDefinitions). To disable anonymous unauthenticated access, add `--anonymous-auth=false` to the API server configuration.

To view the configuration of these roles via `kubectl` run:

```shell
kubectl get clusterroles system:discovery -o yaml
```

{{< note >}}
If you edit that ClusterRole, your changes will be overwritten on API server restart
via [auto-reconciliation](#auto-reconciliation). To avoid that overwriting,
either do not manually edit the role, or disable auto-reconciliation.
{{< /note >}}

<table>
<caption>Kubernetes RBAC API discovery roles</caption>
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
<td><b>system:basic-user</b></td>
<td><b>system:authenticated</b> group</td>
<td>Allows a user read-only access to basic information about themselves. Prior to v1.14, this role was also bound to <tt>system:unauthenticated</tt> by default.</td>
</tr>
<tr>
<td><b>system:discovery</b></td>
<td><b>system:authenticated</b> group</td>
<td>Allows read-only access to API discovery endpoints needed to discover and negotiate an API level. Prior to v1.14, this role was also bound to <tt>system:unauthenticated</tt> by default.</td>
</tr>
<tr>
<td><b>system:public-info-viewer</b></td>
<td><b>system:authenticated</b> and <b>system:unauthenticated</b> groups</td>
<td>Allows read-only access to non-sensitive information about the cluster. Introduced in Kubernetes v1.14.</td>
</tr>
</tbody>
</table>

### User-facing roles

Some of the default ClusterRoles are not `system:` prefixed. These are intended to be user-facing roles.
They include super-user roles (`cluster-admin`), roles intended to be granted cluster-wide
using ClusterRoleBindings, and roles intended to be granted within particular
namespaces using RoleBindings (`admin`, `edit`, `view`).

User-facing ClusterRoles use [ClusterRole aggregation](#aggregated-clusterroles) to allow admins to include
rules for custom resources on these ClusterRoles. To add rules to the `admin`, `edit`, or `view` roles, create
a ClusterRole with one or more of the following labels:

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
<th>Default ClusterRole</th>
<th>Default ClusterRoleBinding</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>cluster-admin</b></td>
<td><b>system:masters</b> group</td>
<td>Allows super-user access to perform any action on any resource.
When used in a <b>ClusterRoleBinding</b>, it gives full control over every resource in the cluster and in all namespaces.
When used in a <b>RoleBinding</b>, it gives full control over every resource in the role binding's namespace, including the namespace itself.</td>
</tr>
<tr>
<td><b>admin</b></td>
<td>None</td>
<td>Allows admin access, intended to be granted within a namespace using a <b>RoleBinding</b>.

If used in a <b>RoleBinding</b>, allows read/write access to most resources in a namespace,
including the ability to create roles and role bindings within the namespace.
This role does not allow write access to resource quota or to the namespace itself.
This role also does not allow write access to EndpointSlices (or Endpoints) in clusters created
using Kubernetes v1.22+. More information is available in the
["Write Access for EndpointSlices and Endpoints" section](#write-access-for-endpoints).</td>
</tr>
<tr>
<td><b>edit</b></td>
<td>None</td>
<td>Allows read/write access to most objects in a namespace.

This role does not allow viewing or modifying roles or role bindings.
However, this role allows accessing Secrets and running Pods as any ServiceAccount in
the namespace, so it can be used to gain the API access levels of any ServiceAccount in
the namespace. This role also does not allow write access to EndpointSlices (or Endpoints) in
clusters created using Kubernetes v1.22+. More information is available in the
["Write Access for EndpointSlices and Endpoints" section](#write-access-for-endpoints).</td>
</tr>
<tr>
<td><b>view</b></td>
<td>None</td>
<td>Allows read-only access to see most objects in a namespace.
It does not allow viewing roles or role bindings.

This role does not allow viewing Secrets, since reading
the contents of Secrets enables access to ServiceAccount credentials
in the namespace, which would allow API access as any ServiceAccount
in the namespace (a form of privilege escalation).</td>
</tr>
</tbody>
</table>

### Core component roles

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
<td><b>system:kube-scheduler</b></td>
<td><b>system:kube-scheduler</b> user</td>
<td>Allows access to the resources required by the {{< glossary_tooltip term_id="kube-scheduler" text="scheduler" >}} component.</td>
</tr>
<tr>
<td><b>system:volume-scheduler</b></td>
<td><b>system:kube-scheduler</b> user</td>
<td>Allows access to the volume resources required by the kube-scheduler component.</td>
</tr>
<tr>
<td><b>system:kube-controller-manager</b></td>
<td><b>system:kube-controller-manager</b> user</td>
<td>Allows access to the resources required by the {{< glossary_tooltip term_id="kube-controller-manager" text="controller manager" >}} component.
The permissions required by individual controllers are detailed in the <a href="#controller-roles">controller roles</a>.</td>
</tr>
<tr>
<td><b>system:node</b></td>
<td>None</td>
<td>Allows access to resources required by the kubelet, <b>including read access to all secrets, and write access to all pod status objects</b>.

You should use the <a href="/docs/reference/access-authn-authz/node/">Node authorizer</a> and <a href="/docs/reference/access-authn-authz/admission-controllers/#noderestriction">NodeRestriction admission plugin</a> instead of the <tt>system:node</tt> role, and allow granting API access to kubelets based on the Pods scheduled to run on them.

The <tt>system:node</tt> role only exists for compatibility with Kubernetes clusters upgraded from versions prior to v1.8.
</td>
</tr>
<tr>
<td><b>system:node-proxier</b></td>
<td><b>system:kube-proxy</b> user</td>
<td>Allows access to the resources required by the {{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}} component.</td>
</tr>
</tbody>
</table>

### Other component roles

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
<td>None</td>
<td>Allows delegated authentication and authorization checks.
This is commonly used by add-on API servers for unified authentication and authorization.</td>
</tr>
<tr>
<td><b>system:heapster</b></td>
<td>None</td>
<td>Role for the <a href="https://github.com/kubernetes/heapster">Heapster</a> component (deprecated).</td>
</tr>
<tr>
<td><b>system:kube-aggregator</b></td>
<td>None</td>
<td>Role for the <a href="https://github.com/kubernetes/kube-aggregator">kube-aggregator</a> component.</td>
</tr>
<tr>
<td><b>system:kube-dns</b></td>
<td><b>kube-dns</b> service account in the <b>kube-system</b> namespace</td>
<td>Role for the <a href="/docs/concepts/services-networking/dns-pod-service/">kube-dns</a> component.</td>
</tr>
<tr>
<td><b>system:kubelet-api-admin</b></td>
<td>None</td>
<td>Allows full access to the kubelet API.</td>
</tr>
<tr>
<td><b>system:node-bootstrapper</b></td>
<td>None</td>
<td>Allows access to the resources required to perform
<a href="/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/">kubelet TLS bootstrapping</a>.</td>
</tr>
<tr>
<td><b>system:node-problem-detector</b></td>
<td>None</td>
<td>Role for the <a href="https://github.com/kubernetes/node-problem-detector">node-problem-detector</a> component.</td>
</tr>
<tr>
<td><b>system:persistent-volume-provisioner</b></td>
<td>None</td>
<td>Allows access to the resources required by most <a href="/docs/concepts/storage/persistent-volumes/#dynamic">dynamic volume provisioners</a>.</td>
</tr>
<tr>
<td><b>system:monitoring</b></td>
<td><b>system:monitoring</b> group</td>
<td>Allows read access to control-plane monitoring endpoints (i.e. {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}} liveness and readiness endpoints (<tt>/healthz</tt>, <tt>/livez</tt>, <tt>/readyz</tt>), the individual health-check endpoints (<tt>/healthz/*</tt>, <tt>/livez/*</tt>, <tt>/readyz/*</tt>),  and <tt>/metrics</tt>). Note that individual health check endpoints and the metric endpoint may expose sensitive information.</td>
</tr>
</tbody>
</table>

### Roles for built-in controllers {#controller-roles}

The Kubernetes {{< glossary_tooltip term_id="kube-controller-manager" text="controller manager" >}} runs
{{< glossary_tooltip term_id="controller" text="controllers" >}} that are built in to the Kubernetes
control plane.
When invoked with `--use-service-account-credentials`, kube-controller-manager starts each controller
using a separate service account.
Corresponding roles exist for each built-in controller, prefixed with `system:controller:`.
If the controller manager is not started with `--use-service-account-credentials`, it runs all control loops
using its own credential, which must be granted all the relevant roles.
These roles include:

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

## Privilege escalation prevention and bootstrapping

The RBAC API prevents users from escalating privileges by editing roles or role bindings.
Because this is enforced at the API level, it applies even when the RBAC authorizer is not in use.

### Restrictions on role creation or update

You can only create/update a role if at least one of the following things is true:

1. You already have all the permissions contained in the role, at the same scope as the object being modified
(cluster-wide for a ClusterRole, within the same namespace or cluster-wide for a Role).
2. You are granted explicit permission to perform the `escalate` verb on the `roles` or `clusterroles` resource in the `rbac.authorization.k8s.io` API group.

For example, if `user-1` does not have the ability to list Secrets cluster-wide, they cannot create a ClusterRole
containing that permission. To allow a user to create/update roles:

1. Grant them a role that allows them to create/update Role or ClusterRole objects, as desired.
2. Grant them permission to include specific permissions in the roles they create/update:
    * implicitly, by giving them those permissions (if they attempt to create or modify a Role or ClusterRole with permissions they themselves have not been granted, the API request will be forbidden)
    * or explicitly allow specifying any permission in a `Role` or `ClusterRole` by giving them permission to perform the `escalate` verb on `roles` or `clusterroles` resources in the `rbac.authorization.k8s.io` API group

### Restrictions on role binding creation or update

You can only create/update a role binding if you already have all the permissions contained in the referenced role
(at the same scope as the role binding) *or* if you have been authorized to perform the `bind` verb on the referenced role.
For example, if `user-1` does not have the ability to list Secrets cluster-wide, they cannot create a ClusterRoleBinding
to a role that grants that permission. To allow a user to create/update role bindings:

1. Grant them a role that allows them to create/update RoleBinding or ClusterRoleBinding objects, as desired.
2. Grant them permissions needed to bind a particular role:
    * implicitly, by giving them the permissions contained in the role.
    * explicitly, by giving them permission to perform the `bind` verb on the particular Role (or ClusterRole).

For example, this ClusterRole and RoleBinding would allow `user-1` to grant other users the `admin`, `edit`, and `view` roles in the namespace `user-1-namespace`:

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

When bootstrapping the first roles and role bindings, it is necessary for the initial user to grant permissions they do not yet have.
To bootstrap initial roles and role bindings:

* Use a credential with the "system:masters" group, which is bound to the "cluster-admin" super-user role by the default bindings.

## Command-line utilities

### `kubectl create role`

Creates a Role object defining permissions within a single namespace. Examples:

* Create a Role named "pod-reader" that allows users to perform `get`, `watch` and `list` on pods:

    ```shell
    kubectl create role pod-reader --verb=get --verb=list --verb=watch --resource=pods
    ```

* Create a Role named "pod-reader" with resourceNames specified:

    ```shell
    kubectl create role pod-reader --verb=get --resource=pods --resource-name=readablepod --resource-name=anotherpod
    ```

* Create a Role named "foo" with apiGroups specified:

    ```shell
    kubectl create role foo --verb=get,list,watch --resource=replicasets.apps
    ```

* Create a Role named "foo" with subresource permissions:

    ```shell
    kubectl create role foo --verb=get,list,watch --resource=pods,pods/status
    ```

* Create a Role named "my-component-lease-holder" with permissions to get/update a resource with a specific name:

    ```shell
    kubectl create role my-component-lease-holder --verb=get,list,watch,update --resource=lease --resource-name=my-component
    ```

### `kubectl create clusterrole`

Creates a ClusterRole. Examples:

* Create a ClusterRole named "pod-reader" that allows user to perform `get`, `watch` and `list` on pods:

    ```shell
    kubectl create clusterrole pod-reader --verb=get,list,watch --resource=pods
    ```

* Create a ClusterRole named "pod-reader" with resourceNames specified:

    ```shell
    kubectl create clusterrole pod-reader --verb=get --resource=pods --resource-name=readablepod --resource-name=anotherpod
    ```

* Create a ClusterRole named "foo" with apiGroups specified:

    ```shell
    kubectl create clusterrole foo --verb=get,list,watch --resource=replicasets.apps
    ```

* Create a ClusterRole named "foo" with subresource permissions:

    ```shell
    kubectl create clusterrole foo --verb=get,list,watch --resource=pods,pods/status
    ```

* Create a ClusterRole named "foo" with nonResourceURL specified:

    ```shell
    kubectl create clusterrole "foo" --verb=get --non-resource-url=/logs/*
    ```

* Create a ClusterRole named "monitoring" with an aggregationRule specified:

    ```shell
    kubectl create clusterrole monitoring --aggregation-rule="rbac.example.com/aggregate-to-monitoring=true"
    ```

### `kubectl create rolebinding`

Grants a Role or ClusterRole within a specific namespace. Examples:

* Within the namespace "acme", grant the permissions in the "admin" ClusterRole to a user named "bob":

    ```shell
    kubectl create rolebinding bob-admin-binding --clusterrole=admin --user=bob --namespace=acme
    ```

* Within the namespace "acme", grant the permissions in the "view" ClusterRole to the service account in the namespace "acme" named "myapp":

    ```shell
    kubectl create rolebinding myapp-view-binding --clusterrole=view --serviceaccount=acme:myapp --namespace=acme
    ```

* Within the namespace "acme", grant the permissions in the "view" ClusterRole to a service account in the namespace "myappnamespace" named "myapp":

    ```shell
    kubectl create rolebinding myappnamespace-myapp-view-binding --clusterrole=view --serviceaccount=myappnamespace:myapp --namespace=acme
    ```

### `kubectl create clusterrolebinding`

Grants a ClusterRole across the entire cluster (all namespaces). Examples:

* Across the entire cluster, grant the permissions in the "cluster-admin" ClusterRole to a user named "root":

    ```shell
    kubectl create clusterrolebinding root-cluster-admin-binding --clusterrole=cluster-admin --user=root
    ```

* Across the entire cluster, grant the permissions in the "system:node-proxier" ClusterRole to a user named "system:kube-proxy":

    ```shell
    kubectl create clusterrolebinding kube-proxy-binding --clusterrole=system:node-proxier --user=system:kube-proxy
    ```

* Across the entire cluster, grant the permissions in the "view" ClusterRole to a service account named "myapp" in the namespace "acme":

    ```shell
    kubectl create clusterrolebinding myapp-view-binding --clusterrole=view --serviceaccount=acme:myapp
    ```

### `kubectl auth reconcile` {#kubectl-auth-reconcile}

Creates or updates `rbac.authorization.k8s.io/v1` API objects from a manifest file.

Missing objects are created, and the containing namespace is created for namespaced objects, if required.

Existing roles are updated to include the permissions in the input objects,
and remove extra permissions if `--remove-extra-permissions` is specified.

Existing bindings are updated to include the subjects in the input objects,
and remove extra subjects if `--remove-extra-subjects` is specified.

Examples:

* Test applying a manifest file of RBAC objects, displaying changes that would be made:

    ```
    kubectl auth reconcile -f my-rbac-rules.yaml --dry-run=client
    ```

* Apply a manifest file of RBAC objects, preserving any extra permissions (in roles) and any extra subjects (in bindings):

    ```shell
    kubectl auth reconcile -f my-rbac-rules.yaml
    ```

* Apply a manifest file of RBAC objects, removing any extra permissions (in roles) and any extra subjects (in bindings):

    ```shell
    kubectl auth reconcile -f my-rbac-rules.yaml --remove-extra-subjects --remove-extra-permissions
    ```

## ServiceAccount permissions {#service-account-permissions}

Default RBAC policies grant scoped permissions to control-plane components, nodes,
and controllers, but grant *no permissions* to service accounts outside the `kube-system` namespace
(beyond discovery permissions given to all authenticated users).

This allows you to grant particular roles to particular ServiceAccounts as needed.
Fine-grained role bindings provide greater security, but require more effort to administrate.
Broader grants can give unnecessary (and potentially escalating) API access to
ServiceAccounts, but are easier to administrate.

In order from most secure to least secure, the approaches are:

1. Grant a role to an application-specific service account (best practice)

    This requires the application to specify a `serviceAccountName` in its pod spec,
    and for the service account to be created (via the API, application manifest, `kubectl create serviceaccount`, etc.).

    For example, grant read-only permission within "my-namespace" to the "my-sa" service account:

    ```shell
    kubectl create rolebinding my-sa-view \
      --clusterrole=view \
      --serviceaccount=my-namespace:my-sa \
      --namespace=my-namespace
    ```

2. Grant a role to the "default" service account in a namespace

    If an application does not specify a `serviceAccountName`, it uses the "default" service account.

    {{< note >}}
    Permissions given to the "default" service account are available to any pod
    in the namespace that does not specify a `serviceAccountName`.
    {{< /note >}}

    For example, grant read-only permission within "my-namespace" to the "default" service account:

    ```shell
    kubectl create rolebinding default-view \
      --clusterrole=view \
      --serviceaccount=my-namespace:default \
      --namespace=my-namespace
    ```

    Many [add-ons](/docs/concepts/cluster-administration/addons/) run as the
    "default" service account in the `kube-system` namespace.
    To allow those add-ons to run with super-user access, grant cluster-admin
    permissions to the "default" service account in the `kube-system` namespace.

    {{< caution >}}
    Enabling this means the `kube-system` namespace contains Secrets
    that grant super-user access to your cluster's API.
    {{< /caution >}}

    ```shell
    kubectl create clusterrolebinding add-on-cluster-admin \
      --clusterrole=cluster-admin \
      --serviceaccount=kube-system:default
    ```

3. Grant a role to all service accounts in a namespace

    If you want all applications in a namespace to have a role, no matter what service account they use,
    you can grant a role to the service account group for that namespace.

    For example, grant read-only permission within "my-namespace" to all service accounts in that namespace:

    ```shell
    kubectl create rolebinding serviceaccounts-view \
      --clusterrole=view \
      --group=system:serviceaccounts:my-namespace \
      --namespace=my-namespace
    ```

4. Grant a limited role to all service accounts cluster-wide (discouraged)

    If you don't want to manage permissions per-namespace, you can grant a cluster-wide role to all service accounts.

    For example, grant read-only permission across all namespaces to all service accounts in the cluster:

    ```shell
    kubectl create clusterrolebinding serviceaccounts-view \
      --clusterrole=view \
     --group=system:serviceaccounts
    ```

5. Grant super-user access to all service accounts cluster-wide (strongly discouraged)

    If you don't care about partitioning permissions at all, you can grant super-user access to all service accounts.

    {{< warning >}}
    This allows any application full access to your cluster, and also grants
    any user with read access to Secrets (or the ability to create any pod)
    full access to your cluster.
    {{< /warning >}}

    ```shell
    kubectl create clusterrolebinding serviceaccounts-cluster-admin \
      --clusterrole=cluster-admin \
      --group=system:serviceaccounts
    ```

## Write access for EndpointSlices and Endpoints {#write-access-for-endpoints}

Kubernetes clusters created before Kubernetes v1.22 include write access to
EndpointSlices (and Endpoints) in the aggregated "edit" and "admin" roles.
As a mitigation for [CVE-2021-25740](https://github.com/kubernetes/kubernetes/issues/103675),
this access is not part of the aggregated roles in clusters that you create using
Kubernetes v1.22 or later.

Existing clusters that have been upgraded to Kubernetes v1.22 will not be
subject to this change. The [CVE
announcement](https://github.com/kubernetes/kubernetes/issues/103675) includes
guidance for restricting this access in existing clusters.

If you want new clusters to retain this level of access in the aggregated roles,
you can create the following ClusterRole:

{{< codenew file="access/endpoints-aggregated.yaml" >}}

## Upgrading from ABAC

Clusters that originally ran older Kubernetes versions often used
permissive ABAC policies, including granting full API access to all
service accounts.

Default RBAC policies grant scoped permissions to control-plane components, nodes,
and controllers, but grant *no permissions* to service accounts outside the `kube-system` namespace
(beyond discovery permissions given to all authenticated users).

While far more secure, this can be disruptive to existing workloads expecting to automatically receive API permissions.
Here are two approaches for managing this transition:

### Parallel authorizers

Run both the RBAC and ABAC authorizers, and specify a policy file that contains
the [legacy ABAC policy](/docs/reference/access-authn-authz/abac/#policy-file-format):

```
--authorization-mode=...,RBAC,ABAC --authorization-policy-file=mypolicy.json
```

To explain that first command line option in detail: if earlier authorizers, such as Node,
deny a request, then the RBAC authorizer attempts to authorize the API request. If RBAC
also denies that API request, the ABAC authorizer is then run. This means that any request
allowed by *either* the RBAC or ABAC policies is allowed.

When the kube-apiserver is run with a log level of 5 or higher for the RBAC component
(`--vmodule=rbac*=5` or `--v=5`), you can see RBAC denials in the API server log
(prefixed with `RBAC`).
You can use that information to determine which roles need to be granted to which users, groups, or service accounts.

Once you have [granted roles to service accounts](#service-account-permissions) and workloads
are running with no RBAC denial messages in the server logs, you can remove the ABAC authorizer.

### Permissive RBAC permissions

You can replicate a permissive ABAC policy using RBAC role bindings.

{{< warning >}}
The following policy allows **ALL** service accounts to act as cluster administrators.
Any application running in a container receives service account credentials automatically,
and could perform any action against the API, including viewing secrets and modifying permissions.
This is not a recommended policy.

```shell
kubectl create clusterrolebinding permissive-binding \
  --clusterrole=cluster-admin \
  --user=admin \
  --user=kubelet \
  --group=system:serviceaccounts
```
{{< /warning >}}

After you have transitioned to use RBAC, you should adjust the access controls
for your cluster to ensure that these meet your information security needs.
