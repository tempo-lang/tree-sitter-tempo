/**
 * @file Tempo Choreographic Programming Language
 * @author Viktor Strate Kløvedal <viktorstrate@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'tempo',

  supertypes: $ => [$.definition, $.value_type, $.statement, $.expression],

  rules: {
    source_file: $ => $.definition,
    definition: $ =>
      choice(
        $.function_definition,
        $.struct_definition,
        $.interface_definition,
      ),

    // functions
    function_definition: $ => seq($.function_signature, field('body', $.block)),
    function_signature: $ =>
      seq(
        'func',
        optional(seq('@', $._role_type)),
        field('name', $.identifier),
        field('parameters', $.parameter_list),
        field('return_type', optional($.value_type)),
      ),
    parameter_list: $ =>
      seq(
        '(',
        optional(seq($.function_param, repeat(seq(',', $.function_param)))),
        ')',
      ),
    function_param: $ => seq(field('name', $.identifier), ':', $.value_type),

    // structs
    struct_definition: $ => 'struct', // TODO: parse structs

    // interfaces
    interface_definition: $ => 'interface', // TODO: parse interfaces

    // types
    _role_type: $ => choice($.role_type_shared, $.role_type_normal),
    role_type_shared: $ =>
      seq('[', $.identifier, repeat(seq(',', $.identifier)), ']'),
    role_type_normal: $ =>
      choice(
        $.identifier,
        seq('(', $.identifier, repeat(seq(',', $.identifier)), ')'),
      ),
    value_type: $ =>
      choice($.async_type, $.list_type, $.closure_type, $.named_type),
    async_type: $ => seq('async', $.value_type),
    list_type: $ => seq('[', $.value_type, ']'),
    closure_type: $ =>
      seq('func', '@', $._role_type, '()', optional($.value_type)),
    named_type: $ => $._role_ident,
    _role_ident: $ => seq($.identifier, optional(seq('@', $._role_type))),

    // statements
    block: $ => seq('{', repeat($.statement), '}'),
    statement: $ =>
      choice(
        $.stmt_expression,
        $.stmt_variable_decl,
        // TODO: if, while, return, assign
      ),
    stmt_expression: $ => seq($.expression, ';'),
    stmt_variable_decl: $ =>
      seq(
        'let',
        field('name', $.identifier),
        optional(seq(':', $.value_type)),
        '=',
        field('value', $.expression),
        ';',
      ),

    // expressions
    expression: $ =>
      choice(
        $.identifier,
        $._literal,
        // TODO: bin op, closure, struct, call, field access, index, list, com, await, group
      ),
    identifier: $ => choice(/\_[a-zA-Z_0-9]+/, /[a-zA-Z][a-zA-Z_0-9]*/),
    _literal: $ =>
      choice(
        $.string_literal,
        $.boolean_literal,
        $.integer_literal,
        $.float_literal,
      ),

    // literals
    string_literal: $ =>
      seq(
        '"',
        repeat(choice(/[^"\\]/, seq('\\', choice('"', '\\', 'n', 'r', 't')))),
        '"',
      ),
    boolean_literal: $ => choice('true', 'false'),
    float_literal: $ => choice(/[0-9]+\.[0-9]+/, /\.[0-9]+/, /[0-9]+\./),
    integer_literal: $ => /[0-9]+/,
  },
})
