/**
 * MQ5 EA File Parser and Parameter Extraction
 * Parses MetaQuotes 5 Expert Advisor files and extracts input parameters
 */

export interface EAParameter {
  name: string;
  type: "int" | "double" | "bool" | "string" | "enum";
  defaultValue: string | number | boolean;
  minValue?: number;
  maxValue?: number;
  step?: number;
  comment?: string;
  category?: string;
}

export interface EAMetadata {
  name: string;
  version: string;
  copyright: string;
  link: string;
  description: string;
  parameters: EAParameter[];
  indicators: string[];
  totalParameters: number;
}

/**
 * Parser for MQ5 EA files
 */
export class MQ5Parser {
  /**
   * Parse MQ5 file content and extract metadata
   */
  static parseEAFile(content: string): EAMetadata {
    const lines = content.split("\n");

    const metadata: EAMetadata = {
      name: this.extractPropertyValue(lines, "copyright") || "Unknown EA",
      version: this.extractPropertyValue(lines, "version") || "1.0",
      copyright: this.extractPropertyValue(lines, "copyright") || "",
      link: this.extractPropertyValue(lines, "link") || "",
      description: "",
      parameters: [],
      indicators: [],
      totalParameters: 0,
    };

    // Extract input parameters
    metadata.parameters = this.extractInputParameters(lines);
    metadata.totalParameters = metadata.parameters.length;

    // Extract indicator includes
    metadata.indicators = this.extractIndicators(lines);

    return metadata;
  }

  /**
   * Extract #property values
   */
  private static extractPropertyValue(lines: string[], property: string): string | null {
    const regex = new RegExp(`#property\\s+${property}\\s+"([^"]*)"`, "i");
    for (const line of lines) {
      const match = line.match(regex);
      if (match) return match[1];
    }
    return null;
  }

  /**
   * Extract all input parameters from the EA
   */
  private static extractInputParameters(lines: string[]): EAParameter[] {
    const parameters: EAParameter[] = [];
    const inputRegex = /^input\s+(\w+)\s+(\w+)\s*=\s*([^;]+);\s*\/\/\s*(.*)/;

    for (const line of lines) {
      const match = line.match(inputRegex);
      if (match) {
        const [, typeStr, name, defaultStr, comment] = match;
        const param = this.parseParameter(typeStr, name, defaultStr, comment);
        if (param) {
          parameters.push(param);
        }
      }
    }

    return parameters;
  }

  /**
   * Parse a single parameter line
   */
  private static parseParameter(
    typeStr: string,
    name: string,
    defaultStr: string,
    comment: string
  ): EAParameter | null {
    let type: EAParameter["type"] = "string";
    let defaultValue: string | number | boolean = defaultStr.trim();

    // Determine parameter type
    if (typeStr === "int" || typeStr === "long") {
      type = "int";
      defaultValue = parseInt(defaultStr.trim()) || 0;
    } else if (typeStr === "double" || typeStr === "float") {
      type = "double";
      defaultValue = parseFloat(defaultStr.trim()) || 0.0;
    } else if (typeStr === "bool") {
      type = "bool";
      defaultValue = defaultStr.trim().toLowerCase() === "true";
    } else if (typeStr.includes("ENUM")) {
      type = "enum";
    }

    // Extract range hints from comment
    const rangeMatch = comment.match(/(\d+\.?\d*)\s*\.\.\s*(\d+\.?\d*)/);
    const minValue = rangeMatch ? parseFloat(rangeMatch[1]) : undefined;
    const maxValue = rangeMatch ? parseFloat(rangeMatch[2]) : undefined;

    // Extract category from comment
    const categoryMatch = comment.match(/\[([^\]]+)\]/);
    const category = categoryMatch ? categoryMatch[1] : undefined;

