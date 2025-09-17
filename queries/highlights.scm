; highlights.scm

; keywords
"func" @keyword.function
"struct" @keyword
"interface" @keyword
"implements" @keyword
"let" @keyword
"return" @keyword.return
"await" @keyword
"async" @keyword
"while" @keyword.repeat
"if" @keyword.conditional

; comments
(comment) @comment

; functions
(function_signature name: (identifier) @function)

; structs
(struct_definition (identifier) @type)
(struct_implements (identifier) @type)

; interfaces
(interface_definition (identifier) @type)

; types
(named_type (identifier) @type)
(role_type_normal (identifier) @property)
(role_type_shared (identifier) @property)

; statements
(stmt_variable_decl name: (identifier) @variable)
(function_param name: (identifier) @variable)

; literals
(boolean_literal) @boolean
(float_literal) @number.float
(integer_literal) @number
(string_literal) @string

("{" @punctuation.bracket "}" @punctuation.bracket)
("[" @punctuation.bracket "]" @punctuation.bracket)
("(" @punctuation.bracket ")" @punctuation.bracket)
("," @punctuation.delimiter)

; expressions
(expr_com "->" @punctuation)
