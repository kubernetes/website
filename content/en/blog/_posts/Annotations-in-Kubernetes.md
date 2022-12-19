---
layout: blog
title: "Annotations in Kubernetes"
slug: Annotations-in-Kubernetes
---

**Author:** Gursimar Singh


# Annotations in Kubernetes
Just what are these "annotation things" anyway? Annotations are not fully explained in the Kubernetes documentation, which is otherwise quite useful.

Similar to how labels are made up of key-value pairs, annotations are also made up of strings. Annotations, however, were initially meant to serve no actual use and are now useless because they cannot be utilised in any queries; the original goal was to offer extensive metadata in an object. Information regarding licencing, the project's maintainer, and other such details are examples of such trivia. Newly-introduced Kubernetes resources, however, may make use of annotations to describe their functionality in greater detail.

To a lesser extent, annotations are unimportant. Labels, on the other hand, will require a lot of human attention.

Annotations and labels share certain similarities. However, for objects, Kubernetes uses labels rather than annotations. Annotations are not used by Kubernetes to apply any changes to the clusters. Annotations work more like comments for human readability and extra details. Annotations help provide context. 

> _Note: Annotations include non-identifying metadata in contrast to labels which hold identifying metadata_

## Syntax
Annotations can be described in two ways:
1. Declarative i.e., using the CLI command

Syntax: ` kubectl annotate [--overwrite] (-f FILENAME | TYPE NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--resource-version=version] `

Example: `kubectl annotate --overwrite pods example description=this is an example'`

We can both add and remove annotations using the CLI as well.
We have multiple options are available such as –-user, --cluster, --kubeconfig, --context and so on. 


2.	Imperative i.e., specifying in the manifest (yaml) file.

For the manifest files, they are defined in the metadata section of the files.
```
...
metadata:
  annotations:
    for.example/url: "https://www.k8s-blog.com/annotation"
...
```

Annotations are a way for other programs driving Kubernetes via an API to store some opaque data with an object. Annotations can be used for the tool itself or to pass configuration information between external systems.

## Character constraints
There is an overlap between annotations and labels. Annotations have some extra characters allowed which are not allowed by labels.

Valid annotation keys have two segments: an optional prefix and name, separated by a slash (/). The name segment is required and must be 63 characters or less, beginning and ending with an alphanumeric character ([a-z0-9A-Z]) with dashes (-), underscores (_), dots (.), and alphanumerics between. The prefix is optional. If specified, the prefix must be a DNS subdomain: a series of DNS labels separated by dots (.), not longer than 253 characters in total, followed by a slash (/).
If the prefix is omitted, the annotation Key is presumed to be private to the user. Automated system components (e.g. kube-scheduler, kube-controller-manager, kube-apiserver, kubectl, or other third-party automation) which add annotations to end-user objects must specify a prefix.
The kubernetes.io/ and k8s.io/ prefixes are reserved for Kubernetes core components.

(Source: K8S docs [https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/])

## How do we check annotations?
We can either use the “kubectl describe pod” command which displays all the info including the annotations or we can simply output only annotations.
However, this command’s output might not be very clear in terms of human readability. 

## Use cases
They are primarily used while rolling deployments. However, there are various other use cases where annotations are used such as, 
- Alerting about a specialized policy for a scheduler
- Incorporating information about the resource's most recent updating tool and its update process
- Including data that isn't meant for labels, such as build and release info.
- Permit the Deployment object to maintain a record of the ReplicaSets it is responsible for maintaining throughout deployments.

> _Note: Some Kubernetes resources and third-party applications might use Annotations so it’s imperative to be careful while using annotations._