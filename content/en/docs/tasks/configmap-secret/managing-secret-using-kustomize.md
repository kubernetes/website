---
title: Managing Secrets using Kustomize
content_type: task
weight: 30
description: Creating Secret objects using kustomization.yaml file.
---

<!-- overview -->

`kubectl` supports using the [Kustomize object management tool](/docs/tasks/manage-kubernetes-objects/kustomization/) to manage Secrets
and ConfigMaps. You create a *resource generator* using Kustomize, which
generates a Secret that you can apply to the API server using `kubectl`.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Create a Secret {#create-the-kustomization-file}

You can generate a Secret by defining a `secretGenerator` in a
`kustomization.yaml` file that references other existing files, `.env` files, or
literal values. For example, the following instructions create a Kustomization
file for the username `admin` and the password `VLc5@#tym$HzBn@8`.

{{< tabs name="Secret data" >}}
{{< tab name="Literals" codelang="yaml" >}}
secretGenerator:
- name: database-creds
  literals:
  - username=admin
  - password=VLc5@#tym$HzBn@8
{{< /tab >}}
{{% tab name="Files" %}}
1.  Store the credentials in files with the values encoded in base64:

    ```shell
    echo -n 'admin' > ./username.txt
    echo -n 'VLc5@#tym$HzBn@8' > ./password.txt
    ```
    The `-n` flag ensures that there's no newline character at the end of your
    files.

2.  Create the `kustomization.yaml` file:

    ```yaml
    secretGenerator:
    - name: database-creds
      files:
      - username.txt
      - password.txt
    ```
{{% /tab %}}}
{{% tab name=".env files" %}}
If your credentials are already in a `.env` file, such as `.env.secret`:

```yaml
secretGenerator:
- name: db-user-pass
  envs:
  - .env.secret
```
{{% /tab %}}
{{< /tabs >}}

In all cases, you don't need to base64 encode the values. The name of the YAML
file **must** be `kustomization.yaml` or `kustomization.yml`.

1.  To create the Secret, apply the directory that contains the kustomization file:

    ```shell
    kubectl apply -k <directory-path>
    ```

    The output is similar to:

    ```
    secret/database-creds-5hdh7hhgfk created
    ```

    When a Secret is generated, the Secret name is created by hashing
    the Secret data and appending the hash value to the name. This ensures that
    a new Secret is generated each time the data is modified.

To verify that the Secret was created and to decode the Secret data, refer to
[Managing Secrets using
kubectl](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#verify-the-secret).

## Edit a Secret {#edit-secret}

1.  In your `kustomization.yaml` file, modify the data, such as the `password`.
1.  Apply the directory that contains the kustomization file:

    ```shell
    kubectl apply -k <directory-path>
    ```

    The output is similar to:

    ```
    secret/database-creds-6f24b56cc8 created
    ```

The edited Secret is created as a new `Secret` object, instead of updating the
existing `Secret` object. You might need to update references to the Secret in
your Pods.

## Delete a Secret {#clean-up}

To delete a Secret, use `kubectl`:

```shell
kubectl delete secret <secret-name>
```

<!-- Optional section; add links to information related to this topic. -->
## {{% heading "whatsnext" %}}

- Read more about the [Secret concept](/docs/concepts/configuration/secret/)
- Learn how to [manage Secrets with the `kubectl` command](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- Learn how to [manage Secrets using config file](/docs/tasks/configmap-secret/managing-secret-using-config-file/)

