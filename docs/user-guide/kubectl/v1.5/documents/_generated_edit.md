------------

# edit

>bdocs-tab:example Edit the service named 'docker-registry':

```bdocs-tab:example_shell
kubectl edit svc/docker-registry
```

>bdocs-tab:example Use an alternative editor

```bdocs-tab:example_shell
KUBE_EDITOR="nano" kubectl edit svc/docker-registry
```

>bdocs-tab:example Edit the service 'docker-registry' in JSON using the v1 API format:

```bdocs-tab:example_shell
kubectl edit svc/docker-registry --output-version=v1 -o json
```


Edit a resource from the default editor. 

The edit command allows you to directly edit any API resource you can retrieve via the command line tools. It will open the editor defined by your KUBE _EDITOR, or EDITOR environment variables, or fall back to 'vi' for Linux or 'notepad' for Windows. You can edit multiple objects, although changes are applied one at a time. The command accepts filenames as well as command line arguments, although the files you point to must be previously saved versions of resources. 

The files to edit will be output in the default API version, or a version specified by --output-version. The default format is YAML - if you would like to edit in JSON pass -o json. The flag --windows-line-endings can be used to force Windows line endings, otherwise the default for your operating system will be used. 

In the event an error occurs while updating, a temporary file will be created on disk that contains your unapplied changes. The most common error when updating a resource is another editor changing the resource on the server. When this occurs, you will have to apply your changes to the newer version of the resource, or update your temporary saved copy to include the latest resource version.

### Usage

`$ edit (RESOURCE/NAME | -f FILENAME)`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
filename | f | [] | Filename, directory, or URL to files to use to edit the resource 
include-extended-apis |  | true | If true, include definitions of new APIs via calls to the API server. [default true] 
output | o | yaml | Output format. One of: yaml&#124;json. 
output-version |  |  | Output the formatted object with the given group version (for ex: 'extensions/v1beta1'). 
record |  | false | Record current kubectl command in the resource annotation. If set to false, do not record the command. If set to true, record the command. If not set, default to updating the existing annotation value only if one already exists. 
recursive | R | false | Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory. 
save-config |  | false | If true, the configuration of current object will be saved in its annotation. This is useful when you want to perform kubectl apply on this object in the future. 
schema-cache-dir |  | ~/.kube/schema | If non-empty, load/store cached API schemas in this directory, default is '$HOME/.kube/schema' 
validate |  | true | If true, use a schema to validate the input before sending it 
windows-line-endings |  | false | Use Windows line-endings (default Unix line-endings) 


