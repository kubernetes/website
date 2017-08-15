1. Blah blah blah

    **Note:** The following sample is an excerpt of the StatefulSet file.
    {: .notice1}

      ```yaml   
      # Please edit the object below. Lines beginning with a '#' will be ignored,
      # and an empty file will abort the edit. If an error occurs while saving this file will be
      # reopened with the relevant failures.
      #
      apiVersion: apps/v1beta1
      kind: StatefulSet
      metadata:
       creationTimestamp: 2016-08-13T18:40:58Z
       generation: 1
       labels:
       app: cassandra
       name: cassandra
       namespace: default
       resourceVersion: "323"
       selfLink: /apis/apps/v1beta1/namespaces/default/statefulsets/cassandra
       uid: 7a219483-6185-11e6-a910-42010a8a0fc0
      spec:
       replicas: 3
      ``` 

2. Change the number of replicas to 4, and then save the manifest. 

   The StatefulSet now contains 4 Pods.

{% include templates/tutorial.md %}
