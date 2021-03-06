/*
LICENSE ...
*/
// Context menus.
Blockly.Msg.DUPLICATE_BLOCK = 'Duplicate';
Blockly.Msg.REMOVE_COMMENT = 'Remove Comment';
Blockly.Msg.ADD_COMMENT = 'Add Comment';
Blockly.Msg.EXTERNAL_INPUTS = 'External Inputs';
Blockly.Msg.INLINE_INPUTS = 'Inline Inputs';
Blockly.Msg.DELETE_BLOCK = 'Delete Block';
Blockly.Msg.DELETE_X_BLOCKS = 'Delete %1 Blocks';
Blockly.Msg.COLLAPSE_BLOCK = 'Collapse Block';
Blockly.Msg.EXPAND_BLOCK = 'Expand Block';
Blockly.Msg.DISABLE_BLOCK = 'Disable Block';
Blockly.Msg.ENABLE_BLOCK = 'Enable Block';
Blockly.Msg.HELP = 'Help';
Blockly.Msg.COLLAPSE_ALL = "Collapse Blocks";
Blockly.Msg.EXPAND_ALL = "Expand Blocks";
Blockly.Arduino = new Blockly.Generator("Arduino");
/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
if (!Blockly.Arduino.RESERVED_WORDS_) {
    Blockly.Arduino.RESERVED_WORDS_ = '';
}
Blockly.Arduino.RESERVED_WORDS_ +=
// http://arduino.cc/en/Reference/HomePage
'setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto,define,include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false,interger, constants,floating,point,void,bookean,char,unsigned,byte,int,word,long,float,double,string,String,array,static, volatile,const,sizeof,pinMode,digitalWrite,digitalRead,analogReference,analogRead,analogWrite,tone,noTone,shiftOut,shitIn,pulseIn,millis,micros,delay,delayMicroseconds,min,max,abs,constrain,map,pow,sqrt,sin,cos,tan,randomSeed,random,lowByte,highByte,bitRead,bitWrite,bitSet,bitClear,bit,attachInterrupt,detachInterrupt,interrupts,noInterrupts';
/**
 * Order of operation ENUMs.
 *
 */
Blockly.Arduino.ORDER_ATOMIC = 0; // 0 "" ...
Blockly.Arduino.ORDER_UNARY_POSTFIX = 1; // expr++ expr-- () [] .
Blockly.Arduino.ORDER_UNARY_PREFIX = 2; // -expr !expr ~expr ++expr --expr
Blockly.Arduino.ORDER_MULTIPLICATIVE = 3; // * / % ~/
Blockly.Arduino.ORDER_ADDITIVE = 4; // + -
Blockly.Arduino.ORDER_SHIFT = 5; // << >>
Blockly.Arduino.ORDER_RELATIONAL = 6; // is is! >= > <= <
Blockly.Arduino.ORDER_EQUALITY = 7; // == != === !==
Blockly.Arduino.ORDER_BITWISE_AND = 8; // &
Blockly.Arduino.ORDER_BITWISE_XOR = 9; // ^
Blockly.Arduino.ORDER_BITWISE_OR = 10; // |
Blockly.Arduino.ORDER_LOGICAL_AND = 11; // &&
Blockly.Arduino.ORDER_LOGICAL_OR = 12; // ||
Blockly.Arduino.ORDER_CONDITIONAL = 13; // expr ? expr : expr
Blockly.Arduino.ORDER_ASSIGNMENT = 14; // = *= /= ~/= %= += -= <<= >>= &= ^= |=
Blockly.Arduino.ORDER_NONE = 99; // (...)
/*
 * Arduino Board profiles
 *
 */
var profile = {
    arduino: {
        description: "Arduino standard-compatible board",
        digital: [
            ["1", "1"],
            ["2", "2"],
            ["3", "3"],
            ["4", "4"],
            ["5", "5"],
            ["6", "6"],
            ["7", "7"],
            ["8", "8"],
            ["9", "9"],
            ["10", "10"],
            ["11", "11"],
            ["12", "12"],
            ["13", "13"],
            ["A0", "A0"],
            ["A1", "A1"],
            ["A2", "A2"],
            ["A3", "A3"],
            ["A4", "A4"],
            ["A5", "A5"]
        ],
        analog: [
            ["A0", "A0"],
            ["A1", "A1"],
            ["A2", "A2"],
            ["A3", "A3"],
            ["A4", "A4"],
            ["A5", "A5"]
        ],
        serial: 9600
    },
    arduino_mega: {
        description: "Arduino Mega-compatible board"
        //53 digital
        //15 analog
    }
}
//set default profile to arduino standard-compatible board
profile["default"] = profile["arduino"];
/**
 * Initialise the database of variable names.
 */
