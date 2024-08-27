import { getAppRoot } from "onload/loadConfig";
import { computed, unref } from "vue";
import MarkdownIt from "markdown-it";

const mdParser = new MarkdownIt();

/**
 * Increase the heading levels of all child nodes of a node
 * @param {HTMLElement} node
 * @param {number} increaseBy
 */
function increaseHeadingLevels(node, increaseBy) {
    [5, 4, 3, 2, 1].forEach((level) => {
        increaseHeadingLevel(node, level, increaseBy);
    });
}

/**
 * Increase a single heading level
 */
function increaseHeadingLevel(node, level, increaseBy) {
    // cap target level at 6 (highest heading level)
    let targetLevel = level + increaseBy;
    if (targetLevel > 6) {
        targetLevel = 6;
    }

    const headings = node.getElementsByTagName(`h${level}`);

    // create new headings with target level and copy contents + attributes
    Array.from(headings).forEach((heading) => {
        const newTag = document.createElement(`h${targetLevel}`);
        newTag.innerHTML = heading.innerHTML;

        Array.from(heading.attributes).forEach((attribute) => {
            newTag.setAttribute(attribute.name, attribute.value);
        });

        heading.insertAdjacentElement("beforebegin", newTag);
        heading.remove();
    });
}

function htmlToMarkdown(html) {
    // create a temporary DOM element to parse the HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    // extract the text from <p> tags and reconstruct Markdown
    const paragraphs = Array.from(tempDiv.querySelectorAll("p"));
    const markdown = paragraphs.map(p => {
        const text = p.textContent;
        // Convert the <p> tags into paragraphs in Markdown
        return text;
    }).join("\n\n");

    return markdown;
}

export function useFormattedToolHelpMd(helpContent) {
    const formattedContent = computed(() => {
        const markdownContent = htmlToMarkdown(helpContent);
        const htmlContent = mdParser.render(markdownContent);
        return htmlContent;
    });

    return { formattedContent };
}

export function useFormattedToolHelp(helpContent, headingLevelIncrease = 2) {
    const formattedContent = computed(() => {
        const node = document.createElement("div");
        node.innerHTML = unref(helpContent);

        const links = node.getElementsByTagName("a");
        Array.from(links).forEach((link) => {
            link.target = "_blank";
        });

        const images = node.getElementsByTagName("img");
        Array.from(images).forEach((image) => {
            if (image.src.includes("admin_toolshed")) {
                image.src = getAppRoot() + image.src;
            }
        });

        increaseHeadingLevels(node, unref(headingLevelIncrease));

        return node.innerHTML;
    });

    return { formattedContent };
}

//export function useFormattedToolHelp(helpContent, headingLevelIncrease = 2) {
//    const formattedContent = computed(() => {
//        const content = unref(helpContent);
//        const node = document.createElement("div");

        // Determine the style and extract the actual help content
//        const styleMatch = content.match(/<help(?:\s+style="(markdown|rst)")?>/i);
//        const style = styleMatch ? styleMatch[1] : "markdown";

//        console.log("Help content before parsing:", helpContent);
//        console.log("Detected style:", style);

        // Parse the help text based on the style
//        let parsedContent = "";
//        if (style === "markdown") {
//            parsedContent = mdParser.render(content);
//        } else {
//            parsedContent = content
//        }

//        console.log("HTML content after parsing:", parsedContent);

//        node.innerHTML = parsedContent;

//        const links = node.getElementsByTagName("a");
//        Array.from(links).forEach((link) => {
//            link.target = "_blank";
//        });

//        const images = node.getElementsByTagName("img");
//        Array.from(images).forEach((image) => {
//            if (image.src.includes("admin_toolshed")) {
//                image.src = getAppRoot() + image.src;
//            }
//        });

//        increaseHeadingLevels(node, unref(headingLevelIncrease));

//        return node.innerHTML;
//    });

//    return { formattedContent };
//}
