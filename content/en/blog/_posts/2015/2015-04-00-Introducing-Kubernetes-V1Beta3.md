---
title: " Introducing Kubernetes API Version v1beta3 "
date: 2015-04-16
slug: introducing-kubernetes-v1beta3
url: /blog/2015/04/Introducing-Kubernetes-V1Beta3
---
We've been hard at work on cleaning up the API over the past several months (see&nbsp;[https://github.com/GoogleCloudPlatform/kubernetes/issues/1519](https://github.com/GoogleCloudPlatform/kubernetes/issues/1519)&nbsp;for details). The result is v1beta3, which is considered to be the release candidate for the v1 API.  

We would like you to move to this new API version as soon as possible. v1beta1 and v1beta2 are deprecated, and will be removed by the end of June, shortly after we introduce the v1 API.  

As of the latest release, v0.15.0, v1beta3 is the primary, default API. We have changed the&nbsp;default kubectl and client API versions as well as the default storage version (which means objects persisted in etcd will be converted from v1beta1 to v1beta3 as they are rewritten).&nbsp;  

You can take a look at v1beta3 examples such as:  

[https://github.com/GoogleCloudPlatform/kubernetes/tree/master/examples/guestbook/v1beta3](https://github.com/GoogleCloudPlatform/kubernetes/tree/master/examples/guestbook/v1beta3)

[https://github.com/GoogleCloudPlatform/kubernetes/tree/master/examples/walkthrough/v1beta3](https://github.com/GoogleCloudPlatform/kubernetes/tree/master/examples/walkthrough/v1beta3)

[https://github.com/GoogleCloudPlatform/kubernetes/tree/master/examples/update-demo/v1beta3](https://github.com/GoogleCloudPlatform/kubernetes/tree/master/examples/update-demo/v1beta3)



To aid the transition, we've also created a conversion&nbsp;[tool](https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/cluster_management.md#switching-your-config-files-to-a-new-api-version)&nbsp;and put together a list of important&nbsp;[different API changes](https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/api.md#v1beta3-conversion-tips).  


- The resource&nbsp;`id`&nbsp;is now called&nbsp;`name`.
- `name`,&nbsp;`labels`,&nbsp;`annotations`, and other metadata are now nested in a map called&nbsp;`metadata`
- `desiredState`&nbsp;is now called&nbsp;`spec`, and&nbsp;`currentState`&nbsp;is now called&nbsp;`status`
- `/minions`&nbsp;has been moved to&nbsp;`/nodes`, and the resource has kind&nbsp;`Node`
- The namespace is required (for all namespaced resources) and has moved from a URL parameter to the path:`/api/v1beta3/namespaces/{namespace}/{resource_collection}/{resource_name}`
- The names of all resource collections are now lower cased - instead of&nbsp;`replicationControllers`, use`replicationcontrollers`.
- To watch for changes to a resource, open an HTTP or Websocket connection to the collection URL and provide the`?watch=true`&nbsp;URL parameter along with the desired&nbsp;`resourceVersion`&nbsp;parameter to watch from.
- The container&nbsp;`entrypoint`&nbsp;has been renamed to&nbsp;`command`, and&nbsp;`command`&nbsp;has been renamed to&nbsp;`args`.
- Container, volume, and node resources are expressed as nested maps (e.g.,&nbsp;`resources{cpu:1}`) rather than as individual fields, and resource values support&nbsp;[scaling suffixes](https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/resources.md#resource-quantities)&nbsp;rather than fixed scales (e.g., milli-cores).
- Restart policy is represented simply as a string (e.g., "Always") rather than as a nested map ("always{}").
- The volume&nbsp;`source`&nbsp;is inlined into&nbsp;`volume`&nbsp;rather than nested.
- Host volumes have been changed to&nbsp;hostDir&nbsp;to&nbsp;hostPath&nbsp;&nbsp;to better reflect that they can be files or directories



And the most recently generated Swagger specification of the API is here:

[http://kubernetes.io/third\_party/swagger-ui/#!/v1beta3](http://kubernetes.io/third_party/swagger-ui/#!/v1beta3)



More details about our approach to API versioning and the transition can be found here:

[https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/api.md](https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/api.md)



Another change we discovered is that with the change to the default API version in kubectl, commands that use "-o template" will break unless you specify "--api-version=v1beta1" or update to v1beta3 syntax. An example of such a change can be seen here:

[https://github.com/GoogleCloudPlatform/kubernetes/pull/6377/files](https://github.com/GoogleCloudPlatform/kubernetes/pull/6377/files)



If you use "-o template", I recommend always explicitly specifying the API version rather than relying upon the default. We may add this setting to kubeconfig in the future.



Let us know if you have any questions. As always, we're available on IRC (#google-containers) and github issues.
