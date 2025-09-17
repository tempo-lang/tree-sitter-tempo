/**
 * @file Tempo Choreographic Programming Language
 * @author Viktor Strate Kløvedal <viktorstrate@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'tempo',

  supertypes: $ => [$.definition, $.value_type, $.expression],

  rules: {
    source_file: $ => $.definition,
    definition: $ => choice($.function_definition),
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
    function_param: $ => seq($.identifier, ':', $.value_type),
    _role_type: $ => choice($.role_type_shared, $.role_type_normal),
    role_type_shared: $ =>
      seq('[', $.identifier, repeat(seq(',', $.identifier)), ']'),
    role_type_normal: $ =>
      choice(
        $.identifier,
        seq('(', $.identifier, repeat(seq(',', $.identifier)), ')'),
      ),
    identifier: $ => choice(/\_[a-zA-Z_0-9]+/, /[a-zA-Z][a-zA-Z_0-9]*/),
    value_type: $ =>
      choice($.async_type, $.list_type, $.closure_type, $.named_type),
    async_type: $ => seq('async', $.value_type),
    list_type: $ => seq('[', $.value_type, ']'),
    closure_type: $ =>
      seq('func', '@', $._role_type, '()', optional($.value_type)),
    named_type: $ => $._role_ident,
    _role_ident: $ => seq($.identifier, optional(seq('@', $._role_type))),
    block: $ => seq('{', '}'),
    expression: $ => choice($.identifier),
  },
})
