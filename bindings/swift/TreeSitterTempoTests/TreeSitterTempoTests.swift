import XCTest
import SwiftTreeSitter
import TreeSitterTempo

final class TreeSitterTempoTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_tempo())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Tempo grammar")
    }
}