Blockly.Arduino.init = function() {
    // Create a dictionary of definitions to be printed before setups.
    Blockly.Arduino.definitions_ = {};
    // Create a dictionary of setups to be printed before the code.
    Blockly.Arduino.setups_ = {};
    if (Blockly.Variables) {
        if (!Blockly.Arduino.variableDB_) {
            Blockly.Arduino.variableDB_ = new Blockly.Names(Blockly.Arduino.RESERVED_WORDS_);
        } else {
            Blockly.Arduino.variableDB_.reset();
        }
    }
};
/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.Arduino.finish = function(code) {
    // Indent every line.
    code = '  ' + code.replace(/\n/g, '\n  ');
    code = code.replace(/\n\s+$/, '\n');
    code = 'void loop() \n{\n' + code + '\n}';
    // Convert the definitions dictionary into a list.
    var imports = [];
    var initial_definitions = [];
    var definitions = [];
    var variables=[];
    for (var name in Blockly.Arduino.definitions_) {
        var def = Blockly.Arduino.definitions_[name];
        if (def.match(/^#include/)) {
            imports.push(def);
        } 
        else if (name.search('declare_var')>=0){
            variables.push(def);
        }
        else {
            initial_definitions.push(def);
        }
    }
    definitions = Blockly.Arduino.orderDefinitions(initial_definitions);
    // Convert the setups dictionary into a list.
    var setups = [];
    for (var name in Blockly.Arduino.setups_) {
        setups.push(Blockly.Arduino.setups_[name]);
    }
    var allDefs = imports.join('\n') + '\n\n/***   Global variables   ***/\n' + variables.join('') + '\n\n/***   Function declaration   ***/\n' + definitions[0] + '\nvoid setup() \n{\n  ' + setups.join('\n  ') + '\n}' + '\n\n';
    var allCode = allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n\n\n') + code + '\n\n/***   Function definition   ***/\n' + definitions[1];
    allCode = allCode.replace(/&quot;/g, '"');
    allCode = allCode.replace(/&amp;quot;/g, '"');
    allCode = allCode.replace(/quot;/g, '"');
    allCode = allCode.replace(/&amp;/g, "&");
    allCode = allCode.replace(/amp;/g, "");
    allCode = allCode.replace(/&lt;/g, '<');
    allCode = allCode.replace(/lt;/g, '<');
    allCode = allCode.replace(/&gt;/g, '>');
    allCode = allCode.replace(/gt;/g, '>');
    return allCode;
};
/**
 *Function that orders the function definitions if any function is declared within another one
 */
Blockly.Arduino.orderDefinitions = function(definitions) {
    var func_names = [];
    var var_declarations = [];
    var func_definitions = [];
    for (var i in definitions) {
        var name = definitions[i].substring(0, definitions[i].search('\\)') + 1);
        name.replace('\n', '');
        if (name !== '') {
            name += ';\n';
            func_names += (name);
            func_definitions += definitions[i];
        }
    }
    return [ func_names, func_definitions];
};
/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.Arduino.scrubNakedValue = function(line) {
    return line + ';\n';
};
/**
 * Encode a string as a properly escaped Arduino string, complete with quotes.
 * @param {string} string Text to encode.
 * @return {string} Arduino string.
 * @private
 */
Blockly.Arduino.quote_ = function(string) {
    // TODO: This is a quick hack.  Replace with goog.string.quote
    string = string.replace(/\\/g, '\\\\').replace(/\n/g, '\\\n').replace(/\$/g, '\\$').replace(/'/g, '\\\'');
    return '\"' + string + '\"';
};
/**
 * Common tasks for generating Arduino from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Arduino code created for this block.
 * @return {string} Arduino code with comments and subsequent blocks added.
 * @this {Blockly.CodeGenerator}
 * @private
 */
Blockly.Arduino.scrub_ = function(block, code) {
    if (code === null) {
        // Block has handled code generation itself.
        return '';
    }
    var commentCode = '';
    // Only collect comments for blocks that aren't inline.
    if (!block.outputConnection || !block.outputConnection.targetConnection) {
        // Collect comment for this block.
        var comment = block.getCommentText();
        if (comment) {
            commentCode += Blockly.Generator.prefixLines(comment, '// ') + '\n';
        }
        // Collect comments for all value arguments.
        // Don't collect comments for nested statements.
        for (var x = 0; x < block.inputList.length; x++) {
            if (block.inputList[x].type == Blockly.INPUT_VALUE) {
                var childBlock = block.inputList[x].connection.targetBlock();
                if (childBlock) {
                    var comment = Blockly.Generator.allNestedComments(childBlock);
                    if (comment) {
                        commentCode += Blockly.Generator.prefixLines(comment, '// ');
                    }
                }
            }
        }
    }
    var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    var nextCode = this.blockToCode(nextBlock);
    return commentCode + code + nextCode;
};
Blockly.Generator.prefixLines = function(text, prefix) {
    return prefix + text.replace(/\n(.)/g, '\n' + prefix + '$1');
};
/**
 * Recursively spider a tree of blocks, returning all their comments.
 * @param {!Blockly.Block} block The block from which to start spidering.
 * @return {string} Concatenated list of comments.
 */
Blockly.Generator.allNestedComments = function(block) {
    var comments = [];
    var blocks = block.getDescendants();
    for (var x = 0; x < blocks.length; x++) {
        var comment = blocks[x].getCommentText();
        if (comment) {
            comments.push(comment);
        }
    }
    // Append an empty string to create a trailing line break when joined.
    if (comments.length) {
        comments.push('');
    }
    return comments.join('\n');
};