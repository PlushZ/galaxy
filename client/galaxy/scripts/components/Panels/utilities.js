import _ from "underscore";
import _l from "utils/localization";
import Tools from "mvc/tool/tools";
import { getGalaxyInstance } from "app";
import { getAppRoot } from "onload";

export function getPanelProps(panelComponent) {
    const Galaxy = getGalaxyInstance();
    const appRoot = getAppRoot();
    const storedWorkflowMenuEntries = Galaxy.config.stored_workflow_menu_entries || [];
    return {
        side: "left",
        currentPanel: panelComponent,
        currentPanelProperties: {
            appRoot: getAppRoot(),
            toolsTitle: _l("Tools"),
            isUser: !!(Galaxy.user && Galaxy.user.id),
            workflowsTitle: _l("Workflows"),
            workflows: [
                {
                    title: _l("All workflows"),
                    href: `${appRoot}workflows/list`,
                    id: "list"
                },
                ...storedWorkflowMenuEntries.map(menuEntry => {
                    return {
                        title: menuEntry["stored_workflow"]["name"],
                        href: `${appRoot}workflows/run?id=${menuEntry["encoded_stored_workflow_id"]}`,
                        id: menuEntry["encoded_stored_workflow_id"]
                    };
                })
            ]
        }
    };
}

// create tool search, tool panel, and tool panel view.
export function getToolsLayout() {
    const Galaxy = getGalaxyInstance();
    const tool_search = new Tools.ToolSearch({
        hidden: false
    });
    const tools = new Tools.ToolCollection(Galaxy.config.toolbox);
    const toolPanel = new Tools.ToolPanel({
        tool_search: tool_search,
        tools: tools,
        layout: Galaxy.config.toolbox_in_panel
    });
    return _.map(toolPanel.get("layout").toJSON(), category => {
        return {
            ...category,
            panel_type: getPanelType(category),
            elems: _.map(category.elems, el => {
                const json = el.toJSON();
                json.panel_type = getPanelType(json);
                return json;
            })
        };
    });
}

export function filterToolsLayout(layout, results) {
    if (results) {
        return _.filter(
            _.map(layout, category => {
                return {
                    ...category,
                    elems: (filtered => {
                        return _.filter(filtered, (el, i) => {
                            if (el.panel_type == "label") {
                                return filtered[i + 1] && filtered[i + 1].panel_type == "tool";
                            } else {
                                return true;
                            }
                        });
                    })(
                        _.filter(category.elems, el => {
                            if (el.panel_type == "label") {
                                return true;
                            } else {
                                return results.includes(el.id);
                            }
                        })
                    )
                };
            }),
            category => {
                return category.elems.length || (category.panel_type == "tool" && results.includes(category.id));
            }
        );
    } else {
        return layout;
    }
}

export function getPanelType(el) {
    if (el.model_class.endsWith("ToolSection")) {
        return "section";
    }
    if (el.model_class.endsWith("ToolSectionLabel")) {
        return "label";
    }
    return "tool";
}
