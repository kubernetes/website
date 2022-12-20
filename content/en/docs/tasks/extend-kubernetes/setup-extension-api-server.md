---
title: Set up an Extension API Server
reviewers:
- lavalamp
- cheftako
- chenopis
content_type: task
weight: 15
---

<!-- overview -->

Setting up an extension API server to work with the aggregation layer allows the Kubernetes apiserver to be extended with additional APIs, which are not part of the core Kubernetes APIs.



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* You must [configure the aggregation layer](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) and enable the apiserver flags.



<!-- steps -->

## Set up an extension api-server to work with the aggregation layer

The following steps describe how to set up an extension-apiserver *at a high level*. These steps apply regardless if you're using YAML configs or using APIs. An attempt is made to specifically identify any differences between the two. For a concrete example of how they can be implemented using YAML configs, you can look at the [sample-apiserver](https://github.com/kubernetes/sample-apiserver/blob/master/README.md) in the Kubernetes repo.

Alternatively, you can use an existing 3rd party solution, such as [apiserver-builder](https://github.com/kubernetes-sigs/apiserver-builder-alpha/blob/master/README.md), which should generate a skeleton and automate all of the following steps for you.

1. Make sure the APIService API is enabled (check `--runtime-config`). It should be on by default, unless it's been deliberately turned off in your cluster.
1. You may need to make an RBAC rule allowing you to add APIService objects, or get your cluster administrator to make one. (Since API extensions affect the entire cluster, it is not recommended to do testing/development/debug of an API extension in a live cluster.)
1. Create the Kubernetes namespace you want to run your extension api-service in.
1. Create/get a CA cert to be used to sign the server cert the extension api-server uses for HTTPS.
1. Create a server cert/key for the api-server to use for HTTPS. This cert should be signed by the above CA. It should also have a CN of the Kube DNS name. This is derived from the Kubernetes service and be of the form `<service name>.<service name namespace>.svc`
1. Create a Kubernetes secret with the server cert/key in your namespace.
1. Create a Kubernetes deployment for the extension api-server and make sure you are loading the secret as a volume. It should contain a reference to a working image of your extension api-server. The deployment should also be in your namespace.
1. Make sure that your extension-apiserver loads those certs from that volume and that they are used in the HTTPS handshake.
1. Create a Kubernetes service account in your namespace.
1. Create a Kubernetes cluster role for the operations you want to allow on your resources.
1. Create a Kubernetes cluster role binding from the service account in your namespace to the cluster role you created.
1. Create a Kubernetes cluster role binding from the service account in your namespace to the `system:auth-delegator` cluster role to delegate auth decisions to the Kubernetes core API server.
1. Create a Kubernetes role binding from the service account in your namespace to the `extension-apiserver-authentication-reader` role. This allows your extension api-server to access the `extension-apiserver-authentication` configmap.
1. Create a Kubernetes apiservice. The CA cert above should be base64 encoded, stripped of new lines and used as the spec.caBundle in the apiservice. This should not be namespaced. If using the [kube-aggregator API](https://github.com/kubernetes/kube-aggregator/), only pass in the PEM encoded CA bundle because the base 64 encoding is done for you.
1. Use kubectl to get your resource. When run, kubectl should return "No resources found.". This message
indicates that everything worked but you currently have no objects of that resource type created.


## {{% heading "whatsnext" %}}


* Walk through the steps to [configure the API aggregation layer](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) and enable the apiserver flags.
* For a high level overview, see [Extending the Kubernetes API with the aggregation layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/).
* Learn how to [Extend the Kubernetes API using Custom Resource Definitions](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/).
