---
title: " How we improved Kubernetes Dashboard UI in 1.4 for your production needs​ "
date: 2016-10-03
slug: production-kubernetes-dashboard-ui-1.4-improvements_3
url: /blog/2016/10/Production-Kubernetes-Dashboard-UI-1-4-improvements_3
author: >
  Dan Romlein (Apprenda)
---
With the release of [Kubernetes 1.4](https://kubernetes.io/blog/2016/09/kubernetes-1-4-making-it-easy-to-run-on-kuberentes-anywhere/) last week, Dashboard – the official web UI for Kubernetes – has a number of exciting updates and improvements of its own. The past three months have been busy ones for the Dashboard team, and we’re excited to share the resulting features of that effort here. If you’re not familiar with Dashboard, the [GitHub repo](https://github.com/kubernetes/dashboard#kubernetes-dashboard) is a great place to get started.

A quick recap before unwrapping our shiny new features: Dashboard was initially released March 2016. One of the focuses for Dashboard throughout its lifetime has been the onboarding experience; it’s a less intimidating way for Kubernetes newcomers to get started, and by showing multiple resources at once, it provides contextualization lacking in [kubectl](/docs/user-guide/kubectl-overview/) (the CLI). After that initial release though, the product team realized that fine-tuning for a beginner audience was getting ahead of ourselves: there were still fundamental product requirements that Dashboard needed to satisfy in order to have a productive UX to onboard new users too. That became our mission for this release: closing the gap between Dashboard and kubectl by showing more resources, leveraging a web UI’s strengths in monitoring and troubleshooting, and architecting this all in a user friendly way.  

**Monitoring Graphs**  
Real time visualization is a strength that UI’s have over CLI’s, and with 1.4 we’re happy to capitalize on that capability with the introduction of real-time CPU and memory usage graphs for all workloads running on your cluster. Even with the numerous third-party solutions for monitoring, Dashboard should include at least some basic out-of-the box functionality in this area. Next up on the roadmap for graphs is extending the timespan the graph represents, adding drill-down capabilities to reveal more details, and improving the UX of correlating data between different graphs.  


[![](https://lh5.googleusercontent.com/q2xNqiQkdcaAY9UdAlxXJkhofpb-AwMKoxE8Jdd3qRB0v8qffi4_s8GUaszmYGclNemAWCrEmbTqegKPfRoUgYHy9aRAYILXqRX1BCdLBQCUGHd-Euv0PuT5VI9viT3iSXBRHshv)](https://lh5.googleusercontent.com/q2xNqiQkdcaAY9UdAlxXJkhofpb-AwMKoxE8Jdd3qRB0v8qffi4_s8GUaszmYGclNemAWCrEmbTqegKPfRoUgYHy9aRAYILXqRX1BCdLBQCUGHd-Euv0PuT5VI9viT3iSXBRHshv)



**Logs**  
Based on user research with Kubernetes’ predecessor&nbsp;[Borg](http://research.google.com/pubs/pub43438.html)&nbsp;and continued community feedback, we know logs are tremendously important to users. For this reason we’re constantly looking for ways to improve these features in Dashboard. This release includes a fix for an issue wherein large numbers of logs would crash the system, as well as the introduction of the ability to view logs by date.  

**Showing More Resources**  
The previous release brought all workloads to Dashboard: Pods, Pet Sets, Daemon Sets, Replication Controllers, Replica Set, Services, & Deployments. With 1.4, we expand upon that set of objects by including Services, Ingresses, Persistent Volume Claims, Secrets, & ConfigMaps. We’ve also introduced an “Admin” section with the Namespace-independent global objects of Namespaces, Nodes, and Persistent Volumes. With the addition of roles, these will be shown only to cluster operators, and developers’ side nav will begin with the Namespace dropdown.  

Like glue binding together a loose stack of papers into a book, we needed some way to impose order on these resources for their value to be realized, so one of the features we’re most excited to announce in 1.4 is navigation.  

**Navigation**  
In 1.1, all resources were simply stacked on top of each other in a single page. The introduction of a side nav provides quick access to any aspect of your cluster you’d like to check out. Arriving at this solution meant a lot of time put toward thinking about the hierarchy of Kubernetes objects – a difficult task since by design things fit together more like a living organism than a nested set of linear relationships. The solution we’ve arrived at balances the organizational need for grouping and desire to retain a bird’s-eye view of as much relevant information as possible. The design of the side nav is simple and flexible, in order to accommodate more resources in the future. Its top level objects (e.g. “Workloads”, “Services and Discovery”) roll up their child objects and will eventually include aggregated data for said objects.  



[![](https://lh4.googleusercontent.com/wam1i4Y3GGLwNFxynWYK17me9UDCaw3yo0dDqqTt7Y79bJ5YK7uHd3yreRnftPOtRkOvo-CjlWNPEx2raBdCN5JTxG2fU3fwqeIPsDaeuqhnWl0IrSYQ32uC7cVt2q51LQNhialX)](https://lh4.googleusercontent.com/wam1i4Y3GGLwNFxynWYK17me9UDCaw3yo0dDqqTt7Y79bJ5YK7uHd3yreRnftPOtRkOvo-CjlWNPEx2raBdCN5JTxG2fU3fwqeIPsDaeuqhnWl0IrSYQ32uC7cVt2q51LQNhialX)



**Closer Alignment with Material Design**  
Dashboard follows Google’s [Material design](https://material.google.com/) system, and the implementation of those principles is refined in the new UI: the global create options have been reduced from two choices to one initial “Create” button, the official Kubernetes logo is displayed as an SVG rather than simply as text, and cards were introduced to help better group different types of content (e.g. a table of Replication Controllers and a table of Pods on your “Workloads” page). Material’s guidelines around desktop-focused enterprise-level software are currently limited (and instead focus on a mobile-first context), so we’ve had to improvise with some aspects of the UI and have worked closely with the UX team at Google Cloud Platform to do this – drawing on their expertise in implementing Material in a more information-dense setting.  

**Sample Use Case**  
To showcase Dashboard 1.4’s new suite of features and how they’ll make users’ lives better in the real world, let’s imagine the following scenario:  

I am a cluster operator and a customer pings me warning that their app, Kubernetes Dashboard, is suffering performance issues. My first step in addressing the issue is to switch to the correct Namespace, kube-system, to examine what could be going on.  



 ![](https://lh5.googleusercontent.com/R95VuEQ8GkjTTeJXX-4EE-f-oD4UXYCPGZ5et4YYLuUiB0K3hXSndyFPYHmrKeySBc2t3tMy4B9mT-dr8rIr0WRQLq4Bhe6ygA4GqNLSYvvZcsmdGxeozw3jr8fSDCinG0NSsAjp)

Once in the relevant Namespace, I check out my Deployments to see if anything seems awry. Sure enough, I notice a spike in CPU usage.  

 ![](https://lh5.googleusercontent.com/rViAg6xFe219i7qxeBRU62-1SFBLI6VIg3pbU5HBmvIKsb3KJFr5RldP0vziVXao3u-hWM3EMvzTNnSFRQWCTViaQiVbAv_PTjd87s7GOZelroeL4gjcfFU3JljrOKKnWL3Wzy5c)

I realize we need to perform a rolling update to a newer version of that app that can handle the increased requests it’s evidently getting, so I update this Deployment’s image, which in turn creates a new [Replica Set](/docs/user-guide/replicasets/).  



 ![](https://lh4.googleusercontent.com/RdA8N8LPDwnAb-RDX4MHNmHvxc8YRlID79-5WmGJQb7NYuz8oZseVorzATQZWOTTQ_-yp8roniNKuBqmQewzYzyvBRdHcQf_VENm2Qqde0v6LW9-L1FLmqsUx8h9Z5RYfpD_alXx)

Now that Replica Set’s been created, I can open the logs for one of its pods to confirm that it’s been successfully connected to the API server.  



 ![](https://lh3.googleusercontent.com/zg_lrCL0kH7ai6ZUGz4YKwIfQpwLXnF-mvK9UUL3TZ4ryNLSCSW7Anha5VjoEdwlkSp8-Fhgz16srzPTpoHzguwrGllPp10m2O_rFAfm2W1tq_5ow4FzfAwYVM4Sm1-HuMtcDY34)

Easy as that, we’ve debugged our issue. Dashboard provided us a centralized location to scan for the origin of the problem, and once we had that identified we were able to drill down and address the root of the problem.  

**Why the Skipped Versions?**  
If you’ve been following along with Dashboard since 1.0, &nbsp;you may have been confused by the jump in our versioning; we went 1.0, 1.1...1.4. We did this to synchronize with the main Kubernetes distro, and hopefully going forward this will make that relationship easier to understand.  

**There’s a Lot More Where That Came From**  
Dashboard is gaining momentum, and these early stages are a very exciting and rewarding time to be involved. If you’d like to learn more about contributing, check out [SIG UI](https://github.com/kubernetes/community/blob/master/sig-ui/README.md). Chat with us Kubernetes Slack: [#sig-ui channel](https://kubernetes.slack.com/messages/sig-ui/).  




- [Download](http://get.k8s.io/) Kubernetes
- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)&nbsp;
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)&nbsp;
- Connect with the community on [Slack](http://slack.k8s.io/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
