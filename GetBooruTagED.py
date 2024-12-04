class GetBooruTag():
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "url": ('STRING', {'multiline': False}),
            },
            "optional": {                
                "text_a": ("STRING", {"multiline": True, "dynamicPrompts": True}),
                "text_b": ("STRING", {"multiline": True, "dynamicPrompts": True}),
                "text_c": ("STRING", {"multiline": True, "dynamicPrompts": True}),
            },
            "hidden": { "my_unique_id": "UNIQUE_ID",},
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("TEXT",)
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
        return (out,)


NODE_CLASS_MAPPINGS = { 
    'Get Booru Tag 💬ED': GetBooruTag,
}
