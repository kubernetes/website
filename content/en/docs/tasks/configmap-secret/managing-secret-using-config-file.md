---
title: Managing Secrets using Configuration File
content_type: task
weight: 20
description: Creating Secret objects using resource configuration file.
---

<!-- overview -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Create the Secret {#create-the-config-file}

You can define the `Secret` object in a manifest first, in JSON or YAML format,
and then create that object. The
[Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)
resource contains two maps: `data` and `stringData`.
The `data` field is used to store arbitrary data, encoded using base64. The
`stringData` field is provided for convenience, and it allows you to provide
the same data as unencoded strings.
The keys of `data` and `stringData` must consist of alphanumeric characters,
`-`, `_` or `.`.

The following example stores two strings in a Secret using the `data` field.

1. Convert the strings to base64:

   ```shell
   echo -n 'admin' | base64
   echo -n '1f2d1e2e67df' | base64
   ```

   {{< note >}}
   The serialized JSON and YAML values of Secret data are encoded as base64 strings. Newlines are not valid within these strings and must be omitted. When using the `base64` utility on Darwin/macOS, users should avoid using the `-b` option to split long lines. Conversely, Linux users *should* add the option `-w 0` to `base64` commands or the pipeline `base64 | tr -d '\n'` if the `-w` option is not available.
   {{< /note >}}

   The output is similar to:

   ```
   YWRtaW4=
   MWYyZDFlMmU2N2Rm
   ```

1. Create the manifest:

   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: mysecret
   type: Opaque
   data:
     username: YWRtaW4=
     password: MWYyZDFlMmU2N2Rm
   ```

   Note that the name of a Secret object must be a valid
   [DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

1. Create the Secret using [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply):

   ```shell
   kubectl apply -f ./secret.yaml
   ```

   The output is similar to:

   ```
   secret/mysecret created
   ```

To verify that the Secret was created and to decode the Secret data, refer to
[Managing Secrets using kubectl](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#verify-the-secret).

### Specify unencoded data when creating a Secret

For certain scenarios, you may wish to use the `stringData` field instead. This
field allows you to put a non-base64 encoded string directly into the Secret,
and the string will be encoded for you when the Secret is created or updated.

A practical example of this might be where you are deploying an application
that uses a Secret to store a configuration file, and you want to populate
parts of that configuration file during your deployment process.

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

{{< note >}}
The `stringData` field for a Secret does not work well with server-side apply.
{{< /note >}}

When you retrieve the Secret data, the command returns the encoded values,
and not the plaintext values you provided in `stringData`.

For example, if you run the following command:

```shell
kubectl get secret mysecret -o yaml
```

The output is similar to:

```yaml
apiVersion: v1
data:
  config.yaml: YXBpVXJsOiAiaHR0cHM6Ly9teS5hcGkuY29tL2FwaS92MSIKdXNlcm5hbWU6IHt7dXNlcm5hbWV9fQpwYXNzd29yZDoge3twYXNzd29yZH19
kind: Secret
metadata:
  creationTimestamp: 2018-11-15T20:40:59Z
  name: mysecret
  namespace: default
  resourceVersion: "7225"
  uid: c280ad2e-e916-11e8-98f2-025000000001
type: Opaque
```

### Specify both `data` and `stringData`

If you specify a field in both `data` and `stringData`, the value from `stringData` is used.

For example, if you define the following Secret:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  username: YWRtaW4=
stringData:
  username: administrator
```

{{< note >}}
The `stringData` field for a Secret does not work well with server-side apply.
{{< /note >}}

The `Secret` object is created as follows:

```yaml
apiVersion: v1
data:
  username: YWRtaW5pc3RyYXRvcg==
kind: Secret
metadata:
  creationTimestamp: 2018-11-15T20:46:46Z
  name: mysecret
  namespace: default
  resourceVersion: "7579"
  uid: 91460ecb-e917-11e8-98f2-025000000001
type: Opaque
```

`YWRtaW5pc3RyYXRvcg==` decodes to `administrator`.

## Edit a Secret {#edit-secret}

To edit the data in the Secret you created using a manifest, modify the `data`
or `stringData` field in your manifest and apply the file to your
cluster. You can edit an existing `Secret` object unless it is
[immutable](/docs/concepts/configuration/secret/#secret-immutable).

For example, if you want to change the password from the previous example to
`birdsarentreal`, do the following:

1. Encode the new password string:

   ```shell
   echo -n 'birdsarentreal' | base64
   ```

   The output is similar to:

   ```
   YmlyZHNhcmVudHJlYWw=
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

1. Apply the manifest to your cluster:

   ```shell
   kubectl apply -f ./secret.yaml
   ```

   The output is similar to:

   ```
   secret/mysecret configured
   ```

Kubernetes updates the existing `Secret` object. In detail, the `kubectl` tool
notices that there is an existing `Secret` object with the same name. `kubectl`
fetches the existing object, plans changes to it, and submits the changed
`Secret` object to your cluster control plane.

If you specified `kubectl apply --server-side` instead, `kubectl` uses
[Server Side Apply](/docs/reference/using-api/server-side-apply/) instead.

## Clean up

To delete the Secret you have created:

```shell
kubectl delete secret mysecret
```

## {{% heading "whatsnext" %}}

- Read more about the [Secret concept](/docs/concepts/configuration/secret/)
- Learn how to [manage Secrets using kubectl](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- Learn how to [manage Secrets using kustomize](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
