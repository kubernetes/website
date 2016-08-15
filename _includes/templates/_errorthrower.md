{% if include.tagsblock %}

## ERROR: You must add a <span style="font-family: monospace">`{{ include.missing_block }}:`</span> section to the front-matter YAML
{: style="color:red" }

This template requires that you add some YAML that {{ include.purpose }}
This should be at the top of the page, between the two lines of dashes.

```yaml
---
{{ include.missing_block }}:
- {{ include.tagname }}: {{ include.tieroneexample }}
  rank: 1
- {{ include.tagname }}: {{ include.tiertwoexample }}
  rank: 2
---

Body of document here...
```

This denotes that the topic is a 1st tier, very important, core topic for `{{ include.tieroneexample }}`, but is only a second tier/corner use case for `{{ include.tiertwoexample }}`.

**NOTE:** Only rank 1 and 2 are currently supported by our templating system!

This information shows up in [the metadata document](/metadata.txt) that drives
[our sitemap](/docs/sitemap/) and provides the connective tissue that associates
pages with one another.

There are three such blocks: `concept_rankings`, `object_rankings`, and `command_rankings`, which associate topics with Kubernetes concepts (such as pods), API functions, objects, and fields (such as `nodeAffinity`), and CLI commands (such as `kubectl describe`), respectively. It's suggested you be as thorough as possible and fill out all three, like so:

```yaml
---
object_rankings:
- object: nodeAffinity
  rank: 1
- object: nodeSelector
  rank: 2
concept_rankings:
- concept: node
  rank: 1
- concept: pod
  rank: 1
command_rankings:
- command: kubectl label
  rank: 1
- command: kubectl get
  rank: 2
---
```
{% elsif include.yaml %}

## ERROR: You must add a <span style="font-family: monospace">`{{ include.missing_block }}:`</span> section to the front-matter YAML
{: style="color:red" }

This template requires that you add some YAML that {{ include.purpose }}
This should be at the top of the page, between the two lines of dashes.

```yaml
---
{{ include.missing_block }}: Text that {{ include.purpose }}
...(more YAML)
---

Body of document here...
```
{% else %}

## ERROR: You must define a <span style="font-family: monospace">`{{ include.missing_block }}`</span> block
{: style="color:red" }

This template requires that you provide text that {{ include.purpose }}.
{% if include.heading %}The text in this block will be displayed under the heading **{{ include.heading }}**.{% endif %}

To get rid of this message and take advantage of this template, define the `{{ include.missing_block }}`
variable and populate it with content.

```liquid
{% raw %}{%{% endraw %} capture {{ include.missing_block }} {% raw %}%}{% endraw %}
Text that {{ include.purpose }}.
{% raw %}{%{% endraw %} endcapture {% raw %}%}{% endraw %}
```

{% endif %}
<!-- TEMPLATE_ERROR -->
