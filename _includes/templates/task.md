* TOC
{: toc}

{% if page.concept_rankings %}{% else %}
{% include templates/_errorthrower.md missing_block='concept_rankings' tagsblock='true' purpose='provides a list of associated concepts that pertain to this topic.' tagname='concept' tieroneexample='pod' tiertwoexample='container'%}
{% endif %}

{% if purpose %}

## Purpose

{{ purpose }}

{% else %}

{% include templates/_errorthrower.md missing_block='purpose' heading='Purpose' purpose='states, in one sentence, what the purpose of this document is, so that the user will know what they are able to achieve if they follow the provided steps.' %}

{% endif %}

{% if recommended_background %}

## Recommended background

{{ recommended_background }}

{% else %}

{% include templates/_errorthrower.md missing_block='recommended_background' heading='Recommended background' purpose='lists assumptions of baseline knowledge that you expect the user to have before reading ahead.' %}

{% endif %}


{% if step_by_step %}

## Step by step

{{ step_by_step }}

{% else %}

{% include templates/_errorthrower.md missing_block='step_by_step' heading='Step by step' purpose='lists a series of linear, numbered steps that accomplish the described task.' %}

{% endif %}

{% if options_and_considerations %}

## Options and considerations

{{ options_and_considerations }}

{% endif %}

<script language="JavaScript">
$( document ).ready(function() {
  // When the document loads, get the metadata JSON, and kick off tbl render
  $.get("/metadata.txt", function(data, status) {
    metadata = $.parseJSON(data);
    mainLogic();
  });
});
function mainLogic()
{
  topicsFilter("concept","pod","coretopics",1);
  topicsFilter("concept","pod","advancedtopics",2);
  showTags();
}
</script>
{% include tagfooter.md %}
