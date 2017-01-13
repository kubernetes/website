## SELinuxOptions v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | SELinuxOptions

> Example yaml coming soon...



SELinuxOptions are the labels to be applied to the container

<aside class="notice">
Appears In  <a href="#podsecuritycontext-v1">PodSecurityContext</a>  <a href="#securitycontext-v1">SecurityContext</a> </aside>

Field        | Description
------------ | -----------
level <br /> *string* | Level is SELinux level label that applies to the container.
role <br /> *string* | Role is a SELinux role label that applies to the container.
type <br /> *string* | Type is a SELinux type label that applies to the container.
user <br /> *string* | User is a SELinux user label that applies to the container.

