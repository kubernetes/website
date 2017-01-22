---
title: Managing Kubernetes Objects Using Object Configuration (Imperative)
---

{% capture overview %}
Kubernetes objects can be created, updated, and deleted by writing an
object configuration file in yaml, and using `kubectl` to create,
update or delete the object defined in the config.
This document explains how to define objects using yaml config and
use it with `kubectl` to manage your apps.
{% endcapture %}

{% capture body %}

## Trade-offs

Advantages compared to imperative commands:

- Object configuration can be stored in a source control system such as Git.
- Object configuration can integrate with processes such as reviewing changes before push and audit trails.
- Object configuration provides a template for creating new objects.

Disadvantages compared to imperative commands:

- Object configuration requires basic understanding of the object schema.
- Object configuration requires the additional step of writing a YAML file.

Advantages compared to declarative object configuration:

- Imperative object configuration behavior is simpler and easier to understand.
- As of Kubernetes version 1.5, imperative object configuration is more mature.

Disadvantages compared to declarative object configuration:

- Imperative object configuration works best on files, not directories.
- Updates to live objects must be reflected in configuration files, or they will be lost during the next replacement.

## How to create objects

Create an object from an object configuration file written in yaml or json.
Refer to the [kubernetes object schema reference](/docs/objects-reference/v1.5/)
for more details.

- `create -f <filename|url>`

## How to update objects

Writes the configuration in filename or url to the object, replacing the live object configuration.

- `replace -f <filename|url>`

## How to delete objects

- `delete -f <filename|url>`

## How to view an object

- `get -f <filename|url> -o yaml`

**Note**: This passes the `-o yaml` flag so that full object configuration is printed.  Use `get -h` to see a list of options.

## Limitations

The create, replace and delete commands work well when each object's
configuration is fully defined and recorded in the object configuration
file.  However when writes are made to a live object that are not merged
into the configuration, the writes will be lost the next time a `replace`
is executed.  This is can happen if a controller, such as
a HorizontalPodAutoscaler, makes updates directly to the live object.

Example:

1. Create a object from a configuration file
2. Another source updates the object by changing some field
3. Replace the object from a configuration file
  - Changes made by other sourse in step *2* are lost

If a user needs to support multiple writers to the same object, this can be
done using `kubectl apply` to manage the objects.

## Warning: defining Controller Selectors and PodTemplate Labels

Updating selector on controllers is strongly advised against.  Instead,
the recommended approach is to define a single immutable PodTemplate label
used only by the controller selector with no other semantic meaning.

Example label:

```yaml
selector:
  matchLabels:
      controller-selector: "v1beta1/deployment/nginx"
template:
  metadata:
    labels:
      controller-selector: "v1beta1/deployment/nginx"
```

## Tip: creating and editing an object from a URL without saving it

To open the object configuration in an editor before creating it, supply
the `--edit` flag.  This is particularly useful when performing tutorials
or guides that include object configuration the user wants to modify.

    ```sh
    kubectl create -f <url> --edit
    ```

## Migrating objects from imperative command management to imperative object configuration

Migrating objects from imperative command management to declarative object
configuration involves several manual steps.

1. Export live object to a local object configuration file
  - `kubectl get <kind>/<name> -o yaml --export > <kind>_<name>.yaml`
2. Manually remove the status field from the object configuration in a text editor
4. Change processes to use `replace` for managing the object exclusively

{% endcapture %}

{% capture whatsnext %}
- [Managing Kubernetes Objects Using Imperative Commands](/docs/concepts/tools/kubectl/object-management-using-commands/)
- [Managing Kubernetes Objects Using Object Configuration (Declarative)](/docs/concepts/tools/kubectl/object-management-using-declarative-config/)
- [Kubectl Command Reference](/docs/user-guide/kubectl/v1.5/)
- [Kubernetes Object Schema Reference](/docs/objects-reference/v1.5/)
{% endcapture %}

{% include templates/concept.md %}
