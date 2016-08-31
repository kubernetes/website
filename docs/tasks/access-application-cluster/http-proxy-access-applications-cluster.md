---
---

{% capture overview %}
This page shows how to use an HTTP proxy to access the Kubernetes API.
{% endcapture %}

{% capture prerequisites %}

* To do this task, you need a Kubernetes cluster, including a running Kubernetes
  API server. You can use an existing cluster, or you can
  [create a new cluster](). TODO: Create a task or tutorial topic that shows how
  to use minikube to create a cluster.

* You also need to have `kubectl` installed on your local machine, and `kubectl`
  must be configured to communicate with your Kubernetes API server. TODO: Link
  to a topic that shows how to confiure kubectl.

{% endcapture %}

{% capture steps %}

### Use kubectl to start a proxy server

This command starts a proxy to the Kubernetes API server:

    kubectl proxy --port=8080

### Explore the Kubernetes API

When the proxy server is running, can explore the API using `curl`, `wget`,
or a browser.

Get the API versions:

    curl http://localhost:8080/api/

The output is similar to this:

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

The output is similar to this:

    {
      "kind": "PodList",
      "apiVersion": "v1",
      "metadata": {
        "selfLink": "/api/v1/namespaces/default/pods",
        "resourceVersion": "33074"
      },
      "items": [
        {
          "metadata": {
            "name": "kubernetes-bootcamp-2321272333-ix8pt",
            "generateName": "kubernetes-bootcamp-2321272333-",
            "namespace": "default",
            "selfLink": "/api/v1/namespaces/default/pods/kubernetes-bootcamp-2321272333-ix8pt",
            "uid": "ba21457c-6b1d-11e6-85f7-1ef9f1dab92b",
            "resourceVersion": "33003",
            "creationTimestamp": "2016-08-25T23:43:30Z",
            "labels": {
              "pod-template-hash": "2321272333",
              "run": "kubernetes-bootcamp"
            },
            ...
    }

{% endcapture %}

{% capture whats_next %}
Learn more about [kubectl proxy](/docs/user-guide/kubectl/kubectl_proxy).
TODO: Verify that this link works in the master branch.
{% endcapture %}

{% include templates/task.md %}
