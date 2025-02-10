---
title: " Deploying to Multiple Kubernetes Clusters with kit "
date: 2016-09-06
slug: deploying-to-multiple-kubernetes-with-kit
url: /blog/2016/09/Deploying-To-Multiple-Kubernetes-With-Kit
author: >
  Chesley Brown (InVision)
---

Our Docker journey at InVision may sound familiar. We started with Docker in our development environments, trying to get consistency there first. We wrangled our legacy monolith application into Docker images and streamlined our Dockerfiles to minimize size and amp the efficiency. Things were looking good. Did we learn a lot along the way? For sure. But at the end of it all, we had our entire engineering team working with Docker locally for their development environments. Mission accomplished! Well, not quite. Development was one thing, but moving to production was a whole other ballgame.  

**Along Came Kubernetes**  

Kubernetes came into our lives during our evaluation of orchestrators and schedulers last December. AWS ECS was still fresh and Docker had just released 1.9 (networking overlay release). We spent the month evaluating our choices, narrowing it down to native Docker tooling (Machine, Swarm, Compose), ECS and Kubernetes. Well, needless to say, Kubernetes was our clear winner and we started the new year moving headlong to leverage Kubernetes to get us to production. But it wasn't long when we ran into a tiny complication...  

**Automated Deployments With A Catch**  

Here at [InVision](https://www.invisionapp.com/), we have a unique challenge. We just don’t have a single production environment running Kubernetes, but several, all needing automated updates via our CI/CD process. And although the code running on these environments was similar, the configurations were not. Things needed to work smoothly, automatically, as we couldn't afford to add friction to the deploy process or encumber our engineering teams.  

Having several near duplicate clusters could easily turn into a Kubernetes manifest nightmare. Anti-patterns galore, as we copy and paste 95% of the manifests to get a new cluster. Scalable? No. Headache? Yes. Keeping those manifests up-to-date and accurate would be a herculean (and error-prone) task. We needed something easier, something that allows reuse, keeping the maintenance low, and that we could incorporate into our CI/CD system.  

So after looking for a project or tooling that could fit our needs, we came up empty. At InVision, we love to create tools to help us solve problems, and figuring we may not be the only team in this situation we decided to roll up our sleeves and created something of our own. The result is our open-source tool, kit! (short for Kubernetes + git)  

**Hello kit!**  

[![](https://raw.githubusercontent.com/InVisionApp/kit/master/media/kit-logo-horz-sm.png)](https://raw.githubusercontent.com/InVisionApp/kit/master/media/kit-logo-horz-sm.png)

[kit](https://github.com/InVisionApp/kit) is a suite of components that, when plugged into your CI/CD system and source control, allows you to continuously deploy updates (or entirely new services!) to as many clusters as needed, all leveraging webhooks and without having to host an external service.  

Using kit’s templating format, you can define your service files once and have them reused across multiple clusters. It works by building on top of your usual Kubernetes manifest files allowing them to be defined once and then reused across clusters by only defining the unique configuration needed for that specific cluster. This allows you to easily build the orchestration for your application and deploy it to as many clusters as needed. It also allows the ability to group variations of your application so you could have clusters that run the “development” version of your application while others run the “production” version and so on.  

Developers simply commit code to their branches as normal and kit deploys to all clusters running that service. Kit then manages updating the image and tag that is used for a given service directly to the repository containing all your kit manifest templates. This means any and all changes to your clusters, from environment variables, or configurations to image updates are all tracked under source control history providing you with an audit trail for every cluster you have.  

We made all of this Open Source so you can [check out the kit repo](https://github.com/InVisionApp/kit)!  

**Is kit Right For Us?**  

If you are running Kubernetes across several clusters (or namespaces) all needing to continuously deploy, you bet! Because using kit doesn’t require hosting any external server, your team can leverage the webhooks you probably already have with github and your CI/CD system to get started. From there you create a repo to host your Kubernetes manifest files which tells what services are deployed to which clusters. Complexity of these files is greatly simplified thanks to kit’s templating engine.The kit-image-deployer component is incorporated into the CI/CD process and whenever a developer commits code to master and the build passes, it’s automatically deployed to all configured clusters.  

**So What Are The Components?**  
[![](https://4.bp.blogspot.com/-BdD0AgQKFWY/V87u5p7uw2I/AAAAAAAAArM/Z6_279MSn2AVDmO192GtPPTuVBbLgsHCQCLcB/s640/kit.png)](https://4.bp.blogspot.com/-BdD0AgQKFWY/V87u5p7uw2I/AAAAAAAAArM/Z6_279MSn2AVDmO192GtPPTuVBbLgsHCQCLcB/s1600/kit.png)  
kit is comprised of several components each building on the next. The general flow is a developer commits code to their repository, an image is built and then kit-image-deployer commits the new image and tag to your manifests repository. From there the kit-deploymentizer runs, parsing all your manifest templates to generate the raw Kubernetes manifest files. Finally the kit-deployer runs and takes all the built manifest files and deploys them to all the appropriate clusters. Here is a summary of the components and the flow:  

**[kit-image-deployer](https://github.com/InVisionApp/kit-image-deployer)**  
A service that can be used to update given yaml files within a git repository with a new Docker image path. This can be used in collaboration with kit-deploymentizer and kit-deployer to automatically update the images used for a service across multiple clusters.  

[**kit-deploymentizer**](https://github.com/InVisionApp/kit-deploymentizer)  
This service intelligently builds deployment files as to allow reusability of environment variables and other forms of configuration. It also supports aggregating these deployments for multiple clusters. In the end, it generates a list of clusters and a list of deployment files for each of these clusters. Best used in collaboration with kit-deployer and kit-image-deployer to achieve a continuous deployment workflow.  

[**kit-deployer**](https://github.com/InVisionApp/kit-deployer)  
Use this service to deploy files to multiple Kubernetes clusters. Just organize your manifest files into directories that match the names of your clusters (the name defined in your kubeconfig files). Then you provide a directory of kubeconfig files and the kit-deployer will asynchronously send all manifests up to their corresponding clusters.  

**So What's Next?**  

In the near future, we want to make deployments even smarter so as to handle updating things like mongo replicasets. We also want to add in smart monitoring to further improve on the self-healing nature of Kubernetes. We’re also working on adding additional integrations (such as Slack) and notification methods. And most importantly we’re working towards shifting more control to the individual developers of each service by allowing the kit manifest templates to exist in each individual service repository instead of a single master manifest repository. This will allow them to manage their service completely from development straight to production across all clusters.  

We hope you take a closer look at [kit](https://github.com/InVisionApp/kit) and tell us what you think! Check out our [InVision Engineering](http://engineering.invisionapp.com/) blog for more posts about the cool things we are up to at InVision. If you want to work on kit or other interesting things like this, click through to [our jobs page](https://www.invisionapp.com/company#jobs). We'd love to hear from you!  




- [Download](http://get.k8s.io/) Kubernetes
- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Connect with the community on [Slack](http://slack.k8s.io/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
