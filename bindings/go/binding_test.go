package tree_sitter_tempo_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_tempo "github.com/tempo-lang/tree-sitter-tempo/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_tempo.Language())
	if language == nil {
		t.Errorf("Error loading Tempo grammar")
	}
}
