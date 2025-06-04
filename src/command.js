import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  newStory,
  getAllStories,
  findStory,
  deleteStory,
  deleteAllStories,
} from "./stories.js";
import { start } from "./server.js";

const listStories = (stories) => {
  stories.forEach((story) => {
    console.log("\n");
    console.log("Date Created: ", new Date(story.id).toLocaleString());
    console.log("ID:", story.id);
    console.log("Story Tags:", story.tags || [].join(","));
    console.log("Story Content: ", `"${story.content}"`);
  });
};

yargs(hideBin(process.argv))
  .command(
    "new <story>",
    "create a new story",
    (yargs) => {
      return yargs.positional("story", {
        describe: "The content of the story you want to write",
        type: "string",
      });
    },
    async (argv) => {
      const tags = argv.tags ? argv.tags.split(",") : [];
      const story = await newStory(argv.story, tags);
      console.log("Story Added Successfully", story);
    }
  )
  .option("tags", {
    alias: "t",
    type: "string",
    description: "tags to add to your story",
  })
  .command(
    "all",
    "get all stories",
    () => {},
    async (argv) => {
      const stories = await getAllStories();
      listStories(stories);
    }
  )
  .command(
    "find <id>",
    "get matching story",
    (yargs) => {
      return yargs.positional("id", {
        describe: "The ID of the story you want to find",
        type: "number",
      });
    },
    async (argv) => {
      const targetStory = await findStory(argv.id);
      listStories(targetStory);
    }
  )
  .command(
    "delete <id>",
    "delete a story by ID",
    (yargs) => {
      return yargs.positional("id", {
        describe: "The ID of the story you want to delete",
        type: "number",
      });
    },
    async (argv) => {
      const targetStory = await deleteStory(argv.id);
      console.log(
        targetStory ? "Story Delete Successfully" : "Story Not Found"
      );
    }
  )
  .command(
    "clean",
    "delete all stories from DB",
    () => {},
    async (argv) => {
      await deleteAllStories();
      console.log("All stories have been deleted.");
    }
  )
  .command(
    "web [port]",
    "launch the browser to show the stories",
    (yargs) => {
      return yargs.positional("port", {
        describe: "port to make the website live",
        default: 8000,
        type: "number",
      });
    },
    async (argv) => {
      const stories = await getAllStories();
      start(stories, argv.port);
    }
  )
  .demandCommand(1)
  .parse();
