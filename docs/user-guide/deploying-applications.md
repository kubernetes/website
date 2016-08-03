---
assignees:
- bgrant0607
- caesarxuchao
- thockin

---


* TOC
{:toc}

## Launching a set of replicas using a configuration file

Kubernetes creates and manages sets of replicated containers (actually, replicated [Pods](/docs/user-guide/pods)) using [*Deployments*](/docs/user-guide/deployments).

A Deployment simply ensures that a specified number of pod "replicas" are running at any one time. If there are too many, it will kill some. If there are too few, it will start more. It's analogous to Google Compute Engine's [Instance Group Manager](https://cloud.google.com/compute/docs/instance-groups/manager/) or AWS's [Auto-scaling Group](http://docs.aws.amazon.com/AutoScaling/latest/DeveloperGuide/AutoScalingGroup.html) (with no scaling policies).

The Deployment created to run nginx by `kubectl run` in the [Quick start](/docs/user-guide/quick-start) could be specified using YAML as follows:

{% include code.html language="yaml" file="run-my-nginx.yaml" ghlink="/docs/user-guide/run-my-nginx.yaml" %}

Some differences compared to specifying just a pod are that the `kind` is `Deployment`, the number of `replicas` desired is specified, and the pod specification is under the `template` field. The names of the pods don't need to be specified explicitly because they are generated from the name of the Deployment.
View the [Deployment API
object](/docs/api-reference/extensions/v1beta1/definitions/#_v1beta1_deployment)
to view the list of supported fields.

This Deployment can be created using `create`, just as with pods:

```shell
$ kubectl create -f ./run-my-nginx.yaml
deployment "my-nginx" created
```

Unlike in the case where you directly create pods, a Deployment replaces pods that are deleted or terminated for any reason, such as in the case of node failure. For this reason, we recommend that you use a Deployment for a continuously running application even if your application requires only a single pod, in which case you can omit `replicas` and it will default to a single replica.

## Viewing Deployment status

You can view the Deployment you created using `get`:

```shell
$ kubectl get deployment
NAME       DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
my-nginx   2         2         2            2           6s
```

This tells you that your Deployment will ensure that you have two nginx replicas (desired replicas = 2).

You can see those replicas using `get`, just as with pods you created directly:

```shell
$ kubectl get pods
NAME                        READY     STATUS    RESTARTS   AGE
my-nginx-3800858182-9hk43   1/1       Running   0          8m
my-nginx-3800858182-e529s   1/1       Running   0          8m
```

## Deleting Deployments

When you want to kill your application, delete your Deployment, as in the [Quick start](/docs/user-guide/quick-start):

```shell
$ kubectl delete deployment/my-nginx
deployment "my-nginx" deleted
```

By default, this will also cause the pods managed by the Deployment to be deleted. If there were a large number of pods, this may take a while to complete. If you want to leave the pods running instead, specify `--cascade=false`.

If you try to delete the pods before deleting the Deployments, it will just replace them, as it is supposed to do.

## Labels

Kubernetes uses user-defined key-value attributes called [*labels*](/docs/user-guide/labels) to categorize and identify sets of resources, such as pods and Deployments. The example above specified a single label in the pod template, with key `run` and value `my-nginx`. All pods created carry that label, which can be viewed using `-L`:

```shell
$ kubectl get pods -L run
NAME                        READY     STATUS    RESTARTS   AGE       RUN
my-nginx-3800858182-1v53o   1/1       Running   0          46s       my-nginx
my-nginx-3800858182-2ds1q   1/1       Running   0          46s       my-nginx
```

The labels from the pod template are copied to the Deployment's labels by default, as well -- all resources in Kubernetes support labels:

```shell
$ kubectl get deployment/my-nginx -L run
NAME       DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE       RUN
my-nginx   2         2         2            2           2m        my-nginx
```

More importantly, the pod template's labels are used to create a [`selector`](/docs/user-guide/labels/#label-selectors) that will match pods carrying those labels. You can see this field by requesting it using the [Go template output format of `kubectl get`](/docs/user-guide/kubectl/kubectl_get):

```shell{% raw %}
$ kubectl get deployment/my-nginx -o template --template="{{.spec.selector}}"
map[matchLabels:map[run:my-nginx]]{% endraw %}
```

You could also specify the `selector` explicitly, such as if you wanted to specify labels in the pod template that you didn't want to select on, but you should ensure that the selector will match the labels of the pods created from the pod template, and that it won't match pods created by other Deployments. The most straightforward way to ensure the latter is to create a unique label value for the Deployment, and to specify it in both the pod template's labels and in the selector's
matchLabels.

## What's next?

[Learn about exposing applications to users and clients, and connecting tiers of your application together.](/docs/user-guide/connecting-applications)
