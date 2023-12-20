---
title: Distribute Credentials Securely Using Secrets
content_type: task
weight: 50
min-kubernetes-server-version: v1.6
---

<!-- overview -->

This page shows how to securely inject sensitive data, such as passwords and
encryption keys, into Pods.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

### Convert your secret data to a base-64 representation

Suppose you want to have two pieces of secret data: a username `my-app` and a password
`39528$vdg7Jb`. First, use a base64 encoding tool to convert your username and password to a base64 representation. Here's an example using the commonly available base64 program:

```shell
echo -n 'my-app' | base64
echo -n '39528$vdg7Jb' | base64
```

The output shows that the base-64 representation of your username is `bXktYXBw`,
and the base-64 representation of your password is `Mzk1MjgkdmRnN0pi`.

{{< caution >}}
Use a local tool trusted by your OS to decrease the security risks of external tools.
{{< /caution >}}

<!-- steps -->

## Create a Secret

Here is a configuration file you can use to create a Secret that holds your
username and password:

{{% code_sample file="pods/inject/secret.yaml" %}}

1. Create the Secret

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/inject/secret.yaml
   ```

1. View information about the Secret:

   ```shell
   kubectl get secret test-secret
   ```

   Output:

   ```
   NAME          TYPE      DATA      AGE
   test-secret   Opaque    2         1m
   ```

1. View more detailed information about the Secret:

   ```shell
   kubectl describe secret test-secret
   ```

   Output:

   ```
   Name:       test-secret
   Namespace:  default
   Labels:     <none>
   Annotations:    <none>

   Type:   Opaque

   Data
   ====
   password:   13 bytes
   username:   7 bytes
   ```

### Create a Secret directly with kubectl

If you want to skip the Base64 encoding step, you can create the
same Secret using the `kubectl create secret` command. For example:

```shell
kubectl create secret generic test-secret --from-literal='username=my-app' --from-literal='password=39528$vdg7Jb'
```

This is more convenient. The detailed approach shown earlier runs
through each step explicitly to demonstrate what is happening.

## Create a Pod that has access to the secret data through a Volume

Here is a configuration file you can use to create a Pod:

{{% code_sample file="pods/inject/secret-pod.yaml" %}}

1. Create the Pod:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/inject/secret-pod.yaml
   ```

1. Verify that your Pod is running:

   ```shell
   kubectl get pod secret-test-pod
   ```

   Output:

   ```
   NAME              READY     STATUS    RESTARTS   AGE
   secret-test-pod   1/1       Running   0          42m
   ```

1. Get a shell into the Container that is running in your Pod:

   ```shell
   kubectl exec -i -t secret-test-pod -- /bin/bash
   ```

1. The secret data is exposed to the Container through a Volume mounted under
   `/etc/secret-volume`.

   In your shell, list the files in the `/etc/secret-volume` directory:

   ```shell
   # Run this in the shell inside the container
   ls /etc/secret-volume
   ```

   The output shows two files, one for each piece of secret data:

   ```
   password username
   ```

1. In your shell, display the contents of the `username` and `password` files:

   ```shell
   # Run this in the shell inside the container
   echo "$( cat /etc/secret-volume/username )"
   echo "$( cat /etc/secret-volume/password )"
   ```

   The output is your username and password:

   ```
   my-app
   39528$vdg7Jb
   ```

Modify your image or command line so that the program looks for files in the
`mountPath` directory. Each key in the Secret `data` map becomes a file name
in this directory.

### Project Secret keys to specific file paths

You can also control the paths within the volume where Secret keys are projected. Use the
`.spec.volumes[].secret.items` field to change the target path of each key:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
      readOnly: true
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      items:
      - key: username
        path: my-group/my-username
```

When you deploy this Pod, the following happens:

- The `username` key from `mysecret` is available to the container at the path
  `/etc/foo/my-group/my-username` instead of at `/etc/foo/username`.
- The `password` key from that Secret object is not projected.

If you list keys explicitly using `.spec.volumes[].secret.items`, consider the
following:

- Only keys specified in `items` are projected.
- To consume all keys from the Secret, all of them must be listed in the
  `items` field.
- All listed keys must exist in the corresponding Secret. Otherwise, the volume
  is not created.

### Set POSIX permissions for Secret keys

You can set the POSIX file access permission bits for a single Secret key.
If you don't specify any permissions, `0644` is used by default.
You can also set a default POSIX file mode for the entire Secret volume, and
you can override per key if needed.

For example, you can specify a default mode like this:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      defaultMode: 0400
```

The Secret is mounted on `/etc/foo`; all the files created by the
secret volume mount have permission `0400`.

{{< note >}}
If you're defining a Pod or a Pod template using JSON, beware that the JSON
specification doesn't support octal literals for numbers because JSON considers
`0400` to be the _decimal_ value `400`. In JSON, use decimal values for the
`defaultMode` instead. If you're writing YAML, you can write the `defaultMode`
in octal.
{{< /note >}}

## Define container environment variables using Secret data

You can consume the data in Secrets as environment variables in your
containers.

If a container already consumes a Secret in an environment variable,
a Secret update will not be seen by the container unless it is
restarted. There are third party solutions for triggering restarts when
secrets change.

### Define a container environment variable with data from a single Secret

- Define an environment variable as a key-value pair in a Secret:

  ```shell
  kubectl create secret generic backend-user --from-literal=backend-username='backend-admin'
  ```

- Assign the `backend-username` value defined in the Secret to the `SECRET_USERNAME` environment variable in the Pod specification.

  {{% code_sample file="pods/inject/pod-single-secret-env-variable.yaml" %}}

