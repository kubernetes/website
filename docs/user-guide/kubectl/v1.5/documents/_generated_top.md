------------

# top



Display Resource (CPU/Memory/Storage) usage. 

The top command allows you to see the resource consumption for nodes or pods.

### Usage

`$ top`



------------

## <em>node</em>

>bdocs-tab:example Show metrics for all nodes

```bdocs-tab:example_shell
kubectl top node
```

>bdocs-tab:example Show metrics for a given node

```bdocs-tab:example_shell
kubectl top node NODE_NAME
```


Display Resource (CPU/Memory/Storage) usage of nodes. 

The top-node command allows you to see the resource consumption of nodes.

### Usage

`$ node [NAME | -l label]`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
selector | l |  | Selector (label query) to filter on 



------------

## <em>pod</em>

>bdocs-tab:example Show metrics for all pods in the default namespace

```bdocs-tab:example_shell
kubectl top pod
```

>bdocs-tab:example Show metrics for all pods in the given namespace

```bdocs-tab:example_shell
kubectl top pod --namespace=NAMESPACE
```

>bdocs-tab:example Show metrics for a given pod and its containers

```bdocs-tab:example_shell
kubectl top pod POD_NAME --containers
```

>bdocs-tab:example Show metrics for the pods defined by label name=myLabel

```bdocs-tab:example_shell
kubectl top pod -l name=myLabel
```


Display Resource (CPU/Memory/Storage) usage of pods. 

The 'top pod' command allows you to see the resource consumption of pods. 

Due to the metrics pipeline delay, they may be unavailable for a few minutes since pod creation.

### Usage

`$ pod [NAME | -l label]`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
all-namespaces |  | false | If present, list the requested object(s) across all namespaces. Namespace in current context is ignored even if specified with --namespace. 
containers |  | false | If present, print usage of containers within a pod. 
selector | l |  | Selector (label query) to filter on 



