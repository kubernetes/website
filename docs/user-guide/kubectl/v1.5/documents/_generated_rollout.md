------------

# rollout

>bdocs-tab:example Rollback to the previous deployment

```bdocs-tab:example_shell
kubectl rollout undo deployment/abc
```


Manage a deployment using subcommands like "kubectl rollout undo deployment/abc"

### Usage

`$ rollout SUBCOMMAND`



------------

## <em>history</em>

>bdocs-tab:example View the rollout history of a deployment

```bdocs-tab:example_shell
kubectl rollout history deployment/abc
```

>bdocs-tab:example View the details of deployment revision 3

```bdocs-tab:example_shell
kubectl rollout history deployment/abc --revision=3
```


View previous rollout revisions and configurations.

### Usage

`$ history (TYPE NAME | TYPE/NAME) [flags]`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
filename | f | [] | Filename, directory, or URL to files identifying the resource to get from a server. 
recursive | R | false | Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory. 
revision |  | 0 | See the details, including podTemplate of the revision specified 



------------

## <em>pause</em>

>bdocs-tab:example Mark the nginx deployment as paused. Any current state of # the deployment will continue its function, new updates to the deployment will not # have an effect as long as the deployment is paused.

```bdocs-tab:example_shell
kubectl rollout pause deployment/nginx
```


Mark the provided resource as paused 

Paused resources will not be reconciled by a controller. Use \"kubectl rollout resume \" to resume a paused resource. Currently only deployments support being paused.

### Usage

`$ pause RESOURCE`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
filename | f | [] | Filename, directory, or URL to files identifying the resource to get from a server. 
recursive | R | false | Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory. 



------------

## <em>resume</em>

>bdocs-tab:example Resume an already paused deployment

```bdocs-tab:example_shell
kubectl rollout resume deployment/nginx
```


Resume a paused resource 

Paused resources will not be reconciled by a controller. By resuming a resource, we allow it to be reconciled again. Currently only deployments support being resumed.

### Usage

`$ resume RESOURCE`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
filename | f | [] | Filename, directory, or URL to files identifying the resource to get from a server. 
recursive | R | false | Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory. 



------------

## <em>status</em>

>bdocs-tab:example Watch the rollout status of a deployment

```bdocs-tab:example_shell
kubectl rollout status deployment/nginx
```


Show the status of the rollout. 

By default 'rollout status' will watch the status of the latest rollout until it's done. If you don't want to wait for the rollout to finish then you can use --watch=false. Note that if a new rollout starts in-between, then 'rollout status' will continue watching the latest revision. If you want to pin to a specific revision and abort if it is rolled over by another revision, use --revision=N where N is the revision you need to watch for.

### Usage

`$ status (TYPE NAME | TYPE/NAME) [flags]`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
filename | f | [] | Filename, directory, or URL to files identifying the resource to get from a server. 
recursive | R | false | Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory. 
revision |  | 0 | Pin to a specific revision for showing its status. Defaults to 0 (last revision). 
watch | w | true | Watch the status of the rollout until it's done. 



------------

## <em>undo</em>

>bdocs-tab:example Rollback to the previous deployment

```bdocs-tab:example_shell
kubectl rollout undo deployment/abc
```

>bdocs-tab:example Rollback to deployment revision 3

```bdocs-tab:example_shell
kubectl rollout undo deployment/abc --to-revision=3
```

>bdocs-tab:example Rollback to the previous deployment with dry-run

```bdocs-tab:example_shell
kubectl rollout undo --dry-run=true deployment/abc
```


Rollback to a previous rollout.

### Usage

`$ undo (TYPE NAME | TYPE/NAME) [flags]`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
dry-run |  | false | If true, only print the object that would be sent, without sending it. 
filename | f | [] | Filename, directory, or URL to files identifying the resource to get from a server. 
recursive | R | false | Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory. 
to-revision |  | 0 | The revision to rollback to. Default to 0 (last revision). 



