---
title: Pulling an Image from a Private Registry
---

{% capture overview %}

This page shows how to create a Pod that uses a Secret to pull an image from a
private Docker registry or repository.

{% endcapture %}

{% capture prerequisites %}

* {% include task-tutorial-prereqs.md %}

* To do this exercise, you need a
[Docker ID](https://docs.docker.com/docker-id/) and password.

{% endcapture %}

{% capture steps %}

## Logging in to Docker

    docker login

When prompted, enter your Docker username and password.

The login process creates or updates a `config.json` file that holds an
authorization token.

View the `configfile.json` file:

    cat ~/.docker/config.json

The output contains a section similar to this:

    {
        "auths": {
            "https://index.docker.io/v1/": {
                "auth": "c3RldmU1MzpTdGV2ZURvY2tAIzE2"
            }
        }
    }

## Creating a Secret that holds your authorization token

Create a Secret named `regsecret`:

    kubectl create secret docker-registry regsecret --docker-username=<your-name> --docker-password=<your-pword> --docker-email=<your-email>

where:

* `<your-name>` is your Docker username.
* `<your-pword>` is your Docker password.
* `<your-email>` is your Docker email.

## Understanding your Secret

To understand what's in the Secret you just created, start by viewing the
Secret in YAML format:

    kubectl get secret regsecret --output=yaml

The output is similar to this:

    apiVersion: v1
    data:
      .dockercfg: eyJodHRwczovL2luZGV4L ... J0QUl6RTIifX0=
    kind: Secret
    metadata:
      ...
      name: regsecret
      ...
    type: kubernetes.io/dockercfg

The value of the `.dockercfg` field is a base64 representation of your secret data.

Copy the base64 representation of the secret data into a file named `secret64`.

**Important**: Make sure there are no line breaks in your `secret64` file.

To understand what is in the `dockercfg` field, convert the secret data to a
readable format:

    base64 -d secret64

The output is similar to this:

    {"https://index.docker.io/v1/":{"username":"janedoe","password":"xxxxxxxxxxx","email":"jdoe@example.com","auth":"c3RldmU1MzpTdGV2ZURvY2tAIzE2"}}

Notice that the secret data contains the authorization token from your
`config.json` file.

## Creating a Pod that uses your Secret

Here is a configuration file for a Pod that needs access to your secret data:

{% include code.html language="yaml" file="private-reg-pod.yaml" ghlink="/docs/tasks/configure-pod-container/private-reg-pod.yaml" %}

Copy the contents of `private-reg-pod.yaml` to your own file named
`my-private-reg-pod.yaml`. In your file, replace `<your-private-image>` with
the path to an image in a private repository.

Example Docker Hub private image:

    janedoe/jdoe-private:v1

To pull the image from the private repository, Kubernetes needs credentials. The
 `imagePullSecrets` field in the configuration file specifies that Kubernetes
 should get the credentials from a Secret named
`regsecret`.

Create a Pod that uses your Secret, and verify that the Pod is running:

    kubectl create -f my-private-reg-pod.yaml
    kubectl get pod private-reg

{% endcapture %}

{% capture whatsnext %}

* Learn more about [Secrets](/docs/user-guide/secrets/).
* Learn more about
[using a private registry](/docs/user-guide/images/#using-a-private-registry).
* See [kubectl create secret docker-registry](/docs/user-guide/kubectl/kubectl_create_secret_docker-registry/).
* See [Secret](/docs/api-reference/v1/definitions/#_v1_secret)
* See the `imagePullSecrets` field of
[PodSpec](/docs/api-reference/v1/definitions/#_v1_podspec).

{% endcapture %}

{% include templates/task.md %}
