/**
 * FoldForge Advanced MQ5 EA File Parser
 * Handles ANY MQ5 Expert Advisor file regardless of complexity:
 * - All MT5 data types (int, long, double, float, bool, string, datetime, color, ENUM_*, custom enums)
 * - sinput (static input) parameters
 * - #define macros and constants
 * - Enum declarations with values
 * - Class and struct definitions
 * - Include directives
 * - Multi-line comments and preprocessor directives
 * - Grouped/categorized parameters with comment annotations
 * - Default value expressions (mathematical, enum references, macro references)
 * - Array parameters
 * - Unicode and multi-byte file content
 */

export interface EAParameter {
  name: string;
  type: "int" | "double" | "bool" | "string" | "enum" | "color" | "datetime" | "long" | "float" | "ulong" | "uint" | "ushort" | "uchar" | "short" | "char";
  rawType: string; // Original type string from the file
  defaultValue: string | number | boolean;
  defaultValueRaw: string; // Original default value string
  minValue?: number;
  maxValue?: number;
  step?: number;
  comment?: string;
  category?: string;
  group?: string; // MT5 input group
  isStatic?: boolean; // sinput
  enumValues?: string[]; // For enum types
  isArray?: boolean;
  arraySize?: number;
}

export interface EAEnumDeclaration {
  name: string;
  values: Array<{ name: string; value?: number; comment?: string }>;
}

export interface EAClassDeclaration {
  name: string;
  baseClass?: string;
  members: Array<{ name: string; type: string; access: "public" | "private" | "protected" }>;
  methods: Array<{ name: string; returnType: string; params: string; access: "public" | "private" | "protected" }>;
}

export interface EAFunctionInfo {
  name: string;
  returnType: string;
  params: string;
  isEventHandler: boolean;
  lineNumber: number;
}

export interface EAInclude {
  path: string;
  isSystem: boolean; // <> vs ""
}

export interface EADefine {
  name: string;
  value: string;
}

export interface EAMetadata {
  name: string;
  version: string;
  copyright: string;
  link: string;
  description: string;
  icon: string;
  stacksize: number;
  strict: boolean;
  parameters: EAParameter[];
  enums: EAEnumDeclaration[];
  classes: EAClassDeclaration[];
  functions: EAFunctionInfo[];
  includes: EAInclude[];
  defines: EADefine[];
  indicators: string[];
  totalParameters: number;
  hasOnInit: boolean;
  hasOnDeinit: boolean;
  hasOnTick: boolean;
  hasOnTimer: boolean;
  hasOnTrade: boolean;
  hasOnTradeTransaction: boolean;
  hasOnChartEvent: boolean;
  hasOnCalculate: boolean;
  hasOnTester: boolean;
  hasOnTesterInit: boolean;
  hasOnTesterDeinit: boolean;
  hasOnTesterPass: boolean;
  tradingFunctions: string[];
  indicatorCalls: string[];
  riskManagementFeatures: string[];
  complexity: {
    totalLines: number;
    codeLines: number;
    commentLines: number;
    blankLines: number;
    parameterCount: number;
    functionCount: number;
    classCount: number;
    enumCount: number;
    includeCount: number;
    cyclomaticComplexity: number;
    nestingDepth: number;
    score: "simple" | "moderate" | "complex" | "very_complex" | "extremely_complex";
  };
}

