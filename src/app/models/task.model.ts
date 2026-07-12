export interface User {

  id?: string;

  _id?: string;

  username?: string;

  name?: string;

  email: string;

  role: string;

}

export interface Task {

  _id?: string;

  title: string;

  description: string;

  status: 'Pending' | 'Completed';

  assignedTo?: User;

  createdBy?: User;

  createdAt?: string;

  updatedAt?: string;

}