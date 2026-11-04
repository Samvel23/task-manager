import type { IComment, ITodo, IUser } from "./types";

export const FALLBACK_USERS: IUser[] = [
  {
    id: "1",
    name: "Leanne Graham",
    username: "Bret",
    email: "Sincere@april.biz",
  },
  {
    id: "2",
    name: "Ervin Howell",
    username: "Antonette",
    email: "Shanna@melissa.tv",
  },
  {
    id: "3",
    name: "Clementine Bauch",
    username: "Samantha",
    email: "Nathan@yesenia.net",
  },
];

export const FALLBACK_TODOS: ITodo[] = [
  {
    id: "1",
    title: "Plan the next product milestone",
    completed: true,
    userId: "1",
    user: FALLBACK_USERS[0],
  },
  {
    id: "2",
    title: "Review the onboarding experience",
    completed: true,
    userId: "1",
    user: FALLBACK_USERS[0],
  },
  {
    id: "3",
    title: "Prepare the weekly project update",
    completed: false,
    userId: "2",
    user: FALLBACK_USERS[1],
  },
  {
    id: "4",
    title: "Share design feedback with the team",
    completed: false,
    userId: "3",
    user: FALLBACK_USERS[2],
  },
];

export const FALLBACK_COMMENTS: IComment[] = [
  {
    id: "1",
    name: "Leanne Graham",
    email: FALLBACK_USERS[0].email,
    body: "The updated milestone looks good. I have added a few notes for the team.",
    postId: "1",
    userId: FALLBACK_USERS[0].id,
  },
  {
    id: "2",
    name: "Ervin Howell",
    email: FALLBACK_USERS[1].email,
    body: "I can take the first review and share an update before the end of the day.",
    postId: "1",
    userId: FALLBACK_USERS[1].id,
  },
];
