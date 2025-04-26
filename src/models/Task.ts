import mongoose, { Document, Schema } from 'mongoose';

// Define the task status enum
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

// Task interface
export interface ITask extends Document {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: Date;
  assignedTo: mongoose.Types.ObjectId;
}

// Task schema
const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must be assigned to a user'],
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;
