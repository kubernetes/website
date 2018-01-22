---
layout: blog
title: " Using Kubernetes Namespaces to Manage Environments "
date:  Saturday, August 28, 2015 

---
# One of the advantages that Kubernetes provides is the ability to manage various environments easier and better than traditional deployment strategies. For most nontrivial applications, you have test, staging, and production environments. You can spin up a separate cluster of resources, such as VMs, with the same configuration in staging and production, but that can be costly and managing the differences between the environments can be difficult.

  

# Kubernetes includes a cool feature called [namespaces](https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/design/namespaces.md), which enable you to manage different environments within the same cluster. For example, you can have different test and staging environments in the same cluster of machines, potentially saving resources. You can also run different types of server, batch, or other jobs in the same cluster without worrying about them affecting each other.

  

The Default Namespace

Specifying the namespace is optional in Kubernetes because by default Kubernetes uses the "default" namespace. If you've just created a cluster, you can check that the default namespace exists using this command:

$ kubectl get namespaces

NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LABELS &nbsp;&nbsp;&nbsp;STATUS

default &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\<none\> &nbsp;&nbsp;&nbsp;Active

kube-system &nbsp;&nbsp;\<none\> &nbsp;&nbsp;&nbsp;Active
  
  

Here you can see that the default namespace exists and is active. The status of the namespace is used later when turning down and deleting the namespace.

## Creating a New Namespace

You create a namespace in the same way you would any other resource. Create a my-namespace.yaml file and add these contents:

kind: Namespace  
apiVersion: v1  
metadata:  
 &nbsp;name: my-namespace  
 &nbsp;labels:  
 &nbsp;&nbsp;&nbsp;name: my-namespace  

Then you can run this command to create it:

$ kubectl create -f my-namespace.yaml

## Service Names

With namespaces you can have your apps point to static service endpoints that don't change based on the environment. For instance, your MySQL database service could be named mysql in production and staging even though it runs on the same infrastructure.

This works because each of the resources in the cluster will by default only "see" the other resources in the same namespace. This means that you can avoid naming collisions by creating pods, services, and replication controllers with the same names provided they are in separate namespaces. Within a namespace, short DNS names of services resolve to the IP of the service within that namespace. So for example, you might have an Elasticsearch service that can be accessed via the DNS name elasticsearch as long as the containers accessing it are located in the same namespace.

You can still access services in other namespaces by looking it up via the full DNS name which takes the form of SERVICE-NAME.NAMESPACE-NAME. So for example, elasticsearch.prod or elasticsearch.canary for the production and canary environments respectively.

## An Example

Lets look at an example application. Let’s say you want to deploy your music store service MyTunes in Kubernetes. You can run the application production and staging environment as well as some one-off apps running in the same cluster. You can get a better idea of what’s going on by running some commands:

~$ kubectl get namespaces  
NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LABELS &nbsp;&nbsp;&nbsp;STATUS  
default &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\<none\> &nbsp;&nbsp;&nbsp;Active  
mytunes-prod &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\<none\> &nbsp;&nbsp;&nbsp;Active  
mytunes-staging &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\<none\> &nbsp;&nbsp;&nbsp;Active  
my-other-app &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\<none\> &nbsp;&nbsp;&nbsp;Active  

Here you can see a few namespaces running. Next let’s list the services in staging:

~$ kubectl get services --namespace=mytunes-staging  
NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LABELS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SELECTOR &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;IP(S) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PORT(S)  
mytunes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name=mytunes,version=1 &nbsp;&nbsp;&nbsp;name=mytunes &nbsp;&nbsp;&nbsp;10.43.250.14 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;80/TCP  
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;104.185.824.125 &nbsp;&nbsp;  
mysql &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name=mysql &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name=mysql &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10.43.250.63 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3306/TCP  

Next check production:

~$ kubectl get services --namespace=mytunes-prod  
NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LABELS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SELECTOR &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;IP(S) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PORT(S)  
mytunes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name=mytunes,version=1 &nbsp;&nbsp;&nbsp;name=mytunes &nbsp;&nbsp;&nbsp;10.43.241.145 &nbsp;&nbsp;&nbsp;&nbsp;80/TCP  
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;104.199.132.213 &nbsp;&nbsp;  
mysql &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name=mysql &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name=mysql &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10.43.245.77 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3306/TCP  

Notice that the IP addresses are different depending on which namespace is used even though the names of the services themselves are the same. This capability makes configuring your app extremely easy—since you only have to point your app at the service name—and has the potential to allow you to configure your app exactly the same in your staging or test environments as you do in production.

## Caveats

While you can run staging and production environments in the same cluster and save resources and money by doing so, you will need to be careful to set up resource limits so that your staging environment doesn't starve production for CPU, memory, or disk resources. Setting resource limits properly, and testing that they are working takes a lot of time and effort so unless you can measurably save money by running production in the same cluster as staging or test, you may not really want to do that.

Whether or not you run staging and production in the same cluster, namespaces are a great way to partition different apps within the same cluster. Namespaces will also serve as a level where you can apply resource limits so look for more resource management features at the namespace level in the future.

- Posted by Ian Lewis, Developer Advocate at Google
  
