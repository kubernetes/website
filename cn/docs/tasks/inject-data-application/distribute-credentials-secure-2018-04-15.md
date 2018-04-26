---
title: Distribute Credentials Securely Using Secrets
---

{% capture overview %}
This page shows how to securely inject sensitive data, such as passwords and
encryption keys, into Pods.
{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}

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

{% include code.html language="yaml" file="secret.yaml" ghlink="/docs/tasks/inject-data-application/secret.yaml" %}

1. Create the Secret

       kubectl create -f https://k8s.io/docs/tasks/inject-data-application/secret.yaml

    **Note:** If you want to skip the Base64 encoding step, you can create a Secret
    by using the `kubectl create secret` command:
    {: .note}

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

## Create a Pod that has access to the secret data through a Volume

Here is a configuration file you can use to create a Pod:

{% include code.html language="yaml" file="secret-pod.yaml" ghlink="/docs/tasks/inject-data-application/secret-pod.yaml" %}

1. Create the Pod:

       kubectl create -f https://k8s.io/docs/tasks/inject-data-application/secret-pod.yaml

1. Verify that your Pod is running:

       kubectl get pod secret-test-pod

    Output:

        NAME              READY     STATUS    RESTARTS   AGE
        secret-test-pod   1/1       Running   0          42m


1. Get a shell into the Container that is running in your Pod:

       kubectl exec -it secret-test-pod -- /bin/bash

1. The secret data is exposed to the Container through a Volume mounted under
`/etc/secret-volume`. In your shell, go to the directory where the secret data
is exposed:

       root@secret-test-pod:/# cd /etc/secret-volume

1. In your shell, list the files in the `/etc/secret-volume` directory:

       root@secret-test-pod:/etc/secret-volume# ls

    The output shows two files, one for each piece of secret data:

        password username

1. In your shell, display the contents of the `username` and `password` files:

       root@secret-test-pod:/etc/secret-volume# cat username; echo; cat password; echo

    The output is your username and password:

        my-app
        39528$vdg7Jb

## Create a Pod that has access to the secret data through environment variables

Here is a configuration file you can use to create a Pod:

{% include code.html language="yaml" file="secret-envars-pod.yaml" ghlink="/docs/tasks/inject-data-application/secret-envars-pod.yaml" %}

1. Create the Pod:

       kubectl create -f https://k8s.io/docs/tasks/inject-data-application/secret-envars-pod.yaml

1. Verify that your Pod is running:

       kubectl get pod secret-envars-test-pod

    Output:

        NAME                     READY     STATUS    RESTARTS   AGE
        secret-envars-test-pod   1/1       Running   0          4m

1. Get a shell into the Container that is running in your Pod:

       kubectl exec -it secret-envars-test-pod -- /bin/bash

1. In your shell, display the environment variables:

        root@secret-envars-test-pod:/# printenv

    The output includes your username and password:

        ...
        SECRET_USERNAME=my-app
        ...
        SECRET_PASSWORD=39528$vdg7Jb

{% endcapture %}

{% capture whatsnext %}

* Learn more about [Secrets](/docs/concepts/configuration/secret/).
* Learn about [Volumes](/docs/concepts/storage/volumes/).

### Reference

* [Secret](/docs/reference/generated/kubernetes-api/{{page.version}}/#secret-v1-core)
* [Volume](/docs/reference/generated/kubernetes-api/{{page.version}}/#volume-v1-core)
* [Pod](/docs/reference/generated/kubernetes-api/{{page.version}}/#pod-v1-core)

{% endcapture %}

{% include templates/task.md %}
