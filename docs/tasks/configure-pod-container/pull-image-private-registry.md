---
title: Pull an Image from a Private Registry
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

## Log in to Docker

On your laptop, you must authenticate with a registry in order to pull a private image:

    docker login

When prompted, enter your Docker username and password.

The login process creates or updates a `config.json` file that holds an authorization token.

View the `config.json` file:

    cat ~/.docker/config.json

The output contains a section similar to this:

    {
        "auths": {
            "https://index.docker.io/v1/": {
                "auth": "c3R...zE2"
            }
        }
    }

**Note:** If you use a Docker credentials store, you won't see that `auth` entry but a `credsStore` entry with the name of the store as value.
{: .note}

## Create a Secret in the cluster that holds your authorization token

A Kubernetes cluster uses the Secret of `docker-registry` type to authenticate with a container registry to pull a private image.

Create this Secret, naming it `regcred`:

    kubectl create secret docker-registry regcred --docker-server=<your-registry-server> --docker-username=<your-name> --docker-password=<your-pword> --docker-email=<your-email>

where:

* `<your-registry-server>` is your Private Docker Registry FQDN.
* `<your-name>` is your Docker username.
* `<your-pword>` is your Docker password.
* `<your-email>` is your Docker email.

You have successfully set your Docker credentials in the cluster as a Secret called `regcred`.

## Inspecting the Secret `regcred`

To understand the contents of the `regcred` Secret you just created, start by viewing the Secret in YAML format:

    kubectl get secret regcred --output=yaml

The output is similar to this:

    apiVersion: v1
    data:
      .dockerconfigjson: eyJodHRwczovL2luZGV4L ... J0QUl6RTIifX0=
    kind: Secret
    metadata:
      ...
      name: regcred
      ...
    type: kubernetes.io/dockerconfigjson

The value of the `.dockerconfigjson` field is a base64 representation of your Docker credentials.

To understand what is in the `.dockerconfigjson` field, convert the secret data to a
readable format:

    kubectl get secret regcred --output="jsonpath={.data.\.dockerconfigjson}" | base64 -d

The output is similar to this:

    {"auths":{"yourprivateregistry.com":{"username":"janedoe","password":"xxxxxxxxxxx","email":"jdoe@example.com","auth":"c3R...zE2"}}}

Notice that the Secret data contains the authorization token similar to your local `~/.docker/config.json` file.

You have successfully set your Docker credentials as a Secret called `regcred` in the cluster.

## Create a Pod that uses your Secret

Here is a configuration file for a Pod that needs access to your Docker credentials in `regcred`:

{% include code.html language="yaml" file="private-reg-pod.yaml" ghlink="/docs/tasks/configure-pod-container/private-reg-pod.yaml" %}

Download the above file:

    wget -O my-private-reg-pod.yaml https://k8s.io/docs/tasks/configure-pod-container/private-reg-pod.yaml

In file `my-private-reg-pod.yaml`, replace `<your-private-image>` with the path to an image in a private registry such as:

    janedoe/jdoe-private:v1

To pull the image from the private registry, Kubernetes needs credentials.
The `imagePullSecrets` field in the configuration file specifies that Kubernetes should get the credentials from a Secret named `regcred`.

Create a Pod that uses your Secret, and verify that the Pod is running:

    kubectl create -f my-private-reg-pod.yaml
    kubectl get pod private-reg

{% endcapture %}

{% capture whatsnext %}

* Learn more about [Secrets](/docs/concepts/configuration/secret/).
* Learn more about [using a private registry](/docs/concepts/containers/images/#using-a-private-registry).
* See [kubectl create secret docker-registry](/docs/user-guide/kubectl/{{page.version}}/#-em-secret-docker-registry-em-).
* See [Secret](/docs/reference/generated/kubernetes-api/{{page.version}}/#secret-v1-core).
* See the `imagePullSecrets` field of [PodSpec](/docs/reference/generated/kubernetes-api/{{page.version}}/#podspec-v1-core).

{% endcapture %}

{% include templates/task.md %}
