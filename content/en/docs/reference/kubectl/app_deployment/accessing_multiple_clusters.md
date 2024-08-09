---
title: "Accessing Multiple Clusters"
linkTitle: "Accessing Multiple Clusters"
weight: 2
draft: true
type: docs
description: >
   Accessing Multiple Clusters with `--context` and `--kubeconfig` flag.
---

## Motivation

It is common for users to need to deploy **different Variants of an Application to different clusters**.
This can be done by configuring the different Variants using different `kustomization.yaml`'s,
and targeting each variant using the `--context` or `--kubeconfig` flag.

**Note:** The examples shown in this chapter store the Resource Config in a directory
matching the name of the cluster (i.e. as it is referred to be context).


## Targeting a Cluster via Context

The kubeconfig file allows multiple contexts to be specified, each with a different cluster + auth.

### List Contexts

List the contexts in the kubeconfig file

```sh
kubectl config get-contexts
```

```sh
CURRENT   NAME   CLUSTER   AUTHINFO   NAMESPACE
          us-central1-c  us-central1-c  us-central1-c
*         us-east1-c  us-east1-c  us-east1-c
          us-west2-c   us-west2-c   us-west2-c
```

### Print a Context

Print information about the current context

```sh
kubectl config --kubeconfig=config-demo view --minify
```

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority: fake-ca-file
    server: https://1.2.3.4
  name: development
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend
current-context: dev-frontend
kind: Config
preferences: {}
users:
- name: developer
  user:
    client-certificate: fake-cert-file
    client-key: fake-key-file
```

### Specify a Context Flag

Specify the kubeconfig context as part of the command.

**Note:** In this example the `kustomization.yaml` exists in a directory whose name matches
the name of the context.

```sh
export CLUSTER=us-west2-c; kubectl apply -k ${CLUSTER} --context=${CLUSTER}
```

### Switch to use a Context

Switch the current context before running the command.

**Note:** In this example the `kustomization.yaml` exists in a directory whose name matches
the name of the context.

```sh
# change the context to us-west2-c
kubectl config use-context us-west2-c
# deploy Resources from the ./us-west2-c/kustomization.yaml
kubectl apply -k ./us-west2-c
```

## Targeting a Cluster via Kubeconfig

Alternatively, different kubeconfig files may be used for different clusters.  The
kubeconfig may be specified with the `--kubeconfig` flag.

**Note:** In this example the `kustomization.yaml` exists in a directory whose name matches
the name of the directory containing the kubeconfig.

```sh
kubectl apply -k ./us-west2-c --kubeconfig /path/to/us-west2-c/config
```


## {{% heading "seealso" %}}

* [Configure Access to Multiple Clusters](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
for more information on this.
