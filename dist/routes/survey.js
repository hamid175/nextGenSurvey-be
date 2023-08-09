"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const surveysController_1 = __importDefault(require("../controller/surveysController"));
const router = express_1.default.Router();
// API endpoint for creating a new survey
router.post('/', surveysController_1.default.createSurvey);
// API endpoint for getting all surveys
router.get('/', surveysController_1.default.getAllSurveys);
// API endpoint for getting a specific survey by ID
router.get('/:surveyId', surveysController_1.default.getSurveyById);
// API endpoint for submitting a survey response
router.post('/:surveyId/submit', surveysController_1.default.submitSurveyResponse);
router.get('/admin/all', surveysController_1.default.getAllSurveyData);
exports.default = router;
//# sourceMappingURL=survey.js.map