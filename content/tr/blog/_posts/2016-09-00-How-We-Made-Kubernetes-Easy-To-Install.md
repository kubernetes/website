---
title: " How we made Kubernetes insanely easy to install "
date: 2016-09-28
slug: how-we-made-kubernetes-easy-to-install
url: /blog/2016/09/How-We-Made-Kubernetes-Easy-To-Install
author: >
  [Luke Marsden](https://twitter.com/lmarsden) (Weaveworks)  
---

Over at&nbsp;[SIG-cluster-lifecycle](https://github.com/kubernetes/community/blob/master/sig-cluster-lifecycle/README.md), we've been hard at work the last few months on kubeadm, a tool that makes Kubernetes dramatically easier to install. We've heard from users that installing Kubernetes is harder than it should be, and we want folks to be focused on writing great distributed apps not wrangling with infrastructure!  

There are three stages in setting up a Kubernetes cluster, and we decided to focus on the second two (to begin with):  

1. **Provisioning** : getting some machines
2. **Bootstrapping** : installing Kubernetes on them and configuring certificates
3. **Add-ons** : installing necessary cluster add-ons like DNS and monitoring services, a pod network, etc
We realized early on that there's enormous variety in the way that users want to **provision** their machines.  

They use lots of different cloud providers, private clouds, bare metal, or even Raspberry Pi's, and almost always have their own preferred tools for automating provisioning machines: Terraform or CloudFormation, Chef, Puppet or Ansible, or even PXE booting bare metal. So we made an important decision: **kubeadm would not provision machines**. Instead, the only assumption it makes is that the user has some [computers running Linux](/docs/getting-started-guides/kubeadm/#prerequisites).  

Another important constraint was we didn't want to just build another tool that "configures Kubernetes from the outside, by poking all the bits into place". There are many external projects out there for doing this, but we wanted to aim higher. We chose to actually improve the Kubernetes core itself to make it easier to install. Luckily, a lot of the groundwork for making this happen had already been started.  

We realized that if we made Kubernetes insanely easy to install manually, it should be obvious to users how to automate that process using any tooling.  

So, enter [kubeadm](/docs/getting-started-guides/kubeadm/). It has no infrastructure dependencies, and satisfies the requirements above. It's easy to use and should be easy to automate. It's still in **alpha** , but it works like this:  

- You install Docker and the official Kubernetes packages for you distribution.
- Select a master host, run kubeadm init.
- This sets up the control plane and outputs a kubeadm join [...] command which includes a secure token.
- On each host selected to be a worker node, run the kubeadm join [...] command from above.
- Install a pod network. [Weave Net](https://github.com/weaveworks/weave-kube) is a great place to start here. Install it using just kubectl apply -f https://git.io/weave-kube
Presto! You have a working Kubernetes cluster! [Try kubeadm today](/docs/getting-started-guides/kubeadm/).&nbsp;  

For a video walkthrough, check this out:  



Follow the&nbsp;[kubeadm getting started guide](/docs/getting-started-guides/kubeadm/) to try it yourself, and please give us [feedback on GitHub](https://github.com/kubernetes/kubernetes/issues/new), mentioning **@kubernetes/sig-cluster-lifecycle**!  

Finally, I want to give a huge shout-out to so many people in the SIG-cluster-lifecycle, without whom this wouldn't have been possible. I'll mention just a few here:  


- [Joe Beda](https://twitter.com/jbeda) kept us focused on keeping things simple for the user.
- [Mike Danese](https://twitter.com/errordeveloper) at Google has been an incredible technical lead and always knows what's happening. Mike also tirelessly kept up on the many code reviews necessary.
- [Ilya Dmitrichenko](https://twitter.com/errordeveloper), my colleague at Weaveworks, wrote most of the kubeadm code and also kindly helped other folks contribute.
- [Lucas Käldström](https://twitter.com/kubernetesonarm) from Finland has got to be the youngest contributor in the group and was merging last-minute pull requests on the Sunday night before his school math exam.
- [Brandon Philips](https://twitter.com/brandonphilips) and his team at CoreOS led the development of TLS bootstrapping, an essential component which we couldn't have done without.
- [Devan Goodwin](https://twitter.com/dgood) from Red Hat built the JWS discovery service that Joe imagined and sorted out our RPMs.
- [Paulo Pires](https://twitter.com/el_ppires) from Portugal jumped in to help out with external etcd support and picked up lots of other bits of work.
- And many other contributors!

This truly has been an excellent cross-company and cross-timezone achievement, with a lovely bunch of people. There's lots more work to do in SIG-cluster-lifecycle, so if you’re interested in these challenges join our SIG. Looking forward to collaborating with you all!  



- Try [kubeadm](/docs/getting-started-guides/kubeadm/) to install Kubernetes today
- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)&nbsp;
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)&nbsp;
- Connect with the community on [Slack](http://slack.k8s.io/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
