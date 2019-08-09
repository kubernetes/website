---
title: Use an HTTP Proxy to Access the Kubernetes API
content_template: templates/task
weight: 40
---

{{% capture overview %}}
This page shows how to use an HTTP proxy to access the Kubernetes API.
{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

If you do not already have an application running in your cluster, start
a Hello world application by entering this command:

```shell
kubectl run node-hello --image=gcr.io/google-samples/node-hello:1.0 --port=8080
```

{{% /capture %}}

{{% capture steps %}}

## Using kubectl to start a proxy server

This command starts a proxy to the Kubernetes API server:

    kubectl proxy --port=8080

## Exploring the Kubernetes API

When the proxy server is running, you can explore the API using `curl`, `wget`,
or a browser.

Get the API versions:

    curl http://localhost:8080/api/

    {
      "kind": "APIVersions",
      "versions": [
        "v1"
      ],
      "serverAddressByClientCIDRs": [
        {
          "clientCIDR": "0.0.0.0/0",
          "serverAddress": "10.0.2.15:8443"
        }
      ]
    }

Get a list of pods:

    curl http://localhost:8080/api/v1/namespaces/default/pods

    {
      "kind": "PodList",
      "apiVersion": "v1",
      "metadata": {
        "resourceVersion": "33074"
      },
      "items": [
        {
          "metadata": {
            "name": "kubernetes-bootcamp-2321272333-ix8pt",
            "generateName": "kubernetes-bootcamp-2321272333-",
            "namespace": "default",
            "uid": "ba21457c-6b1d-11e6-85f7-1ef9f1dab92b",
            "resourceVersion": "33003",
            "creationTimestamp": "2016-08-25T23:43:30Z",
            "labels": {
              "pod-template-hash": "2321272333",
              "run": "kubernetes-bootcamp"
            },
            ...
    }

{{% /capture %}}

{{% capture whatsnext %}}
Learn more about [kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands#proxy).
{{% /capture %}}


