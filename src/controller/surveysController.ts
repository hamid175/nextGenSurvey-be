import { Request, Response, NextFunction } from 'express';
import Survey, { ISurvey } from '../models/Survey'; // Make sure to import your Survey model

// Controller function for creating a new survey
export const createSurvey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, questions } = req.body;

    // Create the new survey
    const newSurvey = new Survey({
      title,
      questions,
      responses: [],
    });

    await newSurvey.save();

    return res.status(201).json({ message: 'Survey created successfully', surveyId: newSurvey._id });
  } catch (error) {
    next(error);
  }
};

// Controller function for getting all surveys
export const getAllSurveys = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const surveys = await Survey.find({}, 'title');
    return res.status(200).json(surveys);
  } catch (error) {
    next(error);
  }
};

export const getAllSurveyData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Fetch all surveys with their responses
    const surveysWithResponses = await Survey.find().populate('responses.userId');

    return res.status(200).json({ surveys: surveysWithResponses });
  } catch (error) {
    next(error);
  }
};


// Controller function for getting a specific survey by ID
export const getSurveyById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { surveyId } = req.params;
    const survey = await Survey.findById(surveyId);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    return res.status(200).json(survey);
  } catch (error) {
    next(error);
  }
};

// Controller function for submitting a survey response
export const submitSurveyResponse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { surveyId } = req.params;
    const { userId, answers } = req.body;

    // Find the survey
    const survey = await Survey.findById(surveyId);
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
    await survey.save();

    return res.status(200).json({ message: 'Survey response submitted successfully' });
  } catch (error) {
    next(error);
  }
};


export default { createSurvey, getAllSurveys, getSurveyById, submitSurveyResponse ,getAllSurveyData};