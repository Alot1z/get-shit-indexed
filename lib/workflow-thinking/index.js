/**
 * Workflow Thinking Module
 * 
 * Validates that GSI workflow files have proper thinking phases integrated
 * for cognitive enhancement at workflow execution points.
 * 
 * @module lib/workflow-thinking
 */

const { 
  validate, 
  validateMultiple, 
  generateReport, 
  findWorkflowFiles, 
  ValidationResult, 
  THINKING_PHASE_TYPES, 
  VALID_SERVERS, 
  TIMEOUT_DEFAULTS, 
  TIMEOUT_RANGE 
} = require('./validator');

module.exports = {
  // Validation functions
  validate,
  validateMultiple,
  generateReport,
  findWorkflowFiles,
  
  // Classes
  ValidationResult,
  
  // Constants
  THINKING_PHASE_TYPES,
  VALID_SERVERS,
  TIMEOUT_DEFAULTS,
  TIMEOUT_RANGE
};
