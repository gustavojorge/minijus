import re

SENSITIVE_PATTERNS = {
	"MENOR_INFRATOR": [
		r"menor\s+infrator",
		r"exploracao\s+do\s+trabalho\s+infantil",
		r"direito\s+da\s+crianca\s+e\s+do\s+adolescente\s+ato\s+infracional",
	],
	"VIOLENCIA_DOMESTICA": [
		r"decorrente\s+de\s+violencia\s+domestica",
		r"violencia\s+domestica\s+contra\s+a\s+mulher",
		r"lesao\s+corporal\s+decorrente\s+de\s+violencia\s+domestica",
	],
	"CRIME_ODIO": [
		r"feminicidio",
		r"xenofobia",
		r"racismo",
	],
}

COMPILED_PATTERNS = {
	kind: [re.compile(p, re.IGNORECASE) for p in patterns]
	for kind, patterns in SENSITIVE_PATTERNS.items()
}
