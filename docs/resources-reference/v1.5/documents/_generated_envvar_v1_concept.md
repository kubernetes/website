

-----------
# EnvVar v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | EnvVar







EnvVar represents an environment variable present in a Container.

<aside class="notice">
Appears In <a href="#container-v1">Container</a> </aside>

Field        | Description
------------ | -----------
name <br /> *string*  | Name of the environment variable. Must be a C_IDENTIFIER.
value <br /> *string*  | Variable references $(VAR_NAME) are expanded using the previous defined environment variables in the container and any service environment variables. If a variable cannot be resolved, the reference in the input string will be unchanged. The $(VAR_NAME) syntax can be escaped with a double $$, ie: $$(VAR_NAME). Escaped references will never be expanded, regardless of whether the variable exists or not. Defaults to "".
valueFrom <br /> *[EnvVarSource](#envvarsource-v1)*  | Source for the environment variable's value. Cannot be used if value is not empty.






