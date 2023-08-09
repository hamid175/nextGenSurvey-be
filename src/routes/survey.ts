import express from 'express';
import surveysController from '../controller/surveysController';

const router = express.Router();

// API endpoint for creating a new survey
router.post('/', surveysController.createSurvey);

// API endpoint for getting all surveys
router.get('/', surveysController.getAllSurveys);

// API endpoint for getting a specific survey by ID
router.get('/:surveyId', surveysController.getSurveyById);

// API endpoint for submitting a survey response
router.post('/:surveyId/submit', surveysController.submitSurveyResponse);

router.get('/admin/all', surveysController.getAllSurveyData);

export default router;
