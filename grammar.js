/**
 * @file Tempo Choreographic Programming Language
 * @author Viktor Strate Kløvedal <viktorstrate@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "tempo",

  rules: {
    // TODO: add the actual grammar rules
    source_file: ($) => "hello",
  },
});