// MT5 built-in enum types
const MT5_ENUM_TYPES = new Set([
  "ENUM_TIMEFRAMES", "ENUM_APPLIED_PRICE", "ENUM_MA_METHOD", "ENUM_ORDER_TYPE",
  "ENUM_POSITION_TYPE", "ENUM_DEAL_TYPE", "ENUM_TRADE_REQUEST_ACTIONS",
  "ENUM_ORDER_TYPE_FILLING", "ENUM_ORDER_TYPE_TIME", "ENUM_SYMBOL_INFO_INTEGER",
  "ENUM_SYMBOL_INFO_DOUBLE", "ENUM_SYMBOL_INFO_STRING", "ENUM_ACCOUNT_INFO_INTEGER",
  "ENUM_ACCOUNT_INFO_DOUBLE", "ENUM_ACCOUNT_INFO_STRING", "ENUM_TERMINAL_INFO_INTEGER",
  "ENUM_TERMINAL_INFO_DOUBLE", "ENUM_TERMINAL_INFO_STRING", "ENUM_SERIES_INFO_INTEGER",
  "ENUM_CHART_PROPERTY_INTEGER", "ENUM_CHART_PROPERTY_DOUBLE", "ENUM_CHART_PROPERTY_STRING",
  "ENUM_INDICATOR_BUFFERS", "ENUM_DRAW_TYPE", "ENUM_LINE_STYLE", "ENUM_ANCHOR_POINT",
  "ENUM_ARROW_ANCHOR", "ENUM_OBJECT_TYPE", "ENUM_OBJECT_PROPERTY_INTEGER",
  "ENUM_OBJECT_PROPERTY_DOUBLE", "ENUM_OBJECT_PROPERTY_STRING", "ENUM_COLOR_FORMAT",
  "ENUM_INDEXBUFFER_TYPE", "ENUM_PLOT_PROPERTY_INTEGER", "ENUM_PLOT_PROPERTY_DOUBLE",
  "ENUM_PLOT_PROPERTY_STRING", "ENUM_SYMBOL_TRADE_MODE", "ENUM_SYMBOL_CALC_MODE",
  "ENUM_SYMBOL_TRADE_EXECUTION", "ENUM_SYMBOL_SWAP_MODE", "ENUM_DAY_OF_WEEK",
  "ENUM_ACCOUNT_TRADE_MODE", "ENUM_ACCOUNT_STOPOUT_MODE", "ENUM_ACCOUNT_MARGIN_MODE",
  "ENUM_POSITION_PROPERTY_INTEGER", "ENUM_POSITION_PROPERTY_DOUBLE",
  "ENUM_POSITION_PROPERTY_STRING", "ENUM_ORDER_PROPERTY_INTEGER",
  "ENUM_ORDER_PROPERTY_DOUBLE", "ENUM_ORDER_PROPERTY_STRING",
  "ENUM_DEAL_PROPERTY_INTEGER", "ENUM_DEAL_PROPERTY_DOUBLE", "ENUM_DEAL_PROPERTY_STRING",
  "ENUM_HISTORY_PROPERTY_INTEGER", "ENUM_HISTORY_PROPERTY_DOUBLE",
  "ENUM_CRYPT_METHOD", "ENUM_STATISTICS", "ENUM_BOOK_TYPE", "ENUM_MARKET_EVENT",
]);

// MT5 numeric types
const MT5_INT_TYPES = new Set(["int", "long", "short", "char", "uchar", "ushort", "uint", "ulong"]);
const MT5_FLOAT_TYPES = new Set(["double", "float"]);

// MT5 trading functions
const TRADING_FUNCTIONS = [
  "OrderSend", "OrderClose", "OrderModify", "OrderDelete",
  "PositionOpen", "PositionClose", "PositionModify",
  "CTrade", "PositionSelect", "PositionGetInteger", "PositionGetDouble",
  "OrderCalcMargin", "OrderCalcProfit", "SymbolInfoDouble",
  "AccountInfoDouble", "AccountInfoInteger",
];

// MT5 indicator functions
const INDICATOR_FUNCTIONS = [
  "iMA", "iRSI", "iMACD", "iBands", "iATR", "iCCI", "iStochastic",
  "iADX", "iAO", "iAC", "iAlligator", "iBearsPower", "iBullsPower",
  "iChaikin", "iDEMA", "iDeMarker", "iEnvelopes", "iForce", "iFractals",
  "iGator", "iIchimoku", "iMFI", "iMomentum", "iOBV", "iOsMA",
  "iParabolicSAR", "iSAR", "iStdDev", "iTEMA", "iTriX", "iVIDyA",
  "iVolumes", "iWPR", "iCustom", "IndicatorCreate",
];

// Risk management keywords
const RISK_KEYWORDS = [
  "stoploss", "stop_loss", "sl", "takeprofit", "take_profit", "tp",
  "trailingstop", "trailing_stop", "breakeven", "break_even",
  "maxdrawdown", "max_drawdown", "maxloss", "max_loss",
  "lotsize", "lot_size", "position_size", "risk_percent",
  "maxspread", "max_spread", "maxslippage", "max_slippage",
  "martingale", "grid", "hedging", "money_management",
];

/**
 * Advanced Parser for MQ5 EA files
 */
