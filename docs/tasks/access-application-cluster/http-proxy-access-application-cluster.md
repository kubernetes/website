---
---

{% capture overview %}
This page shows how to use an HTTP proxy to access the Kubernetes API.
{% endcapture %}

{% capture prerequisites %}

* To do this task, you need a Kubernetes cluster, including a running Kubernetes
  API server. You can use an existing cluster, or you can create a new cluster.
  One way to create a new cluster is to use
  [Minikube](/docs/getting-started-guides/minikube).

* You also need to have `kubectl` installed on your local machine, and `kubectl`
  must be configured to communicate with your Kubernetes API server. This
  configuration is done automatically if you use Minikube.

{% endcapture %}

{% capture steps %}

### Using kubectl to start a proxy server

This command starts a proxy to the Kubernetes API server:

    kubectl proxy --port=8080

### Exploring the Kubernetes API

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
        "selfLink": "/api/v1/namespaces/default/pods",
        "resourceVersion": "33074"
      },
      "items": [
        {
          "metadata": {
            ...
    }

{% endcapture %}

{% capture whatsnext %}
Learn more about [kubectl proxy](/docs/user-guide/kubectl/kubectl_proxy).
{% endcapture %}

{% include templates/task.md %}
