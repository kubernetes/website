---
title: " Minikube: easily run Kubernetes locally  "
date: 2016-07-11
slug: minikube-easily-run-kubernetes-locally
url: /blog/2016/07/Minikube-Easily-Run-Kubernetes-Locally
author: >
  Dan Lorenc (Google)
---
_**Editor's note:**  This is the first post in a [series of in-depth articles](/blog/2016/07/five-days-of-kubernetes-1-3) on what's new in Kubernetes 1.3_

While Kubernetes is one of the best tools for managing containerized applications available today, and has been production-ready for over a year, Kubernetes has been missing a great local development platform.  

For the past several months, several of us from the Kubernetes community have been working to fix this in the [Minikube](http://github.com/kubernetes/minikube) repository on GitHub. Our goal is to build an easy-to-use, high-fidelity Kubernetes distribution that can be run locally on Mac, Linux and Windows workstations and laptops with a single command.  

Thanks to lots of help from members of the community, we're proud to announce the official release of Minikube. This release comes with support for [Kubernetes 1.3](https://kubernetes.io/blog/2016/07/kubernetes-1-3-bridging-cloud-native-and-enterprise-workloads/), new commands to make interacting with your local cluster easier and experimental drivers for xhyve (on macOS) and KVM (on Linux).

**Using Minikube**  

Minikube ships as a standalone Go binary, so installing it is as simple as downloading Minikube and putting it on your path:  

Minikube currently requires that you have VirtualBox installed, which you can download&nbsp;[here](https://www.virtualbox.org/).  



_(This is for Mac, for Linux substitute “minikube-darwin-amd64” with “minikube-linux-amd64”)_curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64 && chmod +x minikube && sudo mv minikube /usr/local/bin/_




To start a Kubernetes cluster in Minikube, use the `minikube start` command:





```
$ minikube start

Starting local Kubernetes cluster...

Kubernetes is available at https://192.168.99.100:443

Kubectl is now configured to use the cluster
```





 ![](https://lh5.googleusercontent.com/UNRbuyrACtW32dxMehR7GaQlj4CaVxVmlw3UhTqzyIDBgENdT1PcXf-3RoW-T1PFhIQtBbIPq1p544NAKFMO_E_1BUx7MBpkRyw6URtv4W0xT-O4tyWDYJf3MYna6a_8cFJnVvXZ)


At this point, you have a running single-node Kubernetes cluster on your laptop! Minikube also configures `kubectl` for you, so you're also ready to run containers with no changes.



Minikube creates a Host-Only network interface that routes to your node. To interact with running pods or services, you should send traffic over this address. To find out this address, you can use the `minikube ip` command:

 ![](https://lh4.googleusercontent.com/Qm-FoMGXGTlyhiM9jzuH6HE3497ZH19gjDMZrkNVhrlJzi9KQXlGCPoWbss-Hxa3fSBTbgxVZYjUpK-EG4rSinHHGz-7xH9e0QsmE72gX6Mzn5FihvFBfeF6_pJugd1GT0Gzp5qb)





Minikube also comes with the Kubernetes Dashboard. To open this up in your browser, you can use the built-in `minikube dashboard` command:


 ![](https://lh5.googleusercontent.com/PZOe7HAMTJoO_U-r6mR8bXJc7pRIaw33BSQ_SafMY-DPSJB5tiw9SooUvCbtOCJEqQqvnHqngDfFJwWy9Oj3svyo8oTQnzy5srKwZEcBh7fm44n_9YImeJEGhvfNVnx0cfjZ7mcU)

 ![](https://lh3.googleusercontent.com/fshhlXr1e39gsMKWbVUGb7rrGcy4uP44ML3Jt7-Sr3ZryoMw802xpkAMaz7ayjQNGtAYl3wpKJgwfefuug1FWHbinr1usN9jwFIAJFKeVeZxaiKtalHXP322_D5otR0Asvw6MUD_)





In general, Minikube supports everything you would expect from a Kubernetes cluster. You can use `kubectl exec` to get a bash shell inside a pod in your cluster. You can use the `kubectl port-forward` and `kubectl proxy` commands to forward traffic from localhost to a pod or the API server.




Since Minikube is running locally instead of on a cloud provider, certain provider-specific features like LoadBalancers and PersistentVolumes will not work out-of-the-box. However, you can use NodePort LoadBalancers and HostPath PersistentVolumes.



**Architecture**





Minikube is built on top of Docker's&nbsp;[libmachine](https://github.com/docker/machine/tree/master/libmachine), and leverages the driver model to create, manage and interact with locally-run virtual machines.




[RedSpread](https://redspread.com/)&nbsp;was kind enough to donate their [localkube](https://github.com/redspread/localkube)&nbsp;codebase to the Minikube repo, which we use to spin up a single-process Kubernetes cluster inside a VM. Localkube bundles etcd, DNS, the Kubelet and all the Kubernetes master components into a single Go binary, and runs them all via separate goroutines.



**Upcoming Features**



Minikube has been a lot of fun to work on so far, and we're always looking to improve Minikube to make the Kubernetes development experience better. If you have any ideas for features, don't hesitate to let us know in the [issue tracker](https://github.com/kubernetes/minikube/issues).&nbsp;



Here's a list of some of the things we're hoping to add to Minikube soon:



- Native hypervisor support for macOS and Windows
- We're planning to remove the dependency on Virtualbox, and integrate with the native hypervisors included in macOS and Windows (Hypervisor.framework and Hyper-v, respectively).
- Improved support for Kubernetes features
- We're planning to increase the range of supported Kubernetes features, to include things like Ingress.
- Configurable versions of Kubernetes
- Today Minikube only supports Kubernetes 1.3. We're planning to add support for user-configurable versions of Kubernetes, to make it easier to match what you have running in production on your laptop.




**Community**  



We'd love to hear feedback on Minikube. To join the community:

- Post issues or feature requests on [GitHub](https://github.com/kubernetes/minikube)
- Join us in the #minikube channel on [Slack](https://kubernetes.slack.com/)

Please give Minikube a try, and let us know how it goes!

