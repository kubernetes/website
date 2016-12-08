---
---

{% capture overview %}
This page shows how to create a Secret and a Pod that has access to the Secret.
{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}

### Converting your secret data to a base-64 representation

Suppose you want to have two pieces of secret data: a username `my-app` and a password
`39528$vdg7Jb`. First, use [Base64 encoding](https://www.base64encode.org/) to
convert your username and password to a base-64 representation. Here's a Linux
example:

    echo 'my-app' | base64
    echo '39528$vdg7Jb' | base64

The output shows that the base-64 representation of your username is `bXktYXBwCg==`,
and the base-64 representation of your password is `Mzk1MjgkdmRnN0piCg==`.

### Creating a Secret

Here is a configuration file you can use to create a Secret that holds your
username and password:

{% include code.html language="yaml" file="secret.yaml" ghlink="/docs/tasks/administer-cluster/secret.yaml" %}

1. Create the Secret

        kubectl create -f http://k8s.io/docs/tasks/administer-cluster/secret.yaml

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

### Creating a Pod that has access to the secret data

Here is a configuration file you can use to create a Pod:

{% include code.html language="yaml" file="secret-pod.yaml" ghlink="/docs/tasks/administer-cluster/secret-pod.yaml" %}

1. Create the Pod:

        kubectl create -f http://k8s.io/docs/tasks/administer-cluster/secret-pod.yaml

1. Verify that your Pod is running:

        kubectl get pods

    Output:

        NAME              READY     STATUS    RESTARTS   AGE
        secret-test-pod   1/1       Running   0          42m


1. Get a shell into the Container that is running in your Pod:

        kubectl exec -it secret-test-pod -- /bin/bash

1. In your shell, go to the directory where the secret data is exposed:

        root@secret-test-pod:/# cd /etc/secret-volume

1. In your shell, list the files in the `/etc/secret-volume` directory:

        root@secret-test-pod:/etc/secret-volume# ls

    The output shows two files, one for each piece of secret data:

        password username

1. In your shell, display the contents of the `username` and `password` files:

        root@secret-test-pod:/etc/secret-volume# cat username password

    The output is your username and password:

        my-app
        39528$vdg7Jb

{% endcapture %}

{% capture whatsnext %}

* Learn more about [secrets](/docs/user-guide/secrets/).
* See [Secret](docs/api-reference/v1/definitions/#_v1_secret).

{% endcapture %}

{% include templates/task.md %}
