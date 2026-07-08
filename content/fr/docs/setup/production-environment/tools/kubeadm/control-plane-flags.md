---
reviewers:
- sig-cluster-lifecycle
title: Personnaliser les composants avec l’API kubeadm
content_type: concept
weight: 40
---

<!-- aperçu -->

Cette page explique comment personnaliser les composants déployés par kubeadm. Pour les composants du plan de contrôle (control plane), vous pouvez utiliser des flags dans la structure `ClusterConfiguration` ou des patches par nœud. Pour le kubelet et kube-proxy, vous pouvez utiliser respectivement `KubeletConfiguration` et `KubeProxyConfiguration`.

Toutes ces options sont disponibles via l’API de configuration kubeadm.  
Pour plus de détails sur chaque champ de la configuration, vous pouvez consulter nos pages de [référence API](/docs/reference/config-api/kubeadm-config.v1beta4/).

{{< note >}}
Pour reconfigurer un cluster déjà créé, consultez
[Reconfigurer un cluster kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure).
{{< /note >}}

<!-- body -->

## Personnaliser le plan de contrôle avec des flags dans `ClusterConfiguration`

L’objet `ClusterConfiguration` de kubeadm expose un moyen pour les utilisateurs de remplacer les flags par défaut passés aux composants du plan de contrôle tels que l’APIServer, le ControllerManager, le Scheduler et etcd.

Les composants sont définis à l’aide des structures suivantes :

- `apiServer`
- `controllerManager`
- `scheduler`
- `etcd`

Ces structures contiennent un champ commun `extraArgs`, composé de paires `nom` / `valeur`.

Pour remplacer un flag d’un composant du plan de contrôle :

1. Ajoutez les `extraArgs` appropriés à votre configuration.
2. Ajoutez les flags dans le champ `extraArgs`.
3. Exécutez `kubeadm init` avec `--config <VOTRE FICHIER YAML>`.

{{< note >}}
Vous pouvez générer un objet `ClusterConfiguration` avec des valeurs par défaut en exécutant
`kubeadm config print init-defaults` et en enregistrant la sortie dans un fichier de votre choix.
{{< /note >}}

