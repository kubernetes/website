---
title: Managing Secret using Kustomize
content_type: task
weight: 30
description: Creating Secret objects using kustomization.yaml file.
---

<!-- overview -->

Since Kubernetes v1.14, `kubectl` supports
[managing objects using Kustomize](/docs/tasks/manage-kubernetes-objects/kustomization/).
Kustomize provides resource Generators to create Secrets and ConfigMaps. The
Kustomize generators should be specified in a `kustomization.yaml` file inside
a directory. After generating the Secret, you can create the Secret on the API
server with `kubectl apply`.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Create the Kustomization file

You can generate a Secret by defining a `secretGenerator` in a
`kustomization.yaml` file that references other existing files.
For example, the following kustomization file references the
`./username.txt` and the `./password.txt` files:

```yaml
secretGenerator:
- name: db-user-pass
  files:
  - username.txt
  - password.txt
```

You can also define the `secretGenerator` in the `kustomization.yaml`
file by providing some literals.
For example, the following `kustomization.yaml` file contains two literals
for `username` and `password` respectively:

```yaml
secretGenerator:
- name: db-user-pass
  literals:
  - username=admin
  - password=1f2d1e2e67df
```

Note that in both cases, you don't need to base64 encode the values.

## Create the Secret

Apply the directory containing the `kustomization.yaml` to create the Secret.

```shell
kubectl apply -k .
```

The output is similar to:

```
secret/db-user-pass-96mffmfh4k created
```

Note that when a Secret is generated, the Secret name is created by hashing
the Secret data and appending the hash value to the name. This ensures that
a new Secret is generated each time the data is modified.

## Check the Secret created

You can check that the secret was created:

```shell
kubectl get secrets
```

The output is similar to:

```
NAME                             TYPE                                  DATA      AGE
db-user-pass-96mffmfh4k          Opaque                                2         51s
```

You can view a description of the secret:

```shell
kubectl describe secrets/db-user-pass-96mffmfh4k
```

The output is similar to:

```
Name:            db-user-pass-96mffmfh4k
Namespace:       default
Labels:          <none>
Annotations:     <none>

Type:            Opaque

Data
====
password.txt:    12 bytes
username.txt:    5 bytes
```

The commands `kubectl get` and `kubectl describe` avoid showing the contents of a `Secret` by
default. This is to protect the `Secret` from being exposed accidentally to an onlooker,
or from being stored in a terminal log.
To check the actual content of the encoded data, please refer to
[decoding secret](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#decoding-secret).

## Clean Up

To delete the Secret you have just created:

```shell
kubectl delete secret db-user-pass-96mffmfh4k
```

<!-- Optional section; add links to information related to this topic. -->
## {{% heading "whatsnext" %}}

- Read more about the [Secret concept](/docs/concepts/configuration/secret/)
- Learn how to [manage Secret with the `kubectl` command](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- Learn how to [manage Secret using config file](/docs/tasks/configmap-secret/managing-secret-using-config-file/)

