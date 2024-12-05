from server import PromptServer

class GetBooruTag():
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "url": ("STRING", {"default": "None", "multiline": False}),
            },
            "optional": {                
                "text_a": ("STRING", {"multiline": True, "dynamicPrompts": True}),
                "text_b": ("STRING", {"multiline": True, "dynamicPrompts": True}),
                "text_c": ("STRING", {"multiline": True, "dynamicPrompts": True}),
            },
            "hidden": { "my_unique_id": "UNIQUE_ID",},
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("STRING",)
    FUNCTION = 'gettag'
    CATEGORY = 'Efficiency Nodes/Simple Eval'

    def gettag(self, url, text_a="", text_b="", text_c="", my_unique_id=None):
        strip = " ,\n"
        out = ""
        if text_a != "":
            out = f"{text_a.lstrip(strip).rstrip(strip)},\n\n"
        if text_b != "":
            out += f"{text_b.lstrip(strip).rstrip(strip)},\n\n"
        if text_c != "":
            out += f"{text_c.lstrip(strip).rstrip(strip)}"
        out = f"{out.rstrip(strip)},"
        PromptServer.instance.send_sync("feedback_node_br", {"node_id": my_unique_id, "widget_name": "url", "type": "text", "data": "None"})
        return (out,)


NODE_CLASS_MAPPINGS = { 
    'Get Booru Tag 💬ED': GetBooruTag,
}
