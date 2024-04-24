---
title: " How Qbox Saved 50% per Month on AWS Bills Using Kubernetes and Supergiant "
date: 2016-09-27
slug: how-qbox-saved-50-percent-on-aws-bills
url: /blog/2016/09/How-Qbox-Saved-50-Percent-On-Aws-Bills
---
_Editor’s Note: Today’s post is by the team at Qbox, a hosted Elasticsearch provider sharing their experience with Kubernetes and how it helped save them fifty-percent off their cloud bill.&nbsp;_  

A little over a year ago, we at Qbox faced an existential problem. Just about all of the major IaaS providers either launched or acquired services that competed directly with our [Hosted Elasticsearch](https://qbox.io/) service, and many of them started offering it for free. The race to zero was afoot unless we could re-engineer our infrastructure to be more performant, more stable, and less expensive than the VM approach we had had before, and the one that is in use by our IaaS brethren. With the help of Kubernetes, Docker, and Supergiant (our own hand-rolled layer for managing distributed and stateful data), we were able to deliver 50% savings, a mid-five figure sum. At the same time, support tickets plummeted. We were so pleased with the results that we decided to [open source Supergiant](https://github.com/supergiant/supergiant) as its own standalone product. This post will demonstrate how we accomplished it.  

Back in 2013, when not many were even familiar with Elasticsearch, we launched our as-a-service offering with a dedicated, direct VM model. We hand-selected certain instance types optimized for Elasticsearch, and users configured single-tenant, multi-node clusters running on isolated virtual machines in any region. We added a markup on the per-compute-hour price for the DevOps support and monitoring, and all was right with the world for a while as Elasticsearch became the global phenomenon that it is today.  

**Background**  
As we grew to thousands of clusters, and many more thousands of nodes, it wasn’t just our AWS bill getting out of hand. We had 4 engineers replacing dead nodes and answering support tickets all hours of the day, every day. What made matters worse was the volume of resources allocated compared to the usage. We had thousands of servers with a collective CPU utilization under 5%. We were spending too much on processors that were doing absolutely nothing.&nbsp;  

How we got there was no great mystery. VM’s are a finite resource, and with a very compute-intensive, burstable application like Elasticsearch, we would be juggling the users that would either undersize their clusters to save money or those that would over-provision and overspend. When the aforementioned competitive pressures forced our hand, we had to re-evaluate everything.  

**Adopting Docker and Kubernetes**  
Our team avoided Docker for a while, probably on the vague assumption that the network and disk performance we had with VMs wouldn't be possible with containers. That assumption turned out to be entirely wrong.  

To run performance tests, we had to find a system that could manage networked containers and volumes. That's when we discovered Kubernetes. It was alien to us at first, but by the time we had familiarized ourselves and built a performance testing tool, we were sold. It was not just as good as before, it was better.  

The performance improvement we observed was due to the number of containers we could “pack” on a single machine. Ironically, we began the Docker experiment wanting to avoid “noisy neighbor,” which we assumed was inevitable when several containers shared the same VM. However, that isolation also acted as a bottleneck, both in performance and cost. To use a real-world example, If a machine has 2 cores and you need 3 cores, you have a problem. It’s rare to come across a public-cloud VM with 3 cores, so the typical solution is to buy 4 cores and not utilize them fully.  

This is where Kubernetes really starts to shine. It has the concept of [requests and limits](/docs/user-guide/compute-resources/), which provides granular control over resource sharing. Multiple containers can share an underlying host VM without the fear of “noisy neighbors”. They can request exclusive control over an amount of RAM, for example, and they can define a limit in anticipation of overflow. It’s practical, performant, and cost-effective multi-tenancy. We were able to deliver the best of both the single-tenant and multi-tenant worlds.  

**Kubernetes + Supergiant**  
We built [Supergiant](https://supergiant.io/) originally for our own Elasticsearch customers. Supergiant solves Kubernetes complications by allowing pre-packaged and re-deployable application topologies. In more specific terms, Supergiant lets you use Components, which are somewhat similar to a microservice. Components represent an almost-uniform set of Instances of software (e.g., Elasticsearch, MongoDB, your web application, etc.). They roll up all the various Kubernetes and cloud operations needed to deploy a complex topology into a compact entity that is easy to manage.  

For Qbox, we went from needing 1:1 nodes to approximately 1:11 nodes. Sure, the nodes were larger, but the utilization made a substantial difference. As in the picture below, we could cram a whole bunch of little instances onto one big instance and not lose any performance. Smaller users would get the added benefit of higher network throughput by virtue of being on bigger resources, and they would also get greater CPU and RAM bursting.  

 ![sg-example.png](https://lh6.googleusercontent.com/vV7vzgS8fl-wJSTVbtE7aveWwBf2kXH348ItU0uvakWa-TeO9sJQxr9IuccNa1L9NOLqIBWEDg1ASgChjoBdeDgkiazJ0z9x4r439YukgVz3yOXcouCZXaPjMQOXjmWTm8tBBOqh)  

**Adding Up the Cost Savings**  
The [packing algorithm](https://supergiant.io/blog/supergiant-packing-algorithm-unique-save-money) in Supergiant, with its increased utilization, resulted in an immediate 25% drop in our infrastructure footprint. Remember, this came with better performance and fewer support tickets. We could dial up the packing algorithm and probably save even more money. Meanwhile, because our nodes were larger and far more predictable, we could much more fully leverage the economic goodness that is AWS Reserved Instances. We went with 1-year partial RI’s, which cut the remaining costs by 40%, give or take. Our customers still had the flexibility to spin up, down, and out their Elasticsearch nodes, without forcing us to constantly juggle, combine, split, and recombine our reservations. At the end of the day, we saved 50%. That is $600k per year that can go towards engineering salaries instead of enriching our IaaS provider.&nbsp;  




- [Download](http://get.k8s.io/) Kubernetes
- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)&nbsp;
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)&nbsp;
- Connect with the community on [Slack](http://slack.k8s.io/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
