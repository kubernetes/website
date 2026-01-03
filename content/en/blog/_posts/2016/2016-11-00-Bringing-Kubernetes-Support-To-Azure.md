---
title: " Bringing Kubernetes Support to Azure Container Service "
date: 2016-11-07
slug: bringing-kubernetes-support-to-azure
url: /blog/2016/11/Bringing-Kubernetes-Support-To-Azure
author: >
  Brendan Burns (Microsoft)
---

With more than a thousand people coming to [KubeCon](http://events.linuxfoundation.org/events/kubecon) in my hometown of Seattle, nearly three years after I helped start the Kubernetes project, it’s amazing and humbling to see what a small group of people and a radical idea have become after three years of hard work from a large and growing community. In July of 2014, scarcely a month after Kubernetes became publicly available, Microsoft announced its initial support for Azure. The release of [Kubernetes 1.4](https://kubernetes.io/blog/2016/09/kubernetes-1-4-making-it-easy-to-run-on-kuberentes-anywhere/), brought support for native Microsoft networking, [load-balancer](https://github.com/kubernetes/kubernetes/pull/28821) and [disk integration](https://github.com/kubernetes/kubernetes/pull/29836).&nbsp;

Today, Microsoft [announced](https://azure.microsoft.com/en-us/blog/azure-container-service-the-cloud-s-most-open-option-for-containers/) the next step in Kubernetes on Azure: the introduction of Kubernetes as a supported orchestrator in Azure Container Service (ACS). It’s been really exciting for me to join the ACS team and help build this new addition. The integration of Kubernetes into ACS means that with a few clicks in the Azure portal, or by running a single command in the new python-based Azure command line tool, you will be able to create a fully functional Kubernetes cluster that is integrated with the rest of your Azure resources.

Kubernetes is available in public preview in Azure Container Service today. Community participation has always been an important part of the Kubernetes experience. Over the next few months, I hope you’ll join us and provide your feedback on the experience as we bring it to general availability.

In the spirit of community, we are also excited to announce a new open source project: [ACS Engine](https://github.com/azure/acs-engine). The goal of ACS Engine is to provide an open, community driven location to develop and share best practices for orchestrating containers on Azure. All of our knowledge of running containers in Azure has been captured in that repository, and we look forward to improving and extending it as we move forward with the community. Going forward, the templates in ACS Engine will be the basis for clusters deployed via the ACS API, and thus community driven improvements, features and more will have a natural path into the Azure Container Service. We’re excited to invite you to join us in improving ACS. Prior to the creation of ACS Engine, customers with unique requirements not supported by the ACS API needed to maintain variations on our templates. While these differences start small, they grew larger over time as the mainline template was improved and users also iterated their templates. These differences and drift really impact the ability for users to collaborate, since their templates are all different. Without the ability to share and collaborate, it’s difficult to form a community since every user is siloed in their own variant.

To solve this problem, the core of ACS Engine is a template processor, built in Go, that enables you to dynamically combine different pieces of configuration together to form a final template that can be used to build up your cluster. Thus, each user can mix and match the pieces build the final container cluster that suits their needs. At the same time, each piece can be built and maintained collaboratively by the community. We’ve been beta testing this approach with some customers and the feedback we’ve gotten so far has been really positive.

Beyond services to help you run containers on Azure, I think it’s incredibly important to improve the experience of developing and deploying containerized applications to Kubernetes. To that end, I’ve been doing a bunch of work lately to build a Kubernetes extension for the really excellent, open source, [Visual Studio Code](https://code.visualstudio.com/). The Kubernetes extension enables you to quickly deploy JSON or YAML files you are editing onto a Kubernetes cluster. Additionally, it enables you to import existing Kubernetes objects into Code for easy editing. Finally, it enables synchronization between your running containers and the source code that you are developing for easy debugging of issues you are facing in production.

But really, a demo is worth a thousand words, so please have a look at this [video](https://www.youtube.com/watch?v=nhY9XdzNbbY):





Of course, like everything else in Kubernetes it’s released as open source, and I look forward to working on it further with the community. Thanks again, I look forward to seeing everyone at the OpenShift Gathering today, as well as at the Microsoft Azure booth during KubeCon tomorrow and Wednesday. Welcome to Seattle!



- [Download](http://get.k8s.io/) Kubernetes
- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)&nbsp;
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)&nbsp;
- Connect with the community on [Slack](http://slack.k8s.io/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
