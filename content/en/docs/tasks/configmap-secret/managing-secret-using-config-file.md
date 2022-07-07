---
title: Managing Secrets using Configuration File
content_type: task
weight: 20
description: Creating Secret objects using resource configuration file.
---

<!-- overview -->

This page shows you how to create, edit, and delete Kubernetes
{{<glossary_tooltip text="Secrets" term_id="secret">}} using a file.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Create a Secret {#create-the-config-file}

You can define the `Secret` object in a JSON or YAML file, and then create that object. The
[Secret](/docs/reference/generated/kubernetes-api/{{<param "version">}}/#secret-v1-core)
resource contains two maps: `data` and `stringData`. The `data` field is used
to store arbitrary data, encoded using base64. The `stringData` field
lets you provide the same data as unencoded strings. The keys in `data` and
`stringData` must consist of alphanumeric characters, `-`, `_`, or `.`.

The following example creates a Secret that stores the username `admin` and the
password `VLc5@#tym$HzBn@8`.

1. Encode the data:

   ```shell
   echo -n 'admin' | base64
   echo -n 'VLc5@#tym$HzBn@8' | base64
   ```
   {{<note>}}The `-n` flag ensures that there's no newline character at the end of your
   data. If you're using the `base64` utility on Darwin/macOS, avoid using the
   `-b` option to split long lines. Conversely, if you're on Linux, add the
   `-w 0` option to `base64` commands or the pipeline `base64 | tr -d '\n'` if
   the `-w` option is not available.{{</note>}}

   The output is similar to:

   ```
   YWRtaW4=
   VkxjNUAjdHltJEh6Qm5AOA==
   ```

1. Create the configuration file:

   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: mysecret
   type: Opaque
   data:
     username: YWRtaW4=
     password: VkxjNUAjdHltJEh6Qm5AOA==
   ```

   The name of the `Secret` object must be a valid
   [DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

1. Create the `Secret` object:

   ```shell
   kubectl apply -f ./secret.yaml
   ```
  
   The output is similar to:

   ```
   secret/mysecret created
   ```
    
### Specify unencoded data when creating a Secret

The `stringData` field lets you provide data for the Secret without
base64-encoding the strings. The strings will be encoded for you when the Secret
is created or updated. A practical example of this might be where you are
deploying an application that uses a Secret to store a configuration file, and
you want to populate parts of that configuration file during your deployment
process.

For example, if your application uses the following configuration file:

```yaml
apiUrl: "https://my.api.com/api/v1"
username: "<user>"
password: "<password>"
```

You could store this in a Secret using the following definition:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
stringData:
  config.yaml: |
    apiUrl: "https://my.api.com/api/v1"
    username: <user>
    password: <password>
```

When you retrieve the Secret data, the command returns the encoded values,
and not the plaintext values you provided in `stringData`.

To verify that the Secret was created and to decode the Secret data, refer to
[Managing Secrets using kubectl](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#verify-the-secret).

## Edit a Secret {#edit-secret}

To edit the data in the Secret you created using a configuration
file, modify the `data` or `stringData` field in your original configuration
file and apply the file to your cluster. You can edit an existing `Secret` object
unless it is [immutable](/docs/concepts/configuration/secret/#secret-immutable)

For example, if you want to change the password from the previous example to
`birdsarentreal`, do the following:

1. Encode the new password string:

   ```shell
   echo -n 'birdsarentreal' | base64
   ```

1. Update the `data` field with your new password string:

   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: mysecret
   type: Opaque
   data:
     username: YWRtaW4=
     password: YmlyZHNhcmVudHJlYWw=
   ```

1. Apply the file to your cluster:

   ```shell
   kubectl apply -f ./secret.yaml
   ```

   The output is similar to:

   ```
   secret/mysecret configured
   ```

Kubernetes updates the existing `Secret` object, because you supplied a
configuration file that had updated data with the same object name.

## Delete a Secret {#clean-up}

To delete a Secret, use `kubectl`:

```shell
kubectl delete secret mysecret
```

## {{% heading "whatsnext" %}}

- Read more about the [Secret concept](/docs/concepts/configuration/secret/)
- Learn how to [manage Secrets with the `kubectl` command](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- Learn how to [manage Secrets using kustomize](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)