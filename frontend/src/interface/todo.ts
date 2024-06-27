export interface Todo {
    creator?: string;
    id?: string;
    title: string;
    description: string;
    hours: string;
    deadline: string;
    status?: 'pending' | 'done' | 'deferred' 
  }