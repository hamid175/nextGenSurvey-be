import mongoose, { Document, Schema, Types } from 'mongoose';
import { IUser } from './User';

export interface ITeam extends Document {
  teamCode: string;
  members: Types.Array<IUser['_id']>;
  surveyStartTime?: Date;
  surveyEndTime?: Date;
  surveys: Types.Array<Schema.Types.ObjectId>;
}// Add the surveys property here with the correct type

const teamSchema: Schema = new mongoose.Schema({
  teamCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

const Team = mongoose.model<ITeam>('Team', teamSchema);

export default Team;
