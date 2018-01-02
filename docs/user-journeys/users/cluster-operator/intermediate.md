---
approvers:
- chenopis
layout: docsportal
css: /css/style_user_journeys.css, https://fonts.googleapis.com/icon?family=Material+Icons
js: https://use.fontawesome.com/4bcc658a89.js, https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js
title: Cluster Operators - Intermediate
track: "USERS > CLUSTER OPERATOR > INTERMEDIATE"
---

{% capture overview %}

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id felis non enim faucibus lacinia. Aliquam massa mauris, interdum a ex ut, sagittis rutrum nulla. In pellentesque est at molestie fringilla. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec eu mi at velit lacinia venenatis ac nec sem. In volutpat pellentesque dui ut commodo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis sollicitudin eleifend felis non facilisis. Pellentesque leo urna, congue id auctor non, varius a nunc. Duis ultrices, odio ut hendrerit suscipit, nisi mauris dignissim mauris, nec bibendum ante neque ut augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam condimentum libero sit amet rutrum fermentum. Proin posuere condimentum odio. Aenean volutpat, ex vel tincidunt tincidunt, massa odio condimentum lectus, vel iaculis libero dolor in nisi.

{% endcapture %}

{% capture body %}

## Intermediate resources

Beyond the [basic kubernetes resources](/docs/user-journeys/cluster-operator/foundational#section-2) supporting stateless containers, there are a number of resources that support or extend Kubernetes to additional common use cases, including persistence, initialization, and batch processing needs.

* [Ingress](/docs/concepts/services-networking/ingress/)
* [Volumes](/docs/concepts/storage/volumes/)
* [Persistent Volumes](/docs/concepts/storage/persistent-volumes/)
* [Daemon Sets](/docs/concepts/workloads/controllers/daemonset/)
* [Stateful Sets](/docs/concepts/workloads/controllers/statefulset/)
* [Jobs](/docs/concepts/workloads/controllers/jobs-run-to-completion/)
* [CronJobs](/docs/concepts/workloads/controllers/cron-jobs/)

Supporting these more advanced use cases, you will also want to be familiar with:

* [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/)
  * [Init Containers](/docs/concepts/workloads/pods/init-containers/)
  * [Pod Presets](/docs/concepts/workloads/pods/podpreset/)
  * [Container Lifecycle Hooks](docs/concepts/containers/container-lifecycle-hooks/)

And how Pods work with scheduling, priority, disruptions:

* [Taints and Tolerations](/docs/concepts/configuration/taint-and-toleration/)
* [Pods and Priority](/docs/concepts/configuration/pod-priority-preemption/)
* [Disruptions](/docs/concepts/workloads/pods/disruptions/)
* [Assigning Pods to Nodes](docs/concepts/configuration/assign-pod-node/)
* [Managing compute resources for containers](docs/concepts/configuration/manage-compute-resources-container/)
* [Configuration best practices](docs/concepts/configuration/overview/)

## Work with commonly used features

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id felis non enim faucibus lacinia. Aliquam massa mauris, interdum a ex ut, sagittis rutrum nulla. In pellentesque est at molestie fringilla. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec eu mi at velit lacinia venenatis ac nec sem. In volutpat pellentesque dui ut commodo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis sollicitudin eleifend felis non facilisis. Pellentesque leo urna, congue id auctor non, varius a nunc. Duis ultrices, odio ut hendrerit suscipit, nisi mauris dignissim mauris, nec bibendum ante neque ut augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam condimentum libero sit amet rutrum fermentum. Proin posuere condimentum odio. Aenean volutpat, ex vel tincidunt tincidunt, massa odio condimentum lectus, vel iaculis libero dolor in nisi.

Curabitur bibendum tempor mi, vel lacinia nisi vulputate ac. Nulla dignissim consectetur nisl nec tincidunt. Etiam pharetra facilisis sapien, non gravida velit fermentum sed. Ut ac ultrices nunc, in vestibulum urna. Suspendisse accumsan euismod felis, sit amet rhoncus neque volutpat luctus. Aliquam tincidunt pellentesque mauris, sed tempus diam. Mauris in elit eget justo tempor suscipit.

Aenean suscipit arcu ac leo tincidunt tempus. Donec maximus tellus libero, ac ullamcorper magna lobortis ac. Integer mollis nisl vitae magna gravida, nec ornare ex consectetur. Sed mattis tincidunt nisi, at consequat tellus malesuada non. Integer vel semper nisi, ut fringilla velit. Nam felis ex, congue non dui vitae, sollicitudin convallis turpis. Phasellus porttitor maximus turpis, in varius nibh fermentum aliquam. Cras finibus lacus non diam porttitor porttitor. Nulla fringilla sagittis nibh nec condimentum. Duis egestas mauris nec dolor hendrerit ullamcorper sit amet in mi. Phasellus sollicitudin justo diam.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id felis non enim faucibus lacinia. Aliquam massa mauris, interdum a ex ut, sagittis rutrum nulla. In pellentesque est at molestie fringilla. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec eu mi at velit lacinia venenatis ac nec sem. In volutpat pellentesque dui ut commodo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis sollicitudin eleifend felis non facilisis. Pellentesque leo urna, congue id auctor non, varius a nunc. Duis ultrices, odio ut hendrerit suscipit, nisi mauris dignissim mauris, nec bibendum ante neque ut augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam condimentum libero sit amet rutrum fermentum. Proin posuere condimentum odio. Aenean volutpat, ex vel tincidunt tincidunt, massa odio condimentum lectus, vel iaculis libero dolor in nisi.

Curabitur bibendum tempor mi, vel lacinia nisi vulputate ac. Nulla dignissim consectetur nisl nec tincidunt. Etiam pharetra facilisis sapien, non gravida velit fermentum sed. Ut ac ultrices nunc, in vestibulum urna. Suspendisse accumsan euismod felis, sit amet rhoncus neque volutpat luctus. Aliquam tincidunt pellentesque mauris, sed tempus diam. Mauris in elit eget justo tempor suscipit.

Aenean suscipit arcu ac leo tincidunt tempus. Donec maximus tellus libero, ac ullamcorper magna lobortis ac. Integer mollis nisl vitae magna gravida, nec ornare ex consectetur. Sed mattis tincidunt nisi, at consequat tellus malesuada non. Integer vel semper nisi, ut fringilla velit. Nam felis ex, congue non dui vitae, sollicitudin convallis turpis. Phasellus porttitor maximus turpis, in varius nibh fermentum aliquam. Cras finibus lacus non diam porttitor porttitor. Nulla fringilla sagittis nibh nec condimentum. Duis egestas mauris nec dolor hendrerit ullamcorper sit amet in mi. Phasellus sollicitudin justo diam.

## Understand key concepts

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id felis non enim faucibus lacinia. Aliquam massa mauris, interdum a ex ut, sagittis rutrum nulla. In pellentesque est at molestie fringilla. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec eu mi at velit lacinia venenatis ac nec sem. In volutpat pellentesque dui ut commodo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis sollicitudin eleifend felis non facilisis. Pellentesque leo urna, congue id auctor non, varius a nunc. Duis ultrices, odio ut hendrerit suscipit, nisi mauris dignissim mauris, nec bibendum ante neque ut augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam condimentum libero sit amet rutrum fermentum. Proin posuere condimentum odio. Aenean volutpat, ex vel tincidunt tincidunt, massa odio condimentum lectus, vel iaculis libero dolor in nisi.

Curabitur bibendum tempor mi, vel lacinia nisi vulputate ac. Nulla dignissim consectetur nisl nec tincidunt. Etiam pharetra facilisis sapien, non gravida velit fermentum sed. Ut ac ultrices nunc, in vestibulum urna. Suspendisse accumsan euismod felis, sit amet rhoncus neque volutpat luctus. Aliquam tincidunt pellentesque mauris, sed tempus diam. Mauris in elit eget justo tempor suscipit.

Aenean suscipit arcu ac leo tincidunt tempus. Donec maximus tellus libero, ac ullamcorper magna lobortis ac. Integer mollis nisl vitae magna gravida, nec ornare ex consectetur. Sed mattis tincidunt nisi, at consequat tellus malesuada non. Integer vel semper nisi, ut fringilla velit. Nam felis ex, congue non dui vitae, sollicitudin convallis turpis. Phasellus porttitor maximus turpis, in varius nibh fermentum aliquam. Cras finibus lacus non diam porttitor porttitor. Nulla fringilla sagittis nibh nec condimentum. Duis egestas mauris nec dolor hendrerit ullamcorper sit amet in mi. Phasellus sollicitudin justo diam.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id felis non enim faucibus lacinia. Aliquam massa mauris, interdum a ex ut, sagittis rutrum nulla. In pellentesque est at molestie fringilla. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec eu mi at velit lacinia venenatis ac nec sem. In volutpat pellentesque dui ut commodo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis sollicitudin eleifend felis non facilisis. Pellentesque leo urna, congue id auctor non, varius a nunc. Duis ultrices, odio ut hendrerit suscipit, nisi mauris dignissim mauris, nec bibendum ante neque ut augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam condimentum libero sit amet rutrum fermentum. Proin posuere condimentum odio. Aenean volutpat, ex vel tincidunt tincidunt, massa odio condimentum lectus, vel iaculis libero dolor in nisi.

Curabitur bibendum tempor mi, vel lacinia nisi vulputate ac. Nulla dignissim consectetur nisl nec tincidunt. Etiam pharetra facilisis sapien, non gravida velit fermentum sed. Ut ac ultrices nunc, in vestibulum urna. Suspendisse accumsan euismod felis, sit amet rhoncus neque volutpat luctus. Aliquam tincidunt pellentesque mauris, sed tempus diam. Mauris in elit eget justo tempor suscipit.

Aenean suscipit arcu ac leo tincidunt tempus. Donec maximus tellus libero, ac ullamcorper magna lobortis ac. Integer mollis nisl vitae magna gravida, nec ornare ex consectetur. Sed mattis tincidunt nisi, at consequat tellus malesuada non. Integer vel semper nisi, ut fringilla velit. Nam felis ex, congue non dui vitae, sollicitudin convallis turpis. Phasellus porttitor maximus turpis, in varius nibh fermentum aliquam. Cras finibus lacus non diam porttitor porttitor. Nulla fringilla sagittis nibh nec condimentum. Duis egestas mauris nec dolor hendrerit ullamcorper sit amet in mi. Phasellus sollicitudin justo diam.

## Additional resources

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id felis non enim faucibus lacinia. Aliquam massa mauris, interdum a ex ut, sagittis rutrum nulla. In pellentesque est at molestie fringilla. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec eu mi at velit lacinia venenatis ac nec sem. In volutpat pellentesque dui ut commodo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis sollicitudin eleifend felis non facilisis. Pellentesque leo urna, congue id auctor non, varius a nunc. Duis ultrices, odio ut hendrerit suscipit, nisi mauris dignissim mauris, nec bibendum ante neque ut augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam condimentum libero sit amet rutrum fermentum. Proin posuere condimentum odio. Aenean volutpat, ex vel tincidunt tincidunt, massa odio condimentum lectus, vel iaculis libero dolor in nisi.

Curabitur bibendum tempor mi, vel lacinia nisi vulputate ac. Nulla dignissim consectetur nisl nec tincidunt. Etiam pharetra facilisis sapien, non gravida velit fermentum sed. Ut ac ultrices nunc, in vestibulum urna. Suspendisse accumsan euismod felis, sit amet rhoncus neque volutpat luctus. Aliquam tincidunt pellentesque mauris, sed tempus diam. Mauris in elit eget justo tempor suscipit.

Aenean suscipit arcu ac leo tincidunt tempus. Donec maximus tellus libero, ac ullamcorper magna lobortis ac. Integer mollis nisl vitae magna gravida, nec ornare ex consectetur. Sed mattis tincidunt nisi, at consequat tellus malesuada non. Integer vel semper nisi, ut fringilla velit. Nam felis ex, congue non dui vitae, sollicitudin convallis turpis. Phasellus porttitor maximus turpis, in varius nibh fermentum aliquam. Cras finibus lacus non diam porttitor porttitor. Nulla fringilla sagittis nibh nec condimentum. Duis egestas mauris nec dolor hendrerit ullamcorper sit amet in mi. Phasellus sollicitudin justo diam.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id felis non enim faucibus lacinia. Aliquam massa mauris, interdum a ex ut, sagittis rutrum nulla. In pellentesque est at molestie fringilla. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec eu mi at velit lacinia venenatis ac nec sem. In volutpat pellentesque dui ut commodo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis sollicitudin eleifend felis non facilisis. Pellentesque leo urna, congue id auctor non, varius a nunc. Duis ultrices, odio ut hendrerit suscipit, nisi mauris dignissim mauris, nec bibendum ante neque ut augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam condimentum libero sit amet rutrum fermentum. Proin posuere condimentum odio. Aenean volutpat, ex vel tincidunt tincidunt, massa odio condimentum lectus, vel iaculis libero dolor in nisi.

Curabitur bibendum tempor mi, vel lacinia nisi vulputate ac. Nulla dignissim consectetur nisl nec tincidunt. Etiam pharetra facilisis sapien, non gravida velit fermentum sed. Ut ac ultrices nunc, in vestibulum urna. Suspendisse accumsan euismod felis, sit amet rhoncus neque volutpat luctus. Aliquam tincidunt pellentesque mauris, sed tempus diam. Mauris in elit eget justo tempor suscipit.

Aenean suscipit arcu ac leo tincidunt tempus. Donec maximus tellus libero, ac ullamcorper magna lobortis ac. Integer mollis nisl vitae magna gravida, nec ornare ex consectetur. Sed mattis tincidunt nisi, at consequat tellus malesuada non. Integer vel semper nisi, ut fringilla velit. Nam felis ex, congue non dui vitae, sollicitudin convallis turpis. Phasellus porttitor maximus turpis, in varius nibh fermentum aliquam. Cras finibus lacus non diam porttitor porttitor. Nulla fringilla sagittis nibh nec condimentum. Duis egestas mauris nec dolor hendrerit ullamcorper sit amet in mi. Phasellus sollicitudin justo diam.

{% endcapture %}

{% include templates/user-journey-content.md %}
