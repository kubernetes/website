------------

# attach

>bdocs-tab:example Get output from running pod 123456-7890, using the first container by default

```bdocs-tab:example_shell
kubectl attach 123456-7890
```

>bdocs-tab:example Get output from ruby-container from pod 123456-7890

```bdocs-tab:example_shell
kubectl attach 123456-7890 -c ruby-container
```

>bdocs-tab:example Switch to raw terminal mode, sends stdin to 'bash' in ruby-container from pod 123456-7890 # and sends stdout/stderr from 'bash' back to the client

```bdocs-tab:example_shell
kubectl attach 123456-7890 -c ruby-container -i -t
```


Attach to a process that is already running inside an existing container.

### Usage

`$ attach POD -c CONTAINER`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
container | c |  | Container name. If omitted, the first container in the pod will be chosen 
stdin | i | false | Pass stdin to the container 
tty | t | false | Stdin is a TTY 


