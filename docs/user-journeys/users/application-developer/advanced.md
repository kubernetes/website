---
approvers:
- chenopis
layout: docsportal
css: /css/style_user_journeys.css, https://fonts.googleapis.com/icon?family=Material+Icons
js: https://use.fontawesome.com/4bcc658a89.js, https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js
title: Application Developer - Advanced
track: "USERS › APPLICATION DEVELOPER › ADVANCED"
---

{% capture overview %}

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id felis non enim faucibus lacinia. Aliquam massa mauris, interdum a ex ut, sagittis rutrum nulla. In pellentesque est at molestie fringilla. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec eu mi at velit lacinia venenatis ac nec sem. In volutpat pellentesque dui ut commodo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis sollicitudin eleifend felis non facilisis. Pellentesque leo urna, congue id auctor non, varius a nunc. Duis ultrices, odio ut hendrerit suscipit, nisi mauris dignissim mauris, nec bibendum ante neque ut augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam condimentum libero sit amet rutrum fermentum. Proin posuere condimentum odio. Aenean volutpat, ex vel tincidunt tincidunt, massa odio condimentum lectus, vel iaculis libero dolor in nisi.

{% endcapture %}


{% capture body %}
## Extend the Kubernetes API

Kubernetes is designed with extensibility in mind. If the API resources and features mentioned above are not enough for your needs, there are ways to customize its behavior *without* having to modify core Kubernetes code.

#### Understand Kubernetes's default behavior

Before making any customizations, it's important that you understand how Kubernetes achieves its "self-healing" behavior. *Feel free to skip this part if you're already familiar.*

Although Deployments and Secrets may seem quite different, the following concepts are true for *any* type of Kubernetes object:

* **Kubernetes objects are a way of storing structured data about your cluster.**
  In the case of Deployments, this data represents *desired state* (e.g. "How many replicas should be running?"), but it can also be general metadata.