{{< note >}}
L’objet `ClusterConfiguration` est actuellement global dans les clusters kubeadm. Cela signifie que tous les flags que vous ajoutez s’appliqueront à toutes les instances du même composant sur différents nœuds. Pour appliquer une configuration individuelle par composant sur différents nœuds, vous pouvez utiliser des [patches](#patches).
{{< /note >}}

{{< note >}}
Les flags dupliqués (clés identiques), ou le passage multiple du même flag `--foo`, ne sont actuellement pas pris en charge.  
Pour contourner cela, vous devez utiliser des [patches](#patches).
{{< /note >}}

## Paramètres pour l'API Server

Pour plus de détails, voir la  [documentation de référence pour kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/).

Exemple d'utilisation:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
apiServer:
  extraArgs:
  - name: "enable-admission-plugins"
    value: "AlwaysPullImages,DefaultStorageClass"
  - name: "audit-log-path"
    value: "/home/johndoe/audit.log"
```

## Paramètres pour le ControllerManager

Pour plus de détails, voir la [documentation de référence pour kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/).

Exemple d'utilisation:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
controllerManager:
  extraArgs:
  - name: "cluster-signing-key-file"
    value: "/home/johndoe/keys/ca.key"
  - name: "deployment-controller-sync-period"
    value: "50"
```

## Paramètres pour le Scheduler

Pour plus de détails, voir la [documentation de référence pour kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/).

Example usage:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
scheduler:
  extraArgs:
  - name: "config"
    value: "/etc/kubernetes/scheduler-config.yaml"
  extraVolumes:
    - name: schedulerconfig
      hostPath: /home/johndoe/schedconfig.yaml
      mountPath: /etc/kubernetes/scheduler-config.yaml
      readOnly: true
      pathType: "File"
```

### Flags d’Etcd

Pour plus de détails, consultez la [documentation du serveur etcd](https://etcd.io/docs/).

Exemple d’utilisation :

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
etcd:
  local:
    extraArgs:
    - name: "election-timeout"
      value: 1000
```

## Personnalisation avec des patches {#patches}

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

Kubeadm vous permet de passer un répertoire contenant des fichiers de patchs à `InitConfiguration`,
`JoinConfiguration` et `UpgradeConfiguration`, sur des nœuds individuels. Ces patchs peuvent être utilisés comme dernière étape de personnalisation avant que la configuration des composants ne soit écrite sur le disque.

Vous pouvez transmettre ce fichier à `kubeadm init` avec `--config <VOTRE FICHIER DE CONFIGURATION YAML>` :

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
patches:
  directory: /home/user/somedir
```

{{< note >}}
Pour `kubeadm init`, vous pouvez fournir un fichier contenant à la fois une `ClusterConfiguration` et une `InitConfiguration`
séparées par `---`.
{{< /note >}}

Vous pouvez transmettre ce fichier à `kubeadm join` avec `--config <VOTRE FICHIER DE CONFIGURATION YAML>` :

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
patches:
  directory: /home/user/somedir
```

Si vous utilisez `kubeadm upgrade apply` et `kubeadm upgrade node` pour mettre à niveau vos nœuds kubeadm,
vous devez à nouveau fournir les mêmes patches afin que la personnalisation soit conservée après la mise à niveau.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: UpgradeConfiguration
apply:
  patches:
    directory: /home/user/somedir
```

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: UpgradeConfiguration
node:
  patches:
    directory: /home/user/somedir
```

Le répertoire doit contenir des fichiers nommés `target[suffix][+patchtype].extension`.  
Par exemple : `kube-apiserver0+merge.yaml` ou simplement `etcd.json`.

- `target` peut être l’un des suivants : `kube-apiserver`, `kube-controller-manager`, `kube-scheduler`, `etcd`,
  `kubeletconfiguration` et `corednsdeployment`.
- `suffix` est une chaîne optionnelle qui peut être utilisée pour déterminer l’ordre d’application des patches
  (ordre alphanumérique).
- `patchtype` peut être `strategic`, `merge` ou `json`, et doit correspondre aux formats de patch
  [pris en charge par kubectl](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch).
  Le `patchtype` par défaut est `strategic`.
- `extension` doit être soit `json` soit `yaml`.

## Personnalisation du kubelet {#kubelet}

Pour personnaliser le kubelet, vous pouvez ajouter une [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
à côté de `ClusterConfiguration` ou `InitConfiguration`, séparée par `---` dans le même fichier de configuration.
Ce fichier peut ensuite être passé à `kubeadm init`, et kubeadm appliquera la même `KubeletConfiguration` de base
à tous les nœuds du cluster.

Pour appliquer une configuration spécifique à une instance au-dessus de la configuration de base `KubeletConfiguration`,
vous pouvez utiliser la cible de patch [`kubeletconfiguration`](#patches).

Sinon, vous pouvez utiliser les flags du kubelet comme surcharges en les passant dans le champ
`nodeRegistration.kubeletExtraArgs`, pris en charge par `InitConfiguration` et `JoinConfiguration`.
Certains flags du kubelet sont obsolètes, vérifiez leur statut dans la
[documentation de référence du kubelet](/docs/reference/command-line-tools-reference/kubelet)
avant de les utiliser.

Pour plus de détails, voir [Configurer chaque kubelet du cluster avec kubeadm](/docs/setup/production-environment/tools/kubeadm/kubelet-integration).

## Personnalisation de kube-proxy

Pour personnaliser kube-proxy, vous pouvez passer une `KubeProxyConfiguration` à côté de `ClusterConfiguration`
ou `InitConfiguration` à `kubeadm init`, séparée par `---`.

Pour plus de détails, consultez les [pages de référence de l’API](/docs/reference/config-api/kubeadm-config.v1beta4/).

{{< note >}}
kubeadm déploie kube-proxy sous forme de {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}, ce qui signifie
que la `KubeProxyConfiguration` s’applique à toutes les instances de kube-proxy dans le cluster.
{{< /note >}}

## Personnalisation de CoreDNS

kubeadm permet de personnaliser le Deployment CoreDNS via des patches appliqués à la cible
[`corednsdeployment`](#patches).

Les patches pour d’autres objets API liés à CoreDNS comme le
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} `kube-system/coredns`
ne sont pas encore pris en charge. Vous devez les modifier manuellement avec kubectl et recréer ensuite les
{{< glossary_tooltip text="Pods" term_id="pod" >}} CoreDNS.

Sinon, vous pouvez désactiver le déploiement CoreDNS de kubeadm en ajoutant l’option suivante
dans votre `ClusterConfiguration` :

```yaml
dns:
  disabled: true
```

De plus, en exécutant la commande suivante :

```shell
kubeadm init phase addon coredns --print-manifest --config my-config.yaml
```

vous pouvez obtenir le fichier manifeste que kubeadm créerait pour CoreDNS dans votre configuration.