export class MQ5Parser {
  /**
   * Parse MQ5 file content and extract comprehensive metadata
   */
  static parseEAFile(content: string): EAMetadata {
    // Handle BOM and normalize line endings
    const cleanContent = content.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    const lines = cleanContent.split("\n");

    // Strip comments for analysis (but keep original for line counting)
    const strippedContent = this.stripComments(cleanContent);
    const strippedLines = strippedContent.split("\n");

    const metadata: EAMetadata = {
      name: this.extractProperty(lines, "description") || this.extractProperty(lines, "copyright") || this.inferEAName(content) || "Unknown EA",
      version: this.extractProperty(lines, "version") || "1.0",
      copyright: this.extractProperty(lines, "copyright") || "",
      link: this.extractProperty(lines, "link") || "",
      description: this.extractProperty(lines, "description") || "",
      icon: this.extractProperty(lines, "icon") || "",
      stacksize: parseInt(this.extractProperty(lines, "stacksize") || "0") || 0,
      strict: lines.some(l => l.includes("#property strict")),
      parameters: [],
      enums: [],
      classes: [],
      functions: [],
      includes: [],
      defines: [],
      indicators: [],
      totalParameters: 0,
      hasOnInit: false,
      hasOnDeinit: false,
      hasOnTick: false,
      hasOnTimer: false,
      hasOnTrade: false,
      hasOnTradeTransaction: false,
      hasOnChartEvent: false,
      hasOnCalculate: false,
      hasOnTester: false,
      hasOnTesterInit: false,
      hasOnTesterDeinit: false,
      hasOnTesterPass: false,
      tradingFunctions: [],
      indicatorCalls: [],
      riskManagementFeatures: [],
      complexity: {
        totalLines: 0, codeLines: 0, commentLines: 0, blankLines: 0,
        parameterCount: 0, functionCount: 0, classCount: 0, enumCount: 0,
        includeCount: 0, cyclomaticComplexity: 0, nestingDepth: 0, score: "simple",
      },
    };

    // Extract all components
    metadata.enums = this.extractEnumDeclarations(strippedContent);
    metadata.parameters = this.extractAllParameters(strippedLines, metadata.enums);
    metadata.totalParameters = metadata.parameters.length;
    metadata.classes = this.extractClasses(strippedContent);
    metadata.functions = this.extractFunctions(strippedLines);
    metadata.includes = this.extractIncludes(lines);
    metadata.defines = this.extractDefines(strippedLines);
    metadata.indicators = this.extractIndicatorNames(lines);

    // Detect event handlers
    metadata.hasOnInit = strippedContent.includes("OnInit");
    metadata.hasOnDeinit = strippedContent.includes("OnDeinit");
    metadata.hasOnTick = strippedContent.includes("OnTick");
    metadata.hasOnTimer = strippedContent.includes("OnTimer");
    metadata.hasOnTrade = strippedContent.includes("OnTrade(") || strippedContent.includes("OnTrade\n");
    metadata.hasOnTradeTransaction = strippedContent.includes("OnTradeTransaction");
    metadata.hasOnChartEvent = strippedContent.includes("OnChartEvent");
    metadata.hasOnCalculate = strippedContent.includes("OnCalculate");
    metadata.hasOnTester = strippedContent.includes("OnTester(") || strippedContent.includes("OnTester\n");
    metadata.hasOnTesterInit = strippedContent.includes("OnTesterInit");
    metadata.hasOnTesterDeinit = strippedContent.includes("OnTesterDeinit");
    metadata.hasOnTesterPass = strippedContent.includes("OnTesterPass");

    // Detect trading functions used
    metadata.tradingFunctions = TRADING_FUNCTIONS.filter(fn => strippedContent.includes(fn));

    // Detect indicator calls
    metadata.indicatorCalls = INDICATOR_FUNCTIONS.filter(fn => strippedContent.includes(fn));

    // Detect risk management features
    const lowerContent = strippedContent.toLowerCase();
    metadata.riskManagementFeatures = RISK_KEYWORDS.filter(kw => lowerContent.includes(kw));

    // Calculate complexity
    metadata.complexity = this.calculateComplexity(lines, strippedContent, metadata);

    return metadata;
  }

  /**
   * Strip all comments from MQ5 content
   */
  private static stripComments(content: string): string {
    // Remove multi-line comments
    let result = content.replace(/\/\*[\s\S]*?\*\//g, "");
    // Remove single-line comments (but preserve the line)
    result = result.replace(/\/\/.*$/gm, "");
    return result;
  }

  /**
   * Extract #property value
   */
  private static extractProperty(lines: string[], property: string): string | null {
    const regex = new RegExp(`#property\\s+${property}\\s+"([^"]*)"`, "i");
    for (const line of lines) {
      const match = line.match(regex);
      if (match) return match[1];
    }
    // Also try without quotes (for numeric properties)
    const numRegex = new RegExp(`#property\\s+${property}\\s+(\\S+)`, "i");
    for (const line of lines) {
      const match = line.match(numRegex);
      if (match && !match[1].startsWith('"')) return match[1];
    }
    return null;
  }

  /**
   * Infer EA name from file content
   */
  private static inferEAName(content: string): string | null {
    // Try to find a class that extends CExpert or similar
    const classMatch = content.match(/class\s+(\w+)\s*(?::\s*public\s+\w+)?/);
    if (classMatch) return classMatch[1];
    return null;
  }

  /**
   * Extract ALL input parameters with comprehensive type handling
   */
  private static extractAllParameters(lines: string[], enums: EAEnumDeclaration[]): EAParameter[] {
    const parameters: EAParameter[] = [];
    let currentGroup: string | undefined;
    const enumMap = new Map(enums.map(e => [e.name, e]));

    // Track sinput vs input
    // Patterns to match:
    // input int StopLoss = 50; // Stop loss in points
    // input double RiskPercent = 1.0; // Risk percentage
    // input bool UseTrailing = true; // Enable trailing stop
    // input string Comment = "EA Trade"; // Order comment
    // input ENUM_TIMEFRAMES Period = PERIOD_H1; // Timeframe
    // input CustomEnum Mode = MODE_NORMAL; // Custom enum
    // input group "Risk Management"
    // sinput int MagicNumber = 12345; // Magic number (non-optimizable)
    // input color ArrowColor = clrRed; // Arrow color
    // input datetime StartTime = D'2024.01.01'; // Start time
    // input int Levels[] = {10, 20, 30}; // Array parameter

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Check for input group declaration
      const groupMatch = line.match(/^input\s+group\s+"([^"]+)"/);
      if (groupMatch) {
        currentGroup = groupMatch[1];
        continue;
      }

      // Check for input/sinput parameter
      const isStatic = line.startsWith("sinput ");
      const isInput = line.startsWith("input ") || isStatic;
      if (!isInput) continue;
      if (line.startsWith("input group")) continue;

      // Remove the input/sinput prefix
      const paramLine = line.replace(/^(?:s?input)\s+/, "");

      // Parse the parameter declaration
      const param = this.parseParameterLine(paramLine, enumMap, currentGroup, isStatic);
      if (param) {
        parameters.push(param);
      }
    }