    return {
      name,
      type,
      defaultValue,
      minValue,
      maxValue,
      comment: comment.trim(),
      category,
    };
  }

  /**
   * Extract indicator includes
   */
  private static extractIndicators(lines: string[]): string[] {
    const indicators: string[] = [];
    const includeRegex = /#include\s+<([^>]+)>/;

    for (const line of lines) {
      const match = line.match(includeRegex);
      if (match) {
        indicators.push(match[1]);
      }
    }

    return indicators;
  }

  /**
   * Suggest parameter ranges for optimization
   */
  static suggestParameterRanges(
    parameters: EAParameter[]
  ): Record<string, [number, number]> {
    const ranges: Record<string, [number, number]> = {};

    for (const param of parameters) {
      if (param.type === "int") {
        const defaultVal = typeof param.defaultValue === "number" ? param.defaultValue : 0;
        const min = param.minValue ?? Math.max(1, defaultVal - 50);
        const max = param.maxValue ?? defaultVal + 50;
        ranges[param.name] = [min, max];
      } else if (param.type === "double") {
        const defaultVal = typeof param.defaultValue === "number" ? param.defaultValue : 0;
        const min = param.minValue ?? Math.max(0.01, defaultVal - 1);
        const max = param.maxValue ?? defaultVal + 1;
        ranges[param.name] = [min, max];
      }
    }

    return ranges;
  }

  /**
   * Categorize parameters by type and purpose
   */
  static categorizeParameters(parameters: EAParameter[]): Record<string, EAParameter[]> {
    const categories: Record<string, EAParameter[]> = {
      "Entry Signals": [],
      "Exit Signals": [],
      "Risk Management": [],
      "Indicators": [],
      "Display": [],
      "Other": [],
    };

    for (const param of parameters) {
      const name = param.name.toLowerCase();
      const comment = (param.comment || "").toLowerCase();

      if (
        name.includes("entry") ||
        name.includes("buy") ||
        name.includes("sell") ||
        comment.includes("entry")
      ) {
        categories["Entry Signals"].push(param);
      } else if (
        name.includes("exit") ||
        name.includes("close") ||
        name.includes("stop") ||
        comment.includes("exit")
      ) {
        categories["Exit Signals"].push(param);
      } else if (
        name.includes("risk") ||
        name.includes("loss") ||
        name.includes("drawdown") ||
        name.includes("position") ||
        comment.includes("risk")
      ) {
        categories["Risk Management"].push(param);
      } else if (
        name.includes("period") ||
        name.includes("length") ||
        name.includes("ma") ||
        name.includes("rsi") ||
        name.includes("macd") ||
        comment.includes("indicator")
      ) {
        categories["Indicators"].push(param);
      } else if (
        name.includes("visual") ||
        name.includes("display") ||
        name.includes("show") ||
        name.includes("panel")
      ) {
        categories["Display"].push(param);
      } else {
        categories["Other"].push(param);
      }
    }

    // Remove empty categories
    return Object.fromEntries(
      Object.entries(categories).filter(([, params]) => params.length > 0)
    );
  }

  /**
   * Identify critical parameters for optimization
   */
  static identifyCriticalParameters(parameters: EAParameter[]): EAParameter[] {
    const critical: EAParameter[] = [];

    for (const param of parameters) {
      const name = param.name.toLowerCase();
      const comment = (param.comment || "").toLowerCase();

      // Parameters that significantly impact strategy performance
      if (
        name.includes("period") ||
        name.includes("threshold") ||
        name.includes("level") ||
        name.includes("multiplier") ||
        name.includes("offset") ||
        name.includes("weight") ||
        comment.includes("optimize")
      ) {
        critical.push(param);
      }
    }

    return critical.slice(0, 20); // Return top 20 critical parameters
  }

  /**
   * Generate optimization configuration from EA metadata
   */
  static generateOptimizationConfig(metadata: EAMetadata): {
    parameters: EAParameter[];
    ranges: Record<string, [number, number]>;
    critical: EAParameter[];
    categories: Record<string, EAParameter[]>;
  } {
    const critical = this.identifyCriticalParameters(metadata.parameters);
    const ranges = this.suggestParameterRanges(critical);
    const categories = this.categorizeParameters(metadata.parameters);

    return {
      parameters: metadata.parameters,
      ranges,
      critical,
      categories,
    };
  }
}

/**
 * Utility function to validate MQ5 file
 */
export function validateMQ5File(content: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!content) {
    errors.push("File is empty");
    return { valid: false, errors };
  }

  if (!content.includes("#property")) {
    errors.push("Not a valid MQ5 file: missing #property declarations");
  }

  if (!content.includes("input")) {
    errors.push("Warning: No input parameters found");
  }

  return {
    valid: errors.length === 0 || errors.some((e) => e.startsWith("Warning")),
    errors,
  };
}
