---
title: " Dashboard - Full Featured Web Interface for Kubernetes "
date: 2016-07-15
slug: dashboard-web-interface-for-kubernetes
url: /blog/2016/07/Dashboard-Web-Interface-For-Kubernetes
author: >
  Piotr Bryk (Google)
---

_**Editor's note:** this post is part of a [series of in-depth articles](/blog/2016/07/five-days-of-kubernetes-1-3) on what's new in Kubernetes 1.3_

[Kubernetes Dashboard](http://github.com/kubernetes/dashboard) is a project that aims to bring a general purpose monitoring and operational web interface to the Kubernetes world.&nbsp;Three months ago we [released](https://kubernetes.io/blog/2016/04/building-awesome-user-interfaces-for-kubernetes) the first production ready version, and since then the dashboard has made massive improvements. In a single UI, you’re able to perform majority of possible interactions with your Kubernetes clusters without ever leaving your browser. This blog post breaks down new features introduced in the latest release and outlines the roadmap for the future.&nbsp;  

**Full-Featured Dashboard**  

Thanks to a large number of contributions from the community and project members, we were able to deliver many new features for [Kubernetes 1.3 release](https://kubernetes.io/blog/2016/07/kubernetes-1-3-bridging-cloud-native-and-enterprise-workloads/). We have been carefully listening to all the great feedback we have received from our users (see the [summary infographics](http://static.lwy.io/img/kubernetes_dashboard_infographic.png)) and addressed the highest priority requests and pain points.

The Dashboard UI now handles all workload resources. This means that no matter what workload type you run, it is visible in the web interface and you can do operational changes on it. For example, you can modify your stateful MySQL installation with [Pet Sets](/docs/user-guide/petset/), do a rolling update of your web server with Deployments or install cluster monitoring with DaemonSets.&nbsp;  



 [![](https://lh3.googleusercontent.com/p9bMGxPx4jE6_Z2KB-MktmyuAxyFst-bEk29M_Bn0Bj5ul7uzinH6u5WjHsMmqhGvBwlABZt06dwQ5qkBZiLq_EM1oddCmpwChvXDNXZypaS5l8uzkKuZj3PBUmzTQT4dgDxSXgz) ](https://lh3.googleusercontent.com/p9bMGxPx4jE6_Z2KB-MktmyuAxyFst-bEk29M_Bn0Bj5ul7uzinH6u5WjHsMmqhGvBwlABZt06dwQ5qkBZiLq_EM1oddCmpwChvXDNXZypaS5l8uzkKuZj3PBUmzTQT4dgDxSXgz)



In addition to viewing resources, you can create, edit, update, and delete them. This feature enables many use cases. For example, you can kill a failed Pod, do a rolling update on a Deployment, or just organize your resources. You can also export and import YAML configuration files of your cloud apps and store them in a version control system.



 ![](https://lh6.googleusercontent.com/zz-qjNcGgvWXrK1LIipUdIdPyeWJ1EyPVJxRnSvI6pMcLBkxDxpQt-ObsIiZsS_X0RjVBWtXYO5TCvhsymb__CGXFzKuPUnUrB4HKnAMsxtYdWLwMmHEb8c9P9Chzlo5ePHRKf5O)



The release includes a beta view of cluster nodes for administration and operational use cases. The UI lists all nodes in the cluster to allow for overview analysis and quick screening for problematic nodes. The details view shows all information about the node and links to pods running on it.



 ![](https://lh6.googleusercontent.com/3CSTUy-8Tz-yAL9tCqxNUqMcWJYKK0dwk7kidE9zy-L-sXFiD4A4Y2LKEqbJKgI6Fl6xbzYxsziI8dULVXPJbu6eU0ci7hNtqi3tTuhdbVD6CG3EXw151fvt2MQuqumHRbab6g-_)



There are also many smaller scope new features that the we shipped with the release, namely: support for namespaced resources, internationalization, performance improvements, and many bug fixes (find out more in the [release notes](https://github.com/kubernetes/dashboard/releases/tag/v1.1.0)). All these improvements result in a better and simpler user experience of the product.



**Future Work**



The team has ambitious plans for the future spanning across multiple use cases. We are also open to all feature requests, which you can post on our [issue tracker](https://github.com/kubernetes/dashboard/issues).



Here is a list of our focus areas for the following months:

- [Handle more Kubernetes resources](https://github.com/kubernetes/dashboard/issues/961) - To show all resources that a cluster user may potentially interact with. Once done, Dashboard can act as a complete replacement for CLI.&nbsp;
- [Monitoring and troubleshooting](https://github.com/kubernetes/dashboard/issues/962) - To add resource usage statistics/graphs to the objects shown in Dashboard. This focus area will allow for actionable debugging and troubleshooting of cloud applications.
- [Security, auth and logging in](https://github.com/kubernetes/dashboard/issues/964) - Make Dashboard accessible from networks external to a Cluster and work with custom authentication systems.



**Connect With Us**



We would love to talk with you and hear your feedback!

- Email us at the [SIG-UI mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-ui)
- Chat with us on the Kubernetes Slack&nbsp;[#SIG-UI channel](https://kubernetes.slack.com/messages/sig-ui/)
- Join our meetings: 4PM CEST. See the [SIG-UI calendar](https://calendar.google.com/calendar/embed?src=google.com_52lm43hc2kur57dgkibltqc6kc%40group.calendar.google.com&ctz=Europe/Warsaw) for details.