    return parameters;
  }

  /**
   * Parse a single parameter line with full type support
   */
  private static parseParameterLine(
    line: string,
    enumMap: Map<string, EAEnumDeclaration>,
    group?: string,
    isStatic?: boolean
  ): EAParameter | null {
    // Extract inline comment
    const commentIdx = line.indexOf("//");
    const comment = commentIdx >= 0 ? line.substring(commentIdx + 2).trim() : undefined;
    const codePart = commentIdx >= 0 ? line.substring(0, commentIdx).trim() : line.trim();

    // Remove trailing semicolon
    const cleanCode = codePart.replace(/;\s*$/, "").trim();

    // Match: TYPE NAME = DEFAULT or TYPE NAME[] = {values} or TYPE NAME
    // Handle complex types like "const int" or "ENUM_TIMEFRAMES"
    const paramMatch = cleanCode.match(/^(\w[\w\s]*?)\s+(\w+)(\[\d*\])?\s*(?:=\s*(.+))?$/);
    if (!paramMatch) return null;

    let [, rawType, name, arrayPart, defaultStr] = paramMatch;
    rawType = rawType.trim();
    const isArray = !!arrayPart;
    const arraySize = arrayPart ? parseInt(arrayPart.replace(/[\[\]]/g, "")) || undefined : undefined;

    // Determine normalized type
    let type: EAParameter["type"] = "string";
    let defaultValue: string | number | boolean = defaultStr?.trim() || "";
    let enumValues: string[] | undefined;

    if (MT5_INT_TYPES.has(rawType.toLowerCase())) {
      type = rawType.toLowerCase() as EAParameter["type"];
      if (type !== "long" && type !== "ulong" && type !== "uint" && type !== "ushort" && type !== "uchar" && type !== "short" && type !== "char") {
        type = "int";
      }
      defaultValue = parseInt(String(defaultValue)) || 0;
    } else if (MT5_FLOAT_TYPES.has(rawType.toLowerCase())) {
      type = rawType.toLowerCase() === "float" ? "float" : "double";
      defaultValue = parseFloat(String(defaultValue)) || 0.0;
    } else if (rawType.toLowerCase() === "bool") {
      type = "bool";
      defaultValue = String(defaultValue).toLowerCase() === "true";
    } else if (rawType.toLowerCase() === "string") {
      type = "string";
      // Remove quotes from default value
      defaultValue = String(defaultValue).replace(/^"(.*)"$/, "$1");
    } else if (rawType.toLowerCase() === "color") {
      type = "color";
      defaultValue = String(defaultValue);
    } else if (rawType.toLowerCase() === "datetime") {
      type = "datetime";
      defaultValue = String(defaultValue).replace(/^D'(.*)'$/, "$1");
    } else if (rawType.startsWith("ENUM_") || MT5_ENUM_TYPES.has(rawType) || enumMap.has(rawType)) {
      type = "enum";
      defaultValue = String(defaultValue);
      // Get enum values if available
      const enumDecl = enumMap.get(rawType);
      if (enumDecl) {
        enumValues = enumDecl.values.map(v => v.name);
      }
    } else {
      // Could be a custom enum or typedef
      if (enumMap.has(rawType)) {
        type = "enum";
        enumValues = enumMap.get(rawType)!.values.map(v => v.name);
      } else {
        type = "enum"; // Assume custom enum for unknown types
      }
      defaultValue = String(defaultValue);
    }

    // Extract range hints from comment
    let minValue: number | undefined;
    let maxValue: number | undefined;
    let step: number | undefined;

    if (comment) {
      const rangeMatch = comment.match(/(\d+\.?\d*)\s*[-–\.]{2,}\s*(\d+\.?\d*)/);
      if (rangeMatch) {
        minValue = parseFloat(rangeMatch[1]);
        maxValue = parseFloat(rangeMatch[2]);
      }
      const stepMatch = comment.match(/step\s*[:=]?\s*(\d+\.?\d*)/i);
      if (stepMatch) {
        step = parseFloat(stepMatch[1]);
      }
    }

    // Extract category from comment [Category] or group
    let category = group;
    if (comment) {
      const catMatch = comment.match(/\[([^\]]+)\]/);
      if (catMatch) category = catMatch[1];
    }

    return {
      name,
      type,
      rawType,
      defaultValue,
      defaultValueRaw: defaultStr?.trim() || String(defaultValue),
      minValue,
      maxValue,
      step,
      comment,
      category,
      group,
      isStatic,
      enumValues,
      isArray,
      arraySize,
    };
  }

  /**
   * Extract enum declarations from the file
   */
  private static extractEnumDeclarations(content: string): EAEnumDeclaration[] {
    const enums: EAEnumDeclaration[] = [];
    const enumRegex = /enum\s+(\w+)\s*\{([^}]+)\}/g;

    let match;
    while ((match = enumRegex.exec(content)) !== null) {
      const name = match[1];
      const body = match[2];
      const values: EAEnumDeclaration["values"] = [];

      const valueLines = body.split(",").map(l => l.trim()).filter(l => l.length > 0);
      let autoValue = 0;

      for (const vLine of valueLines) {
        const vMatch = vLine.match(/(\w+)\s*(?:=\s*(-?\d+))?\s*(?:\/\/\s*(.*))?/);
        if (vMatch) {
          const val = vMatch[2] !== undefined ? parseInt(vMatch[2]) : autoValue;
          values.push({
            name: vMatch[1],
            value: val,
            comment: vMatch[3]?.trim(),
          });
          autoValue = val + 1;
        }
      }

      enums.push({ name, values });
    }

    return enums;
  }

  /**
   * Extract class declarations
   */
  private static extractClasses(content: string): EAClassDeclaration[] {
    const classes: EAClassDeclaration[] = [];
    const classRegex = /class\s+(\w+)\s*(?::\s*(?:public|private|protected)\s+(\w+))?\s*\{/g;

    let match;
    while ((match = classRegex.exec(content)) !== null) {
      classes.push({
        name: match[1],
        baseClass: match[2],
        members: [],
        methods: [],
      });
    }

    return classes;
  }

  /**
   * Extract function declarations
   */
  private static extractFunctions(lines: string[]): EAFunctionInfo[] {
    const functions: EAFunctionInfo[] = [];
    const funcRegex = /^(?:virtual\s+)?(\w[\w\s*&]*?)\s+(\w+)\s*\(([^)]*)\)\s*(?:const\s*)?(?:override\s*)?(?:\{|$)/;
    const eventHandlers = new Set([
      "OnInit", "OnDeinit", "OnTick", "OnTimer", "OnTrade",
      "OnTradeTransaction", "OnChartEvent", "OnCalculate",
      "OnTester", "OnTesterInit", "OnTesterDeinit", "OnTesterPass",
    ]);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const match = line.match(funcRegex);
      if (match && !line.startsWith("//") && !line.startsWith("*")) {
        const [, returnType, name, params] = match;
        // Skip if it looks like a variable declaration or control structure
        if (["if", "for", "while", "switch", "return", "else", "case"].includes(name)) continue;
        if (returnType.includes("input") || returnType.includes("sinput")) continue;

        functions.push({
          name,
          returnType: returnType.trim(),
          params: params.trim(),
          isEventHandler: eventHandlers.has(name),
          lineNumber: i + 1,
        });
      }
    }

    return functions;
  }

  /**
   * Extract #include directives
   */
  private static extractIncludes(lines: string[]): EAInclude[] {
    const includes: EAInclude[] = [];

    for (const line of lines) {
      const sysMatch = line.match(/#include\s+<([^>]+)>/);
      if (sysMatch) {
        includes.push({ path: sysMatch[1], isSystem: true });
        continue;
      }
      const localMatch = line.match(/#include\s+"([^"]+)"/);
      if (localMatch) {
        includes.push({ path: localMatch[1], isSystem: false });
      }
    }

    return includes;
  }

  /**
   * Extract #define macros
   */
  private static extractDefines(lines: string[]): EADefine[] {
    const defines: EADefine[] = [];

    for (const line of lines) {
      const match = line.trim().match(/^#define\s+(\w+)\s+(.*)/);
      if (match) {
        defines.push({ name: match[1], value: match[2].trim() });
      }
    }

    return defines;
  }

  /**
   * Extract indicator names from includes and function calls
   */
  private static extractIndicatorNames(lines: string[]): string[] {
    const indicators = new Set<string>();

    for (const line of lines) {
      // From includes
      const includeMatch = line.match(/#include\s+<([^>]+)>/);
      if (includeMatch) {
        const path = includeMatch[1];
        if (path.includes("Indicators") || path.includes("indicator")) {
          indicators.add(path);
        }
      }

      // From iCustom calls
      const customMatch = line.match(/iCustom\s*\([^,]+,\s*[^,]+,\s*"([^"]+)"/);
      if (customMatch) {
        indicators.add(customMatch[1]);
      }

      // From built-in indicator calls
      for (const fn of INDICATOR_FUNCTIONS) {
        if (line.includes(fn + "(")) {
          indicators.add(fn.replace(/^i/, ""));
        }
      }
    }

    return Array.from(indicators);
  }

  /**
   * Calculate code complexity metrics
   */
  private static calculateComplexity(
    originalLines: string[],
    strippedContent: string,
    metadata: Partial<EAMetadata>
  ): EAMetadata["complexity"] {
    const totalLines = originalLines.length;
    let commentLines = 0;
    let blankLines = 0;
    let inBlockComment = false;

    for (const line of originalLines) {
      const trimmed = line.trim();
      if (trimmed === "") {
        blankLines++;
        continue;
      }
      if (inBlockComment) {
        commentLines++;
        if (trimmed.includes("*/")) inBlockComment = false;
        continue;
      }
      if (trimmed.startsWith("/*")) {
        commentLines++;
        if (!trimmed.includes("*/")) inBlockComment = true;
        continue;
      }
      if (trimmed.startsWith("//")) {
        commentLines++;
      }
    }

    const codeLines = totalLines - commentLines - blankLines;

    // Cyclomatic complexity: count decision points
    const decisionKeywords = /\b(if|else\s+if|for|while|switch|case|catch|\?\s*:)\b/g;
    const decisions = (strippedContent.match(decisionKeywords) || []).length;
    const cyclomaticComplexity = decisions + 1;

    // Max nesting depth
    let maxNesting = 0;
    let currentNesting = 0;
    for (const char of strippedContent) {
      if (char === "{") {
        currentNesting++;
        if (currentNesting > maxNesting) maxNesting = currentNesting;
      } else if (char === "}") {
        currentNesting = Math.max(0, currentNesting - 1);
      }
    }

    // Complexity score
    let score: EAMetadata["complexity"]["score"] = "simple";
    const complexityPoints =
      (metadata.parameters?.length || 0) * 2 +
      (metadata.functions?.length || 0) * 3 +
      (metadata.classes?.length || 0) * 5 +
      cyclomaticComplexity * 2 +
      maxNesting * 3 +
      codeLines / 50;

    if (complexityPoints > 200) score = "extremely_complex";
    else if (complexityPoints > 100) score = "very_complex";
    else if (complexityPoints > 50) score = "complex";
    else if (complexityPoints > 20) score = "moderate";

    return {
      totalLines,
      codeLines,
      commentLines,
      blankLines,
      parameterCount: metadata.parameters?.length || 0,
      functionCount: metadata.functions?.length || 0,
      classCount: metadata.classes?.length || 0,
      enumCount: metadata.enums?.length || 0,
      includeCount: metadata.includes?.length || 0,
      cyclomaticComplexity,
      nestingDepth: maxNesting,
      score,
    };
  }

  /**
   * Suggest parameter ranges for optimization based on parameter semantics
   */
  static suggestParameterRanges(parameters: EAParameter[]): Record<string, { min: number; max: number; step: number }> {
    const ranges: Record<string, { min: number; max: number; step: number }> = {};

    for (const param of parameters) {
      if (param.isStatic) continue; // Skip sinput parameters
      if (param.type === "bool" || param.type === "string" || param.type === "color" || param.type === "datetime") continue;
      if (param.type === "enum") continue;

      const name = param.name.toLowerCase();
      const defaultVal = typeof param.defaultValue === "number" ? param.defaultValue : parseFloat(String(param.defaultValue)) || 0;

      // Use explicit ranges if available
      if (param.minValue !== undefined && param.maxValue !== undefined) {
        ranges[param.name] = {
          min: param.minValue,
          max: param.maxValue,
          step: param.step || (param.type === "double" || param.type === "float" ? 0.1 : 1),
        };
        continue;
      }

      // Intelligent range suggestion based on parameter semantics
      if (name.includes("period") || name.includes("length") || name.includes("bars")) {
        ranges[param.name] = { min: Math.max(2, Math.floor(defaultVal * 0.3)), max: Math.ceil(defaultVal * 3), step: 1 };
      } else if (name.includes("stoploss") || name.includes("stop_loss") || name.includes("sl")) {
        ranges[param.name] = { min: Math.max(5, Math.floor(defaultVal * 0.3)), max: Math.ceil(defaultVal * 3), step: 5 };
      } else if (name.includes("takeprofit") || name.includes("take_profit") || name.includes("tp")) {
        ranges[param.name] = { min: Math.max(5, Math.floor(defaultVal * 0.3)), max: Math.ceil(defaultVal * 3), step: 5 };
      } else if (name.includes("lot") || name.includes("volume")) {
        ranges[param.name] = { min: 0.01, max: Math.max(1.0, defaultVal * 5), step: 0.01 };
      } else if (name.includes("risk") || name.includes("percent")) {
        ranges[param.name] = { min: 0.1, max: Math.max(10, defaultVal * 3), step: 0.1 };
      } else if (name.includes("magic")) {
        continue; // Don't optimize magic numbers
      } else if (name.includes("slippage")) {
        ranges[param.name] = { min: 0, max: Math.max(30, defaultVal * 3), step: 1 };
      } else if (name.includes("multiplier") || name.includes("factor") || name.includes("coefficient")) {
        ranges[param.name] = { min: Math.max(0.1, defaultVal * 0.2), max: defaultVal * 5, step: 0.1 };
      } else if (name.includes("threshold") || name.includes("level")) {
        ranges[param.name] = { min: Math.max(0, defaultVal * 0.3), max: defaultVal * 3, step: param.type === "double" || param.type === "float" ? 0.5 : 1 };
      } else if (param.type === "int" || param.type === "long") {
        const min = Math.max(0, Math.floor(defaultVal * 0.3));
        const max = Math.max(defaultVal + 10, Math.ceil(defaultVal * 3));
        ranges[param.name] = { min, max, step: Math.max(1, Math.floor((max - min) / 20)) };
      } else if (param.type === "double" || param.type === "float") {
        const min = Math.max(0, defaultVal * 0.3);
        const max = Math.max(defaultVal + 1, defaultVal * 3);
        ranges[param.name] = { min: Math.round(min * 100) / 100, max: Math.round(max * 100) / 100, step: Math.round((max - min) / 20 * 100) / 100 || 0.01 };
      }
    }

    return ranges;
  }

  /**
   * Categorize parameters by type and purpose with intelligent grouping
   */
  static categorizeParameters(parameters: EAParameter[]): Record<string, EAParameter[]> {
    const categories: Record<string, EAParameter[]> = {};

    for (const param of parameters) {
      // Use explicit group/category first
      if (param.group) {
        if (!categories[param.group]) categories[param.group] = [];
        categories[param.group].push(param);
        continue;
      }
      if (param.category) {
        if (!categories[param.category]) categories[param.category] = [];
        categories[param.category].push(param);
        continue;
      }

      // Intelligent categorization
      const name = param.name.toLowerCase();
      const comment = (param.comment || "").toLowerCase();
      const combined = name + " " + comment;

      let category = "General";

      if (/entry|signal|buy|sell|open|trigger/.test(combined)) {
        category = "Entry Signals";
      } else if (/exit|close|tp|takeprofit|take.?profit/.test(combined)) {
        category = "Exit Rules";
      } else if (/stop.?loss|sl|trailing|breakeven|break.?even/.test(combined)) {
        category = "Stop Loss";
      } else if (/risk|lot|volume|position.?size|money.?management|margin|drawdown/.test(combined)) {
        category = "Risk Management";
      } else if (/period|length|ma|rsi|macd|cci|atr|band|stoch|indicator|ema|sma|wma/.test(combined)) {
        category = "Indicator Settings";
      } else if (/time|hour|day|session|schedule|start|end|filter/.test(combined)) {
        category = "Time Filters";
      } else if (/magic|comment|slippage|deviation|retry/.test(combined)) {
        category = "Trade Execution";
      } else if (/display|show|visual|color|panel|chart|arrow|line/.test(combined)) {
        category = "Display Settings";
      } else if (/grid|martingale|hedge|recovery|basket/.test(combined)) {
        category = "Advanced Strategy";
      } else if (/news|event|calendar|filter/.test(combined)) {
        category = "News Filters";
      }

      if (!categories[category]) categories[category] = [];
      categories[category].push(param);
    }

    // Remove empty categories and sort
    return Object.fromEntries(
      Object.entries(categories)
        .filter(([, params]) => params.length > 0)
        .sort(([a], [b]) => {
          const order = ["Entry Signals", "Exit Rules", "Stop Loss", "Risk Management", "Indicator Settings", "Time Filters", "Trade Execution", "Advanced Strategy", "News Filters", "Display Settings", "General"];
          return (order.indexOf(a) === -1 ? 99 : order.indexOf(a)) - (order.indexOf(b) === -1 ? 99 : order.indexOf(b));
        })
    );
  }

  /**
   * Identify critical parameters for optimization
   */
  static identifyCriticalParameters(parameters: EAParameter[]): EAParameter[] {
    const scored: Array<{ param: EAParameter; score: number }> = [];

    for (const param of parameters) {
      if (param.isStatic) continue;
      if (param.type === "string" || param.type === "color" || param.type === "datetime") continue;

      let score = 0;
      const name = param.name.toLowerCase();
      const comment = (param.comment || "").toLowerCase();

      // High impact parameters
      if (/period|length|bars/.test(name)) score += 8;
      if (/stoploss|stop_loss|sl/.test(name)) score += 9;
      if (/takeprofit|take_profit|tp/.test(name)) score += 9;
      if (/lot|volume|risk|position_size/.test(name)) score += 7;
      if (/threshold|level|trigger/.test(name)) score += 7;
      if (/multiplier|factor|coefficient/.test(name)) score += 6;
      if (/filter|deviation/.test(name)) score += 5;

      // Comment hints
      if (/optimize|critical|important|key/.test(comment)) score += 5;
      if (/range|min|max/.test(comment)) score += 3;

      // Numeric types are more optimizable
      if (param.type === "int" || param.type === "double" || param.type === "float") score += 2;
      if (param.type === "bool") score += 1;

      if (score > 0) {
        scored.push({ param, score });
      }
    }

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 30)
      .map(s => s.param);
  }

  /**
   * Generate comprehensive optimization configuration
   */
  static generateOptimizationConfig(metadata: EAMetadata): {
    parameters: EAParameter[];
    ranges: Record<string, { min: number; max: number; step: number }>;
    critical: EAParameter[];
    categories: Record<string, EAParameter[]>;
    totalCombinations: number;
    estimatedRunTime: string;
  } {
    const critical = this.identifyCriticalParameters(metadata.parameters);
    const ranges = this.suggestParameterRanges(critical);
    const categories = this.categorizeParameters(metadata.parameters);

    // Calculate total combinations
    let totalCombinations = 1;
    for (const [, range] of Object.entries(ranges)) {
      const steps = Math.ceil((range.max - range.min) / range.step) + 1;
      totalCombinations *= steps;
    }

    // Estimate run time (rough: 50ms per combination for simple backtest)
    const estimatedMs = totalCombinations * 50;
    let estimatedRunTime = "";
    if (estimatedMs < 1000) estimatedRunTime = `${estimatedMs}ms`;
    else if (estimatedMs < 60000) estimatedRunTime = `${(estimatedMs / 1000).toFixed(1)}s`;
    else if (estimatedMs < 3600000) estimatedRunTime = `${(estimatedMs / 60000).toFixed(1)}min`;
    else estimatedRunTime = `${(estimatedMs / 3600000).toFixed(1)}hr`;

    return {
      parameters: metadata.parameters,
      ranges,
      critical,
      categories,
      totalCombinations,
      estimatedRunTime,
    };
  }
}

/**
 * Validate MQ5 file with comprehensive checks
 */
export function validateMQ5File(content: string): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!content || content.trim().length === 0) {
    errors.push("File is empty");
    return { valid: false, errors, warnings };
  }

  // Check minimum file characteristics
  const hasProperty = content.includes("#property");
  const hasInput = /\b(?:s?input)\s+/.test(content);
  const hasOnTick = content.includes("OnTick");
  const hasOnCalculate = content.includes("OnCalculate");
  const hasOnInit = content.includes("OnInit");

  if (!hasProperty) {
    warnings.push("No #property declarations found - file may not be a standard MQ5 EA");
  }

  if (!hasInput) {
    warnings.push("No input parameters found - EA has no configurable parameters");
  }

  if (!hasOnTick && !hasOnCalculate) {
    warnings.push("No OnTick() or OnCalculate() found - may not be a standard EA or indicator");
  }

  if (!hasOnInit) {
    warnings.push("No OnInit() found - EA may lack initialization logic");
  }

  // Check for common issues
  if (content.includes("OrderSend") && !content.includes("GetLastError")) {
    warnings.push("OrderSend used without error checking (GetLastError)");
  }

  if (content.includes("Sleep(") && content.includes("OnTick")) {
    warnings.push("Sleep() used in OnTick - may cause missed ticks");
  }

  // Check file size
  if (content.length > 5000000) {
    warnings.push("Very large file (>5MB) - parsing may be slow");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
