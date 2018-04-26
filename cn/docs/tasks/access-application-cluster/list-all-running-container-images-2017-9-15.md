---
title: List All Container Images Running in a Cluster
---

{% capture overview %}

This page shows how to use kubectl to list all of the Container images
for Pods running in a cluster.

{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}

In this exercise you will use kubectl to fetch all of the Pods
running in a cluster, and format the output to pull out the list
of Containers for each.

## List all Containers in all namespaces

- Fetch all Pods in all namespaces using `kubectl get pods --all-namespaces`
- Format the output to include only the list of Container image names
  using `-o jsonpath={..image}`.  This will recursively parse out the
  `image` field from the returned json.
  - See the [jsonpath reference](/docs/user-guide/jsonpath/)
    for further information on how to use jsonpath.
- Format the output using standard tools: `tr`, `sort`, `uniq`
  - Use `tr` to replace spaces with newlines
  - Use `sort` to sort the results
  - Use `uniq` to aggregate image counts

```sh
kubectl get pods --all-namespaces -o jsonpath="{..image}" |\
tr -s '[[:space:]]' '\n' |\
sort |\
uniq -c
```

The above command will recursively return all fields named `image`
for all items returned.

As an alternative, it is possible to use the absolute path to the image
field within the Pod.  This ensures the correct field is retrieved
even when the field name is repeated,
e.g. many fields are called `name` within a given item:

```sh
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}"
```

The jsonpath is interpreted as follows:

- `.items[*]`: for each returned value
- `.spec`: get the spec
- `.containers[*]`: for each container
- `.image`: get the image

**Note:** When fetching a single Pod by name, e.g. `kubectl get pod nginx`,
the `.items[*]` portion of the path should be omitted because a single
Pod is returned instead of a list of items.

## List Containers by Pod

The formatting can be controlled further by using the `range` operation to
iterate over elements individually.

```sh
kubectl get pods --all-namespaces -o=jsonpath='{range .items[*]}{"\n"}{.metadata.name}{":\t"}{range .spec.containers[*]}{.image}{", "}{end}{end}' |\
sort
```

## List Containers filtering by Pod label

To target only Pods matching a specific label, use the -l flag.  The
following matches only Pods with labels matching `app=nginx`.

```sh
kubectl get pods --all-namespaces -o=jsonpath="{..image}" -l app=nginx
```

## List Containers filtering by Pod namespace

To target only pods in a specific namespace, use the namespace flag. The
following matches only Pods in the `kube-system` namespace.

```sh
kubectl get pods --namespace kube-system -o jsonpath="{..image}"
```

## List Containers using a go-template instead of jsonpath

As an alternative to jsonpath, Kubectl supports using [go-templates](https://golang.org/pkg/text/template/)
for formatting the output:

{% raw %}
```sh
kubectl get pods --all-namespaces -o go-template --template="{{range .items}}{{range .spec.containers}}{{.image}} {{end}}{{end}}"
```
{% endraw %}


{% endcapture %}

{% capture discussion %}

{% endcapture %}

{% capture whatsnext %}

### Reference

* [Jsonpath](/docs/user-guide/jsonpath/) reference guide
* [Go template](https://golang.org/pkg/text/template/) reference guide

{% endcapture %}

{% include templates/task.md %}
