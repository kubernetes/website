---
title: Personnalisation de la configuration du control plane avec kubeadm
description: Personnalisation de la configuration du control plane avec kubeadm
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

{{< feature-state for_k8s_version="1.12" state="stable" >}}

L'objet `ClusterConfiguration` de kubeadm expose le champ `extraArgs` qui peut 
remplacer les indicateurs par défaut transmis au control plane à des composants 
tels que l'APIServer, le ControllerManager et le Scheduler. Les composants sont 
définis à l'aide des champs suivants:

- `apiServer`
- `controllerManager`
- `scheduler`

Le champ `extraArgs` se compose de paires` clé: valeur`. Pour remplacer un indicateur 
pour un composant du control plane:

1. Ajoutez les champs appropriés à votre configuration.
2. Ajoutez les indicateurs à remplacer dans le champ.

Pour plus de détails sur chaque champ de la configuration, vous pouvez accéder aux
[pages de référence de l'API](https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm#ClusterConfiguration).

{{% /capture %}}

{{% capture body %}}

## Paramètres pour l'API Server

Pour plus de détails, voir la  [documentation de référence pour kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/).

Exemple d'utilisation:
```yaml
apiVersion: kubeadm.k8s.io/v1beta1
kind: ClusterConfiguration
kubernetesVersion: v1.13.0
metadata:
  name: 1.13-sample
apiServer:
  extraArgs:
    advertise-address: 192.168.0.103
    anonymous-auth: false
    enable-admission-plugins: AlwaysPullImages,DefaultStorageClass
    audit-log-path: /home/johndoe/audit.log
```

## Paramètres pour le ControllerManager

Pour plus de détails, voir la [documentation de référence pour kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/).

Exemple d'utilisation:
```yaml
apiVersion: kubeadm.k8s.io/v1beta1
kind: ClusterConfiguration
kubernetesVersion: v1.13.0
metadata:
  name: 1.13-sample
controllerManager:
  extraArgs:
    cluster-signing-key-file: /home/johndoe/keys/ca.key
    bind-address: 0.0.0.0
    deployment-controller-sync-period: 50
```

## Paramètres pour le Scheduler

Pour plus de détails, voir la [documentation de référence pour kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/).

Example usage:
```yaml
apiVersion: kubeadm.k8s.io/v1beta1
kind: ClusterConfiguration
kubernetesVersion: v1.13.0
metadata:
  name: 1.13-sample
scheduler:
  extraArgs:
    address: 0.0.0.0
    config: /home/johndoe/schedconfig.yaml
    kubeconfig: /home/johndoe/kubeconfig.yaml
```

{{% /capture %}}
