def build_filters(request):
    filters = []
    if getattr(request, "filters", None):
        if getattr(request.filters, "court", None):
            filters.append({"term": {"court": request.filters.court}})

        if getattr(request.filters, "date", None):
            op_map = {"<": "lt", "=": "gte", ">": "gt"}
            operator = op_map.get(request.filters.date.operator)
            if operator:
                filters.append({
                    "range": {
                        "date": {operator: request.filters.date.date}
                    }
                })
    return filters