class GetBooruTag():
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "url": ('STRING', {'multiline': False}),
                "tags": ('STRING', {'multiline': True}),},
            "hidden": { "my_unique_id": "UNIQUE_ID",},
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("TAG_TEXT",)
    FUNCTION = 'gettag'
    CATEGORY = 'Danbooru'

    def gettag(self, url, tags, my_unique_id): 
        return (tags,)


NODE_CLASS_MAPPINGS = { 
    'Get Booru Tag 💬ED': GetBooruTag,
}
