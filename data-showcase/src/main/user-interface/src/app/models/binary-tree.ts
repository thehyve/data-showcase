/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

export type LexemeType = 'and' | 'or' | 'string' | 'not';

export class Lexeme {
  type: LexemeType;
  value: string;

  static forType(type: LexemeType): Lexeme {
    let result = new Lexeme();
    result.type = type;
    return result;
  }
}

export class BinaryTree {
  lexeme: Lexeme;
  left: BinaryTree;
  right: BinaryTree;

  static forBranches(type: LexemeType, left: BinaryTree, right: BinaryTree) : BinaryTree {
    let result = new BinaryTree();
    result.lexeme = Lexeme.forType(type);
    result.left = left;
    result.right = right;
    return result;
  }
}
