import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Team from '../models/Team'; 
import User from '../models/User';
import Survey ,{ISurvey} from '../models/Survey';
import { authMiddleware } from '../middleware/authMiddleware';
import { submitSurveyResponse } from './surveysController';
import CustomRequest from '../customRequest';

const adminId = 'your-admin-id';
// Controller function for creating a new team
export const createTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { teamCode } = req.body;

    // Check if the team code is already taken
    const existingTeam = await Team.findOne({ teamCode });
    if (existingTeam) {
      return res.status(400).json({ message: 'Team code already exists' });
    }

    // Create the new team
    const newTeam = new Team({
      teamCode,
      members: [],
    });

    await newTeam.save();

    return res.status(201).json({ message: 'Team created successfully' });
  } catch (error) {
    next(error);
  }
};

export const getTotalNumberOfTeams = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalTeams = await Team.countDocuments();
    return res.status(200).json({ totalTeams });
  } catch (error) {
    next(error);
  }
};


export const getTotalNumberOfUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalUsers = await User.countDocuments();
    return res.status(200).json({ totalUsers });
  } catch (error) {
    next(error);
  }
};
// Controller function for adding a user to a team
export const addMemberToTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { teamCode } = req.params;
    const { userId } = req.body;

    // Find the team
    const team = await Team.findOne({ teamCode });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add the user to the team
    team.members.push(user._id);
    await team.save();

    return res.status(200).json({ message: 'User added to the team successfully' });
  } catch (error) {
    next(error);
  }
};

// Controller function for removing a user from a team
export const removeMemberFromTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { teamCode, userId } = req.params;

    // Find the team
    const team = await Team.findOne({ teamCode });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Remove the user from the team
    team.members.pull(userId);
    await team.save();

    return res.status(200).json({ message: 'User removed from the team successfully' });
  } catch (error) {
    next(error);
  }
};

// Controller function for setting the survey time frame for a team
export const setSurveyTimeFrame = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { teamCode } = req.params;
    const { startTime, endTime } = req.body;

    // Find the team
    const team = await Team.findOne({ teamCode });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Update the survey time frame for the team
    team.surveyStartTime = startTime;
    team.surveyEndTime = endTime;
    await team.save();

    return res.status(200).json({ message: 'Survey time frame set successfully' });
  } catch (error) {
    next(error);
  }
};

// Controller function for getting survey data for a team
export const getSurveyData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { teamCode } = req.params;

    // Find the team and its associated survey data in the database
    const team = await Team.findOne({ teamCode }).populate('members', 'email');
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Retrieve survey data for the team from the database
    const surveys = await Survey.find({ _id: { $in: team.surveys } }, 'title responses');

    // Return the survey data to the client in the desired format
    return res.status(200).json({ team, surveys });
  } catch (error) {
    next(error);
  }
};


export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Perform admin authentication logic (e.g., check credentials)
    // Replace this with your actual authentication logic
    if (email === 'hrk3341@gmail.com' && password === '123456789') {
      // Authentication successful

      // Generate a JWT token
      const token = jwt.sign({ userId: adminId, isAdmin: true }, process.env.JWT_SECRET!, { expiresIn: '1h' });

      return res.status(200).json({ message: 'Admin login successful', token });
    } else {
      // Authentication failed
      return res.status(401).json({ message: 'Admin login failed' });
    }
  } catch (error) {
    next(error);
  }
};


export const getTotalSurveyResponses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Count the total number of survey responses in the Survey model
    const totalResponses = await Survey.aggregate([
      { $project: { numResponses: { $size: "$responses" } } },
      { $group: { _id: null, totalResponses: { $sum: "$numResponses" } } }
    ]);

    return res.status(200).json({ totalResponses: totalResponses.length > 0 ? totalResponses[0].totalResponses : 0 });
  } catch (error) {
    next(error);
  }
};



export const getTeamInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Find all teams
    const teams = await Team.find({});

    // Create an array to hold team info
    const teamInfo = [];

    // Iterate through each team
    for (const team of teams) {
      // Populate the surveys for the team
      const populatedTeam = await Team.findOne({ _id: team._id }).populate({
        path: 'surveys',
        populate: {
          path: 'responses.userId',
          model: 'User',
        },
      });

      if (!populatedTeam) {
        return res.status(404).json({ message: 'Team not found' });
      }

      const teamSurveys: ISurvey[] = populatedTeam.surveys as ISurvey[];

      // Calculate the number of members
      const numMembers = team.members.length;

      // Calculate the total number of survey submissions
      const totalSurveySubmissions = teamSurveys.reduce(
        (total: number, survey: ISurvey) => total + survey.responses.length,
        0
      );

      // Calculate the number of pending responses (responses with fewer answers than questions)
      const numPendingResponses = teamSurveys
        .map((survey: ISurvey) =>
          survey.responses.some(
            (response) => response.answers.length < survey.questions.length
          )
        )
        .filter((hasPendingResponse: boolean) => hasPendingResponse).length;

      // Create an object with team info
      const teamInfoItem = {
        teamCode: team.teamCode,
        numMembers,
        totalSurveySubmissions,
        numPendingResponses,
      };

      // Push the team info to the array
      teamInfo.push(teamInfoItem);
    }

    // Return the team info array
    return res.status(200).json({ teamInfo });
  } catch (error) {
    next(error);
  }
};


