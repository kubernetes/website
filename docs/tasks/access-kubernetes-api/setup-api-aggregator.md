---
title: Setup the API Aggregator
assignees:
- chenopis
---

{% capture overview %}

Setting up the API Aggregator will allow the Kubernetes apiserver to be extended with additional APIs, which are not part of the core Kubernetes APIs. 

{% endcapture %}

{% capture prerequisites %}

* You need to have a Kubernetes cluster running.
* Make sure there are Aggregator certificates (both CA and proxy) setup on the Kubernetes apiserver.
* The proxy cert must have been signed by the relevant CA. 

{% endcapture %}

{% capture steps %}

## Enable apiserver flags

The system needs to be enabled via the following apiserver flags; however, they may have already been taken care of by your provider.

    --requestheader-client-ca-file=<path to aggregator CA cert>
    --requestheader-allowed-names=aggregator
    --requestheader-extra-headers-prefix=X-Remote-Extra-
    --requestheader-group-headers=X-Remote-Group
    --requestheader-username-headers=X-Remote-User
    --proxy-client-cert-file=<path to aggregator proxy cert>
    --proxy-client-key-file=<path to aggregator proxy key>

If you are not running kube-proxy on your master, as the [Kubernetes Architectural Roadmap](https://docs.google.com/a/google.com/document/d/1XkjVm4bOeiVkj-Xt1LgoGiqWsBfNozJ51dyI-ljzt1o/edit?usp=sharing) recommends, then you need to make sure that the system is enabled with the following apiserver flag. Again, this may have already been taken care of by your provider.

    --enable-aggregator-routing=true

## Get an extension api-server working with Aggregator

The generated skeleton, which comes with [apiserver-builder](https://github.com/Kubernetes-incubator/apiserver-builder/blob/master/README.md), should setup the skeleton server it creates to do all of these steps. You can also look at the sample-apiserver under Kubernetes for ways the following can be done.

1. Make sure the APIService api is enabled (check --runtime-config); it is on by default, so it should be on unless it’s been deliberately turned off in your cluster.
1. You may need to make an RBAC rule allowing you to add APIService objects, or get your cluster administrator to make one. (Since API extensions affect the entire cluster, it is not recommended to do testing/development/debug of an API extension in a live cluster.)
1. Create the Kubernetes namespace you want to run your extension api-service in.
1. Create/get a CA cert to be used to sign the server cert the extension api-server uses for HTTPS.
1. Create a server cert/key for the api-server to use for HTTPS. This cert should be signed by the above CA. It should also have a CN of the Kube DNS name. This will generally be derived from the Kubernetes service and be of the form  <service name>.<service name namespace>.svc
1. Create a Kubernetes secret with the server cert/key in your namespace.
1. Create a Kubernetes deployment for the extension api-server and make sure you are loading the secret as a volume. It will also need to contain a reference to a working image of your extension api-server. The deployment should also be in your namespace.
1. Make sure that your extension-apiserver loads those certs from that volume and that they are used in the HTTPS handshake.
1. Create a Kubernetes service account in your namespace.
1. Create a Kubernetes cluster role for the operations you want to allow on your resources.
1. Create a Kubernetes cluster role binding from the default service account in your namespace to the cluster role you just created.
1. Create a Kubernetes apiservice. The CA cert above should be base 64 encoded, stripped of new lines and used as the spec.caBundle in the apiservce.  This should not be namespaced.
1. Use kubectl to get your resource. It will probably return "No resources found." Which means that everything worked but you currently have no objects of that resource type created yet.

{% endcapture %}

{% capture whatsnext %}

* For a high level overview, see [Extending the Kubernetes API with Aggregator](/docs/concepts/api-extension/apiserver-aggregation/).
* Learn how to [Extend the Kubernetes API Using Third Party Resources](/docs/tasks/access-Kubernetes-api/extend-api-third-party-resource/).

{% endcapture %}

{% include templates/task.md %}

