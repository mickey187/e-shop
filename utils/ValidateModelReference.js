const winstonLogger = require("./Logger");
const ErrorLogService = require("../services/ErrorLogService");

async function validateAndReferenceCheck(
  referenceModel,
  modelData,
  referenceFields,
  requiredFields
) {
  try {
    // Check references for required fields
    for (const field of referenceFields) {
      // console.log("modelData[field]", modelData[field]);
      const fieldValues =
        modelData[field] !== undefined
          ? !Array.isArray(modelData[field])
            ? [modelData[field]]
            : modelData[field]
          : [];

      // console.log("fieldValues", fieldValues);
      const fieldIsRequired = requiredFields.includes(field);
      // If the field is required, and it's empty, throw an error
      if (
        fieldIsRequired &&
        (fieldValues.length === 0 ||
          fieldValues.every((value) => value == null))
      ) {
        // console.log("failed for model: ", referenceModel);
        throw new Error(`'${field}' field is required.`);
      }

      // If the field exists (not null or undefined), perform reference validation
      if (fieldValues.length > 0) {
        const fieldIds = fieldValues.map((value) => value.toString());
        if (!(await referenceModel.exists({ _id: { $in: fieldIds } }))) {
          throw new Error(`Invalid references in '${field}' field.`);
        }
      }
    }

    // Check empty/null fields that are required
    for (const field of requiredFields) {
      if (!modelData[field]) {
        throw new Error(`'${field}' field is required.`);
      }
      if (typeof modelData[field] === "string" && !modelData[field].trim()) {
        throw new Error(`'${field}' field cannot be empty.`);
      }
    }
  } catch (error) {
    winstonLogger.error(error.message);
    await ErrorLogService.logError(error, true, null, null, null);
    throw error;
  }
}

module.exports = { validateAndReferenceCheck };
