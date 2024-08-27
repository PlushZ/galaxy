<script setup>
import { useFormattedToolHelp } from "composables/formattedToolHelp";
import { useFormattedToolHelpMd } from "composables/formattedToolHelp";

const props = defineProps({
    content: {
        type: String,
        required: true,
    },
    help_style: {
        type: String,
        required: false,
        //default: "markdown", // change to 'rst'
    },
});

console.log("Raw content:", props.content);
console.log("Help style:", props.help_style);

let formattedContent;

if (props.help_style === "markdown") {
    formattedContent = useFormattedToolHelpMd(props.content).formattedContent;
} else {
    formattedContent = useFormattedToolHelp(props.content).formattedContent;
}

console.log("Formatted content:", formattedContent.value);




// dirty solution:
//import { ref, watch } from 'vue';
//const help_style = ref(''); // Create a ref to store the extracted help style
//const formattedContent = ref(''); // Create a ref to store the formatted content
//function extractHelpStyle(content) {
//    const match = content.match(/<p>(markdown|rst)/);
//    return match ? match[1] : 'markdown'; // Default to 'markdown' if not found
//}
//watch(() => props.content, (newContent) => {
//    help_style.value = extractHelpStyle(newContent);
//    if (help_style.value === 'markdown') {
//        formattedContent.value = useFormattedToolHelpMd(newContent).formattedContent;
//    } else {
//        formattedContent.value = useFormattedToolHelp(newContent).formattedContent;
//    }
//}, { immediate: true });
//console.log("Raw content:", props.content);
//console.log("Help style:", help_style.value);

</script>

<template>
    <div class="form-help form-text" v-html="formattedContent" />
</template>

<style lang="scss" scoped>
@import "scss/theme/blue.scss";

.form-help {
    &:deep(h3) {
        font-size: $h3-font-size;
        font-weight: bold;
    }

    &:deep(h4) {
        font-size: $h4-font-size;
        font-weight: bold;
    }

    &:deep(h5) {
        font-size: $h5-font-size;
        font-weight: bold;
    }

    &:deep(h6) {
        font-size: $h6-font-size;
        text-decoration: underline;
    }
}
</style>