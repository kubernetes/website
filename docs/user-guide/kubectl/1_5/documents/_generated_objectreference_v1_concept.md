

-----------
# ObjectReference v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | ObjectReference







ObjectReference contains enough information to let you inspect or modify the referred object.

<aside class="notice">
Appears In <a href="#binding-v1">Binding</a> <a href="#endpointaddress-v1">EndpointAddress</a> <a href="#event-v1">Event</a> <a href="#persistentvolumespec-v1">PersistentVolumeSpec</a> <a href="#serviceaccount-v1">ServiceAccount</a> </aside>

Field        | Description
------------ | -----------
apiVersion <br /> *string*  | API version of the referent.
fieldPath <br /> *string*  | If referring to a piece of an object instead of an entire object, this string should contain a valid JSON/Go field access statement, such as desiredState.manifest.containers[2]. For example, if the object reference is to a container within a pod, this would take on a value like: "spec.containers{name}" (where "name" refers to the name of the container that triggered the event) or if no container name is specified "spec.containers[2]" (container with index 2 in this pod). This syntax is chosen only to have some well-defined way of referencing a part of an object.
kind <br /> *string*  | Kind of the referent. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
name <br /> *string*  | Name of the referent. More info: http://kubernetes.io/docs/user-guide/identifiers#names
namespace <br /> *string*  | Namespace of the referent. More info: http://kubernetes.io/docs/user-guide/namespaces
resourceVersion <br /> *string*  | Specific resourceVersion to which this reference is made, if any. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#concurrency-control-and-consistency
uid <br /> *string*  | UID of the referent. More info: http://kubernetes.io/docs/user-guide/identifiers#uids






