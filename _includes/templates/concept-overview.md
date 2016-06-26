{% if page.glossary %}
<meta name="description" content="{{ page.glossary }}">
{% else %}
{% include templates/_errorthrower.md missing_block='glossary' yaml='true' defaultcode='true' purpose='provides a brief (~140 character) definition of the concept.' %}
{% endif %}

{% if page.concept_rankings %}{% else %}
{% include templates/_errorthrower.md missing_block='concept_rankings' tagsblock='true' purpose='provides a list of associated concepts that pertain to this topic.' tagname='concept' tieroneexample='pod' tiertwoexample='container'%}
{% endif %}

{% if page.object_rankings %}{% else %}
{% include templates/_errorthrower.md missing_block='object_rankings' tagsblock='true' purpose='provides a list of associated API object that pertain to this topic.' tagname='object' tieroneexample='restartPolicy' tiertwoexample='nodeAffinity'%}
{% endif %}

{% if page.command_rankings %}{% else %}
{% include templates/_errorthrower.md missing_block='command_rankings' tagsblock='true' purpose='provides a list of associated CLI commands that pertain to this topic.' tagname='command' tieroneexample='kubectl get' tiertwoexample='kubectl describe'%}
{% endif %}
{% if concept %}<!-- check for this before going any further; if not present, skip to else at bottom -->

* TOC
{:toc}

{% if what_is %}

### {{ concept }} overview

{{ what_is }}

{% else %}

{% include templates/_errorthrower.md missing_block='what_is' heading='What is a (Concept)?' purpose='explains what this concept is and its purpose.' %}

{% endif %}


{% if when_to_use %}

### When to use a {{ concept }}

{{ when_to_use }}

{% else %}

{% include templates/_errorthrower.md missing_block='when_to_use' heading='When to use a (Concept)' purpose='explains when to use this object.' %}

{% endif %}


{% if when_not_to_use %}

#### When not to use a {{ concept }}

{{ when_not_to_use }}

{% else %}

{% include templates/_errorthrower.md missing_block='when_not_to_use' heading='When not to use a (Concept)' purpose='explains when not to use this object.' %}

{% endif %}


{% if usage %}

## Basic usage

{{ usage }}

{% else %}

{% include templates/_errorthrower.md missing_block='usage' heading='Usage' purpose='shows the most basic, common use case for this object, in the form of a code sample, command, etc, using tabs to show multiple approaches' %}

{% endif %}


<script language="JavaScript">
$( document ).ready(function() {
  // When the document loads, get the metadata JSON, and kick off tbl render
  $.get("/metadata.txt", function(data, status) {
    metadata = $.parseJSON(data);
    metadata.pages.sort(dynamicSort("t"));
    mainLogic();
  });
});
function mainLogic()
{
  topicsFilter("concept","pod","coretopics",1);
  topicsFilter("concept","pod","advancedtopics",2);
}
</script>

## Core Topics

These topics illustrate the core use cases for {{ concept }}s.

<div id="coretopics" />

### Advanced Topics

These topics illustrate the more rare, corner use cases for {{ concept }}s.

<div id="advancedtopics" />

{% if status %}

## Obtaining {{ concept }} status

{{ status }}

{% else %}

{% include templates/_errorthrower.md missing_block='status' heading='Retrieving status for a (Concept)' purpose='explains how to retrieve a status description for this object.' %}

{% endif %}

<!-- continuing the "if concept" if/then: -->

{% else %}

### ERROR: You must define a "concept" variable
{: style="color:red" }

This template requires a variable called `concept` that is simply the name of the
concept for which you are giving an overview. This will be displayed in the
headings for the document.

To get rid of this message and take advantage of this template, define `concept`:

```liquid
{% raw %}{% assign concept="Replication Controller" %}{% endraw %}
```

Complete this task, then we'll walk you through preparing the rest of the document.

{% endif %}

