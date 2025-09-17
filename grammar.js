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

  // conflicts: $ => [[$.role_type_normal, $.expression]],

  rules: {
    source_file: $ => repeat($.definition),
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
    argument_list: $ =>
      seq(
        '(',
        optional(seq($.expression, repeat(seq(',', $.expression)))),
        ')',
      ),

    // structs
    struct_definition: $ =>
      seq(
        'struct',
        optional(seq('@', $._role_type)),
        field('name', $.identifier),
        optional($.struct_implements),
        field('body', $.struct_body),
      ),
    struct_implements: $ =>
      seq('implements', $._role_ident, repeat(seq(',', $._role_ident))),
    struct_body: $ =>
      seq('{', repeat(choice($.struct_field, $.function_definition)), '}'),
    struct_field: $ => seq($.identifier, ':', $.value_type, ';'),

    // interfaces
    interface_definition: $ =>
      seq(
        'interface',
        optional(seq('@', $._role_type)),
        field('name', $.identifier),
        field('body', $.interface_body),
      ),
    interface_body: $ => seq('{', $.interface_method, '}'),
    interface_method: $ => seq($.function_signature, ';'),

    // types
    _role_type: $ => choice($.role_type_shared, $.role_type_normal),
    role_type_shared: $ =>
      prec(2, seq('[', $.identifier, repeat(seq(',', $.identifier)), ']')),
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
        $.stmt_if,
        $.stmt_while,
        $.stmt_return,
        $.stmt_assign,
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
    stmt_if: $ =>
      seq(
        'if',
        field('guard', $.expression),
        field('then', $.block),
        optional(seq('else', field('else', $.block))),
      ),
    stmt_while: $ =>
      seq('while', field('guard', $.expression), field('body', $.block)),
    stmt_return: $ => seq('return', $.expression, ';'),
    stmt_assign: $ =>
      prec(
        -1,
        seq($.identifier, repeat($._assign_specifier), '=', $.expression, ';'),
      ),
    _assign_specifier: $ => choice($.assign_field, $.assign_index),
    assign_field: $ => seq('.', $.identifier),
    assign_index: $ => seq('[', $.expression, ']'),

    // expressions
    expression: $ =>
      choice(
        $.expr_identifier,
        $.expr_literal,
        $.expr_call,
        $.expr_field_access,
        $.expr_index,
        $.expr_list,
        $.expr_com,
        $.expr_await,
        $.expr_group,
        // TODO: bin op, closure, struct
      ),
    identifier: $ => choice(/\_[a-zA-Z_0-9]+/, /[a-zA-Z][a-zA-Z_0-9]*/),
    _literal: $ =>
      choice(
        $.string_literal,
        $.boolean_literal,
        $.integer_literal,
        $.float_literal,
      ),
    expr_identifier: $ =>
      prec(3, seq($.identifier, optional(seq('@', $._role_type)))),
    expr_literal: $ => seq($._literal, optional(seq('@', $._role_type))),
    expr_call: $ => seq($.expression, $.argument_list),
    expr_field_access: $ => seq($.expression, '.', $.identifier),
    expr_index: $ =>
      seq(field('base', $.expression), '[', field('index', $.expression), ']'),
    expr_list: $ =>
      seq(
        '[',
        optional(seq($.expression, repeat(seq(',', $.expression)))),
        ']',
      ),
    expr_com: $ =>
      prec.left(
        seq(
          field('sender', $._role_type),
          '->',
          field('receier', $._role_type),
          $.expression,
        ),
      ),
    expr_await: $ => prec.left(seq('await', $.expression)),
    expr_group: $ => seq('(', $.expression, ')'),

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
