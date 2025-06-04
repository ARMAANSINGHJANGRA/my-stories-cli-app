import { insert, getDB, saveDB } from "./db.js";

export const newStory = async (story, tags) => {
  const data = {
    tags,
    content: story,
    id: Date.now(),
  };
  await insert(data);
  return data;
};

export const getAllStories = async () => {
  const db = await getDB();
  return db.stories;
};

export const findStory = async (id) => {
  const stories = await getAllStories();
  return stories.filter((story) => story.id === id);
};

export const deleteStory = async (id) => {
  const stories = await getAllStories();
  const match = stories.find((story) => story.id === id);

  if (match) {
    const newStories = stories.filter((story) => story.id !== id);
    await saveDB({ stories: newStories });
    return id;
  }
};

export const deleteAllStories = async () => await saveDB({ stories: [] });
