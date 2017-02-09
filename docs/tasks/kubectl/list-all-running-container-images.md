---
title: Listing all Container Images Running in a Cluster
---

{% capture overview %}

This page shows how to use kubectl to list all of the Container images
for Pods running in a cluster.

{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}

## List all Containers in all namespaces

In this exercise you use kubectl to fetch all of the Pods
running in a cluster, and format the output to pull out the list
of Containers for each.

- Fetch all Pods in all namespaces using `kubectl get pods --all-namespaces`.

- Format the output to include only the list of Container image names
  using `-o jsonpath={..image}`.  This recursively parses out the
  `image` field from the returned JSON.
  
  See the [jsonpath reference](/docs/user-guide/jsonpath/)
  for further information on how to use jsonpath.
    
- Format the output using standard unix tools: `tr`, `sort`, `uniq`:
  - Use `tr` to replace spaces with newlines.
  - Use `sort` to sort the results.
  - Use `uniq` to aggregate image counts.

```sh
kubectl get pods --all-namespaces -o jsonpath="{..image}" |\
tr -s '[[:space:]]' '\n' |\
sort |\
uniq -c
```

The above command recursively returns all fields named `image`
for all items returned.

As an alternative, it is possible to use the absolute path to the `image`
field in the Pod. This ensures the correct field is retrieved
in the event the field name is repeated. For example,
many fields are called `name` in a given item:

```sh
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}"
```

The jsonpath is interpreted as follows:

- `.items[*]`: For each returned value
- `.spec`: Get the spec
- `.containers[*]`: For each container
- `.image`: Get the image

**Note:** When fetching a single Pod by name, for example, `kubect get pod nginx`,
the `.items[*]` portion of the path should be omitted because a single
Pod is returned instead of a list of items.

## List Containers by Pod

You can controll the formatting further by using the `range` operation to
iterate over elements individually.

```sh
kubectl get pods --all-namespaces -o=jsonpath='{range .items[*]}{"\n"}{.metadata.name}{":\t"}{range .spec.containers[*]}{.image}{", "}{end}{end}' |\
sort
```

{% endcapture %}

{% capture discussion %}

## Discussion

To target only Pods matching a specific label, use the `-l` flag.  The
following matches only Pods with labels matching `app=nginx`.

```sh
kubectl get pods --all-namespaces -o=jsonpath="{..image}" -l app=nginx
```

To target only pods in a specific namespace, use the `namespace` flag. The
following matches only Pods in the `kube-system` namespace.

```sh
kubectl get pods --namespace kube-system -o jsonpath="{..image}"
```

As an alternative to jsonpath, Kubectl supports using [go-templates](https://golang.org/pkg/text/template/)
for formatting the output:

{% raw %}
```sh
kubectl get pods --all-namespaces -o go-template --template="{{range .items}}{{range .spec.containers}}{{.image}} {{end}}{{end}}"
```
{% endraw %}

{% endcapture %}

{% capture whatsnext %}

### Reference

* [Jsonpath](/docs/user-guide/jsonpath/) reference guide
* [Go template](https://golang.org/pkg/text/template/) reference guide

{% endcapture %}

{% include templates/task.md %}
