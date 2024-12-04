class GetBooruTag():
    @classmethod
    def INPUT_TYPES(s):
        return {
            "optional": {
                "url": ('STRING', {'multiline': False}),
                "text_a": ("STRING", {"multiline": True, "dynamicPrompts": True}),
                "text_b": ("STRING", {"multiline": True, "dynamicPrompts": True}),
                "text_c": ("STRING", {"multiline": True, "dynamicPrompts": True}),
            },
            "hidden": { "my_unique_id": "UNIQUE_ID",},
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("TEXT",)
    FUNCTION = 'gettag'
    CATEGORY = 'Danbooru'

    def gettag(self, url="", text_a="", text_b="", text_c="", my_unique_id=None): 
        out = f"{text_a.rstrip(' ,')},\n\n{text_b.rstrip(' ,')},\n\n{text_c.rstrip(' ,')},"
        return (out,)


NODE_CLASS_MAPPINGS = { 
    'Get Booru Tag 💬ED': GetBooruTag,
}
