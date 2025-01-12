import { app } from "../../scripts/app.js";
import { api } from "../../scripts/api.js";

// function nodeFeedbackHandlerBr(event) {
  // const { node_id, widget_name, type, data } = event.detail;
  // const nodes = app.graph._nodes_by_id;
  // const node = nodes[node_id];

  // if (widget_name === "log") {
    // console.log(`ED_log: ${data}`);
  // }

  // if (node && type === "text") {
    // const widget = node.widgets.find((w) => w.name === widget_name);
    // if (widget) {
      // widget.value = data;
    // }
  // }
// }

// api.addEventListener("feedback_node_br", nodeFeedbackHandlerBr);
//////////////////////////////////////////////////////////

export const findWidgetByName = (node, name) => {
    return node.widgets ? node.widgets.find((w) => w.name === name) : null;
};

const doesInputWithNameExist = (node, name) => {
    return node.inputs ? node.inputs.some((input) => input.name === name) : false;
};

// Create a map of node titles to their respective widget handlers
const nodeWidgetHandlers = {
    "Get Booru Tag 💬ED": {
        'url': handleGetBooruTag
    },
};

// In the main function where widgetLogic is called
function widgetLogic(node, widget) {
    // Retrieve the handler for the current node title and widget name
    const handler = nodeWidgetHandlers[node.comfyClass]?.[widget.name];
    if (handler) {
        handler(node, widget);
    }
}

function htmlUnescape (string) {
	let str = string;
	str = str.replaceAll("&amp;", "&");
	str = str.replaceAll('&quot;', '"');
	str = str.replaceAll("&#035;", "#");
	str = str.replaceAll("&#039;", "'");
	str = str.replaceAll("&lt;", "<");
	str = str.replaceAll("&gt;", ">");
	return str;
}

// Booru_loader_ED Handlers
async function handleGetBooruTag(node, widget) {	
	if (!widget.value.includes('booru')) return;

    const tagsWidget = findWidgetByName(node, "text_b");
	const proxy = 'https://corsproxy.io/?';

    // 태그 설정 함수
    function setTags(tags) {
		let tag_data = htmlUnescape(tags.replaceAll(' ', ', ') + ",");
        tagsWidget.value = tag_data;
    }
    // 에러 표시
    function showError(error) {
        tagsWidget.value = '// ' + error + '\n\n' + tagsWidget.value;
    }

    // 에러 처리 및 데이터 요청 함수
    async function fetchData(url) {
        try {
            const req = await fetch(url);
            if (!req.ok) throw new Error(`HTTP Error! Status Code: ${req.status}`);
            return await req.json();
        } catch (error) {
            showError(error);
            return null;
        }
    }

    if (widget.value.includes('danbooru')) {
        const baseDanbooruUrl = "https://danbooru.donmai.us/";
        const match = /posts\/(\d+)/.exec(widget.value);

        if (match) {
            const url = baseDanbooruUrl + match[0] + '.json';
            const data = await fetchData(url);
            if (data) {
                setTags(data.tag_string_general);				
				console.log('Tags loading success :\n' + url );
            } else {
				showError('ERROR: Tags was not found in JSON file.');
			}
        } else {
            showError('ERROR: ID was not found in Danbooru URL.');
        }
    }
    else if (widget.value.includes('gelbooru')) {
        const baseGelbooruUrl = "https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&pid=38&";
        const match = /id=(\d+)/.exec(widget.value);

        if (match) {
			const url = proxy + baseGelbooruUrl + match[0];
            const data = await fetchData(url);
            if (data && data.post && data.post[0]) {
                setTags(data.post[0].tags);				
				console.log('Tags loading success :\n' + url );
            } else {
				showError('ERROR: Tags was not found in JSON file.');
			}
        } else {
            showError('ERROR: ID was not found in Gelbooru URL.');
        }
    }
	widget.value = widget.value.replaceAll("booru", "Booru");
}


app.registerExtension({
    name: "GetBooruTag.ed",
    nodeCreated(node) {
        for (const w of node.widgets || []) {
            let widgetValue = w.value;

            // Store the original descriptor if it exists
            let originalDescriptor = Object.getOwnPropertyDescriptor(w, 'value');
			if (!originalDescriptor) {
				originalDescriptor = Object.getOwnPropertyDescriptor(w.constructor.prototype, 'value');
			}

            widgetLogic(node, w);

            Object.defineProperty(w, 'value', {
                get() {
                    // If there's an original getter, use it. Otherwise, return widgetValue.
                    let valueToReturn = originalDescriptor && originalDescriptor.get
                        ? originalDescriptor.get.call(w)
                        : widgetValue;

                    return valueToReturn;
                },
                set(newVal) {

                    // If there's an original setter, use it. Otherwise, set widgetValue.
                    if (originalDescriptor && originalDescriptor.set) {
                        originalDescriptor.set.call(w, newVal);
                    } else {
                        widgetValue = newVal;
                    }

                    widgetLogic(node, w);
                }
            });
        }
    }
});

