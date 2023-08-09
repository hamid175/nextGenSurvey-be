"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitSurveyResponse = exports.getSurveyById = exports.getAllSurveyData = exports.getAllSurveys = exports.createSurvey = void 0;
const Survey_1 = __importDefault(require("../models/Survey")); // Make sure to import your Survey model
// Controller function for creating a new survey
const createSurvey = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, questions } = req.body;
        // Create the new survey
        const newSurvey = new Survey_1.default({
            title,
            questions,
            responses: [],
        });
        yield newSurvey.save();
        return res.status(201).json({ message: 'Survey created successfully', surveyId: newSurvey._id });
    }
    catch (error) {
        next(error);
    }
});
exports.createSurvey = createSurvey;
// Controller function for getting all surveys
const getAllSurveys = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const surveys = yield Survey_1.default.find({}, 'title');
        return res.status(200).json(surveys);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllSurveys = getAllSurveys;
const getAllSurveyData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all surveys with their responses
        const surveysWithResponses = yield Survey_1.default.find().populate('responses.userId');
        return res.status(200).json({ surveys: surveysWithResponses });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllSurveyData = getAllSurveyData;
// Controller function for getting a specific survey by ID
const getSurveyById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { surveyId } = req.params;
        const survey = yield Survey_1.default.findById(surveyId);
        if (!survey) {
            return res.status(404).json({ message: 'Survey not found' });
        }
        return res.status(200).json(survey);
    }
    catch (error) {
        next(error);
    }
});
exports.getSurveyById = getSurveyById;
// Controller function for submitting a survey response
const submitSurveyResponse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { surveyId } = req.params;
        const { userId, answers } = req.body;
        // Find the survey
        const survey = yield Survey_1.default.findById(surveyId);
        if (!survey) {
            return res.status(404).json({ message: 'Survey not found' });
        }
        // Check if the user has already submitted a response for this survey
        const existingResponse = survey.responses.find((response) => response.userId.toString() === userId);
        if (existingResponse) {
            return res.status(400).json({ message: 'User has already submitted a response for this survey' });
        }
        // Add the new response to the survey
        const newResponse = {
            userId,
            answers,
        };
        survey.responses.push(newResponse);
        yield survey.save();
        return res.status(200).json({ message: 'Survey response submitted successfully' });
    }
    catch (error) {
        next(error);
    }
});
exports.submitSurveyResponse = submitSurveyResponse;
exports.default = { createSurvey: exports.createSurvey, getAllSurveys: exports.getAllSurveys, getSurveyById: exports.getSurveyById, submitSurveyResponse: exports.submitSurveyResponse, getAllSurveyData: exports.getAllSurveyData };
//# sourceMappingURL=surveysController.js.map