* **Kubernetes objects are modified via the {% glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" %}**.
  In other words, you can make `GET` and `POST` requests to a specific resource path (e.g. `<api-server-url>/api/v1/namespaces/default/deployments`) to read and write the corresponding object type.
* **By leveraging the [Controller pattern](/docs/concepts/api-extension/custom-resources/#custom-controllers){:target="_blank"}, Kubernetes objects can be used to enforce desired state**. For simplicity, you can think of the Controller pattern as the following continuous loop:
    1. Check current state (number of replicas, container image, etc)
    2. Compare current state to desired state
    3. Update if there's a mismatch

  These states are obtained from the Kubernetes API.

(*Note that not all Kubernetes objects need to have a Controller. Though Deployments trigger the cluster to "do things", ConfigMaps act purely as storage.*)

#### Create Custom Resources

Based on the ideas above, there is no reason you can't define a completely new [Custom Resource](/docs/concepts/api-extension/custom-resources/#custom-resources){:target="_blank"} that is just as legitimate as a Deployment. For example, you might want to define a `Backup` object for periodic backups, if `CronJobs` don't provide all the functionality you need.

There are two main ways of setting up custom resources:
1. **Custom Resource Definitions (CRDs)** - See [an example](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/){:target="_blank"}.
2. **API aggregation** - This requires some [pre-configuration](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/){:target="_blank"} before you actually [set up a separate, extension API server](/docs/tasks/access-kubernetes-api/setup-extension-api-server/){:target="_blank"}.

Note that unlike standard Kubernetes objects, which rely on the built-in [`kube-controller-manager`](/docs/reference/generated/kube-controller-manager/){:target="_blank"}, you'll need to write and run your own [custom controllers](https://github.com/kubernetes/sample-controller).

You may also find the following info helpful:
* [How to know if custom resources are right for your use case](/docs/concepts/api-extension/custom-resources/#should-i-use-a-configmap-or-a-custom-resource){:target="_blank"}
* [How to decide between CRDs and API aggregation](/docs/concepts/api-extension/custom-resources/#choosing-a-method-for-adding-custom-resources){:target="_blank"}
* [Other points of extensibility within Kubernetes](/docs/concepts/overview/extending/){:target="_blank"}


## Deploy an application with advanced features

#### Containers

As you may know, it's an *antipattern* to migrate an entire app (e.g. containerized Rails app, MySQL database, and all) into a single Pod. That being said, you can leverage some powerful patterns that go beyond a 1:1 correspondence between a container and its Pod:
* **Sidecar container**: Although your Pod should still have a single "main" container, you can add a secondary container that acts as a helper (see a [logging example](/docs/concepts/cluster-administration/logging/#using-a-sidecar-container-with-the-logging-agent){:target="_blank"}). Two containers within a single Pod can communicate [via a shared volume](/docs/tasks/access-application-cluster/communicate-containers-same-pod-shared-volume/){:target="_blank"}.
* **Init containers**: "Init containers" run before any of a Pod's "app containers" (e.g. main and sidecar containers). [Read more](/docs/concepts/workloads/pods/init-containers/){:target="_blank"}, [see an example](/docs/tasks/configure-pod-container/configure-pod-initialization/){:target="_blank"}, and [learn how to debug them](/docs/tasks/debug-application-cluster/debug-init-containers/){:target="_blank"}.

#### Configuration

Kubernetes provides ways to attach metadata or inject data into your resources:
* **Taints and Tolerations** - These provide a way for nodes to "attract" or "repel" your Pods. [Read more](/docs/concepts/configuration/taint-and-toleration/){:target="_blank"}.
* **Downward API** - This allows your containers to consume information about themselves or the cluster, without being overly coupled to the Kubernetes API server. This can be achieved with [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/){:target="_blank"} or [DownwardAPIVolumeFiles](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/){:target="_blank"}.
* **ConfigMaps** - This was mentioned in the beginner section, and is worth another highlight because it is a common way to decouple runtime-specific parameters from your container images. [Read more](/docs/tasks/configure-pod-container/configure-pod-configmap/){:target="_blank"}.
## Explore advanced topics

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id felis non enim faucibus lacinia. Aliquam massa mauris, interdum a ex ut, sagittis rutrum nulla. In pellentesque est at molestie fringilla. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec eu mi at velit lacinia venenatis ac nec sem. In volutpat pellentesque dui ut commodo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis sollicitudin eleifend felis non facilisis. Pellentesque leo urna, congue id auctor non, varius a nunc. Duis ultrices, odio ut hendrerit suscipit, nisi mauris dignissim mauris, nec bibendum ante neque ut augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam condimentum libero sit amet rutrum fermentum. Proin posuere condimentum odio. Aenean volutpat, ex vel tincidunt tincidunt, massa odio condimentum lectus, vel iaculis libero dolor in nisi.

Curabitur bibendum tempor mi, vel lacinia nisi vulputate ac. Nulla dignissim consectetur nisl nec tincidunt. Etiam pharetra facilisis sapien, non gravida velit fermentum sed. Ut ac ultrices nunc, in vestibulum urna. Suspendisse accumsan euismod felis, sit amet rhoncus neque volutpat luctus. Aliquam tincidunt pellentesque mauris, sed tempus diam. Mauris in elit eget justo tempor suscipit.

Aenean suscipit arcu ac leo tincidunt tempus. Donec maximus tellus libero, ac ullamcorper magna lobortis ac. Integer mollis nisl vitae magna gravida, nec ornare ex consectetur. Sed mattis tincidunt nisi, at consequat tellus malesuada non. Integer vel semper nisi, ut fringilla velit. Nam felis ex, congue non dui vitae, sollicitudin convallis turpis. Phasellus porttitor maximus turpis, in varius nibh fermentum aliquam. Cras finibus lacus non diam porttitor porttitor. Nulla fringilla sagittis nibh nec condimentum. Duis egestas mauris nec dolor hendrerit ullamcorper sit amet in mi. Phasellus sollicitudin justo diam.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id felis non enim faucibus lacinia. Aliquam massa mauris, interdum a ex ut, sagittis rutrum nulla. In pellentesque est at molestie fringilla. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec eu mi at velit lacinia venenatis ac nec sem. In volutpat pellentesque dui ut commodo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis sollicitudin eleifend felis non facilisis. Pellentesque leo urna, congue id auctor non, varius a nunc. Duis ultrices, odio ut hendrerit suscipit, nisi mauris dignissim mauris, nec bibendum ante neque ut augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam condimentum libero sit amet rutrum fermentum. Proin posuere condimentum odio. Aenean volutpat, ex vel tincidunt tincidunt, massa odio condimentum lectus, vel iaculis libero dolor in nisi.

Curabitur bibendum tempor mi, vel lacinia nisi vulputate ac. Nulla dignissim consectetur nisl nec tincidunt. Etiam pharetra facilisis sapien, non gravida velit fermentum sed. Ut ac ultrices nunc, in vestibulum urna. Suspendisse accumsan euismod felis, sit amet rhoncus neque volutpat luctus. Aliquam tincidunt pellentesque mauris, sed tempus diam. Mauris in elit eget justo tempor suscipit.

Aenean suscipit arcu ac leo tincidunt tempus. Donec maximus tellus libero, ac ullamcorper magna lobortis ac. Integer mollis nisl vitae magna gravida, nec ornare ex consectetur. Sed mattis tincidunt nisi, at consequat tellus malesuada non. Integer vel semper nisi, ut fringilla velit. Nam felis ex, congue non dui vitae, sollicitudin convallis turpis. Phasellus porttitor maximus turpis, in varius nibh fermentum aliquam. Cras finibus lacus non diam porttitor porttitor. Nulla fringilla sagittis nibh nec condimentum. Duis egestas mauris nec dolor hendrerit ullamcorper sit amet in mi. Phasellus sollicitudin justo diam.

## Additional resources

### What's next
Congrats on completing the Application Developer user journey!

If you are interested in learning more about the inner workings of Kubernetes (e.g. networking), consider checking out the [Cluster Operator journey](/docs/user-journeys/users/cluster-operator/foundational/){:target="_blank"}

{% endcapture %}

{% include templates/user-journey-content.md %}