- Create the Pod:

  ```shell
  kubectl create -f https://k8s.io/examples/pods/inject/pod-single-secret-env-variable.yaml
  ```

- In your shell, display the content of `SECRET_USERNAME` container environment variable.

  ```shell
  kubectl exec -i -t env-single-secret -- /bin/sh -c 'echo $SECRET_USERNAME'
  ```

  The output is similar to:

  ```
  backend-admin
  ```

### Define container environment variables with data from multiple Secrets

- As with the previous example, create the Secrets first.

  ```shell
  kubectl create secret generic backend-user --from-literal=backend-username='backend-admin'
  kubectl create secret generic db-user --from-literal=db-username='db-admin'
  ```

- Define the environment variables in the Pod specification.

  {{% code_sample file="pods/inject/pod-multiple-secret-env-variable.yaml" %}}

- Create the Pod:

  ```shell
  kubectl create -f https://k8s.io/examples/pods/inject/pod-multiple-secret-env-variable.yaml
  ```

- In your shell, display the container environment variables.

  ```shell
  kubectl exec -i -t envvars-multiple-secrets -- /bin/sh -c 'env | grep _USERNAME'
  ```

  The output is similar to:

  ```
  DB_USERNAME=db-admin
  BACKEND_USERNAME=backend-admin
  ```

## Configure all key-value pairs in a Secret as container environment variables

{{< note >}}
This functionality is available in Kubernetes v1.6 and later.
{{< /note >}}

- Create a Secret containing multiple key-value pairs

  ```shell
  kubectl create secret generic test-secret --from-literal=username='my-app' --from-literal=password='39528$vdg7Jb'
  ```

- Use envFrom to define all of the Secret's data as container environment variables.
  The key from the Secret becomes the environment variable name in the Pod.

  {{% code_sample file="pods/inject/pod-secret-envFrom.yaml" %}}

- Create the Pod:

  ```shell
  kubectl create -f https://k8s.io/examples/pods/inject/pod-secret-envFrom.yaml
  ```

- In your shell, display `username` and `password` container environment variables.

  ```shell
  kubectl exec -i -t envfrom-secret -- /bin/sh -c 'echo "username: $username\npassword: $password\n"'
  ```

  The output is similar to:

  ```
  username: my-app
  password: 39528$vdg7Jb
  ```

## Example: Provide prod/test credentials to Pods using Secrets {#provide-prod-test-creds}

This example illustrates a Pod which consumes a secret containing production credentials and
another Pod which consumes a secret with test environment credentials.

1. Create a secret for prod environment credentials:

   ```shell
   kubectl create secret generic prod-db-secret --from-literal=username=produser --from-literal=password=Y4nys7f11
   ```

   The output is similar to:

   ```
   secret "prod-db-secret" created
   ```

1. Create a secret for test environment credentials.

   ```shell
   kubectl create secret generic test-db-secret --from-literal=username=testuser --from-literal=password=iluvtests
   ```

   The output is similar to:

   ```
   secret "test-db-secret" created
   ```

   {{< note >}}
   Special characters such as `$`, `\`, `*`, `=`, and `!` will be interpreted by your
   [shell](https://en.wikipedia.org/wiki/Shell_(computing)) and require escaping.

   In most shells, the easiest way to escape the password is to surround it with single quotes (`'`).
   For example, if your actual password is `S!B\*d$zDsb=`, you should execute the command as follows:

   ```shell
   kubectl create secret generic dev-db-secret --from-literal=username=devuser --from-literal=password='S!B\*d$zDsb='
   ```

   You do not need to escape special characters in passwords from files (`--from-file`).
   {{< /note >}}

1. Create the Pod manifests:

   ```shell
   cat <<EOF > pod.yaml
   apiVersion: v1
   kind: List
   items:
   - kind: Pod
     apiVersion: v1
     metadata:
       name: prod-db-client-pod
       labels:
         name: prod-db-client
     spec:
       volumes:
       - name: secret-volume
         secret:
           secretName: prod-db-secret
       containers:
       - name: db-client-container
         image: myClientImage
         volumeMounts:
         - name: secret-volume
           readOnly: true
           mountPath: "/etc/secret-volume"
   - kind: Pod
     apiVersion: v1
     metadata:
       name: test-db-client-pod
       labels:
         name: test-db-client
     spec:
       volumes:
       - name: secret-volume
         secret:
           secretName: test-db-secret
       containers:
       - name: db-client-container
         image: myClientImage
         volumeMounts:
         - name: secret-volume
           readOnly: true
           mountPath: "/etc/secret-volume"
   EOF
   ```

   {{< note >}}
   How the specs for the two Pods differ only in one field; this facilitates creating Pods
   with different capabilities from a common Pod template.
   {{< /note >}}

1. Apply all those objects on the API server by running:

   ```shell
   kubectl create -f pod.yaml
   ```

Both containers will have the following files present on their filesystems with the values
for each container's environment:

```
/etc/secret-volume/username
/etc/secret-volume/password
```

You could further simplify the base Pod specification by using two service accounts:

1. `prod-user` with the `prod-db-secret`
1. `test-user` with the `test-db-secret`

The Pod specification is shortened to:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: prod-db-client-pod
  labels:
    name: prod-db-client
spec:
  serviceAccount: prod-db-client
  containers:
  - name: db-client-container
    image: myClientImage
```

### References

- [Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)
- [Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core)
- [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)

## {{% heading "whatsnext" %}}

- Learn more about [Secrets](/docs/concepts/configuration/secret/).
- Learn about [Volumes](/docs/concepts/storage/volumes/).
