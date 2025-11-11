
from searcher.utils.patterns import HIGHLIGHT_FIELDS

def build_highlight():
	return {
		"fields": {field: {"pre_tags": ["<mark>"], "post_tags": ["</mark>"]} for field in HIGHLIGHT_FIELDS},
		"require_field_match": False
	}
