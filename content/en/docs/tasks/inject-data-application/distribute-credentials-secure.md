---
title: Distribute Credentials Securely Using Secrets
content_template: templates/task
---

{{% capture overview %}}
This page shows how to securely inject sensitive data, such as passwords and
encryption keys, using Deployments.
{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

## Convert your secret data to a base-64 representation

Suppose you want to have two pieces of secret data: a username `my-app` and a password
`39528$vdg7Jb`. First, use [Base64 encoding](https://www.base64encode.org/) to
convert your username and password to a base-64 representation. Here's a Linux
example:

    echo -n 'my-app' | base64
    echo -n '39528$vdg7Jb' | base64

The output shows that the base-64 representation of your username is `bXktYXBw`,
and the base-64 representation of your password is `Mzk1MjgkdmRnN0pi`.

## Create a Secret

Here is a configuration file you can use to create a Secret that holds your
username and password:

{{< code file="secret.yaml" >}}

1. Create the Secret

       kubectl create -f https://k8s.io/docs/tasks/inject-data-application/secret.yaml

    {{< note >}}
    **Note:** If you want to skip the Base64 encoding step, you can create a Secret
    by using the `kubectl create secret` command:
    {{< /note >}}

       kubectl create secret generic test-secret --from-literal=username='my-app' --from-literal=password='39528$vdg7Jb'

1. View information about the Secret:

       kubectl get secret test-secret

    Output:

        NAME          TYPE      DATA      AGE
        test-secret   Opaque    2         1m


1. View more detailed information about the Secret:

       kubectl describe secret test-secret

    Output:

        Name:       test-secret
        Namespace:  default
        Labels:     <none>
        Annotations:    <none>

        Type:   Opaque

        Data
        ====
        password:   13 bytes
        username:   7 bytes

## Create a Deployment that has access to the secret data through a Volume

Here is a configuration file you can use to create a Deployment:

{{< code file="secret-deployment.yaml" >}}

1. Create the Deployment:

       kubectl create -f https://k8s.io/docs/tasks/inject-data-application/secret-deployment.yaml

1. Verify that your Deployment is running:

       kubectl get deployment secret-test

    Output:

        NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
        secret-test        2         2         2            2           12s

1. Get a shell into the Container that is running in your Deployment:

       kubectl exec -it secret-test -- /bin/bash

1. The secret data is exposed to the Container through a Volume mounted under
`/etc/secret-volume`. In your shell, go to the directory where the secret data
is exposed:

       root@secret-test:/# cd /etc/secret-volume

1. In your shell, list the files in the `/etc/secret-volume` directory:

       root@secret-test:/etc/secret-volume# ls

    The output shows two files, one for each piece of secret data:

        password username

1. In your shell, display the contents of the `username` and `password` files:

       root@secret-test:/etc/secret-volume# cat username; echo; cat password; echo

    The output is your username and password:

        my-app
        39528$vdg7Jb

## Create a Deployment that has access to the secret data through environment variables

Here is a configuration file you can use to create a Deployment:

{{< code file="secret-envars-deployment.yaml" >}}

1. Create the deployment:

       kubectl create -f https://k8s.io/docs/tasks/inject-data-application/secret-envars-deployment.yaml

1. Verify that your Deployment is running:

       kubectl get deployment secret-envars-test

    Output:

        NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
        secret-test        2         2         2            2           12s
		
1. Get a shell into the Container that is running in your Deployment:

       kubectl exec -it secret-envars-test -- /bin/bash

1. In your shell, display the environment variables:

        root@secret-envars-test:/# printenv

    The output includes your username and password:

        ...
        SECRET_USERNAME=my-app
        ...
        SECRET_PASSWORD=39528$vdg7Jb

{{% /capture %}}

{{% capture whatsnext %}}

* Learn more about [Secrets](/docs/concepts/configuration/secret/).
* Learn about [Volumes](/docs/concepts/storage/volumes/).

### Reference

* [Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)
* [Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core)
* [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)
* [Deployment](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#deployment-v1-apps)

{{% /capture %}}


