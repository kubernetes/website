You need to have a Kubernetes cluster, and the kubectl command-line tool must
be configured to communicate with your cluster. If you do not already have a
cluster, you can create one by using
[Minikube](/docs/getting-started-guides/minikube),
or you can use one of these Kubernetes playgrounds:

* [Katacoda](https://www.katacoda.com/courses/kubernetes/playground)
* [Play with Kubernetes](http://labs.play-with-k8s.com/)

{% if page.min-kubernetes-server-version == page.version %}
Your Kubernetes server must be version {{page.min-kubernetes-server-version}}.
{% elsif page.min-kubernetes-server-version %}
Your Kubernetes server must be version {{page.min-kubernetes-server-version}} or later.
{% endif %} To check the version, enter `kubectl version`.
