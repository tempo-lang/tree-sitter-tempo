; locals.scm

(function_param name: (identifier) @local.definition)
(stmt_variable_decl (identifier) @local.definition)
(expr_identifier) @local.reference

[
  (block)
  (function_definition)
  (struct_body)
  (interface_body)
] @local.scope
